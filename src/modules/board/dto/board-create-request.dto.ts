import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { StuffCategory } from '../../../types/enums/stuffCategory.enum';
import { Type } from 'class-transformer';

export class CreateBoardRequestDto {
  @IsString()
  @IsNotEmpty()
  stuffName: string;

  @IsString()
  @IsNotEmpty()
  stuffContent: string;

  @IsNumber()
  @Type(() => Number)
  stuffPrice: number;

  @IsEnum(StuffCategory)
  @IsNotEmpty()
  stuffCategory: StuffCategory;

  @IsNotEmpty()
  @IsString()
  detailAdress: string;

  image: Express.Multer.File;
}