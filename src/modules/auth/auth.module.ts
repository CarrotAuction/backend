import { Module } from '@nestjs/common';
import { AuthController} from './auth.controller';
import { AuthService} from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entity/user.entity';
import { UserMapper } from './mapper/user.mapper';
import { Province } from '../location/entity/province.entity';
import { City } from '../location/entity/city.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { UserLocalStrategy } from './strategies/user-local.auth.strategy';
import { UserJwtStrategy } from './strategies/user-jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Province, City]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET_KEY'),
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRATION')
        },
      })
    }),
    ConfigModule,
    PassportModule
  ],
  controllers: [AuthController],
  providers: [AuthService, UserMapper, UserLocalStrategy, UserJwtStrategy]
})
export class AuthModule {}
