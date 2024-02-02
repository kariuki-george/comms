import { Module } from '@nestjs/common';
import { ChatroomService } from './chatroom.service';
import { ChatroomController } from './chatroom.controller';
import { ChatroomGateway } from './chatroom.gateway';
import { ChatroomWs } from './chatroom.ws.service';
import { WsModule } from '@ws';

@Module({
  controllers: [ChatroomController],
  providers: [ChatroomService, ChatroomGateway, ChatroomWs],
  imports: [WsModule],
})
export class ChatroomModule {}
