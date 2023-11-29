import { Injectable } from "@nestjs/common";
import { RedisService as RedisDao } from "@songkeys/nestjs-redis";
import { Redis } from "ioredis";

@Injectable()
export class RedisService {
    private readonly redisClient: Redis;

    constructor(private readonly redisService: RedisDao){
        this.redisClient = redisService.getClient();
    }

    async setValues(key: string, data: string): Promise<string>{
        await this.redisClient.set(key, data);
        return `Redis에 key가 생성됨`;
    }

    async setValuesList(key: string, data: string): Promise<number>{
        return await this.redisClient.rpush(key, data);
    }

    async getValues(key: string): Promise<string|null>{
        return await this.redisClient.get(key);
    }

    async getValuesList(key: string): Promise<string[]>{
        const len = await this.redisClient.llen(key);
        return len === 0 ? [] : await this.redisClient.lrange(key, 0, len-1);
    }

    async deleteValuesList(key: string, data: string): Promise<number>{
        return await this.redisClient.lrem(key, 0, data);
    }
}