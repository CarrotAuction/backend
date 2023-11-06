import { Body, Controller, Get, HttpStatus, Param, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { BoardService } from './board.service';
import { CreateBoardRequestDto } from './dto/board-create-request.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { BoardMapper } from './mapper/board.mapper';

@ApiTags('board')
@Controller('board')
export class BoardController {
    
    constructor(
        private readonly boardService: BoardService,
        private readonly boardMapper: BoardMapper
    ) {}
    
    @ApiOperation({summary: '사용자는 게시글을 생성한다.'})
    @Post()
    async createBoard(
        @Body() createBoardReuqestDto: CreateBoardRequestDto,
        @Res() res: Response
    ): Promise<void>{
        const newBoard = await this.boardService.createBoard(createBoardReuqestDto);
        const response = this.boardMapper.EntityToDto(newBoard);
        res.status(HttpStatus.CREATED).json(response);
    }

    @ApiOperation({summary: '사용자는 상세 게시글을 조회한다.'})
    @Get('/:id')
    async getBoard(
        @Param('id') id: number, 
        @Res() res: Response
    ): Promise<void>{
        const response = await this.boardService.getBoardDetail(id);
        res.status(HttpStatus.OK).json(response);
    }




}
