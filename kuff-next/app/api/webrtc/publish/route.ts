import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Forward request to SRS WebRTC API
    const srsHost = process.env.NEXT_PUBLIC_OWNCAST_SERVER_URL?.replace('https://', '').replace('http://', '') || 'kuff-srs.fly.dev';
    const apiUrl = `http://${srsHost}:1985/rtc/v1/publish/`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `SRS API error: ${errorText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('WebRTC proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to connect to streaming server' },
      { status: 500 }
    );
  }
}
