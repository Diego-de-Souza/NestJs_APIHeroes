#!/bin/bash
echo "🗄️ Setting up database schema..."

# Use user_admin em vez de heroesplataform_user
export PGPASSWORD=xLdwPJnNeXZU2g9qjPKnsHYR8wEs7yqz
export PGSSLMODE=require

psql "postgresql://user_admin:xLdwPJnNeXZU2g9qjPKnsHYR8wEs7yqz@dpg-d4ga71vgi27c73ebdcag-a.oregon-postgres.render.com:5432/heroesplataform?sslmode=require" -f database/postgres-init/01-schema.sql

if [ $? -eq 0 ]; then
    echo "✅ Database setup completed"
else
    echo "⚠️ Database setup failed, but continuing..."
fi