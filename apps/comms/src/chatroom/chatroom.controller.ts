import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
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
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiHeader,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller('chatrooms')
@ApiTags('Chatrooms')
export class ChatroomController {
  constructor(
    private readonly chatroomService: ChatroomService,
    private readonly configService: ConfigService,
  ) {}

  @Post()
  @HttpCode(201)
  @ApiCreatedResponse({ description: 'Chatroom created successfully' })
  @ApiBadRequestResponse({ description: 'Invalid DTO' })
  async createChatRoom(@Body() input: CreateChatroomDto) {
    // Get location
    let location = {};
    try {
      const res = await axios.get('https://ipinfo.io/' + input.ipaddress, {
        params: {
          token: this.configService.get('IPINFO_TOKEN'),
        },
      });
      location = res.data;
    } catch (error: any) {
      location = { country: 'N/A' };
    }
    return this.chatroomService.createChatRoom(input, location);
  }

  @Get()
  @ApiOkResponse({
    isArray: true,
    description:
      'Returns a list chatrooms an agent is subscribed to else all new chatrooms',
  })
  @UseGuards(AuthGuard)
  @ApiHeader({
    name: 'aid',
    allowEmptyValue: false,

    required: true,
  })
  getNewChatrooms(@Query('orgId') orgId: string, @Req() req) {
    if (!Number(orgId)) {
      return this.chatroomService.getMyChatrooms(req.user.id);
    }
    return this.chatroomService.getNewChatroom(Number(orgId));
  }

  @Post('/join')
  @ApiOkResponse({
    description: 'Joined a chatroom successfully',
  })
  @ApiBadRequestResponse({
    description: 'Chatroom Id query param is missing, ',
  })
  @UseGuards(AuthGuard)
  @ApiHeader({
    name: 'aid',
    allowEmptyValue: false,

    required: true,
  })
  async joinChatroom(@Req() req, @Query('chatroomId') chatroomId: string) {
    if (!Number(chatroomId)) {
      throw new BadRequestException('ChatroomId param not defined');
    }
    return this.chatroomService.joinChatRoom(Number(chatroomId), req.user);
  }

  @Get('/messages')
  @UseGuards(AuthGuard)
  @ApiHeader({
    name: 'aid',
    allowEmptyValue: false,

    required: true,
  })
  @ApiOkResponse({
    description: 'A list of all messages belonging to a chatroom',
    isArray: true,
  })
  @ApiBadRequestResponse({
    description: 'Chatroom Id query param is missing, ',
  })
  getAllMessages(@Query('chatroomId') chatroomId: string) {
    if (!Number(chatroomId)) {
      throw new BadRequestException('ChatroomId query not defined');
    }
    return this.chatroomService.getAllMessages(Number(chatroomId));
  }

  @Post('/close')
  @ApiOkResponse({
    description: 'Closed a chatroom successfully',
  })
  @ApiBadRequestResponse({
    description: 'Invalid DTO',
  })
  @UseGuards(AuthGuard)
  @ApiHeader({
    name: 'aid',
    allowEmptyValue: false,

    required: true,
  })
  closeChatroom(@Body() { chatroomId }: CloseChatroomDto) {
    return this.chatroomService.closeChatroom(chatroomId);
  }
}
