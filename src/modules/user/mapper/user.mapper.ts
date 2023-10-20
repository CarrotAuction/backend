import { Injectable } from "@nestjs/common";
import { RegisterUserRequestDto } from "../dto/user-register-request.dto";
import { User } from "../entity/user.entity";
import { UserResponseDto } from "../dto/user-response.dto";

@Injectable()
export class UserMapper {

    DtoToEntity({password, email, nickname, location}: RegisterUserRequestDto): User{

        const user = new User();

        user.password = password;
        user.email = email;
        user.nickname = nickname;
        user.location = location;

        return user;
    }


    EntityToDto(user: User): UserResponseDto {
        
        return {
            email: user.email,
            nickname: user.nickname,
            location: user.location,
        };
    }
}