import { Type } from 'class-transformer';
import { IsInt, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CommentPaginationRequestDto {
  @ApiProperty({
    example: 1,
    description: '댓글을 조회할 게시글의 ID',
  })
  @IsInt()
  @Type(() => Number)
  boardId: number;

  @ApiProperty({
    example: 5,
    description: '댓글 조회 시작 지점을 나타내는 ID',
  })
  @IsInt()
  @Type(() => Number)
  cursor: number;

  @ApiProperty({
    example: 6,
    description: '한 페이지에 표시될 최대 댓글 수',
  })
  @IsInt()
  @Type(() => Number)
  limit?: number = 6;
}
