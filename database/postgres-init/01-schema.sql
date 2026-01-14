-- Extensões úteis
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- Para busca full-text

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- =====================
-- TABELA: studios
-- =====================
CREATE TABLE IF NOT EXISTS studios (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    nationality VARCHAR(50),
    history TEXT
);

-- =====================
-- TABELA: team
-- =====================
CREATE TABLE IF NOT EXISTS team (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    creator VARCHAR(50)
);

-- =====================
-- TABELA: heroes
-- =====================
CREATE TABLE IF NOT EXISTS heroes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    studio_id INTEGER NOT NULL,
    power_type VARCHAR(100),
    morality VARCHAR(50),
    first_appearance VARCHAR(255),
    release_date DATE,
    creator VARCHAR(50),
    weak_point VARCHAR(100),
    affiliation VARCHAR(100),
    story TEXT,
    team_id INTEGER,
    genre VARCHAR(50),
    image1 VARCHAR(500),
    image2 VARCHAR(500),
    CONSTRAINT fk_heroes_studio FOREIGN KEY (studio_id) REFERENCES studios(id) ON DELETE CASCADE,
    CONSTRAINT fk_heroes_team FOREIGN KEY (team_id) REFERENCES team(id) ON DELETE SET NULL
);

CREATE INDEX idx_heroes_studio_id ON heroes(studio_id);
CREATE INDEX idx_heroes_team_id ON heroes(team_id);
CREATE INDEX idx_heroes_name ON heroes USING gin(name gin_trgm_ops);

-- =====================
-- TABELA: users
-- =====================
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    fullname VARCHAR(100) NOT NULL,
    nickname VARCHAR(50) NOT NULL UNIQUE,
    birthdate DATE,
    firstemail VARCHAR(100) NOT NULL UNIQUE,
    secondemail VARCHAR(100),
    phone VARCHAR(15),
    cellphone VARCHAR(15),
    uf VARCHAR(3),
    address VARCHAR(150),
    complement VARCHAR(100),
    cep VARCHAR(8),
    state VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    totp_secret VARCHAR(255),
    mfa_secret VARCHAR(255),
    token_fcm VARCHAR(255),
    twofa_active BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_firstemail ON users(firstemail);
CREATE INDEX idx_users_nickname ON users(nickname);

