import { HttpStatus } from '@nestjs/common';
import { CustomException } from '../../../global/exception/customException';
import { ErrorCode } from '../../../global/exception/errorCode/Errorcode';

export class ImageServiceConfigurationException extends CustomException {
  constructor() {
    super(
      ErrorCode.IMAGE_SERVICE_CONFIGURATION_ERROR,
      '이미지 업로드 서비스 구성 오류입니다.',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
