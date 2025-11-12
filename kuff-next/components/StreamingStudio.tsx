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
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const websocketRef = useRef<WebSocket | null>(null);
  const videoElementsRef = useRef<Map<string, HTMLVideoElement>>(new Map());
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

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

  // Start streaming via WebRTC to SRS
  const startStream = async () => {
    if (!canvasRef.current) return;

    try {
      // Create canvas stream
      const canvas = canvasRef.current;
      const videoStream = canvas.captureStream(30);

      // Create audio context for mixing multiple audio sources
      const audioContext = new AudioContext();
      const audioDestination = audioContext.createMediaStreamDestination();

      // Mix audio from all enabled sources
      sources.forEach(source => {
        if (source.stream && source.enabled) {
          const audioTracks = source.stream.getAudioTracks();
          if (audioTracks.length > 0) {
            const audioSource = audioContext.createMediaStreamSource(
              new MediaStream(audioTracks)
            );
            const gainNode = audioContext.createGain();
            gainNode.gain.value = source.volume / 100;
            audioSource.connect(gainNode);
            gainNode.connect(audioDestination);
          }
        }
      });

      // Combine video and mixed audio
      const combinedStream = new MediaStream([
        ...videoStream.getVideoTracks(),
        ...audioDestination.stream.getAudioTracks()
      ]);

      console.log('Starting WebRTC connection to SRS...');

      // Create RTCPeerConnection
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
      });
      peerConnectionRef.current = pc;

      // Add tracks to peer connection
      combinedStream.getTracks().forEach(track => {
        pc.addTrack(track, combinedStream);
      });

      // Create and set local offer
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      console.log('Sending offer to SRS...');

      // Send offer to SRS WebRTC endpoint
      const srsUrl = process.env.NEXT_PUBLIC_OWNCAST_SERVER_URL || 'https://kuff-srs.fly.dev';
      const streamKey = process.env.NEXT_PUBLIC_OWNCAST_STREAM_KEY || 'QS76Y2rDmfxm*upmFVO@vp099KyOyJ';

      const response = await fetch(`${srsUrl}/rtc/v1/publish/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          api: `${srsUrl}/rtc/v1/publish/`,
          streamurl: `webrtc://${srsUrl.replace('https://', '').replace('http://', '')}/live/${streamKey}`,
          sdp: offer.sdp,
        }),
      });

      if (!response.ok) {
        throw new Error(`SRS responded with ${response.status}: ${await response.text()}`);
      }

      const answer = await response.json();
      console.log('Received answer from SRS');

      // Set remote description (SRS answer)
      await pc.setRemoteDescription({
        type: 'answer',
        sdp: answer.sdp,
      });

      // Monitor connection state
      pc.oniceconnectionstatechange = () => {
        console.log('ICE connection state:', pc.iceConnectionState);
        if (pc.iceConnectionState === 'failed' || pc.iceConnectionState === 'disconnected') {
          console.error('WebRTC connection failed');
          stopStream();
          alert('Connection to streaming server lost');
        }
      };

      pc.onconnectionstatechange = () => {
        console.log('Connection state:', pc.connectionState);
        if (pc.connectionState === 'connected') {
          console.log('✅ Successfully streaming to SRS via WebRTC!');
        }
      };

      setIsStreaming(true);
      streamStartTime.current = Date.now();
      setStreamStats(prev => ({ ...prev, fps: 30, bitrate: 2500 }));

      console.log('🔴 Stream started successfully - Broadcasting LIVE to SRS!');

    } catch (error) {
      console.error('Error starting stream:', error);
      alert('Could not start stream: ' + (error as Error).message);
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }
    }
  };

  // Stop streaming
  const stopStream = () => {
    // Close WebRTC peer connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
      console.log('WebRTC connection closed');
    }

    // Stop MediaRecorder (if any)
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
    }

    // Close WebSocket (if any)
    if (websocketRef.current && websocketRef.current.readyState === WebSocket.OPEN) {
      websocketRef.current.close();
      websocketRef.current = null;
    }

    setIsStreaming(false);
    streamStartTime.current = null;
    setStreamStats({ duration: '00:00:00', bitrate: 0, fps: 0, viewers: 0 });
    console.log('🔴 Stream stopped');
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

  // Render canvas - REAL rendering
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 1920;
    canvas.height = 1080;

    // Create and maintain video elements for each source
    sources.forEach(source => {
      if (source.stream && !videoElementsRef.current.has(source.id)) {
        const videoElement = document.createElement('video');
        videoElement.srcObject = source.stream;
        videoElement.muted = true; // Mute for canvas (audio handled separately)
        videoElement.autoplay = true;
        videoElement.playsInline = true;
        videoElement.play().catch(err => console.log('Video play error:', err));
        videoElementsRef.current.set(source.id, videoElement);
      }
    });

    // Clean up removed sources
    const currentSourceIds = new Set(sources.map(s => s.id));
    videoElementsRef.current.forEach((video, id) => {
      if (!currentSourceIds.has(id)) {
        video.pause();
        video.srcObject = null;
        videoElementsRef.current.delete(id);
      }
    });

    let animationFrameId: number;

    const render = () => {
      // Clear canvas with dark background
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Render enabled sources (simple fullscreen layout)
      const enabledSources = sources.filter(s => s.enabled && s.stream);

      if (enabledSources.length > 0) {
        // For now, show the first enabled source fullscreen
        // TODO: Add proper scene layouts (side-by-side, PIP, etc.)
        const mainSource = enabledSources[0];
        const videoElement = videoElementsRef.current.get(mainSource.id);

        if (videoElement && videoElement.readyState >= 2) {
          // Draw video filling the canvas
          ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
        }

        // If there are multiple sources, show them in a grid
        if (enabledSources.length > 1) {
          const gridSize = Math.ceil(Math.sqrt(enabledSources.length));
          const cellWidth = canvas.width / gridSize;
          const cellHeight = canvas.height / gridSize;

          enabledSources.forEach((source, index) => {
            const videoElement = videoElementsRef.current.get(source.id);
            if (videoElement && videoElement.readyState >= 2) {
              const col = index % gridSize;
              const row = Math.floor(index / gridSize);
              const x = col * cellWidth;
              const y = row * cellHeight;
              ctx.drawImage(videoElement, x, y, cellWidth, cellHeight);

              // Draw source name
              ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
              ctx.fillRect(x, y, cellWidth, 40);
              ctx.fillStyle = '#00d9ff';
              ctx.font = 'bold 20px Arial';
              ctx.fillText(source.name, x + 10, y + 28);
            }
          });
        }
      } else {
        // No sources - show placeholder
        ctx.fillStyle = '#333';
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Add a source to start', canvas.width / 2, canvas.height / 2);
        ctx.textAlign = 'left';
      }

      // Stream indicator overlay
      if (isStreaming) {
        ctx.fillStyle = 'rgba(255, 0, 0, 0.9)';
        ctx.fillRect(20, 20, 120, 50);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 28px Arial';
        ctx.fillText('🔴 LIVE', 35, 53);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [sources, isStreaming]);

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
