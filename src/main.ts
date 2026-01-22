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
  const logger = new Logger('Bootstrap');
  

  logger.log('Environment PORT: ' + process.env.PORT);
  logger.log('SERVICE_ROLE_KEY com process: ' + process.env.SERVICE_ROLE_KEY);
  logger.log('R2_ACCESS_KEY: ' + process.env.R2_ACCESS_KEY);
  logger.log('NODE_ENV: ' + process.env.NODE_ENV);
  logger.log('DB_HOST: ' + process.env.DB_HOST);
  logger.log('DB_NAME: ' + process.env.DB_NAME);
  logger.log('DB_USERNAME: ' + process.env.DB_USERNAME);
  logger.log('DB_PASSWORD: ' + process.env.DB_PASSWORD);
  logger.log('DB_PORT: ' + process.env.DB_PORT);
  logger.log('DB_SSL: ' + process.env.DB_SSL);
  logger.log('FRONTEND_URL: ' + process.env.FRONTEND_URL);

  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  logger.log('Config Service PORT: ' + configService.get('PORT'));
    logger.log('url banco de dados: ' + configService.get('DB_HOST'));
    logger.log('Banco de dados:' + ' ' + configService.get('DB_NAME'));
    logger.log('URL frontend: ' + configService.get('FRONTEND_URL'));
    logger.log('SERVICE_ROLE_KEY: ' + configService.get('SERVICE_ROLE_KEY'));
    logger.log('R2_ACCESS_KEY: ' + configService.get('R2_ACCESS_KEY'));


  const port = process.env.PORT || configService.get('PORT') || 3000;

  
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
  const allowedOrigins = [
    'https://heroesplatform.com.br',
    'https://www.heroesplatform.com.br'
  ];

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error('CORS not allowed'), false);
    },
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept'
    ]
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
    await app.listen(port, '0.0.0.0');
    logger.log(`🚀 API rodando na porta ${port}`);
    logger.log('Environment PORT: ' + process.env.PORT);
    logger.log('Config Service PORT: ' + configService.get('PORT'));
    logger.log('url banco de dados: ' + configService.get('DB_HOST'));
    logger.log('Banco de dados:' + ' ' + configService.get('DB_NAME'));
    logger.log('URL frontend: ' + configService.get('FRONTEND_URL'));
    logger.log('SERVICE_ROLE_KEY: ' + configService.get('SERVICE_ROLE_KEY'));
    logger.log('R2_ACCESS_KEY: ' + configService.get('R2_ACCESS_KEY'));
    logger.log('SERVICE_ROLE_KEY com process: ' + process.env.SERVICE_ROLE_KEY);
    logger.log('R2_ACCESS_KEY: ' + process.env.R2_ACCESS_KEY);
  }

  return app;
}

if (require.main === module) {
  bootstrap();
}

export default bootstrap;