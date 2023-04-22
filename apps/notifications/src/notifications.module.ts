import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { EmailsService } from './emails.service';
import { EventsController } from './events.controller';

@Module({
  imports: [],
  controllers: [NotificationsController, EventsController],
  providers: [NotificationsService, EmailsService],
})
export class NotificationsModule {}
