import { City } from "src/modules/location/entity/city.entity";
import { Province } from "src/modules/location/entity/province.entity";

export interface UserAuthResult{
    id: number;
    nickname: string;
    accountID: string;
    province: Province;
    city: City;
    createAt: Date;
    updateAt: Date;
    deleteAt: Date | null;
}