'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('comment_likes', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      comment_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'comments',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      type: {
        type: Sequelize.ENUM('like', 'dislike'),
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false,
      },
    });

    // Criar índices
    await queryInterface.addIndex('comment_likes', ['comment_id'], {
      name: 'idx_comment_likes_comment_id',
    });
    await queryInterface.addIndex('comment_likes', ['user_id'], {
      name: 'idx_comment_likes_user_id',
    });
    await queryInterface.addIndex('comment_likes', ['type'], {
      name: 'idx_comment_likes_type',
    });

    // Criar unique constraint: um usuário só pode dar like OU dislike por comentário
    await queryInterface.addConstraint('comment_likes', {
      fields: ['comment_id', 'user_id'],
      type: 'unique',
      name: 'uk_comment_like_user',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('comment_likes');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_comment_likes_type";');
  },
};
