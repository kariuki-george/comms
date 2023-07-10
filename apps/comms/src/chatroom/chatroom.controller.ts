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
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Controller('chatrooms')
export class ChatroomController {
  constructor(
    private readonly chatroomService: ChatroomService,
    private readonly configService: ConfigService,
  ) {}

  @Post()
  async createChatRoom(@Body() input: CreateChatroomDto, @Req() req) {
    // Get country

    let country = { country: 'KE' };
    const ip = req.socket.remoteAddress as string;

    if (ip.includes('127.0.0.')) {
      return this.chatroomService.createChatRoom(input, country);
    }

    // Get user location

    try {
      const res = await axios.get('https://ipinfo.io/', {
        params: {
          token: this.configService.get('IPINFO_TOKEN'),
        },
      });
      country = res.data;
    } catch (error: any) {
      country = {
        country: 'N/A',
      };
    }

    return this.chatroomService.createChatRoom(input, country);
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

  @Get()
  @UseGuards(AuthGuard)
  getChatrooms(@Req() req) {
    return this.chatroomService.getMyChatrooms(req.user.id);
  }
}
