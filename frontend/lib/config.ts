// Frontend configuration for backend connection
export const config = {
  // Backend server URL - can be overridden by environment variable
  backendUrl: process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000',
  
  // API endpoints
  api: {
    patients: '/api/patients',
    calls: '/api/calls',
    voice: {
      clone: '/api/voice/clone',
      test: '/api/test/murf-voice'
    },
    health: {
      analyze: '/api/health/analyze'
    },
    speech: {
      transcribe: '/api/speech/transcribe'
    }
  },
  
  // Default settings
  defaults: {
    language: 'en',
    voiceProfile: 'en-US-amara',
    callTimeout: 30000,
    maxRetries: 3
  }
};

// Helper function to get full backend URL
export const getBackendUrl = (endpoint: string): string => {
  return `${config.backendUrl}${endpoint}`;
};

// Helper function to check if backend is available
export const checkBackendHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${config.backendUrl}/health`);
    return response.ok;
  } catch (error) {
    console.error('Backend health check failed:', error);
    return false;
  }
}; 