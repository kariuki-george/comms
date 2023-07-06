import { Global, Module } from '@nestjs/common';
import { RedisPubSubService } from './redis-pubsub.service';
import { redisProviders } from './redis.provider';
import { RedisService } from './redis-service.service';

@Global()
@Module({
  providers: [RedisPubSubService, RedisService, ...redisProviders],
  exports: [RedisPubSubService, RedisService],
})
export class RedisModule {}
