import { Type } from "class-transformer";
import { IsInt, IsOptional} from "class-validator";

export class BoardPaginationReqestDto{

    @IsOptional()
    @IsInt()
    @Type(() => Number)
    page: number = 1;

    @IsOptional()
    @IsInt()
    @Type(() => Number)
    limit: number = 6;

    get offset(): number {
        return (this.page-1)*this.limit;
    }

}