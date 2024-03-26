import { applyDecorators } from "@nestjs/common";
import { Type } from "class-transformer";
import { IsInt, IsNumber, IsOptional } from "class-validator";

export function IsOptionalAndNumber(type: 'int' | 'number' = 'number') {
    return applyDecorators(
        IsOptional(),
        type === 'number'? IsNumber() : IsInt(),
        Type(() => Number)
    );
}