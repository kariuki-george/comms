import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { outsideNestIOCConfig } from '@lib/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = outsideNestIOCConfig;
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      subscribe: {
        fromBeginning: false,
      },
      consumer: {
        groupId: 'Intercom',
      },
      client: {
        clientId: 'Intercom',
        brokers: [configService.KAFKA_URI],
      },
    },
  });

  app.useGlobalPipes(new ValidationPipe({}));
  app.setGlobalPrefix('/intercom');

  const config = new DocumentBuilder()
    .setTitle('Intercom Clone')
    .setDescription('The intercom base business logic for tenants')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('intercom/docs', app, document);
  // await app.startAllMicroservices();
  await app.listen(configService.INTERCOM_PORT, () => {
    console.log('Started the server on port', configService.INTERCOM_PORT);
  });
}
bootstrap();
