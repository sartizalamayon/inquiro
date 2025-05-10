import { NextRequest, NextResponse } from 'next/server';

// Get the API URL from environment variables or use a default
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function GET(request: NextRequest) {
  try {
    // Get user email from session or query parameter
    const user_email = request.nextUrl.searchParams.get('user_email');
    if (!user_email) {
      return NextResponse.json(
        { error: 'User email is required' },
        { status: 400 }
      );
    }

    // Get collection ID from URL if present
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const collectionId = pathParts[pathParts.length - 1] !== 'collections' ? pathParts[pathParts.length - 1] : null;

    let endpoint = `${API_URL}/collections`;
    if (collectionId && collectionId !== 'route') {
      endpoint += `/${collectionId}?user_email=${user_email}`;
    } else {
      endpoint += `?user_email=${user_email}`;
    }

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Collection API error:', errorText);
      return NextResponse.json(
        { error: collectionId ? 'Failed to get collection' : 'Failed to get collections' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Collection API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, tags, user_email } = await request.json();

    if (!user_email) {
      return NextResponse.json(
        { error: 'User email is required' },
        { status: 400 }
      );
    }

    const response = await fetch(`${API_URL}/collections?user_email=${user_email}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, tags }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Collection API error:', errorText);
      return NextResponse.json(
        { error: 'Failed to create collection' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Collection API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 