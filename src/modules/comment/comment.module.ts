import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entity/user.entity';
import { Board } from '../board/entity/board.entity';
import { CommentMapper } from './mapper/comment.mapper';
import { Comment } from './entity/comment.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Comment, Board, User])],
  providers: [CommentService, CommentMapper],
  controllers: [CommentController]
})
export class CommentModule {}
