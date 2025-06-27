import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

class OpenAIService {
  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async generateResponse(prompt, context = {}) {
    try {
      const completion = await this.client.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful healthcare assistant helping patients with medication reminders and health check-ins."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.7,
      });

      return completion.choices[0].message.content.trim();
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw error;
    }
  }

  async generateHealthQuestions(patientData) {
    const prompt = `Generate 3-5 relevant health check questions for a patient named ${patientData.name} who is taking ${patientData.medicationName}. Focus on medication adherence and potential side effects.`;
    
    try {
      const response = await this.generateResponse(prompt);
      return response.split('\n').filter(q => q.trim().length > 0);
    } catch (error) {
      console.error('Error generating health questions:', error);
      return [
        "How are you feeling today?",
        "Have you taken your medication as prescribed?",
        "Are you experiencing any side effects?",
        "Do you have any concerns about your treatment?"
      ];
    }
  }
}

export { OpenAIService };
