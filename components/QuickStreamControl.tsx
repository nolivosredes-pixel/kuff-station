'use client';

import { useEffect, useState } from 'react';

interface StreamingStatus {
  isLive: boolean;
  platform: string | null;
  streamUrl: string | null;
  embedUrl: string | null;
  startedAt: string | null;
  title: string;
  description: string;
  streamType?: 'own' | 'external';
}

export default function QuickStreamControl() {
  const [streamingStatus, setStreamingStatus] = useState<StreamingStatus | null>(null);
  const [loading, setLoading] = useState(true);

  // Quick Stream Form
  const [streamUrl, setStreamUrl] = useState('');
  const [streamTitle, setStreamTitle] = useState('KUFF Live at Festival');
  const [streamDescription, setStreamDescription] = useState('Watch KUFF perform live!');
  const [platform, setPlatform] = useState('youtube');
  const [showQuickForm, setShowQuickForm] = useState(false);

  useEffect(() => {
    fetchStreamingStatus();
  }, []);

  const fetchStreamingStatus = async () => {
    try {
      const response = await fetch('/api/streaming/status');
      const data = await response.json();
      setStreamingStatus(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching streaming status:', error);
      setLoading(false);
    }
  };

  const extractVideoId = (url: string, platform: string): string | null => {
    try {
      if (platform === 'youtube') {
        // Extract from various YouTube URL formats
        const regexes = [
          /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/,
          /youtube\.com\/embed\/([^&\s]+)/,
          /youtube\.com\/live\/([^&\s]+)/,
        ];
        for (const regex of regexes) {
          const match = url.match(regex);
          if (match) return match[1];
        }
      } else if (platform === 'twitch') {
        // Extract Twitch channel name
        const match = url.match(/twitch\.tv\/([^\/\s]+)/);
        return match ? match[1] : null;
      } else if (platform === 'facebook') {
        // Return full URL for Facebook
        return url;
      }
    } catch (error) {
      console.error('Error extracting video ID:', error);
    }
    return null;
  };

  const getEmbedUrl = (videoId: string, platform: string): string => {
    const embedUrls: Record<string, string> = {
      youtube: `https://www.youtube.com/embed/${videoId}?autoplay=1`,
      twitch: `https://player.twitch.tv/?channel=${videoId}&parent=${window.location.hostname}`,
      facebook: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(videoId)}&show_text=false&autoplay=true`,
    };
    return embedUrls[platform] || '';
  };

  const getStreamUrl = (videoId: string, platform: string): string => {
    const streamUrls: Record<string, string> = {
      youtube: `https://www.youtube.com/watch?v=${videoId}`,
      twitch: `https://www.twitch.tv/${videoId}`,
      facebook: videoId,
    };
    return streamUrls[platform] || '';
  };

  const goLiveExternal = async () => {
    if (!streamUrl.trim()) {
      alert('Please enter a stream URL');
      return;
    }

    try {
      const videoId = extractVideoId(streamUrl, platform);
      if (!videoId) {
        alert('Invalid URL format. Please enter a valid ' + platform + ' URL.');
        return;
      }

      const embedUrl = getEmbedUrl(videoId, platform);
      const finalStreamUrl = getStreamUrl(videoId, platform);

      const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'afro2025';
      const response = await fetch('/api/streaming/status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminPassword}`,
        },
        body: JSON.stringify({
          isLive: true,
          platform,
          streamUrl: finalStreamUrl,
          embedUrl,
          title: streamTitle,
          description: streamDescription,
          streamType: 'external',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      const data = await response.json();
      setStreamingStatus(data);
      setShowQuickForm(false);
      setStreamUrl('');

      alert('✅ Stream is now LIVE on your website!');
    } catch (error: any) {
      console.error('Error going live:', error);
      alert('Error: ' + error.message);
    }
  };

  const goOffline = async () => {
    if (!confirm('Are you sure you want to stop the stream?')) return;

    try {
      const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'afro2025';
      const response = await fetch('/api/streaming/status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminPassword}`,
        },
        body: JSON.stringify({
          isLive: false,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      const data = await response.json();
      setStreamingStatus(data);

      alert('✅ Stream is now OFFLINE');
    } catch (error: any) {
      console.error('Error going offline:', error);
      alert('Error: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="quick-stream-control">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="quick-stream-control">
      <style jsx>{`
        .quick-stream-control {
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
          justify-content: space-between;
          align-items: center;
          margin-bottom: 25px;
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
          font-size: 1em;
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

        .info-box {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 15px;
          padding: 20px;
          margin-bottom: 20px;
          border: 2px solid rgba(0, 217, 255, 0.15);
        }

        .info-box h3 {
          font-size: 1.2em;
          margin-bottom: 10px;
          color: #00d9ff;
          font-weight: 600;
        }

        .info-box p {
          opacity: 0.9;
          line-height: 1.6;
          color: #b0b0b0;
        }

        .stream-info {
          display: flex;
          gap: 15px;
          margin-top: 15px;
        }

        .info-item {
          flex: 1;
        }

        .info-label {
          font-size: 0.85em;
          color: #808080;
          margin-bottom: 5px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .info-value {
          font-size: 1.1em;
          font-weight: bold;
          color: #00d9ff;
        }

        .buttons {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
        }

        .btn {
          padding: 15px 25px;
          border: none;
          border-radius: 50px;
          font-weight: 700;
          font-size: 1em;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
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

        /* Quick Form */
        .quick-form {
          background: rgba(0, 0, 0, 0.4);
          border-radius: 15px;
          padding: 25px;
          margin-top: 20px;
          border: 2px solid rgba(0, 217, 255, 0.1);
        }

        .form-header {
          font-size: 1.4em;
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
          font-size: 0.95em;
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
          font-size: 1em;
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

        .form-group input::placeholder,
        .form-group textarea::placeholder {
          color: #666;
        }

        .form-group textarea {
          min-height: 80px;
          resize: vertical;
        }

        .help-text {
          font-size: 0.85em;
          color: #808080;
          margin-top: 5px;
          font-style: italic;
        }

        .form-buttons {
          display: flex;
          gap: 10px;
          margin-top: 20px;
        }

        .loading {
          text-align: center;
          padding: 20px;
          font-size: 1.2em;
          color: #00d9ff;
        }

        @media (max-width: 768px) {
          .quick-stream-control {
            padding: 20px;
          }

          .header {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }

          .buttons {
            grid-template-columns: 1fr;
          }

          .stream-info {
            flex-direction: column;
          }
        }
      `}</style>

      <div className="header">
        <div className="title">🎥 Quick Stream Control</div>
        <div className={`status-badge ${streamingStatus?.isLive ? 'live' : 'offline'}`}>
          {streamingStatus?.isLive ? '🔴 LIVE' : '⚫ OFFLINE'}
        </div>
      </div>

      {streamingStatus?.isLive ? (
        <>
          <div className="info-box">
            <h3>📡 Currently Streaming</h3>
            <div className="stream-info">
              <div className="info-item">
                <div className="info-label">Platform</div>
                <div className="info-value">{streamingStatus.platform?.toUpperCase()}</div>
              </div>
              <div className="info-item">
                <div className="info-label">Type</div>
                <div className="info-value">
                  {streamingStatus.streamType === 'external' ? 'External Stream' : 'Own Stream'}
                </div>
              </div>
              <div className="info-item">
                <div className="info-label">Started</div>
                <div className="info-value">
                  {streamingStatus.startedAt
                    ? new Date(streamingStatus.startedAt).toLocaleTimeString()
                    : 'N/A'}
                </div>
              </div>
            </div>
            <div style={{ marginTop: '15px' }}>
              <div className="info-label">Title</div>
              <div className="info-value">{streamingStatus.title}</div>
            </div>
            {streamingStatus.streamUrl && (
              <div style={{ marginTop: '10px' }}>
                <a
                  href={streamingStatus.streamUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'white', textDecoration: 'underline' }}
                >
                  View on {streamingStatus.platform} →
                </a>
              </div>
            )}
          </div>

          <div className="buttons">
            <button className="btn btn-danger" onClick={goOffline}>
              ⏹️ Stop Stream
            </button>
            <a
              href="/live"
              target="_blank"
              className="btn btn-secondary"
              style={{ textDecoration: 'none' }}
            >
              👁️ View Public Page
            </a>
          </div>
        </>
      ) : (
        <>
          <div className="info-box">
            <h3>🎬 Stream Options</h3>
            <p>
              <strong>Quick Mode:</strong> Perfect for festivals and events! Just paste the stream URL from YouTube, Twitch, or Facebook.
            </p>
            <p style={{ marginTop: '10px' }}>
              <strong>Advanced Mode:</strong> Use the streaming control below to broadcast your own content with OBS.
            </p>
          </div>

          {!showQuickForm ? (
            <div className="buttons">
              <button className="btn btn-primary" onClick={() => setShowQuickForm(true)}>
                🚀 Quick Go Live (External Stream)
              </button>
            </div>
          ) : (
            <div className="quick-form">
              <div className="form-header">🚀 Go Live with External Stream</div>

              <div className="form-group">
                <label>Platform</label>
                <select value={platform} onChange={(e) => setPlatform(e.target.value)}>
                  <option value="youtube">YouTube</option>
                  <option value="twitch">Twitch</option>
                  <option value="facebook">Facebook</option>
                </select>
                <div className="help-text">
                  Select the platform where the stream is hosted
                </div>
              </div>

              <div className="form-group">
                <label>Stream URL *</label>
                <input
                  type="text"
                  value={streamUrl}
                  onChange={(e) => setStreamUrl(e.target.value)}
                  placeholder={
                    platform === 'youtube'
                      ? 'https://www.youtube.com/watch?v=xxxxx or https://youtu.be/xxxxx'
                      : platform === 'twitch'
                      ? 'https://www.twitch.tv/channelname'
                      : 'https://www.facebook.com/video/url'
                  }
                />
                <div className="help-text">
                  Paste the full URL of the stream (from festival production, venue, etc.)
                </div>
              </div>

              <div className="form-group">
                <label>Stream Title</label>
                <input
                  type="text"
                  value={streamTitle}
                  onChange={(e) => setStreamTitle(e.target.value)}
                  placeholder="KUFF Live at Festival"
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={streamDescription}
                  onChange={(e) => setStreamDescription(e.target.value)}
                  placeholder="Watch KUFF perform live at..."
                />
              </div>

              <div className="form-buttons">
                <button className="btn btn-primary" onClick={goLiveExternal}>
                  ✅ Go Live Now
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowQuickForm(false);
                    setStreamUrl('');
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
