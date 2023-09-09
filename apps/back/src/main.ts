import { NestFactory } from '@nestjs/core';
import { config } from 'dotenv';
config();
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(8000);
}
bootstrap();
