import { StuffCategory } from "../../enums/stuffCategory.enum";

export class CreateBoardResponseDto {

    stuffName: string;
    stuffContent: string;
    stuffPrice: number;
    stuffCategory: StuffCategory;
}