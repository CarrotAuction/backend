import { Injectable } from '@nestjs/common';
import { CreateBoardRequestDto } from './dto/board-create-request.dto';
import { BoardMapper } from './mapper/board.mapper';
import { Repository } from 'typeorm';
import { Board } from './entity/board.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entity/user.entity';
import { NotFoundUserException } from '../user/userException/NotFoundUserException';
import { StuffCategory } from '../enums/stuffCategory.enum';

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


    async getBoardDetail(boardId: number): Promise<Board>{
        return await this.boardRepository.createQueryBuilder('board')
                .leftJoin('board.creator', 'user')
                .leftJoin('user.province', 'province')
                .leftJoin('user.city', 'city')
                .select([
                    'board.id',
                    'board.stuffName',
                    'board.stuffContent',
                    'board.stuffPrice',
                    'board.stuffCategory',
                    'user.nickname',
                    'province.name',
                    'city.name'
                ])
                .where('board.id =:id', {id: boardId})
                .getOne();
    }

    async getAllBoard(): Promise<Board[]>{
        return await this.boardRepository.createQueryBuilder('board')
                .leftJoin('board.creator', 'user')
                .leftJoin('user.province', 'province')
                .leftJoin('user.city', 'city')
                .select([
                    'board.id',
                    'board.stuffName',
                    'board.stuffContent',
                    'board.stuffPrice',
                    'board.stuffCategory',
                    'board.createAt',
                    'user.id',
                    'province.name',
                    'city.name'
                ])
                .orderBy('board.createAt', 'DESC')
                .addOrderBy('board.id', 'ASC')
                .getMany();         
    }


}
