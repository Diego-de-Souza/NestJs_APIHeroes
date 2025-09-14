'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'totp_secret', {
      type: Sequelize.STRING,
      allowNull: true,
      comment: 'Segredo para autenticação TOTP (2FA)'
    });
    await queryInterface.addColumn('users', 'mfa_secret', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: false,
      comment: 'Segredo para autenticação MFA'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'totp_secret');
    await queryInterface.removeColumn('users', 'mfa_secret');
  }
};