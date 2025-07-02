import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export class GeminiService {
  static async getHealthResponse(
    patientResponse,
    patientContext,
    language = "en"
  ) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const prompt = `
        Role: You are a friendly medication reminder assistant named EchoCare. Your tone should be warm, professional, and caring.
        
        Current Conversation Context:
        - Patient Name: ${patientContext.name}
        - Medication: ${patientContext.medicationName}
        - Dosage: ${patientContext.dosage || "Not specified"}
        - Instructions: ${patientContext.instructions || "None provided"}
        - Previous conversation: ${JSON.stringify(
          patientContext.conversationHistory.slice(-2)
        )}
        
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
        - "I'm glad to hear you're feeling well! Have you taken your ${
          patientContext.medicationName
        } yet?"
        - "I'm sorry to hear about the headache. Make sure to drink water and rest. If it continues, please check with your doctor."
        - "Thank you for the update. Remember to take your ${
          patientContext.dosage
        } of ${
        patientContext.medicationName
      }. Is there anything else I can help with?"
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Error getting Gemini health response:", error);
      throw error;
    }
  }

  static async getFollowUpQuestion(
    previousResponse,
    patientContext,
    language = "en"
  ) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const prompt = `
        Role: You are concluding a medication reminder call for ${
          patientContext.name
        }.
        
        Context:
        - Medication: ${patientContext.medicationName}
        - Last patient response: "${previousResponse}"
        - Conversation history: ${JSON.stringify(
          patientContext.conversationHistory.slice(-3)
        )}
        
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
      console.error("Error getting Gemini follow-up question:", error);
      throw error;
    }
  }

  static async generateConversationSummary(
    callSession
  ) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const prompt = `
        Role: You are a medical conversation analyst creating a concise summary for healthcare records.
        
        Patient Information:
        - Name: ${callSession.patientName}
        - Medication: ${callSession.medicationName}
        - Dosage: ${callSession.dosage || "Not specified"}
        - Instructions: ${callSession.instructions || "Not specified"}

        Conversation History:
        ${callSession.conversationHistory
          .map(
            (entry, index) =>
              `${index + 1}. ${
                entry.speaker === "ai" ? "EchoCare" : "Patient"
              }: ${entry.message}`
          )
          .join("\n")}
        
        Create a professional medical summary that includes:
        
        **MEDICATION ADHERENCE:**
        - Did patient confirm taking medication? (Yes/No/Unclear)
        - Any reported issues with medication timing or dosage?
        
        **HEALTH STATUS:**
        - Patient's reported symptoms or concerns
        - Overall health status mentioned (Good/Fair/Poor/Not discussed)
        - Any side effects reported
        
        **KEY CONCERNS:**
        - Any medical issues that need follow-up
        - Patient's mood or attitude
        - Communication clarity (Clear/Somewhat clear/Unclear)
        
        **RECOMMENDATIONS:**
        - Any actions suggested to patient
        - Follow-up needed? (Yes/No - specify reason)
        - Doctor consultation recommended? (Yes/No - specify reason)
        
        **CALL OUTCOME:**
        - Successfully completed/Partially completed/Incomplete
        - Patient cooperation level (Excellent/Good/Fair/Poor)
        - Technical issues if any
        
        Format: Use clear headings and bullet points. Keep it professional and factual. Total length should be 150-200 words.
        
        Important: Only include information that was actually discussed. Do not infer or assume information not present in the conversation.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return {
        summary: response.text(),
        generatedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Error generating conversation summary:", error);
      throw error;
    }
  }

  static async analyzeHealthConcerns(conversationHistory, patientContext) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const prompt = `
        Role: You are a healthcare AI analyzing a medication reminder call for potential health concerns.
        
        Patient: ${patientContext.name}
        Medication: ${patientContext.medicationName}
        Known Conditions: ${
          patientContext.medicalConditions || "None specified"
        }
        Known Allergies: ${patientContext.allergies || "None specified"}
        
        Conversation:
        ${conversationHistory
          .map(
            (entry, index) =>
              `${entry.speaker === "ai" ? "EchoCare" : "Patient"}: ${
                entry.message
              }`
          )
          .join("\n")}
        
        Analyze this conversation and provide:
        
        1. **RISK LEVEL**: (LOW/MEDIUM/HIGH/CRITICAL)
        
        2. **HEALTH CONCERNS IDENTIFIED**:
        - List any symptoms mentioned
        - Note medication adherence issues
        - Identify potential side effects
        
        3. **URGENCY ASSESSMENT**:
        - Immediate attention needed? (Yes/No)
        - Can wait for regular appointment? (Yes/No)
        - Emergency signs present? (Yes/No)
        
        4. **RECOMMENDATIONS**:
        - Contact doctor within: (Hours/Days/Weeks/Not needed)
        - Monitor specific symptoms: (List if any)
        - Medication adjustments needed: (Yes/No/Unknown)
        
        5. **FOLLOW-UP ACTIONS**:
        - Schedule earlier medication reminders? (Yes/No)
        - Increase call frequency? (Yes/No)
        - Alert emergency contact? (Yes/No)
        
        Be conservative in your assessment. When in doubt, recommend medical consultation.
        Format as structured JSON for easy parsing.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;

      // Try to parse as JSON, fallback to text if parsing fails
      let analysis;
      try {
        analysis = JSON.parse(response.text());
      } catch (parseError) {
        analysis = {
          raw_analysis: response.text(),
          parsing_error: true,
          generated_at: new Date().toISOString(),
        };
      }

      return analysis;
    } catch (error) {
      console.error("Error analyzing health concerns:", error);
      throw error;
    }
  }
}
