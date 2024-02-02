import { INestApplication } from '@nestjs/common';
import { SocketStateService } from './socket-state.service';
import { SocketStateAdapter } from './socker-state.adapter';
import { ConfigService } from '@nestjs/config';

export const initAdapters = (app: INestApplication): INestApplication => {
  const socketStateService = app.get(SocketStateService);
  const configService = app.get(ConfigService);
  app.useWebSocketAdapter(
    new SocketStateAdapter(app, socketStateService, configService),
  );
  return app;
};
