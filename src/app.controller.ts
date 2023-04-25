import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiStatus } from 'lib/shared';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Intercom')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiResponse({ status: 200, type: ApiStatus })
  getStatus(): ApiStatus {
    return this.appService.getStatus();
  }
}
