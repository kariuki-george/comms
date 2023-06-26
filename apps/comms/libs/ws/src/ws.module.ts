import { Global, Module } from '@nestjs/common';
import { SocketStateService } from './socket-state.service';
import { RedisPropagatorService } from './redis-propagator.service';

@Global()
@Module({
  providers: [SocketStateService, RedisPropagatorService],
  exports: [RedisPropagatorService],
})
export class WsModule {}
