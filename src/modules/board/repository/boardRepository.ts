import { DataSource, Repository } from "typeorm";
import { Board } from "../entity/board.entity";
import { Injectable } from "@nestjs/common";
import { BoardPaginationReqestDto } from "../dto/board-pagination-request.dto";

@Injectable()
export class BoardRepository extends Repository<Board> {

    constructor(dataSource: DataSource){
        super(Board, dataSource.createEntityManager());
    }

    async findBoard(boardId: number): Promise<Board> {
        return await this.findOne({where: {id: boardId}});
    }

    
    async findBoardById(boardId: number): Promise<Board> { 
        return await this.createQueryBuilder('board')
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


    async findAllBoard(boardPaginationRequestDto: BoardPaginationReqestDto): Promise<[Board[], number]> {
        const {titleSearch, provinceName, cityName, stuffCategory, limit, offset} = boardPaginationRequestDto;
        const query = this.createQueryBuilder('board')
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