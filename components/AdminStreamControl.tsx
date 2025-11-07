'use client';

import { useEffect, useState, useRef } from 'react';

interface StreamConfig {
  platform: string;
  streamKey: string;
  bitrate: number;
}

interface StreamingStatus {
  isLive: boolean;
  platform: string | null;
  streamUrl: string | null;
  embedUrl: string | null;
  startedAt: string | null;
  title: string;
  description: string;
}

interface Source {
  id: string;
  type: 'camera' | 'screen' | 'text';
  name: string;
  visible: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
  video?: HTMLVideoElement;
  stream?: MediaStream;
  text?: string;
  color?: string;
  fontSize?: number;
}

const PLATFORM_CONFIG: Record<string, { rtmpUrl: string; embedBaseUrl: string; streamBaseUrl: string }> = {
  youtube: {
    rtmpUrl: 'rtmp://a.rtmp.youtube.com/live2',
    embedBaseUrl: 'https://www.youtube.com/embed/',
    streamBaseUrl: 'https://www.youtube.com/watch?v=',
  },
  twitch: {
    rtmpUrl: 'rtmp://live.twitch.tv/app',
    embedBaseUrl: 'https://player.twitch.tv/?channel=',
    streamBaseUrl: 'https://www.twitch.tv/',
  },
  facebook: {
    rtmpUrl: 'rtmps://live-api-s.facebook.com:443/rtmp',
    embedBaseUrl: 'https://www.facebook.com/plugins/video.php?href=',
    streamBaseUrl: 'https://www.facebook.com/',
  },
};

