import { Injectable } from '@nestjs/common';
import { AuthenticatedSocket } from './types/index.types';

// Improve the map to be on redis memory instead of node's memory
@Injectable()
export class SocketStateService {
  private socketState = new Map<string, AuthenticatedSocket[]>();

  public add(wsRoomKey: string, socket: AuthenticatedSocket): boolean {
    const existingSockets = this.socketState.get(wsRoomKey) || [];

    const sockets = [...existingSockets, socket];

    this.socketState.set(wsRoomKey, sockets);

    return true;
  }

  public remove(wsRoomKey: string, socket: AuthenticatedSocket): boolean {
    const existingSockets = this.socketState.get(wsRoomKey);

    if (!existingSockets) {
      return true;
    }

    const sockets = existingSockets.filter((s) => s.id !== socket.id);

    if (!sockets.length) {
      this.socketState.delete(wsRoomKey);
    } else {
      this.socketState.set(wsRoomKey, sockets);
    }

    return true;
  }

  public get(wsRoomKey: string): AuthenticatedSocket[] {
    return this.socketState.get(wsRoomKey) || [];
  }
  public getAll(): AuthenticatedSocket[] {
    const all = [];

    this.socketState.forEach((sockets) => all.push(sockets));

    return all;
  }
}
