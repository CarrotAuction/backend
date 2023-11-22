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
}
