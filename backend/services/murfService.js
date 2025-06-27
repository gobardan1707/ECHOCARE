import axios from 'axios';
import dotenv from 'dotenv';
import WebSocket from 'ws';
import { EventEmitter } from 'events';

dotenv.config();

// WebSocket-based real-time TTS service using official Murf AI API
class MurfWebSocket extends EventEmitter {
  constructor() {
    super();
    this.ws = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
    this.audioChunks = new Map();
    this.streamingSessions = new Map();
    this.contextId = null;
  }

  // Initialize WebSocket connection to Murf AI using official API
  async connect(contextId = null) {
    try {
      console.log('Connecting to Murf AI WebSocket for real-time TTS...');
      
      // Use the official WebSocket URL from documentation
      const wsUrl = `wss://api.murf.ai/v1/speech/stream-input?api-key=${process.env.MURF_API_KEY}&sample_rate=44100&channel_type=MONO&format=WAV`;
      
      this.ws = new WebSocket(wsUrl);
      this.contextId = contextId;

      this.ws.on('open', () => {
        console.log('✅ Connected to Murf AI WebSocket for real-time TTS');
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.emit('connected');
      });

      this.ws.on('message', (data) => {
        this.handleMessage(JSON.parse(data));
      });

      this.ws.on('close', () => {
        console.log('❌ Murf AI WebSocket connection closed');
        this.isConnected = false;
        this.emit('disconnected');
        this.reconnect();
      });

      this.ws.on('error', (error) => {
        console.error('❌ Murf AI WebSocket error:', error);
        this.emit('error', error);
      });

    } catch (error) {
      console.error('❌ Failed to connect to Murf AI WebSocket:', error);
      throw error;
    }
  }

  // Handle incoming WebSocket messages based on official API
  handleMessage(data) {
    console.log('Received WebSocket data:', data);
    
    if (data.audio) {
      this.handleAudioChunk(data);
    }
    
    if (data.isFinalAudio) {
      this.handleStreamingComplete();
    }
    
    if (data.error) {
      this.handleError(data.error);
    }
  }

  // Handle real-time audio chunks
  handleAudioChunk(data) {
    const audioBytes = Buffer.from(data.audio, 'base64');
    
    // Emit audio chunk for real-time playback
    this.emit('audioChunk', {
      audioChunk: audioBytes,
      isFinal: false,
      timestamp: Date.now()
    });
  }

  // Handle streaming completion
  handleStreamingComplete() {
    this.emit('streamingComplete', {
      isFinal: true,
      timestamp: Date.now()
    });
    
    // Clean up
    this.audioChunks.clear();
    this.streamingSessions.clear();
  }

  // Handle errors
  handleError(error) {
    console.error('❌ Murf AI WebSocket error:', error);
    this.emit('error', error);
  }

  // Send voice configuration
  async sendVoiceConfig(voiceId, style = 'Conversational', rate = 0, pitch = 0, variation = 1) {
    if (!this.isConnected) {
      await this.connect();
    }

    const voiceConfigMsg = {
      voice_config: {
        voiceId: voiceId,
        style: style,
        rate: rate,
        pitch: pitch,
        variation: variation
      }
    };

    console.log('🎤 Sending voice config:', voiceConfigMsg);
    this.ws.send(JSON.stringify(voiceConfigMsg));
  }

  // Stream text using official API format
  async streamText(text, voiceId, end = true) {
    if (!this.isConnected) {
      await this.connect();
    }

    const textMsg = {
      text: text,
      end: end
    };

    console.log('📝 Streaming text:', textMsg);
    this.ws.send(JSON.stringify(textMsg));
  }

