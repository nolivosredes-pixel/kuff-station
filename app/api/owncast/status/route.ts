import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Get Owncast server URL from environment variable
    const owncastUrl = process.env.OWNCAST_SERVER_URL;

    if (!owncastUrl) {
      return NextResponse.json(
        {
          online: false,
          error: 'Owncast server not configured',
          message: 'OWNCAST_SERVER_URL environment variable not set'
        },
        { status: 200 }
      );
    }

    // Fetch status from Owncast API
    const statusUrl = `${owncastUrl}/api/status`;
    const response = await fetch(statusUrl, {
      headers: {
        'Accept': 'application/json',
      },
      // Add timeout
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      throw new Error(`Owncast API returned ${response.status}`);
    }

    const data = await response.json();

    // Owncast /api/status returns:
    // {
    //   "online": true/false,
    //   "viewerCount": number,
    //   "streamTitle": "string",
    //   ...
    // }

    return NextResponse.json({
      online: data.online || false,
      viewerCount: data.viewerCount || 0,
      streamTitle: data.streamTitle || 'KUFF Live Stream',
      serverUrl: owncastUrl,
      hlsUrl: `${owncastUrl}/hls/stream.m3u8`,
    });

  } catch (error) {
    console.error('Error fetching Owncast status:', error);

    return NextResponse.json(
      {
        online: false,
        error: 'Failed to fetch stream status',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 200 } // Return 200 even on error so client can handle gracefully
    );
  }
}
