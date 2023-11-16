import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { ImageUploadDto } from './dto/image-upload.dto';
import { ImageResponseDto } from './dto/image-response.dto';
import { ImageUploadFailedException } from './imageException/ImageUploadFailedException';
import { ImageMapper } from './mapper/image.mapper';

@Injectable()
export class ImageService {
  private s3: AWS.S3;
  private s3_bucket: string;

  constructor(private readonly imageMapper: ImageMapper) {
    // AWS S3 버킷 설정
    this.s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: 'ap-northeast-2',
    });
    this.s3_bucket = process.env.AWS_S3_BUCKET_NAME;
  }

  async uploadImage(file: Express.Multer.File): Promise<ImageResponseDto> {
    try {
      const { originalname, buffer, mimetype } = file;

      // 파라미터 설정
      const params = {
        Bucket: this.s3_bucket,
        Key: String(originalname),
        Body: buffer, // buffer를 직접 전달
        ContentType: mimetype,
        ContentDisposition: 'inline',
      };

      // S3 버킷에 이미지를 업로드한 후 응답을 받음
      const s3Response = await this.s3.upload(params).promise();

      // 이미지 업로드 성공하면 ImageResponseDto 인스턴스 반환
      if (s3Response.Location) {
        const responseDto: ImageResponseDto = {
          imageUrl: s3Response.Location,
        };
        return responseDto;
      } else {
        throw new ImageUploadFailedException();
      }
    } catch (error) {
      console.error(error);
      throw new ImageUploadFailedException();
    }
  }
}
