import { IsEnum, IsNumber, IsString } from "class-validator";
import { StuffCategory } from "../enums/stuffCategory.enum";

export class CreateBoardRequestDto {

    @IsString()
    stuffName: string;

    @IsString()
    stuffContent: string;

    @IsNumber()
    stuffPrice: number;

    @IsEnum(StuffCategory)
    stuffCategory: StuffCategory;

    @IsNumber()
    creatorId: number;
}