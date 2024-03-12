import { Injectable } from '@nestjs/common';
import { CreateBoardDto } from '../dto/create-board.dto';
import { Board } from '../entity/board.entity';
import { CreateBoardResponseDto } from '../dto/board-create-response.dto';
import { User } from '../../user/entity/user.entity';

@Injectable()
export class BoardMapper {
  DtoToEntity(
    creator: User,
    image: string,
    {
      stuffName,
      stuffContent,
      stuffPrice,
      tradingPlace,
      stuffCategory,
    }: CreateBoardDto,
  ): Board {
    const board = new Board();

    board.stuffName = stuffName;
    board.stuffContent = stuffContent;
    board.stuffPrice = stuffPrice;
    board.tradingPlace = tradingPlace;
    board.stuffCategory = stuffCategory;
    board.imageUrl = image;
    board.creator= creator;

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
      likesCount: board.likesCount
    };
  }
}
