import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Create Supabase client with anon key for regular operations
export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Create Supabase client with service role key for admin operations
export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Database schema setup function
export const initializeDatabase = async () => {
  try {
    // Create tables if they don't exist
    const { error: patientsError } = await supabaseAdmin.rpc('create_patients_table');
    const { error: medicationSchedulesError } = await supabaseAdmin.rpc('create_medication_schedules_table');
    const { error: callSchedulesError } = await supabaseAdmin.rpc('create_call_schedules_table');
    const { error: healthChecksError } = await supabaseAdmin.rpc('create_health_checks_table');
    const { error: remainingTablesError } = await supabaseAdmin.rpc('create_remaining_tables');
    
    if (patientsError) console.error('Patients table error:', patientsError);
    if (medicationSchedulesError) console.error('Medication schedules table error:', medicationSchedulesError);
    if (callSchedulesError) console.error('Call schedules table error:', callSchedulesError);
    if (healthChecksError) console.error('Health checks table error:', healthChecksError);
    if (remainingTablesError) console.error('Remaining tables error:', remainingTablesError);
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
}; 