import { Injectable } from '@nestjs/common';
import { CreateBoardRequestDto } from './dto/board-create-request.dto';
import { BoardMapper } from './mapper/board.mapper';
import { Repository } from 'typeorm';
import { Board } from './entity/board.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entity/user.entity';
import { NotFoundUserException } from '../user/userException/NotFoundUserException';
import { NotFoundBoardException } from './boardException/NotFoundBoardException';
import { Comment } from '../comment/entity/comment.entity';
import { BoardPaginationRequestDto } from './dto/board-pagination-request.dto';
import { S3Service } from '../../config/s3/s3.service';
import { RedisService } from '../../config/redis/redis.service';
@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,

    private readonly boardMapper: BoardMapper,

    private readonly s3Service: S3Service,

    private readonly redisService: RedisService
  ) {}

  async createBoard(
    createBoardRequestDto: CreateBoardRequestDto,
    image: Express.Multer.File,
  ): Promise<Board> {
    const creator = await this.userRepository.findOne({
      where: { id: createBoardRequestDto.creatorId },
    });
    if (!creator) {
      throw new NotFoundUserException();
    }
    const newBoardEntity = this.boardMapper.DtoToEntity(
      createBoardRequestDto,
      creator,
    );
    const imageUrl = await this.s3Service.uploadImage(image);
    newBoardEntity.imageUrl = imageUrl;
    return await this.boardRepository.save(newBoardEntity);
  }

  async getBoardDetail(
    boardId: number,
  ): Promise<{ board: Board; comments: Comment[]; totalComments: number }> {
    const board = await this.boardRepository
      .createQueryBuilder('board')
      .leftJoin('board.creator', 'user')
      .leftJoin('user.province', 'province')
      .leftJoin('user.city', 'city')
      .where('board.id = :id', { id: boardId })
      .select([
        'board.id',
        'board.stuffName',
        'board.stuffContent',
        'board.stuffPrice',
        'board.stuffCategory',
        'board.imageUrl',
        'board.createAt',
        'board.likesCount',
        'user.id',
        'user.nickname',
        'province.name',
        'city.name',
      ])
      .getOne();

    if (!board) {
      throw new NotFoundBoardException();
    }
    const [comments, totalComments] = await this.commentRepository
      .createQueryBuilder('comment')
      .leftJoin('comment.creator', 'user')
      .select([
        'comment.id',
        'comment.price',
        'comment.openChatUrl',
        'comment.createAt',
        'user.nickname',
      ])
      .where('comment.board.id = :id', { id: boardId })
      .orderBy('comment.createAt', 'DESC')
      .limit(6)
      .getManyAndCount();

    return {
      board,
      comments,
      totalComments,
    };
  }

  async getAllBoard(
    boardPaginationRequestDto: BoardPaginationRequestDto,
  ): Promise<{ boards: Board[]; totalPages: number }> {
    const {
      titleSearch,
      provinceName,
      cityName,
      stuffCategory,
      limit,
      offset,
    } = boardPaginationRequestDto;
    const query = this.boardRepository
      .createQueryBuilder('board')
      .leftJoin('board.creator', 'user')
      .leftJoin('user.province', 'province')
      .leftJoin('user.city', 'city')
      .select([
        'board.id',
        'board.stuffName',
        'board.stuffContent',
        'board.stuffPrice',
        'board.stuffCategory',
        'board.imageUrl',
        'board.createAt',
        'user.id',
        'province.name',
        'city.name',
      ])
      .where('board.deleteAt IS NULL');

    if (titleSearch) {
      query.andWhere('board.stuffName LIKE :search', {
        search: `${titleSearch}%`,
      });
    }

    if (provinceName) {
      query.andWhere('province.name = :provinceName', { provinceName });
    }

    if (cityName) {
      query.andWhere('city.name = :cityName', { cityName });
    }

    if (stuffCategory) {
      query.andWhere('board.stuffCategory = :stuffCategory', { stuffCategory });
    }

    query
      .orderBy('board.createAt', 'DESC')
      .addOrderBy('board.id', 'ASC')
      .offset(offset)
      .limit(limit);

    const [boards, totalBoards] = await query.getManyAndCount();
    const totalPages = Math.ceil(totalBoards / limit);

    return {
      boards,
      totalPages,
    };
  }

  async updateBoardLikes(boardId: number, userId: number): Promise<Board>{
    const isBoardExist = await this.boardRepository.findOne({where: {id: boardId}});
    if(!isBoardExist){
      throw new NotFoundBoardException();
    }
    const isUserExist = await this.userRepository.findOne({where:{id: userId}});
    if(!isUserExist){
      throw new NotFoundUserException();
    }

    //게시물 좋아요 key, 유저가 해당 게시물에 좋아요 여부 key생성 -> redis가 게시물의 좋아요와 유저의 중복체크를 확인해줌
    const redisBoardKey = 'Board:' + boardId.toString(); 
    const redisUserKey = 'User:' + userId.toString();

    // 해당 게시물key에 사용자가 좋아요 눌렀는 지 판별
    const isUserLiked = await this.redisService.isUserIncludeSet(redisUserKey, boardId.toString());

    // 좋아요를 누르지 않았다면 -> 좋아요+1 후 게시물key에 add
    let boardLikes: number;
    if(!isUserLiked){
      boardLikes = await this.redisService.boardLikesInc(redisBoardKey);
      await this.redisService.addUserLikesSet(redisUserKey, boardId.toString());
    // 좋아요를 눌렀다면 -> 좋아요-1 후 게시물 key에 remove
    }else{
      boardLikes = await this.redisService.boardLikesDec(redisBoardKey);
      await this.redisService.removeUserLikesSet(redisUserKey, boardId.toString());
    }
    // 데이터베이스에 반영
    isBoardExist.likesCount = boardLikes;
    await this.boardRepository.save(isBoardExist);
    return isBoardExist;





    // // 게시물 좋아요 key의 value를 확인해 value가 있으면 그냥 반환, 없으면 0해줌
    // let boardLikesValue = await this.redisService.getValues(redisBoardKey); // boardLikesValue는 string임
    // if(boardLikesValue === null){
    //   await this.redisService.setValues(redisBoardKey, '0');
    //   boardLikesValue = '0';
    // }
    // // 해당 유저가 게시물에 좋아요를 누른 list 가져오기
    // const userBoardLikes = await this.redisService.getValuesList(redisUserKey);
    // let boardLikes = parseInt(boardLikesValue); // Int로 변환
    // if(!userBoardLikes.includes(boardId.toString())){ // 해당 유저가 해당 게시물에 좋아요를 누르지 않았다면
    //   boardLikes++; // 좋아요 카운트 증가
    //   await this.redisService.setValuesList(redisUserKey, boardId.toString()); // 해당 유저가 게시물에 좋아요를 눌렀음을 알려주도록 set
    // }else{ // 해당 유저가 게시물에 좋아요를 눌렀다면
    //   boardLikes--; // 좋아요 카운트 감소
    //   await this.redisService.deleteValuesList(redisUserKey, boardId.toString()); // 해당 유저가 게시물에서 좋아요를 해제함을 알려주도록 set
    // }
    // // 게시물 좋아요 key에 좋아요 카운트를 반영
    // await this.redisService.setValues(redisBoardKey, boardLikes.toString());
    // // db에 좋아요카운트 업데이트
    // isBoardExist.likesCount = boardLikes;
    // await this.boardRepository.save(isBoardExist);
    // return isBoardExist;
  }
}
