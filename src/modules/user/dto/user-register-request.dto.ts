import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class RegisterUserRequestDto {

    @ApiProperty({description: '사용자 비밀번호', example: 'asdfg'})
    @IsNotEmpty()
    password: string;

    @ApiProperty({description: '사용자 닉네임', example: '당근마켓하잉'})
    @IsNotEmpty()
    nickname: string;

    @ApiProperty({description: '사용자 아이디', example: 'yeye2me'})
    @IsNotEmpty()
    accountID: string;

    @ApiProperty({description: '사용자가 거주하는 행정구역', example: '서울특별시'})
    @IsNotEmpty()
    province: string;

    @ApiProperty({description: '사용자 거주하는 시/군/구', example: '강남구'})
    @IsNotEmpty()
    city: string;
}