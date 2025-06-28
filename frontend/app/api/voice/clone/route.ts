import { type NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000'

// Mock Murf AI integration for voice cloning
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const audioFile = formData.get("audio") as File
    const patientId = formData.get("patientId") as string
    const relationship = formData.get("relationship") as string
    const sampleText = formData.get("sampleText") as string

    if (!audioFile || !patientId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    console.log('🎙️ Frontend: Processing voice clone for patient:', patientId)
    
    // Create a new FormData for the backend request
    const backendFormData = new FormData()
    backendFormData.append("audio", audioFile)
    backendFormData.append("patientId", patientId)
    if (relationship) backendFormData.append("relationship", relationship)
    if (sampleText) backendFormData.append("sampleText", sampleText)

    const response = await fetch(`${BACKEND_URL}/api/voice/clone`, {
      method: 'POST',
      body: backendFormData,
    })

    const result = await response.json()
    
    console.log('🎙️ Backend response:', result)
    
    if (response.ok) {
      return NextResponse.json(result)
    } else {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to process voice clone' },
        { status: response.status }
      )
    }
  } catch (error) {
    console.error('🎙️ Error processing voice clone:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to connect to backend server' },
      { status: 500 }
    )
  }
}

// Get voice clone status
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const voiceCloneId = searchParams.get("id")

    if (!voiceCloneId) {
      return NextResponse.json({ error: "Voice clone ID required" }, { status: 400 })
    }

    console.log('🎙️ Frontend: Checking voice clone status for:', voiceCloneId)
    
    const response = await fetch(`${BACKEND_URL}/api/voice/clone?id=${voiceCloneId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const result = await response.json()
    
    console.log('🎙️ Backend response:', result)
    
    if (response.ok) {
      return NextResponse.json(result)
    } else {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to get voice clone status' },
        { status: response.status }
      )
    }
  } catch (error) {
    console.error('🎙️ Error getting voice clone status:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to connect to backend server' },
      { status: 500 }
    )
  }
}
