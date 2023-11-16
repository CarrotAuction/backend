import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { RegisterUserRequestDto } from './dto/user-register-request.dto';
import { UserMapper } from './mapper/user.mapper';
import { AccountIdAlreadyExistsException } from './userException/AccountIdAlreadyExistsException';
import { NicknameAlreadyExistsException } from './userException/NicknameAlreadyExistsException';
import { LoginUserDto } from './dto/user-login.dto';
import { NotFoundUserException } from './userException/NotFoundUserException';
import { LoginInvalidPasswordException } from './userException/LoginInvalidPasswordException';
import { Province } from '../location/entity/province.entity';
import { City } from '../location/entity/city.entity';
import { ProvinceInvalidException } from './userException/ProvinceInvalidException';
import { CityInvalidException } from './userException/CityInvalidException';
import * as bcrypt from 'bcrypt';
import { UserLoginResponseDto } from './dto/user-login-response.dto';

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
        const city = await this.cityRepository.createQueryBuilder("city")
                        .leftJoin("province", "province", "city.province_id = province.id")
                        .where("city.name = :cityName", {cityName: registerUserRequestDto.city})
                        .andWhere("province.id = :provinceId", {provinceId: province.id})
                        .getOne()
        if(!city) {
            throw new CityInvalidException();
        }
        // 이메일 유효성체크
        const isAccountIDExist = await this.userRepository.findOne({where: {accountID:registerUserRequestDto.accountID}});
        if(isAccountIDExist) {
          throw new AccountIdAlreadyExistsException();
        }
        // 닉네임 유효성체크
        const isNicknameExist = await this.userRepository.findOne({where: {nickname: registerUserRequestDto.nickname}});
        if(isNicknameExist) {
            throw new NicknameAlreadyExistsException();
        }
        // 비밀번호 암호화
        const {password} = registerUserRequestDto;
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        registerUserRequestDto.password = hashedPassword;

        const newUserEntity = this.userMapper.DtoToEntity(registerUserRequestDto, province, city);
        return await this.userRepository.save(newUserEntity);
    }
    
    // 로그인
    async loginUser(loginUserDto: LoginUserDto): Promise<UserLoginResponseDto> {
        // 유저 유효성 체크
        const user = await this.userRepository.findOne({where: {accountID: loginUserDto.accountID}});
        if(!user) {
            throw new NotFoundUserException();
        }
        // 로그인 체크
        const {password} = loginUserDto;
        if(user && (await bcrypt.compare(password, user.password))){
            const response: UserLoginResponseDto = {
                message: `${user.nickname}님 안녕하세요!`,
                userId: user.id,
            };
            return response;
        } else{
        throw new LoginInvalidPasswordException();
        }
    }
}

