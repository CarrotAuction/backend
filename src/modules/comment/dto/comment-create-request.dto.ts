import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentRequestDto {
  @ApiProperty({
    example: 30000,
    description: '댓글에 제시된 가격',
  })
  @IsNumber()
  price: number;

  @ApiProperty({
    example: 'https://open.kakao.com/o/sjloPgUf',
    description: '댓글에 제시된 오픈 채팅 URL',
  })
  @IsString()
  openChatUrl: string;

  @ApiProperty({
    example: 1,
    description: '댓글이 달릴 게시글의 고유 ID',
  })
  @IsNumber()
  boardId: number;

  @ApiProperty({
    example: 2,
    description: '댓글을 작성하는 사용자의 고유 ID',
  })
  @IsNumber()
  creatorId: number;
}
