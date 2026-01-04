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

export const sequelizeConfig: SequelizeModuleOptions = isProduction && process.env.DATABASE_URL
  ? (() => {
      const dbUrl = new URL(process.env.DATABASE_URL);
      // Se SUPABASE_SERVICE_ROLE_KEY estiver definida, usa ela para bypassar o RLS
      const password = process.env.SUPABASE_SERVICE_ROLE_KEY || dbUrl.password;
      // No Supabase, o usuário geralmente é 'postgres'
      const username = process.env.SUPABASE_SERVICE_ROLE_KEY ? 'postgres' : dbUrl.username;
      
      return {
        dialect: 'postgres',
        dialectModule: loadPostgresDriver(),
        host: dbUrl.hostname,
        port: parseInt(dbUrl.port, 10) || 5432,
        username: username,
        password: password,
        database: dbUrl.pathname.slice(1),
        autoLoadModels: true,
        synchronize: false,
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        },
        logging: false,
        pool: {
          max: 10,
          min: 2,
          acquire: 30000,
          idle: 10000,
        },
      };
    })()
  : {
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
        ssl: false,
      },
      logging: (msg: string) => logger.debug(msg),
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    };