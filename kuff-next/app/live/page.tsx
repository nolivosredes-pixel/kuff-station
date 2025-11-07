'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface StreamingStatus {
  isLive: boolean;
  platform: string | null;
  streamUrl: string | null;
  embedUrl: string | null;
  startedAt: string | null;
  title: string;
  description: string;
}

export default function LivePage() {
  const [status, setStatus] = useState<StreamingStatus>({
    isLive: false,
    platform: null,
    streamUrl: null,
    embedUrl: null,
    startedAt: null,
    title: 'KUFF Live Stream',
    description: 'Watch KUFF perform live!',
  });
  const [loading, setLoading] = useState(true);

  // Fetch streaming status
  const fetchStatus = async () => {
    try {
      const response = await fetch('/api/streaming/status');
      const data = await response.json();
      setStatus(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching streaming status:', error);
      setLoading(false);
    }
  };

  // Poll for status updates every 5 seconds
  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="live-page loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="live-page">
      <style jsx>{`
        .live-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 20px;
          position: relative;
          overflow: hidden;
        }

        .live-page.loading {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .spinner {
          width: 60px;
          height: 60px;
          border: 4px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Offline State */
        .offline-container {
          text-align: center;
          z-index: 10;
        }

        .logo-container {
          position: relative;
          width: 400px;
          height: 400px;
          margin: 0 auto 40px;
        }

        .logo-glow {
          position: absolute;
          inset: -20px;
          background: radial-gradient(circle, rgba(145, 71, 255, 0.4) 0%, transparent 70%);
          border-radius: 50%;
          animation: pulse 3s ease-in-out infinite;
        }

        .logo-circle {
          position: absolute;
          inset: 0;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          animation: rotate 20s linear infinite;
        }

        .logo-circle::before {
          content: '';
          position: absolute;
          top: -3px;
          left: 50%;
          width: 6px;
          height: 6px;
          background: white;
          border-radius: 50%;
          box-shadow: 0 0 20px rgba(255, 255, 255, 0.8);
        }

        .logo-image {
          position: relative;
          z-index: 2;
          animation: float 4s ease-in-out infinite;
          filter: drop-shadow(0 10px 30px rgba(0, 0, 0, 0.3));
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 0.6;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.1);
          }
        }

        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        .offline-text {
          color: white;
          margin-bottom: 30px;
        }

        .offline-text h1 {
          font-size: 3em;
          font-weight: bold;
          margin-bottom: 15px;
          text-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        }

        .offline-text p {
          font-size: 1.3em;
          opacity: 0.9;
          margin-bottom: 10px;
        }

        .social-links {
          display: flex;
          gap: 20px;
          justify-content: center;
          margin-top: 40px;
        }

        .social-link {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 24px;
          background: rgba(255, 255, 255, 0.2);
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50px;
          color: white;
          text-decoration: none;
          font-weight: bold;
          transition: all 0.3s;
          backdrop-filter: blur(10px);
        }

        .social-link:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }

        /* Online State */
        .online-container {
          width: 100%;
          max-width: 1400px;
          z-index: 10;
        }

        .live-header {
          text-align: center;
          margin-bottom: 30px;
          animation: slideDown 0.5s ease-out;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .live-badge {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: #ff0000;
          padding: 12px 30px;
          border-radius: 50px;
          font-size: 1.5em;
          font-weight: bold;
          color: white;
          margin-bottom: 20px;
          animation: pulse 2s infinite;
          box-shadow: 0 5px 25px rgba(255, 0, 0, 0.5);
        }

        .live-dot {
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

        .live-header h1 {
          font-size: 2.5em;
          color: white;
          margin-bottom: 10px;
          text-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        }

        .live-header p {
          font-size: 1.2em;
          color: rgba(255, 255, 255, 0.9);
        }

        .stream-container {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(10px);
          border: 2px solid rgba(255, 255, 255, 0.1);
        }

        .stream-wrapper {
          position: relative;
          padding-bottom: 56.25%; /* 16:9 aspect ratio */
          height: 0;
          overflow: hidden;
        }

        .stream-wrapper iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: none;
        }

        .stream-info {
          padding: 20px;
          background: rgba(0, 0, 0, 0.2);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .stream-meta {
          color: white;
        }

        .stream-meta .platform {
          font-size: 0.9em;
          opacity: 0.8;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .stream-meta .duration {
          font-size: 1.1em;
          margin-top: 5px;
        }

        .watch-button {
          padding: 12px 30px;
          background: rgba(255, 255, 255, 0.9);
          color: #764ba2;
          border: none;
          border-radius: 50px;
          font-weight: bold;
          font-size: 1em;
          cursor: pointer;
          transition: all 0.3s;
        }

        .watch-button:hover {
          background: white;
          transform: translateY(-2px);
          box-shadow: 0 5px 20px rgba(255, 255, 255, 0.3);
        }

        /* Background Animation */
        .bg-shapes {
          position: absolute;
          inset: 0;
          overflow: hidden;
          z-index: 1;
        }

        .shape {
          position: absolute;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
        }

        .shape:nth-child(1) {
          width: 300px;
          height: 300px;
          top: -150px;
          right: -150px;
          animation: float 6s ease-in-out infinite;
        }

        .shape:nth-child(2) {
          width: 200px;
          height: 200px;
          bottom: -100px;
          left: -100px;
          animation: float 8s ease-in-out infinite reverse;
        }

        .shape:nth-child(3) {
          width: 150px;
          height: 150px;
          top: 50%;
          left: 10%;
          animation: float 7s ease-in-out infinite;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .logo-container {
            width: 250px;
            height: 250px;
          }

          .offline-text h1 {
            font-size: 2em;
          }

          .offline-text p {
            font-size: 1em;
          }

          .social-links {
            flex-direction: column;
            align-items: stretch;
          }

          .live-header h1 {
            font-size: 1.8em;
          }

          .live-badge {
            font-size: 1.2em;
            padding: 10px 20px;
          }
        }
      `}</style>

      {/* Background shapes */}
      <div className="bg-shapes">
        <div className="shape"></div>
        <div className="shape"></div>
        <div className="shape"></div>
      </div>

      {!status.isLive ? (
        /* OFFLINE STATE */
        <div className="offline-container">
          <div className="logo-container">
            <div className="logo-glow"></div>
            <div className="logo-circle"></div>
            <div className="logo-image">
              <Image
                src="/assets/images/kuff-white.png"
                alt="KUFF"
                width={400}
                height={400}
                priority
              />
            </div>
          </div>

          <div className="offline-text">
            <h1>Stream Offline</h1>
            <p>Check back soon for the next live performance!</p>
            <p>Follow us on social media for stream notifications</p>
          </div>

          <div className="social-links">
            <Link href="https://instagram.com/kuffdj" className="social-link" target="_blank">
              Instagram
            </Link>
            <Link href="https://facebook.com/kuffdj" className="social-link" target="_blank">
              Facebook
            </Link>
            <Link href="/#contact" className="social-link">
              Contact
            </Link>
          </div>
        </div>
      ) : (
        /* ONLINE STATE */
        <div className="online-container">
          <div className="live-header">
            <div className="live-badge">
              <span className="live-dot"></span>
              LIVE NOW
            </div>
            <h1>{status.title}</h1>
            <p>{status.description}</p>
          </div>

          <div className="stream-container">
            <div className="stream-wrapper">
              {status.embedUrl ? (
                <iframe
                  src={status.embedUrl}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <div style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#000',
                  color: 'white',
                  fontSize: '1.5em',
                }}>
                  Stream starting soon...
                </div>
              )}
            </div>

            <div className="stream-info">
              <div className="stream-meta">
                {status.platform && (
                  <div className="platform">Streaming on {status.platform}</div>
                )}
                {status.startedAt && (
                  <div className="duration">
                    Started {new Date(status.startedAt).toLocaleTimeString()}
                  </div>
                )}
              </div>

              {status.streamUrl && (
                <a
                  href={status.streamUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="watch-button"
                >
                  Watch on {status.platform}
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
