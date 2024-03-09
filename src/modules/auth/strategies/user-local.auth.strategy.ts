import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "../auth.service";
import { UserAuthResult } from "src/interfaces/user-auth-result.interface";
import { LoginInvalidPasswordException } from "../authException/LoginInvalidPasswordException";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UserLocalStrategy extends PassportStrategy(Strategy, 'user-local'){
    constructor(private authService: AuthService){
        super({usernameField: 'accountID', password: 'password'});
    }

    async validate(accountID: string, password: string): Promise<UserAuthResult>{
        const user = await this.authService.validateUser({accountID, password});
        if(!user){
            throw new LoginInvalidPasswordException();
        }
        return user;
    }
}

