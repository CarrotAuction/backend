import { applyDecorators } from "@nestjs/common";
import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export function IsNotEmptyAndString(min?: number, max?: number){
    return applyDecorators(
        IsNotEmpty(),
        IsString(),
        ...(min? [MinLength(min)] : []),
        ...(max? [MaxLength(max)] : [])
    );
}