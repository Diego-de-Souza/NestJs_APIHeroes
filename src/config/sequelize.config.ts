import { SequelizeModuleOptions } from '@nestjs/sequelize';

const isProduction = process.env.NODE_ENV === 'production';

function loadPostgresDriver() {
  try {
    const pg = require('pg');
    console.log('✅ PostgreSQL driver loaded successfully');
    return pg;
  } catch (error) {
    console.error('❌ Failed to load PostgreSQL driver:', error.message);
    throw error;
  }
}

export const sequelizeConfig: SequelizeModuleOptions = isProduction && process.env.DATABASE_URL
  ? {
      dialect: 'postgres',
      dialectModule: loadPostgresDriver(),
      host: new URL(process.env.DATABASE_URL).hostname,
      port: parseInt(new URL(process.env.DATABASE_URL).port, 10) || 5432,
      username: new URL(process.env.DATABASE_URL).username,
      password: new URL(process.env.DATABASE_URL).password,
      database: new URL(process.env.DATABASE_URL).pathname.slice(1),
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
    }
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
      logging: console.log,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    };