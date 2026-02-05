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
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    nationality VARCHAR(50) NOT NULL,
    history TEXT NOT NULL
);

-- =====================
-- TABELA: team
-- =====================
CREATE TABLE IF NOT EXISTS team (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    creator VARCHAR(50) NOT NULL
);

-- =====================
-- TABELA: users
-- =====================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
-- TABELA: heroes
-- =====================
CREATE TABLE IF NOT EXISTS heroes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    studio_id UUID NOT NULL,
    power_type VARCHAR(100),
    morality VARCHAR(50),
    first_appearance VARCHAR(255),
    release_date DATE,
    creator VARCHAR(50),
    weak_point VARCHAR(100),
    affiliation VARCHAR(100),
    story TEXT,
    team_id UUID,
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
-- TABELA: roles
-- =====================
CREATE TABLE IF NOT EXISTS roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role VARCHAR(50) NOT NULL,
    usuario_id UUID NOT NULL,
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
-- TABELA: articles
-- =====================
CREATE TABLE IF NOT EXISTS articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category VARCHAR(50) NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    text TEXT NOT NULL,
    summary JSONB NOT NULL,
    thumbnail VARCHAR(255),
    key_words TEXT[] NOT NULL,
    route VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    views INTEGER DEFAULT 0,
    theme VARCHAR(50),
    theme_color VARCHAR(20),
    image VARCHAR(255),
    image_source VARCHAR(255),
    author VARCHAR(50) NOT NULL,
    usuario_id UUID,
    role_art INTEGER DEFAULT 3,
    CONSTRAINT fk_articles_usuario FOREIGN KEY (usuario_id) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT chk_role_art CHECK (role_art IN (1, 2, 3))
);

CREATE TRIGGER update_articles_updated_at 
BEFORE UPDATE ON articles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_theme ON articles(theme);
CREATE INDEX IF NOT EXISTS idx_articles_author ON articles(author);
CREATE INDEX IF NOT EXISTS idx_articles_created_at ON articles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_views ON articles(views DESC);
CREATE INDEX IF NOT EXISTS idx_articles_usuario_id ON articles(usuario_id);
CREATE INDEX IF NOT EXISTS idx_articles_role_art ON articles(role_art);

CREATE INDEX IF NOT EXISTS idx_articles_fulltext 
  ON articles USING GIN(to_tsvector('portuguese', COALESCE(title, '') || ' ' || COALESCE(description, '') || ' ' || COALESCE(text, '')));

-- =====================
-- TABELA: news
-- =====================
CREATE TABLE IF NOT EXISTS news (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    image VARCHAR(255) NOT NULL,
    link VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    date VARCHAR(50) NOT NULL,
    read_time VARCHAR(50) NOT NULL,
    author VARCHAR(100) NOT NULL DEFAULT 'Sistema',
    usuario_id UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_news_usuario FOREIGN KEY (usuario_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_news_category ON news(category);
CREATE INDEX IF NOT EXISTS idx_news_date ON news(date DESC);
CREATE INDEX IF NOT EXISTS idx_news_usuario_id ON news(usuario_id);

-- =====================
-- TABELA: comments
-- =====================
CREATE TABLE IF NOT EXISTS comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id UUID NOT NULL,
    user_id UUID NOT NULL,
    content TEXT NOT NULL,
    parent_id UUID NULL,
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

CREATE INDEX IF NOT EXISTS idx_comments_article_id ON comments(article_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_is_deleted ON comments(is_deleted) WHERE is_deleted = FALSE;

CREATE TRIGGER update_comments_updated_at 
BEFORE UPDATE ON comments
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================
-- TABELA: comment_likes
-- =====================
CREATE TABLE IF NOT EXISTS comment_likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    comment_id UUID NOT NULL,
    user_id UUID NOT NULL,
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

CREATE INDEX IF NOT EXISTS idx_comment_likes_comment_id ON comment_likes(comment_id);
CREATE INDEX IF NOT EXISTS idx_comment_likes_user_id ON comment_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_comment_likes_type ON comment_likes(type);

-- =====================
-- TABELA: quiz
-- =====================
CREATE TABLE IF NOT EXISTS quiz (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    logo VARCHAR(255),
    theme VARCHAR(20) NOT NULL
);

-- =====================
-- TABELA: quiz_levels
-- =====================
CREATE TABLE IF NOT EXISTS quiz_levels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id UUID NOT NULL,
    name VARCHAR(100) NOT NULL,
    difficulty VARCHAR(20) NOT NULL,
    unlocked BOOLEAN DEFAULT FALSE,
    questions INTEGER NOT NULL,
    xp_reward INTEGER NOT NULL,
    CONSTRAINT fk_quiz_levels_quiz FOREIGN KEY (quiz_id) REFERENCES quiz(id) ON DELETE CASCADE
);

CREATE INDEX idx_quiz_levels_quiz_id ON quiz_levels(quiz_id);

-- =====================
-- TABELA: quiz_heroes
-- =====================
CREATE TABLE IF NOT EXISTS quiz_heroes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_level_id UUID NOT NULL,
    name VARCHAR(50) NOT NULL,
    image VARCHAR(255) NOT NULL,
    quote TEXT NOT NULL,
    CONSTRAINT fk_quiz_heroes_level FOREIGN KEY (quiz_level_id) REFERENCES quiz_levels(id) ON DELETE CASCADE
);

CREATE INDEX idx_quiz_heroes_quiz_level_id ON quiz_heroes(quiz_level_id);

-- =====================
-- TABELA: quiz_questions
-- =====================
CREATE TABLE IF NOT EXISTS quiz_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_level_id UUID,
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
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    link VARCHAR(255) NOT NULL,
    url_icon VARCHAR(255) NOT NULL
);

