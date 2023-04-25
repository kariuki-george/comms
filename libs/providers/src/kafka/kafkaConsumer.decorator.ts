import { Kafka } from 'kafkajs';

export const KafkaConsumer =
  (topic: string) =>
  (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const consumerProvider = {
      provide: `KafkaConsumer_${propertyKey}`,
      useFactory: async (kafka: Kafka) => {
        const consumer = kafka.consumer({ groupId: 'Intercom' });
        await consumer.connect();
        await consumer.subscribe({ topic });
        await consumer.run({
          eachMessage: async ({ message }) => {
            const data = message.value.toString();
            descriptor.value.call(target, data);
          },
        });
        return consumer;
      },
    };

    Reflect.defineMetadata(
      'kafka:consumer',
      consumerProvider,
      descriptor.value,
    );

    return descriptor;
  };
