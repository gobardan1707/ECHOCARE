import twilio from 'twilio';
import dotenv from 'dotenv';
import { GeminiService } from './geminiService.js';
import { MurfService, murfWebSocket } from './murfService.js';

dotenv.config();

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export class TwilioService {
  // Store active call sessions for real-time processing
  static activeCalls = new Map();

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
        statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'],
        statusCallbackMethod: 'POST',
        machineDetection: 'Enable',
        machineDetectionTimeout: 30,
        machineDetectionSpeechThreshold: 3000,
        machineDetectionSpeechEndThreshold: 1000,
        machineDetectionSilenceTimeout: 10000,
        // Pass session data as custom parameters
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
        case 'ai_response':
          await this.handleAIResponse(twiml, callSession, res);
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
    
    try {
      // Use WebSocket-based real-time TTS
      const sessionId = await MurfService.startWebSocketTTS(
        greetingText,
        callSession.language,
        callSession.voiceProfile
      );

      // Collect audio chunks for complete audio
      const audioChunks = [];
      
      return new Promise((resolve, reject) => {
        MurfService.onAudioChunk(({ audioChunk, isFinal }) => {
          audioChunks.push(audioChunk);
        });

        MurfService.onStreamingComplete(({ isFinal }) => {
          if (isFinal) {
            // Combine all audio chunks
            const completeAudio = Buffer.concat(audioChunks);
            
            // Convert to base64 for TwiML
            const audioData = `data:audio/wav;base64,${completeAudio.toString('base64')}`;
            twiml.play(audioData);
            
            // Move to health check step
            callSession.currentStep = 'health_check';
            
            // Gather patient response for health update
            twiml.gather({
              input: 'speech',
              action: `${process.env.BASE_URL}/api/calls/process-response`,
              method: 'POST',
              speechTimeout: 'auto',
              language: callSession.language,
              enhanced: true,
              speechModel: 'phone_call'
            });

            res.type('text/xml');
            res.send(twiml.toString());
            resolve();
          }
        });

        // Timeout fallback
        setTimeout(() => {
          reject(new Error('WebSocket TTS timeout'));
        }, 15000);
      });

    } catch (error) {
      console.error('WebSocket TTS failed, using REST API fallback:', error);
      
      // Fallback to traditional REST API method
      try {
        const audioUrl = await MurfService.generateRealTimeAudio(
          greetingText,
          callSession.language,
          callSession.voiceProfile
        );
        twiml.play(audioUrl);
      } catch (fallbackError) {
        console.error('REST API TTS also failed, using Twilio TTS:', fallbackError);
        twiml.say({
          voice: 'alice',
          language: callSession.language
        }, greetingText);
      }

      // Move to health check step
      callSession.currentStep = 'health_check';
      
      // Gather patient response for health update
      twiml.gather({
        input: 'speech',
        action: `${process.env.BASE_URL}/api/calls/process-response`,
        method: 'POST',
        speechTimeout: 'auto',
        language: callSession.language,
        enhanced: true,
        speechModel: 'phone_call'
      });

      res.type('text/xml');
      res.send(twiml.toString());
    }
  }

  static async handleHealthCheck(twiml, callSession, res) {
    const healthQuestionText = this.getHealthQuestionText(callSession);
    
    try {
      const audioUrl = await MurfService.generateAudio(
        healthQuestionText,
        callSession.language,
        callSession.voiceProfile
      );
      
      twiml.play(audioUrl);
    } catch (error) {
      console.error('Error generating health question audio:', error);
      twiml.say({
        voice: 'alice',
        language: callSession.language
      }, healthQuestionText);
    }

    res.type('text/xml');
    res.send(twiml.toString());
  }

  static async processPatientResponse(req, res) {
    const callSid = req.body.CallSid;
    const callSession = this.activeCalls.get(callSid);
    const patientResponse = req.body.SpeechResult;
    console.log('Patient response:', patientResponse);
    
    if (!callSession) {
      console.error('Call session not found for SID:', callSid);
      return res.status(404).send('Call session not found');
    }

    const twiml = new twilio.twiml.VoiceResponse();
    
    try {
      // Store patient response in conversation history
      callSession.conversationHistory.push({
        speaker: 'patient',
        text: patientResponse,
        timestamp: new Date()
      });

      // Get AI response from Gemini
      const patientContext = {
        name: callSession.patientName,
        medication: callSession.medicationName,
        dosage: callSession.dosage,
        instructions: callSession.instructions,
        conversationHistory: callSession.conversationHistory
      };

      const aiResponse = await GeminiService.getHealthResponse(
        patientResponse,
        patientContext,
        callSession.language
      );

      // Store AI response in conversation history
      callSession.conversationHistory.push({
        speaker: 'ai',
        text: aiResponse,
        timestamp: new Date()
      });

      // Use WebSocket-based real-time TTS for AI response
      try {
        const sessionId = await MurfService.streamWebSocketText(
          aiResponse,
          callSession.language,
          callSession.voiceProfile
        );

        // Collect audio chunks for AI response
        const aiAudioChunks = [];
        
        return new Promise((resolve, reject) => {
          MurfService.onAudioChunk(({ audioChunk, isFinal }) => {
            aiAudioChunks.push(audioChunk);
          });

          MurfService.onStreamingComplete(({ isFinal }) => {
            if (isFinal) {
              // Combine all audio chunks
              const completeAudio = Buffer.concat(aiAudioChunks);
              const audioData = `data:audio/wav;base64,${completeAudio.toString('base64')}`;
              twiml.play(audioData);

              // Ask follow-up question
              this.handleFollowUpQuestion(twiml, callSession, res, patientResponse, patientContext);
              resolve();
            }
          });

          // Timeout fallback
          setTimeout(() => {
            reject(new Error('AI response WebSocket TTS timeout'));
          }, 15000);
        });

      } catch (wsError) {
        console.error('WebSocket TTS failed, using fallback:', wsError);
        
        const audioUrl = await MurfService.generateRealTimeAudio(
          aiResponse,
          callSession.language,
          callSession.voiceProfile
        );
        twiml.play(audioUrl);
        
        
        await this.handleFollowUpQuestion(twiml, callSession, res, patientResponse, patientContext);
      }

    } catch (error) {
      console.error('Error processing patient response:', error);
      twiml.say({
        voice: 'alice',
        language: callSession.language
      }, 'Sorry, there was an error. Please try again later.');
      res.type('text/xml');
      res.send(twiml.toString());
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
    
    // Store follow-up response
    callSession.conversationHistory.push({
      speaker: 'patient',
      text: followUpResponse,
      timestamp: new Date()
    });

    // Get final AI response
    const patientContext = {
      name: callSession.patientName,
      medication: callSession.medicationName,
      dosage: callSession.dosage,
      instructions: callSession.instructions,
      conversationHistory: callSession.conversationHistory
    };

    const finalResponse = await GeminiService.getHealthResponse(
      followUpResponse,
      patientContext,
      callSession.language
    );

    // Generate final audio using WebSocket TTS for real-time response
    try {
      const sessionId = await MurfService.streamWebSocketText(
        finalResponse,
        callSession.language,
        callSession.voiceProfile
      );

      // Collect audio chunks for final response
      const finalAudioChunks = [];
      
      return new Promise((resolve, reject) => {
        MurfService.onAudioChunk(({ audioChunk, isFinal }) => {
          finalAudioChunks.push(audioChunk);
        });

        MurfService.onStreamingComplete(({ isFinal }) => {
          if (isFinal) {
            // Combine all audio chunks
            const completeAudio = Buffer.concat(finalAudioChunks);
            const audioData = `data:audio/wav;base64,${completeAudio.toString('base64')}`;
            twiml.play(audioData);

            // End call with goodbye message (take care message)
            const goodbyeText = this.getGoodbyeText(callSession);
            twiml.say({
              voice: 'alice',
              language: callSession.language
            }, goodbyeText);
            
            twiml.hangup();

            // Clean up call session
            this.activeCalls.delete(callSid);

            res.type('text/xml');
            res.send(twiml.toString());
            resolve();
          }
        });

        // Timeout fallback
        setTimeout(() => {
          reject(new Error('Final response WebSocket TTS timeout'));
        }, 15000);
      });

    } catch (wsError) {
      console.error('Final response WebSocket TTS failed, using fallback:', wsError);
      
      // Fallback to traditional method
      const audioUrl = await MurfService.generateRealTimeAudio(
        finalResponse,
        callSession.language,
        callSession.voiceProfile
      );
      twiml.play(audioUrl);

      // End call with goodbye message (take care message)
      const goodbyeText = this.getGoodbyeText(callSession);
      twiml.say({
        voice: 'alice',
        language: callSession.language
      }, goodbyeText);
      
      twiml.hangup();

      // Clean up call session
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
    const callSid = req.sid;
    const callStatus = req.status;
    
    console.log(`Call ${callSid} status: ${callStatus}`);
    
    if (['completed', 'failed', 'busy', 'no-answer'].includes(callStatus)) {
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

    try {
      const followUpSessionId = await MurfService.streamWebSocketText(
        followUpQuestion,
        callSession.language,
        callSession.voiceProfile
      );

      // Collect audio chunks for follow-up
      const followUpAudioChunks = [];
      
      return new Promise((resolve, reject) => {
        MurfService.onAudioChunk(({ audioChunk, isFinal }) => {
          followUpAudioChunks.push(audioChunk);
        });

        MurfService.onStreamingComplete(({ isFinal }) => {
          if (isFinal) {
            // Combine all audio chunks
            const completeAudio = Buffer.concat(followUpAudioChunks);
            const audioData = `data:audio/wav;base64,${completeAudio.toString('base64')}`;
            twiml.play(audioData);

            // Gather follow-up response
            twiml.gather({
              input: 'speech',
              action: `${process.env.BASE_URL}/api/calls/follow-up`,
              method: 'POST',
              speechTimeout: 'auto',
              language: callSession.language,
              enhanced: true,
              speechModel: 'phone_call'
            });

            // If no response, end call gracefully
            twiml.say({
              voice: 'alice',
              language: callSession.language
            }, 'Thank you for your time. Take care!');

            res.type('text/xml');
            res.send(twiml.toString());
            resolve();
          }
        });

        // Timeout fallback
        setTimeout(() => {
          reject(new Error('Follow-up WebSocket TTS timeout'));
        }, 15000);
      });

    } catch (wsError) {
      console.error('Follow-up WebSocket TTS failed, using fallback:', wsError);
      const followUpAudioUrl = await MurfService.generateRealTimeAudio(
        followUpQuestion,
        callSession.language,
        callSession.voiceProfile
      );
      twiml.play(followUpAudioUrl);

      // Gather follow-up response
      twiml.gather({
        input: 'speech',
        action: `${process.env.BASE_URL}/api/calls/follow-up`,
        method: 'POST',
        speechTimeout: 'auto',
        language: callSession.language,
        enhanced: true,
        speechModel: 'phone_call'
      });

      // If no response, end call gracefully
      twiml.say({
        voice: 'alice',
        language: callSession.language
      }, 'Thank you for your time. Take care!');

      res.type('text/xml');
      res.send(twiml.toString());
    }
  }
}