// Voice configuration for ECHOCARE application
// This file contains the comprehensive voice map for all supported languages

export interface VoiceOption {
  value: string;
  label: string;
  language: string;
  languageCode: string;
}

export const voiceOptions: VoiceOption[] = [
  // English
  { value: "en-US-amara", label: "Amara - English (US)", language: "English", languageCode: "en" },
  // Hindi
  { value: "hi-IN-ayushi", label: "Ayushi - Hindi", language: "Hindi", languageCode: "hi" },
  // Spanish
  { value: "es-ES-maria", label: "Maria - Spanish", language: "Spanish", languageCode: "es" },
  // French
  { value: "fr-FR-sophie", label: "Sophie - French", language: "French", languageCode: "fr" },
  // German
  { value: "de-DE-anna", label: "Anna - German", language: "German", languageCode: "de" },
  // Italian
  { value: "it-IT-giulia", label: "Giulia - Italian", language: "Italian", languageCode: "it" },
  // Portuguese
  { value: "pt-BR-ana", label: "Ana - Portuguese (Brazil)", language: "Portuguese", languageCode: "pt" },
  // Japanese
  { value: "ja-JP-yuki", label: "Yuki - Japanese", language: "Japanese", languageCode: "ja" },
  // Korean
  { value: "ko-KR-mina", label: "Mina - Korean", language: "Korean", languageCode: "ko" },
  // Chinese
  { value: "zh-CN-xiaomei", label: "Xiaomei - Chinese", language: "Chinese", languageCode: "zh" },
  // Arabic
  { value: "ar-SA-fatima", label: "Fatima - Arabic", language: "Arabic", languageCode: "ar" },
  // Russian
  { value: "ru-RU-natalia", label: "Natalia - Russian", language: "Russian", languageCode: "ru" },
  // Bengali
  { value: "bn-IN-priya", label: "Priya - Bengali", language: "Bengali", languageCode: "bn" },
  // Telugu
  { value: "te-IN-lakshmi", label: "Lakshmi - Telugu", language: "Telugu", languageCode: "te" },
  // Tamil
  { value: "ta-IN-kavya", label: "Kavya - Tamil", language: "Tamil", languageCode: "ta" },
  // Marathi
  { value: "mr-IN-anjali", label: "Anjali - Marathi", language: "Marathi", languageCode: "mr" },
  // Gujarati
  { value: "gu-IN-diya", label: "Diya - Gujarati", language: "Gujarati", languageCode: "gu" },
  // Kannada
  { value: "kn-IN-shruti", label: "Shruti - Kannada", language: "Kannada", languageCode: "kn" },
  // Malayalam
  { value: "ml-IN-meera", label: "Meera - Malayalam", language: "Malayalam", languageCode: "ml" },
  // Punjabi
  { value: "pa-IN-simran", label: "Simran - Punjabi", language: "Punjabi", languageCode: "pa" }
];

// Language options derived from voice options
export const languageOptions = voiceOptions.reduce((acc, voice) => {
  if (!acc.find(lang => lang.value === voice.languageCode)) {
    acc.push({ value: voice.languageCode, label: voice.language });
  }
  return acc;
}, [] as { value: string; label: string }[]);

// Helper function to get voice options for a specific language
export const getVoicesForLanguage = (languageCode: string): VoiceOption[] => {
  return voiceOptions.filter(voice => voice.languageCode === languageCode);
};

// Helper function to get default voice for a language
export const getDefaultVoiceForLanguage = (languageCode: string): string => {
  const voices = getVoicesForLanguage(languageCode);
  return voices.length > 0 ? voices[0].value : "en-US-amara"; // fallback to English
};

// Voice map for backend compatibility
export const voiceMap: Record<string, string> = {
  'en': 'en-US-amara',
  'hi': 'hi-IN-ayushi',
  'es': 'es-ES-maria',
  'fr': 'fr-FR-sophie',
  'de': 'de-DE-anna',
  'it': 'it-IT-giulia',
  'pt': 'pt-BR-ana',
  'ja': 'ja-JP-yuki',
  'ko': 'ko-KR-mina',
  'zh': 'zh-CN-xiaomei',
  'ar': 'ar-SA-fatima',
  'ru': 'ru-RU-natalia',
  'bn': 'bn-IN-priya',
  'te': 'te-IN-lakshmi',
  'ta': 'ta-IN-kavya',
  'mr': 'mr-IN-anjali',
  'gu': 'gu-IN-diya',
  'kn': 'kn-IN-shruti',
  'ml': 'ml-IN-meera',
  'pa': 'pa-IN-simran'
}; 