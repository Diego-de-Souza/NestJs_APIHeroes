import { Controller, Post, Get } from '@nestjs/common';
import { InjectConnection } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { QueryTypes } from 'sequelize';
import { GenenerateHashUseCase } from '../../application/use-cases/auth/generate-hash.use-case'; // ✅ Import do use case

@Controller('migrations')
export class MigrationsController {
  
  constructor(
    @InjectConnection() private sequelize: Sequelize,
    private generateHashUseCase: GenenerateHashUseCase // ✅ Injeta o use case
  ) {}
  
  @Get('status')
  async getMigrationStatus(): Promise<any> {
    try {
      const queryInterface = this.sequelize.getQueryInterface();
      const tables = await queryInterface.showAllTables();
      
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

  @Post('create-root-user')
  async createRootUser(): Promise<any> {
    const transaction = await this.sequelize.transaction();
    
    try {
      // Verifica se o usuário root já existe
      const existingUsers = await this.sequelize.query(
        'SELECT COUNT(*) as count FROM users WHERE firstemail = :email OR nickname = :nickname',
        {
          replacements: { 
            email: 'plataformaheroes20250820@gmail.com',
            nickname: 'root'
          },
          type: QueryTypes.SELECT,
          transaction
        }
      ) as any[];

      if (!existingUsers || existingUsers.length === 0) {
        await transaction.rollback();
        return {
          success: false,
          message: 'Erro ao verificar usuários existentes',
          timestamp: new Date().toISOString()
        };
      }

      if (existingUsers[0].count > 0) {
        await transaction.commit();
        return {
          success: true,
          message: '✅ Usuário root já existe!',
          user_exists: true,
          timestamp: new Date().toISOString()
        };
      }

      const password = process.env.ROOT_PASSWORD || 'PlataformaHeroes@123456789';
      const hashedPassword = await this.generateHashUseCase.generateHash(password);

      // Insere o usuário root
      const userResult = await this.sequelize.query(
        `INSERT INTO users (
          fullname,
          nickname, 
          firstemail, 
          state,
          city,
          password, 
          twofa_active,
          created_at,
          updated_at
        ) VALUES (
          :fullname,
          :nickname,
          :email,
          :state,
          :city,
          :password,
          :twofa_active,
          NOW(),
          NOW()
        ) RETURNING id`,
        {
          replacements: {
            fullname: 'Administrador do Sistema',
            nickname: 'root',
            email: 'plataformaheroes20250820@gmail.com',
            state: 'Sistema',
            city: 'Servidor',
            password: hashedPassword,
            twofa_active: false
          },
          type: QueryTypes.INSERT,
          transaction
        }
      ) as any[];

      if (!userResult || userResult.length === 0 || !userResult[0][0]) {
        await transaction.rollback();
        return {
          success: false,
          message: 'Erro ao criar usuário root',
          timestamp: new Date().toISOString()
        };
      }

      const userId = userResult[0][0].id;

      // Insere a role de admin para o usuário
      await this.sequelize.query(
        `INSERT INTO roles (
          role,
          usuario_id,
          access,
          created_at,
          updated_at
        ) VALUES (
          :role,
          :usuario_id,
          :access,
          NOW(),
          NOW()
        )`,
        {
          replacements: {
            role: 'admin',
            usuario_id: userId,
            access: 'full'
          },
          type: QueryTypes.INSERT,
          transaction
        }
      );

      await transaction.commit();

      return {
        success: true,
        message: '🚀 Usuário ROOT criado com sucesso!',
        user: {
          id: userId,
          email: 'plataformaheroes20250820@gmail.com',
          nickname: 'root',
          role: 'admin'
        },
        credentials: {
          email: 'plataformaheroes20250820@gmail.com',
        },
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      await transaction.rollback();
      return {
        success: false,
        message: 'Erro ao criar usuário root',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  @Get('check-root-user')
  async checkRootUser(): Promise<any> {
    try {
      const users = await this.sequelize.query(
        'SELECT u.id, u.nickname, u.firstemail, r.role, r.access FROM users u LEFT JOIN roles r ON u.id = r.usuario_id WHERE u.nickname = :nickname',
        {
          replacements: { nickname: 'root' },
          type: QueryTypes.SELECT
        }
      ) as any[];

      return {
        success: true,
        root_user_exists: users && users.length > 0,
        user: users && users.length > 0 ? users[0] : null,
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
}