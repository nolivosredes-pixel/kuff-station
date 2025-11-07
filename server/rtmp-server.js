const NodeMediaServer = require('node-media-server');

const config = {
  rtmp: {
    port: 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 30,
    ping_timeout: 60
  },
  http: {
    port: 8000,
    allow_origin: '*',
    mediaroot: './media'
  },
  trans: {
    ffmpeg: '/usr/bin/ffmpeg',
    tasks: [
      {
        app: 'live',
        hls: true,
        hlsFlags: '[hls_time=2:hls_list_size=3:hls_flags=delete_segments]',
        hlsKeep: true, // keep old segments
        dash: true,
        dashFlags: '[f=dash:window_size=3:extra_window_size=5]'
      }
    ]
  }
};

const nms = new NodeMediaServer(config);

nms.on('prePublish', (id, StreamPath, args) => {
  console.log('[NodeEvent on prePublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);

  // Extract stream key from path
  // StreamPath format: /live/streamkey
  const streamKey = StreamPath.split('/')[2];

  // TODO: Validate stream key against database/localStorage
  // For now, accept all streams
  console.log(`Stream Key: ${streamKey}`);
});

nms.on('postPublish', (id, StreamPath, args) => {
  console.log('[NodeEvent on postPublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
  console.log('✅ Stream is now LIVE!');
});

nms.on('donePublish', (id, StreamPath, args) => {
  console.log('[NodeEvent on donePublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
  console.log('🔴 Stream ended');
});

nms.run();

console.log('🎥 RTMP Server running on port 1935');
console.log('🌐 HTTP Server running on port 8000');
console.log('📡 Stream URL: rtmp://localhost:1935/live/YOUR_STREAM_KEY');
console.log('📺 Playback HLS: http://localhost:8000/live/YOUR_STREAM_KEY/index.m3u8');
