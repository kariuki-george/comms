import { INestApplicationContext, WebSocketAdapter } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { SocketStateService } from './socket-state.service';
import socketio from 'socket.io';
import { AuthenticatedSocket } from './types/index.types';
import { WsException } from '@nestjs/websockets';
import { decode } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

export class SocketStateAdapter extends IoAdapter implements WebSocketAdapter {
  private server: socketio.Server;
  public constructor(
    private readonly app: INestApplicationContext,
    private readonly socketStateService: SocketStateService,
    private readonly configService: ConfigService,
  ) {
    super(app);
  }

  public createIOServer(
    port: number,
    options: socketio.ServerOptions,
  ): socketio.Server {
    this.server = super.createIOServer(port, {
      ...options,
      cors: {
        ...options.cors,
        origin:
          this.configService.get<string>('NODE_ENV') &&
          this.configService.get<string>('NODE_ENV') === 'production'
            ? [
                'https://comms.p.kariukigeorge.me',
                'https://comms-test.p.kariukigeorge.me',
              ]
            : '*',
      },
    });

    this.server.use(async (socket: AuthenticatedSocket, next) => {
      const token = socket.handshake.headers.aid as string;

      // TODO: HANDLE ERROR MORE GRACEFULLY
      if (!token) {
        return next(new WsException('Unauthorised'));
      }

      const user = decode(token);
      if (!user) {
        return next(new WsException('Unauthorised'));
      }

      socket.user = user;
      next();
    });

    return this.server;
  }
  // eslint-disable-next-line @typescript-eslint/ban-types
  public bindClientConnect(server: socketio.Server, callback: Function): void {
    server.on('connection', (socket: AuthenticatedSocket) => {
      if (socket.user) {
        this.socketStateService.add(socket.user.id.toString(), socket);

        socket.on('disconnect', () => {
          this.socketStateService.remove(socket.user.id, socket);
        });
      }

      callback(socket);
    });
  }
}
