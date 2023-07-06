import { Inject, Injectable } from '@nestjs/common';
import { REDIS_CONSTANTS, RedisClient } from './redis.provider';
import { RedisKey } from 'ioredis';

@Injectable()
export class RedisService {
  public constructor(
    @Inject(REDIS_CONSTANTS.REDIS_SERVICE)
    private readonly redisService: RedisClient,
  ) {}

  // Set
  public async set(
    key: RedisKey,
    data: string | number | Buffer,
  ): Promise<'OK'> {
    return this.redisService.set(key, data);
  }

  // Get
  public async get(key: RedisKey): Promise<string> {
    return this.redisService.get(key);
  }

  // Del
  public async del(key: RedisKey): Promise<number> {
    return this.redisService.del(key);
  }
}
