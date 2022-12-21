import {
  ClassSerializerInterceptor,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { useContainer } from 'class-validator';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';

import { AppModule } from './app.module';
import validationOptions from './common/validation-options';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe(validationOptions));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const configService = app.get(ConfigService);

  if (process.env.NODE_ENV === 'production') {
    app.use(
      helmet({
        contentSecurityPolicy: false,
      }),
    );
  }

  if (process.env.NODE_ENV === 'development') {
    const config = new DocumentBuilder()
      .setTitle('API')
      .setDescription('API docs')
      .setVersion('0.0.1')
      .addTag('api')
      .addCookieAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);
  }

  const port = configService.get('app.port');
  await app.listen(port, () => {
    Logger.verbose(`🚀 Server is Started!\r\n`);
    Logger.verbose(`📌 Local: http://localhost:${port}`);
    Logger.verbose(`📌 Local: http://0.0.0.0:${port}`);
  });
}
bootstrap();
