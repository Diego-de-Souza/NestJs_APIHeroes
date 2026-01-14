'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Adicionar índices para busca (se não existirem)
    const indexes = [
      { name: 'idx_articles_category', columns: ['category'] },
      { name: 'idx_articles_theme', columns: ['theme'] },
      { name: 'idx_articles_author', columns: ['author'] },
      { name: 'idx_articles_created_at', columns: [['created_at', 'DESC']] },
      { name: 'idx_articles_views', columns: [['views', 'DESC']] },
    ];

    for (const index of indexes) {
      try {
        const [results] = await queryInterface.sequelize.query(
          `SELECT indexname FROM pg_indexes WHERE tablename = 'articles' AND indexname = '${index.name}';`
        );
        
        if (results.length === 0) {
          await queryInterface.addIndex('articles', index.columns, {
            name: index.name,
          });
        }
      } catch (error) {
        // Se o índice já existir, continua
        console.log(`Índice ${index.name} já existe ou erro:`, error.message);
      }
    }

    // Criar índice full-text search (GIN) para PostgreSQL
    try {
      await queryInterface.sequelize.query(`
        CREATE INDEX IF NOT EXISTS idx_articles_fulltext 
        ON articles 
        USING GIN(
          to_tsvector('portuguese', 
            COALESCE(title, '') || ' ' || 
            COALESCE(description, '') || ' ' || 
            COALESCE(text, '')
          )
        );
      `);
    } catch (error) {
      console.log('Erro ao criar índice full-text ou já existe:', error.message);
    }
  },

  async down(queryInterface, Sequelize) {
    // Remover índices
    await queryInterface.removeIndex('articles', 'idx_articles_category');
    await queryInterface.removeIndex('articles', 'idx_articles_theme');
    await queryInterface.removeIndex('articles', 'idx_articles_author');
    await queryInterface.removeIndex('articles', 'idx_articles_created_at');
    await queryInterface.removeIndex('articles', 'idx_articles_views');
    
    await queryInterface.sequelize.query('DROP INDEX IF EXISTS idx_articles_fulltext;');
  },
};
