#!/bin/bash
echo "🗄️ Setting up database schema..."
PGPASSWORD=QPK4abTEM1EDMJYya0ZBephFQ7yDnjKA psql -h dpg-d4ga71vgi27c73ebdcag-a.oregon-postgres.render.com -U heroesplataform_user heroesplataform -f database/postgres-init/01-schema.sql
echo "✅ Database setup completed"