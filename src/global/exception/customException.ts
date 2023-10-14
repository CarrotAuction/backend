import { HttpException, HttpStatus } from "@nestjs/common";

export class CustomException extends HttpException {
    constructor(
        private readonly _errorcode: string,
        message: string,
        status: HttpStatus,
    ){
        super({
            errorcode: _errorcode,
            message: message,
        },
        status,
        )
    }
}