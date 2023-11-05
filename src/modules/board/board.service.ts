import { Injectable } from '@nestjs/common';
import { CreateBoardRequestDto } from './dto/board-create-request.dto';
import { BoardMapper } from './mapper/board.mapper';
import { Repository } from 'typeorm';
import { Board } from './entity/board.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entity/user.entity';
import { NotFoundUserException } from '../user/userException/NotFoundUserException';

@Injectable()
export class BoardService {

    constructor(
        @InjectRepository(Board)
        private readonly boardRepository: Repository<Board>,

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
}
