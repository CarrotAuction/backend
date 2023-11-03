import { HttpStatus } from "@nestjs/common";
import { CustomException } from "../../../global/exception/customException";
import { ErrorCode } from "../../../global/exception/errorCode/Errorcode";

export class CityInvalidException extends CustomException {
    constructor(){
        super(
            ErrorCode.USER_INVALID_CITY,
            '존재하지 않는 시/군/구입니다!',
            HttpStatus.CONFLICT,
        );
    }
}