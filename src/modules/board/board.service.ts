import { Injectable } from '@nestjs/common';
import { CreateBoardRequestDto } from './dto/board-create-request.dto';
import { Repository } from 'typeorm';
import { Board } from './entity/board.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entity/user.entity';
import { NotFoundUserException } from '../auth/authException/NotFoundUserException';
import { NotFoundBoardException } from './boardException/NotFoundBoardException';
import { Comment } from '../comment/entity/comment.entity';
import { BoardPaginationRequestDto } from './dto/board-pagination-request.dto';
import { S3Service } from '../../config/s3/s3.service';
import { RedisService } from '../../config/redis/redis.service';
import { BoardMapper } from './mapper/board.mapper';
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
    id: number,
    image: Express.Multer.File,
  ): Promise<Board> {

    const creator = await this.userRepository.findOneBy({id});
    const imageUrl = await this.s3Service.uploadImage(image);
    const newBoard = this.boardMapper.DtoToEntity(creator, imageUrl, createBoardRequestDto);

    return await this.boardRepository.save(newBoard);
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

  async updateBoardLikes(boardId: number, userId: number): Promise<{board: Board; isUserChecked: Boolean}>{
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
    let isUserChecked: boolean;
    if(!isUserLiked){
      boardLikes = await this.redisService.boardLikesInc(redisBoardKey);
      await this.redisService.addUserLikesSet(redisUserKey, boardId.toString());
      isUserChecked = true;
    // 좋아요를 눌렀다면 -> 좋아요-1 후 게시물 key에 remove
    }else{
      boardLikes = await this.redisService.boardLikesDec(redisBoardKey);
      await this.redisService.removeUserLikesSet(redisUserKey, boardId.toString());
      isUserChecked = false;
    }
    // 데이터베이스에 반영
    isBoardExist.likesCount = boardLikes;
    await this.boardRepository.save(isBoardExist);
    return {board:isBoardExist, isUserChecked};
  }
}