export default function AdminStreamControl() {
  // Canvas and rendering
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // State
  const [isStreaming, setIsStreaming] = useState(false);
  const [sources, setSources] = useState<Map<string, Source>>(new Map());
  const [streamingStatus, setStreamingStatus] = useState<StreamingStatus | null>(null);

  // Streaming
  const streamingWsRef = useRef<WebSocket | null>(null);
  const streamRecorderRef = useRef<MediaRecorder | null>(null);
  const [showConfigModal, setShowConfigModal] = useState(false);

  // Config form
  const [platform, setPlatform] = useState('youtube');
  const [streamKey, setStreamKey] = useState('');
  const [channelId, setChannelId] = useState(''); // For embeds
  const [bitrate, setBitrate] = useState(2500);
  const [streamTitle, setStreamTitle] = useState('KUFF Live Performance');
  const [streamDescription, setStreamDescription] = useState('Watch KUFF perform live!');

  // Stats
  const [fps, setFps] = useState(0);
  const statsRef = useRef({ fps: 0, frames: 0, lastFrameTime: 0 });

  const CANVAS_WIDTH = 1920;
  const CANVAS_HEIGHT = 1080;
  const TARGET_FPS = 30;

  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    ctxRef.current = canvas.getContext('2d');

    startRenderLoop();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      sources.forEach(source => {
        if (source.stream) {
          source.stream.getTracks().forEach(track => track.stop());
        }
      });
    };
  }, []);

  // Fetch current status
  useEffect(() => {
    fetchStreamingStatus();
  }, []);

  const fetchStreamingStatus = async () => {
    try {
      const response = await fetch('/api/streaming/status');
      const data = await response.json();
      setStreamingStatus(data);
      setIsStreaming(data.isLive);
    } catch (error) {
      console.error('Error fetching streaming status:', error);
    }
  };

  const startRenderLoop = () => {
    const targetInterval = 1000 / TARGET_FPS;
    let lastTime = performance.now();

    const render = (currentTime: number) => {
      animationFrameRef.current = requestAnimationFrame(render);

      const elapsed = currentTime - lastTime;

      if (elapsed >= targetInterval) {
        lastTime = currentTime - (elapsed % targetInterval);
        renderFrame();
        updateStats();
      }
    };

    animationFrameRef.current = requestAnimationFrame(render);
  };

  const renderFrame = () => {
    if (!ctxRef.current || !canvasRef.current) return;

    const ctx = ctxRef.current;

    // Clear canvas
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Render sources
    sources.forEach(source => {
      if (source.visible) {
        renderSource(ctx, source);
      }
    });

    // Draw LIVE indicator if streaming
    if (isStreaming) {
      ctx.save();
      ctx.fillStyle = 'rgba(255, 0, 0, 0.9)';
      ctx.fillRect(20, 20, 120, 50);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 24px Arial';
      ctx.fillText('LIVE', 50, 53);
      ctx.restore();
    }

    statsRef.current.frames++;
  };

  const renderSource = (ctx: CanvasRenderingContext2D, source: Source) => {
    ctx.save();

    try {
      if (source.type === 'camera' || source.type === 'screen') {
        if (source.video && source.video.readyState >= 2) {
          ctx.drawImage(source.video, source.x, source.y, source.width, source.height);
          ctx.strokeStyle = '#9147ff';
          ctx.lineWidth = 2;
          ctx.strokeRect(source.x, source.y, source.width, source.height);
        }
      } else if (source.type === 'text') {
        ctx.fillStyle = source.color || '#ffffff';
        ctx.font = `${source.fontSize || 72}px Arial`;
        ctx.textBaseline = 'top';
        ctx.fillText(source.text || '', source.x + 10, source.y + 10);
      }
    } catch (error) {
      console.error('Error rendering source:', error);
    }

    ctx.restore();
  };

  const updateStats = () => {
    const now = performance.now();

    if (statsRef.current.lastFrameTime === 0) {
      statsRef.current.lastFrameTime = now;
      return;
    }

    const delta = now - statsRef.current.lastFrameTime;
    statsRef.current.fps = Math.round(1000 / delta);
    statsRef.current.lastFrameTime = now;

    setFps(statsRef.current.fps);
  };

  const addCameraSource = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      const video = document.createElement('video');
      video.srcObject = stream;
      video.autoplay = true;
      video.muted = true;
      await video.play();

      const sourceId = `camera-${Date.now()}`;
      const newSource: Source = {
        id: sourceId,
        type: 'camera',
        name: 'Camera',
        visible: true,
        x: 100,
        y: 100,
        width: 640,
        height: 360,
        video,
        stream,
      };

      setSources(prev => new Map(prev).set(sourceId, newSource));
    } catch (error) {
      console.error('Error adding camera:', error);
      alert('Error accessing camera');
    }
  };

  const addScreenSource = async () => {
    try {
      const stream = await (navigator.mediaDevices as any).getDisplayMedia({
        video: { mediaSource: 'screen' },
        audio: true
      });
      const video = document.createElement('video');
      video.srcObject = stream;
      video.autoplay = true;
      video.muted = true;
      await video.play();

      const sourceId = `screen-${Date.now()}`;
      const newSource: Source = {
        id: sourceId,
        type: 'screen',
        name: 'Screen',
        visible: true,
        x: 0,
        y: 0,
        width: CANVAS_WIDTH,
        height: CANVAS_HEIGHT,
        video,
        stream,
      };

      setSources(prev => new Map(prev).set(sourceId, newSource));
    } catch (error) {
      console.error('Error adding screen:', error);
      alert('Error accessing screen');
    }
  };

  const addTextSource = () => {
    const text = prompt('Enter text:');
    if (!text) return;

    const sourceId = `text-${Date.now()}`;
    const newSource: Source = {
      id: sourceId,
      type: 'text',
      name: 'Text',
      visible: true,
      x: 100,
      y: 900,
      width: 400,
      height: 100,
      text,
      color: '#ffffff',
      fontSize: 72,
    };

    setSources(prev => new Map(prev).set(sourceId, newSource));
  };

  const updateStreamingStatus = async (isLive: boolean, config?: any) => {
    try {
      const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'afro2025';
      const response = await fetch('/api/streaming/status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminPassword}`,
        },
        body: JSON.stringify({
          isLive,
          ...config,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      const data = await response.json();
      setStreamingStatus(data);
    } catch (error) {
      console.error('Error updating streaming status:', error);
    }
  };

  const startStreaming = async () => {
    if (!streamKey || !channelId) {
      alert('Please configure stream settings first');
      setShowConfigModal(true);
      return;
    }

    if (!canvasRef.current) return;

    try {
      // Connect to streaming server
      const wsUrl = 'ws://localhost:9000';
      streamingWsRef.current = new WebSocket(wsUrl);

      await new Promise((resolve, reject) => {
        if (!streamingWsRef.current) return reject(new Error('WebSocket not initialized'));

        streamingWsRef.current.onopen = () => {
          console.log('Connected to streaming server');

          const config = PLATFORM_CONFIG[platform];
          streamingWsRef.current?.send(JSON.stringify({
            type: 'config',
            platform,
            rtmpUrl: config.rtmpUrl,
            streamKey,
            fps: TARGET_FPS,
            bitrate,
          }));

          const configHandler = (event: MessageEvent) => {
            const data = JSON.parse(event.data);
            if (data.type === 'config_received') {
              streamingWsRef.current?.removeEventListener('message', configHandler);
              streamingWsRef.current?.send(JSON.stringify({ type: 'start_stream' }));
              resolve(true);
            }
          };

          streamingWsRef.current?.addEventListener('message', configHandler);
        };

        streamingWsRef.current.onerror = reject;
      });

      // Start capturing canvas
      const stream = canvasRef.current.captureStream(TARGET_FPS);

      streamRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp8',
        videoBitsPerSecond: bitrate * 1000,
      });

      streamRecorderRef.current.ondataavailable = (event) => {
        if (event.data && event.data.size > 0 &&
            streamingWsRef.current &&
            streamingWsRef.current.readyState === WebSocket.OPEN) {
          streamingWsRef.current.send(event.data);
        }
      };

      streamRecorderRef.current.start(100);
      setIsStreaming(true);

      // Update public status
      const config = PLATFORM_CONFIG[platform];
      await updateStreamingStatus(true, {
        platform,
        streamUrl: `${config.streamBaseUrl}${channelId}`,
        embedUrl: `${config.embedBaseUrl}${channelId}`,
        title: streamTitle,
        description: streamDescription,
      });

      console.log('Streaming started');
    } catch (error: any) {
      console.error('Error starting stream:', error);
      alert(`Failed to start streaming: ${error.message}`);
    }
  };

  const stopStreaming = async () => {
    if (streamRecorderRef.current) {
      streamRecorderRef.current.stop();
      streamRecorderRef.current = null;
    }

    if (streamingWsRef.current) {
      streamingWsRef.current.send(JSON.stringify({ type: 'stop_stream' }));
      streamingWsRef.current.close();
      streamingWsRef.current = null;
    }

    setIsStreaming(false);

    // Update public status
    await updateStreamingStatus(false);

    console.log('Streaming stopped');
  };

  return (
    <div className="admin-stream-control">
      <style jsx>{`
        .admin-stream-control {
          background: rgba(26, 26, 26, 0.8);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 25px;
          color: white;
          border: 2px solid rgba(0, 217, 255, 0.2);
          box-shadow: 0 20px 60px rgba(0, 217, 255, 0.1);
          font-family: 'Montserrat', sans-serif;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .title {
          font-size: 1.8em;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 2px;
          background: linear-gradient(135deg, #ffffff 0%, #00d9ff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .status-badge {
          padding: 10px 25px;
          border-radius: 50px;
          font-weight: bold;
          font-size: 0.9em;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .status-badge.live {
          background: #ff0000;
          animation: livePulse 2s infinite;
          box-shadow: 0 5px 25px rgba(255, 0, 0, 0.6);
        }

        .status-badge.offline {
          background: rgba(176, 176, 176, 0.2);
          color: #b0b0b0;
          border: 2px solid rgba(176, 176, 176, 0.3);
        }

        @keyframes livePulse {
          0%, 100% {
            box-shadow: 0 5px 25px rgba(255, 0, 0, 0.6);
          }
          50% {
            box-shadow: 0 8px 35px rgba(255, 0, 0, 0.8);
          }
        }

        .canvas-container {
          background: #000;
          border-radius: 15px;
          overflow: hidden;
          margin-bottom: 20px;
          border: 2px solid rgba(0, 217, 255, 0.2);
        }

        canvas {
          width: 100%;
          height: auto;
          display: block;
        }

        .controls {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 10px;
          margin-bottom: 20px;
        }

        .btn {
          padding: 12px 20px;
          border: none;
          border-radius: 50px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
          font-size: 0.9em;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .btn-primary {
          background: #00d9ff;
          color: #000000;
          box-shadow: 0 10px 30px rgba(0, 217, 255, 0.3);
        }

        .btn-primary:hover {
          background: #00ffff;
          transform: translateY(-3px);
          box-shadow: 0 15px 40px rgba(0, 217, 255, 0.5);
        }

        .btn-danger {
          background: #ff4444;
          color: white;
          box-shadow: 0 10px 30px rgba(255, 68, 68, 0.3);
        }

        .btn-danger:hover {
          background: #ff0000;
          transform: translateY(-3px);
          box-shadow: 0 15px 40px rgba(255, 68, 68, 0.5);
        }

        .btn-secondary {
          background: transparent;
          color: #00d9ff;
          border: 2px solid #00d9ff;
        }

        .btn-secondary:hover {
          background: #00d9ff;
          color: #000000;
          transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(0, 217, 255, 0.4);
        }

        .stats {
          display: flex;
          gap: 20px;
          padding: 15px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 15px;
          border: 2px solid rgba(0, 217, 255, 0.15);
        }

        .stat {
          text-align: center;
          flex: 1;
        }

        .stat-label {
          font-size: 0.9em;
          color: #808080;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .stat-value {
          font-size: 1.5em;
          font-weight: bold;
          margin-top: 5px;
          color: #00d9ff;
        }

        /* Modal */
        .modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          background: rgba(26, 26, 26, 0.95);
          padding: 30px;
          border-radius: 20px;
          max-width: 500px;
          width: 90%;
          max-height: 90vh;
          overflow-y: auto;
          border: 2px solid rgba(0, 217, 255, 0.3);
          box-shadow: 0 20px 60px rgba(0, 217, 255, 0.2);
        }

        .modal-header {
          font-size: 1.5em;
          font-weight: 700;
          margin-bottom: 20px;
          color: #00d9ff;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          font-size: 0.9em;
          color: #b0b0b0;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 12px 15px;
          border: 2px solid rgba(0, 217, 255, 0.3);
          border-radius: 10px;
          background: #000000;
          color: white;
          font-size: 14px;
          transition: all 0.3s;
          font-family: 'Montserrat', sans-serif;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #00d9ff;
          box-shadow: 0 0 20px rgba(0, 217, 255, 0.2);
        }

        .form-group textarea {
          min-height: 80px;
          resize: vertical;
        }

        .modal-buttons {
          display: flex;
          gap: 10px;
          justify-content: flex-end;
          margin-top: 20px;
        }

        .help-text {
          font-size: 0.85em;
          color: #808080;
          margin-top: 5px;
          font-style: italic;
        }
      `}</style>

      <div className="header">
        <div className="title">Live Streaming Control</div>
        <div className={`status-badge ${isStreaming ? 'live' : 'offline'}`}>
          {isStreaming ? '🔴 LIVE' : '⚫ OFFLINE'}
        </div>
      </div>

      <div className="canvas-container">
        <canvas ref={canvasRef} />
      </div>

      <div className="controls">
        <button className="btn btn-secondary" onClick={addCameraSource}>
          📷 Add Camera
        </button>
        <button className="btn btn-secondary" onClick={addScreenSource}>
          🖥️ Add Screen
        </button>
        <button className="btn btn-secondary" onClick={addTextSource}>
          📝 Add Text
        </button>
        <button className="btn btn-secondary" onClick={() => setShowConfigModal(true)}>
          ⚙️ Settings
        </button>
      </div>

      <div className="controls">
        {!isStreaming ? (
          <button className="btn btn-primary" onClick={startStreaming}>
            ▶️ Go Live
          </button>
        ) : (
          <button className="btn btn-danger" onClick={stopStreaming}>
            ⏹️ Stop Stream
          </button>
        )}
      </div>

      <div className="stats">
        <div className="stat">
          <div className="stat-label">FPS</div>
          <div className="stat-value">{fps}</div>
        </div>
        <div className="stat">
          <div className="stat-label">Sources</div>
          <div className="stat-value">{sources.size}</div>
        </div>
        <div className="stat">
          <div className="stat-label">Status</div>
          <div className="stat-value">{isStreaming ? '🔴' : '⚫'}</div>
        </div>
      </div>

      {showConfigModal && (
        <div className="modal" onClick={() => setShowConfigModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">Stream Configuration</div>

            <div className="form-group">
              <label>Platform</label>
              <select value={platform} onChange={(e) => setPlatform(e.target.value)}>
                <option value="youtube">YouTube</option>
                <option value="twitch">Twitch</option>
                <option value="facebook">Facebook</option>
              </select>
            </div>

            <div className="form-group">
              <label>Stream Key</label>
              <input
                type="password"
                value={streamKey}
                onChange={(e) => setStreamKey(e.target.value)}
                placeholder="Enter your stream key"
              />
              <div className="help-text">
                Get this from your {platform} dashboard
              </div>
            </div>

            <div className="form-group">
              <label>Channel ID / Username</label>
              <input
                type="text"
                value={channelId}
                onChange={(e) => setChannelId(e.target.value)}
                placeholder={platform === 'youtube' ? 'Video ID' : 'Channel name'}
              />
              <div className="help-text">
                Used for embedding the stream on the public page
              </div>
            </div>

            <div className="form-group">
              <label>Stream Title</label>
              <input
                type="text"
                value={streamTitle}
                onChange={(e) => setStreamTitle(e.target.value)}
                placeholder="Stream title"
              />
            </div>

            <div className="form-group">
              <label>Stream Description</label>
              <textarea
                value={streamDescription}
                onChange={(e) => setStreamDescription(e.target.value)}
                placeholder="Describe your stream"
              />
            </div>

            <div className="form-group">
              <label>Bitrate (kbps)</label>
              <input
                type="number"
                value={bitrate}
                onChange={(e) => setBitrate(Number(e.target.value))}
                min="500"
                max="8000"
              />
              <div className="help-text">
                Recommended: 2500 kbps
              </div>
            </div>

            <div className="modal-buttons">
              <button className="btn btn-secondary" onClick={() => setShowConfigModal(false)}>
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setShowConfigModal(false);
                  alert('Configuration saved!');
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
