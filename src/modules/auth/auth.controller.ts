import { Body, Controller, HttpCode, Post, UseGuards} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthService} from './auth.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { SignUpUserInterface } from 'src/interfaces/signup-user-interface';
import { AccessToken } from 'src/interfaces/access-token.interface';
import { UserId } from '../../decorators/user-id.decorator';
import { UserLocalAuthGuard } from './guards/user-local.auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {

    constructor(
        private readonly authService: AuthService,
    ){}

    @HttpCode(201)
    @ApiOperation({summary: '사용자 회원가입'})
    @Post('/signup')
    async registerUser(
        @Body() createUserDto: CreateUserDto
    ): Promise<SignUpUserInterface> {
        return await this.authService.signup(createUserDto);
    }

    @UseGuards(UserLocalAuthGuard)
    @HttpCode(201)
    @ApiOperation({summary: '사용자 로그인'})
    @Post('/signin')
    async loginUser(
        @Body() authCredentialsDto: AuthCredentialsDto,
        @UserId() userId: number
    ): Promise<AccessToken>{
        return this.authService.loginUser(userId);
    }
}
