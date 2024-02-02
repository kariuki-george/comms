import { WebSocketGateway } from '@nestjs/websockets';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@WebSocketGateway({
  cors: {
    allowedHeaders: ['aid'],
  },
  allowUpgrades: true,
  transports: ['websocket', 'polling'],
})
@UseGuards(AuthGuard)
export class BaseEventsGateway {}
