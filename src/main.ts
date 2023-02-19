import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Philister')
    .setDescription('The philister API description')
    .setVersion('1.0')
    .addTag('philister')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('help', app, document);

  await app.listen(process.env.APP_PORT || 3000);
}

bootstrap();

