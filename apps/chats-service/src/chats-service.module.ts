import { Module } from '@nestjs/common';
import { ChatsServiceController } from './chats-service.controller';
import { ChatsServiceService } from './chats-service.service';

@Module({
  imports: [],
  controllers: [ChatsServiceController],
  providers: [ChatsServiceService],
})
export class ChatsServiceModule {}
