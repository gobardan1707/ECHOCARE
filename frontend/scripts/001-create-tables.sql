-- Create patients table
CREATE TABLE IF NOT EXISTS patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    date_of_birth DATE,
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(20),
    voice_clone_url TEXT, -- Murf AI voice clone URL
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create medications table
CREATE TABLE IF NOT EXISTS medications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    dosage VARCHAR(100),
    frequency VARCHAR(100), -- e.g., "twice daily", "every 8 hours"
    schedule_times TEXT[], -- Array of times like ["08:00", "20:00"]
    instructions TEXT,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create call_logs table
CREATE TABLE IF NOT EXISTS call_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    call_type VARCHAR(50) NOT NULL, -- 'medication_reminder', 'health_check'
    call_status VARCHAR(50) NOT NULL, -- 'scheduled', 'completed', 'failed', 'missed'
    scheduled_time TIMESTAMP WITH TIME ZONE,
    actual_time TIMESTAMP WITH TIME ZONE,
    duration_seconds INTEGER,
    twilio_call_sid VARCHAR(255),
    medication_taken BOOLEAN,
    health_response TEXT,
    health_analysis JSONB, -- AI analysis results
    sentiment_score DECIMAL(3,2), -- -1 to 1
    emotion_detected VARCHAR(100),
    ai_response TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create family_members table
CREATE TABLE IF NOT EXISTS family_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    relationship VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(255),
    access_level VARCHAR(50) DEFAULT 'view', -- 'view', 'manage'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create health_summaries table
CREATE TABLE IF NOT EXISTS health_summaries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    summary_date DATE NOT NULL,
    medication_adherence_rate DECIMAL(5,2), -- Percentage
    total_calls INTEGER,
    successful_calls INTEGER,
    missed_calls INTEGER,
    average_sentiment DECIMAL(3,2),
    health_trends JSONB,
    key_concerns TEXT[],
    recommendations TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample data
INSERT INTO patients (name, phone, email, emergency_contact_name, emergency_contact_phone) VALUES
('John Smith', '+1234567890', 'john@example.com', 'Mary Smith', '+1234567891'),
('Sarah Johnson', '+1234567892', 'sarah@example.com', 'Mike Johnson', '+1234567893');

INSERT INTO medications (patient_id, name, dosage, frequency, schedule_times, instructions) VALUES
((SELECT id FROM patients WHERE name = 'John Smith'), 'Lisinopril', '10mg', 'Once daily', ARRAY['08:00'], 'Take with water, preferably in the morning'),
((SELECT id FROM patients WHERE name = 'John Smith'), 'Metformin', '500mg', 'Twice daily', ARRAY['08:00', '20:00'], 'Take with meals'),
((SELECT id FROM patients WHERE name = 'Sarah Johnson'), 'Atorvastatin', '20mg', 'Once daily', ARRAY['21:00'], 'Take in the evening');

INSERT INTO family_members (patient_id, name, relationship, phone, email) VALUES
((SELECT id FROM patients WHERE name = 'John Smith'), 'Mary Smith', 'Spouse', '+1234567891', 'mary@example.com'),
((SELECT id FROM patients WHERE name = 'Sarah Johnson'), 'Mike Johnson', 'Son', '+1234567893', 'mike@example.com');
