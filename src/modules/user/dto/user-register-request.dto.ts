import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class RegisterUserRequestDto {

    @ApiProperty({description: '사용자 비밀번호', example: 'asdfg'})
    @IsNotEmpty()
    password: string;

    @ApiProperty({description: '사용자 닉네임', example: '당근마켓하잉'})
    @IsNotEmpty()
    nickname: string;

    @ApiProperty({description: '사용자 이메일', example: 'asdfg@gmail.com'})
    @IsNotEmpty()
    email: string;

    @ApiProperty({description: '사용자 거주 지역', example: '서울특별시 강남구'})
    @IsNotEmpty()
    location: string;
}