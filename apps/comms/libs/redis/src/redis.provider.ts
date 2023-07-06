import { Redis } from 'ioredis';
import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export type RedisClient = Redis;
export enum REDIS_CONSTANTS {
  REDIS_SUBSCRIBER_CLIENT = 'REDIS_SUBSCRIBER_CLIENT',
  REDIS_PUBLISHER_CLIENT = 'REDIS_PUBLISHER_CLIENT',
  REDIS_SERVICE = 'REDIS_SERVICE',
}

export const redisProviders: Provider[] = [
  {
    useFactory: (configService: ConfigService): RedisClient => {
      return new Redis({
        host: configService.get<string>('REDIS_HOST'),
        port: configService.get<number>('REDIS_PORT'),
      });
    },

    inject: [ConfigService],
    provide: REDIS_CONSTANTS.REDIS_PUBLISHER_CLIENT,
  },
  {
    useFactory: (configService: ConfigService): RedisClient => {
      return new Redis({
        host: configService.get<string>('REDIS_HOST'),
        port: configService.get<number>('REDIS_PORT'),
      });
    },

    inject: [ConfigService],
    provide: REDIS_CONSTANTS.REDIS_SUBSCRIBER_CLIENT,
  },
  {
    useFactory: (configService: ConfigService): RedisClient => {
      return new Redis({
        host: configService.get<string>('REDIS_HOST'),
        port: configService.get<number>('REDIS_PORT'),
      });
    },

    inject: [ConfigService],
    provide: REDIS_CONSTANTS.REDIS_SERVICE,
  },
];
