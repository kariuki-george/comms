import { Module } from '@nestjs/common';
import { EmailsService } from './emails.service';
import { EventsService } from './events.service';
import { KafkaModule } from '@lib/providers/kafka/kafka.module';

@Module({
  providers: [EmailsService, EventsService],
  imports: [KafkaModule],
})
export class NotificationsModule {}
