import { Body, Controller, Get, HttpStatus, Post, Query, Res } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentMapper } from './mapper/comment.mapper';
import { ApiOperation } from '@nestjs/swagger';
import { CreateCommentRequestDto } from './dto/comment-create-request.dto';
import { Response } from 'express';
import { CommentPaginationRequestDto } from './dto/commet-pagination-request.dto';

@Controller('comments')
export class CommentController {
    
    constructor(
        private readonly commentService: CommentService,
        private readonly commentMapper: CommentMapper
    ) {}

    @ApiOperation({summary: '사용자는 댓글을 등록할 수 있다.'})
    @Post()
    async createComment(
        @Body() createCommentRequestDto: CreateCommentRequestDto,
        @Res() res: Response
    ): Promise<void>{
        const newComment = await this.commentService.createComment(createCommentRequestDto);
        const response = this.commentMapper.entityToDto(newComment);
        res.status(HttpStatus.CREATED).json(response);
    }

    @ApiOperation({summary: '해당 게시글의 댓글들을 조회한다.'})
    @Get()
    async getAllComment(
        @Query() commentPaginationRequestDto: CommentPaginationRequestDto,
        @Res() res: Response
    ): Promise<void>{
        const response = await this.commentService.getAllComment(commentPaginationRequestDto);
        res.status(HttpStatus.OK).json(response);
    }
}
