'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('comments', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      article_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'articles',
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
      content: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      parent_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'comments',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      likes_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      dislikes_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      is_edited: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      is_deleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false,
      },
    });

    // Criar índices
    await queryInterface.addIndex('comments', ['article_id'], {
      name: 'idx_comments_article_id',
    });
    await queryInterface.addIndex('comments', ['user_id'], {
      name: 'idx_comments_user_id',
    });
    await queryInterface.addIndex('comments', ['parent_id'], {
      name: 'idx_comments_parent_id',
    });
    await queryInterface.addIndex('comments', ['created_at'], {
      name: 'idx_comments_created_at',
      order: [['created_at', 'DESC']],
    });
    await queryInterface.addIndex('comments', ['is_deleted'], {
      name: 'idx_comments_is_deleted',
      where: {
        is_deleted: false,
      },
    });

    // Adicionar constraint CHECK para conteúdo não vazio
    await queryInterface.sequelize.query(`
      ALTER TABLE comments 
      ADD CONSTRAINT chk_content_not_empty 
      CHECK (LENGTH(TRIM(content)) > 0);
    `);

    // Adicionar constraint CHECK para parent não ser o próprio id
    await queryInterface.sequelize.query(`
      ALTER TABLE comments 
      ADD CONSTRAINT chk_parent_not_self 
      CHECK (parent_id IS NULL OR parent_id != id);
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('comments');
  },
};
