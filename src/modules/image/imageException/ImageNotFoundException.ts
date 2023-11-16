import { HttpStatus } from '@nestjs/common';
import { CustomException } from '../../../global/exception/customException';
import { ErrorCode } from '../../../global/exception/errorCode/Errorcode';

export class ImageNotFoundException extends CustomException {
  constructor() {
    super(
      ErrorCode.IMAGE_NOT_FOUND,
      '요청한 이미지를 찾을 수 없습니다.',
      HttpStatus.NOT_FOUND,
    );
  }
}
