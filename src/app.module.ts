import { Module } from '@nestjs/common';

import { UserModule } from './modules/user/user.module';
import { MysqlModule } from './config/mysql/mysql.module';
import { BoardModule } from './modules/board/board.module';
import { CommentModule } from './modules/comment/comment.module';
import { RedisModule } from './config/redis/redis.module';


@Module({
  imports: [
    UserModule,
    BoardModule,
    CommentModule,
    MysqlModule,
    RedisModule
  ],
})
export class AppModule {}
