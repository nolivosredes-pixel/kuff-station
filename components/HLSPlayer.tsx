'use client';

import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';

interface HLSPlayerProps {
  streamKey?: string;
  hlsUrl?: string; // Direct HLS URL (for Owncast)
  onStreamStatus?: (isLive: boolean) => void;
}

export default function HLSPlayer({ streamKey, hlsUrl, onStreamStatus }: HLSPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [isLive, setIsLive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Determine HLS URL
    let streamUrl: string;

    if (hlsUrl) {
      // Direct HLS URL provided (Owncast or external)
      streamUrl = hlsUrl;
    } else if (streamKey) {
      // Build URL from stream key (Node Media Server)
      const isDev = typeof window !== 'undefined' && window.location.hostname === 'localhost';
      const baseUrl = isDev ? 'http://localhost:8000' : 'http://kuffdj.net:8000';
      streamUrl = `${baseUrl}/live/${streamKey}/index.m3u8`;
    } else {
      console.error('No streamKey or hlsUrl provided');
      setError('No stream URL configured');
      return;
    }

    console.log('Attempting to load HLS stream:', streamUrl);

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90,
        maxBufferLength: 30,
        maxMaxBufferLength: 60,
      });

      hlsRef.current = hls;

      hls.loadSource(streamUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log('HLS manifest parsed successfully');
        setIsLive(true);
        setError(null);
        if (onStreamStatus) onStreamStatus(true);

        video.play().catch((err) => {
          console.error('Error playing video:', err);
        });
      });

      hls.on(Hls.Events.ERROR, (_event, data) => {
        console.error('HLS Error:', data);

        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.error('Fatal network error encountered, trying to recover');
              setError('Network error - Stream may be offline');
              setIsLive(false);
              if (onStreamStatus) onStreamStatus(false);

              // Try to recover
              setTimeout(() => {
                hls.loadSource(streamUrl);
              }, 3000);
              break;

            case Hls.ErrorTypes.MEDIA_ERROR:
              console.error('Fatal media error encountered, trying to recover');
              hls.recoverMediaError();
              break;

            default:
              console.error('Fatal error, cannot recover');
              setError('Stream unavailable');
              setIsLive(false);
              if (onStreamStatus) onStreamStatus(false);
              hls.destroy();
              break;
          }
        }
      });

      hls.on(Hls.Events.FRAG_LOADED, () => {
        // Fragment loaded successfully - stream is definitely live
        if (!isLive) {
          setIsLive(true);
          setError(null);
          if (onStreamStatus) onStreamStatus(true);
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native HLS support (Safari)
      video.src = streamUrl;

      video.addEventListener('loadedmetadata', () => {
        console.log('Video metadata loaded (Safari)');
        setIsLive(true);
        setError(null);
        if (onStreamStatus) onStreamStatus(true);
        video.play().catch(err => console.error('Error playing:', err));
      });

      video.addEventListener('error', () => {
        console.error('Video error (Safari)');
        setError('Stream unavailable');
        setIsLive(false);
        if (onStreamStatus) onStreamStatus(false);
      });
    } else {
      setError('HLS not supported in this browser');
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [streamKey, hlsUrl, onStreamStatus]);

  return (
    <div className="hls-player">
      <style jsx>{`
        .hls-player {
          position: relative;
          width: 100%;
          background: #000;
          border-radius: 15px;
          overflow: hidden;
        }

        .video-container {
          position: relative;
          padding-bottom: 56.25%; /* 16:9 aspect ratio */
          height: 0;
          overflow: hidden;
        }

        video {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .error-message {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: #ff4444;
          font-size: 1.2em;
          text-align: center;
          padding: 20px;
          background: rgba(0, 0, 0, 0.8);
          border-radius: 10px;
          z-index: 10;
        }

        .live-indicator {
          position: absolute;
          top: 20px;
          left: 20px;
          background: #ff0000;
          color: white;
          padding: 8px 16px;
          border-radius: 50px;
          font-weight: bold;
          font-size: 0.9em;
          display: flex;
          align-items: center;
          gap: 8px;
          z-index: 10;
          animation: pulse 2s infinite;
          box-shadow: 0 4px 15px rgba(255, 0, 0, 0.5);
        }

        @keyframes pulse {
          0%, 100% {
            box-shadow: 0 4px 15px rgba(255, 0, 0, 0.5);
          }
          50% {
            box-shadow: 0 4px 25px rgba(255, 0, 0, 0.8);
          }
        }

        .live-dot {
          width: 10px;
          height: 10px;
          background: white;
          border-radius: 50%;
          animation: blink 1s infinite;
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>

      <div className="video-container">
        <video
          ref={videoRef}
          controls
          playsInline
          muted={false}
        />

        {isLive && (
          <div className="live-indicator">
            <span className="live-dot"></span>
            LIVE
          </div>
        )}

        {error && !isLive && (
          <div className="error-message">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
