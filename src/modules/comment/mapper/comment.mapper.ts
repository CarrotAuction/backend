import { User } from "../../user/entity/user.entity";
import { CreateCommentRequestDto } from "../dto/comment-create-request.dto";
import { Board } from "../../board/entity/board.entity";
import { Injectable } from "@nestjs/common";
import { Comment } from "../entity/comment.entity";
import { CreateCommentResponseDto } from "../dto/comment-create-response.dto";

@Injectable()
export class CommentMapper {

    dtoToEntity({price, openChatUrl}:CreateCommentRequestDto, creator: User, board: Board): Comment {

        const comment = new Comment();

        comment.price = price;
        comment.openChatUrl = openChatUrl;
        comment.creator = creator;
        comment.board = board;

        return comment;
    }

    entityToDto(comment: Comment): CreateCommentResponseDto {

        return{
            price: comment.price,
            openChatUrl: comment.openChatUrl,
            boardId: comment.board.id,
            creatorId: comment.creator.id,
        };     
    }
}