import { Injectable } from '@nestjs/common';
import { RedisService } from '@songkeys/nestjs-redis';

@Injectable()
export class AppService {
  constructor(private readonly redisService: RedisService) {}

  async getHello(): Promise<string> {
    const client = this.redisService.getClient();
    await client.set('key', 'value');
    const value = await client.get('key');
    return "redis와 nest서버가 연결되었습니다!"; 
  }
}