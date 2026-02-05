-- Fix: "value too long for type character varying" no login
-- Execute este script se o erro persistir (ex: npm run db:migrate não disponível)
-- psql -U heroesplataform_user -d heroesplataform -f database/postgres-init/fix-validations-columns.sql

ALTER TABLE validations ALTER COLUMN access_token TYPE VARCHAR(512);
ALTER TABLE validations ALTER COLUMN refresh_token TYPE VARCHAR(512);
ALTER TABLE validations ALTER COLUMN token_id TYPE VARCHAR(64);
ALTER TABLE validations ALTER COLUMN device_info TYPE TEXT;
