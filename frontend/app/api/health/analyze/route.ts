import { type NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { patientResponse, patientId, medicationName } = body

    if (!patientResponse) {
      return NextResponse.json({ error: "Patient response required" }, { status: 400 })
    }

    console.log('🏥 Frontend: Analyzing health response for patient:', patientId);
    
    const response = await fetch(`${BACKEND_URL}/api/health/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        patientResponse,
        patientId,
        medicationName
      }),
    });

    const result = await response.json();
    
    console.log('🏥 Backend response:', result);
    
    if (response.ok) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to analyze health response' },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error('🏥 Error analyzing health response:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to connect to backend server' },
      { status: 500 }
    );
  }
}
