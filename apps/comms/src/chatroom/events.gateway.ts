import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { MessageDto } from './dtos/index.dtos';
import { ChatroomService } from './chatroom.service';
import { UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RedisPropagatorInterceptor } from '@ws';

@WebSocketGateway()
export class EventsGateway {
  constructor(private readonly chatroomService: ChatroomService) {}
  @SubscribeMessage('chats')
  @UseInterceptors(RedisPropagatorInterceptor)
  @UseGuards(AuthGuard)
  addMessage(@MessageBody() data: MessageDto) {
    return this.chatroomService.addMessage(data);
  }
}
