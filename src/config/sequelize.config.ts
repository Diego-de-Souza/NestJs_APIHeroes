import { SequelizeModuleOptions } from '@nestjs/sequelize';
import { Logger } from '@nestjs/common';

const logger = new Logger('SequelizeConfig');
const isProduction = process.env.NODE_ENV === 'production';

function loadPostgresDriver() {
  try {
    const pg = require('pg');
    logger.log('✅ PostgreSQL driver loaded successfully');
    return pg;
  } catch (error) {
    logger.error('❌ Failed to load PostgreSQL driver:', error.message);
    throw error;
  }
}

export const sequelizeConfig: SequelizeModuleOptions = (() => {
      // Prioridade 1: DATABASE_URL (para compatibilidade, mas agora é RDS)
      // Prioridade 2: Variáveis individuais (DB_HOST, DB_USERNAME, etc.)
      // Prioridade 3: Valores padrão para desenvolvimento local
      
      if (isProduction && process.env.DATABASE_URL) {
        // Se DATABASE_URL está definido (pode ser RDS ou outro PostgreSQL)
        const dbUrl = new URL(process.env.DATABASE_URL);
        return {
          dialect: 'postgres',
          dialectModule: loadPostgresDriver(),
          host: dbUrl.hostname,
          port: parseInt(dbUrl.port, 10) || 5432,
          username: dbUrl.username,
          password: dbUrl.password,
          database: dbUrl.pathname.slice(1),
          autoLoadModels: true,
          synchronize: false,
          dialectOptions: {
            ssl: process.env.DB_SSL === 'true' ? {
              require: true,
              rejectUnauthorized: false,
            } : false,
          },
          logging: false,
          pool: {
            max: 10,
            min: 2,
            acquire: 30000,
            idle: 10000,
          },
        };
      }
      
      // Usar variáveis individuais (RDS padrão ou desenvolvimento)
      return {
      dialect: 'postgres',
      dialectModule: loadPostgresDriver(),
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'HeroesPlataform',
      autoLoadModels: true,
      synchronize: false,
      dialectOptions: {
        // RDS geralmente não requer SSL no mesmo VPC, mas pode configurar se necessário
        ssl: process.env.DB_SSL === 'true' ? {
          require: true,
          rejectUnauthorized: false,
        } : false,
      },
      logging: isProduction ? false : (msg: string) => logger.debug(msg),
      pool: {
        max: isProduction ? 10 : 5,
        min: isProduction ? 2 : 0,
        acquire: 30000,
        idle: 10000,
      },
    };
})();