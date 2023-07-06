import { Global, Module } from '@nestjs/common';
import { SocketStateService } from './socket-state.service';
import { RedisPropagatorService } from './redis-consumer.service';
import { WSService } from './ws.service';

@Global()
@Module({
  providers: [SocketStateService, RedisPropagatorService, WSService],
  exports: [RedisPropagatorService],
})
export class WsModule {}
