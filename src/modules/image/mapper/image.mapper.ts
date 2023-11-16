import { Injectable } from '@nestjs/common';
import { ImageUploadDto } from '../dto/image-upload.dto';
import { Image } from '../entity/image.entity';
import { ImageResponseDto } from '../dto/image-response.dto';

@Injectable()
export class ImageMapper {
  DtoToEntity(imageUploadDto: ImageUploadDto): Image {
    const { file } = imageUploadDto;
    const { originalname, buffer, mimetype } = file;

    const image = new Image();
    image.imageUrl = originalname;
    image.buffer = buffer;
    image.mimetype = mimetype;

    return image;
  }

  EntityToDto(image: Image): ImageResponseDto {
    return {
      imageUrl: image.imageUrl,
    };
  }
}
