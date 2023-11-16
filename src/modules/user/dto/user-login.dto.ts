import { IsNotEmpty, IsString } from "class-validator";

export class LoginUserDto {
    
    @IsString()
    @IsNotEmpty()
    accountID: string;

    @IsString()
    @IsNotEmpty()
    password: string;

}