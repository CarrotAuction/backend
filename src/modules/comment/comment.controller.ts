import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentMapper } from './mapper/comment.mapper';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateCommentRequestDto } from './dto/comment-create-request.dto';
import { Response } from 'express';
import { CommentPaginationRequestDto } from './dto/commet-pagination-request.dto';

@ApiTags('comments')
@Controller('comments')
export class CommentController {
  constructor(
    private readonly commentService: CommentService,
    private readonly commentMapper: CommentMapper,
  ) {}

  @ApiOperation({
    summary: '댓글 등록 API',
  })
  @ApiResponse({
    status: 201,
    description: '댓글 등록 성공',
  })
  @Post()
  async createComment(
    @Body() createCommentRequestDto: CreateCommentRequestDto,
    @Res() res: Response,
  ): Promise<void> {
    const newComment = await this.commentService.createComment(
      createCommentRequestDto,
    );
    const response = this.commentMapper.entityToDto(newComment);
    res.status(HttpStatus.CREATED).json(response);
  }

  @ApiOperation({
    summary: '댓글 조회 API',
  })
  @ApiResponse({
    status: 200,
    description: '댓글 조회 성공',
  })
  @Get()
  async getAllComment(
    @Query() commentPaginationRequestDto: CommentPaginationRequestDto,
    @Res() res: Response,
  ): Promise<void> {
    const response = await this.commentService.getAllComment(
      commentPaginationRequestDto,
    );
    res.status(HttpStatus.OK).json(response);
  }
}
