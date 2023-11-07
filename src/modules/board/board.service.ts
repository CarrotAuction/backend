import { Injectable } from '@nestjs/common';
import { CreateBoardRequestDto } from './dto/board-create-request.dto';
import { BoardMapper } from './mapper/board.mapper';
import { Repository } from 'typeorm';
import { Board } from './entity/board.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entity/user.entity';
import { NotFoundUserException } from '../user/userException/NotFoundUserException';
import { BoardPaginationReqestDto } from './dto/board-pagination-request.dto';

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

    async getAllBoard(boardPaginationRequestDto: BoardPaginationReqestDto): Promise<[Board[], number]>{

        const {titleSearch, provinceName, cityName, stuffCategory, limit, offset} = boardPaginationRequestDto;
        const query = this.boardRepository.createQueryBuilder('board')
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
                .where('board.deleteAt IS NULL');

                if(titleSearch) {
                    query.andWhere('board.stuffName LIKE :search', { search: `%${titleSearch}%` });
                }

                if(provinceName) {
                    query.andWhere('province.name = :provinceName', {provinceName});
                }

                if(cityName) {
                    query.andWhere('city.name = :cityName', {cityName});
                }

                if(stuffCategory) {
                    query.andWhere('board.stuffCategory = :stuffCategory', {stuffCategory});
                }

                query.orderBy('board.createAt', 'DESC')
                    .addOrderBy('board.id', 'ASC')
                    .offset(offset)
                    .limit(limit)

            return await query.getManyAndCount();
            
            }
}
