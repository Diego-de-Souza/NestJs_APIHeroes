import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import * as bodyParser from 'body-parser';
import express from 'express';

let cachedApp: any;

async function createApp() {
  if (!cachedApp) {
    const expressApp = express();
    
    cachedApp = await NestFactory.create(
      AppModule, 
      new ExpressAdapter(expressApp),
      { 
        logger: process.env.NODE_ENV === 'production' 
          ? false 
          : ['error', 'warn', 'log'] 
      }
    );

    const configService = cachedApp.get(ConfigService);

    cachedApp.use(cookieParser());
    cachedApp.use(bodyParser.json({ limit: '20mb' }));
    cachedApp.use(bodyParser.urlencoded({ limit: '20mb', extended: true }));

    cachedApp.setGlobalPrefix('api');
    
    // CORS flexível para Vercel
    cachedApp.enableCors({
        origin: [configService.get('FRONTEND_URL')],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        allowedHeaders: [
        'Content-Type', 
        'Accept', 
        'Authorization',
        'X-Requested-With'
        ],
        credentials: true
    });
    
    cachedApp.useGlobalPipes(new ValidationPipe({
      transform: true, 
      whitelist: true, 
      forbidNonWhitelisted: true
    }));

    await cachedApp.init();
  }
  
  return cachedApp;
}

export default async (req: any, res: any) => {
  try {
    const app = await createApp();
    const expressApp = app.getHttpAdapter().getInstance();
    return expressApp(req, res);
  } catch (error) {
    console.error('Error in Vercel handler:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};