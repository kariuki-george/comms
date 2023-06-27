import { Body, Controller, Post } from '@nestjs/common';
import { ChatroomService } from './chatroom.service';
import { CreateChatroomDto } from './dtos/index.dtos';

@Controller('chatrooms')
export class ChatroomController {
  constructor(private readonly chatroomService: ChatroomService) {}

  @Post()
  async createChatRoom(@Body() input: CreateChatroomDto) {
    return await this.chatroomService.createChatRoom(input);
  }
}
