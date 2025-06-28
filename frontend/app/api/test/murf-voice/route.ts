import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('🎤 Frontend: Testing Murf voice with data:', body);
    
    const response = await fetch(`${BACKEND_URL}/api/test/murf-voice`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const result = await response.json();
    
    console.log('🎤 Backend response:', result);
    
    if (response.ok) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(
        { success: false, error: result.error || 'Backend request failed' },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error('🎤 Error testing Murf voice:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to connect to backend server' },
      { status: 500 }
    );
  }
} 