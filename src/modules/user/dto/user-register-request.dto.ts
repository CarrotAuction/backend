import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RegisterUserRequestDto {
  @ApiProperty({
    example: 'userpw123',
    description: '사용자 비밀번호',
  })
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    example: '당근마켓고인물',
    description: '사용자 닉네임',
  })
  @IsNotEmpty()
  nickname: string;

  @ApiProperty({
    example: 'userid123',
    description: '사용자 아이디',
  })
  @IsNotEmpty()
  accountID: string;

  @ApiProperty({
    example: '서울특별시',
    description: '사용자가 거주하는 행정구역',
  })
  @IsNotEmpty()
  province: string;

  @ApiProperty({
    example: '강남구',
    description: '사용자가 거주하는 시/군/구',
  })
  @IsNotEmpty()
  city: string;
}
