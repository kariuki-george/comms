import { Global, Module } from '@nestjs/common';
import { KafkaProducer } from './kafka.producer';
import { EventsService } from './events.service';

@Global()
@Module({ providers: [KafkaProducer, EventsService], exports: [EventsService] })
export class KafkaModule {}
