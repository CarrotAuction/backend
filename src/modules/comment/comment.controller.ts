import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentMapper } from './mapper/comment.mapper';
import { ApiOperation } from '@nestjs/swagger';
import { CreateCommentRequestDto } from './dto/comment-create-request.dto';
import { Response } from 'express';

@Controller('comment')
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
}
