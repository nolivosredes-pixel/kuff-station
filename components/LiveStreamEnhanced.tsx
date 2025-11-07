'use client';

import { useEffect, useState, useRef } from 'react';

interface Source {
  id: string;
  type: 'camera' | 'screen' | 'text' | 'image' | 'color';
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

interface Scene {
  name: string;
  sources: string[];
  background: string;
}

interface StreamConfig {
  platform: string;
  rtmpUrl: string;
  streamKey: string;
  fps: number;
  bitrate: number;
}

interface StreamStats {
  fps: number;
  frames: number;
  duration: number;
}

export default function LiveStreamEnhanced() {
  // Canvas and rendering
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // State
  const [isStreaming, setIsStreaming] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [currentScene, setCurrentScene] = useState('Scene 1');
  const [scenes, setScenes] = useState<Map<string, Scene>>(new Map([
    ['Scene 1', { name: 'Scene 1', sources: [], background: '#1a1a2e' }],
    ['Scene 2', { name: 'Scene 2', sources: [], background: '#16213e' }],
    ['Scene 3', { name: 'Scene 3', sources: [], background: '#0f3460' }],
  ]));
  const [sources, setSources] = useState<Map<string, Source>>(new Map());
  const [stats, setStats] = useState<StreamStats>({
    fps: 0,
    frames: 0,
    duration: 0,
  });

  // Streaming
  const streamingWsRef = useRef<WebSocket | null>(null);
  const streamRecorderRef = useRef<MediaRecorder | null>(null);
  const recordRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const [streamConfig, setStreamConfig] = useState<StreamConfig | null>(null);
  const [showConfigModal, setShowConfigModal] = useState(false);

  // Config form
  const [platform, setPlatform] = useState('youtube');
  const [streamKey, setStreamKey] = useState('');
  const [bitrate, setBitrate] = useState(2500);

  // Stats tracking
  const statsRef = useRef({
    fps: 0,
    frames: 0,
    startTime: 0,
    lastFrameTime: 0,
  });

  const CANVAS_WIDTH = 1920;
  const CANVAS_HEIGHT = 1080;
  const TARGET_FPS = 30;

  // Platform RTMP URLs
  const PLATFORM_URLS: Record<string, string> = {
    youtube: 'rtmp://a.rtmp.youtube.com/live2',
    twitch: 'rtmp://live.twitch.tv/app',
    facebook: 'rtmps://live-api-s.facebook.com:443/rtmp',
  };

  // Initialize canvas and start render loop
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
      // Cleanup sources
      sources.forEach(source => {
        if (source.stream) {
          source.stream.getTracks().forEach(track => track.stop());
        }
      });
    };
  }, []);

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
    const scene = scenes.get(currentScene);
    if (!scene) return;

    // Clear canvas with background
    ctx.fillStyle = scene.background;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Render sources
    scene.sources.forEach(sourceId => {
      const source = sources.get(sourceId);
      if (source && source.visible) {
        renderSource(ctx, source);
      }
    });

    // Draw scene name overlay
    ctx.save();
    ctx.fillStyle = 'rgba(145, 71, 255, 0.8)';
    ctx.fillRect(0, 0, 200, 40);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px Arial';
    ctx.fillText(currentScene, 10, 27);
    ctx.restore();

    statsRef.current.frames++;
  };

  const renderSource = (ctx: CanvasRenderingContext2D, source: Source) => {
    ctx.save();

    try {
      if (source.type === 'camera' || source.type === 'screen') {
        if (source.video && source.video.readyState >= 2) {
          ctx.drawImage(
            source.video,
            source.x, source.y,
            source.width, source.height
          );
          // Draw border
          ctx.strokeStyle = '#9147ff';
          ctx.lineWidth = 2;
          ctx.strokeRect(source.x, source.y, source.width, source.height);
        }
      } else if (source.type === 'text') {
        ctx.fillStyle = source.color || '#ffffff';
        ctx.font = `${source.fontSize || 48}px Arial`;
        ctx.textBaseline = 'top';
        ctx.fillText(source.text || '', source.x + 10, source.y + 10);
      } else if (source.type === 'color') {
        ctx.fillStyle = source.color || '#000000';
        ctx.fillRect(source.x, source.y, source.width, source.height);
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

    if (statsRef.current.startTime > 0) {
      const duration = Math.floor((now - statsRef.current.startTime) / 1000);
      setStats({
        fps: statsRef.current.fps,
        frames: statsRef.current.frames,
        duration,
      });
    } else {
      setStats(prev => ({
        ...prev,
        fps: statsRef.current.fps,
        frames: statsRef.current.frames,
      }));
    }
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

      // Add to current scene
      setScenes(prev => {
        const newScenes = new Map(prev);
        const scene = newScenes.get(currentScene);
        if (scene) {
          scene.sources.push(sourceId);
        }
        return newScenes;
      });

      console.log('Camera source added:', sourceId);
    } catch (error) {
      console.error('Error adding camera:', error);
      alert('Error accessing camera. Please grant camera permissions.');
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

      // Add to current scene
      setScenes(prev => {
        const newScenes = new Map(prev);
        const scene = newScenes.get(currentScene);
        if (scene) {
          scene.sources.push(sourceId);
        }
        return newScenes;
      });

      console.log('Screen source added:', sourceId);
    } catch (error) {
      console.error('Error adding screen:', error);
      alert('Error accessing screen. Please grant screen sharing permissions.');
    }
  };

  const addTextSource = () => {
    const sourceId = `text-${Date.now()}`;
    const newSource: Source = {
      id: sourceId,
      type: 'text',
      name: 'Text',
      visible: true,
      x: 100,
      y: 100,
      width: 400,
      height: 100,
      text: 'LIVE',
      color: '#ffffff',
      fontSize: 72,
    };

    setSources(prev => new Map(prev).set(sourceId, newSource));

    // Add to current scene
    setScenes(prev => {
      const newScenes = new Map(prev);
      const scene = newScenes.get(currentScene);
      if (scene) {
        scene.sources.push(sourceId);
      }
      return newScenes;
    });

    console.log('Text source added:', sourceId);
  };

  const saveStreamConfig = () => {
    const config: StreamConfig = {
      platform,
      rtmpUrl: PLATFORM_URLS[platform],
      streamKey,
      fps: TARGET_FPS,
      bitrate,
    };
    setStreamConfig(config);
    setShowConfigModal(false);
    console.log('Stream configuration saved:', { ...config, streamKey: '****' });
  };

  const connectToStreamingServer = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!streamConfig) {
        reject(new Error('No stream configuration'));
        return;
      }

      console.log('Connecting to streaming server...');

      const wsUrl = `ws://localhost:9000`;
      streamingWsRef.current = new WebSocket(wsUrl);

      streamingWsRef.current.onopen = () => {
        console.log('Connected to streaming server');

        if (!streamingWsRef.current || !streamConfig) return;

        streamingWsRef.current.send(JSON.stringify({
          type: 'config',
          platform: streamConfig.platform,
          rtmpUrl: streamConfig.rtmpUrl,
          streamKey: streamConfig.streamKey,
          fps: streamConfig.fps,
          bitrate: streamConfig.bitrate,
        }));

        const configHandler = (event: MessageEvent) => {
          const data = JSON.parse(event.data);
          if (data.type === 'config_received') {
            console.log('Configuration accepted');
            streamingWsRef.current?.removeEventListener('message', configHandler);

            streamingWsRef.current?.send(JSON.stringify({
              type: 'start_stream'
            }));

            resolve();
          }
        };

        streamingWsRef.current.addEventListener('message', configHandler);
      };

      streamingWsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        reject(new Error('Failed to connect to streaming server'));
      };

      streamingWsRef.current.onclose = () => {
        console.log('Disconnected from streaming server');
      };
    });
  };

  const startStreaming = async () => {
    if (!streamConfig) {
      alert('Please configure streaming settings first');
      setShowConfigModal(true);
      return;
    }

    if (!canvasRef.current) return;

    try {
      await connectToStreamingServer();

      const stream = canvasRef.current.captureStream(TARGET_FPS);

      streamRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp8',
        videoBitsPerSecond: streamConfig.bitrate * 1000,
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
      statsRef.current.startTime = performance.now();

      console.log('Streaming started to', streamConfig.platform);
    } catch (error: any) {
      console.error('Error starting stream:', error);
      alert(`Failed to start streaming: ${error.message}\n\nMake sure the streaming server is running:\nnode server/streaming-server.js`);
    }
  };

  const stopStreaming = () => {
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
    statsRef.current.startTime = 0;
    console.log('Streaming stopped');
  };

  const startRecording = () => {
    if (!canvasRef.current) return;

    const stream = canvasRef.current.captureStream(TARGET_FPS);

    recordRecorderRef.current = new MediaRecorder(stream, {
      mimeType: 'video/webm;codecs=vp9',
      videoBitsPerSecond: 5000000,
    });

    recordedChunksRef.current = [];

    recordRecorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunksRef.current.push(event.data);
      }
    };

    recordRecorderRef.current.onstop = () => {
      saveRecording();
    };

    recordRecorderRef.current.start(1000);
    setIsRecording(true);
    statsRef.current.startTime = performance.now();

    console.log('Recording started');
  };

  const stopRecording = () => {
    if (recordRecorderRef.current) {
      recordRecorderRef.current.stop();
      recordRecorderRef.current = null;
    }

    setIsRecording(false);
    statsRef.current.startTime = 0;
    console.log('Recording stopped');
  };

  const saveRecording = () => {
    const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `kuff-live-${Date.now()}.webm`;
    a.click();

    URL.revokeObjectURL(url);
    console.log('Recording saved');
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="live-stream-enhanced">
      <style jsx>{`
        .live-stream-enhanced {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 15px;
          padding: 30px;
          color: white;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 25px;
        }

        .title {
          font-size: 2em;
          font-weight: bold;
        }

        .live-badge {
          background: #ff0000;
          padding: 10px 20px;
          border-radius: 25px;
          font-weight: bold;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        .canvas-container {
          background: #000;
          border-radius: 10px;
          overflow: hidden;
          margin-bottom: 20px;
          position: relative;
          aspect-ratio: 16/9;
        }

        canvas {
          width: 100%;
          height: 100%;
          display: block;
        }

        .controls {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
          margin-bottom: 20px;
        }

        .btn {
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-primary {
          background: #51cf66;
          color: white;
        }

        .btn-primary:hover {
          background: #40c057;
        }

        .btn-danger {
          background: #ff6b6b;
          color: white;
        }

        .btn-secondary {
          background: rgba(255, 255, 255, 0.2);
          color: white;
        }

        .sources {
          margin-bottom: 20px;
        }

        .sources h3 {
          margin-bottom: 10px;
        }

        .source-buttons {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .scenes {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
        }

        .scene-btn {
          padding: 10px 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.1);
          color: white;
          cursor: pointer;
          transition: all 0.3s;
        }

        .scene-btn.active {
          border-color: #51cf66;
          background: rgba(81, 207, 102, 0.3);
        }

        .stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
          padding: 15px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }

        .stat {
          text-align: center;
        }

        .stat-label {
          font-size: 0.9em;
          opacity: 0.8;
        }

        .stat-value {
          font-size: 1.5em;
          font-weight: bold;
        }

        .modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          background: #1a1a2e;
          padding: 30px;
          border-radius: 15px;
          max-width: 500px;
          width: 90%;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
        }

        .form-group select,
        .form-group input {
          width: 100%;
          padding: 10px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.1);
          color: white;
          font-size: 14px;
        }

        .form-group input::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }

        .modal-buttons {
          display: flex;
          gap: 10px;
          justify-content: flex-end;
        }
      `}</style>

      <div className="header">
        <div className="title">Live Streaming Studio</div>
        {isStreaming && <div className="live-badge">LIVE</div>}
      </div>

      <div className="scenes">
        {Array.from(scenes.keys()).map(sceneName => (
          <button
            key={sceneName}
            className={`scene-btn ${currentScene === sceneName ? 'active' : ''}`}
            onClick={() => setCurrentScene(sceneName)}
          >
            {sceneName}
          </button>
        ))}
      </div>

      <div className="canvas-container">
        <canvas ref={canvasRef} />
      </div>

      <div className="sources">
        <h3>Add Sources</h3>
        <div className="source-buttons">
          <button className="btn btn-secondary" onClick={addCameraSource}>
            Add Camera
          </button>
          <button className="btn btn-secondary" onClick={addScreenSource}>
            Add Screen
          </button>
          <button className="btn btn-secondary" onClick={addTextSource}>
            Add Text
          </button>
        </div>
      </div>

      <div className="controls">
        {!isStreaming ? (
          <button className="btn btn-primary" onClick={startStreaming}>
            Start Streaming
          </button>
        ) : (
          <button className="btn btn-danger" onClick={stopStreaming}>
            Stop Streaming
          </button>
        )}

        {!isRecording ? (
          <button className="btn btn-primary" onClick={startRecording}>
            Start Recording
          </button>
        ) : (
          <button className="btn btn-danger" onClick={stopRecording}>
            Stop Recording
          </button>
        )}

        <button className="btn btn-secondary" onClick={() => setShowConfigModal(true)}>
          Stream Settings
        </button>
      </div>

      <div className="stats">
        <div className="stat">
          <div className="stat-label">FPS</div>
          <div className="stat-value">{stats.fps}</div>
        </div>
        <div className="stat">
          <div className="stat-label">Frames</div>
          <div className="stat-value">{stats.frames}</div>
        </div>
        <div className="stat">
          <div className="stat-label">Duration</div>
          <div className="stat-value">{formatTime(stats.duration)}</div>
        </div>
      </div>

      {showConfigModal && (
        <div className="modal" onClick={() => setShowConfigModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Stream Configuration</h2>

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
            </div>

            <div className="modal-buttons">
              <button className="btn btn-secondary" onClick={() => setShowConfigModal(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={saveStreamConfig}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
