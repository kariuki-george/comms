import Config from '@lib/config/config';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Kafka, Producer, ProducerRecord } from 'kafkajs';

@Injectable()
export class KafkaProducer implements OnModuleInit, OnModuleDestroy {
  private producer: Producer;

  constructor(private readonly config: Config) {}

  async onModuleDestroy() {
    await this.producer.disconnect();
  }
  async onModuleInit() {
    const kafka = new Kafka({ brokers: [this.config.KAFKA_URI] });
    this.producer = kafka.producer({ allowAutoTopicCreation: true });
    await this.producer.connect();
  }

  async publish(data: ProducerRecord) {
    await this.producer.send(data);
  }
}
