'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Criar tabela access_logs
    await queryInterface.createTable('access_logs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      route: {
        type: Sequelize.STRING(500),
        allowNull: false
      },
      method: {
        type: Sequelize.STRING(10),
        allowNull: false
      },
      ip: {
        type: Sequelize.STRING(45),
        allowNull: false
      },
      user_agent: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      timestamp: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      status_code: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      response_time: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: 'Response time in milliseconds'
      },
      action_type: {
        type: Sequelize.ENUM('page_view', 'login', 'api_call', 'other'),
        allowNull: false,
        defaultValue: 'other'
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

    // Criar índices para melhor performance
    await queryInterface.addIndex('access_logs', ['user_id'], {
      name: 'idx_access_logs_user_id'
    });

    await queryInterface.addIndex('access_logs', ['timestamp'], {
      name: 'idx_access_logs_timestamp'
    });

    await queryInterface.addIndex('access_logs', ['action_type'], {
      name: 'idx_access_logs_action_type'
    });

    await queryInterface.addIndex('access_logs', ['route'], {
      name: 'idx_access_logs_route'
    });

    // Índice composto para consultas frequentes
    await queryInterface.addIndex('access_logs', ['action_type', 'timestamp'], {
      name: 'idx_access_logs_action_timestamp'
    });
  },

  async down(queryInterface, Sequelize) {
    // Remover índices
    await queryInterface.removeIndex('access_logs', 'idx_access_logs_user_id');
    await queryInterface.removeIndex('access_logs', 'idx_access_logs_timestamp');
    await queryInterface.removeIndex('access_logs', 'idx_access_logs_action_type');
    await queryInterface.removeIndex('access_logs', 'idx_access_logs_route');
    await queryInterface.removeIndex('access_logs', 'idx_access_logs_action_timestamp');
    
    // Remover tabela
    await queryInterface.dropTable('access_logs');
  }
};
