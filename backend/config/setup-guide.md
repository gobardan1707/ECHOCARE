# ECHOCARE Database Setup Guide

## Environment Variables Required

Create a `.env` file in the backend directory with the following variables:

```env
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Twilio Configuration
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key

# Server Configuration
PORT=3000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=24h

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
LOG_FILE_PATH=./logs/app.log
```

## Database Initialization Steps

### 1. Set up Supabase Project
1. Create a new Supabase project at https://supabase.com
2. Get your project URL and API keys from the project settings
3. Update your `.env` file with the Supabase credentials

### 2. Run Database Schema
1. Connect to your Supabase database using the SQL editor
2. Run the contents of `schema/schema.sql` to create all tables and functions
3. Run the contents of `schema/migrations.sql` to create the stored procedures

### 3. Initialize Database from Application
1. Start your Node.js application
2. The `initializeDatabase()` function will be called automatically
3. Check the console for any initialization errors

## Database Schema Overview

The ECHOCARE database consists of 8 main tables:

1. **patients** - Patient information and preferences
2. **medication_schedules** - Medication timing and dosage
3. **call_schedules** - Scheduled voice calls
4. **health_checks** - Daily health monitoring data
5. **medication_adherence** - Medication compliance tracking
6. **voice_recordings** - Call recordings and transcriptions
7. **alerts** - System notifications and alerts
8. **system_logs** - Application logging and debugging

## Key Features

- **Multilingual Support**: Language preferences for voice interactions
- **Timezone Awareness**: Proper scheduling based on patient location
- **Voice Integration**: Twilio integration for automated calls
- **AI Analysis**: OpenAI integration for health data analysis
- **Compliance Tracking**: Detailed medication adherence monitoring
- **Alert System**: Automated health concern detection
- **Audit Trail**: Comprehensive logging and tracking

## Testing the Setup

After initialization, you can test the database connection:

```javascript
import { supabase } from './config/database.js';

// Test connection
const { data, error } = await supabase
  .from('patients')
  .select('*')
  .limit(1);

if (error) {
  console.error('Database connection error:', error);
} else {
  console.log('Database connection successful');
}
``` 