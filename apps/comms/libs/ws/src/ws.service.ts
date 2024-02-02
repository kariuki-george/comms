import { Injectable } from '@nestjs/common';
import { SocketStateService } from './socket-state.service';
import { AuthenticatedSocket } from './types/index.types';

type EventInfo = (
  | {
      userId: number;
      sender: 'USER';
    }
  | { sender: 'AGENT'; agentId: number }
  | { sender: 'MEMBER'; memberId: number }
) & { [key: string]: unknown };

@Injectable()
export class WSService {
  public constructor(private readonly socketStateService: SocketStateService) {}

  public emitMessage = (eventInfo: EventInfo, eventName: string) => {
    if (eventInfo.sender == 'AGENT') {
      this.socketStateService
        .get(eventInfo.agentId.toString())
        .forEach((socket: AuthenticatedSocket) => {
          socket.emit(eventName, eventInfo);
        });

      return;
    }

    if (eventInfo.sender == 'USER') {
      this.socketStateService
        .get(eventInfo.userId.toString())
        .forEach((socket: AuthenticatedSocket) => {
          socket.emit(eventName, eventInfo);
        });
    }
    if (eventInfo.sender == 'MEMBER') {
      this.socketStateService
        .get(eventInfo.memberId.toString())
        .forEach((socket: AuthenticatedSocket) => {
          socket.emit(eventName, eventInfo);
        });
    }
  };
}
