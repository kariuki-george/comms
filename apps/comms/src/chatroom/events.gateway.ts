import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WsException,
} from '@nestjs/websockets';
import { MessageDto } from './dtos/index.dtos';
import { ChatroomService } from './chatroom.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { AuthenticatedSocket } from '@ws/types/index.types';

@WebSocketGateway()
export class EventsGateway {
  constructor(private readonly chatroomService: ChatroomService) {}
  @SubscribeMessage('chats')
  // @UseInterceptors(RedisPropagatorInterceptor)
  @UseGuards(AuthGuard)
  async addMessage(
    @MessageBody() data: MessageDto,
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    if (!data.chatroomId && !data.message) {
      throw new WsException('Message should have message and chatroomId');
    }
    return this.chatroomService.addMessage(data, client.auth);
  }
}
