import { Injectable } from '@nestjs/common';
import { ApiStatus } from 'lib/shared';

@Injectable()
export class NotificationsService {
  getStatus(): ApiStatus {
    return { status: 'ok' };
  }
}
