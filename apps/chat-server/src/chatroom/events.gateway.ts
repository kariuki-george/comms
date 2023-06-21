import { UseInterceptors } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { RedisPropagatorInterceptor } from 'ws/ws/redis-propagator.interceptor';
import { MessageDto } from './dtos/index.dtos';

@UseInterceptors(RedisPropagatorInterceptor)
@WebSocketGateway()
export class EventsGateway {
  @SubscribeMessage('events')
  handleEvent(@MessageBody() data: string) {
    return data + data;
  }
  @SubscribeMessage('messages')
  addMessage(@MessageBody() data: MessageDto) {
    return data;
  }
}
