'use client';

import { useEffect, useState, useRef } from 'react';
import OBSWebSocket from 'obs-websocket-js';

interface StreamStats {
  isStreaming: boolean;
  isRecording: boolean;
  currentScene: string;
  fps: number;
  cpu: number;
  memory: number;
}

export default function LiveStream() {
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [stats, setStats] = useState<StreamStats>({
    isStreaming: false,
    isRecording: false,
    currentScene: '',
    fps: 0,
    cpu: 0,
    memory: 0
  });
  const [wsUrl, setWsUrl] = useState('ws://localhost:4455');
  const [password, setPassword] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const obsRef = useRef<OBSWebSocket | null>(null);

  useEffect(() => {
    obsRef.current = new OBSWebSocket();

    return () => {
      if (obsRef.current) {
        obsRef.current.disconnect();
      }
    };
  }, []);

  const connect = async () => {
    if (!obsRef.current) return;

    setConnecting(true);
    try {
      await obsRef.current.connect(wsUrl, password);
      setConnected(true);
      console.log('✅ Connected to OBS');

      // Setup event listeners
      obsRef.current.on('StreamStateChanged', (data: any) => {
        setStats(prev => ({ ...prev, isStreaming: data.outputActive }));
      });

      obsRef.current.on('RecordStateChanged', (data: any) => {
        setStats(prev => ({ ...prev, isRecording: data.outputActive }));
      });

      obsRef.current.on('CurrentProgramSceneChanged', (data: any) => {
        setStats(prev => ({ ...prev, currentScene: data.sceneName }));
      });

      // Get initial state
      updateStats();

      // Update stats every 2 seconds
      const interval = setInterval(updateStats, 2000);
      return () => clearInterval(interval);

    } catch (error) {
      console.error('❌ Connection failed:', error);
      alert('Failed to connect to OBS. Make sure OBS is running with WebSocket enabled.');
    } finally {
      setConnecting(false);
    }
  };

  const disconnect = () => {
    if (obsRef.current) {
      obsRef.current.disconnect();
      setConnected(false);
      console.log('🔌 Disconnected from OBS');
    }
  };

  const updateStats = async () => {
    if (!obsRef.current || !connected) return;

    try {
      const streamStatus = await obsRef.current.call('GetStreamStatus');
      const recordStatus = await obsRef.current.call('GetRecordStatus');
      const sceneInfo = await obsRef.current.call('GetCurrentProgramScene');
      const statsData = await obsRef.current.call('GetStats');

      setStats({
        isStreaming: streamStatus.outputActive,
        isRecording: recordStatus.outputActive,
        currentScene: sceneInfo.currentProgramSceneName,
        fps: Math.round(statsData.activeFps),
        cpu: Math.round(statsData.cpuUsage),
        memory: Math.round(statsData.memoryUsage)
      });
    } catch (error) {
      console.error('Error updating stats:', error);
    }
  };

  const startStream = async () => {
    if (!obsRef.current) return;
    try {
      await obsRef.current.call('StartStream');
      console.log('🔴 Stream started');
    } catch (error) {
      console.error('Error starting stream:', error);
    }
  };

  const stopStream = async () => {
    if (!obsRef.current) return;
    try {
      await obsRef.current.call('StopStream');
      console.log('⏹️  Stream stopped');
    } catch (error) {
      console.error('Error stopping stream:', error);
    }
  };

  return (
    <div className="live-stream-container">
      <style jsx>{`
        .live-stream-container {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 15px;
          padding: 30px;
          color: white;
          box-shadow: 0 10px 40px rgba(0,0,0,0.3);
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
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: bold;
          font-size: 0.9em;
        }

        .status-badge.disconnected {
          background: rgba(255, 107, 107, 0.9);
        }

        .status-badge.connected {
          background: rgba(81, 207, 102, 0.9);
        }

        .status-badge.connecting {
          background: rgba(255, 212, 59, 0.9);
          color: #333;
        }

        .live-indicator {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #ff4444;
          padding: 10px 20px;
          border-radius: 25px;
          font-weight: bold;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        .dot {
          width: 12px;
          height: 12px;
          background: white;
          border-radius: 50%;
          animation: blink 1s infinite;
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        .settings-panel {
          background: rgba(255, 255, 255, 0.1);
          padding: 20px;
          border-radius: 10px;
          margin-bottom: 20px;
        }

        .input-group {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          margin-bottom: 15px;
        }

        input {
          padding: 12px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.9);
          color: #333;
          font-size: 14px;
        }

        input:focus {
          outline: none;
          border-color: #fff;
        }

        button {
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s;
          font-size: 14px;
        }

        .btn-primary {
          background: #51cf66;
          color: white;
        }

        .btn-primary:hover {
          background: #40c057;
          transform: translateY(-2px);
        }

        .btn-secondary {
          background: rgba(255, 255, 255, 0.2);
          color: white;
        }

        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        .btn-danger {
          background: #ff6b6b;
          color: white;
        }

        .btn-danger:hover {
          background: #ff5252;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
          margin-top: 20px;
        }

        .stat-card {
          background: rgba(255, 255, 255, 0.1);
          padding: 20px;
          border-radius: 10px;
          text-align: center;
        }

        .stat-label {
          font-size: 0.9em;
          opacity: 0.8;
          margin-bottom: 5px;
        }

        .stat-value {
          font-size: 2em;
          font-weight: bold;
        }

        .controls {
          display: flex;
          gap: 10px;
          margin-top: 20px;
        }

        .iframe-container {
          margin-top: 20px;
          border-radius: 10px;
          overflow: hidden;
          background: rgba(0, 0, 0, 0.3);
          aspect-ratio: 16/9;
        }

        iframe {
          width: 100%;
          height: 100%;
          border: none;
        }
      `}</style>

      <div className="header">
        <div className="title">
          🎬 Live Stream Control
        </div>
        {stats.isStreaming && (
          <div className="live-indicator">
            <span className="dot"></span>
            LIVE NOW
          </div>
        )}
      </div>

      {!connected ? (
        <div className="settings-panel">
          <div
            className={`status-badge ${connecting ? 'connecting' : 'disconnected'}`}
          >
            {connecting ? '⏳ Connecting...' : '🔴 Disconnected'}
          </div>

          <div className="input-group" style={{marginTop: '20px'}}>
            <input
              type="text"
              value={wsUrl}
              onChange={(e) => setWsUrl(e.target.value)}
              placeholder="WebSocket URL (ws://localhost:4455)"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password (optional)"
            />
          </div>

          <button
            className="btn-primary"
            onClick={connect}
            disabled={connecting}
          >
            {connecting ? 'Connecting...' : '🔌 Connect to OBS'}
          </button>

          <div style={{marginTop: '20px', opacity: 0.8, fontSize: '0.9em'}}>
            <p><strong>⚠️ Make sure OBS Studio is running with WebSocket enabled!</strong></p>
            <p style={{marginTop: '10px'}}>
              Go to: <strong>OBS → Tools → obs-websocket Settings</strong>
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="status-badge connected">
            ✅ Connected to OBS
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-label">Current Scene</div>
              <div className="stat-value" style={{fontSize: '1.2em'}}>
                {stats.currentScene || 'N/A'}
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-label">FPS</div>
              <div className="stat-value">{stats.fps}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">CPU Usage</div>
              <div className="stat-value">{stats.cpu}%</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Memory</div>
              <div className="stat-value">{stats.memory} MB</div>
            </div>
          </div>

          <div className="controls">
            {!stats.isStreaming ? (
              <button className="btn-primary" onClick={startStream}>
                🔴 Start Stream
              </button>
            ) : (
              <button className="btn-danger" onClick={stopStream}>
                ⏹️ Stop Stream
              </button>
            )}
            <button className="btn-secondary" onClick={disconnect}>
              🔌 Disconnect
            </button>
          </div>

          {stats.isStreaming && (
            <div className="iframe-container">
              <p style={{textAlign: 'center', paddingTop: '40%', opacity: 0.6}}>
                Stream player will appear here<br/>
                (Configure your stream URL above)
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
