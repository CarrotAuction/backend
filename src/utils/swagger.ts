// import { INestApplication } from '@nestjs/common';
// import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

// export function setupSwagger(app: INestApplication): void {
//   const options = new DocumentBuilder()
//     .setTitle('Techeer Auction')
//     .setDescription('중고 경매 사이트')
//     .setVersion('1.0.0')
//     .addBearerAuth(
//       {
//         type: 'http',
//         scheme: 'bearer',
//         name: 'JWT',
//         description: 'Enter JWT token',
//         in: 'header',
//       },
//       'token',
//     )
//     .build();
//   const document = SwaggerModule.createDocument(app, options);
//   SwaggerModule.setup('api', app, document);
// }
