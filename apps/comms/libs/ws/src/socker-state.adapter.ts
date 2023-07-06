import { INestApplicationContext, WebSocketAdapter } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { SocketStateService } from './socket-state.service';
import { RedisPropagatorService } from './redis-consumer.service';
import socketio from 'socket.io';
import { AuthenticatedSocket } from './types/index.types';
import { WsException } from '@nestjs/websockets';
import { decode } from 'jsonwebtoken';

export class SocketStateAdapter extends IoAdapter implements WebSocketAdapter {
  private server: socketio.Server;
  public constructor(
    private readonly app: INestApplicationContext,
    private readonly socketStateService: SocketStateService,
    private readonly redisPropagatorService: RedisPropagatorService,
  ) {
    super(app);
  }

  public createIOServer(
    port: number,
    options: socketio.ServerOptions,
  ): socketio.Server {
    this.server = super.createIOServer(port, options);
    this.redisPropagatorService.injectSocketServer(this.server);

    this.server.use(async (socket: AuthenticatedSocket, next) => {
      const token = socket.handshake.headers.aid as string;

      if (!token) {
        return next(new WsException('Unauthorised'));
      }

      // A simple authentication for the token.
      // Doesn't cross-check with the user

      const user = decode(token);
      if (!user) {
        return next(new WsException('Unauthorised'));
      }

      socket.auth = user;
      next();
    });

    return this.server;
  }
  // eslint-disable-next-line @typescript-eslint/ban-types
  public bindClientConnect(server: socketio.Server, callback: Function): void {
    server.on('connection', (socket: AuthenticatedSocket) => {
      if (socket.auth) {
        console.log(socket.auth.id.toString());
        this.socketStateService.add(socket.auth.id.toString(), socket);

        socket.on('disconnect', () => {
          this.socketStateService.remove(socket.auth.id, socket);
        });
      }

      callback(socket);
    });
  }
}
