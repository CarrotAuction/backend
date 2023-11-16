import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entity/user.entity';
import { NotFoundUserException } from '../user/userException/NotFoundUserException';
import { NotFoundBoardException } from '../board/boardException/NotFoundBoardException';
import { CommentMapper } from './mapper/comment.mapper';
import { Comment } from './entity/comment.entity';
import { Board } from '../board/entity/board.entity';
import { CommentPaginationRequestDto } from './dto/commet-pagination-request.dto';
import { CreateCommentRequestDto } from './dto/comment-create-request.dto';

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

    async getAllComment(commentPaginationRequestDto: CommentPaginationRequestDto): Promise<Comment[]> {
        const {boardId, cursor, limit} = commentPaginationRequestDto;
        const comments = await this.commentRepository.createQueryBuilder('comment')
            .leftJoin('comment.creator', 'user')
            .select([
                'comment.id',
                'comment.openChatUrl',
                'comment.price',
                'comment.createAt',
                'user.nickname'
            ])
            .where('comment.board.id =:id', {id: boardId})
            .andWhere('comment.id < :cursor' ,{cursor: cursor})
            .orderBy('comment.createAt', 'DESC')
            .limit(limit)
            .getMany();
        
        return comments;
    }


}
