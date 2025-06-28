import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000';

export async function GET(request: NextRequest) {
  try {
    console.log('👥 Frontend: Fetching patients from backend');
    
    const response = await fetch(`${BACKEND_URL}/api/patients`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();
    
    console.log('👥 Backend response:', result);
    
    if (response.ok) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to fetch patients' },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error('👥 Error fetching patients:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to connect to backend server' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('👥 Frontend: Creating patient with data:', body);
    
    const response = await fetch(`${BACKEND_URL}/api/patients`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const result = await response.json();
    
    console.log('👥 Backend response:', result);
    
    if (response.ok) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to create patient' },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error('👥 Error creating patient:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to connect to backend server' },
      { status: 500 }
    );
  }
} 