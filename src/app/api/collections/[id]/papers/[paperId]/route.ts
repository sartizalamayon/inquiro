import { NextRequest, NextResponse } from 'next/server';

// Get the API URL from environment variables or use a default
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function DELETE(request: NextRequest, { params }: { params: { id: string, paperId: string } }) {
  try {
    const { id, paperId } = await params;
    const collectionId = id;
    const user_email = request.nextUrl.searchParams.get('user_email');

    if (!user_email) {
      return NextResponse.json(
        { error: 'User email is required' },
        { status: 400 }
      );
    }

    const response = await fetch(`${API_URL}/collections/${collectionId}/papers/${paperId}?user_email=${user_email}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Collection API error:', errorText);
      return NextResponse.json(
        { error: 'Failed to remove paper from collection' },
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