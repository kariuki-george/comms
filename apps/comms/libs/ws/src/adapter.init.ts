import { INestApplication } from '@nestjs/common';
import { SocketStateService } from './socket-state.service';
import { SocketStateAdapter } from './socker-state.adapter';
import { RedisPropagatorService } from './redis-consumer.service';
import { ConfigService } from '@nestjs/config';

export const initAdapters = (app: INestApplication): INestApplication => {
  const socketStateService = app.get(SocketStateService);
  const redisPropagatorService = app.get(RedisPropagatorService);
  const configService = app.get(ConfigService);
  app.useWebSocketAdapter(
    new SocketStateAdapter(
      app,
      socketStateService,
      redisPropagatorService,
      configService,
    ),
  );
  return app;
};
