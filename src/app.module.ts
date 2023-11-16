import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { MysqlModule } from './config/mysql/mysql.module';
import { BoardModule } from './modules/board/board.module';
import { ImageModule } from './modules/image/image.module';

@Module({
  imports: [UserModule, MysqlModule, BoardModule, ImageModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
