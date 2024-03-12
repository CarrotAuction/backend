import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmptyAndString } from "../../../decorators/is-Not-Empty-And-String.decorator";
import { AuthCredentialsDto } from "./auth-credentials.dto";

export class CreateUserDto extends AuthCredentialsDto{

    @ApiProperty({type: String, description: '사용자 닉네임', required: true, example: '야망있는최필규'})
    @IsNotEmptyAndString(1, 15)
    nickname!: string;

    @ApiProperty({type: String, description: '사용자가 거주하는 행정구역', required: true, example: '서울특별시'})
    @IsNotEmptyAndString()
    province!: string;

    @ApiProperty({type: String, description: '사용자 거주하는 시/군/구', required: true, example: '강남구'})
    @IsNotEmptyAndString()
    city!: string;
}