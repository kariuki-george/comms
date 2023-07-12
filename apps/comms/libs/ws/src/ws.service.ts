import { Injectable } from '@nestjs/common';
import { SocketStateService } from './socket-state.service';
import { AddMessageEventDto } from './dtos/index.dtos';
import { AuthenticatedSocket } from './types/index.types';

@Injectable()
export class WSService {
  public constructor(private readonly socketStateService: SocketStateService) {}

  public emitAddMessage = (eventInfo: AddMessageEventDto) => {
    const { Chatroom, message, chatroomId, id, sender } = eventInfo;

    //   Emit to user and agents

    const agentIdSockets = Chatroom.agentId
      ? this.socketStateService.get(Chatroom.agentId.toString())
      : [];

    [
      ...agentIdSockets,
      ...this.socketStateService.get(Chatroom.userEmail),
    ].forEach((socket: AuthenticatedSocket) => {
      socket.emit('chats', { message, chatroomId, sender, id });
    });

    return;
  };
}
