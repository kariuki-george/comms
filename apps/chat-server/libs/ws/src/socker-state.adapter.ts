import { INestApplicationContext, WebSocketAdapter } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { SocketStateService } from './socket-state.service';
import socketio from 'socket.io';
import { RedisPropagatorService } from './redis-propagator.service';

export type AuthenticatedSocket = socketio.Socket & { auth: any };

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
      const token =
        socket.handshake.query?.token ||
        socket.handshake.headers?.authorization;

      if (!token) {
        socket.auth = null;

        // not authenticated connection is still valid
        // thus no error
        return next();
      }

      try {
        // fake auth
        socket.auth = {
          userId: '1234',
        };

        return next();
      } catch (e) {
        return next(e);
      }
    });

    return this.server;
  }
  // eslint-disable-next-line @typescript-eslint/ban-types
  public bindClientConnect(server: socketio.Server, callback: Function): void {
    server.on('connection', (socket: AuthenticatedSocket) => {
      if (socket.auth) {
        this.socketStateService.add(socket.auth.userId, socket);

        socket.on('disconnect', () => {
          this.socketStateService.remove(socket.auth.userId, socket);
        });
      }

      callback(socket);
    });
  }
}
