# EchoCare Backend Flow Documentation

## 🎯 Complete System Overview

EchoCare is a multilingual medication reminder system that provides personalized healthcare calls using AI-powered voice interactions. The system follows a complete flow from patient registration to automated health monitoring calls.

## 📋 Complete Flow Breakdown

### **Step 1: Patient Registration & Medication Setup**
**API Endpoint:** `POST /api/patients`

**What happens:**
1. User submits patient details (name, phone, language preference)
2. User provides medication information (name, dosage, frequency, time slots)
3. System creates patient record in database
4. System creates medication schedule
5. System automatically schedules reminder calls for each time slot

**Example Request:**
```json
{
  "phoneNumber": "+1234567890",
  "name": "John Doe",
  "language": "en",
  "medicationName": "Aspirin",
  "dosage": "100mg",
  "frequency": "daily",
  "timeSlots": ["09:00", "18:00"],
  "instructions": "Take with food",
  "voiceProfile": "en-US-amara"
}
```

### **Step 2: Automated Call Scheduling**
**Service:** `SchedulerService`

**What happens:**
1. Cron job runs every minute to check for scheduled calls
2. System identifies calls due within the next 5 minutes
3. System automatically triggers calls via Twilio
4. Call status is updated in database

### **Step 3: Call Initiation**
**Service:** `TwilioService.initiateCall()`

**What happens:**
1. Twilio initiates call to patient's phone number
2. Call session is created with patient and medication data
3. Webhook URL is configured for call flow management
4. Call is connected to EchoCare's voice system

### **Step 4: Medication Reminder (Greeting)**
**Service:** `TwilioService.handleGreeting()`

**What happens:**
1. **Murf AI TTS:** Generates personalized medication reminder in patient's language
2. **Content:** "Hi John, it's 9:00 AM. Time to take your Aspirin. Please take 100mg with food."
3. **Technology:** Uses Murf AI WebSocket streaming for real-time, high-quality TTS
4. **Language:** Delivered in patient's preferred language (en, hi, es, fr, de)

### **Step 5: Health Update Question**
**Service:** `TwilioService.handleHealthCheck()`

**What happens:**
1. **Murf AI TTS:** Asks health update question in patient's language
2. **Content:** "How are you feeling today? Are you experiencing any side effects or health issues?"
3. **Voice:** Uses healthcare-optimized voice profile
4. **Input:** Configures Twilio speech recognition to capture patient response

### **Step 6: Speech-to-Text Processing**
**Service:** `TwilioService.processPatientResponse()`

**What happens:**
1. **Twilio Speech Recognition:** Converts patient's spoken response to text
2. **Language Support:** Handles multiple languages (en, hi, es, fr, de)
3. **Processing:** Enhanced speech model for phone call quality
4. **Storage:** Patient response stored in conversation history

### **Step 7: AI Health Analysis**
**Service:** `GeminiService.getHealthResponse()`

**What happens:**
1. **Gemini AI:** Analyzes patient's health update
2. **Context:** Considers patient's medication, dosage, and conversation history
3. **Response:** Generates doctor-like, compassionate health guidance
4. **Language:** Response generated in patient's preferred language
5. **Content:** Acknowledges concerns, provides guidance, encourages medication compliance

### **Step 8: Real-Time AI Response Delivery**
**Service:** `MurfService.streamWebSocketText()`

**What happens:**
1. **WebSocket Streaming:** Converts Gemini's text response to speech in real-time
2. **Technology:** Uses Murf AI WebSocket API for low-latency streaming
3. **Quality:** High-quality, natural-sounding voice in patient's language
4. **Delivery:** Streams audio chunks directly to the call

### **Step 9: Follow-up Question**
**Service:** `TwilioService.handleFollowUpQuestion()`

**What happens:**
1. **Gemini AI:** Generates contextual follow-up question based on patient's response
2. **Murf AI TTS:** Converts follow-up question to speech
3. **Content:** Natural, caring question like a family member would ask
4. **Purpose:** Gathers additional health information if needed

### **Step 10: Final Take Care Message**
**Service:** `TwilioService.handleFollowUp()`

**What happens:**
1. **Final AI Response:** Gemini provides concluding health guidance
2. **Take Care Message:** Murf AI delivers personalized goodbye message
3. **Content:** "Thank you for your time. Remember to take your medication as prescribed. Take care and have a great day!"
4. **Call End:** Graceful call termination with session cleanup

