import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateCommentDto {

    @IsString()
    @IsNotEmpty()
    content: string;

    @IsNumber()
    boardId: number;
}