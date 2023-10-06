import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

process.env.TZ = 'Europe/Kiev';

async function bootstrap() {
  // INIT
  const app = await NestFactory.createApplicationContext(AppModule);
  await app.init();
}

bootstrap();
