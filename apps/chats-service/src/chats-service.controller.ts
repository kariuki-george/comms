import { Controller, Get } from '@nestjs/common';
import { ChatsServiceService } from './chats-service.service';

@Controller()
export class ChatsServiceController {
  constructor(private readonly chatsServiceService: ChatsServiceService) {}

  @Get()
  getHello(): string {
    return this.chatsServiceService.getHello();
  }
}
