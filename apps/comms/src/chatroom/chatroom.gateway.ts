import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WsException,
} from '@nestjs/websockets';
import { MessageDto } from './dtos/index.dtos';
import { ChatroomService } from './chatroom.service';
import { AuthenticatedSocket } from '@ws/types/index.types';
import { BaseEventsGateway } from '@ws/ws.events';

@WebSocketGateway()
export class ChatroomGateway extends BaseEventsGateway {
  constructor(private readonly chatroomService: ChatroomService) {
    super();
  }
  @SubscribeMessage('chats.new')
  async addMessage(
    @MessageBody() data: MessageDto,
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    if (!data.chatroomId && !data.message) {
      throw new WsException('Message should have message and chatroomId');
    }
    return this.chatroomService.addMessage(data, client.user);
  }

  // @SubscribeMessage('chatrooms.new')
  // async newChatrooms() {
  //   return this.chatroomService.newChatrooms();
  // }

  @SubscribeMessage('chatrooms.join')
  async joinChatroom(
    @MessageBody() chatroomId: number,
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    return this.chatroomService.joinChatRoom(chatroomId, client.user);
  }
  @SubscribeMessage('chatrooms.close')
  async closeChatroom(
    @MessageBody() chatroomId: number,
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    return this.chatroomService.closeChatroom(chatroomId);
  }
}
