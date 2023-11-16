import { IsObject } from 'class-validator';

export class ImageUploadDto {
  @IsObject()
  file: Express.Multer.File;
}
