import { Controller, Get } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { ApiStatus } from 'lib/shared';

@Controller()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  getHello(): ApiStatus {
    return this.notificationsService.getStatus();
  }
}
