import {
  Injectable,
  Module,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { Kafka, Consumer } from 'kafkajs';
import Config from '@lib/config/config';

@Injectable()
export class KafkaConsumerService implements OnModuleInit, OnModuleDestroy {
  private consumers: Consumer[] = [];

  constructor(private readonly config: Config) {}

  async onModuleInit() {
    const kafka = new Kafka({ brokers: [this.config.KAFKA_URI] });
    const methods = Reflect.getMetadataKeys(Reflect);
    for (const method of methods) {
      const provider = Reflect.getMetadata('kafka:consumer', method);
      if (provider) {
        const consumer = kafka.consumer({
          groupId: `${method}_${Math.random().toString(36).slice(2, 9)}`, // Generate a unique group ID for each consumer
        });

        await consumer.subscribe({ topic: provider.topic });
        await consumer.run({
          eachMessage: async ({ message }) => {
            const data = message.value.toString();
            const instance = new provider.target.constructor();
            instance.kafka = kafka;
            instance[provider.propertyKey](data);
          },
        });
        this.consumers.push(consumer);
      }
    }
  }

  async onModuleDestroy() {
    await Promise.all(this.consumers.map((consumer) => consumer.disconnect()));
  }
}

@Module({
  providers: [KafkaConsumerService],
  exports: [KafkaConsumerService],
})
export class KafkaConsumerModule {}
