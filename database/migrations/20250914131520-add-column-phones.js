'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'phone', {
      type: Sequelize.STRING(15),
      allowNull: true,
      comment: 'Número de telefone do usuário'
    });
    await queryInterface.addColumn('users', 'cellphone', {
      type: Sequelize.STRING(15),
      allowNull: true,
      comment: 'Número de celular do usuário'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'phone');
    await queryInterface.removeColumn('users', 'cellphone');
  }
};

