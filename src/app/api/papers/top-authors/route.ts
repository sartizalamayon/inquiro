import { NextRequest, NextResponse } from 'next/server';

// Get the API URL from environment variables or use a default
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function GET(request: NextRequest) {
  try {
    // Get the limit parameter from the request
    const searchParams = request.nextUrl.searchParams;
    const limit = searchParams.get('limit') || '15';
    
    // Forward the request to the FastAPI backend
    const response = await fetch(`${API_URL}/papers/top-authors?limit=${limit}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Check if the response was successful
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Top authors API error:', errorText);
      return NextResponse.json(
        { error: 'Failed to fetch top authors' },
        { status: response.status }
      );
    }

    // Return the top authors
    const authorsData = await response.json();
    return NextResponse.json(authorsData);
  } catch (error) {
    console.error('Top authors API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 