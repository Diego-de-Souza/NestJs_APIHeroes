import { Module } from '@nestjs/common';
import { appModules } from './interface/modules/index.modules';
import { SequelizeModule } from '@nestjs/sequelize';
import { sequelizeConfig } from './config/sequelize.config';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MigrationsController } from './interface/controllers/migrations.controller';
import { GenenerateHashUseCase } from './application/use-cases/auth/generate-hash.use-case';

@Module({
  imports: [
    ConfigModule.forRoot(),
    SequelizeModule.forRoot(sequelizeConfig),
    ...appModules
  ],
  controllers: [AppController, MigrationsController],
  providers: [AppService, GenenerateHashUseCase],
})
export class AppModule  {}
