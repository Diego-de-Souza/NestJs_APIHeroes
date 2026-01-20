import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import * as bodyParser from 'body-parser';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  const configService = app.get(ConfigService);
  const port = process.env.PORT || configService.get('PORT') || 3000;

  logger.log('Environment PORT: ' + process.env.PORT);
  logger.log('Config Service PORT: ' + configService.get('PORT'));
  logger.log('url banco de dados: ' + configService.get('DATABASE_URL'));
  logger.log('Banco de dados:' + ' ' + configService.get('DATABASE_NAME'));


  app.use('/api/payment/webhook', express.raw({ type: '*/*' }));
  
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

  app.setGlobalPrefix('api');
  app.enableCors({
    origin: [configService.get('FRONTEND_URL')],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: [
      'Content-Type', 
      'Accept', 
      'Authorization',
      'X-Requested-With',
      'x-session-token' 
    ],
    credentials: true
  });
  app.useGlobalPipes(new ValidationPipe({transform: true, whitelist: true, forbidNonWhitelisted: true}));
  
  // MANTÉM o middleware de logging
  if (process.env.NODE_ENV !== 'production') {
    app.use((req, res, next) => {
      logger.debug(`${req.method} ${req.url}`);
      if (req.body && req.body.data) {
        logger.debug('Body:', JSON.stringify(req.body.data, null, 2));
      } else if (req.body) {
        logger.debug('Body:', JSON.stringify(req.body, null, 2));
      } else {
        logger.debug('No body provided');
      }
      next();
    });
  }


  await app.init();
  if (require.main === module) {
    await app.listen(port);
    logger.log(`🚀 API rodando na porta ${port}`);
  }

  return app;
}

if (require.main === module) {
  bootstrap();
}

export default bootstrap;