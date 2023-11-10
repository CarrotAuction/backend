import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { MysqlModule } from './config/mysql/mysql.module';
import { BoardModule } from './modules/board/board.module';
import { CommentModule } from './modules/comment/comment.module';

@Module({
  imports: [
    UserModule,
    MysqlModule,
    BoardModule,
    CommentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
