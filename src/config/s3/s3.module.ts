import { Module, Global } from '@nestjs/common';
import { S3Service } from './s3.service';

@Global()
@Module({
  providers: [
    S3Service,
    {
      provide: 'AWS_CONFIG',
      useValue: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: 'ap-northeast-2',
        s3Bucket: process.env.AWS_S3_BUCKET_NAME,
      },
    },
  ],
  exports: [S3Service],
})
export class S3Module {}
