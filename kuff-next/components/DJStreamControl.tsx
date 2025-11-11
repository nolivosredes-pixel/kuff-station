'use client';

import { useEffect, useState, useRef } from 'react';

interface StreamStats {
  fps: number;
  bitrate: number;
  viewers: number;
  duration: string;
  isLive: boolean;
}

interface AudioLevel {
  left: number;
  right: number;
}

export default function DJStreamControl() {
  // Stream state
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamStatus, setStreamStatus] = useState<'offline' | 'connecting' | 'live' | 'error'>('offline');
  const [stats, setStats] = useState<StreamStats>({
    fps: 0,
    bitrate: 0,
    viewers: 0,
    duration: '00:00:00',
    isLive: false,
  });

  // Audio controls
  const [masterVolume, setMasterVolume] = useState(100);
  const [micVolume, setMicVolume] = useState(75);
  const [musicVolume, setMusicVolume] = useState(85);
  const [audioLevels, setAudioLevels] = useState<AudioLevel>({ left: 0, right: 0 });

  // Visual controls
  const [showOverlay, setShowOverlay] = useState(true);
  const [overlayText, setOverlayText] = useState('KUFF LIVE');
  const [visualEffect, setVisualEffect] = useState<'none' | 'pulse' | 'rainbow' | 'strobe'>('none');

  // Stream config
  const [streamKey, setStreamKey] = useState('');
  const [showStreamKey, setShowStreamKey] = useState(false);
  const [targetBitrate, setTargetBitrate] = useState(2500);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamStartTime = useRef<number | null>(null);

  // Load stream config from env
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_STREAM_KEY || process.env.OWNCAST_STREAM_KEY || '';
    setStreamKey(key);
  }, []);

  // Simulate audio levels (in real app, connect to Web Audio API)
  useEffect(() => {
    if (!isStreaming) return;

    const interval = setInterval(() => {
      setAudioLevels({
        left: Math.random() * masterVolume,
        right: Math.random() * masterVolume,
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isStreaming, masterVolume]);

  // Update stream duration
  useEffect(() => {
    if (!isStreaming || !streamStartTime.current) return;

    const interval = setInterval(() => {
      const elapsed = Date.now() - streamStartTime.current!;
      const hours = Math.floor(elapsed / 3600000);
      const minutes = Math.floor((elapsed % 3600000) / 60000);
      const seconds = Math.floor((elapsed % 60000) / 1000);

      setStats(prev => ({
        ...prev,
        duration: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [isStreaming]);

  // Fetch current stream status from API
  useEffect(() => {
    const checkStreamStatus = async () => {
      try {
        const response = await fetch('/api/owncast/status');
        const data = await response.json();

        if (data.online) {
          setStats(prev => ({
            ...prev,
            isLive: true,
            viewers: data.viewerCount || 0,
          }));
        }
      } catch (error) {
        console.error('Error checking stream status:', error);
      }
    };

    checkStreamStatus();
    const interval = setInterval(checkStreamStatus, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleStartStream = async () => {
    if (!streamKey) {
      alert('Stream key not configured. Check your environment variables.');
      return;
    }

    setStreamStatus('connecting');

    // Simulate connection delay
    setTimeout(() => {
      setIsStreaming(true);
      setStreamStatus('live');
      streamStartTime.current = Date.now();
      setStats(prev => ({
        ...prev,
        fps: 30,
        bitrate: targetBitrate,
        isLive: true,
      }));
    }, 2000);
  };

  const handleStopStream = () => {
    setIsStreaming(false);
    setStreamStatus('offline');
    streamStartTime.current = null;
    setStats({
      fps: 0,
      bitrate: 0,
      viewers: 0,
      duration: '00:00:00',
      isLive: false,
    });
  };

  return (
    <div className="dj-control">
      <style jsx>{`
        .dj-control {
          padding: 20px;
          max-width: 1800px;
          margin: 0 auto;
        }

        .control-grid {
          display: grid;
          grid-template-columns: 1fr 350px;
          gap: 20px;
          margin-bottom: 20px;
        }

        /* Stream Preview */
        .stream-preview {
          background: #000;
          border-radius: 15px;
          overflow: hidden;
          border: 2px solid rgba(0, 217, 255, 0.3);
          position: relative;
          aspect-ratio: 16/9;
        }

        .preview-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 15px;
          background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%);
        }

        .preview-icon {
          font-size: 4rem;
          opacity: 0.3;
        }

        .preview-text {
          color: rgba(255, 255, 255, 0.5);
          font-size: 1.1rem;
        }

        .live-indicator {
          position: absolute;
          top: 20px;
          left: 20px;
          background: #ff0000;
          color: white;
          padding: 10px 20px;
          border-radius: 50px;
          font-weight: 700;
          font-size: 1rem;
          display: flex;
          align-items: center;
          gap: 8px;
          animation: pulse 2s infinite;
          box-shadow: 0 5px 20px rgba(255, 0, 0, 0.5);
        }

        .live-dot {
          width: 10px;
          height: 10px;
          background: white;
          border-radius: 50%;
          animation: blink 1s infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        .overlay-display {
          position: absolute;
          bottom: 30px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0, 0, 0, 0.8);
          color: #00d9ff;
          padding: 15px 30px;
          border-radius: 10px;
          font-weight: 700;
          font-size: 1.3rem;
          letter-spacing: 2px;
          text-transform: uppercase;
          border: 2px solid rgba(0, 217, 255, 0.5);
        }

        /* Stream Stats Panel */
        .stats-panel {
          background: rgba(26, 26, 26, 0.9);
          border-radius: 15px;
          padding: 20px;
          border: 2px solid rgba(0, 217, 255, 0.3);
        }

        .stats-header {
          font-size: 1.3rem;
          font-weight: 700;
          color: #00d9ff;
          margin-bottom: 20px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .stat-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .stat-item:last-child {
          border-bottom: none;
        }

        .stat-label {
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.9rem;
        }

        .stat-value {
          color: white;
          font-weight: 700;
          font-size: 1.1rem;
        }

        .stat-value.live {
          color: #00ff00;
        }

        .stat-value.offline {
          color: #ff4444;
        }

        /* Status Badge */
        .status-badge {
          display: inline-block;
          padding: 5px 15px;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 700;
          text-transform: uppercase;
        }

        .status-badge.offline {
          background: rgba(128, 128, 128, 0.3);
          color: #999;
        }

        .status-badge.connecting {
          background: rgba(255, 165, 0, 0.3);
          color: #ffa500;
          animation: pulse 1s infinite;
        }

        .status-badge.live {
          background: rgba(0, 255, 0, 0.3);
          color: #00ff00;
        }

        .status-badge.error {
          background: rgba(255, 0, 0, 0.3);
          color: #ff4444;
        }

        /* Controls Section */
        .controls-section {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
        }

        .control-panel {
          background: rgba(26, 26, 26, 0.9);
          border-radius: 15px;
          padding: 25px;
          border: 2px solid rgba(0, 217, 255, 0.3);
        }

        .panel-header {
          font-size: 1.2rem;
          font-weight: 700;
          color: #00d9ff;
          margin-bottom: 20px;
          text-transform: uppercase;
          letter-spacing: 1px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .panel-icon {
          font-size: 1.5rem;
        }

        /* Audio Controls */
        .mixer-control {
          margin-bottom: 25px;
        }

        .mixer-label {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.9rem;
          font-weight: 600;
        }

        .mixer-value {
          color: #00d9ff;
          font-weight: 700;
        }

        .slider {
          width: 100%;
          height: 8px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.1);
          outline: none;
          -webkit-appearance: none;
          appearance: none;
        }

        .slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #00d9ff 0%, #0099cc 100%);
          cursor: pointer;
          box-shadow: 0 3px 10px rgba(0, 217, 255, 0.5);
        }

        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #00d9ff 0%, #0099cc 100%);
          cursor: pointer;
          border: none;
          box-shadow: 0 3px 10px rgba(0, 217, 255, 0.5);
        }

        /* VU Meters */
        .vu-meters {
          display: flex;
          gap: 10px;
          height: 150px;
          margin-top: 15px;
        }

        .vu-meter {
          flex: 1;
          background: rgba(0, 0, 0, 0.5);
          border-radius: 10px;
          position: relative;
          overflow: hidden;
        }

        .vu-meter-fill {
          position: absolute;
          bottom: 0;
          width: 100%;
          background: linear-gradient(to top, #00ff00 0%, #ffff00 50%, #ff0000 100%);
          transition: height 0.05s;
        }

        .vu-meter-label {
          position: absolute;
          bottom: 5px;
          width: 100%;
          text-align: center;
          font-size: 0.75rem;
          color: white;
          font-weight: 700;
          z-index: 1;
          text-shadow: 0 0 5px rgba(0, 0, 0, 0.8);
        }

        /* Effect Buttons */
        .effect-buttons {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }

        .effect-btn {
          padding: 15px;
          border: 2px solid rgba(0, 217, 255, 0.3);
          border-radius: 10px;
          background: rgba(0, 217, 255, 0.1);
          color: #00d9ff;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
          text-transform: uppercase;
          font-size: 0.85rem;
          letter-spacing: 0.5px;
        }

        .effect-btn:hover {
          background: rgba(0, 217, 255, 0.2);
          border-color: #00d9ff;
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0, 217, 255, 0.3);
        }

        .effect-btn.active {
          background: linear-gradient(135deg, #00d9ff 0%, #0099cc 100%);
          color: white;
          border-color: #00d9ff;
        }

        /* Stream Control Buttons */
        .stream-actions {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
          margin-top: 20px;
        }

        .action-btn {
          padding: 20px;
          border: none;
          border-radius: 15px;
          font-weight: 700;
          font-size: 1.1rem;
          cursor: pointer;
          transition: all 0.3s;
          text-transform: uppercase;
          letter-spacing: 1px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .action-btn.primary {
          background: linear-gradient(135deg, #00ff00 0%, #00cc00 100%);
          color: white;
          box-shadow: 0 10px 30px rgba(0, 255, 0, 0.3);
        }

        .action-btn.primary:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 15px 40px rgba(0, 255, 0, 0.5);
        }

        .action-btn.danger {
          background: linear-gradient(135deg, #ff4444 0%, #cc0000 100%);
          color: white;
          box-shadow: 0 10px 30px rgba(255, 68, 68, 0.3);
        }

        .action-btn.danger:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 40px rgba(255, 68, 68, 0.5);
        }

        .action-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none !important;
        }

        /* Input Fields */
        .input-group {
          margin-bottom: 15px;
        }

        .input-label {
          display: block;
          margin-bottom: 8px;
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.9rem;
          font-weight: 600;
        }

        .input-field {
          width: 100%;
          padding: 12px 15px;
          background: rgba(0, 0, 0, 0.5);
          border: 2px solid rgba(0, 217, 255, 0.3);
          border-radius: 10px;
          color: white;
          font-size: 0.95rem;
          transition: all 0.3s;
        }

        .input-field:focus {
          outline: none;
          border-color: #00d9ff;
          box-shadow: 0 0 15px rgba(0, 217, 255, 0.3);
        }

        .input-field::placeholder {
          color: rgba(255, 255, 255, 0.3);
        }

        .toggle-visibility {
          position: absolute;
          right: 15px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #00d9ff;
          cursor: pointer;
          font-size: 1.2rem;
        }

        .input-wrapper {
          position: relative;
        }

        /* Responsive */
        @media (max-width: 1200px) {
          .control-grid {
            grid-template-columns: 1fr;
          }

          .controls-section {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .dj-control {
            padding: 10px;
          }

          .panel-header {
            font-size: 1rem;
          }

          .action-btn {
            font-size: 0.95rem;
            padding: 15px;
          }

          .stream-actions {
            grid-template-columns: 1fr;
          }

          .overlay-display {
            font-size: 1rem;
            padding: 10px 20px;
          }
        }
      `}</style>

      {/* Main Control Grid */}
      <div className="control-grid">
        {/* Stream Preview */}
        <div className="stream-preview">
          {isStreaming && (
            <div className="live-indicator">
              <div className="live-dot"></div>
              LIVE
            </div>
          )}

          <div className="preview-placeholder">
            <div className="preview-icon">
              {streamStatus === 'live' ? '📡' : '🎧'}
            </div>
            <div className="preview-text">
              {streamStatus === 'live' ? 'Stream Preview' : 'Stream Offline'}
            </div>
            {streamStatus === 'connecting' && (
              <div className="preview-text">Connecting to server...</div>
            )}
          </div>

          {showOverlay && isStreaming && (
            <div className="overlay-display">{overlayText}</div>
          )}
        </div>

        {/* Stream Stats */}
        <div className="stats-panel">
          <div className="stats-header">Stream Status</div>

          <div className="stat-item">
            <span className="stat-label">Status</span>
            <span className={`status-badge ${streamStatus}`}>
              {streamStatus}
            </span>
          </div>

          <div className="stat-item">
            <span className="stat-label">Duration</span>
            <span className="stat-value">{stats.duration}</span>
          </div>

          <div className="stat-item">
            <span className="stat-label">FPS</span>
            <span className="stat-value">{stats.fps}</span>
          </div>

          <div className="stat-item">
            <span className="stat-label">Bitrate</span>
            <span className="stat-value">{stats.bitrate} kbps</span>
          </div>

          <div className="stat-item">
            <span className="stat-label">Viewers</span>
            <span className="stat-value">{stats.viewers}</span>
          </div>

          <div className="stat-item">
            <span className="stat-label">Stream</span>
            <span className={`stat-value ${stats.isLive ? 'live' : 'offline'}`}>
              {stats.isLive ? 'LIVE' : 'OFFLINE'}
            </span>
          </div>

          {/* Stream Actions */}
          <div className="stream-actions">
            {!isStreaming ? (
              <button
                className="action-btn primary"
                onClick={handleStartStream}
                disabled={streamStatus === 'connecting'}
                style={{ gridColumn: '1 / -1' }}
              >
                <span>▶️</span>
                {streamStatus === 'connecting' ? 'Connecting...' : 'Go Live'}
              </button>
            ) : (
              <button
                className="action-btn danger"
                onClick={handleStopStream}
                style={{ gridColumn: '1 / -1' }}
              >
                <span>⏹️</span>
                Stop Stream
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Controls Section */}
      <div className="controls-section">
        {/* Audio Mixer */}
        <div className="control-panel">
          <div className="panel-header">
            <span className="panel-icon">🎚️</span>
            Audio Mixer
          </div>

          <div className="mixer-control">
            <div className="mixer-label">
              <span>Master Volume</span>
              <span className="mixer-value">{masterVolume}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={masterVolume}
              onChange={(e) => setMasterVolume(Number(e.target.value))}
              className="slider"
            />
          </div>

          <div className="mixer-control">
            <div className="mixer-label">
              <span>Microphone</span>
              <span className="mixer-value">{micVolume}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={micVolume}
              onChange={(e) => setMicVolume(Number(e.target.value))}
              className="slider"
            />
          </div>

          <div className="mixer-control">
            <div className="mixer-label">
              <span>Music</span>
              <span className="mixer-value">{musicVolume}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={musicVolume}
              onChange={(e) => setMusicVolume(Number(e.target.value))}
              className="slider"
            />
          </div>

          {/* VU Meters */}
          <div className="vu-meters">
            <div className="vu-meter">
              <div
                className="vu-meter-fill"
                style={{ height: `${audioLevels.left}%` }}
              />
              <div className="vu-meter-label">L</div>
            </div>
            <div className="vu-meter">
              <div
                className="vu-meter-fill"
                style={{ height: `${audioLevels.right}%` }}
              />
              <div className="vu-meter-label">R</div>
            </div>
          </div>
        </div>

        {/* Visual Effects */}
        <div className="control-panel">
          <div className="panel-header">
            <span className="panel-icon">✨</span>
            Visual Effects
          </div>

          <div className="input-group">
            <label className="input-label">Overlay Text</label>
            <input
              type="text"
              value={overlayText}
              onChange={(e) => setOverlayText(e.target.value)}
              className="input-field"
              placeholder="Enter overlay text..."
            />
          </div>

          <div className="mixer-control">
            <div className="mixer-label">
              <span>Show Overlay</span>
            </div>
            <button
              className={`effect-btn ${showOverlay ? 'active' : ''}`}
              onClick={() => setShowOverlay(!showOverlay)}
              style={{ width: '100%' }}
            >
              {showOverlay ? 'ON' : 'OFF'}
            </button>
          </div>

          <div className="mixer-control">
            <div className="mixer-label">
              <span>Effects</span>
            </div>
            <div className="effect-buttons">
              <button
                className={`effect-btn ${visualEffect === 'pulse' ? 'active' : ''}`}
                onClick={() => setVisualEffect(visualEffect === 'pulse' ? 'none' : 'pulse')}
              >
                Pulse
              </button>
              <button
                className={`effect-btn ${visualEffect === 'rainbow' ? 'active' : ''}`}
                onClick={() => setVisualEffect(visualEffect === 'rainbow' ? 'none' : 'rainbow')}
              >
                Rainbow
              </button>
              <button
                className={`effect-btn ${visualEffect === 'strobe' ? 'active' : ''}`}
                onClick={() => setVisualEffect(visualEffect === 'strobe' ? 'none' : 'strobe')}
              >
                Strobe
              </button>
              <button
                className={`effect-btn ${visualEffect === 'none' ? 'active' : ''}`}
                onClick={() => setVisualEffect('none')}
              >
                None
              </button>
            </div>
          </div>
        </div>

        {/* Stream Configuration */}
        <div className="control-panel">
          <div className="panel-header">
            <span className="panel-icon">⚙️</span>
            Stream Config
          </div>

          <div className="input-group">
            <label className="input-label">Stream Key</label>
            <div className="input-wrapper">
              <input
                type={showStreamKey ? 'text' : 'password'}
                value={streamKey}
                onChange={(e) => setStreamKey(e.target.value)}
                className="input-field"
                placeholder="Enter stream key..."
                style={{ paddingRight: '45px' }}
              />
              <button
                className="toggle-visibility"
                onClick={() => setShowStreamKey(!showStreamKey)}
              >
                {showStreamKey ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <div className="mixer-control">
            <div className="mixer-label">
              <span>Target Bitrate</span>
              <span className="mixer-value">{targetBitrate} kbps</span>
            </div>
            <input
              type="range"
              min="500"
              max="6000"
              step="100"
              value={targetBitrate}
              onChange={(e) => setTargetBitrate(Number(e.target.value))}
              className="slider"
            />
          </div>

          <div className="input-group">
            <label className="input-label">RTMP Server</label>
            <input
              type="text"
              value="rtmp://66.51.126.59:1935/live"
              readOnly
              className="input-field"
              style={{ opacity: 0.7 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
