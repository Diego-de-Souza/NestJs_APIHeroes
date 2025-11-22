import { Module } from '@nestjs/common';
import { appModules } from 'src/interface/modules/index.modules';
import { SequelizeModule } from '@nestjs/sequelize';
import { sequelizeConfig } from 'src/config/sequelize.config';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    SequelizeModule.forRoot(sequelizeConfig),
    ...appModules,
  ],
})
export class AppModule  {}
