import { BaseEntity } from "../../../global/common/base.entitiy";
import { StuffCategory } from "../../enums/stuffCategory.enum";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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

    @Column({type: 'enum', enum: StuffCategory})
    stuffCategory: StuffCategory
}