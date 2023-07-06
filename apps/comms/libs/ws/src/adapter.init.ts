import { INestApplication } from '@nestjs/common';
import { SocketStateService } from './socket-state.service';
import { SocketStateAdapter } from './socker-state.adapter';
import { RedisPropagatorService } from './redis-consumer.service';

export const initAdapters = (app: INestApplication): INestApplication => {
  const socketStateService = app.get(SocketStateService);
  const redisPropagatorService = app.get(RedisPropagatorService);
  app.useWebSocketAdapter(
    new SocketStateAdapter(app, socketStateService, redisPropagatorService),
  );
  return app;
};
