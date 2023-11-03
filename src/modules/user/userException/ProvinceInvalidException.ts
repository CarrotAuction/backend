import { CustomException } from "../../../global/exception/customException";
import { ErrorCode } from "../../../global/exception/errorCode/Errorcode";
import { HttpStatus } from "@nestjs/common";

export class ProvinceInvalidException extends CustomException {
    constructor(){
        super(
            ErrorCode.USER_INVALID_PROVINCE,
            '존재하지 않는 행정구역입니다!',
            HttpStatus.CONFLICT,
        );
    }
}