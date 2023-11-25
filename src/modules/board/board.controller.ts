import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { BoardService } from './board.service';
import { CreateBoardRequestDto } from './dto/board-create-request.dto';
import { ApiOperation, ApiTags, ApiBody, ApiResponse } from '@nestjs/swagger';
import { BoardMapper } from './mapper/board.mapper';
import { BoardPaginationRequestDto } from './dto/board-pagination-request.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('board')
@Controller('boards')
export class BoardController {
  constructor(
    private readonly boardService: BoardService,
    private readonly boardMapper: BoardMapper,
  ) {}

  @ApiOperation({
    summary: '게시글 생성 API',
  })
  @ApiResponse({
    status: 201,
    description: '게시글 생성 성공',
  })
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async createBoard(
    @Body() createBoardReuqestDto: CreateBoardRequestDto,
    @UploadedFile() image: Express.Multer.File,
    @Res() res: Response,
  ): Promise<void> {
    const newBoard = await this.boardService.createBoard(
      createBoardReuqestDto,
      image,
    );
    const response = this.boardMapper.EntityToDto(newBoard);
    res.status(HttpStatus.CREATED).json(response);
  }

  @ApiOperation({
    summary: '게시글 전체 조회 API',
  })
  @ApiResponse({
    status: 201,
    description: '게시글 전체 조회 성공',
  })
  @Get()
  async getAllBoard(
    @Query() boardPaginationRequestDto: BoardPaginationRequestDto,
    @Res() res: Response,
  ): Promise<void> {
    const response = await this.boardService.getAllBoard(
      boardPaginationRequestDto,
    );
    res.status(HttpStatus.OK).json(response);
  }

  @ApiOperation({
    summary: '게시글 상세 조회 API',
  })
  @ApiResponse({
    status: 201,
    description: '게시글 상세 조회 성공',
  })
  @Get('/:id')
  async getBoard(@Param('id') id: number, @Res() res: Response): Promise<void> {
    const response = await this.boardService.getBoardDetail(id);
    res.status(HttpStatus.OK).json(response);
  }
}
