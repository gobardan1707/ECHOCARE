import twilio from 'twilio';
import dotenv from 'dotenv';
import { GeminiService } from './geminiService.js';
import { MurfService, murfWebSocket } from './murfService.js';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';
import WebSocket from 'ws';

dotenv.config();

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class TwilioService {
  // Store active call sessions for real-time processing
  static activeCalls = new Map();
  static twilioMediaSockets = new Map();

  static async initiateCall(phoneNumber, medicationData, language = 'en') {
    try {
      const {
        patientName,
        medicationName,
        medicationTime,
        dosage,
        instructions,
        patientId,
        voiceProfile
      } = medicationData;

      // Create call session data
      const callSession = {
        patientId,
        patientName,
        medicationName,
        medicationTime,
        dosage,
        instructions,
        language,
        voiceProfile,
        conversationHistory: [],
        currentStep: 'greeting'
      };

      const webhookUrl = `${process.env.BASE_URL}/api/calls/webhook`;
      
      const call = await client.calls.create({
        url: webhookUrl,
        to: phoneNumber,
        from: process.env.TWILIO_PHONE_NUMBER,
        statusCallback: `${process.env.BASE_URL}/api/calls/status-callback`,
statusCallbackEvent: ['initiated', 'ringing', 'answered', 'in-progress', 'completed'],
        statusCallbackMethod: 'POST',
        machineDetection: 'Enable',
        machineDetectionTimeout: 60,
        machineDetectionSpeechThreshold: 3000,
        machineDetectionSpeechEndThreshold: 1000,
        machineDetectionSilenceTimeout: 10000,
        customParameters: {
          patientId,
          language,
          voiceProfile: voiceProfile || MurfService.getVoiceForLanguage(language)
        }
      });

      this.activeCalls.set(call.sid, callSession);
      
      return call;
    } catch (error) {
      console.error('Error initiating Twilio call:', error);
      throw error;
    }
  }

  static async handleCallWebhook(req, res) {
    const callSid = req.sid
    
    if (!callSid) {
      console.error('CallSid not found in request');
      return res.status(400).send('CallSid not found');
    }
    
    const callSession = this.activeCalls.get(callSid);
    
    if (!callSession) {
      console.error('Call session not found for SID:', callSid);
      return res.status(404).send('Call session not found');
    }

    const twiml = new twilio.twiml.VoiceResponse();
    
    try {
      switch (callSession.currentStep) {
        case 'greeting':
          await this.handleGreeting(twiml, callSession, res);
          break;
        case 'health_check':
          await this.handleHealthCheck(twiml, callSession, res);
          break;
        case 'follow_up':
          await this.handleFollowUp(req, res);
          break;
        default:
          await this.handleGreeting(twiml, callSession, res);
      }
    } catch (error) {
      console.error('Error handling call webhook:', error);
      twiml.say('Sorry, there was an error. Please try again later.');
      res.type('text/xml');
      res.send(twiml.toString());
    }
  }

  static async handleGreeting(twiml, callSession, res) {
  const greetingText = this.getGreetingText(callSession);
  const audioChunks = [];

  const cleanupListeners = () => {
    murfWebSocket.removeAllListeners('audioChunk');
    murfWebSocket.removeAllListeners('streamingComplete');
    if (murfWebSocket?.disconnect) murfWebSocket.disconnect();
  };

  try {
    cleanupListeners();
    await murfWebSocket.connect();

    murfWebSocket.on('audioChunk', ({ audioChunk }) => {
      audioChunks.push(audioChunk);
    });

    return new Promise(async (resolve, reject) => {
      murfWebSocket.on('streamingComplete', async ({ isFinal }) => {
        if (isFinal) {
          const completeAudio = Buffer.concat(audioChunks);
          const filename = `${uuidv4()}.wav`;
          const audioDir = path.join(__dirname, '..', 'public', 'audio');
          const filePath = path.join(audioDir, filename);

          if (!fs.existsSync(audioDir)) fs.mkdirSync(audioDir, { recursive: true });
          fs.writeFileSync(filePath, completeAudio);

          const audioUrl = `${process.env.BASE_URL}/audio/${filename}`;
          twiml.play(audioUrl);
          

          callSession.currentStep = 'health_check';
          twiml.redirect({ method: 'POST' }, `${process.env.BASE_URL}/api/calls/webhook`);
          res.type('text/xml').send(twiml.toString());
           

          cleanupListeners();
           setTimeout(() => {
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
            }
          }, 5000);
          resolve();
        }
      });

      await murfWebSocket.startRealTimeTTS(
        greetingText,
        callSession.language,
        callSession.voiceProfile
      );

      setTimeout(() => {
        cleanupListeners();
        reject(new Error('WebSocket TTS timeout'));
      }, 20000);
    });
  } catch (error) {
    console.error('Greeting TTS error:', error);
    cleanupListeners();

    twiml.say({ voice: 'alice', language: callSession.language }, 'Sorry, the service is currently unavailable.');
    res.type('text/xml').send(twiml.toString());
  }
}



