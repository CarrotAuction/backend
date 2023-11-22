import { IsEnum, IsNumber, IsString } from 'class-validator';
import { StuffCategory } from '../enums/stuffCategory.enum';
import { Type } from 'class-transformer';

export class CreateBoardRequestDto {
  @IsString()
  stuffName: string;

  @IsString()
  stuffContent: string;

  @IsNumber()
  @Type(() => Number)
  stuffPrice: number;

  @IsEnum(StuffCategory)
  stuffCategory: StuffCategory;

  @IsNumber()
  @Type(() => Number)
  creatorId: number;

  image: Express.Multer.File;
}
