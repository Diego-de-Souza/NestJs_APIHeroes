'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('user_quiz_progress', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      quiz_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'quiz', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      quiz_level_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'quiz_level', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      completed: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      score: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      skipped_questions: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      answered_questions: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      finished_at: {
        type: Sequelize.DATE,
        allowNull: true,
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('user_quiz_progress');
  }
};