  // Start real-time TTS streaming with voice config
  async startRealTimeTTS(text, language = 'en', voiceProfile = null, sessionId = null) {
    if (!this.isConnected) {
      await this.connect(sessionId);
    }

    const voiceId = voiceProfile || MurfService.getVoiceForLanguage(language);
    const session = sessionId || this.generateSessionId();

    // Store streaming session
    this.streamingSessions.set(session, {
      text,
      language,
      voiceId,
      startTime: Date.now(),
      status: 'streaming'
    });

    // Send voice configuration first
    await this.sendVoiceConfig(voiceId);
    
    // Stream the text
    await this.streamText(text, voiceId, true);
    
    console.log(`🎤 Started real-time TTS streaming for session: ${session}`);
    return session;
  }

  // Stream text in chunks for live conversations
  async streamTextChunks(textChunks, voiceId, sessionId = null) {
    if (!this.isConnected) {
      await this.connect(sessionId);
    }

    const session = sessionId || this.generateSessionId();

    // Send voice configuration first
    await this.sendVoiceConfig(voiceId);

    // Stream each chunk
    for (let i = 0; i < textChunks.length; i++) {
      const isLastChunk = i === textChunks.length - 1;
      await this.streamText(textChunks[i], voiceId, isLastChunk);
      
      // Small delay between chunks for natural flow
      if (!isLastChunk) {
        await this.delay(100);
      }
    }

    return session;
  }

  // Stop streaming session
  stopStreaming(sessionId) {
    if (this.isConnected && this.streamingSessions.has(sessionId)) {
      // Send end signal
      this.streamText('', null, true);
      this.streamingSessions.delete(sessionId);
      console.log(`⏹️ Stopped streaming for session: ${sessionId}`);
    }
  }

