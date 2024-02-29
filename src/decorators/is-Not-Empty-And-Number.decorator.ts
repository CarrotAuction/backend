import { applyDecorators } from "@nestjs/common";
import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, IsNumber } from "class-validator";

export function IsNotEmptyAndNumber(type: 'int' | 'number' = 'number') {
    return applyDecorators(
        IsNotEmpty(),
        type === 'number'? IsNumber() : IsInt(),
        Type(() => Number)
    );
}