import { IsArray } from "class-validator";
import { PageMetaDto } from "./page-meta.dto";
export class PaginationResponseDto<T> {
    @IsArray()
    data: T[];

    meta: PageMetaDto;

    constructor(data: T[], meta: PageMetaDto){
        this.data = data;
        this.meta = meta;
    }

}