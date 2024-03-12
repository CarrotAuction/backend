import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entity/user.entity';
import { CommentMapper } from './mapper/comment.mapper';
import { Comment } from './entity/comment.entity';
import { Board } from '../board/entity/board.entity';
import { CommentPaginationRequestDto } from './dto/commet-pagination-request.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UserCreateResultInterface } from 'src/interfaces/user-create-result.interface';

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

    async createComment(createCommentDto: CreateCommentDto, id: number): Promise<UserCreateResultInterface> {
        const creator = await this.userRepository.findOneBy({id});
        const board = await this.boardRepository.findOneBy({id: createCommentDto.boardId});
        const newCommentEntity = this.commentMapper.dtoToEntity(createCommentDto,creator,board);

        const savedComment = await this.commentRepository.save(newCommentEntity);

        return{
            message: '새로운 댓글 생성',
            userId: savedComment.creator.id
        };
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
