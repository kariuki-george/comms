import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatsServiceService {
  getHello(): string {
    return 'Hello World!';
  }
}
