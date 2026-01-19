require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';

let config;

if (isProduction && process.env.DATABASE_URL) {
  // Configuração para produção (RDS PostgreSQL)
  const dbUrl = new URL(process.env.DATABASE_URL);
  config = {
    username: dbUrl.username,
    password: dbUrl.password,
    database: dbUrl.pathname.slice(1),
    host: dbUrl.hostname,
    port: dbUrl.port || 5432,
    dialect: 'postgres',
    dialectOptions: {
      // RDS geralmente não requer SSL no mesmo VPC
      ssl: process.env.DB_SSL === 'true' ? {
        require: true,
        rejectUnauthorized: false,
      } : false,
    },
    migrationStorageTableName: 'sequelize_meta',
    seederStorageTableName: 'sequelize_data'
  };
} else {
  // Configuração para desenvolvimento (local PostgreSQL ou RDS via variáveis individuais)
  config = {
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'HeroesPlataform',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    dialect: 'postgres',
    dialectOptions: {
      ssl: process.env.DB_SSL === 'true' ? {
        require: true,
        rejectUnauthorized: false,
      } : false,
    },
    migrationStorageTableName: 'sequelize_meta',
    seederStorageTableName: 'sequelize_data'
  };
}

module.exports = {
  development: config,
  production: config,
  test: config
};