## 🔧 Technical Architecture

### **Core Services:**

1. **PatientController:** Manages patient registration and medication scheduling
2. **SchedulerService:** Handles automated call scheduling with cron jobs
3. **TwilioService:** Manages call flow, webhooks, and speech recognition
4. **MurfService:** Provides real-time TTS using WebSocket streaming
5. **GeminiService:** Generates AI-powered health responses

### **Database Schema:**
- `patients`: Patient information and preferences
- `medication_schedules`: Medication timing and details
- `call_schedules`: Scheduled reminder calls
- `health_checks`: Health updates and AI analysis
- `voice_recordings`: Call recordings and transcriptions

### **API Endpoints:**

#### **Patient Management:**
- `POST /api/patients` - Create patient and medication schedule
- `GET /api/patients` - Get all patients
- `GET /api/patients/:id` - Get specific patient
- `PUT /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Deactivate patient

#### **Call Management:**
- `POST /api/calls/initiate` - Manually initiate call
- `GET /api/calls/active` - Get active calls
- `POST /api/calls/webhook` - Twilio webhook handler
- `POST /api/calls/process-response` - Process patient speech
- `POST /api/calls/follow-up` - Handle follow-up responses

#### **Testing & Utilities:**
- `POST /api/test/murf-voice` - Test Murf AI TTS
- `POST /api/test/gemini-response` - Test Gemini AI responses
- `POST /api/test/websocket-tts` - Test WebSocket TTS
- `GET /api/voices` - Get available voices
- `GET /api/websocket-status` - Check WebSocket status

## 🌐 Language Support

### **Supported Languages:**
- **English (en):** Default language with multiple voice options
- **Hindi (hi):** Indian language support
- **Spanish (es):** Spanish language support
- **French (fr):** French language support
- **German (de):** German language support

### **Voice Profiles:**
- **Healthcare-optimized voices** for each language
- **Natural, compassionate tone** suitable for medical conversations
- **Real-time streaming** for low-latency responses

## 🔄 Real-Time Features

### **WebSocket TTS Streaming:**
- **Low latency:** Real-time audio generation
- **High quality:** Professional-grade voice synthesis
- **Multilingual:** Support for all system languages
- **Fallback:** Automatic fallback to REST API if WebSocket fails

### **Call Flow Management:**
- **Session tracking:** Maintains conversation context
- **Error handling:** Graceful degradation on failures
- **Status monitoring:** Real-time call status updates
- **Cleanup:** Automatic session cleanup on call completion

## 🚀 Getting Started

### **1. Environment Setup:**
```bash
# Copy environment template
cp env.example .env

# Configure required environment variables:
# - TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER
# - MURF_API_KEY
# - GEMINI_API_KEY
# - SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
```

### **2. Database Setup:**
```bash
# Run database schema
psql -d your_database -f schema/schema.sql
```

### **3. Start Server:**
```bash
npm install
npm start
```

### **4. Test Complete Flow:**
```bash
node test-complete-flow.js
```

## 📊 Monitoring & Debugging

### **Active Call Monitoring:**
```bash
GET /api/calls/active
```

### **WebSocket Status:**
```bash
GET /api/websocket-status
```

### **System Logs:**
- All interactions logged to database
- Error tracking and debugging information
- Call performance metrics

## 🎯 Success Metrics

### **Flow Completion:**
- ✅ Patient registration and medication scheduling
- ✅ Automated call triggering
- ✅ Multilingual medication reminders
- ✅ Health update collection
- ✅ AI-powered health responses
- ✅ Real-time TTS delivery
- ✅ Final take care messages
- ✅ Complete conversation flow

### **Technical Performance:**
- ✅ WebSocket TTS streaming
- ✅ Low-latency voice generation
- ✅ Multilingual speech recognition
- ✅ AI health analysis
- ✅ Session management
- ✅ Error handling and fallbacks

## 🔧 Troubleshooting

### **Common Issues:**
1. **WebSocket Connection Failed:** Check Murf API key and network connectivity
2. **Call Not Initiating:** Verify Twilio credentials and phone number
3. **Database Errors:** Check Supabase connection and schema
4. **TTS Quality Issues:** Verify voice profile configuration

### **Testing:**
- Use `test-complete-flow.js` for comprehensive testing
- Individual component tests available for debugging
- WebSocket status monitoring for real-time issues

---

**EchoCare Backend is now fully functional and ready for production deployment!** 🚀 