import { City } from "../../location/entity/city.entity";
import { BaseEntity } from "../../../global/common/base.entitiy";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Province } from "../../location/entity/province.entity";

@Entity()
export class User extends BaseEntity{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    password: string;

    @Column()
    nickname: string;

    @Column()
    accountID: string;

    @ManyToOne(type => Province)
    @JoinColumn({name: 'province_id'})
    province: Province;

    @ManyToOne(type => City)
    @JoinColumn({name: 'city_id'})
    city: City;

}