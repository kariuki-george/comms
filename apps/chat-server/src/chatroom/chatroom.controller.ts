import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { ChatroomService } from './chatroom.service';
import { CreateChatroomDto } from './dtos/index.dtos';

@Controller('chatrooms')
export class ChatroomController {
  constructor(private readonly chatroomService: ChatroomService) {}

  @Post()
  async createChatRoom(@Body() input: CreateChatroomDto) {
    if (!input.email || !input.name || !Number(input.chatbotId)) {
      throw new BadRequestException('Email, name and chatbotId required!');
    }

    return await this.chatroomService.createChatRoom(input);
  }
}
