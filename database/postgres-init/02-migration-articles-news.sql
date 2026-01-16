-- =====================
-- MIGRATION: Adicionar campos usuario_id e role_art na tabela articles
-- =====================

-- Adicionar coluna usuario_id
ALTER TABLE articles 
ADD COLUMN IF NOT EXISTS usuario_id INTEGER;

-- Adicionar foreign key para usuario_id
ALTER TABLE articles 
ADD CONSTRAINT IF NOT EXISTS fk_articles_usuario 
FOREIGN KEY (usuario_id) 
REFERENCES users(id) 
ON DELETE SET NULL;

-- Adicionar coluna role_art com default 3 (client)
ALTER TABLE articles 
ADD COLUMN IF NOT EXISTS role_art INTEGER DEFAULT 3;

-- Adicionar constraint para role_art (1:root, 2:admin, 3:client)
ALTER TABLE articles 
ADD CONSTRAINT IF NOT EXISTS chk_role_art 
CHECK (role_art IN (1, 2, 3));

-- Criar índices para os novos campos
CREATE INDEX IF NOT EXISTS idx_articles_usuario_id ON articles(usuario_id);
CREATE INDEX IF NOT EXISTS idx_articles_role_art ON articles(role_art);

-- =====================
-- MIGRATION: Criar tabela news
-- =====================

-- Criar tabela news
CREATE TABLE IF NOT EXISTS news (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    content TEXT NOT NULL,
    type_news_letter VARCHAR(50) NOT NULL,
    theme VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    views INTEGER DEFAULT 0,
    usuario_id INTEGER,
    role_art INTEGER DEFAULT 3,
    CONSTRAINT fk_news_usuario FOREIGN KEY (usuario_id) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT chk_news_role_art CHECK (role_art IN (1, 2, 3))
);

-- Trigger para updated_at
CREATE TRIGGER update_news_updated_at 
BEFORE UPDATE ON news
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Índices para news
CREATE INDEX IF NOT EXISTS idx_news_usuario_id ON news(usuario_id);
CREATE INDEX IF NOT EXISTS idx_news_role_art ON news(role_art);
CREATE INDEX IF NOT EXISTS idx_news_created_at ON news(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_theme ON news(theme);
CREATE INDEX IF NOT EXISTS idx_news_type_news_letter ON news(type_news_letter);

-- Full-text search index para news (PostgreSQL)
CREATE INDEX IF NOT EXISTS idx_news_fulltext 
  ON news USING GIN(to_tsvector('portuguese', COALESCE(title, '') || ' ' || COALESCE(description, '') || ' ' || COALESCE(content, '')));
