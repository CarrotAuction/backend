import { IsEnum, IsNumber, IsString } from 'class-validator';
import { StuffCategory } from '../enums/stuffCategory.enum';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBoardRequestDto {
  @ApiProperty({
    example: '맥북',
    description: '상품 이름',
  })
  @IsString()
  stuffName: string;

  @ApiProperty({
    example: '맥북은 높은 성능과 효율을 자랑합니다.',
    description: '상품 설명',
  })
  @IsString()
  stuffContent: string;

  @ApiProperty({
    example: 2000000,
    description: '상품 가격',
  })
  @IsNumber()
  @Type(() => Number)
  stuffPrice: number;

  @ApiProperty({
    example: '가전디지털',
    description: '상품 카테고리',
  })
  @IsEnum(StuffCategory)
  stuffCategory: StuffCategory;

  @ApiProperty({
    example: 1,
    description: '게시글을 생성하는 사용자의 ID',
  })
  @IsNumber()
  @Type(() => Number)
  creatorId: number;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: '상품 이미지',
  })
  image: Express.Multer.File;
}
