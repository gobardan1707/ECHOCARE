import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { patientResponse, patientId, medicationName } = body

    if (!patientResponse) {
      return NextResponse.json({ error: "Patient response required" }, { status: 400 })
    }

    // Use AI SDK to analyze the patient's health response[^1]
    const { text: healthAnalysis } = await generateText({
      model: openai("gpt-4o"),
      system: `You are a healthcare AI assistant analyzing patient responses to medication reminders. 
      Provide empathetic, helpful responses while identifying any potential health concerns.
      Always recommend consulting healthcare providers for serious concerns.
      Keep responses concise and supportive.`,
      prompt: `Patient response about ${medicationName}: "${patientResponse}"
      
      Please analyze this response and provide:
      1. A supportive response to the patient
      2. Sentiment score (-1 to 1)
      3. Any health concerns to flag
      4. Recommendations`,
    })

    // Parse the AI response (in a real implementation, you'd use structured output)
    const sentimentScore = Math.random() * 0.4 + 0.3 // Mock sentiment between 0.3-0.7
    const emotion = sentimentScore > 0.6 ? "positive" : sentimentScore > 0.3 ? "neutral" : "concerned"

    // Generate appropriate AI response
    const { text: aiResponse } = await generateText({
      model: openai("gpt-4o"),
      system: `You are speaking directly to the patient in a caring, supportive voice. 
      Keep responses brief, warm, and encouraging. Address any concerns appropriately.`,
      prompt: `Patient said: "${patientResponse}"
      
      Respond directly to the patient with empathy and support. Keep it under 50 words.`,
    })

    const analysis = {
      healthAnalysis,
      sentimentScore: Math.round(sentimentScore * 100) / 100,
      emotion,
      aiResponse,
      concerns:
        patientResponse.toLowerCase().includes("pain") ||
        patientResponse.toLowerCase().includes("sick") ||
        patientResponse.toLowerCase().includes("dizzy")
          ? ["potential_side_effects"]
          : [],
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json(analysis)
  } catch (error) {
    console.error("Health analysis error:", error)
    return NextResponse.json({ error: "Failed to analyze health response" }, { status: 500 })
  }
}
