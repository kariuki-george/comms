import { Injectable } from '@nestjs/common';
import { AuthenticatedSocket } from './types/index.types';

// Improve the map to be on redis memory instead of node's memory
@Injectable()
export class SocketStateService {
  private socketState = new Map<string, AuthenticatedSocket[]>();

  public add(userId: string, socket: AuthenticatedSocket): boolean {
    const existingSockets = this.socketState.get(userId) || [];

    const sockets = [...existingSockets, socket];

    this.socketState.set(userId, sockets);

    return true;
  }

  public remove(userId: string, socket: AuthenticatedSocket): boolean {
    const existingSockets = this.socketState.get(userId);

    if (!existingSockets) {
      return true;
    }

    const sockets = existingSockets.filter((s) => s.id !== socket.id);

    if (!sockets.length) {
      this.socketState.delete(userId);
    } else {
      this.socketState.set(userId, sockets);
    }

    return true;
  }

  public get(userId: string): AuthenticatedSocket[] {
    return this.socketState.get(userId) || [];
  }
  public getAll(): AuthenticatedSocket[] {
    const all = [];

    this.socketState.forEach((sockets) => all.push(sockets));

    return all;
  }
}
