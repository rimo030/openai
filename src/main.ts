import { WebSocketAdaptor } from '@nestia/core';
import { NestFactory } from '@nestjs/core';
import * as express from 'express';
import { AppModule } from './app.module';
import { GlobalConfig } from './global.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(express.json({ limit: '20mb' }));
  app.use(express.urlencoded({ limit: '20mb', extended: true }));
  app.enableCors();

  /**
   * 시딩 삽입
   */
  await GlobalConfig.seeding();

  /**
   * 웹 소켓 프로토콜
   *
   * @link https://nestia.io/docs/core/WebSocketRoute/
   */
  await WebSocketAdaptor.upgrade(app);

  await app.listen(GlobalConfig.env.PORT ?? 3000);
}
bootstrap();
