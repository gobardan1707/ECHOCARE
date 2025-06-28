import { type NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000'

// Mock Twilio integration for demo purposes
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    console.log('📞 Frontend: Initiating call with data:', body)
    
    const response = await fetch(`${BACKEND_URL}/api/calls/initiate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    const result = await response.json()
    
    console.log('📞 Backend response:', result)
    
    if (response.ok) {
      return NextResponse.json(result)
    } else {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to initiate call' },
        { status: response.status }
      )
    }
  } catch (error) {
    console.error('📞 Error initiating call:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to connect to backend server' },
      { status: 500 }
    )
  }
}

// Handle Twilio webhooks
export async function GET(request: NextRequest) {
  try {
    console.log('📞 Frontend: Fetching active calls from backend')
    
    const response = await fetch(`${BACKEND_URL}/api/calls/active`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const result = await response.json()
    
    console.log('📞 Backend response:', result)
    
    if (response.ok) {
      return NextResponse.json(result)
    } else {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to fetch active calls' },
        { status: response.status }
      )
    }
  } catch (error) {
    console.error('📞 Error fetching active calls:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to connect to backend server' },
      { status: 500 }
    )
  }
}
