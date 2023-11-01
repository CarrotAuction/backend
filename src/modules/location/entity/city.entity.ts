import { type } from "os";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Province } from "./province.entity";
import { Town } from "./town.entity";

@Entity()
export class City {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToOne(type => Province, province => province.cities)
    @JoinColumn({ name: 'province_id' })
    province_id: Province;

    @OneToMany(type => Town, town => town.city_id)
    towns: Town[];


}