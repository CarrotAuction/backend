import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({
    example: 'userid123',
    description: '사용자 아이디',
  })
  @IsString()
  @IsNotEmpty()
  accountID: string;

  @ApiProperty({
    example: 'userpw123',
    description: '사용자 비밀번호',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
