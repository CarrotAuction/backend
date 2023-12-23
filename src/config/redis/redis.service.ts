import { Injectable } from "@nestjs/common";
import { RedisService as RedisDao } from "@songkeys/nestjs-redis";
import { Redis } from "ioredis";

@Injectable()
export class RedisService {
    private readonly redisClient: Redis;

    constructor(private readonly redisService: RedisDao){
        this.redisClient = redisService.getClient();
    }

    async boardLikesInc(key: string): Promise<number>{
        return await this.redisClient.incr(key);
    }

    async boardLikesDec(key: string): Promise<number>{
        return await this.redisClient.decr(key);
    }

    async addUserLikesSet(key: string, value: string): Promise<number>{
        return await this.redisClient.sadd(key, value);
    }

    async removeUserLikesSet(key: string, value: string): Promise<number>{
        return await this.redisClient.srem(key, value);
    }

    async isUserIncludeSet(key: string, value: string): Promise<boolean>{
        return await this.redisClient.sismember(key, value) ===1 ;
    }
}