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

    const host = config.get<string>('DB_HOST');
    const useSSL = config.get('DB_SSL') === 'true';
    
    logger.log(`Conectando ao PostgreSQL em ${host} (SSL: ${useSSL})`);

    const configObj = {
      dialect: 'postgres' as const,
      host,
      port: Number(config.get<number>('DB_PORT') || 5432),
      username: config.get<string>('DB_USERNAME'),
      password: config.get<string>('DB_PASSWORD'),
      database: config.get<string>('DB_NAME'),

      autoLoadModels: true,
      synchronize: false,
      logging: process.env.NODE_ENV !== 'production', // Log apenas em dev

      // Opções de SSL condicionais
      ...(useSSL ? {
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        },
      } : {}),

      pool: {
        max: 10,
        min: 2,
        acquire: 30000,
        idle: 10000,
      },
    };

    logger.debug('Configuração do Sequelize:', configObj);
    return configObj;
  },
};