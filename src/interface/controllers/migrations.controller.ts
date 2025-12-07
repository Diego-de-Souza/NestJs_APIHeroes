import { Controller, Post, Get } from '@nestjs/common';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

@Controller('migrations')
export class MigrationsController {
  
  @Post('run')
  async runMigrations(): Promise<any> {
    try {
      const { stdout, stderr } = await execAsync('npm run migrations:run');
      return {
        success: true,
        message: 'Migrations executed successfully',
        output: stdout,
        error: stderr || null
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to run migrations',
        error: error.message
      };
    }
  }

  @Get('status')
  async getMigrationStatus(): Promise<any> {
    try {
      const { stdout } = await execAsync('npx sequelize-cli db:migrate:status --config sequelize.config.js');
      return {
        success: true,
        status: stdout
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}