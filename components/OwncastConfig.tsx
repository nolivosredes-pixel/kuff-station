'use client';

import { useState, useEffect } from 'react';

interface OwncastStatus {
  online: boolean;
  viewerCount?: number;
  streamTitle?: string;
  serverUrl?: string;
  hlsUrl?: string;
}

export default function OwncastConfig() {
  const [status, setStatus] = useState<OwncastStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<'url' | 'hls' | null>(null);

  // Get Owncast URLs from environment (set by admin)
  const OWNCAST_SERVER_URL = process.env.NEXT_PUBLIC_OWNCAST_SERVER_URL;
  const OWNCAST_RTMP_URL = process.env.NEXT_PUBLIC_OWNCAST_RTMP_URL;
  const OWNCAST_STREAM_KEY = process.env.NEXT_PUBLIC_OWNCAST_STREAM_KEY;

  useEffect(() => {
    fetchOwncastStatus();
    const interval = setInterval(fetchOwncastStatus, 10000); // Poll every 10s
    return () => clearInterval(interval);
  }, []);

  const fetchOwncastStatus = async () => {
    try {
      const response = await fetch('/api/owncast/status');
      const data = await response.json();
      setStatus(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching Owncast status:', error);
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, type: 'url' | 'hls') => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  if (loading) {
    return (
      <div className="owncast-config">
        <style jsx>{`
          .owncast-config {
            background: rgba(26, 26, 26, 0.8);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 30px;
            color: white;
            margin-bottom: 20px;
            border: 2px solid rgba(0, 217, 255, 0.2);
            text-align: center;
          }
        `}</style>
        <p>Loading Owncast status...</p>
      </div>
    );
  }

  if (!status || status.error) {
    return (
      <div className="owncast-config">
        <style jsx>{`
          .owncast-config {
            background: rgba(26, 26, 26, 0.8);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 30px;
            color: white;
            margin-bottom: 20px;
            border: 2px solid rgba(255, 152, 0, 0.3);
          }

          .warning {
            background: rgba(255, 152, 0, 0.15);
            border-left: 4px solid #ff9800;
            padding: 15px;
            border-radius: 10px;
            margin-top: 15px;
          }

          .warning strong {
            display: block;
            margin-bottom: 10px;
            color: #ff9800;
          }

          .code {
            background: rgba(0, 0, 0, 0.4);
            padding: 10px;
            border-radius: 5px;
            font-family: 'Courier New', monospace;
            margin: 10px 0;
          }
        `}</style>

        <h3>Owncast Not Configured</h3>
        <div className="warning">
          <strong>⚠️ Configuration Required</strong>
          <p>To enable Owncast integration, add these environment variables to your .env file:</p>
          <div className="code">
            OWNCAST_SERVER_URL=https://stream.kuffdj.net<br/>
            OWNCAST_RTMP_URL=rtmp://stream.kuffdj.net:1935<br/>
            OWNCAST_STREAM_KEY=your-stream-key
          </div>
          <p style={{ marginTop: '15px', fontSize: '0.9em' }}>
            See <strong>OWNCAST_INTEGRATION.md</strong> for full setup instructions.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="owncast-config">
      <style jsx>{`
        .owncast-config {
          background: rgba(26, 26, 26, 0.8);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 30px;
          color: white;
          margin-bottom: 20px;
          border: 2px solid rgba(0, 217, 255, 0.2);
          box-shadow: 0 20px 60px rgba(0, 217, 255, 0.1);
          font-family: 'Montserrat', sans-serif;
        }

        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 25px;
          flex-wrap: wrap;
          gap: 15px;
        }

        .title-section {
          display: flex;
          align-items: center;
          gap: 15px;
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
          padding: 8px 16px;
          border-radius: 50px;
          font-size: 0.85em;
          color: white;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-weight: 600;
        }

        .status-badge.online {
          background: linear-gradient(135deg, #51cf66 0%, #37b24d 100%);
          animation: pulse 2s ease-in-out infinite;
        }

        .status-badge.offline {
          background: linear-gradient(135deg, #868e96 0%, #495057 100%);
        }

        @keyframes pulse {
          0%, 100% {
            box-shadow: 0 0 20px rgba(81, 207, 102, 0.5);
          }
          50% {
            box-shadow: 0 0 40px rgba(81, 207, 102, 0.8);
          }
        }

        .description {
          background: rgba(0, 0, 0, 0.3);
          border-left: 4px solid #00d9ff;
          padding: 15px;
          border-radius: 10px;
          margin-bottom: 25px;
          line-height: 1.6;
        }

        .description strong {
          display: block;
          margin-bottom: 8px;
          font-size: 1.1em;
          color: #00d9ff;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 15px;
          margin-bottom: 25px;
        }

        .stat-card {
          background: rgba(0, 0, 0, 0.3);
          padding: 15px;
          border-radius: 10px;
          text-align: center;
          border: 2px solid rgba(0, 217, 255, 0.1);
        }

        .stat-label {
          font-size: 0.85em;
          color: #00d9ff;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 8px;
        }

        .stat-value {
          font-size: 1.5em;
          font-weight: 700;
          color: white;
        }

        .credentials-display {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 15px;
          padding: 25px;
          margin-bottom: 20px;
          border: 2px solid rgba(0, 217, 255, 0.2);
        }

        .credential-item {
          margin-bottom: 20px;
        }

        .credential-item:last-child {
          margin-bottom: 0;
        }

        .credential-label {
          font-size: 0.9em;
          font-weight: bold;
          margin-bottom: 8px;
          color: #00d9ff;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .credential-value {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(0, 0, 0, 0.4);
          padding: 15px;
          border-radius: 10px;
          font-family: 'Courier New', monospace;
          font-size: 0.95em;
          word-break: break-all;
          border: 2px solid rgba(0, 217, 255, 0.1);
        }

        .copy-btn {
          padding: 8px 16px;
          background: transparent;
          border: 2px solid #00d9ff;
          border-radius: 50px;
          color: #00d9ff;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
          white-space: nowrap;
          font-size: 0.85em;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .copy-btn:hover {
          background: #00d9ff;
          color: #000000;
          transform: translateY(-2px);
          box-shadow: 0 5px 20px rgba(0, 217, 255, 0.4);
        }

        .copy-btn.copied {
          background: #51cf66;
          border-color: #51cf66;
          color: white;
        }

        .info-box {
          background: rgba(0, 217, 255, 0.1);
          border-left: 4px solid #00d9ff;
          padding: 15px;
          border-radius: 10px;
          margin-top: 20px;
          border: 2px solid rgba(0, 217, 255, 0.2);
        }

        .info-box strong {
          display: block;
          margin-bottom: 5px;
          color: #00d9ff;
        }

        @media (max-width: 768px) {
          .owncast-config {
            padding: 20px;
          }

          .header {
            flex-direction: column;
            align-items: flex-start;
          }

          .credential-value {
            flex-direction: column;
            align-items: stretch;
          }

          .copy-btn {
            width: 100%;
          }
        }
      `}</style>

      <div className="header">
        <div className="title-section">
          <div className="title">🎥 Owncast Server</div>
          <div className={`status-badge ${status.online ? 'online' : 'offline'}`}>
            {status.online ? '🔴 LIVE' : '⚫ OFFLINE'}
          </div>
        </div>
      </div>

      <div className="description">
        <strong>📡 Your Owncast Streaming Server</strong>
        {status.online ? (
          <p>Your Owncast server is currently streaming live! The stream is automatically displayed on kuffdj.net/live.</p>
        ) : (
          <p>Your Owncast server is configured but currently offline. Start streaming to make it appear on kuffdj.net/live.</p>
        )}
      </div>

      {status.online && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Status</div>
            <div className="stat-value">LIVE</div>
          </div>
          {status.viewerCount !== undefined && (
            <div className="stat-card">
              <div className="stat-label">Viewers</div>
              <div className="stat-value">{status.viewerCount}</div>
            </div>
          )}
          {status.streamTitle && (
            <div className="stat-card">
              <div className="stat-label">Stream Title</div>
              <div className="stat-value" style={{ fontSize: '1em' }}>{status.streamTitle}</div>
            </div>
          )}
        </div>
      )}

      <div className="credentials-display">
        {status.serverUrl && (
          <div className="credential-item">
            <div className="credential-label">🌐 Owncast Dashboard</div>
            <div className="credential-value">
              <span style={{ flex: 1 }}>{status.serverUrl}</span>
              <button
                className={`copy-btn ${copied === 'url' ? 'copied' : ''}`}
                onClick={() => copyToClipboard(status.serverUrl!, 'url')}
              >
                {copied === 'url' ? '✓ Copied' : 'Copy'}
              </button>
            </div>
          </div>
        )}

        {status.hlsUrl && (
          <div className="credential-item">
            <div className="credential-label">📺 HLS Stream URL</div>
            <div className="credential-value">
              <span style={{ flex: 1 }}>{status.hlsUrl}</span>
              <button
                className={`copy-btn ${copied === 'hls' ? 'copied' : ''}`}
                onClick={() => copyToClipboard(status.hlsUrl!, 'hls')}
              >
                {copied === 'hls' ? '✓ Copied' : 'Copy'}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="info-box">
        <strong>ℹ️ How It Works</strong>
        <p>
          When you stream to your Owncast server, it automatically appears on <strong>kuffdj.net/live</strong>.
          The KUFF website checks your Owncast server every 10 seconds for live status.
        </p>
        <p style={{ marginTop: '10px' }}>
          To configure RTMP settings or manage your stream, visit your Owncast admin dashboard at <strong>{status.serverUrl}/admin</strong>
        </p>
      </div>
    </div>
  );
}
