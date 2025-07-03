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


 
static async generateConversationSummary(callSession) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      # ROLE
      You are a meticulous medical conversation analyst. Your task is to create a structured JSON summary from a call transcript for inclusion in a patient's electronic health record (EHR).

      # CONTEXT
      - Patient Name: ${callSession.patientName}
      - Medication: ${callSession.medicationName}
      - Dosage: ${callSession.dosage || "Not Specified"}
      - Instructions: ${callSession.instructions || "Not Specified"}
      - Original Conversation Language: ${callSession.language}

      - Conversation Transcript:
      ${callSession.conversationHistory
        .map(
          (entry) =>
            `${entry.speaker === "ai" ? "EchoCare" : "Patient"}: ${entry.text}`
        )
        .join("\n")}

      # TASK
      1. Analyze the conversation, which was conducted in ${callSession.language}.
      2. Extract key information based on the schema below.
      3. **The entire JSON output, including all string values, MUST be in English.**
      4. Be factual. Only include information explicitly mentioned in the transcript. Do not infer or assume details. If a topic was not discussed, use "Not Discussed" or an empty array as appropriate.

      # OUTPUT INSTRUCTIONS
      - You MUST respond with a single, valid JSON object and nothing else.
      - Do NOT include any explanatory text, greetings, or markdown formatting like \`\`\`json.
      - Adhere strictly to the JSON schema below using camelCase for all keys.

      # JSON OUTPUT SCHEMA
      {
        "medicationAdherence": {
          "confirmedTakingMedication": "Yes | No | Unclear",
          "reportedIssues": "A brief string describing any issues with timing or dosage, or 'None' if not mentioned."
        },
        "healthStatus": {
          "reportedSymptoms": ["An array of strings, with each string being a specific symptom or concern mentioned by the patient."],
          "overallHealthMentioned": "Good | Fair | Poor | Not Discussed",
          "reportedSideEffects": ["An array of strings listing any potential side effects reported."]
        },
        "keyConcerns": {
          "needsFollowUp": true | false,
          "followUpReason": "A brief string explaining why a follow-up is needed. Example: 'Patient reported dizziness.'",
          "patientMood": "Positive | Neutral | Anxious | Sad | Irritable | Not Discussed",
          "communicationClarity": "Clear | Somewhat Unclear | Unclear"
        },
        "callOutcome": {
          "status": "Completed | Partially Completed | Incomplete",
          "patientCooperation": "Cooperative | Neutral | Uncooperative",
          "technicalIssues": "A brief string describing any technical issues, or 'None'."
        },
        "narrativeSummary": "A concise, 2-3 sentence professional summary in English of the entire conversation, suitable for a quick review in a medical chart."
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();

    let summaryData;
    try {
      
      summaryData = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Failed to parse JSON summary from AI.", parseError);
      console.error("Raw AI Response Text:", responseText);
      summaryData = {
        parsingError: true,
        rawSummary: responseText,
        errorMessage: parseError.message,
      };
    }

    return {
      summary: summaryData,
      generatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error generating conversation summary:", error);
    throw error;
  }
}
}
