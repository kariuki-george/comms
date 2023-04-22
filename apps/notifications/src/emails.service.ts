import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailsService {
  sendEmail(data: any) {
    console.log(data);
  }
}
