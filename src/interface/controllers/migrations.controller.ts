import { Controller, Post, Get, Req } from '@nestjs/common';
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

  @Post('delete_user')
    async deleteUser(): Promise<any> {
    const transaction = await this.sequelize.transaction();
    
    try {
        // 1. Busca o usuário pelo email
        const users = await this.sequelize.query(
        'SELECT u.id, u.nickname, u.firstemail, r.role, r.access FROM users u LEFT JOIN roles r ON u.id = r.usuario_id WHERE u.firstemail = :email',
        {
            replacements: { email: 'plataformaheroes20250820@gmail.com' },
            type: QueryTypes.SELECT,
            transaction
        }
        ) as any[];

        // 2. Verifica se o usuário existe
        if (!users || users.length === 0) {
        await transaction.rollback();
        return {
            success: false,
            message: '❌ Usuário não encontrado!',
            email: 'plataformaheroes20250820@gmail.com',
            timestamp: new Date().toISOString()
        };
        }

        const userId = users[0].id;
        const userInfo = {
        id: userId,
        email: users[0].firstemail,
        nickname: users[0].nickname,
        role: users[0].role
        };

        // 3. Remove primeiro as roles (devido à FK constraint)
        const deletedRoles = await this.sequelize.query(
        'DELETE FROM roles WHERE usuario_id = :userId',
        {
            replacements: { userId },
            type: QueryTypes.DELETE,
            transaction
        }
        );

        // 4. Remove o usuário
        const deletedUser = await this.sequelize.query(
        'DELETE FROM users WHERE id = :userId',
        {
            replacements: { userId },
            type: QueryTypes.DELETE,
            transaction
        }
        );

        await transaction.commit();

        return {
        success: true,
        message: '🗑️ Usuário ROOT removido com sucesso!',
        deleted_user: userInfo,
        operations: {
            roles_deleted: deletedRoles,
            user_deleted: deletedUser
        },
        timestamp: new Date().toISOString()
        };

    } catch (error) {
        await transaction.rollback();
        return {
        success: false,
        message: 'Erro ao remover usuário root',
        error: error.message,
        timestamp: new Date().toISOString()
        };
    }
    }

    @Get('debug-cookies')
  async debugCookies(@Req() req: any): Promise<any> {
    return {
      success: true,
      cookies: {
        access_token: req.cookies?.access_token || 'NOT_FOUND',
        refresh_token: req.cookies?.refresh_token || 'NOT_FOUND',
        all_cookies: req.cookies || {},
        raw_cookie_header: req.headers.cookie || 'NOT_FOUND'
      },
      timestamp: new Date().toISOString()
    };
  }

  // ✅ ROTA DE DEBUG - HEADERS COMPLETOS
  @Get('debug-headers')
  async debugHeaders(@Req() req: any): Promise<any> {
    return {
      success: true,
      debug: {
        method: req.method,
        url: req.url,
        cookies: req.cookies || {},
        headers: {
          cookie: req.headers.cookie,
          authorization: req.headers.authorization,
          'user-agent': req.headers['user-agent'],
          origin: req.headers.origin,
          referer: req.headers.referer,
          'content-type': req.headers['content-type']
        },
        query: req.query,
        body: req.body
      },
      timestamp: new Date().toISOString()
    };
  }

  // ✅ ROTA DE DEBUG - AUTH SIMULATION
  @Get('debug-auth')
  async debugAuth(@Req() req: any): Promise<any> {
    const authHeader = req.headers.authorization;
    const bearerToken = authHeader?.split(' ')[1];
    const cookieAccessToken = req.cookies?.access_token;
    const cookieRefreshToken = req.cookies?.refresh_token;
    
    return {
      success: true,
      auth_debug: {
        has_auth_header: !!authHeader,
        auth_header_value: authHeader || 'NOT_PRESENT',
        bearer_token: bearerToken || 'NOT_EXTRACTED',
        cookie_access_token: cookieAccessToken || 'NOT_FOUND',
        cookie_refresh_token: cookieRefreshToken || 'NOT_FOUND',
        middleware_should_use: 'COOKIES',
        token_source: cookieAccessToken ? 'COOKIES' : (bearerToken ? 'HEADER' : 'NONE')
      },
      timestamp: new Date().toISOString()
    };
  }

  @Post('alter-table-events')
  async executeAlterTableEvents(): Promise<any> {
    const transaction = await this.sequelize.transaction();
    try {
      // 2. Criar tabela subscription se não existir
      console.log('🔧 Criando tabela subscription se não existir...');
      await this.sequelize.query(`
        CREATE TABLE IF NOT EXISTS subscription (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES users(id),
          stripe_customer_id VARCHAR(100) NOT NULL,
          stripe_subscription_id VARCHAR(100) NOT NULL,
          stripe_price_id VARCHAR(100) NOT NULL,
          status VARCHAR(20) NOT NULL DEFAULT 'incomplete',
          current_period_start TIMESTAMP NOT NULL,
          current_period_end TIMESTAMP NOT NULL,
          cancel_at_period_end BOOLEAN NOT NULL DEFAULT FALSE,
          canceled_at TIMESTAMP,
          price NUMERIC(10,2) NOT NULL,
          currency VARCHAR(3) NOT NULL DEFAULT 'BRL',
          plan_type VARCHAR(20) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
        );
      `, { type: QueryTypes.RAW, transaction });
      console.log('✅ Tabela subscription criada ou já existia');

      // 3. Criar tabela payments se não existir
      console.log('🔧 Criando tabela payments se não existir...');
      await this.sequelize.query(`
        CREATE TABLE IF NOT EXISTS payments (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES users(id),
          stripe_payment_intent_id VARCHAR(100) NOT NULL,
          stripe_charge_id VARCHAR(100),
          amount NUMERIC(10,2) NOT NULL,
          currency VARCHAR(3) NOT NULL DEFAULT 'BRL',
          status VARCHAR(20) NOT NULL DEFAULT 'pending',
          payment_method VARCHAR(50) NOT NULL,
          failure_reason TEXT,
          metadata JSONB,
          paid_at TIMESTAMP,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
        );
      `, { type: QueryTypes.RAW, transaction });
      console.log('✅ Tabela payments criada ou já existia');

      await transaction.commit();
      return {
        success: true,
        message: '🚀 Migração concluída: tabelas criadas!',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      await transaction.rollback();
      console.error('❌ Erro na migração:', error);
      return {
        success: false,
        message: 'Erro ao executar migração',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  @Post('alter-table-subscription')
  async executeAlterTableSubscription(): Promise<any> {
    const transaction = await this.sequelize.transaction();
    try {
      console.log('🔧 Renomeando tabela subscription para subscriptions...');
      await this.sequelize.query(`
        ALTER TABLE subscription RENAME TO subscriptions;
      `, { type: QueryTypes.RAW, transaction });
      console.log('✅ Tabela renomeada para subscriptions');
      await transaction.commit();
      return {
        success: true,
        message: '🚀 Migração concluída: tabela renomeada!',
        timestamp: new Date().toISOString()
      };
    }
    catch (error) {
      await transaction.rollback();
      console.error('❌ Erro na migração:', error);
      return {
        success: false,
        message: 'Erro ao executar migração',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }
}