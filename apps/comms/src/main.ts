import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { initAdapters } from '@ws/adapter.init';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('comms');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.use(cookieParser());
  initAdapters(app);
  await app.listen(3000, () => {
    console.log('Comms server started successfully');
  });
}
bootstrap();
