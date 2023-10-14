import { BaseEntity } from "../../../global/common/base.entitiy";
import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User extends BaseEntity{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    password: string;

    @Column()
    nickname: string;

    @Column()
    email: string;

    @Column()
    location: string;
    
}