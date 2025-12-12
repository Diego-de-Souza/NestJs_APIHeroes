import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import * as bodyParser from 'body-parser';
import express from 'express';

// Tente importar o AppModule dinamicamente
let AppModule: any;

async function getAppModule() {
  if (!AppModule) {
    const appModuleImport = await import('../src/app.module');
    AppModule = appModuleImport.AppModule;
  }
  return AppModule;
}

let cachedApp: any;

async function createApp() {
  if (!cachedApp) {
    try {
      console.log('🔵 Creating NestJS app...');
      
      const expressApp = express();
      const AppModuleClass = await getAppModule();
      
      cachedApp = await NestFactory.create(
        AppModuleClass, 
        new ExpressAdapter(expressApp),
        { 
          logger: process.env.NODE_ENV === 'production' 
            ? ['error'] 
            : ['error', 'warn', 'log'] 
        }
      );

      console.log('🔵 Getting ConfigService...');
      const configService = cachedApp.get(ConfigService);

      cachedApp.use(cookieParser());
      cachedApp.use(bodyParser.json({ limit: '20mb' }));
      cachedApp.use(bodyParser.urlencoded({ limit: '20mb', extended: true }));

      cachedApp.setGlobalPrefix('api');
      
      console.log('🔵 Setting up CORS...');
      const frontendUrl = configService.get('FRONTEND_URL') || process.env.FRONTEND_URL;
      cachedApp.enableCors({
        origin: [
          'https://heroesplatform.com.br',  
          'https://www.heroesplatform.com.br', 
          frontendUrl,                     
          '*',
          'http://localhost:3001'
        ],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        allowedHeaders: [
          'Content-Type', 
          'Accept', 
          'Authorization',
          'X-Requested-With',
          'Cookie', 'Set-Cookie',
          'x-session-token'
        ],
        exposedHeaders: [
          'x-session-token',
          'Authorization'
        ],
        credentials: true
      });
      
      cachedApp.useGlobalPipes(new ValidationPipe({
        transform: true, 
        whitelist: true, 
        forbidNonWhitelisted: true
      }));

      console.log('🔵 Initializing app...');
      await cachedApp.init();
      console.log('✅ NestJS app initialized successfully');
      
    } catch (error) {
      console.error('❌ Error creating NestJS app:', error);
      console.error('Stack:', error.stack);
      throw error;
    }
  }
  
  return cachedApp;
}

export default async (req: any, res: any) => {
  try {
    console.log('🔵 Handler called:', req.method, req.url);
    console.log('🔵 Environment vars:', {
      NODE_ENV: process.env.NODE_ENV,
      FRONTEND_URL: process.env.FRONTEND_URL ? 'SET' : 'NOT SET',
      DB_HOST: process.env.DB_HOST ? 'SET' : 'NOT SET',
      DB_PORT: process.env.DB_PORT ? 'SET' : 'NOT SET',
      DB_USERNAME: process.env.DB_USERNAME ? 'SET' : 'NOT SET',
      DB_PASSWORD: process.env.DB_PASSWORD ? 'SET' : 'NOT SET',
      DB_NAME: process.env.DB_NAME ? 'SET' : 'NOT SET',
      DATABASE_URL: process.env.DATABASE_URL ? 'SET' : 'NOT SET'
    });
    console.log('🍪 RAW COOKIES:', req.headers.cookie); // ✅ ADD ISSO
    console.log('🍪 PARSED COOKIES:', req.cookies);     // ✅ ADD ISSO
    
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', 'https://heroesplatform.com.br');

    // Handle OPTIONS primeiro
    if (req.method === 'OPTIONS') {
      res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
      res.setHeader(
        'Access-Control-Allow-Headers', 
        'Content-Type, Accept, Authorization, X-Requested-With, Cookie, Set-Cookie, x-session-token'
      );
      return res.status(200).end();
    }

    const app = await createApp();
    const expressApp = app.getHttpAdapter().getInstance();

    const originalSend = res.send;
    res.send = function(data: any) {
      console.log('🍪 Response headers:', res.getHeaders());
      return originalSend.call(this, data);
    };
    
    return expressApp(req, res);
  } catch (error) {
    console.error('❌ Error in Vercel handler:', error);
    return res.status(500).json({ 
      error: 'Internal Server Error',
      message: error.message,
      stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined
    });
  }
};