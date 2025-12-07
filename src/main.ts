import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

// REMOVE APENAS: import * as express from 'express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = process.env.PORT || configService.get('PORT') || 3000;

  app.use(cookieParser());
  app.use(bodyParser.json({ limit: '20mb' }));
  app.use(bodyParser.urlencoded({ limit: '20mb', extended: true }));

  if (process.env.NODE_ENV !== 'production' || process.env.ENABLE_SWAGGER === 'true') {
    const config = new DocumentBuilder()
      .setTitle('Heroes Platform API')
      .setDescription('Heroes Platform API for front end interaction')
      .setVersion('1.0')
      .addTag('Heroes Platform')
      .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, documentFactory, {
      jsonDocumentUrl: 'swagger/json',
      swaggerOptions: {
      persistAuthorization: true, 
    } 
    });
  }

  // REMOVE APENAS: app.use(express.json());
  
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: [configService.get('FRONTEND_URL')],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: [
      'Content-Type', 
      'Accept', 
      'Authorization',
      'X-Requested-With',
      'Cookie', 'Set-Cookie'
    ],
    credentials: true
  });
  app.useGlobalPipes(new ValidationPipe({transform: true, whitelist: true, forbidNonWhitelisted: true}));
  
  // MANTÉM o middleware de logging
  if (process.env.NODE_ENV !== 'production') {
    app.use((req, res, next) => {
      console.log(`${req.method} ${req.url}`);
      if (req.body && req.body.data) {
        console.log('Body:', JSON.stringify(req.body.data, null, 2));
      } else if (req.body) {
        console.log('Body:', JSON.stringify(req.body, null, 2));
      } else {
        console.log('No body provided');
      }
      next();
    });
  }


  await app.init();
  // MUDA APENAS o listen:
  if (require.main === module) {
    await app.listen(port);
    console.log(`🚀 API rodando na porta ${port}`);
  }

  return app;
}

if (require.main === module) {
  bootstrap();
}

export default bootstrap;