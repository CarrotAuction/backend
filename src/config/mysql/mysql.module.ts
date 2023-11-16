import { Inject, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../../modules/user/entity/user.entity";
import { Board } from "../../modules/board/entity/board.entity";
import { Province } from "../../modules/location/entity/province.entity";
import { City } from "../../modules/location/entity/city.entity";
import { Comment } from "../../modules/comment/entity/comment.entity";

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                type: 'mysql',
                host: configService.get('DB_HOST'),
                port: +configService.get('DB_PORT'),
                username: configService.get('DB_USER'),
                password: configService.get('DB_PASSWORD'),
                database: configService.get('DB_NAME'),
                entities: [User, Board, Province, City, Comment],
                synchronize: true,
                logging: true,
            }),
            inject: [ConfigService],
        }),
    ],
})
export class MysqlModule {}


