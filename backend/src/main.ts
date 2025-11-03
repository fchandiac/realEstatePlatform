import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Configuración para archivos grandes (especialmente videos de 60MB)
  app.use(express.json({ limit: '70mb' }));
  app.use(express.urlencoded({ 
    limit: '70mb', 
    extended: true,
    parameterLimit: 50000 
  }));

  // Configuración de CORS
  app.enableCors();

  // Configuración de validación global
  app.useGlobalPipes(new ValidationPipe());

  // Configuración de archivos estáticos
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('Real Estate Platform API')
    .setDescription('API documentation for Real Estate Platform')
    .setVersion('1.0')
    .addTag('multimedia')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port);
}
bootstrap();
