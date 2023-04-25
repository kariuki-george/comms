import { Injectable } from '@nestjs/common';
import { KafkaProducer } from './kafka.producer';

@Injectable()
export class EventsService {
  constructor(private readonly producerService: KafkaProducer) {}
  async publishEvent(data: object, topic: string) {
    await this.producerService.publish({
      messages: [{ value: JSON.stringify(data), partition: 0 }],
      topic,
    });
  }
}
