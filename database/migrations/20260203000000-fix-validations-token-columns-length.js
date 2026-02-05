'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('validations', 'access_token', {
      type: Sequelize.STRING(512),
      allowNull: true,
    });

    await queryInterface.changeColumn('validations', 'refresh_token', {
      type: Sequelize.STRING(512),
      allowNull: true,
    });

    await queryInterface.changeColumn('validations', 'token_id', {
      type: Sequelize.STRING(64),
      allowNull: false,
    });

    await queryInterface.changeColumn('validations', 'device_info', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('validations', 'access_token', {
      type: Sequelize.STRING(255),
      allowNull: true,
    });

    await queryInterface.changeColumn('validations', 'refresh_token', {
      type: Sequelize.STRING(255),
      allowNull: true,
    });

    await queryInterface.changeColumn('validations', 'token_id', {
      type: Sequelize.STRING(32),
      allowNull: false,
    });

    await queryInterface.changeColumn('validations', 'device_info', {
      type: Sequelize.STRING(255),
      allowNull: true,
    });
  },
};
