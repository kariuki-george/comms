import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ChatbotsService } from './chatbots.service';
import { CreateChatbotDto } from './dtos/index.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import {
  ApiBadRequestResponse,
  ApiHeader,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller('chatbots')
@ApiTags('Chatbots')
export class ChatbotsController {
  constructor(private readonly chatbotsService: ChatbotsService) {}

  @Post()
  @HttpCode(201)
  @ApiOkResponse({ description: 'Chatbot created successfully' })
  @ApiBadRequestResponse({
    description:
      'Thrown on bad DTO, chatbot with the provided name already existing, invalid orgId',
  })
  @UseGuards(AuthGuard)
  @ApiHeader({
    name: 'aid',
    allowEmptyValue: false,

    required: true,
  })
  createChatbot(@Body() input: CreateChatbotDto) {
    return this.chatbotsService.createChatbot(input);
  }

  @Get(':chatbotKey')
  @ApiOkResponse({
    description: 'Returns a chatbot',
  })
  @ApiBadRequestResponse({
    description: 'Thrown when the chatbotKey param is missing',
  })
  getChatBot(@Param('chatbotKey') chatbotKey: string) {
    // TODO: Handle auth to prevent exposing hidden fields
    if (!chatbotKey) {
      throw new BadRequestException('Invalid chatbotKey');
    }

    return this.chatbotsService.findOne(chatbotKey);
  }

  @Get('org/:orgId')
  @UseGuards(AuthGuard)
  @ApiHeader({
    name: 'aid',
    allowEmptyValue: false,

    required: true,
  })
  @ApiOkResponse({
    description: 'Returns a chatbots for an org',
    isArray: true,
  })
  @ApiBadRequestResponse({
    description: 'Thrown when the orgId param is missing',
  })
  getChatbots(@Param('orgId') orgId: string) {
    if (!Number(orgId)) {
      throw new BadRequestException('OrgId param is not defined');
    }
    return this.chatbotsService.findAll(Number(orgId));
  }

  @Delete()
  @ApiOkResponse({
    description: 'Chatbot deleted',
  })
  @ApiBadRequestResponse({
    description: 'Thrown when the chatbotId query is missing',
  })
  @UseGuards(AuthGuard)
  @ApiHeader({
    name: 'aid',
    allowEmptyValue: false,

    required: true,
  })
  deleteChatbot(@Query('chatbotId') chatbotId: string) {
    if (!Number(chatbotId)) {
      throw new BadRequestException('ChatbotId param is not defined');
    }
    return this.chatbotsService.deleteChatbot(Number(chatbotId));
  }
}
