import { User } from "../../user/entity/user.entity";
import { CreateCommentDto } from "../dto/create-comment.dto";
import { Board } from "../../board/entity/board.entity";
import { Injectable } from "@nestjs/common";
import { Comment } from "../entity/comment.entity";

@Injectable()
export class CommentMapper {

    dtoToEntity({content}:CreateCommentDto, creator: User, board: Board): Comment {

        const comment = new Comment();

        comment.content = content;
        comment.creator = creator;
        comment.board = board;

        return comment;
    }
}