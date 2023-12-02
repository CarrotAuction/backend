import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { StuffCategory } from '../enums/stuffCategory.enum';
import { ApiProperty } from '@nestjs/swagger';
export class BoardPaginationRequestDto {
  @ApiProperty({
    example: 1,
    description: '조회할 페이지 번호',
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  page?: number = 1;

  @ApiProperty({
    example: 10,
    description: '페이지당 항목 수',
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  limit?: number = 6;

  @ApiProperty({
    example: '맥북',
    description: '검색할 제목 키워드',
    required: false,
  })
  @IsOptional()
  @IsString()
  titleSearch?: string;

  @ApiProperty({
    example: '가전디지털',
    description: '필터링할 카테고리',
    required: false,
  })
  @IsOptional()
  @IsEnum(StuffCategory)
  stuffCategory?: StuffCategory;

  @ApiProperty({
    example: '서울',
    description: '검색할 지역의 행정구역 이름',
    required: false,
  })
  @IsOptional()
  @IsString()
  provinceName?: string;

  @ApiProperty({
    example: '강남구',
    description: '검색할 지역의 시/군/구 이름',
    required: false,
  })
  @IsOptional()
  @IsString()
  cityName?: string;

  get offset(): number {
    return (this.page - 1) * this.limit;
  }
}
