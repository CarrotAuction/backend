import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { UserMapper } from './mapper/user.mapper';
import { Province } from '../location/entity/province.entity';
import { City } from '../location/entity/city.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Province, City])],
  controllers: [UserController],
  providers: [UserService, UserMapper]
})
export class UserModule {}
