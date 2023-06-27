import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';
import { SocketStateService } from './socket-state.service';
import { RedisSocketEventSendDto } from './dtos/index.dtos';
import { tap } from 'rxjs';
import { RedisPubSubService } from '@redis';

@Injectable()
export class RedisPropagatorService {
  private socketServer: Server;

  public constructor(
    private readonly socketStateService: SocketStateService,
    private readonly redisPubSubService: RedisPubSubService,
  ) {
    this.redisPubSubService
      .fromEvent(' d')
      .pipe(tap(this.consumeSendEvent))
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

  private consumeSendEvent = (eventInfo: RedisSocketEventSendDto): void => {
    const { event, socketId, userId, data } = eventInfo;
    console.log(eventInfo);
    return this.socketStateService
      .get(userId)
      .filter((socket) => socket.id !== socketId)
      .forEach((socket) => socket.emit(event, data));
  };
}
