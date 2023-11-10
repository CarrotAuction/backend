import { IsNumber, IsString } from "class-validator";

export class CreateCommentRequestDto {

    @IsNumber()
    price: number;

    @IsString()
    openChatUrl: string;

    @IsNumber()
    boardId: number;

    @IsNumber()
    creatorId: number;
}