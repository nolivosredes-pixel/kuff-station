import { NextResponse } from 'next/server';

// SRS/Owncast status API endpoint - supports both SRS and Owncast servers
export async function GET() {
  try {
    // Get server configuration from environment variables
    const serverUrl = process.env.OWNCAST_SERVER_URL;
    const rtmpUrl = process.env.OWNCAST_RTMP_URL;
    const streamKey = process.env.OWNCAST_STREAM_KEY;
    const hlsUrl = process.env.SRS_HLS_URL;

    if (!serverUrl) {
      return NextResponse.json(
        {
          online: false,
          error: 'Streaming server not configured',
          message: 'OWNCAST_SERVER_URL environment variable not set'
        },
        { status: 200 }
      );
    }

    // Try SRS API first (port 1985)
    try {
      // SRS API endpoint to check streams
      // Use direct IP for SRS API since port 1985 only supports HTTP
      const srsApiUrl = 'http://66.51.126.59:1985/api/v1/streams/';
      const srsResponse = await fetch(srsApiUrl, {
        headers: {
          'Accept': 'application/json',
        },
        signal: AbortSignal.timeout(3000),
      });

      if (srsResponse.ok) {
        const srsData = await srsResponse.json();

        // SRS returns { code: 0, streams: [...] }
        // If streams array has items, server is online with active streams
        const isOnline = srsData.code === 0 && srsData.streams && srsData.streams.length > 0;
        const viewerCount = isOnline ? (srsData.streams[0]?.clients || 0) : 0;

        return NextResponse.json({
          online: isOnline,
          viewerCount: viewerCount,
          streamTitle: isOnline ? 'KUFF Live Stream' : 'KUFF 24/7',
          serverUrl: serverUrl,
          hlsUrl: (hlsUrl || `${serverUrl}/live/stream.m3u8`).trim(),
          rtmpUrl: rtmpUrl,
          streamKey: streamKey,
          serverType: 'SRS',
        });
      }
    } catch (srsError) {
      console.log('SRS API not available, trying Owncast...');
    }

    // Fallback to Owncast API
    const owncastUrl = `${serverUrl}/api/status`;
    const response = await fetch(owncastUrl, {
      headers: {
        'Accept': 'application/json',
      },
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      throw new Error(`Streaming API returned ${response.status}`);
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
      serverUrl: serverUrl,
      hlsUrl: (hlsUrl || `${serverUrl}/hls/stream.m3u8`).trim(),
      rtmpUrl: rtmpUrl,
      streamKey: streamKey,
      serverType: 'Owncast',
    });

  } catch (error) {
    console.error('Error fetching streaming status:', error);

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
