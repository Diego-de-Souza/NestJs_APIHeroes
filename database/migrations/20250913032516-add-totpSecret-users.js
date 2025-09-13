'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'totp_secret', {
      type: Sequelize.STRING,
      allowNull: true,
      comment: 'Segredo para autenticação TOTP (2FA)'
    });
    await queryInterface.addColumn('users', '2fa_active', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Indica se o 2FA está ativo para o usuário'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'totpSecret');
    await queryInterface.removeColumn('users', '2fa_active');
  }
};