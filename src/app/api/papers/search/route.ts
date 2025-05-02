import { NextRequest, NextResponse } from 'next/server';

// Get the API URL from environment variables or use a default
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function POST(request: NextRequest) {
  try {
    // Get the search request from the client
    const searchData = await request.json();
    
    // Ensure the request has all required fields
    const searchRequest = {
      query: searchData.query,
      tags: searchData.tags,
      authors: searchData.authors,
      year_range: searchData.year_range,
      score_range: searchData.score_range
    };
    
    // Forward the request to the FastAPI backend
    const response = await fetch(`${API_URL}/papers/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(searchRequest),
    });

    // Check if the response was successful
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Search API error:', errorText);
      return NextResponse.json(
        { error: 'Failed to search papers' },
        { status: response.status }
      );
    }

    // Return the search results
    const searchResults = await response.json();
    console.log("searchResults")
    console.log(searchResults)
    return NextResponse.json(searchResults);
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 