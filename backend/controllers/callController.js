import { TwilioService } from '../services/twilioService.js';
import { GeminiService } from '../services/geminiService.js';
import { MurfService } from '../services/murfService.js';

// Initiate a medication reminder call
export const initiateCall = async (req, res) => {
  try {
    const {
      phoneNumber,
      patientName,
      medicationName,
      medicationTime,
      dosage,
      instructions,
      patientId,
      language = 'en',
      voiceProfile
    } = req.body;

    // Validate required fields
    if (!phoneNumber || !patientName || !medicationName || !medicationTime) {
      return res.status(400).json({
        error: 'Missing required fields: phoneNumber, patientName, medicationName, medicationTime'
      });
    }

    const medicationData = {
      patientName,
      medicationName,
      medicationTime,
      dosage,
      instructions,
      patientId,
      voiceProfile
    };

    const call = await TwilioService.initiateCall(phoneNumber, medicationData, language);

    res.status(200).json({
      success: true,
      callSid: call.sid,
      status: call.status,
      message: 'Call initiated successfully'
    });
  } catch (error) {
    console.error('Error initiating call:', error);
    res.status(500).json({
      error: 'Failed to initiate call',
      details: error.message
    });
  }
};

// Handle incoming call webhook
export const handleCallWebhook = async (req, res) => {
  try {
    req.sid = req.body.CallSid;
    await TwilioService.handleCallWebhook(req, res);
  } catch (error) {
    console.error('Error handling call webhook:', error);
    res.status(500).json({
      error: 'Failed to handle call webhook',
      details: error.message
    });
  }
};

// Process patient response (health update)
export const processPatientResponse = async (req, res) => {
  try {
    await TwilioService.processPatientResponse(req, res);
  } catch (error) {
    console.error('Error processing patient response:', error);
    res.status(500).json({
      error: 'Failed to process patient response',
      details: error.message
    });
  }
};

// Handle follow-up response
export const handleFollowUp = async (req, res) => {
  try {
    const callSid = req.body.CallSid;
    const callSession = TwilioService.activeCalls.get(callSid);
    const followUpResponse = req.body.SpeechResult;
    
    if (!callSession) {
      console.error('Call session not found for SID:', callSid);
      return res.status(404).send('Call session not found');
    }
await TwilioService.handleFollowUp(req, res);


    // // End call with goodbye message
    // const goodbyeText = TwilioService.getGoodbyeText(callSession);
    // const goodbyeAudioUrl = await MurfService.generateAudio(
    //   goodbyeText,
    //   callSession.language,
    //   callSession.voiceProfile
    // );

    // twiml.play(goodbyeAudioUrl);
    twiml.hangup();

    // Clean up call session
    TwilioService.activeCalls.delete(callSid);

    res.type('text/xml');
    res.send(twiml.toString());
  } catch (error) {
    console.error('Error handling follow-up:', error);
    res.status(500).json({
      error: 'Failed to handle follow-up',
      details: error.message
    });
  }
};

// Handle call status callback
export const handleCallStatusCallback = async (req, res) => {
  try {
    req.sid = req.body.CallSid ;
    req.status = req.body.CallStatus
    await TwilioService.handleCallStatusCallback(req, res);
  } catch (error) {
    console.error('Error handling call status callback:', error);
    res.status(500).json({
      error: 'Failed to handle call status callback',
      details: error.message
    });
  }
};

// Get active calls (for monitoring)
export const getActiveCalls = async (req, res) => {
  try {
    const activeCalls = TwilioService.getActiveCalls();
    res.status(200).json({
      success: true,
      activeCalls,
      count: activeCalls.length
    });
  } catch (error) {
    console.error('Error getting active calls:', error);
    res.status(500).json({
      error: 'Failed to get active calls',
      details: error.message
    });
  }
};

// Test Murf AI voice generation
export const testMurfVoice = async (req, res) => {
  try {
    const { text, language = 'en', voiceProfile } = req.body;
    
    if (!text) {
      return res.status(400).json({
        error: 'Text is required for voice generation'
      });
    }

    const audioUrl = await MurfService.generateAudio(text, language, voiceProfile);
    
    res.status(200).json({
      success: true,
      audioUrl,
      text,
      language,
      voiceProfile: voiceProfile || MurfService.getVoiceForLanguage(language)
    });
  } catch (error) {
    console.error('Error testing Murf voice:', error);
    res.status(500).json({
      error: 'Failed to generate voice',
      details: error.message
    });
  }
};

