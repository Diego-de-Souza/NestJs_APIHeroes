import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
   getHello(): any {
    return {
      message: 'Heroes Platform API is running! 🚀',
      status: 'success',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      endpoints: {
        auth: '/api/auth',
        heroes: '/api/dados-herois',
        users: '/api/users',
        quiz: '/api/quiz',
        articles: '/api/articles',
        games: '/api/games',
        studio: '/api/studio',
        team: '/api/team'
      }
    };
  }

  getHealth(): any {
    return {
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      database: 'connected'
    };
  }
}
