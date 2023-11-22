import { Injectable, Inject } from '@nestjs/common';
import * as AWS from 'aws-sdk';

@Injectable()
export class S3Service {
  private s3: AWS.S3;
  private s3_bucket: string;

  constructor(
    @Inject('AWS_CONFIG')
    private readonly awsConfig: {
      accessKeyId: string;
      secretAccessKey: string;
      region: string;
      s3Bucket: string;
    },
  ) {
    // AWS S3 버킷 설정
    this.s3 = new AWS.S3({
      accessKeyId: awsConfig.accessKeyId,
      secretAccessKey: awsConfig.secretAccessKey,
      region: awsConfig.region,
    });
    this.s3_bucket = awsConfig.s3Bucket;
  }

  async uploadImage(file: Express.Multer.File): Promise<string> {
    try {
      const { originalname, buffer, mimetype } = file;

      // 파라미터 설정
      const params = {
        Bucket: this.s3_bucket,
        Key: String(originalname),
        Body: buffer,
        ContentType: mimetype,
        ContentDisposition: 'inline',
      };

      // S3 버킷에 이미지를 업로드한 후 이미지 URL 반환
      const s3Response = await this.s3.upload(params).promise();
      return s3Response.Location;
    } catch (error) {
      console.error(error);
      throw new Error('Image upload failed');
    }
  }
}
