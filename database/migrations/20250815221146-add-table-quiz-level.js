'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('quiz_level', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
      },
      quiz_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'quiz', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      difficulty: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      unlocked: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      questions: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      xp_reward: {
        type: Sequelize.INTEGER,
        allowNull: false,
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('quiz_level');
  }
};