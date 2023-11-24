import { User } from '../../user/entity/user.entity';
import { BaseEntity } from '../../../global/common/base.entitiy';
import { StuffCategory } from '../enums/stuffCategory.enum';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Comment } from '../../comment/entity/comment.entity';

@Entity()
export class Board extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  stuffName: string;

  @Column()
  stuffContent: string;

  @Column()
  stuffPrice: number;

  @Column({ type: 'enum', enum: StuffCategory })
  stuffCategory: StuffCategory;

  @ManyToOne((type) => User)
  @JoinColumn({ name: 'user_id' })
  creator: User;

  @OneToMany((type) => Comment, (comment) => comment.board)
  comments: Comment[];

  @Column({ type: 'text', nullable: true })
  imageUrl: string;
}
