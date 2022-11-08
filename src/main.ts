import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import redisPermission from "./permission/redis.permission";
import * as cors from 'cors';
import { ServerResponse } from "http";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(redisPermission());

  app.use(cors({
    credentials: true,
    origin: true,
  }));

  await app.listen(3000);
}

bootstrap();

