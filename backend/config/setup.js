// initializeDatabase.ts
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { Client } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

// Get current directory in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path to your migration file
const sqlFilePath = join(__dirname, '../schema/schema.sql'); // Adjust if needed
const migrationSQL = readFileSync(sqlFilePath, 'utf-8');

export const initializeDatabase = async () => {
  const client = new Client({
    connectionString: process.env.SUPABASE_DB_URL, // Full Supabase DB connection string
  });
    console.log('🔄 Initializing database schema...');

  try {
    console.log('🔄 Connecting to the database...');
    await client.connect();
    console.log('🔄 Initializing database schema...');
    await client.query(migrationSQL);
    console.log('✅ Migration SQL applied successfully');
  } catch (error) {
    console.error('❌ Error initializing database:', error.message);
  } finally {
    await client.end();
  }
};
