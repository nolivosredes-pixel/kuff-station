'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface StreamingStatus {
  isLive: boolean;
  platform: string | null;
  title: string;
  description: string;
}

export default function LiveStreamCTA() {
  const [status, setStatus] = useState<StreamingStatus>({
    isLive: false,
    platform: null,
    title: 'KUFF Live Stream',
    description: 'Watch KUFF perform live!',
  });

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch('/api/streaming/status');
        const data = await response.json();
        setStatus(data);
      } catch (error) {
        console.error('Error fetching streaming status:', error);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="live-stream-cta">
      <style jsx>{`
        .live-stream-cta {
          position: relative;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 20px;
          padding: 60px 40px;
          overflow: hidden;
          min-height: 400px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .bg-pattern {
          position: absolute;
          inset: 0;
          opacity: 0.1;
          background-image:
            repeating-linear-gradient(
              45deg,
              transparent,
              transparent 10px,
              rgba(255, 255, 255, 0.05) 10px,
              rgba(255, 255, 255, 0.05) 20px
            );
        }

        .content {
          position: relative;
          z-index: 2;
          max-width: 600px;
        }

        .live-indicator {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: rgba(255, 0, 0, 0.9);
          padding: 12px 30px;
          border-radius: 50px;
          font-weight: bold;
          font-size: 1.2em;
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

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.9;
          }
        }

        .logo-container {
          position: relative;
          width: 200px;
          height: 200px;
          margin: 0 auto 30px;
        }

        .logo-glow {
          position: absolute;
          inset: -20px;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
          border-radius: 50%;
          animation: glow 3s ease-in-out infinite;
        }

        @keyframes glow {
          0%, 100% {
            opacity: 0.5;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.1);
          }
        }

        .logo-image {
          position: relative;
          z-index: 2;
          animation: float 4s ease-in-out infinite;
          filter: drop-shadow(0 10px 30px rgba(0, 0, 0, 0.3));
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }

        h2 {
          font-size: 2.5em;
          font-weight: bold;
          margin-bottom: 15px;
          color: white;
          text-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        }

        .description {
          font-size: 1.2em;
          color: rgba(255, 255, 255, 0.95);
          margin-bottom: 30px;
          line-height: 1.6;
        }

        .cta-button {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 18px 40px;
          background: rgba(255, 255, 255, 0.95);
          color: #764ba2;
          text-decoration: none;
          font-weight: bold;
          font-size: 1.2em;
          border-radius: 50px;
          transition: all 0.3s;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }

        .cta-button:hover {
          background: white;
          transform: translateY(-3px);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
        }

        .offline-text {
          font-size: 1.1em;
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 30px;
        }

        @media (max-width: 768px) {
          .live-stream-cta {
            padding: 40px 20px;
            min-height: 350px;
          }

          .logo-container {
            width: 150px;
            height: 150px;
            margin-bottom: 20px;
          }

          h2 {
            font-size: 2em;
          }

          .description {
            font-size: 1em;
          }

          .cta-button {
            padding: 15px 30px;
            font-size: 1em;
          }
        }
      `}</style>

      <div className="bg-pattern"></div>

      <div className="content">
        {status.isLive ? (
          <>
            <div className="live-indicator">
              <span className="live-dot"></span>
              LIVE NOW
            </div>
            <h2>{status.title}</h2>
            <p className="description">{status.description}</p>
            <Link href="/live" className="cta-button">
              Watch Live Now →
            </Link>
          </>
        ) : (
          <>
            <div className="logo-container">
              <div className="logo-glow"></div>
              <div className="logo-image">
                <Image
                  src="/assets/images/kuff-white.png"
                  alt="KUFF"
                  width={200}
                  height={200}
                  priority
                />
              </div>
            </div>
            <h2>Live Streaming</h2>
            <p className="description">
              Join KUFF for exclusive live performances and DJ sets.<br />
              Experience the energy of a live show from anywhere in the world.
            </p>
            <p className="offline-text">
              Stream is currently offline. Check back soon!
            </p>
            <Link href="/live" className="cta-button">
              Visit Live Page →
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
