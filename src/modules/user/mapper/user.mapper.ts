import { Injectable } from "@nestjs/common";
import { RegisterUserRequestDto } from "../dto/user-register-request.dto";
import { User } from "../entity/user.entity";
import { UserResponseDto } from "../dto/user-response.dto";
import { Province } from "../../location/entity/province.entity";
import { City } from "../../location/entity/city.entity";

@Injectable()
export class UserMapper {

    DtoToEntity({password, accountID, nickname}: RegisterUserRequestDto, province: Province, city: City): User{

        const user = new User();

        user.password = password;
        user.accountID = accountID;
        user.nickname = nickname;
        user.city = city;
        user.province = province;

        return user;
    }


    EntityToDto(user: User): UserResponseDto {
        
        return {
            accountID: user.accountID,
            nickname: user.nickname,
            province: user.province.name,
            city: user.city.name,
        };
    }
}