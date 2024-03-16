import { ConfigService } from "@nestjs/config";
import { config } from "dotenv";
import { City } from "./src/modules/location/entity/city.entity";
import { Province } from "./src/modules/location/entity/province.entity";
import { DataSource } from "typeorm";
import { User } from "./src/modules/user/entity/user.entity";
import { Board } from "./src/modules/board/entity/board.entity";
import { Comment } from "./src/modules/comment/entity/comment.entity";
import { Region } from "./src/modules/location/entity/region.entity";
import * as path from 'path';

config();

const configService = new ConfigService();

export default new DataSource({
    type: 'mysql',
    host: configService.get('MIGRATION_HOST'),
    port: +configService.get('DB_PORT'),
    username: configService.get('DB_USER'),
    password: configService.get('DB_PASSWORD'),
    database: configService.get('DB_NAME'),
    migrations: ['migrations/**'],
    entities: [path.join(__dirname, './modules/*/entity/*.entity.{ts,js}')],
});