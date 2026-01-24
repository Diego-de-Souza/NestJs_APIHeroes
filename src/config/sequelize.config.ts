import { SequelizeModuleAsyncOptions } from '@nestjs/sequelize';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

const logger = new Logger('SequelizeConfig');

export const sequelizeAsyncConfig: SequelizeModuleAsyncOptions = {
  inject: [ConfigService],
  useFactory: async (config: ConfigService) => {
    try {
      // Tenta carregar o pg explicitamente
      const pg = await import('pg');
      logger.log('Driver PostgreSQL (pg) carregado com sucesso');
    } catch (error) {
      logger.error('❌ Driver pg não encontrado. Instale com: npm install pg');
      throw new Error('Pacote pg não instalado. Execute: npm install pg');
    }

    // Verifica se existe DATABASE_URL (comum no Supabase/Vercel)
    const databaseUrl = config.get<string>('DATABASE_URL');
    
    let configObj: any;

    if (databaseUrl) {
      // Usa DATABASE_URL se disponível (Supabase/Vercel)
      try {
        const url = new URL(databaseUrl);
        const isSupabase = url.hostname.includes('supabase.co');
        
        logger.log(`Conectando via DATABASE_URL (Supabase: ${isSupabase})`);
        
        configObj = {
          dialect: 'postgres' as const,
          host: url.hostname,
          port: Number(url.port || 5432),
          username: url.username,
          password: url.password,
          database: url.pathname.slice(1), // Remove a barra inicial
          
          autoLoadModels: true,
          synchronize: false,
          logging: process.env.NODE_ENV !== 'production',
          
          // Supabase sempre requer SSL
          dialectOptions: {
            ssl: {
              require: true,
              rejectUnauthorized: false,
            },
            connectTimeout: 30000, // Timeout de conexão maior para serverless
            keepAlive: true,
            keepAliveInitialDelayMillis: 10000,
          },
          
          // Pool otimizado para serverless (menos conexões)
          pool: {
            max: process.env.VERCEL ? 2 : 10, // Menos conexões no Vercel
            min: 0,
            acquire: 60000, // Timeout maior para adquirir conexão
            idle: 10000,
            evict: 1000, // Remove conexões idle rapidamente no serverless
          },
        };
      } catch (error) {
        logger.error('Erro ao parsear DATABASE_URL:', error);
        throw new Error('DATABASE_URL inválida');
      }
    } else {
      // Usa variáveis individuais (desenvolvimento local)
      const host = config.get<string>('DB_HOST');
      const useSSL = config.get('DB_SSL') === 'true' || host?.includes('supabase.co');
      
      logger.log(`Conectando ao PostgreSQL em ${host} (SSL: ${useSSL})`);

      configObj = {
        dialect: 'postgres' as const,
        host,
        port: Number(config.get<number>('DB_PORT') || 5432),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),

        autoLoadModels: true,
        synchronize: false,
        logging: process.env.NODE_ENV !== 'production',

        // SSL obrigatório para Supabase ou se DB_SSL=true
        ...(useSSL ? {
          dialectOptions: {
            ssl: {
              require: true,
              rejectUnauthorized: false,
            },
            connectTimeout: 30000,
            keepAlive: true,
            keepAliveInitialDelayMillis: 10000,
          },
        } : {}),

        pool: {
          max: 10,
          min: 2,
          acquire: 30000,
          idle: 10000,
        },
      };
    }

    // Log da configuração (sem senha)
    const logConfig = { ...configObj };
    if (logConfig.password) logConfig.password = '***';
    logger.debug('Configuração do Sequelize:', JSON.stringify(logConfig, null, 2));
    
    return configObj;
  },
};