import { Injectable } from '@nestjs/common';
import { RedisPubSubService } from '@redis';
import { PubSubChannels } from '@redis/types/index.types';
import { WSService } from '@ws/ws.service';

@Injectable()
export class ChatroomWs {
  constructor(
    private readonly redisPubSubService: RedisPubSubService,
    private readonly wsService: WSService,
  ) {
    this.subscribe();
  }
  async broadcastMessage(input: string) {
    const data = JSON.parse(input);
    console.log(data);
    this.wsService.emitMessage(data, 'chats.new');
  }

  async subscribe() {
    const subscribers = [
      {
        service: this.broadcastMessage,
        channel: PubSubChannels.ADD_MESSAGE,
      },
    ];

    for (const subscriber of subscribers) {
      this.redisPubSubService
        .fromChannel(subscriber.channel)
        .forEach((input) => subscriber.service.bind(this)(input));
    }
  }
}
