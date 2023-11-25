import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { BoardModule } from './modules/board/board.module';
import { CommentModule } from './modules/comment/comment.module';
import { UserModule } from './modules/user/user.module';

async function bootstrap() {
  initializeTransactionalContext();

  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: 'http://localhost:3000',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
    },
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('CarrotAuction API')
    .setDescription('CarrotAuction API 설명서')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig, {
    include: [BoardModule, CommentModule, UserModule],
  });
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
  await app.listen(8080);
}
bootstrap();
