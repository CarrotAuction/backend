import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { StuffCategory } from '../../../types/enums/stuffCategory.enum';
import { Type } from 'class-transformer';

export class CreateBoardDto {
  @IsString()
  @IsNotEmpty()
  stuffName: string;

  @IsString()
  @IsNotEmpty()
  stuffContent: string;

  @IsNumber()
  @Type(() => Number)
  stuffPrice: number;

  @IsNotEmpty()
  @IsString()
  tradingPlace: string;

  @IsEnum(StuffCategory)
  @IsNotEmpty()
  stuffCategory: StuffCategory;

  image: Express.Multer.File;
}