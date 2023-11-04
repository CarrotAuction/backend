import { Injectable } from '@nestjs/common';
import { CreateBoardRequestDto } from './dto/board-create-request.dto';
import { BoardMapper } from './mapper/board.mapper';
import { Repository } from 'typeorm';
import { Board } from './entity/board.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BoardService {

    constructor(
        @InjectRepository(Board)
        private readonly boardRepository: Repository<Board>,
        private readonly boardMapper: BoardMapper
    ) {}
    
    async createBoard(createBoardRequestDto: CreateBoardRequestDto): Promise<Board> {

        const newBoardEntity = this.boardMapper.DtoToEntity(createBoardRequestDto);
        return await this.boardRepository.save(newBoardEntity);
    }
}
