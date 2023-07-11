import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ChatroomService } from './chatroom.service';
import { CloseChatroomDto, CreateChatroomDto } from './dtos/index.dtos';
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
    console.log(ip);

    // For localhosts
    if (ip.includes('127.0.0.')) {
      return this.chatroomService.createChatRoom(input, country);
    }

    // Get user location

    try {
      const res = await axios.get('https://ipinfo.io/' + ip, {
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

  @Get()
  @UseGuards(AuthGuard)
  getNewChatrooms(@Query('orgId') orgId: string, @Req() req) {
    if (!Number(orgId)) {
      return this.chatroomService.getMyChatrooms(req.user.id);
    }
    return this.chatroomService.getNewChatroom(Number(orgId));
  }

  @Post('/join')
  @UseGuards(AuthGuard)
  async joinChatroom(@Req() req, @Query('chatroomId') chatroomId: string) {
    if (!Number(chatroomId)) {
      throw new BadRequestException('ChatroomId param not defined');
    }
    return this.chatroomService.joinChatRoom(Number(chatroomId), req.user);
  }

  @Get('/messages')
  @UseGuards(AuthGuard)
  getAllMessages(@Query('chatroomId') chatroomId: string) {
    if (!Number(chatroomId)) {
      throw new BadRequestException('ChatroomId query not defined');
    }
    return this.chatroomService.getAllMessages(Number(chatroomId));
  }

  @Post('/close')
  @UseGuards(AuthGuard)
  closeChatroom(@Body() { chatroomId }: CloseChatroomDto) {
    return this.chatroomService.closeChatroom(chatroomId);
  }
}
