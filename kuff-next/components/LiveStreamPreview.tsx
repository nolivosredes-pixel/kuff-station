'use client';

import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';

const SRS_HLS_URL = process.env.NEXT_PUBLIC_SRS_HLS_URL || 'https://kuff-srs.fly.dev/live/QS76Y2rDmfxm*upmFVO@vp099KyOyJ.m3u8';

export default function LiveStreamPreview() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLive, setIsLive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls: Hls | null = null;

    if (Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90,
      });

      hls.loadSource(SRS_HLS_URL);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setIsLive(true);
        setError(null);
        video.play().catch(err => {
          console.log('Auto-play prevented:', err);
        });
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          setIsLive(false);
          setError('Stream offline or unavailable');
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Safari native HLS
      video.src = SRS_HLS_URL;
      video.addEventListener('loadedmetadata', () => {
        setIsLive(true);
        setError(null);
        video.play().catch(err => {
          console.log('Auto-play prevented:', err);
        });
      });
      video.addEventListener('error', () => {
        setIsLive(false);
        setError('Stream offline or unavailable');
      });
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, []);

  return (
    <div style={{
      background: 'rgba(26, 26, 26, 0.8)',
      backdropFilter: 'blur(10px)',
      padding: '30px',
      borderRadius: '20px',
      border: '2px solid rgba(0, 217, 255, 0.2)',
      boxShadow: '0 20px 60px rgba(0, 217, 255, 0.1)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h3 style={{
          fontSize: '1.5rem',
          fontWeight: 700,
          color: '#00d9ff',
          textTransform: 'uppercase',
          letterSpacing: '2px',
        }}>
          📡 Live Stream Preview
        </h3>
        {isLive && (
          <div style={{
            background: 'linear-gradient(135deg, #ff0000 0%, #cc0000 100%)',
            padding: '8px 20px',
            borderRadius: '50px',
            color: 'white',
            fontWeight: 700,
            fontSize: '0.9rem',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            boxShadow: '0 5px 20px rgba(255, 0, 0, 0.4)',
            animation: 'pulse 2s infinite',
          }}>
            🔴 LIVE
          </div>
        )}
      </div>

      <div style={{
        position: 'relative',
        width: '100%',
        paddingBottom: '56.25%', // 16:9 aspect ratio
        background: '#000',
        borderRadius: '15px',
        overflow: 'hidden',
        border: isLive ? '2px solid rgba(0, 217, 255, 0.5)' : '2px solid rgba(128, 128, 128, 0.3)',
        boxShadow: isLive ? '0 10px 40px rgba(0, 217, 255, 0.2)' : 'none',
      }}>
        <video
          ref={videoRef}
          controls
          muted
          playsInline
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'contain',
          }}
        />

        {error && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            color: '#ff4444',
            fontSize: '1.2rem',
            fontWeight: 600,
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '10px' }}>📡</div>
            {error}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}
