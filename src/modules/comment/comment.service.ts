import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entity/user.entity';
import { CreateCommentRequestDto } from './dto/comment-create-request.dto';
import { NotFoundUserException } from '../user/userException/NotFoundUserException';
import { NotFoundBoardException } from '../board/boardException/NotFoundBoardException';
import { CommentMapper } from './mapper/comment.mapper';
import { Comment } from './entity/comment.entity';
import { Board } from '../board/entity/board.entity';

@Injectable()
export class CommentService {

    constructor(
        @InjectRepository(Comment)
        private readonly commentRepository: Repository<Comment>,

        @InjectRepository(Board)
        private readonly boardRepository: Repository<Board>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        private readonly commentMapper: CommentMapper
    ) {}

    async createComment(createCommentRequestDto: CreateCommentRequestDto): Promise<Comment> {
        const creator = await this.userRepository.findOne({where: {id: createCommentRequestDto.creatorId}});
        if(!creator){
            throw new NotFoundUserException();
        }
        const board = await this.boardRepository.findOne({where: {id: createCommentRequestDto.boardId}});
        if(!board){
            throw new NotFoundBoardException();
        }
        const newCommentEntity = this.commentMapper.dtoToEntity(createCommentRequestDto, creator, board);
        return await this.commentRepository.save(newCommentEntity);

    }
}
