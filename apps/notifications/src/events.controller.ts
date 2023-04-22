import { TENANTS_CREATE } from '@lib/providers/kafka/events';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Tenant } from 'apps/intercom-backend/src/tenants/models/tenant.model';
import { EmailsService } from './emails.service';

@Controller()
export class EventsController {
  constructor(private readonly emailsService: EmailsService) {}
  // Admin Auth after account creation
  @MessagePattern(TENANTS_CREATE)
  createAuth(@Payload() message: Partial<Tenant>) {
    this.emailsService.sendEmail(message);
  }
}
