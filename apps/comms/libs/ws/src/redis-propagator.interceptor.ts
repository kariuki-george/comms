import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { WsResponse } from '@nestjs/websockets';
import { Observable, map, tap } from 'rxjs';
import { AuthenticatedSocket } from './types/index.types';
import { RedisPropagatorService } from './redis-consumer.service';

@Injectable()
export class RedisPropagatorInterceptor<T>
  implements NestInterceptor<T, WsResponse<T>>
{
  public constructor(
    private readonly redisPropagatorService: RedisPropagatorService,
  ) {}

  public intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<WsResponse<T>> {
    const socket: AuthenticatedSocket = context.switchToWs().getClient();

    return next
      .handle()
      .pipe(
        tap((data) => {
          this.redisPropagatorService.propagateEvent(data.channel, {
            ...data.data,
            userId: socket.auth?.id,
            socketId: socket.id,
          });
        }),
      )
      .pipe(map((data) => data.data));
  }
}
