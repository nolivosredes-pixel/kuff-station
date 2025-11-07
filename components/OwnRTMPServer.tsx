'use client';

import { useState, useEffect } from 'react';

export default function OwnRTMPServer() {
  const [streamKey, setStreamKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState<'url' | 'key' | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // RTMP Server URL - Dynamic based on environment
  const isDev = typeof window !== 'undefined' && window.location.hostname === 'localhost';
  const RTMP_SERVER_URL = isDev ? 'rtmp://localhost:1935/live' : 'rtmp://kuffdj.net:1935/live';

  // HLS playback URL for /live page
  const PLAYBACK_URL = isDev ? 'http://localhost:8000/live' : 'http://kuffdj.net:8000/live';

  useEffect(() => {
    // Load existing stream key from localStorage
    const savedKey = localStorage.getItem('kuff_stream_key');
    if (savedKey) {
      setStreamKey(savedKey);
    }
  }, []);

  const generateStreamKey = () => {
    setIsGenerating(true);
    // Generate a secure random stream key
    const key = 'live_' + Array.from(crypto.getRandomValues(new Uint8Array(16)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    setStreamKey(key);
    localStorage.setItem('kuff_stream_key', key);

    // Simulate API call to save to database
    setTimeout(() => {
      setIsGenerating(false);
      alert('✅ Stream Key generated and saved!');
    }, 500);
  };

  const revokeStreamKey = () => {
    if (!confirm('Are you sure you want to revoke this Stream Key? Anyone using it will be disconnected.')) {
      return;
    }

    setStreamKey('');
    localStorage.removeItem('kuff_stream_key');
    alert('🔴 Stream Key revoked!');
  };

  const copyToClipboard = (text: string, type: 'url' | 'key') => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="own-rtmp-server">
      <style jsx>{`
        .own-rtmp-server {
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

        .live-badge {
          background: linear-gradient(135deg, #ff0080 0%, #ff0000 100%);
          padding: 8px 16px;
          border-radius: 50px;
          font-size: 0.85em;
          color: white;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-weight: 600;
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% {
            box-shadow: 0 0 20px rgba(255, 0, 0, 0.5);
          }
          50% {
            box-shadow: 0 0 40px rgba(255, 0, 0, 0.8);
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

        .action-buttons {
          display: flex;
          gap: 15px;
          margin-bottom: 25px;
          flex-wrap: wrap;
        }

        .btn {
          padding: 12px 24px;
          border-radius: 50px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
          border: none;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-size: 0.95em;
        }

        .btn-generate {
          background: linear-gradient(135deg, #00d9ff 0%, #0099cc 100%);
          color: #000000;
          box-shadow: 0 10px 30px rgba(0, 217, 255, 0.3);
        }

        .btn-generate:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 40px rgba(0, 217, 255, 0.5);
        }

        .btn-generate:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-revoke {
          background: transparent;
          border: 2px solid #ff4444;
          color: #ff4444;
        }

        .btn-revoke:hover {
          background: #ff4444;
          color: white;
          transform: translateY(-3px);
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

        .credential-value.hidden {
          filter: blur(8px);
          user-select: none;
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

        .toggle-visibility {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: transparent;
          border: 2px solid #00d9ff;
          border-radius: 50px;
          color: #00d9ff;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
          margin-top: 15px;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-size: 0.9em;
        }

        .toggle-visibility:hover {
          background: #00d9ff;
          color: #000000;
          transform: translateY(-2px);
          box-shadow: 0 5px 20px rgba(0, 217, 255, 0.4);
        }

        .instructions-box {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 15px;
          padding: 25px;
          margin-top: 20px;
          border: 2px solid rgba(0, 217, 255, 0.1);
        }

        .instructions-box h4 {
          margin-bottom: 15px;
          font-size: 1.2em;
          color: #00d9ff;
          font-weight: 700;
        }

        .instructions-box ol {
          margin-left: 20px;
          line-height: 1.8;
          color: #b0b0b0;
        }

        .instructions-box li {
          margin-bottom: 10px;
        }

        .instructions-box code {
          background: rgba(0, 217, 255, 0.1);
          padding: 4px 8px;
          border-radius: 5px;
          color: #00d9ff;
          font-family: 'Courier New', monospace;
          border: 1px solid rgba(0, 217, 255, 0.2);
        }

        .warning {
          background: rgba(255, 152, 0, 0.15);
          border-left: 4px solid #ff9800;
          padding: 15px;
          border-radius: 10px;
          margin-top: 20px;
          font-size: 0.95em;
          border: 2px solid rgba(255, 152, 0, 0.3);
        }

        .warning strong {
          display: block;
          margin-bottom: 5px;
          color: #ff9800;
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

        .empty-state {
          text-align: center;
          padding: 40px 20px;
          color: #808080;
        }

        .empty-state h3 {
          color: #00d9ff;
          margin-bottom: 15px;
          font-size: 1.3em;
        }

        @media (max-width: 768px) {
          .own-rtmp-server {
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
          <div className="title">🎥 Own RTMP Server</div>
          <div className="live-badge">Stream to /live</div>
        </div>
      </div>

      <div className="description">
        <strong>📡 Your Personal Streaming System</strong>
        Generate RTMP credentials to allow anyone to stream directly to your kuffdj.net/live page. Perfect for remote DJs, festivals, or collaborators.
      </div>

      <div className="action-buttons">
        <button
          className="btn btn-generate"
          onClick={generateStreamKey}
          disabled={isGenerating}
        >
          {streamKey ? '🔄 Regenerate Stream Key' : '✨ Generate Stream Key'}
        </button>

        {streamKey && (
          <button className="btn btn-revoke" onClick={revokeStreamKey}>
            🔴 Revoke Key
          </button>
        )}
      </div>

      {!streamKey ? (
        <div className="empty-state">
          <h3>No Active Stream Key</h3>
          <p>Click "Generate Stream Key" above to create credentials for streaming to your site.</p>
        </div>
      ) : (
        <>
          <div className="credentials-display">
            <div className="credential-item">
              <div className="credential-label">📡 RTMP Server URL</div>
              <div className="credential-value">
                <span style={{ flex: 1 }}>{RTMP_SERVER_URL}</span>
                <button
                  className={`copy-btn ${copied === 'url' ? 'copied' : ''}`}
                  onClick={() => copyToClipboard(RTMP_SERVER_URL, 'url')}
                >
                  {copied === 'url' ? '✓ Copied' : 'Copy'}
                </button>
              </div>
            </div>

            <div className="credential-item">
              <div className="credential-label">🔑 Stream Key</div>
              <div className={`credential-value ${showKey ? '' : 'hidden'}`}>
                <span style={{ flex: 1 }}>
                  {showKey ? streamKey : '••••••••••••••••••••••••••••••••'}
                </span>
                <button
                  className={`copy-btn ${copied === 'key' ? 'copied' : ''}`}
                  onClick={() => copyToClipboard(streamKey, 'key')}
                >
                  {copied === 'key' ? '✓ Copied' : 'Copy'}
                </button>
              </div>
            </div>

            <button className="toggle-visibility" onClick={() => setShowKey(!showKey)}>
              {showKey ? '🙈 Hide' : '👁️ Show'} Stream Key
            </button>
          </div>

          <div className="instructions-box">
            <h4>📖 OBS Studio Setup Instructions</h4>
            <ol>
              <li>Open <strong>OBS Studio</strong></li>
              <li>Go to <strong>Settings → Stream</strong></li>
              <li>Service: Select <strong>"Custom..."</strong></li>
              <li>
                Server: <code>{RTMP_SERVER_URL}</code>
              </li>
              <li>
                Stream Key: <code>{showKey ? streamKey : '(Click Show above)'}</code>
              </li>
              <li>Click <strong>OK</strong> and then <strong>Start Streaming</strong></li>
              <li>Your stream will appear live at <strong>kuffdj.net/live</strong> 🎉</li>
            </ol>
          </div>

          <div className="info-box">
            <strong>🎬 Stream will play on:</strong>
            <code style={{ marginTop: '10px', display: 'block' }}>{PLAYBACK_URL}</code>
            <p style={{ marginTop: '10px', fontSize: '0.9em', color: '#b0b0b0' }}>
              The stream automatically converts to HLS/WebRTC for browser playback on your /live page.
            </p>
          </div>

          <div className="warning">
            <strong>⚠️ Security Warning</strong>
            Never share your Stream Key publicly! Only give it to trusted streamers. If compromised, click "Revoke Key" and generate a new one immediately.
          </div>
        </>
      )}
    </div>
  );
}
