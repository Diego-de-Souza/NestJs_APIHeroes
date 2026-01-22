import { SequelizeModuleAsyncOptions } from '@nestjs/sequelize';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

const logger = new Logger('SequelizeConfig');

export const sequelizeAsyncConfig: SequelizeModuleAsyncOptions = {
  inject: [ConfigService],
  useFactory: async (config: ConfigService) => {
    const host = config.get<string>('DB_HOST');

    logger.log(`Conectando ao PostgreSQL em ${host}`);

    return {
      dialect: 'postgres',
      host,
      port: Number(config.get<number>('DB_PORT') || 5432),
      username: config.get<string>('DB_USERNAME'),
      password: config.get<string>('DB_PASSWORD'),
      database: config.get<string>('DB_NAME'),

      autoLoadModels: true,
      synchronize: false,
      logging: false,

      dialectOptions: {
        ssl: config.get('DB_SSL') === 'true'
          ? {
              require: true,
              rejectUnauthorized: false,
            }
          : false,
      },

      pool: {
        max: 10,
        min: 2,
        acquire: 30000,
        idle: 10000,
      },
    };
  },
};
