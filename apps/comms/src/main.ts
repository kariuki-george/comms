import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { initAdapters } from '@ws/adapter.init';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  const configService = app.get<ConfigService>(ConfigService);
  initAdapters(app);
  app.enableCors({ origin: '*' });
  await app.listen(configService.getOrThrow<'string'>('PORT'), () => {
    console.log('Comms server started successfully');
  });
}
bootstrap();
