import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { User } from './entity/user.entity';
import { RegisterUserRequestDto } from './dto/user-register-request.dto';
import { UserService } from './user.service';
import { Response } from 'express';
import { UserMapper } from './mapper/user.mapper';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserResponseDto } from './dto/user-response.dto';
import { LoginUserDto } from './dto/user-login.dto';

@ApiTags('user')
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userMapper: UserMapper,
  ) {}

  @ApiOperation({
    summary: '회원가입 API',
  })
  @ApiResponse({
    status: 200,
    description: '회원가입 성공',
  })
  @Post('/register')
  async registerUser(
    @Body() registerUserRequestDto: RegisterUserRequestDto,
    @Res() res: Response,
  ): Promise<void> {
    const newUser = await this.userService.registerUser(registerUserRequestDto);
    const response = this.userMapper.EntityToDto(newUser);
    res.status(HttpStatus.CREATED).json(response);
  }

  @ApiOperation({
    summary: '로그인 API',
  })
  @ApiResponse({
    status: 200,
    description: '로그인 성공',
  })
  @Post('/login')
  async loginUser(
    @Body() loginUserDto: LoginUserDto,
    @Res() res: Response,
  ): Promise<void> {
    const response = await this.userService.loginUser(loginUserDto);
    res.status(HttpStatus.OK).send(response);
  }
}
