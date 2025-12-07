'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const existingGames = await queryInterface.sequelize.query(
      'SELECT COUNT(*) as count FROM games;',
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (existingGames[0].count === 0) {
      await queryInterface.bulkInsert('games', [
        {
          name: 'Memory Game',
          description: 'Jogo da memória com cartas de heróis',
          type: 'memory'
        },
        {
          name: 'Quiz Game',
          description: 'Quiz sobre conhecimentos de heróis',
          type: 'quiz'
        },
        {
          name: 'Puzzle Game',
          description: 'Quebra-cabeça de imagens de heróis',
          type: 'puzzle'
        }
      ], {});
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('games', {
      type: {
        [Sequelize.Op.in]: ['memory', 'quiz', 'puzzle']
      }
    }, {});
  }
};