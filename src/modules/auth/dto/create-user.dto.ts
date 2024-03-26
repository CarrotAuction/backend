import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmptyAndString } from "../../../decorators/is-Not-Empty-And-String.decorator";
import { AuthCredentialsDto } from "./auth-credentials.dto";
import { RegionDto } from "../../region/dto/region.dto";
import { ValidateNested } from "class-validator";
import { Type } from "class-transformer";

export class CreateUserDto extends AuthCredentialsDto{

    @ApiProperty({type: String, description: '사용자 닉네임', required: true, example: '야망있는최필규'})
    @IsNotEmptyAndString(1, 15)
    nickname!: string;

    @ApiProperty({type: () => RegionDto, description: '사용자가 거주하는 지역 정보', required: true})
    @Type(() => RegionDto)
    @ValidateNested()
    region!: RegionDto;

}