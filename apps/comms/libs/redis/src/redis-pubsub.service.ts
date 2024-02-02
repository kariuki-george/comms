import { Inject, Injectable } from '@nestjs/common';
import { REDIS_CONSTANTS } from './redis.provider';
import { RedisClient } from './redis.provider';
import { Observable, Observer, map } from 'rxjs';
import { PubSubChannels } from './types/index.types';
export interface RedisSubscribeMessage {
  readonly data: string;
  readonly channel: string;
}

@Injectable()
export class RedisPubSubService {
  public constructor(
    @Inject(REDIS_CONSTANTS.REDIS_SUBSCRIBER_CLIENT)
    private readonly redisSubscriberClient: RedisClient,
    @Inject(REDIS_CONSTANTS.REDIS_PUBLISHER_CLIENT)
    private readonly redisPublisherClient: RedisClient,
  ) {}

  //   Subscribe
  public fromChannel(channelName: string): Observable<string> {
    this.redisSubscriberClient.subscribe(channelName);

    return new Observable((observer: Observer<RedisSubscribeMessage>) =>
      this.redisSubscriberClient.on('message', (channel, data) => {
        if (channel == channelName) observer.next({ channel, data });
      }),
    ).pipe(map((input) => input.data));
  }

  //   Publish
  public async publish(channel: PubSubChannels, data: string): Promise<number> {
    return this.redisPublisherClient.publish(channel, data);
  }
}
