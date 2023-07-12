import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

@Controller('status')
@ApiTags('Status')
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   *
   * @returns The api status
   */
  @ApiOkResponse({ description: 'Returns api status' })
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
