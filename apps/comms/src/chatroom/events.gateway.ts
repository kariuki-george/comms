import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { MessageDto } from './dtos/index.dtos';
import { ChatroomService } from './chatroom.service';
import { UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RedisPropagatorInterceptor } from '@ws';
import { AuthenticatedSocket } from '@ws/types/index.types';

@WebSocketGateway()
export class EventsGateway {
  constructor(private readonly chatroomService: ChatroomService) {}
  @SubscribeMessage('chats')
  @UseInterceptors(RedisPropagatorInterceptor)
  @UseGuards(AuthGuard)
  async addMessage(
    @MessageBody() data: MessageDto,
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    return this.chatroomService.addMessage(data, client.auth.sender ?? 'AGENT');
  }
}
