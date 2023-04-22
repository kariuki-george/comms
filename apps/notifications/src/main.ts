import { NestFactory } from '@nestjs/core';
import { NotificationsModule } from './notifications.module';

import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { outsideNestIOCConfig } from '@lib/config';

async function bootstrap() {
  const app = await NestFactory.create(NotificationsModule);
  const configService = outsideNestIOCConfig;
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      subscribe: {
        fromBeginning: false,
      },
      consumer: {
        groupId: 'Nofifications',
      },
      client: {
        clientId: 'Nofifications',
        brokers: [configService.KAFKA_URI],
      },
    },
  });

  app.setGlobalPrefix('/notifications');

  await app.startAllMicroservices();
  await app.listen(configService.NOTIFICATIONS_PORT, () => {
    console.log('Started the server on port', configService.NOTIFICATIONS_PORT);
  });
}
bootstrap();
