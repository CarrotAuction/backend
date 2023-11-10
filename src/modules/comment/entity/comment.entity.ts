import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "../../../global/common/base.entitiy";
import { Board } from "../../board/entity/board.entity";
import { User } from "../../user/entity/user.entity";

@Entity()
export class Comment extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    price: number;

    @Column()
    openChatUrl: string;

    @ManyToOne(type => Board)
    @JoinColumn({name: "board_id"})
    board: Board;

    @ManyToOne(type => User)
    @JoinColumn({name: "user_id"})
    creator: User;
}