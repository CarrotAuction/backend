import { Injectable } from '@nestjs/common';
import { CreateBoardRequestDto } from './dto/board-create-request.dto';
import { BoardMapper } from './mapper/board.mapper';
import { Repository } from 'typeorm';
import { Board } from './entity/board.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entity/user.entity';
import { NotFoundUserException } from '../user/userException/NotFoundUserException';
import { BoardPaginationReqestDto } from './dto/board-pagination-request.dto';
import { BoardRepository } from './repository/boardRepository';
import { NotFoundBoardException } from './boardException/NotFoundBoardException';

@Injectable()
export class BoardService {

    constructor(
        private readonly boardRepository: BoardRepository,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        private readonly boardMapper: BoardMapper
    ) {}


    async createBoard(createBoardRequestDto: CreateBoardRequestDto): Promise<Board> {
        const creator = await this.userRepository.findOne({where: {id: createBoardRequestDto.creatorId}});
        if(!creator){
            throw new NotFoundUserException();
        }
        const newBoardEntity = this.boardMapper.DtoToEntity(createBoardRequestDto, creator);
        return await this.boardRepository.save(newBoardEntity);
    }


    async getBoardDetail(boardId: number): Promise<Board> {
        const Board = await this.boardRepository.findBoard(boardId);
        if(!Board){
            throw new NotFoundBoardException();
        }
        return await this.boardRepository.findBoardById(boardId);
    }


    async getAllBoard(boardPaginationRequestDto: BoardPaginationReqestDto): Promise<[Board[], number]> {
        return await this.boardRepository.findAllBoard(boardPaginationRequestDto);        
    }
}
