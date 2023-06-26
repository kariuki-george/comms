import { Module } from '@nestjs/common';
import { ChatroomService } from './chatroom.service';
import { ChatroomController } from './chatroom.controller';
import { EventsGateway } from './events.gateway';

@Module({
  controllers: [ChatroomController],
  providers: [ChatroomService, EventsGateway],
})
export class ChatroomModule {}
