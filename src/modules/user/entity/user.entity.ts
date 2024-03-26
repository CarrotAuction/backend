import { City } from "../../region/entity/city.entity";
import { BaseEntity } from "../../../global/common/entity/base.entitiy";
import { Column, Entity, JoinColumn, ManyToOne} from "typeorm";
import { Province } from "../../region/entity/province.entity";
import { Region } from "../../region/entity/region.entity";

@Entity()
export class User extends BaseEntity{

    @Column()
    password: string;

    @Column()
    nickname: string;

    @Column()
    accountID: string;

    @ManyToOne(type => Region)
    @JoinColumn({name: 'region_id'})
    region: Region;

    // @ManyToOne(type => Province)
    // @JoinColumn({name: 'province_id'})
    // province: Province;

    // @ManyToOne(type => City)
    // @JoinColumn({name: 'city_id'})
    // city: City;

}