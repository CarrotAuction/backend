import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { RegisterUserRequestDto } from './dto/user-register-request.dto';
import { UserMapper } from './mapper/user.mapper';
import { EmailAlreadyExistsException } from './userException/EmailAlreadyExistsException';
import { NicknameAlreadyExistsException } from './userException/NicknameAlreadyExistsException';
import { LoginUserDto } from './dto/user-login.dto';
import { NotFoundUserException } from './userException/NotFoundUserException';
import { LoginInvalidPasswordException } from './userException/LoginInvalidPasswordException';
import { Province } from '../location/entity/province.entity';
import { City } from '../location/entity/city.entity';
import { ProvinceInvalidException } from './userException/ProvinceInvalidException';
import { CityInvalidException } from './userException/CityInvalidException';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        @InjectRepository(Province)
        private readonly provinceRepository: Repository<Province>,

        @InjectRepository(City)
        private readonly cityRepository: Repository<City>,

        private readonly userMapper: UserMapper
    ) {}

    // 회원가입
    async registerUser(registerUserRequestDto: RegisterUserRequestDto): Promise<User>{
        // 행정구역 유효성체크
        const province = await this.provinceRepository.findOne({where: {name: registerUserRequestDto.province}});
        if(!province) {
            throw new ProvinceInvalidException();
        }
        // 시/군/구 유효성체크
        const city = await this.cityRepository.findOne({where: {name: registerUserRequestDto.city}});
        if(!city) {
            throw new CityInvalidException();
        }
        // 이메일 유효성체크
        const isEmailExist = await this.userRepository.findOne({where: {email:registerUserRequestDto.email}});
        if(isEmailExist) {
          throw new EmailAlreadyExistsException();
        }
        // 닉네임 유효성체크
        const isNicknameExist = await this.userRepository.findOne({where: {nickname: registerUserRequestDto.nickname}});
        if(isNicknameExist) {
            throw new NicknameAlreadyExistsException();
        }

        const newUserEntity = this.userMapper.DtoToEntity(registerUserRequestDto, province, city);
        return await this.userRepository.save(newUserEntity);
    }
    
    // 로그인
    async loginUser(loginUserDto: LoginUserDto): Promise<String> {
        // 유저 유효성 체크
        const user = await this.userRepository.findOne({where: {nickname: loginUserDto.nickname}});
        if(!user) {
            throw new NotFoundUserException();
        }
        // 로그인 체크
        if(user.password !== loginUserDto.password){
            throw new LoginInvalidPasswordException();
        }
        return `${user.nickname}님 안녕하세요!`;
    }
}

