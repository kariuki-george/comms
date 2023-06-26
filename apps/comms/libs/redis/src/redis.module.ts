import { Global, Module } from '@nestjs/common';
import { RedisPubSubService } from './redis-pubsub.service';
import { redisProviders } from './redis.provider';

@Global()
@Module({
  providers: [RedisPubSubService, ...redisProviders],
  exports: [RedisPubSubService],
})
export class RedisModule {}
