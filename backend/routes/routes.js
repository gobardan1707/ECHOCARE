import express from 'express';
import controller from '../controllers/controller.js';
import * as callController from '../controllers/callController.js';
import { PatientController } from '../controllers/patientController.js';
import { get } from 'http';

const router = express.Router();

// Existing routes
router.get('/message', controller.getMessage);

// Patient management routes (ADDED)
router.post('/patients', PatientController.createPatientAndMedication);
router.get('/patients', PatientController.getPatients);
router.get('/patients/:id', PatientController.getPatient);
router.put('/patients/:id', PatientController.updatePatient);
router.delete('/patients/:id', PatientController.deletePatient);

router.get('/api/voice-models', callController.getAvailableVoices);

// Call management routes
router.post('/calls/initiate', callController.initiateCall);
router.get('/calls/active', callController.getActiveCalls);

// Twilio webhook routes (these receive webhooks from Twilio)
router.post('/calls/webhook', callController.handleCallWebhook);
router.post('/calls/process-response', callController.processPatientResponse);
router.post('/calls/follow-up', callController.handleFollowUp);
router.post('/calls/status-callback', callController.handleCallStatusCallback);

// Testing and utility routes
router.post('/test/murf-voice', callController.testMurfVoice);
router.post('/test/gemini-response', callController.testGeminiResponse);
router.get('/voices', callController.getAvailableVoices);

// WebSocket testing routes
router.post('/test/websocket-tts', callController.testWebSocketTTS);
router.post('/test/realtime-streaming', callController.testRealTimeStreaming);
router.get('/websocket-status', callController.getWebSocketStatus);

export default router;

