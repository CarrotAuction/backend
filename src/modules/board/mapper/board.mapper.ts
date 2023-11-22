import { Injectable } from '@nestjs/common';
import { CreateBoardRequestDto } from '../dto/board-create-request.dto';
import { Board } from '../entity/board.entity';
import { CreateBoardResponseDto } from '../dto/board-create-response.dto';
import { User } from '../../user/entity/user.entity';

@Injectable()
export class BoardMapper {
  DtoToEntity(
    {
      stuffName,
      stuffContent,
      stuffPrice,
      stuffCategory,
    }: CreateBoardRequestDto,
    creator: User,
  ): Board {
    const board = new Board();

    board.stuffName = stuffName;
    board.stuffContent = stuffContent;
    board.stuffPrice = stuffPrice;
    board.stuffCategory = stuffCategory;
    board.creator = creator;

    return board;
  }

  EntityToDto(board: Board): CreateBoardResponseDto {
    return {
      id: board.id,
      stuffName: board.stuffName,
      stuffContent: board.stuffContent,
      stuffPrice: board.stuffPrice,
      stuffCategory: board.stuffCategory,
      creatorId: board.creator.id,
      imageUrl: board.imageUrl,
    };
  }
}
