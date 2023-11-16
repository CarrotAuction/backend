import { Type } from "class-transformer";
import { IsInt, IsNumber } from "class-validator";

export class CommentPaginationRequestDto{
    
    @IsInt()
    @Type(() => Number)
    boardId: number;

    @IsInt()
    @Type(() => Number)
    cursor: number;

    @IsInt()
    @Type(() => Number)
    limit?: number = 6;
}