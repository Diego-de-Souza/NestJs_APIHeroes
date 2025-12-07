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
    try {
      const expressApp = express();
      
      cachedApp = await NestFactory.create(
        AppModule, 
        new ExpressAdapter(expressApp),
        { 
          logger: process.env.NODE_ENV === 'production' 
            ? ['error'] 
            : ['error', 'warn', 'log'] 
        }
      );

      const configService = cachedApp.get(ConfigService);

      cachedApp.use(cookieParser());
      cachedApp.use(bodyParser.json({ limit: '20mb' }));
      cachedApp.use(bodyParser.urlencoded({ limit: '20mb', extended: true }));

      cachedApp.setGlobalPrefix('api');
      
      // ✅ CORS corrigido - sem array para valor único
      const frontendUrl = configService.get('FRONTEND_URL');
      cachedApp.enableCors({
        origin: frontendUrl || '*', // ← Sem array, apenas string
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
      console.log('✅ NestJS app initialized successfully');
      
    } catch (error) {
      console.error('❌ Error creating NestJS app:', error);
      throw error;
    }
  }
  
  return cachedApp;
}

export default async (req: any, res: any) => {
  try {
    const app = await createApp();
    const expressApp = app.getHttpAdapter().getInstance();
    return expressApp(req, res);
  } catch (error) {
    console.error('❌ Error in Vercel handler:', error);
    return res.status(500).json({ 
      error: 'Internal Server Error',
      message: error.message 
    });
  }
};