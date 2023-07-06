import { Module } from '@nestjs/common';
import { ChatbotsService } from './chatbots.service';
import { ChatbotsController } from './chatbots.controller';

@Module({
  controllers: [ChatbotsController],
  providers: [ChatbotsService],
})
export class ChatbotsModule {}
