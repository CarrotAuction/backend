import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "../dto/create-user.dto";
import { User } from "../../user/entity/user.entity";
import { Province } from "../../location/entity/province.entity";
import { City } from "../../location/entity/city.entity";
import { Region } from "src/modules/location/entity/region.entity";

@Injectable()
export class UserMapper {

    DtoToEntity({password, accountID, nickname}: CreateUserDto, region: Region): User{

        const user = new User();

        user.password = password;
        user.accountID = accountID;
        user.nickname = nickname;
        user.region = region;

        return user;
    }
}