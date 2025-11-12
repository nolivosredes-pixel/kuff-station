'use client';

import { useEffect, useState, useRef } from 'react';

interface Source {
  id: string;
  type: 'camera' | 'screen' | 'phone' | 'audio';
  name: string;
  stream: MediaStream | null;
  enabled: boolean;
  volume: number;
}

interface Scene {
  id: string;
  name: string;
  sources: string[]; // IDs of sources in this scene
}

export default function StreamingStudio() {
  const [sources, setSources] = useState<Source[]>([]);
  const [scenes, setScenes] = useState<Scene[]>([
    { id: 'scene-1', name: 'Main Scene', sources: [] }
  ]);
  const [activeScene, setActiveScene] = useState('scene-1');
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamStats, setStreamStats] = useState({
    duration: '00:00:00',
    bitrate: 0,
    fps: 0,
    viewers: 0,
  });

  const previewRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamStartTime = useRef<number | null>(null);

  // Add camera source
  const addCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1920, height: 1080 },
        audio: true
      });

      const newSource: Source = {
        id: `camera-${Date.now()}`,
        type: 'camera',
        name: `Camera ${sources.filter(s => s.type === 'camera').length + 1}`,
        stream,
        enabled: true,
        volume: 100,
      };

      setSources([...sources, newSource]);
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Could not access camera. Please check permissions.');
    }
  };

  // Add screen capture
  const addScreen = async () => {
    try {
      const stream = await (navigator.mediaDevices as any).getDisplayMedia({
        video: { width: 1920, height: 1080 },
        audio: true
      });

      const newSource: Source = {
        id: `screen-${Date.now()}`,
        type: 'screen',
        name: `Screen ${sources.filter(s => s.type === 'screen').length + 1}`,
        stream,
        enabled: true,
        volume: 100,
      };

      setSources([...sources, newSource]);
    } catch (error) {
      console.error('Error accessing screen:', error);
      alert('Could not capture screen.');
    }
  };

  // Add phone connection (WebRTC)
  const addPhone = () => {
    alert('To connect your phone:\n\n1. Open this URL on your phone\n2. Click "Share Camera"\n3. Point to QR code\n\nComing soon!');
  };

  // Remove source
  const removeSource = (id: string) => {
    const source = sources.find(s => s.id === id);
    if (source?.stream) {
      source.stream.getTracks().forEach(track => track.stop());
    }
    setSources(sources.filter(s => s.id !== id));
  };

  // Toggle source
  const toggleSource = (id: string) => {
    setSources(sources.map(s =>
      s.id === id ? { ...s, enabled: !s.enabled } : s
    ));
  };

  // Update source volume
  const updateVolume = (id: string, volume: number) => {
    setSources(sources.map(s =>
      s.id === id ? { ...s, volume } : s
    ));
  };

  // Start streaming
  const startStream = async () => {
    if (!canvasRef.current) return;

    try {
      // Create canvas stream
      const canvas = canvasRef.current;
      const stream = canvas.captureStream(30);

      // Add audio from sources
      sources.forEach(source => {
        if (source.stream && source.enabled) {
          const audioTracks = source.stream.getAudioTracks();
          audioTracks.forEach(track => stream.addTrack(track));
        }
      });

      setIsStreaming(true);
      streamStartTime.current = Date.now();
      setStreamStats(prev => ({ ...prev, fps: 30, bitrate: 2500 }));

      // TODO: Send stream to RTMP server via WebSocket
      console.log('Stream started:', stream);
    } catch (error) {
      console.error('Error starting stream:', error);
      alert('Could not start stream');
    }
  };

  // Stop streaming
  const stopStream = () => {
    setIsStreaming(false);
    streamStartTime.current = null;
    setStreamStats({ duration: '00:00:00', bitrate: 0, fps: 0, viewers: 0 });
  };

  // Update duration
  useEffect(() => {
    if (!isStreaming || !streamStartTime.current) return;

    const interval = setInterval(() => {
      const elapsed = Date.now() - streamStartTime.current!;
      const hours = Math.floor(elapsed / 3600000);
      const minutes = Math.floor((elapsed % 3600000) / 60000);
      const seconds = Math.floor((elapsed % 60000) / 1000);

      setStreamStats(prev => ({
        ...prev,
        duration: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [isStreaming]);

  // Render canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 1920;
    canvas.height = 1080;

    const render = () => {
      // Clear canvas
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Render active sources
      const currentScene = scenes.find(s => s.id === activeScene);
      if (currentScene) {
        sources
          .filter(s => currentScene.sources.includes(s.id) && s.enabled && s.stream)
          .forEach((source, index) => {
            if (source.stream) {
              const videoTrack = source.stream.getVideoTracks()[0];
              if (videoTrack) {
                const video = document.createElement('video');
                video.srcObject = new MediaStream([videoTrack]);
                video.play();
                // Draw video on canvas (this is simplified)
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
              }
            }
          });
      }

      // Stream indicator
      if (isStreaming) {
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(20, 20, 120, 50);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 24px Arial';
        ctx.fillText('LIVE', 50, 53);
      }

      requestAnimationFrame(render);
    };

    render();
  }, [sources, activeScene, scenes, isStreaming]);

  return (
    <div className="studio">
      <style jsx>{`
        .studio {
          display: grid;
          grid-template-columns: 1fr 350px;
          grid-template-rows: 1fr auto;
          height: calc(100vh - 70px);
          gap: 0;
          background: #0a0a0a;
        }

        /* Preview Area */
        .preview-area {
          background: #000;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          border-right: 1px solid rgba(0, 217, 255, 0.2);
          border-bottom: 1px solid rgba(0, 217, 255, 0.2);
        }

        .preview-canvas {
          width: 100%;
          height: auto;
          max-height: 100%;
          object-fit: contain;
        }

        .preview-overlay {
          position: absolute;
          top: 20px;
          left: 20px;
          background: rgba(0, 0, 0, 0.8);
          padding: 10px 20px;
          border-radius: 10px;
          border: 2px solid rgba(0, 217, 255, 0.5);
        }

        .preview-overlay.live {
          border-color: #ff0000;
          animation: pulse 2s infinite;
        }

        .overlay-status {
          color: white;
          font-weight: 700;
          font-size: 1.2rem;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .live-dot {
          width: 12px;
          height: 12px;
          background: #ff0000;
          border-radius: 50%;
          animation: blink 1s infinite;
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        /* Right Panel - Sources & Scenes */
        .right-panel {
          background: #1a1a1a;
          border-bottom: 1px solid rgba(0, 217, 255, 0.2);
          display: flex;
          flex-direction: column;
          overflow-y: auto;
        }

        .panel-section {
          padding: 15px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .panel-title {
          color: #00d9ff;
          font-weight: 700;
          font-size: 1rem;
          margin-bottom: 15px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        /* Scenes */
        .scenes-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .scene-item {
          padding: 12px;
          background: rgba(0, 217, 255, 0.1);
          border: 2px solid rgba(0, 217, 255, 0.3);
          border-radius: 8px;
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .scene-item.active {
          background: rgba(0, 217, 255, 0.3);
          border-color: #00d9ff;
        }

        .scene-item:hover {
          background: rgba(0, 217, 255, 0.2);
        }

        /* Sources */
        .sources-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .source-item {
          background: rgba(0, 0, 0, 0.5);
          border: 2px solid rgba(0, 217, 255, 0.2);
          border-radius: 10px;
          padding: 12px;
        }

        .source-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }

        .source-name {
          color: white;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .source-controls {
          display: flex;
          gap: 5px;
        }

        .source-btn {
          background: rgba(0, 217, 255, 0.2);
          border: 1px solid rgba(0, 217, 255, 0.4);
          color: #00d9ff;
          padding: 5px 10px;
          border-radius: 5px;
          cursor: pointer;
          font-size: 0.75rem;
          font-weight: 600;
          transition: all 0.3s;
        }

        .source-btn:hover {
          background: rgba(0, 217, 255, 0.3);
        }

        .source-btn.remove {
          background: rgba(255, 68, 68, 0.2);
          border-color: rgba(255, 68, 68, 0.4);
          color: #ff4444;
        }

        .source-btn.remove:hover {
          background: rgba(255, 68, 68, 0.3);
        }

        .volume-control {
          margin-top: 8px;
        }

        .volume-label {
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.75rem;
          margin-bottom: 5px;
        }

        .volume-slider {
          width: 100%;
          height: 4px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.1);
          outline: none;
          -webkit-appearance: none;
        }

        .volume-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #00d9ff;
          cursor: pointer;
        }

        .add-source-btn {
          padding: 12px;
          background: rgba(0, 217, 255, 0.2);
          border: 2px solid rgba(0, 217, 255, 0.4);
          border-radius: 10px;
          color: #00d9ff;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
          text-align: center;
          font-size: 0.9rem;
        }

        .add-source-btn:hover {
          background: rgba(0, 217, 255, 0.3);
          border-color: #00d9ff;
        }

        /* Bottom Controls */
        .bottom-controls {
          grid-column: 1 / -1;
          background: #1a1a1a;
          border-top: 2px solid rgba(0, 217, 255, 0.2);
          padding: 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .stream-stats {
          display: flex;
          gap: 30px;
          color: white;
        }

        .stat {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .stat-label {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.6);
          text-transform: uppercase;
        }

        .stat-value {
          font-size: 1.1rem;
          font-weight: 700;
          color: #00d9ff;
        }

        .stream-button {
          padding: 15px 50px;
          border: none;
          border-radius: 50px;
          font-weight: 700;
          font-size: 1.1rem;
          cursor: pointer;
          transition: all 0.3s;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .stream-button.start {
          background: linear-gradient(135deg, #00ff00 0%, #00cc00 100%);
          color: white;
          box-shadow: 0 10px 30px rgba(0, 255, 0, 0.3);
        }

        .stream-button.start:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 40px rgba(0, 255, 0, 0.5);
        }

        .stream-button.stop {
          background: linear-gradient(135deg, #ff4444 0%, #cc0000 100%);
          color: white;
          box-shadow: 0 10px 30px rgba(255, 68, 68, 0.3);
        }

        .stream-button.stop:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 40px rgba(255, 68, 68, 0.5);
        }

        @media (max-width: 1024px) {
          .studio {
            grid-template-columns: 1fr;
            grid-template-rows: auto 1fr auto;
          }

          .right-panel {
            border-right: none;
            border-bottom: 1px solid rgba(0, 217, 255, 0.2);
          }

          .bottom-controls {
            flex-direction: column;
          }

          .stream-stats {
            width: 100%;
            justify-content: space-around;
          }
        }
      `}</style>

      {/* Preview Area */}
      <div className="preview-area">
        <canvas ref={canvasRef} className="preview-canvas" />
        <div className={`preview-overlay ${isStreaming ? 'live' : ''}`}>
          <div className="overlay-status">
            {isStreaming && <div className="live-dot"></div>}
            {isStreaming ? 'LIVE' : 'OFFLINE'}
          </div>
        </div>
      </div>

      {/* Right Panel - Scenes & Sources */}
      <div className="right-panel">
        {/* Scenes */}
        <div className="panel-section">
          <div className="panel-title">📺 Scenes</div>
          <div className="scenes-list">
            {scenes.map(scene => (
              <div
                key={scene.id}
                className={`scene-item ${activeScene === scene.id ? 'active' : ''}`}
                onClick={() => setActiveScene(scene.id)}
              >
                {scene.name}
              </div>
            ))}
          </div>
        </div>

        {/* Sources */}
        <div className="panel-section">
          <div className="panel-title">🎥 Sources</div>
          <div className="sources-list">
            {sources.map(source => (
              <div key={source.id} className="source-item">
                <div className="source-header">
                  <span className="source-name">{source.name}</span>
                  <div className="source-controls">
                    <button
                      className="source-btn"
                      onClick={() => toggleSource(source.id)}
                    >
                      {source.enabled ? '👁️' : '👁️‍🗨️'}
                    </button>
                    <button
                      className="source-btn remove"
                      onClick={() => removeSource(source.id)}
                    >
                      ✕
                    </button>
                  </div>
                </div>
                {source.type !== 'screen' && (
                  <div className="volume-control">
                    <div className="volume-label">Volume: {source.volume}%</div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={source.volume}
                      onChange={(e) => updateVolume(source.id, Number(e.target.value))}
                      className="volume-slider"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Add Source Buttons */}
          <div style={{ marginTop: '15px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button className="add-source-btn" onClick={addCamera}>
              📷 Add Camera
            </button>
            <button className="add-source-btn" onClick={addScreen}>
              🖥️ Add Screen
            </button>
            <button className="add-source-btn" onClick={addPhone}>
              📱 Connect Phone
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="bottom-controls">
        <div className="stream-stats">
          <div className="stat">
            <div className="stat-label">Duration</div>
            <div className="stat-value">{streamStats.duration}</div>
          </div>
          <div className="stat">
            <div className="stat-label">FPS</div>
            <div className="stat-value">{streamStats.fps}</div>
          </div>
          <div className="stat">
            <div className="stat-label">Bitrate</div>
            <div className="stat-value">{streamStats.bitrate} kbps</div>
          </div>
          <div className="stat">
            <div className="stat-label">Viewers</div>
            <div className="stat-value">{streamStats.viewers}</div>
          </div>
        </div>

        {!isStreaming ? (
          <button className="stream-button start" onClick={startStream}>
            ▶️ Start Streaming
          </button>
        ) : (
          <button className="stream-button stop" onClick={stopStream}>
            ⏹️ Stop Stream
          </button>
        )}
      </div>
    </div>
  );
}
