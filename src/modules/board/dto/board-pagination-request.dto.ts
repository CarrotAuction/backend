// import { Type } from "class-transformer";
// import { IsEnum, IsInt, IsOptional, IsString} from "class-validator";
// import { StuffCategory } from "../../../types/enums/stuffCategory.enum";

// export class BoardPaginationRequestDto{

//     @IsOptional()
//     @IsInt()
//     @Type(() => Number)
//     page?: number = 1;

//     @IsOptional()
//     @IsInt()
//     @Type(() => Number)
//     limit?: number = 6;

//     @IsOptional()
//     @IsString()
//     titleSearch?: string;

//     @IsOptional()
//     @IsEnum(StuffCategory)
//     stuffCategory?: StuffCategory;

//     @IsOptional()
//     @IsString()
//     provinceName?: string;

//     @IsOptional()
//     @IsString()
//     cityName?: string;
    

//     get offset(): number {
//         return (this.page-1)*this.limit;
//     }

// }