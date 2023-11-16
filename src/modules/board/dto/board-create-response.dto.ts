import { StuffCategory } from "../../comment/enums/stuffCategory.enum";

export class CreateBoardResponseDto {

    stuffName: string;
    stuffContent: string;
    stuffPrice: number;
    stuffCategory: StuffCategory;
    creatorId: number;
}