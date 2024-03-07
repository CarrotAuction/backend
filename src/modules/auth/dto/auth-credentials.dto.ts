import { IsNotEmpty, IsString } from "class-validator";

export class AuthCredentialsDto {
    
    @IsString()
    @IsNotEmpty()
    accountID: string;

    @IsString()
    @IsNotEmpty()
    password: string;

}