// Test Gemini AI response
export const testGeminiResponse = async (req, res) => {
  try {
    const { patientResponse, patientContext, language = 'en' } = req.body;
    
    if (!patientResponse) {
      return res.status(400).json({
        error: 'Patient response is required'
      });
    }

    const aiResponse = await GeminiService.getHealthResponse(
      patientResponse,
      patientContext || {},
      language
    );
    
    res.status(200).json({
      success: true,
      aiResponse,
      patientResponse,
      language
    });
  } catch (error) {
    console.error('Error testing Gemini response:', error);
    res.status(500).json({
      error: 'Failed to get AI response',
      details: error.message
    });
  }
};

// Get available voices for a language
export const getAvailableVoices = async (req, res) => {
  try {
    const { language = 'en' } = req.query;
    
    const voices = await MurfService.getAvailableVoices(language);
    
    res.status(200).json({
      success: true,
      voices,
      language,
      count: voices.length
    });
  } catch (error) {
    console.error('Error getting available voices:', error);
    res.status(500).json({
      error: 'Failed to get available voices',
      details: error.message
    });
  }
};

// Test WebSocket-based real-time TTS with official API
export const testWebSocketTTS = async (req, res) => {
  try {
    const { text, language = 'en', voiceProfile } = req.body;
    
    if (!text) {
      return res.status(400).json({
        error: 'Text is required for WebSocket TTS'
      });
    }

    // Connect to WebSocket if not connected
    const status = MurfService.getWebSocketStatus();
    if (!status.isConnected) {
      await MurfService.connectWebSocket();
    }

    // Start real-time TTS streaming
    const sessionId = await MurfService.startWebSocketTTS(text, language, voiceProfile);
    
    // Set up event listeners for demo
    const audioChunks = [];
    
    MurfService.onAudioChunk(({ audioChunk, isFinal }) => {
      audioChunks.push(audioChunk);
      console.log(`🎵 Received audio chunk ${audioChunks.length}`);
    });

    MurfService.onStreamingComplete(({ isFinal }) => {
      if (isFinal) {
        console.log(`✅ Streaming completed with ${audioChunks.length} chunks`);
        const completeAudio = Buffer.concat(audioChunks);
        console.log(`📊 Total audio size: ${completeAudio.length} bytes`);
      }
    });

    res.status(200).json({
      success: true,
      sessionId,
      text,
      language,
      voiceProfile: voiceProfile || MurfService.getVoiceForLanguage(language),
      message: 'WebSocket TTS streaming started using official Murf AI API',
      webSocketStatus: MurfService.getWebSocketStatus()
    });
  } catch (error) {
    console.error('Error testing WebSocket TTS:', error);
    res.status(500).json({
      error: 'Failed to start WebSocket TTS',
      details: error.message
    });
  }
};

// Test real-time text streaming with official API
export const testRealTimeStreaming = async (req, res) => {
  try {
    const { text, language = 'en', voiceProfile } = req.body;
    
    if (!text) {
      return res.status(400).json({
        error: 'Text is required for real-time streaming'
      });
    }

    // Connect to WebSocket if not connected
    const status = MurfService.getWebSocketStatus();
    if (!status.isConnected) {
      await MurfService.connectWebSocket();
    }

    // Start real-time text streaming
    const sessionId = await MurfService.streamWebSocketText(text, language, voiceProfile);
    
    res.status(200).json({
      success: true,
      sessionId,
      text,
      language,
      voiceProfile: voiceProfile || MurfService.getVoiceForLanguage(language),
      message: 'Real-time text streaming started using official Murf AI API',
      webSocketStatus: MurfService.getWebSocketStatus()
    });
  } catch (error) {
    console.error('Error testing real-time streaming:', error);
    res.status(500).json({
      error: 'Failed to start real-time streaming',
      details: error.message
    });
  }
};

// Get WebSocket status
export const getWebSocketStatus = async (req, res) => {
  try {
    const status = MurfService.getWebSocketStatus();
    res.status(200).json({
      success: true,
      webSocketStatus: status
    });
  } catch (error) {
    console.error('Error getting WebSocket status:', error);
    res.status(500).json({
      error: 'Failed to get WebSocket status',
      details: error.message
    });
  }
}; 