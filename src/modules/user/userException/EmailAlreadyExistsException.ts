import { HttpStatus } from "@nestjs/common";
import { CustomException } from "../../../global/exception/customException";
import { ErrorCode } from "../../../global/exception/errorCode/Errorcode";

export class EmailAlreadyExistsException extends CustomException {
    constructor() {
        super(
            ErrorCode.USER_EMAIL_ALREADY_EXIST,
            '이미 존재하는 이메일이 있습니다!',
            HttpStatus.CONFLICT,
        );
    }
}