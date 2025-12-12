'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Criar tabela validations
    await queryInterface.createTable('validations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      access_token: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      refresh_token: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      expires_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      token_id: {
        type: Sequelize.STRING(32),
        allowNull: false,
        unique: true
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      device_info: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      ip_address: {
        type: Sequelize.STRING(39), // Para IPv6 (INET no PostgreSQL)
        allowNull: true
      },
      last_used_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Criar índices
    await queryInterface.addIndex('validations', ['user_id'], {
      name: 'idx_validations_user_id'
    });

    await queryInterface.addIndex('validations', ['token_id'], {
      name: 'idx_validations_token_id',
      unique: true
    });

    await queryInterface.addIndex('validations', ['expires_at'], {
      name: 'idx_validations_expires_at'
    });

    // Criar trigger para updated_at (se a função existir)
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = CURRENT_TIMESTAMP;
          RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);

    await queryInterface.sequelize.query(`
      CREATE TRIGGER update_validations_updated_at 
      BEFORE UPDATE ON validations
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `);
  },

  async down(queryInterface, Sequelize) {
    // Remover trigger
    await queryInterface.sequelize.query('DROP TRIGGER IF EXISTS update_validations_updated_at ON validations;');
    
    // Remover tabela
    await queryInterface.dropTable('validations');
  }
};