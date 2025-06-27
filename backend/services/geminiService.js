import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export class GeminiService {
  static async getHealthResponse(patientResponse, patientContext, language = 'en') {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const prompt = `
        You are a compassionate healthcare AI assistant. The patient has responded: "${patientResponse}"
        
        Patient Context: ${JSON.stringify(patientContext)}
        
        Please provide a natural, conversational response in ${language} that:
        1. Acknowledges their health update
        2. Shows empathy and understanding
        3. Provides appropriate health guidance
        4. Encourages medication compliance
        5. Asks if they need any immediate help
        
        Keep the response conversational and under 100 words. Respond in ${language} only.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error getting Gemini health response:', error);
      throw error;
    }
  }

  static async getFollowUpQuestion(previousResponse, patientContext, language = 'en') {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      const prompt = `
        Based on the patient's previous response: "${previousResponse}"
        
        Patient Context: ${JSON.stringify(patientContext)}
        
        Generate one natural follow-up question in ${language} to better understand their health status.
        The question should be caring and conversational, like a family member would ask.
        Keep it under 50 words and respond in ${language} only.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error getting Gemini follow-up question:', error);
      throw error;
    }
  }
} 