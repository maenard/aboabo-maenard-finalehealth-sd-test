import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const configService = app.get(ConfigService)
  const origin = configService.get('FRONTEND_URL')

  app.enableCors({
    origin: origin
  })
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
