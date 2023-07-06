import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';
import { SocketStateService } from './socket-state.service';
import { RedisSocketEventSendDto } from './dtos/index.dtos';
import { tap } from 'rxjs';
import { RedisPubSubService } from '@redis';
import { PubSubChannels } from '@redis/types/index.types';
import { WSService } from './ws.service';

@Injectable()
export class RedisPropagatorService {
  private socketServer: Server;

  public constructor(
    private readonly wsService: WSService,
    private readonly redisPubSubService: RedisPubSubService,
  ) {
    // Send message
    this.redisPubSubService
      .fromEvent(PubSubChannels.add_message)
      .pipe(tap(this.wsService.emitAddMessage))
      .subscribe();
  }

  public propagateEvent(
    channel: string,
    eventInfo: RedisSocketEventSendDto,
  ): boolean {
    if (!eventInfo.userId) return false;
    this.redisPubSubService.publish(channel, eventInfo);
    return true;
  }

  public injectSocketServer(server: Server): RedisPropagatorService {
    this.socketServer = server;
    return this;
  }
}
