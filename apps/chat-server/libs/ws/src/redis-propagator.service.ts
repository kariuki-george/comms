import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';
import { SocketStateService } from './socket-state.service';
import { RedisSocketEventSendDto } from './dtos/index.dtos';
import { tap } from 'rxjs';
import { RedisPubSubService } from 'redis/redis';

export const REDIS_SOCKET_EVENT_SEND_NAME = 'REDIS_SOCKET_EVENT_SEND_NAME';
export const REDIS_SOCKET_EVENT_EMIT_ALL_NAME =
  'REDIS_SOCKET_EVENT_EMIT_ALL_NAME';
export const REDIS_SOCKET_EVENT_EMIT_AUTHENTICATED_NAME =
  'REDIS_SOCKET_EVENT_EMIT_AUTHENTICATED_NAME';

@Injectable()
export class RedisPropagatorService {
  private socketServer: Server;

  public constructor(
    private readonly socketStateService: SocketStateService,
    private readonly redisPubSubService: RedisPubSubService,
  ) {
    this.redisPubSubService
      .fromEvent(REDIS_SOCKET_EVENT_SEND_NAME)
      .pipe(tap(this.consumeSendEvent))
      .subscribe();

    this.redisPubSubService
      .fromEvent(REDIS_SOCKET_EVENT_EMIT_ALL_NAME)
      .pipe(tap(this.consumeEmitToAllEvent))
      .subscribe();

    this.redisPubSubService
      .fromEvent(REDIS_SOCKET_EVENT_EMIT_AUTHENTICATED_NAME)
      .pipe(tap(this.consumeEmitToAuthenticatedEvent))
      .subscribe();
  }

  public propagateEvent(eventInfo: RedisSocketEventSendDto): boolean {
    console.log(eventInfo);

    if (!eventInfo.userId) return false;

    this.redisPubSubService.publish(REDIS_SOCKET_EVENT_SEND_NAME, eventInfo);
    return true;
  }

  public emitToAuthenticated(eventInfo: RedisSocketEventSendDto): boolean {
    this.redisPubSubService.publish(
      REDIS_SOCKET_EVENT_EMIT_AUTHENTICATED_NAME,
      eventInfo,
    );
    return true;
  }

  public emitToAll(eventInfo: RedisSocketEventSendDto): boolean {
    this.redisPubSubService.publish(
      REDIS_SOCKET_EVENT_EMIT_ALL_NAME,
      eventInfo,
    );
    return true;
  }

  public injectSocketServer(server: Server): RedisPropagatorService {
    this.socketServer = server;
    return this;
  }

  private consumeSendEvent = (eventInfo: RedisSocketEventSendDto): void => {
    const { event, socketId, userId, data } = eventInfo;
    return this.socketStateService
      .get(userId)
      .filter((socket) => socket.id !== socketId)
      .forEach((socket) => socket.emit(event, data));
  };
  private consumeEmitToAllEvent = (
    eventInfo: RedisSocketEventSendDto,
  ): void => {
    this.socketServer.emit(eventInfo.event, eventInfo.data);
  };
  private consumeEmitToAuthenticatedEvent = (
    eventInfo: RedisSocketEventSendDto,
  ): void => {
    const { event, data } = eventInfo;

    return this.socketStateService
      .getAll()
      .forEach((socket) => socket.emit(event, data));
  };
}
