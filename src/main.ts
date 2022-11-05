import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import redisPermission from "./permission/redis.permission";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(redisPermission());

  await app.listen(3000);
}
bootstrap();

