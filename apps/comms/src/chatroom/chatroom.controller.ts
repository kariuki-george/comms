import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ChatroomService } from './chatroom.service';
import { CreateChatroomDto } from './dtos/index.dtos';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('chatrooms')
export class ChatroomController {
  constructor(private readonly chatroomService: ChatroomService) {}

  @Post()
  async createChatRoom(@Body() input: CreateChatroomDto) {
    return await this.chatroomService.createChatRoom(input);
  }

  @Get(':orgId')
  @UseGuards(AuthGuard)
  getNewChatbots(@Param('orgId') orgId: string) {
    if (!Number(orgId)) {
      throw new BadRequestException('No orgId param defined');
    }
    return this.chatroomService.getNewChatroom(Number(orgId));
  }

  @Post(':chatroomId')
  @UseGuards(AuthGuard)
  async joinChatroom(@Req() req, @Param('chatroomId') chatroomId: string) {
    if (!Number(chatroomId)) {
      throw new BadRequestException('ChatroomId param not defined');
    }
    return this.chatroomService.joinChatRoom(Number(chatroomId), req.user);
  }
}
