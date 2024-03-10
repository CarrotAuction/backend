import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "../auth.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UserLocalStrategy extends PassportStrategy(Strategy, 'user-local'){
    constructor(private authService: AuthService){
        super({usernameField: 'accountID', password: 'password'});
    }

    async validate(accountID: string, password: string): Promise<{id: number}>{
        const id = await this.authService.validateUser({accountID, password});
        return id;
    }
}

