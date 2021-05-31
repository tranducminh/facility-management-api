import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/exceptions/all-exception.filter';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { json, urlencoded } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env.ALLOWED_DOMAINS.split(','),
    credentials: true,
  });
  app.useGlobalFilters(new AllExceptionsFilter());
  app.use(cookieParser());
  app.use(json({ limit: process.env.UPLOAD_LIMIT }));
  app.use(urlencoded({ extended: true, limit: process.env.UPLOAD_LIMIT }));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.setGlobalPrefix('api');
  await app.listen(8000);
}
bootstrap();
