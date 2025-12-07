import { Controller, Post, Get } from '@nestjs/common';
import { InjectConnection } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';

@Controller('migrations')
export class MigrationsController {
  
  constructor(
    @InjectConnection() private sequelize: Sequelize
  ) {}
  
  @Post('run')
  async runMigrations(): Promise<any> {
    try {
      const queryInterface = this.sequelize.getQueryInterface();
      
      // Verifica se as tabelas existem
      const tables = await queryInterface.showAllTables();
      
      // Força a sincronização das tabelas (cria se não existirem)
      await this.sequelize.sync({ alter: false });
      
      return {
        success: true,
        message: 'Database connection verified and tables synchronized',
        tables: tables,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to connect to database',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  @Get('status')
  async getMigrationStatus(): Promise<any> {
    try {
      const queryInterface = this.sequelize.getQueryInterface();
      const tables = await queryInterface.showAllTables();
      
      // Teste de conexão
      await this.sequelize.authenticate();
      
      return {
        success: true,
        message: 'Database connection successful',
        tables: tables,
        total_tables: tables.length,
        dialect: this.sequelize.getDialect(),
        database_name: this.sequelize.getDatabaseName(),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  @Post('sync')
  async syncTables(): Promise<any> {
    try {
      // Força a sincronização de todas as tabelas
      await this.sequelize.sync({ force: false, alter: true });
      
      const queryInterface = this.sequelize.getQueryInterface();
      const tables = await queryInterface.showAllTables();
      
      return {
        success: true,
        message: 'Tables synchronized successfully',
        tables: tables,
        total_tables: tables.length,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to sync tables',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }
}