import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export class GeminiService {
  static async getHealthResponse(patientResponse, patientContext, language = 'en') {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const prompt = `
        Role: You are a friendly medication reminder assistant named EchoCare. Your tone should be warm, professional, and caring.
        
        Current Conversation Context:
        - Patient Name: ${patientContext.name}
        - Medication: ${patientContext.medicationName}
        - Dosage: ${patientContext.dosage || 'Not specified'}
        - Instructions: ${patientContext.instructions || 'None provided'}
        - Previous conversation: ${JSON.stringify(patientContext.conversationHistory.slice(-2))}
        
        Patient's latest response: "${patientResponse}"
        
        Your task is to:
        1. Acknowledge their response briefly
        2. If they report any issues or side effects:
           - Show empathy
           - Suggest basic remedies if minor
           - Recommend contacting their doctor if serious
        3. If they say they're fine:
           - Confirm they've taken their medication
           - Offer brief health tips if relevant
        4. Ask if they need any additional help
        
        Rules:
        - Respond in ${language}
        - Keep response under 80 words
        - Use simple, clear language
        - Sound natural in conversation
        - Never diagnose - always defer to doctors
        - Maintain positive tone
        
        Example good responses:
        - "I'm glad to hear you're feeling well! Have you taken your ${patientContext.medicationName} yet?"
        - "I'm sorry to hear about the headache. Make sure to drink water and rest. If it continues, please check with your doctor."
        - "Thank you for the update. Remember to take your ${patientContext.dosage} of ${patientContext.medicationName}. Is there anything else I can help with?"
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
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const prompt = `
        Role: You are concluding a medication reminder call for ${patientContext.name}.
        
        Context:
        - Medication: ${patientContext.medicationName}
        - Last patient response: "${previousResponse}"
        - Conversation history: ${JSON.stringify(patientContext.conversationHistory.slice(-3))}
        
        Your task is to:
        1. If patient reported problems:
           - Express concern
           - Strongly recommend contacting their doctor
           - Wish them well
        2. If patient is fine:
           - Confirm medication was taken
           - Give positive reinforcement
           - Say goodbye warmly
        3. If unclear response:
           - Politely check if they need anything else
           - Then conclude
        
        Rules:
        - This is your FINAL message before ending call
        - Respond in ${language}
        - Keep under 50 words
        - Sound caring but professional
        - Include call to action if needed
        
        Examples:
        - "Since you're feeling unwell, please contact your doctor soon. Take care and get well!"
        - "Great! I'll remind you again at the next dose. Have a wonderful day!"
        - "If you have any concerns later, don't hesitate to call your doctor. Goodbye!"
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