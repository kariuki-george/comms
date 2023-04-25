import { Global, Module } from '@nestjs/common';
import { KafkaProducer } from './kafka.producer';
import { EventsService } from './events.service';
import { KafkaConsumerService } from './kafkaConsumer.service';

@Global()
@Module({
  providers: [KafkaProducer, EventsService, KafkaConsumerService],
  exports: [EventsService, KafkaConsumerService],
})
export class KafkaModule {}