CREATE TRIGGER update_users_updated_at 
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================
-- TABELA: roles
-- =====================
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    role VARCHAR(50) NOT NULL,
    usuario_id INTEGER NOT NULL,
    access VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_roles_usuario FOREIGN KEY (usuario_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_roles_usuario_id ON roles(usuario_id);

CREATE TRIGGER update_roles_updated_at 
BEFORE UPDATE ON roles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================
-- TABELA: curiosities
-- =====================
CREATE TABLE IF NOT EXISTS curiosities (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    caption VARCHAR(100) NOT NULL,
    author VARCHAR(50) NOT NULL,
    font VARCHAR(50),
    description_font VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_curiosities_updated_at 
BEFORE UPDATE ON curiosities
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================
-- TABELA: articles
-- =====================
CREATE TABLE articles (
    id SERIAL PRIMARY KEY,
    category VARCHAR(50) NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    text TEXT NOT NULL,
    summary JSONB NOT NULL,
    thumbnail VARCHAR(255),
    key_words TEXT[] NOT NULL,
    route VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    views INTEGER DEFAULT 0,
    theme VARCHAR(50),
    theme_color VARCHAR(20),
    image VARCHAR(255),
    author VARCHAR(50) NOT NULL
);

-- Trigger para updated_at
CREATE TRIGGER update_articles_updated_at 
BEFORE UPDATE ON articles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Índices para busca de artigos
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_theme ON articles(theme);
CREATE INDEX IF NOT EXISTS idx_articles_author ON articles(author);
CREATE INDEX IF NOT EXISTS idx_articles_created_at ON articles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_views ON articles(views DESC);

-- Full-text search index (PostgreSQL)
CREATE INDEX IF NOT EXISTS idx_articles_fulltext 
  ON articles USING GIN(to_tsvector('portuguese', COALESCE(title, '') || ' ' || COALESCE(description, '') || ' ' || COALESCE(text, '')));

-- =====================
-- TABELA: comments
-- =====================
CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    article_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    parent_id INTEGER NULL,
    likes_count INTEGER DEFAULT 0 NOT NULL,
    dislikes_count INTEGER DEFAULT 0 NOT NULL,
    is_edited BOOLEAN DEFAULT FALSE NOT NULL,
    is_deleted BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    CONSTRAINT fk_comment_article 
        FOREIGN KEY (article_id) 
        REFERENCES articles(id) 
        ON DELETE CASCADE,
        
    CONSTRAINT fk_comment_user 
        FOREIGN KEY (user_id) 
        REFERENCES users(id) 
        ON DELETE CASCADE,
        
    CONSTRAINT fk_comment_parent 
        FOREIGN KEY (parent_id) 
        REFERENCES comments(id) 
        ON DELETE CASCADE,
        
    CONSTRAINT chk_content_not_empty 
        CHECK (LENGTH(TRIM(content)) > 0),
        
    CONSTRAINT chk_parent_not_self 
        CHECK (parent_id IS NULL OR parent_id != id)
);

-- Índices para comments
CREATE INDEX IF NOT EXISTS idx_comments_article_id ON comments(article_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_is_deleted ON comments(is_deleted) WHERE is_deleted = FALSE;

-- Trigger para updated_at
CREATE TRIGGER update_comments_updated_at 
BEFORE UPDATE ON comments
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================
-- TABELA: comment_likes
-- =====================
CREATE TABLE IF NOT EXISTS comment_likes (
    id SERIAL PRIMARY KEY,
    comment_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    type VARCHAR(10) NOT NULL CHECK (type IN ('like', 'dislike')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    CONSTRAINT fk_comment_like_comment 
        FOREIGN KEY (comment_id) 
        REFERENCES comments(id) 
        ON DELETE CASCADE,
        
    CONSTRAINT fk_comment_like_user 
        FOREIGN KEY (user_id) 
        REFERENCES users(id) 
        ON DELETE CASCADE,
        
    CONSTRAINT uk_comment_like_user 
        UNIQUE (comment_id, user_id)
);

-- Índices para comment_likes
CREATE INDEX IF NOT EXISTS idx_comment_likes_comment_id ON comment_likes(comment_id);
CREATE INDEX IF NOT EXISTS idx_comment_likes_user_id ON comment_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_comment_likes_type ON comment_likes(type);

-- =====================
-- TABELA: quiz
-- =====================
CREATE TABLE IF NOT EXISTS quiz (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    logo VARCHAR(255),
    theme VARCHAR(20)
);

-- =====================
-- TABELA: quiz_levels
-- =====================
CREATE TABLE IF NOT EXISTS quiz_levels (
    id SERIAL PRIMARY KEY,
    quiz_id INTEGER,
    name VARCHAR(100) NOT NULL,
    difficulty VARCHAR(20) NOT NULL,
    unlocked BOOLEAN DEFAULT FALSE,
    questions INTEGER,
    xp_reward INTEGER,
    CONSTRAINT fk_quiz_levels_quiz FOREIGN KEY (quiz_id) REFERENCES quiz(id) ON DELETE CASCADE
);

CREATE INDEX idx_quiz_levels_quiz_id ON quiz_levels(quiz_id);

-- =====================
-- TABELA: quiz_heroes
-- =====================
CREATE TABLE IF NOT EXISTS quiz_heroes (
    id SERIAL PRIMARY KEY,
    quiz_level_id INTEGER,
    name VARCHAR(100),
    image VARCHAR(255),
    quote TEXT,
    CONSTRAINT fk_quiz_heroes_level FOREIGN KEY (quiz_level_id) REFERENCES quiz_levels(id) ON DELETE CASCADE
);

CREATE INDEX idx_quiz_heroes_quiz_level_id ON quiz_heroes(quiz_level_id);

-- =====================
-- TABELA: quiz_questions
-- =====================
CREATE TABLE IF NOT EXISTS quiz_questions (
    id SERIAL PRIMARY KEY,
    quiz_level_id INTEGER,
    question TEXT,
    answer TEXT,
    options JSONB,
    CONSTRAINT fk_quiz_questions_level FOREIGN KEY (quiz_level_id) REFERENCES quiz_levels(id) ON DELETE CASCADE
);

CREATE INDEX idx_quiz_questions_quiz_level_id ON quiz_questions(quiz_level_id);
CREATE INDEX idx_quiz_questions_options ON quiz_questions USING gin(options);

-- =====================
-- TABELA: games
-- =====================
CREATE TABLE IF NOT EXISTS games (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    type VARCHAR(50),
    link VARCHAR(255),
    url_icon VARCHAR(255)
);

ALTER TABLE games ADD CONSTRAINT games_name_unique UNIQUE (name);

-- =====================
-- TABELA: user_game_process
-- =====================
CREATE TABLE IF NOT EXISTS user_game_process (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    game_id INTEGER NOT NULL,
    lvl_user SMALLINT NOT NULL,
    score INTEGER,
    attempts SMALLINT,
    last_move_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB,
    CONSTRAINT fk_user_game_process_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_user_game_process_game FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE
);

CREATE INDEX idx_user_game_process_user_id ON user_game_process(user_id);
CREATE INDEX idx_user_game_process_game_id ON user_game_process(game_id);
CREATE INDEX idx_user_game_process_metadata ON user_game_process USING gin(metadata);

-- =====================
-- TABELA: user_quiz_progress
-- =====================
CREATE TABLE IF NOT EXISTS user_quiz_progress (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    quiz_id INTEGER NOT NULL,
    quiz_level_id INTEGER NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    score INTEGER DEFAULT 0,
    skipped_questions JSONB,
    answered_questions JSONB,
    finished_at TIMESTAMP NULL,
    CONSTRAINT fk_user_quiz_progress_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_user_quiz_progress_quiz FOREIGN KEY (quiz_id) REFERENCES quiz(id) ON DELETE CASCADE,
    CONSTRAINT fk_user_quiz_progress_level FOREIGN KEY (quiz_level_id) REFERENCES quiz_levels(id) ON DELETE CASCADE
);

CREATE INDEX idx_user_quiz_progress_user_id ON user_quiz_progress(user_id);
CREATE INDEX idx_user_quiz_progress_quiz_id ON user_quiz_progress(quiz_id);
CREATE INDEX idx_user_quiz_progress_quiz_level_id ON user_quiz_progress(quiz_level_id);

-- =====================
-- TABELA: user_social
-- =====================
CREATE TABLE IF NOT EXISTS user_social (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NULL,
    email VARCHAR(100) NOT NULL,
    provider VARCHAR(50) NOT NULL,
    provider_user_id VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_social_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_user_social_user_id ON user_social(user_id);
CREATE INDEX idx_user_social_provider ON user_social(provider, provider_user_id);

CREATE TRIGGER update_user_social_updated_at 
BEFORE UPDATE ON user_social
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(100),
    date_event TIMESTAMP NOT NULL,
    url_event VARCHAR(255),
    url_image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TRIGGER update_events_updated_at 
BEFORE UPDATE ON events
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS validations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    access_token VARCHAR(255),
    refresh_token VARCHAR(255),
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    token_id VARCHAR(32) NOT NULL UNIQUE,  -- ID binário/hash que será retornado
    is_active BOOLEAN DEFAULT TRUE,        -- Para invalidar tokens
    device_info VARCHAR(255),              -- Para segurança (user-agent)
    ip_address INET,                       -- Para segurança
    last_used_at TIMESTAMP,                -- Para limpar tokens antigos
    
    CONSTRAINT fk_validations_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_validations_user_id ON validations(user_id);
CREATE INDEX IF NOT EXISTS idx_validations_token_id ON validations(token_id);
CREATE INDEX IF NOT EXISTS idx_validations_expires_at ON validations(expires_at);

CREATE TRIGGER update_validations_updated_at 
BEFORE UPDATE ON validations
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Tabela de assinaturas (subscription)
CREATE TABLE IF NOT EXISTS subscriptions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    stripe_customer_id VARCHAR(100) NOT NULL,
    stripe_subscription_id VARCHAR(100) NOT NULL,
    stripe_price_id VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'incomplete',
    current_period_start TIMESTAMP NOT NULL,
    current_period_end TIMESTAMP NOT NULL,
    cancel_at_period_end BOOLEAN NOT NULL DEFAULT FALSE,
    canceled_at TIMESTAMP,
    price NUMERIC(10,2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'BRL',
    plan_type VARCHAR(20) NOT NULL, -- 'mensal', 'trimestral', 'semestral', 'anual'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Tabela de pagamentos (payment)
CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    stripe_payment_intent_id VARCHAR(100) NOT NULL,
    stripe_charge_id VARCHAR(100),
    amount NUMERIC(10,2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'BRL',
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    payment_method VARCHAR(50) NOT NULL,
    failure_reason TEXT,
    metadata JSONB,
    paid_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- =====================
-- TABELA: access_logs
-- =====================
CREATE TABLE IF NOT EXISTS access_logs (
    id SERIAL PRIMARY KEY,
    route VARCHAR(500) NOT NULL,
    method VARCHAR(10) NOT NULL,
    ip VARCHAR(45) NOT NULL,
    user_agent TEXT,
    user_id INTEGER,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status_code INTEGER,
    response_time INTEGER, -- Response time in milliseconds
    action_type VARCHAR(20) NOT NULL DEFAULT 'other' CHECK (action_type IN ('page_view', 'login', 'api_call', 'other')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_access_logs_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_access_logs_user_id ON access_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_access_logs_timestamp ON access_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_access_logs_action_type ON access_logs(action_type);
CREATE INDEX IF NOT EXISTS idx_access_logs_route ON access_logs(route);
CREATE INDEX IF NOT EXISTS idx_access_logs_action_timestamp ON access_logs(action_type, timestamp);

-- Trigger para updated_at
CREATE TRIGGER update_access_logs_updated_at 
BEFORE UPDATE ON access_logs
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