static async handleHealthCheck(twiml, callSession, res) {
  const healthQuestionText = this.getHealthQuestionText(callSession);
  const audioChunks = [];

  const cleanupListeners = () => {
    murfWebSocket.removeAllListeners('audioChunk');
    murfWebSocket.removeAllListeners('streamingComplete');
  };

  try {
    cleanupListeners();
    await murfWebSocket.connect();

    murfWebSocket.on('audioChunk', ({ audioChunk }) => {
      audioChunks.push(audioChunk);
    });

    return new Promise(async (resolve, reject) => {
      murfWebSocket.on('streamingComplete', async ({ isFinal }) => {
        if (isFinal) {
          const completeAudio = Buffer.concat(audioChunks);
          const filename = `${uuidv4()}.wav`;
          const audioDir = path.join(__dirname, '..', 'public', 'audio');
          const filePath = path.join(audioDir, filename);

          if (!fs.existsSync(audioDir)) fs.mkdirSync(audioDir, { recursive: true });
          fs.writeFileSync(filePath, completeAudio);

          const audioUrl = `${process.env.BASE_URL}/audio/${filename}`;
          twiml.play(audioUrl);

          twiml.gather({
            input: 'speech',
            action: `${process.env.BASE_URL}/api/calls/process-response`,
            method: 'POST',
            speechTimeout: 'auto',
            language: callSession.language,
            enhanced: true,
            speechModel: 'phone_call'
          });

          res.type('text/xml').send(twiml.toString());
          cleanupListeners();
          setTimeout(() => {
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        }, 5000);
          resolve();
        }
      });

      await murfWebSocket.startRealTimeTTS(
        healthQuestionText,
        callSession.language,
        callSession.voiceProfile
      );

      setTimeout(() => {
        cleanupListeners();
        reject(new Error('WebSocket TTS timeout'));
      }, 20000);
    });
  } catch (error) {
    console.error('HealthCheck TTS error:', error);
    cleanupListeners();

    twiml.say({ voice: 'alice', language: callSession.language }, healthQuestionText);
    res.type('text/xml').send(twiml.toString());
  }
}


  static async processPatientResponse(req, res) {
  const callSid = req.body.CallSid;
  const patientResponse = req.body.SpeechResult;
  const callSession = this.activeCalls.get(callSid);

  console.log('Patient response:', patientResponse);

  if (!callSession) {
    console.error('Call session not found for SID:', callSid);
    return res.status(404).send('Call session not found');
  }

  try {
    // Save patient response
    callSession.conversationHistory.push({
      speaker: 'patient',
      text: patientResponse,
      timestamp: new Date()
    });

    // Prepare AI context
    const patientContext = {
      name: callSession.patientName,
      medication: callSession.medicationName,
      dosage: callSession.dosage,
      instructions: callSession.instructions,
      conversationHistory: callSession.conversationHistory
    };

    // Get AI response from Gemini
    const aiResponse = await GeminiService.getHealthResponse(
      patientResponse,
      patientContext,
      callSession.language
    );

    // Save AI response
    callSession.conversationHistory.push({
      speaker: 'ai',
      text: aiResponse,
      timestamp: new Date()
    });

    const twiml = new twilio.twiml.VoiceResponse();
    
    // Use Twilio's built-in TTS
    twiml.say({
      voice: 'alice', // or any other Twilio voice you prefer
      language: callSession.language
    }, aiResponse);

    // Add gather for follow-up response
    twiml.gather({
      input: 'speech',
      action: `${process.env.BASE_URL}/api/calls/follow-up`,
      method: 'POST',
      speechTimeout: 'auto',
      language: callSession.language,
      enhanced: true,
      speechModel: 'phone_call'
    });

    // Send the TwiML response
    res.type('text/xml').send(twiml.toString());

  } catch (error) {
    console.error('Error processing patient response:', error);

    const twiml = new twilio.twiml.VoiceResponse();
    twiml.say({
      voice: 'alice',
      language: callSession.language
    }, 'Sorry, there was an error. Please try again later.');

    // Still allow follow-up even in error case
    twiml.gather({
      input: 'speech',
      action: `${process.env.BASE_URL}/api/calls/follow-up`,
      method: 'POST',
      speechTimeout: 'auto',
      language: callSession.language
    });

    res.type('text/xml').send(twiml.toString());
  }
}



  static async handleFollowUp(req, res) {
  const callSid = req.body.CallSid;
  const callSession = this.activeCalls.get(callSid);
  const followUpResponse = req.body.SpeechResult;

  if (!callSession) {
    console.error('Call session not found for SID:', callSid);
    return res.status(404).send('Call session not found');
  }

  const twiml = new twilio.twiml.VoiceResponse();

  // Store patient response
  callSession.conversationHistory.push({
    speaker: 'patient',
    text: followUpResponse,
    timestamp: new Date()
  });

  const patientContext = {
    name: callSession.patientName,
    medication: callSession.medicationName,
    dosage: callSession.dosage,
    instructions: callSession.instructions,
    conversationHistory: callSession.conversationHistory
  };

  try {
    const finalResponse = await GeminiService.getFollowUpQuestion(
      followUpResponse,
      patientContext,
      callSession.language
    );

    // Use Twilio's built-in TTS for the final response
    twiml.say({
      voice: 'alice',
      language: callSession.language
    }, finalResponse);

    // Goodbye message
    const goodbyeText = this.getGoodbyeText(callSession);
    twiml.say({
      voice: 'alice',
      language: callSession.language
    }, goodbyeText);

    // End the call
    twiml.hangup();

    // Clean up call session
    this.activeCalls.delete(callSid);

    res.type('text/xml');
    res.send(twiml.toString());

  } catch (error) {
    console.error('Error generating final response:', error);

    // Error fallback
    twiml.say({
      voice: 'alice',
      language: callSession.language
    }, 'Sorry, an error occurred while ending the call. Please try again later.');

    twiml.hangup();
    this.activeCalls.delete(callSid);
    res.type('text/xml');
    res.send(twiml.toString());
  }
}


  static getGreetingText(callSession) {
    const greetings = {
      'en': `Hi ${callSession.patientName}, it's ${callSession.medicationTime}. Time to take your ${callSession.medicationName}. ${callSession.dosage ? `Please take ${callSession.dosage}.` : ''} ${callSession.instructions ? callSession.instructions : ''}`,
      'hi': `नमस्ते ${callSession.patientName}, अब ${callSession.medicationTime} हो गया है। आपकी दवा ${callSession.medicationName} लेने का समय हो गया है। ${callSession.dosage ? `कृपया ${callSession.dosage} लें।` : ''} ${callSession.instructions ? callSession.instructions : ''}`,
      'es': `Hola ${callSession.patientName}, es ${callSession.medicationTime}. Es hora de tomar tu ${callSession.medicationName}. ${callSession.dosage ? `Por favor toma ${callSession.dosage}.` : ''} ${callSession.instructions ? callSession.instructions : ''}`,
      'fr': `Bonjour ${callSession.patientName}, il est ${callSession.medicationTime}. Il est temps de prendre votre ${callSession.medicationName}. ${callSession.dosage ? `Veuillez prendre ${callSession.dosage}.` : ''} ${callSession.instructions ? callSession.instructions : ''}`,
      'de': `Hallo ${callSession.patientName}, es ist ${callSession.medicationTime}. Es ist Zeit, Ihr ${callSession.medicationName} einzunehmen. ${callSession.dosage ? `Bitte nehmen Sie ${callSession.dosage}.` : ''} ${callSession.instructions ? callSession.instructions : ''}`
    };
    
    return greetings[callSession.language] || greetings['en'];
  }

  static getHealthQuestionText(callSession) {
    const questions = {
      'en': 'How are you feeling today? Are you experiencing any side effects or health issues?',
      'hi': 'आज आप कैसा महसूस कर रहे हैं? क्या आप कोई दुष्प्रभाव या स्वास्थ्य समस्या का अनुभव कर रहे हैं?',
      'es': '¿Cómo te sientes hoy? ¿Estás experimentando algún efecto secundario o problema de salud?',
      'fr': 'Comment vous sentez-vous aujourd\'hui? Ressentez-vous des effets secondaires ou des problèmes de santé?',
      'de': 'Wie fühlen Sie sich heute? Haben Sie Nebenwirkungen oder Gesundheitsprobleme?'
    };
    
    return questions[callSession.language] || questions['en'];
  }

  static getGoodbyeText(callSession) {
    const goodbyes = {
      'en': 'Thank you for your time. Remember to take your medication as prescribed. Take care and have a great day!',
      'hi': 'आपके समय के लिए धन्यवाद। याद रखें कि अपनी दवा निर्धारित अनुसार लें। ध्यान रखें और आपका दिन शुभ हो!',
      'es': 'Gracias por tu tiempo. Recuerda tomar tu medicamento según lo prescrito. ¡Cuídate y que tengas un buen día!',
      'fr': 'Merci pour votre temps. N\'oubliez pas de prendre vos médicaments comme prescrit. Prenez soin de vous et passez une bonne journée!',
      'de': 'Vielen Dank für Ihre Zeit. Denken Sie daran, Ihre Medikamente wie verschrieben einzunehmen. Passen Sie auf sich auf und haben Sie einen schönen Tag!'
    };
    
    return goodbyes[callSession.language] || goodbyes['en'];
  }

  static async handleCallStatusCallback(req, res) {
  const callSid = req.body.CallSid; 
  const callStatus = req.body.CallStatus;
  
  console.log(`Call ${callSid} status: ${callStatus}`);
  
  if (['completed', 'failed', 'busy', 'no-answer', 'canceled'].includes(callStatus)) {
    this.activeCalls.delete(callSid);
  
  }
  
  res.status(200).send('OK');
}

  static getActiveCalls() {
    return Array.from(this.activeCalls.entries()).map(([sid, session]) => ({
      callSid: sid,
      patientName: session.patientName,
      currentStep: session.currentStep,
      language: session.language
    }));
  }

  // Helper method for follow-up questions
  static async handleFollowUpQuestion(twiml, callSession, res, patientResponse, patientContext) {
  const followUpQuestion = await GeminiService.getFollowUpQuestion(
    patientResponse,
    patientContext,
    callSession.language
  );

  const followUpAudioChunks = [];

  const cleanupListeners = () => {
    murfWebSocket.removeAllListeners('audioChunk');
    murfWebSocket.removeAllListeners('streamingComplete');
  };

  try {
    await murfWebSocket.connect();

    murfWebSocket.on('audioChunk', ({ audioChunk }) => {
      followUpAudioChunks.push(audioChunk);
    });

    return new Promise(async (resolve, reject) => {
      murfWebSocket.on('streamingComplete', ({ isFinal }) => {
        if (isFinal) {
          const completeAudio = Buffer.concat(followUpAudioChunks);
          const audioData = `data:audio/wav;base64,${completeAudio.toString('base64')}`;
          twiml.play(audioData);

          // Gather follow-up response from patient
          twiml.gather({
            input: 'speech',
            action: `${process.env.BASE_URL}/api/calls/follow-up`,
            method: 'POST',
            speechTimeout: 'auto',
            language: callSession.language,
            enhanced: true,
            speechModel: 'phone_call'
          });

          // Fallback message if user does not speak
          twiml.say({
            voice: 'alice',
            language: callSession.language
          }, 'Thank you for your time. Take care!');

          res.type('text/xml');
          res.send(twiml.toString());

          cleanupListeners();
          resolve();
        }
      });

      // Stream follow-up question via WebSocket
      await murfWebSocket.streamTextChunks(
        followUpQuestion.split(' '),
        callSession.voiceProfile || MurfService.getVoiceForLanguage(callSession.language)
      );

      // Timeout fallback
      setTimeout(() => {
        cleanupListeners();
        reject(new Error('Follow-up WebSocket TTS timeout'));
      }, 15000);
    });

  } catch (error) {
    console.error('Follow-up WebSocket TTS failed:', error);

    twiml.say({
      voice: 'alice',
      language: callSession.language
    }, 'Sorry, something went wrong. Thank you for your time. Take care!');

    res.type('text/xml');
    res.send(twiml.toString());
  }
}

}



export function setupTwilioStreamSocket(server) {
  const wss = new WebSocket.Server({ server, path: '/twilio-stream' });

  wss.on('connection', (ws) => {
    let callSid = null;

    ws.on('message', (message) => {
      const data = JSON.parse(message);

      if (data.event === 'start') {
        callSid = data.start.callSid;
        console.log(`[${callSid}] Twilio stream started`);
        TwilioService.twilioMediaSockets.set(callSid, ws);
      }

      if (data.event === 'stop') {
        console.log(`[${callSid}] Twilio stream stopped`);
        if (callSid) TwilioService.twilioMediaSockets.delete(callSid);
        ws.close();
      }
    });

    ws.on('close', () => {
      console.log(`[${callSid}] Twilio socket closed`);
      if (callSid) TwilioService.twilioMediaSockets.delete(callSid);
    });
  });
}
