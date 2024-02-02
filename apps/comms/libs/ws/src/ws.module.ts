import { Global, Module } from '@nestjs/common';
import { SocketStateService } from './socket-state.service';
import { WSService } from './ws.service';
@Global()
@Module({
  providers: [SocketStateService, WSService],
  exports: [WSService],
})
export class WsModule {}
