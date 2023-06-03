import { Module } from '@nestjs/common';
import { ChatroomService } from './chatroom.service';
import { ChatroomController } from './chatroom.controller';
import { ChatroomRepo } from './chatroom.repo';
import { MongooseModule } from '@nestjs/mongoose';
import { Chatroom, ChatroomSchema } from './models/chatroom.model';
import { EventsGateway } from './events.gateway';

@Module({
  controllers: [ChatroomController],
  providers: [ChatroomService, ChatroomRepo],
  imports: [
    MongooseModule.forFeature([
      { name: Chatroom.name, schema: ChatroomSchema },
    ]),
  ],
})
export class ChatroomModule {}
