import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "../../../global/common/entity/base.entitiy";
import { Board } from "../../board/entity/board.entity";
import { User } from "../../user/entity/user.entity";

@Entity()
export class Comment extends BaseEntity {

    @Column()
    content: string;

    @ManyToOne(type => Board, board => board.comments)
    @JoinColumn({name: "board_id"})
    board: Board;

    @ManyToOne(type => User)
    @JoinColumn({name: "user_id"})
    creator: User;
}