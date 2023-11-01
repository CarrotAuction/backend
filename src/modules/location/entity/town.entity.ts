import { type } from "os";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { City } from "./city.entity";

@Entity()
export class Town {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToOne(type => City, city => city.towns)
    @JoinColumn({ name: 'city_id' })
    city_id: City;

}