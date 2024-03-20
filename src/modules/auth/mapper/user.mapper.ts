import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "../dto/create-user.dto";
import { User } from "../../user/entity/user.entity";
import { Province } from "../../region/entity/province.entity";
import { City } from "../../region/entity/city.entity";
import { Region } from "src/modules/region/entity/region.entity";

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