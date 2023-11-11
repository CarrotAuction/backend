import { Module } from '@nestjs/common';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from './entity/board.entity';
import { BoardMapper } from './mapper/board.mapper';
import { User } from '../user/entity/user.entity';
import { BoardRepository } from './repository/boardRepository';
import { Comment } from '../comment/entity/comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Board, User, Comment])],
  controllers: [BoardController],
  providers: [BoardService, BoardMapper, BoardRepository]
})
export class BoardModule {}