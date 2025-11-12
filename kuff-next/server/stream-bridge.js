const WebSocket = require('ws');
const { spawn } = require('child_process');
const http = require('http');

const RTMP_URL = process.env.OWNCAST_RTMP_URL || 'rtmp://66.51.126.59:1935/live';
const STREAM_KEY = process.env.OWNCAST_STREAM_KEY || 'QS76Y2rDmfxm*upmFVO@vp099KyOyJ';
const PORT = process.env.STREAM_BRIDGE_PORT || 3002;

// Create HTTP server
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Stream Bridge Server Running\n');
});

// Create WebSocket server
const wss = new WebSocket.Server({ server });

let ffmpegProcess = null;
let activeStreams = 0;

wss.on('connection', (ws) => {
  console.log('Client connected to stream bridge');
  activeStreams++;

  // Start FFmpeg process
  if (!ffmpegProcess) {
    console.log('Starting FFmpeg process...');
    const rtmpTarget = `${RTMP_URL}/${STREAM_KEY}`;

    ffmpegProcess = spawn('ffmpeg', [
      '-i', 'pipe:0', // Input from stdin
      '-c:v', 'libx264', // Video codec
      '-preset', 'veryfast', // Encoding speed
      '-tune', 'zerolatency', // Low latency
      '-b:v', '2500k', // Video bitrate
      '-maxrate', '2500k',
      '-bufsize', '5000k',
      '-pix_fmt', 'yuv420p',
      '-g', '60', // GOP size
      '-c:a', 'aac', // Audio codec
      '-b:a', '128k', // Audio bitrate
      '-ar', '44100', // Audio sample rate
      '-f', 'flv', // Output format
      rtmpTarget
    ]);

    ffmpegProcess.stdout.on('data', (data) => {
      console.log(`FFmpeg stdout: ${data}`);
    });

    ffmpegProcess.stderr.on('data', (data) => {
      console.log(`FFmpeg: ${data}`);
    });

    ffmpegProcess.on('close', (code) => {
      console.log(`FFmpeg process exited with code ${code}`);
      ffmpegProcess = null;
    });

    ffmpegProcess.on('error', (error) => {
      console.error('FFmpeg error:', error);
      ffmpegProcess = null;
    });
  }

  // Handle incoming stream data
  ws.on('message', (data) => {
    if (ffmpegProcess && ffmpegProcess.stdin.writable) {
      try {
        ffmpegProcess.stdin.write(data);
      } catch (error) {
        console.error('Error writing to FFmpeg:', error);
      }
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected from stream bridge');
    activeStreams--;

    // Stop FFmpeg if no active streams
    if (activeStreams === 0 && ffmpegProcess) {
      console.log('No active streams, stopping FFmpeg...');
      ffmpegProcess.stdin.end();
      ffmpegProcess.kill('SIGTERM');
      ffmpegProcess = null;
    }
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

server.listen(PORT, () => {
  console.log(`Stream Bridge Server running on port ${PORT}`);
  console.log(`RTMP Target: ${RTMP_URL}/${STREAM_KEY}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('Shutting down Stream Bridge Server...');
  if (ffmpegProcess) {
    ffmpegProcess.kill('SIGTERM');
  }
  server.close(() => {
    process.exit(0);
  });
});
