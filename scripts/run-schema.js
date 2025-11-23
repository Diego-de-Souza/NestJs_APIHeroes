const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function runSchema() {
  // Verificar se DATABASE_URL existe
  if (!process.env.DATABASE_URL) {
    console.log('⚠️ DATABASE_URL not found, skipping schema creation');
    return;
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  try {
    await client.connect();
    console.log('✅ Connected to database');
    
    const sqlPath = path.join(__dirname, '../database/postgres-init/01-schema.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    await client.query(sql);
    console.log('✅ Schema created successfully');
  } catch (error) {
    // Ignora erros de "já existe" mas loga outros
    if (error.message.includes('already exists') || error.message.includes('duplicate')) {
      console.log('✅ Tables already exist (safe to ignore)');
    } else {
      console.log('⚠️ Schema error (continuing anyway):', error.message);
    }
  } finally {
    await client.end();
  }
}

runSchema();