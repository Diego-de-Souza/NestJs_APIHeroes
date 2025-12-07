import { Module } from '@nestjs/common';
import { appModules } from './interface/modules/index.modules';
import { SequelizeModule } from '@nestjs/sequelize';
import { sequelizeConfig } from './config/sequelize.config';
import { ConfigModule } from '@nestjs/config';
import { ArticleModule } from './interface/modules/articles.Module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MigrationsController } from './interface/controllers/migrations.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    SequelizeModule.forRoot(sequelizeConfig),
    ...appModules
  ],
  controllers: [AppController, MigrationsController],
  providers: [AppService],
})
export class AppModule  {}
