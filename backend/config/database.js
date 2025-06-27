import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { Client } from 'pg';


dotenv.config();

// Create Supabase client with anon key for regular operations
export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);


// Database schema setup function
export const checkDatabaseSchema = async ()=> {
  const client = new Client({
    connectionString: process.env.SUPABASE_DB_URL, // Full Supabase DB connection string
  });
  const expectedTables = [
  'patients',
  'medication_schedules',
  'call_schedules',
  'health_checks',
  'medication_adherence',
  'voice_recordings',
  'alerts',
  'system_logs',
];
  try {
    await client.connect();
    const res = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
    `);

    const existingTables = res.rows.map(row => row.table_name);
    const missing = expectedTables.filter(t => !existingTables.includes(t));

    if (missing.length > 0) {
      console.error('❌ Missing tables:', missing);
      return false;
    }

    console.log('✅ All required tables exist');
    return true;
  } catch (err) {
    console.error('❌ Error checking DB schema:', err);
    return false;
  } finally {
    await client.end();
  }
};
