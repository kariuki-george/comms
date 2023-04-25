import { TENANTS_CREATE } from '@lib/providers/kafka/events';
import { Injectable } from '@nestjs/common';
import { Tenant } from 'src/tenants/models/tenant.model';
import { EmailsService } from './emails.service';
import { KafkaConsumer } from '@lib/providers/kafka/kafkaConsumer.decorator';

@Injectable()
export class EventsService {
  constructor(private readonly emailsService: EmailsService) {}
  // Admin Auth after account creation
  @KafkaConsumer(TENANTS_CREATE)
  createAuth(data: any) {
    this.emailsService.sendEmail(data);
  }
}
