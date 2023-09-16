import { NestFactory } from '@nestjs/core';
import { AppModule } from 'app.module';
import { config } from 'dotenv';
config();

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(8000);
}
bootstrap();
