import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "../dto/create-user.dto";
import { User } from "../../user/entity/user.entity";
import { Province } from "../../location/entity/province.entity";
import { City } from "../../location/entity/city.entity";

@Injectable()
export class UserMapper {

    DtoToEntity({password, accountID, nickname}: CreateUserDto, province: Province, city: City): User{

        const user = new User();

        user.password = password;
        user.accountID = accountID;
        user.nickname = nickname;
        user.city = city;
        user.province = province;

        return user;
    }
}