# ECHOCARE Database Schema Documentation

## Overview

The ECHOCARE database schema is designed to support a comprehensive patient care system that provides medication reminders, health monitoring, and voice-based interactions. The system uses Supabase as the backend database with PostgreSQL.

## Core Tables

### 1. `patients` - Patient Information
**Purpose**: Stores essential patient demographic and contact information.

**Key Fields**:
- `phone_number`: Primary contact method for voice calls (UNIQUE)
- `language_preference`: Supports multilingual voice interactions (en, es, fr, hi, zh)
- `timezone`: Ensures calls are scheduled at appropriate local times
- `emergency_contact_*`: Critical for urgent situations
- `medical_conditions` & `allergies`: Arrays for multiple conditions/allergies

**Why This Design**:
- Phone number as unique identifier since it's the primary communication channel
- Language preference supports global accessibility
- Timezone ensures medication reminders are sent at correct local times
- Arrays for medical data allow flexible storage without additional tables

### 2. `medication_schedules` - Medication Timing
**Purpose**: Defines when and how often patients should take medications.

**Key Fields**:
- `time_slots`: Array of TIME values for multiple daily doses
- `days_of_week`: Array of integers (1-7) for flexible scheduling
- `frequency`: Categorizes common patterns (daily, twice_daily, etc.)
- `start_date` & `end_date`: Supports temporary medication courses

**Why This Design**:
- Array of time slots allows complex medication schedules (e.g., 8 AM, 2 PM, 8 PM)
- Days of week array supports medications taken only on specific days
- End date supports temporary medications (antibiotics, etc.)

### 3. `call_schedules` - Voice Call Management
**Purpose**: Manages scheduled voice calls for reminders and health checks.

**Key Fields**:
- `call_type`: Distinguishes between medication reminders and health checks
- `status`: Tracks call lifecycle (scheduled → in_progress → completed)
- `twilio_call_sid`: Links to Twilio call records
- `call_result`: Records call outcome for analytics

**Why This Design**:
- Separate from medication schedules to allow flexible call timing
- Status tracking enables retry logic and analytics
- Twilio integration for voice call management

### 4. `health_checks` - Daily Health Monitoring
**Purpose**: Stores comprehensive health data collected during voice interactions.

**Key Fields**:
- **Objective metrics**: blood pressure, heart rate, temperature, weight
- **Subjective indicators**: pain level (1-10), energy level (1-10), mood
- **Medication adherence**: whether medications were taken, missed doses
- **AI analysis**: automated risk assessment and recommendations

**Why This Design**:
- Combines objective and subjective health data
- Scale-based assessments (1-10) provide consistent measurement
- AI analysis field enables automated health monitoring
- Risk level categorization for alert generation

### 5. `medication_adherence` - Medication Tracking
**Purpose**: Detailed tracking of actual medication consumption vs. schedule.

**Key Fields**:
- `scheduled_time` vs `taken_time`: Measures adherence accuracy
- `taken_late` & `late_minutes`: Quantifies timing compliance
- `confirmation_method`: Tracks how adherence was confirmed

**Why This Design**:
- Separate from schedules to track actual vs. planned behavior
- Late medication tracking helps identify patterns
- Multiple confirmation methods (voice, manual, auto)

## Supporting Tables

### 6. `voice_recordings` - Call Data
**Purpose**: Stores voice call recordings and AI analysis.

**Key Fields**:
- `transcription`: Text version of voice interactions
- `sentiment_score`: AI analysis of patient emotional state
- `keywords`: Extracted important terms for trend analysis

**Why This Design**:
- Enables review of voice interactions
- Sentiment analysis helps identify patient distress
- Keywords support trend analysis and alert generation

### 7. `alerts` - Notification System
**Purpose**: Manages system-generated alerts and notifications.

**Key Fields**:
- `alert_type`: Categorizes different alert types
- `severity`: Prioritizes alerts (low → critical)
- `is_read` & `action_taken`: Tracks alert lifecycle

**Why This Design**:
- Centralized alert management
- Severity levels enable prioritization
- Action tracking ensures follow-up

### 8. `system_logs` - Debugging & Monitoring
**Purpose**: Comprehensive logging for system monitoring and debugging.

**Key Fields**:
- `level`: Standard logging levels (debug, info, warn, error)
- `category`: Groups related log entries
- `metadata`: JSONB for flexible additional data

**Why This Design**:
- Essential for production monitoring
- JSONB metadata allows flexible logging
- Patient association enables targeted debugging

## Database Design Principles

### 1. **Scalability**
- UUID primary keys for distributed systems
- Proper indexing on frequently queried fields
- Array fields reduce table joins for simple data

### 2. **Data Integrity**
- Foreign key constraints ensure referential integrity
- CHECK constraints validate data ranges and enums
- Triggers automatically update timestamps

### 3. **Performance**
- Strategic indexing on query patterns
- Composite indexes for common query combinations
- Partial indexes for filtered queries (e.g., unread alerts)

### 4. **Flexibility**
- JSONB fields for extensible metadata
- Array fields for variable-length data
- Optional fields for gradual data collection

### 5. **Audit Trail**
- `created_at` and `updated_at` timestamps on all tables
- Automatic trigger updates
- Comprehensive logging system

## User Journey Integration

### Initial Registration
1. Patient provides phone number, name, language preference
2. System creates `patients` record
3. Patient sets up medication schedule in `medication_schedules`

### Daily Operations
1. System creates `call_schedules` based on medication timing
2. Twilio makes voice calls at scheduled times
3. Patient responses recorded in `health_checks`
4. Voice interactions stored in `voice_recordings`
5. AI analysis generates recommendations and alerts

### Monitoring & Analytics
1. `medication_adherence` tracks compliance patterns
2. `alerts` system flags issues requiring attention
3. `system_logs` provide operational insights
4. Health trends analyzed across `health_checks` data

## Security Considerations

- Phone numbers are unique identifiers
- Sensitive health data stored with proper access controls
- Audit trails for all data modifications
- Timezone-aware scheduling prevents timing errors
- Language preferences ensure appropriate communication

This schema provides a robust foundation for a voice-based patient care system that can scale from individual patients to large healthcare organizations while maintaining data integrity and performance. 