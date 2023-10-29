import { Inject, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../../modules/user/entity/user.entity";
import { Board } from "../../modules/board/entity/board.entity";

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
                entities: [User, Board],
                synchronize: true,
                logging: true,
            }),
            inject: [ConfigService],
        }),
    ],
})
export class MysqlModule {}


