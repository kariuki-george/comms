import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { outsideNestIOCConfig } from '@lib/config';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = outsideNestIOCConfig;

  app.useGlobalPipes(new ValidationPipe({ skipMissingProperties: true }));
  app.setGlobalPrefix('/intercom');
  app.use(cookieParser());

  const config = new DocumentBuilder()
    .setTitle('Intercom Clone')
    .setDescription('The intercom base business logic for tenants')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('intercom/docs', app, document);

  await app.listen(configService.INTERCOM_PORT, () => {
    console.log('Started the server on port', configService.INTERCOM_PORT);
  });
}
bootstrap();