  // Generate unique session ID
  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Reconnect logic
  async reconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`🔄 Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
      
      setTimeout(async () => {
        try {
          await this.connect(this.contextId);
        } catch (error) {
          console.error('❌ Reconnection failed:', error);
        }
      }, this.reconnectDelay * this.reconnectAttempts);
    } else {
      console.error('❌ Max reconnection attempts reached');
      this.emit('maxReconnectAttemptsReached');
    }
  }

  // Utility function for delays
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Close WebSocket connection
  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.isConnected = false;
      console.log('🔌 Disconnected from Murf AI WebSocket');
    }
  }

  // Get connection status
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      reconnectAttempts: this.reconnectAttempts,
      activeSessions: this.streamingSessions.size,
      audioChunks: this.audioChunks.size,
      contextId: this.contextId
    };
  }
}

// Create singleton WebSocket instance
const murfWebSocket = new MurfWebSocket();

export class MurfService {
  // Language to voice mapping for different languages
  static getVoiceForLanguage(language) {
    const voiceMap = {
      'en': 'en-US-amara', // English - using official voice ID
      'hi': 'hi-IN-neha', // Hindi
      'es': 'es-ES-maria', // Spanish
      'fr': 'fr-FR-sophie', // French
      'de': 'de-DE-anna', // German
      'it': 'it-IT-giulia', // Italian
      'pt': 'pt-BR-ana', // Portuguese
      'ja': 'ja-JP-yuki', // Japanese
      'ko': 'ko-KR-mina', // Korean
      'zh': 'zh-CN-xiaomei', // Chinese
      'ar': 'ar-SA-fatima', // Arabic
      'ru': 'ru-RU-natalia', // Russian
      'bn': 'bn-IN-priya', // Bengali
      'te': 'te-IN-lakshmi', // Telugu
      'ta': 'ta-IN-kavya', // Tamil
      'mr': 'mr-IN-anjali', // Marathi
      'gu': 'gu-IN-diya', // Gujarati
      'kn': 'kn-IN-shruti', // Kannada
      'ml': 'ml-IN-meera', // Malayalam
      'pa': 'pa-IN-simran'  // Punjabi
    };
    
    return voiceMap[language] || voiceMap['en'];
  }

  // Traditional REST API methods (fallback)
  static async generateAudio(text, language = 'en', voiceProfile = null) {
    try {
      const voiceId = voiceProfile || this.getVoiceForLanguage(language);
      
      const response = await axios.post(
        `${process.env.MURF_BASE_URL}/studio/generate-audio`,
        {
          text: text,
          voiceId: voiceId,
          language: language,
          quality: 'high',
          format: 'mp3',
          speed: 1.0,
          pitch: 0,
          emphasis: 'normal'
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.MURF_API_KEY}`,
            'Content-Type': 'application/json'
          },
          timeout: 30000
        }
      );

      if (response.data && response.data.audioUrl) {
        return response.data.audioUrl;
      } else {
        throw new Error('No audio URL received from Murf API');
      }
    } catch (error) {
      console.error('Error generating Murf audio:', error);
      throw error;
    }
  }

  static async generateRealTimeAudio(text, language = 'en', voiceProfile = null) {
    try {
      const voiceId = voiceProfile || this.getVoiceForLanguage(language);
      
      const response = await axios.post(
        `${process.env.MURF_BASE_URL}/studio/generate-audio`,
        {
          text: text,
          voiceId: voiceId,
          language: language,
          quality: 'medium', // Faster generation
          format: 'mp3',
          speed: 1.0,
          pitch: 0,
          emphasis: 'normal'
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.MURF_API_KEY}`,
            'Content-Type': 'application/json'
          },
          timeout: 15000
        }
      );

      return response.data.audioUrl;
    } catch (error) {
      console.error('Error generating real-time Murf audio:', error);
      throw error;
    }
  }

  // WebSocket-based real-time TTS methods using official API
  static async startWebSocketTTS(text, language = 'en', voiceProfile = null) {
    return await murfWebSocket.startRealTimeTTS(text, language, voiceProfile);
  }

  static async streamWebSocketText(text, language = 'en', voiceProfile = null) {
    const voiceId = voiceProfile || this.getVoiceForLanguage(language);
    
    // Break text into chunks for streaming
    const words = text.split(' ');
    const chunkSize = 5; // Process 5 words at a time
    const textChunks = [];
    
    for (let i = 0; i < words.length; i += chunkSize) {
      const chunk = words.slice(i, i + chunkSize).join(' ');
      textChunks.push(chunk);
    }
    
    return await murfWebSocket.streamTextChunks(textChunks, voiceId);
  }

  static stopWebSocketStreaming(sessionId) {
    murfWebSocket.stopStreaming(sessionId);
  }

  static getWebSocketStatus() {
    return murfWebSocket.getConnectionStatus();
  }

  static async connectWebSocket() {
    return await murfWebSocket.connect();
  }

  static disconnectWebSocket() {
    murfWebSocket.disconnect();
  }

  // Event listeners for WebSocket
  static onAudioChunk(callback) {
    murfWebSocket.on('audioChunk', callback);
  }

  static onStreamingComplete(callback) {
    murfWebSocket.on('streamingComplete', callback);
  }

  static onVoiceReady(callback) {
    murfWebSocket.on('voiceReady', callback);
  }

  static onConnected(callback) {
    murfWebSocket.on('connected', callback);
  }

  static onDisconnected(callback) {
    murfWebSocket.on('disconnected', callback);
  }

  static onError(callback) {
    murfWebSocket.on('error', callback);
  }

  // Traditional methods
  static async createVoiceClone(audioFile, voiceName) {
    try {
      const formData = new FormData();
      formData.append('audio', audioFile);
      formData.append('name', voiceName);

      const response = await axios.post(
        `${process.env.MURF_BASE_URL}/studio/voice-clone`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${process.env.MURF_API_KEY}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      return response.data.voiceId;
    } catch (error) {
      console.error('Error creating voice clone:', error);
      throw error;
    }
  }

  static async getAvailableVoices(language = 'en') {
    try {
      const response = await axios.get(
        `${process.env.MURF_BASE_URL}/studio/voices?language=${language}`,
        {
          headers: {
            'Authorization': `Bearer ${process.env.MURF_API_KEY}`
          }
        }
      );

      return response.data.voices;
    } catch (error) {
      console.error('Error fetching available voices:', error);
      throw error;
    }
  }
}

// Export the WebSocket instance for direct access
export { murfWebSocket };