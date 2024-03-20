import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmptyAndString } from "../../../decorators/is-Not-Empty-And-String.decorator";

export class RegionDto{

    @ApiProperty({ example: '강남구', description: '사용자가 거주하는 구/군의 상위 지역 정보' })
    @IsNotEmptyAndString()
    parentRegionName!: string;

    @ApiProperty({ example: '역삼동', description: '사용자가 거주하는 구/군' })
    @IsNotEmptyAndString()
    RegionName!: string;
}