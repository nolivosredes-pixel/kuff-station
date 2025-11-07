'use client';

import { useState } from 'react';

const RTMP_SERVERS: Record<string, { url: string; instructions: string }> = {
  youtube: {
    url: 'rtmp://a.rtmp.youtube.com/live2',
    instructions: 'Get your Stream Key from YouTube Studio → Go Live → Stream Settings',
  },
  twitch: {
    url: 'rtmp://live.twitch.tv/app',
    instructions: 'Get your Stream Key from Twitch Dashboard → Settings → Stream',
  },
  facebook: {
    url: 'rtmps://live-api-s.facebook.com:443/rtmp',
    instructions: 'Get your Stream Key from Facebook Live Producer',
  },
  custom: {
    url: '',
    instructions: 'Enter your custom RTMP server URL',
  },
};

export default function RTMPCredentials() {
  const [platform, setPlatform] = useState<'youtube' | 'twitch' | 'facebook' | 'custom'>('youtube');
  const [streamKey, setStreamKey] = useState('');
  const [customRtmpUrl, setCustomRtmpUrl] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState<'url' | 'key' | null>(null);

  const rtmpUrl = platform === 'custom' ? customRtmpUrl : RTMP_SERVERS[platform].url;

  const copyToClipboard = (text: string, type: 'url' | 'key') => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="rtmp-credentials">
      <style jsx>{`
        .rtmp-credentials {
          background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
          border-radius: 15px;
          padding: 30px;
          color: white;
          margin-bottom: 20px;
        }

        .header {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 25px;
        }

        .title {
          font-size: 1.8em;
          font-weight: bold;
        }

        .info-badge {
          background: rgba(255, 255, 255, 0.2);
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 0.85em;
        }

        .description {
          background: rgba(0, 0, 0, 0.2);
          border-left: 4px solid rgba(255, 255, 255, 0.5);
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 25px;
          line-height: 1.6;
        }

        .description strong {
          display: block;
          margin-bottom: 8px;
          font-size: 1.1em;
        }

        .form-section {
          background: rgba(0, 0, 0, 0.15);
          border-radius: 10px;
          padding: 25px;
          margin-bottom: 20px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group:last-child {
          margin-bottom: 0;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: bold;
          font-size: 0.95em;
        }

        .form-group select,
        .form-group input {
          width: 100%;
          padding: 12px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.1);
          color: white;
          font-size: 1em;
          font-family: 'Courier New', monospace;
        }

        .form-group input::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }

        .help-text {
          font-size: 0.85em;
          opacity: 0.8;
          margin-top: 5px;
          font-style: italic;
        }

        .credentials-display {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 10px;
          padding: 20px;
          margin-top: 20px;
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
          opacity: 0.9;
        }

        .credential-value {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(0, 0, 0, 0.4);
          padding: 12px;
          border-radius: 8px;
          font-family: 'Courier New', monospace;
          font-size: 0.95em;
          word-break: break-all;
        }

        .credential-value.hidden {
          filter: blur(8px);
          user-select: none;
        }

        .copy-btn {
          padding: 8px 16px;
          background: rgba(255, 255, 255, 0.2);
          border: none;
          border-radius: 6px;
          color: white;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s;
          white-space: nowrap;
          font-size: 0.9em;
        }

        .copy-btn:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        .copy-btn.copied {
          background: #51cf66;
        }

        .toggle-visibility {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: rgba(255, 255, 255, 0.15);
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 8px;
          color: white;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s;
          margin-top: 15px;
        }

        .toggle-visibility:hover {
          background: rgba(255, 255, 255, 0.25);
        }

        .instructions-box {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          padding: 20px;
          margin-top: 20px;
        }

        .instructions-box h4 {
          margin-bottom: 15px;
          font-size: 1.1em;
        }

        .instructions-box ol {
          margin-left: 20px;
          line-height: 1.8;
        }

        .instructions-box li {
          margin-bottom: 8px;
        }

        .warning {
          background: rgba(255, 152, 0, 0.2);
          border-left: 4px solid #ff9800;
          padding: 15px;
          border-radius: 8px;
          margin-top: 20px;
          font-size: 0.95em;
        }

        .warning strong {
          display: block;
          margin-bottom: 5px;
        }

        @media (max-width: 768px) {
          .rtmp-credentials {
            padding: 20px;
          }

          .header {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
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
        <div className="title">🎬 RTMP Credentials</div>
        <div className="info-badge">For Festival/Venue Production</div>
      </div>

      <div className="description">
        <strong>📋 How it works:</strong>
        Give these credentials to the festival/venue production team. They will configure their encoder (OBS, vMix, hardware encoder) with these settings to stream directly to your channel.
      </div>

      <div className="form-section">
        <div className="form-group">
          <label>Platform / Destination</label>
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value as any)}
          >
            <option value="youtube">YouTube Live</option>
            <option value="twitch">Twitch</option>
            <option value="facebook">Facebook Live</option>
            <option value="custom">Custom RTMP Server</option>
          </select>
        </div>

        {platform === 'custom' && (
          <div className="form-group">
            <label>Custom RTMP Server URL</label>
            <input
              type="text"
              value={customRtmpUrl}
              onChange={(e) => setCustomRtmpUrl(e.target.value)}
              placeholder="rtmp://your-server.com/live"
            />
          </div>
        )}

        <div className="form-group">
          <label>Your Stream Key</label>
          <input
            type={showKey ? 'text' : 'password'}
            value={streamKey}
            onChange={(e) => setStreamKey(e.target.value)}
            placeholder="Enter your stream key from platform"
          />
          <div className="help-text">
            {RTMP_SERVERS[platform].instructions}
          </div>
        </div>
      </div>

      {streamKey && (
        <>
          <div className="credentials-display">
            <div className="credential-item">
              <div className="credential-label">📡 RTMP Server URL:</div>
              <div className="credential-value">
                <span style={{ flex: 1 }}>{rtmpUrl || 'Enter RTMP URL above'}</span>
                {rtmpUrl && (
                  <button
                    className={`copy-btn ${copied === 'url' ? 'copied' : ''}`}
                    onClick={() => copyToClipboard(rtmpUrl, 'url')}
                  >
                    {copied === 'url' ? '✓ Copied' : 'Copy'}
                  </button>
                )}
              </div>
            </div>

            <div className="credential-item">
              <div className="credential-label">🔑 Stream Key:</div>
              <div className={`credential-value ${showKey ? '' : 'hidden'}`}>
                <span style={{ flex: 1 }}>
                  {showKey ? streamKey : '••••••••••••••••••••'}
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
            <h4>📖 Instructions for Production Team:</h4>
            <ol>
              <li><strong>Open your encoder</strong> (OBS, vMix, hardware encoder, etc.)</li>
              <li><strong>Go to streaming settings</strong></li>
              <li><strong>Select "Custom" or "RTMP"</strong> as streaming service</li>
              <li>
                <strong>Enter RTMP URL:</strong><br />
                <code style={{ background: 'rgba(0,0,0,0.3)', padding: '4px 8px', borderRadius: '4px' }}>
                  {rtmpUrl}
                </code>
              </li>
              <li>
                <strong>Enter Stream Key:</strong><br />
                <code style={{ background: 'rgba(0,0,0,0.3)', padding: '4px 8px', borderRadius: '4px' }}>
                  {showKey ? streamKey : '(Hidden - click Show above)'}
                </code>
              </li>
              <li><strong>Start streaming</strong> from your encoder</li>
              <li>The stream will appear on <strong>your {platform} channel</strong></li>
            </ol>
          </div>

          <div className="warning">
            <strong>⚠️ Security Warning:</strong>
            Never share your Stream Key publicly. Only give it to trusted production teams. If compromised, regenerate it immediately from your {platform} dashboard.
          </div>
        </>
      )}
    </div>
  );
}
