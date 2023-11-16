import { HttpStatus } from '@nestjs/common';
import { CustomException } from '../../../global/exception/customException';
import { ErrorCode } from '../../../global/exception/errorCode/Errorcode';

export class ImageUploadFailedException extends CustomException {
  constructor() {
    super(
      ErrorCode.IMAGE_UPLOAD_FAILED,
      '이미지 업로드에 실패했습니다.',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
