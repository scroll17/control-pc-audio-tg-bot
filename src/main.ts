import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { json } from 'express';

process.env.TZ = 'Europe/Kiev';

async function bootstrap() {
  // INIT
  const app = await NestFactory.create(AppModule);
  await app.init();

  // GET SERVICES
  const configService = app.get(ConfigService);

  // SET VALIDATION
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // TOP-LEVEL MIDDLEWARE
  app.use(json({ limit: '50mb' }));

  // START
  await app.listen(configService.get('port'), () => {
    const logger = new Logger('App');
    logger.verbose(`Running on port: ${configService.get('port')}`);
  });
}

bootstrap();
