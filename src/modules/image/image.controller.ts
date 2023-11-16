import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ImageService } from './image.service';
import { ImageMapper } from './mapper/image.mapper';
import { ImageResponseDto } from './dto/image-response.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('image')
@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @ApiOperation({ summary: '이미지를 업로드한다.' })
  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ): Promise<void> {
    const response: ImageResponseDto =
      await this.imageService.uploadImage(file);
    res.status(HttpStatus.OK).send(response);
  }
}
