import { User } from '../../user/entity/user.entity';
import { BaseEntity } from '../../../global/common/base.entitiy';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, VersionColumn } from 'typeorm';
import { Comment } from '../../comment/entity/comment.entity';
import { StuffCategory } from '../../../types/enums/stuffCategory.enum';
import { BoardStatus } from '../../../types/enums/boardStatus.enum';

@Entity()
export class Board extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  stuffName!: string;

  @Column()
  stuffContent!: string;

  @Column()
  stuffPrice!: number;

  @Column()
  tradingPlace!: string;

  @Column({ name: 'stuffCategory', type: 'varchar', length: 128 })
  stuffCategory: StuffCategory;

  @Column({ name: 'status', type: 'varchar', length: 128, default: BoardStatus.OPEN })
  status: keyof typeof BoardStatus;

  @Column({ default: 0 })
  likesCount: number;

  @Column({ nullable: true })
  imageUrl: string;

  @ManyToOne((type) => User)
  @JoinColumn({ name: 'user_id' })
  creator: User;

  @OneToMany((type) => Comment, (comment) => comment.board)
  comments: Comment[];
}
