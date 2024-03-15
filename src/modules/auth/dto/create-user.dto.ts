import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmptyAndString } from "../../../decorators/is-Not-Empty-And-String.decorator";
import { AuthCredentialsDto } from "./auth-credentials.dto";

export class CreateUserDto extends AuthCredentialsDto{

    @ApiProperty({type: String, description: '사용자 닉네임', required: true, example: '야망있는최필규'})
    @IsNotEmptyAndString(1, 15)
    nickname!: string;

    @ApiProperty({type: String, description: '사용자가 거주하는 동/면/리', required: true, example: '역삼동'})
    @IsNotEmptyAndString()
    region!: string;

}