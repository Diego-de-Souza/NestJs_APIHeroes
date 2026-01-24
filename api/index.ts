import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import * as bodyParser from 'body-parser';
import express from 'express';

// Importação direta (evite dynamic import se possível)
import { AppModule } from '../src/app.module';

let cachedServer: any; // Cache para o server Express

async function bootstrapServer() {
  try {
    console.log('🔵 Creating NestJS app...');
    
    const server = express();
    const adapter = new ExpressAdapter(server);
    
    const app = await NestFactory.create(
      AppModule, 
      adapter,
      { 
        logger: process.env.NODE_ENV === 'production' 
          ? ['error'] 
          : ['error', 'warn', 'log'] 
      }
    );

    console.log('🔵 Getting ConfigService...');
    const configService = app.get(ConfigService);

    // Middlewares devem ser aplicados no server Express, não no app NestJS
    server.use('/api/payment/webhook', express.raw({ type: '*/*' }));
    server.use(cookieParser());
    server.use(bodyParser.json({ limit: '20mb' }));
    server.use(bodyParser.urlencoded({ limit: '20mb', extended: true }));

    // Logging de cookies em desenvolvimento
    if (process.env.NODE_ENV !== 'production') {
      server.use((req, res, next) => {
        console.log('🍪 RAW COOKIES:', req.headers.cookie);
        next();
      });
    }

    app.setGlobalPrefix('api');
    
    console.log('🔵 Setting up CORS...');
    const frontendUrl = configService.get('FRONTEND_URL') || process.env.FRONTEND_URL;
    app.enableCors({
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
    
    app.useGlobalPipes(new ValidationPipe({
      transform: true, 
      whitelist: true, 
      forbidNonWhitelisted: true
    }));

    console.log('🔵 Initializing app...');
    await app.init();
    console.log('✅ NestJS app initialized successfully');
    
    return server; // Retorna o server Express, não o app NestJS
    
  } catch (error) {
    console.error('❌ Error creating NestJS app:', error);
    console.error('Stack:', error.stack);
    throw error;
  }
}

export default async (req: any, res: any) => {
  try {
    console.log('🔵 Handler called:', req.method, req.url);
    
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

    // Cache do server
    if (!cachedServer) {
      cachedServer = await bootstrapServer();
    }
    
    // Executa a requisição
    return cachedServer(req, res);
    
  } catch (error) {
    console.error('❌ Error in Vercel handler:', error);
    return res.status(500).json({ 
      error: 'Internal Server Error',
      message: error.message,
      stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined
    });
  }
};