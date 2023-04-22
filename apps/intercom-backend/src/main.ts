import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({}));
  app.setGlobalPrefix('/intercom');

  const config = new DocumentBuilder()
    .setTitle('Intercom Clone')
    .setDescription('The intercom base business logic for tenants')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('intercom/docs', app, document);

  await app.listen(3000);
}
bootstrap();
