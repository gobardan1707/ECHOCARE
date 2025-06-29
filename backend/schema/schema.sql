-- ECHOCARE Database Schema (Idempotent)
-- Supports patient medication reminders, health checks, and call scheduling

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Patients table
CREATE TABLE IF NOT EXISTS patients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone_number VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    language_preference VARCHAR(10) DEFAULT 'en' CHECK (language_preference IN ('en', 'es', 'fr', 'hi', 'zh')),
    timezone VARCHAR(50) DEFAULT 'UTC',
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(20),
    date_of_birth DATE,
    gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
    address TEXT,
    medical_conditions TEXT[],
    allergies TEXT[],
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Medication schedules table
CREATE TABLE IF NOT EXISTS medication_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    medication_name VARCHAR(255) NOT NULL,
    dosage VARCHAR(100) NOT NULL,
    frequency VARCHAR(50) NOT NULL,
    time_slots TIME[] NOT NULL,
    days_of_week INTEGER[] DEFAULT '{1,2,3,4,5,6,7}',
    instructions TEXT,
    start_date DATE NOT NULL,
    end_date DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Call schedules table
CREATE TABLE IF NOT EXISTS call_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    medication_schedule_id UUID REFERENCES medication_schedules(id) ON DELETE CASCADE,
    scheduled_time TIMESTAMP WITH TIME ZONE NOT NULL,
    call_type VARCHAR(20) NOT NULL CHECK (call_type IN ('medication_reminder', 'health_check', 'follow_up')),
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'failed', 'cancelled')),
    twilio_call_sid VARCHAR(100),
    duration_seconds INTEGER,
    call_result VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Health checks table
CREATE TABLE IF NOT EXISTS health_checks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    call_schedule_id UUID REFERENCES call_schedules(id) ON DELETE CASCADE,
    check_date DATE NOT NULL,
    check_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    blood_pressure_systolic INTEGER,
    blood_pressure_diastolic INTEGER,
    heart_rate INTEGER,
    blood_sugar_level DECIMAL(5,2),
    temperature DECIMAL(4,2),
    weight DECIMAL(5,2),

    pain_level INTEGER CHECK (pain_level >= 1 AND pain_level <= 10),
    energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 10),
    mood VARCHAR(50),
    sleep_hours DECIMAL(3,1),

    medications_taken_today BOOLEAN,
    missed_medications TEXT[],
    side_effects TEXT[],

    symptoms TEXT[],
    concerns TEXT,

    voice_recording_url TEXT,
    transcription TEXT,

    ai_analysis TEXT,
    risk_level VARCHAR(20) CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
    recommendations TEXT[],

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Medication adherence table
CREATE TABLE IF NOT EXISTS medication_adherence (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    medication_schedule_id UUID NOT NULL REFERENCES medication_schedules(id) ON DELETE CASCADE,
    scheduled_time TIMESTAMP WITH TIME ZONE NOT NULL,
    taken_time TIMESTAMP WITH TIME ZONE,
    taken BOOLEAN DEFAULT false,
    taken_late BOOLEAN DEFAULT false,
    late_minutes INTEGER,
    confirmation_method VARCHAR(20) CHECK (confirmation_method IN ('voice', 'manual', 'auto')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Voice recordings table
CREATE TABLE IF NOT EXISTS voice_recordings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    call_schedule_id UUID NOT NULL REFERENCES call_schedules(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    recording_url TEXT,
    duration_seconds INTEGER,
    transcription TEXT,
    ai_analysis TEXT,
    sentiment_score DECIMAL(3,2),
    keywords TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Alerts table
CREATE TABLE IF NOT EXISTS alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    alert_type VARCHAR(50) NOT NULL CHECK (alert_type IN ('missed_medication', 'health_concern', 'emergency', 'system')),
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    action_taken BOOLEAN DEFAULT false,
    action_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- System logs table
CREATE TABLE IF NOT EXISTS system_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    level VARCHAR(10) NOT NULL CHECK (level IN ('debug', 'info', 'warn', 'error')),
    category VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    metadata JSONB,
    patient_id UUID REFERENCES patients(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_patients_phone ON patients(phone_number);
CREATE INDEX IF NOT EXISTS idx_patients_active ON patients(is_active);
CREATE INDEX IF NOT EXISTS idx_medication_schedules_patient ON medication_schedules(patient_id);
CREATE INDEX IF NOT EXISTS idx_medication_schedules_active ON medication_schedules(is_active);
CREATE INDEX IF NOT EXISTS idx_call_schedules_patient ON call_schedules(patient_id);
CREATE INDEX IF NOT EXISTS idx_call_schedules_time ON call_schedules(scheduled_time);
CREATE INDEX IF NOT EXISTS idx_call_schedules_status ON call_schedules(status);
CREATE INDEX IF NOT EXISTS idx_health_checks_patient ON health_checks(patient_id);
CREATE INDEX IF NOT EXISTS idx_health_checks_date ON health_checks(check_date);
CREATE INDEX IF NOT EXISTS idx_medication_adherence_patient ON medication_adherence(patient_id);
CREATE INDEX IF NOT EXISTS idx_medication_adherence_scheduled ON medication_adherence(scheduled_time);
CREATE INDEX IF NOT EXISTS idx_alerts_patient ON alerts(patient_id);
CREATE INDEX IF NOT EXISTS idx_alerts_unread ON alerts(is_read) WHERE is_read = false;
CREATE INDEX IF NOT EXISTS idx_system_logs_level ON system_logs(level);
CREATE INDEX IF NOT EXISTS idx_system_logs_created ON system_logs(created_at);

-- Drop existing triggers if present (idempotent)
DROP TRIGGER IF EXISTS update_patients_updated_at ON patients;
DROP TRIGGER IF EXISTS update_medication_schedules_updated_at ON medication_schedules;
DROP TRIGGER IF EXISTS update_call_schedules_updated_at ON call_schedules;
DROP TRIGGER IF EXISTS update_health_checks_updated_at ON health_checks;
DROP TRIGGER IF EXISTS update_alerts_updated_at ON alerts;

-- Drop existing function if present
DROP FUNCTION IF EXISTS update_updated_at_column;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- Apply triggers
CREATE TRIGGER update_patients_updated_at
BEFORE UPDATE ON patients
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_medication_schedules_updated_at
BEFORE UPDATE ON medication_schedules
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_call_schedules_updated_at
BEFORE UPDATE ON call_schedules
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_health_checks_updated_at
BEFORE UPDATE ON health_checks
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_alerts_updated_at
BEFORE UPDATE ON alerts
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
