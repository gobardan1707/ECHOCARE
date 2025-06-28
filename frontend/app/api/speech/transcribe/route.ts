import { type NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000'

// Mock Speech-to-Text integration
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const audioFile = formData.get("audio") as File
    const language = (formData.get("language") as string) || "en-US"

    if (!audioFile) {
      return NextResponse.json({ error: "Audio file required" }, { status: 400 })
    }

    console.log('🎤 Frontend: Transcribing audio with language:', language)
    
    // Create a new FormData for the backend request
    const backendFormData = new FormData()
    backendFormData.append("audio", audioFile)
    backendFormData.append("language", language)

    const response = await fetch(`${BACKEND_URL}/api/speech/transcribe`, {
      method: 'POST',
      body: backendFormData,
    })

    const result = await response.json()
    
    console.log('🎤 Backend response:', result)
    
    if (response.ok) {
      return NextResponse.json(result)
    } else {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to transcribe audio' },
        { status: response.status }
      )
    }
  } catch (error) {
    console.error('🎤 Error transcribing audio:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to connect to backend server' },
      { status: 500 }
    )
  }
}
