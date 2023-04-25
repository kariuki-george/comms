import { Injectable } from '@nestjs/common';
import { ApiStatus } from 'lib/shared';

@Injectable()
export class AppService {
  getStatus(): ApiStatus {
    return { status: 'ok' };
  }
}