-- =====================
-- TABELA: user_game_process
-- =====================
CREATE TABLE IF NOT EXISTS user_game_process (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    game_id UUID NOT NULL,
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
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    quiz_id UUID NOT NULL,
    quiz_level_id UUID NOT NULL,
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
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    email VARCHAR(100) NOT NULL,
    provider VARCHAR(50) NOT NULL,
    provider_user_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_social_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_user_social_user_id ON user_social(user_id);
CREATE INDEX idx_user_social_provider ON user_social(provider, provider_user_id);

CREATE TRIGGER update_user_social_updated_at 
BEFORE UPDATE ON user_social
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================
-- TABELA: events
-- =====================
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(100),
    date_event DATE NOT NULL,
    url_event VARCHAR(255),
    url_image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TRIGGER update_events_updated_at 
BEFORE UPDATE ON events
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================
-- TABELA: validations
-- =====================
CREATE TABLE IF NOT EXISTS validations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    access_token VARCHAR(512),
    refresh_token VARCHAR(512),
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    token_id VARCHAR(64) NOT NULL UNIQUE,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    device_info TEXT,
    ip_address VARCHAR(39),
    last_used_at TIMESTAMP,
    CONSTRAINT fk_validations_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_validations_user_id ON validations(user_id);
CREATE INDEX IF NOT EXISTS idx_validations_token_id ON validations(token_id);
CREATE INDEX IF NOT EXISTS idx_validations_expires_at ON validations(expires_at);

CREATE TRIGGER update_validations_updated_at 
BEFORE UPDATE ON validations
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================
-- TABELA: subscriptions
-- =====================
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    stripe_customer_id VARCHAR(100) NOT NULL,
    stripe_subscription_id VARCHAR(100) NOT NULL,
    stripe_price_id VARCHAR(100) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'incomplete' CHECK (status IN ('active', 'canceled', 'incomplete', 'incomplete_expired', 'past_due', 'trialing', 'unpaid')),
    current_period_start TIMESTAMP NOT NULL,
    current_period_end TIMESTAMP NOT NULL,
    cancel_at_period_end BOOLEAN NOT NULL DEFAULT FALSE,
    canceled_at TIMESTAMP,
    price NUMERIC(10,2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'BRL',
    plan_type VARCHAR(20) NOT NULL CHECK (plan_type IN ('mensal', 'trimestral', 'semestral', 'anual')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_subscriptions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TRIGGER update_subscriptions_updated_at 
BEFORE UPDATE ON subscriptions
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================
-- TABELA: payments
-- =====================
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    stripe_payment_intent_id VARCHAR(100) NOT NULL,
    stripe_charge_id VARCHAR(100),
    amount NUMERIC(10,2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'BRL',
    status VARCHAR(30) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'succeeded', 'failed', 'canceled', 'requires_action')),
    payment_method VARCHAR(50) NOT NULL,
    failure_reason TEXT,
    metadata JSONB,
    paid_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_payments_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TRIGGER update_payments_updated_at 
BEFORE UPDATE ON payments
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================
-- TABELA: access_logs
-- =====================
CREATE TABLE IF NOT EXISTS access_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    route VARCHAR(500) NOT NULL,
    method VARCHAR(10) NOT NULL,
    ip VARCHAR(45) NOT NULL,
    user_agent TEXT,
    user_id UUID,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status_code INTEGER,
    response_time INTEGER,
    action_type VARCHAR(20) NOT NULL DEFAULT 'other' CHECK (action_type IN ('page_view', 'login', 'api_call', 'other')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_access_logs_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_access_logs_user_id ON access_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_access_logs_timestamp ON access_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_access_logs_action_type ON access_logs(action_type);
CREATE INDEX IF NOT EXISTS idx_access_logs_route ON access_logs(route);
CREATE INDEX IF NOT EXISTS idx_access_logs_action_timestamp ON access_logs(action_type, timestamp);

CREATE TRIGGER update_access_logs_updated_at 
BEFORE UPDATE ON access_logs
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================
-- TABELA: notifications
-- =====================
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    image VARCHAR(500),
    author VARCHAR(100) NOT NULL DEFAULT 'Sistema',
    type VARCHAR(20) NOT NULL DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error', 'system')),
    tag_color VARCHAR(7) NOT NULL DEFAULT '#00d2ff',
    read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

CREATE TRIGGER update_notifications_updated_at 
BEFORE UPDATE ON notifications
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================
-- TABELA: sac_contacts
-- =====================
CREATE TABLE IF NOT EXISTS sac_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID NOT NULL,
    ticket_number VARCHAR(20) UNIQUE NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('suporte', 'reclamacao', 'elogio')),
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    status VARCHAR(20) DEFAULT 'aberto' CHECK (status IN ('aberto', 'em_andamento', 'resolvido', 'fechado')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_sac_contacts_usuario FOREIGN KEY (usuario_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_sac_contacts_usuario_id ON sac_contacts(usuario_id);
CREATE INDEX IF NOT EXISTS idx_sac_contacts_status ON sac_contacts(status);
CREATE INDEX IF NOT EXISTS idx_sac_contacts_type ON sac_contacts(type);
CREATE INDEX IF NOT EXISTS idx_sac_contacts_ticket_number ON sac_contacts(ticket_number);

CREATE TRIGGER update_sac_contacts_updated_at 
BEFORE UPDATE ON sac_contacts
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================
-- TABELA: sac_responses
-- =====================
CREATE TABLE IF NOT EXISTS sac_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contact_id UUID NOT NULL,
    message TEXT NOT NULL,
    author VARCHAR(100) NOT NULL DEFAULT 'Sistema',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_sac_responses_contact FOREIGN KEY (contact_id) REFERENCES sac_contacts(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_sac_responses_contact_id ON sac_responses(contact_id);

-- =====================
-- TABELA: sac_attachments
-- =====================
CREATE TABLE IF NOT EXISTS sac_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contact_id UUID,
    response_id UUID,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_sac_attachments_contact FOREIGN KEY (contact_id) REFERENCES sac_contacts(id) ON DELETE CASCADE,
    CONSTRAINT fk_sac_attachments_response FOREIGN KEY (response_id) REFERENCES sac_responses(id) ON DELETE CASCADE,
    CONSTRAINT chk_sac_attachment_contact_or_response CHECK ((contact_id IS NOT NULL OR response_id IS NOT NULL) AND NOT (contact_id IS NOT NULL AND response_id IS NOT NULL))
);

CREATE INDEX IF NOT EXISTS idx_sac_attachments_contact_id ON sac_attachments(contact_id);
CREATE INDEX IF NOT EXISTS idx_sac_attachments_response_id ON sac_attachments(response_id);

-- =====================
-- TABELA: sac_ticket_sequence
-- =====================
CREATE TABLE IF NOT EXISTS sac_ticket_sequence (
    year INTEGER PRIMARY KEY,
    last_number INTEGER DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO sac_ticket_sequence (year, last_number) 
VALUES (EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER, 0)
ON CONFLICT (year) DO NOTHING;
