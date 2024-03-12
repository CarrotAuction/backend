import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entity/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UserMapper } from './mapper/user.mapper';
import { AccountIdAlreadyExistsException } from './authException/AccountIdAlreadyExistsException';
import { NicknameAlreadyExistsException } from './authException/NicknameAlreadyExistsException';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { NotFoundUserException } from './authException/NotFoundUserException';
import { LoginInvalidPasswordException } from './authException/LoginInvalidPasswordException';
import { Province } from '../location/entity/province.entity';
import { City } from '../location/entity/city.entity';
import { ProvinceInvalidException } from './authException/ProvinceInvalidException';
import { CityInvalidException } from './authException/CityInvalidException';
import * as bcrypt from 'bcrypt';
import { UserCreateResultInterface } from '../../interfaces/user-create-result.interface';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        @InjectRepository(Province)
        private readonly provinceRepository: Repository<Province>,

        @InjectRepository(City)
        private readonly cityRepository: Repository<City>,

        private readonly jwtService: JwtService,
        readonly configService: ConfigService,
        private readonly userMapper: UserMapper
    ) {}

    // 회원가입
    async signup(createUserDto: CreateUserDto): Promise<UserCreateResultInterface>{
        // 행정구역 유효성체크
        const province = await this.provinceRepository.findOne({where: {name: createUserDto.province}});
        if(!province) {
            throw new ProvinceInvalidException();
        }
        // 시/군/구 유효성체크
        const city = await this.cityRepository.createQueryBuilder("city")
                        .leftJoin("province", "province", "city.province_id = province.id")
                        .where("city.name = :cityName", {cityName: createUserDto.city})
                        .andWhere("province.id = :provinceId", {provinceId: province.id})
                        .getOne()
        if(!city) {
            throw new CityInvalidException();
        }
        // 이메일 유효성체크
        const isAccountIDExist = await this.userRepository.findOne({where: {accountID:createUserDto.accountID}});
        if(isAccountIDExist) {
          throw new AccountIdAlreadyExistsException();
        }
        // 닉네임 유효성체크
        const isNicknameExist = await this.userRepository.findOne({where: {nickname: createUserDto.nickname}});
        if(isNicknameExist) {
            throw new NicknameAlreadyExistsException();
        }
        // 비밀번호 암호화
        const {password} = createUserDto;
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        createUserDto.password = hashedPassword;

        const newUserEntity = this.userMapper.DtoToEntity(createUserDto, province, city);
        const savedUser = await this.userRepository.save(newUserEntity);

        return {
            message: '회원가입 성공',
            userId: savedUser.id,
        };
    }
    
    // 비밀번호 체크
    async validateUser(authCredentialsDto: AuthCredentialsDto): Promise<{id: number}>{
        const {accountID, password} = authCredentialsDto;
        const user = await this.userRepository.findOneBy({accountID});
        if(user){
            const isPasswordMatch = await bcrypt.compare(password, user.password);
            if(isPasswordMatch){
                return {id: user.id};
            }else{
                throw new LoginInvalidPasswordException();
            }
        }else{
            throw new NotFoundUserException();
        }

    }

    async loginUser(id: number): Promise<{accessToken: string}> {
        const payload: {id: number} = {id};
        const accessToken = this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_SECRET_KEY'),
        });
        return {accessToken};
    }
}