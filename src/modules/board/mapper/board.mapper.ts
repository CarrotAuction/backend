import { Injectable } from "@nestjs/common";
import { CreateBoardRequestDto } from "../dto/board-create-request.dto";
import { Board } from "../entity/board.entity";
import { CreateBoardResponseDto } from "../dto/board-create-response.dto";

@Injectable()
export class BoardMapper {

    DtoToEntity({stuffName, stuffContent, stuffPrice, stuffCategory}: CreateBoardRequestDto): Board {
       
        const board = new Board();

        board.stuffName = stuffName;
        board.stuffContent = stuffContent;
        board.stuffPrice = stuffPrice;
        board.stuffCategory = stuffCategory;

        return board;
    }

    EntityToDto(board: Board): CreateBoardResponseDto{

        return{
          stuffName: board.stuffName,
          stuffContent: board.stuffContent,
          stuffPrice: board.stuffPrice,
          stuffCategory: board.stuffCategory,
        };
    }
    
}