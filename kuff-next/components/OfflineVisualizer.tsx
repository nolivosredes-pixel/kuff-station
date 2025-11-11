'use client';

import { useEffect, useRef, useState } from 'react';

interface OfflineVisualizerProps {
  youtubeVideos?: string[]; // Array of YouTube video IDs
}

export default function OfflineVisualizer({
  youtubeVideos = [
    'dQw4w9WgXcQ', // Replace with your actual KUFF video IDs
    'dQw4w9WgXcQ', // Add more video IDs
  ]
}: OfflineVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [player, setPlayer] = useState<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);

  // Load YouTube IFrame API
  useEffect(() => {
    // Check if YouTube API is already loaded
    if (typeof window !== 'undefined' && !(window as any).YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      // Setup callback for when API is ready
      (window as any).onYouTubeIframeAPIReady = () => {
        initializePlayer();
      };
    } else if ((window as any).YT && (window as any).YT.Player) {
      initializePlayer();
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const initializePlayer = () => {
    const YT = (window as any).YT;
    const newPlayer = new YT.Player('youtube-player', {
      height: '100%',
      width: '100%',
      videoId: youtubeVideos[currentVideoIndex],
      playerVars: {
        autoplay: 1,
        controls: 1,
        rel: 0,
        modestbranding: 1,
        playsinline: 1,
      },
      events: {
        onReady: (event: any) => {
          event.target.playVideo();
          initAudioContext();
        },
        onStateChange: (event: any) => {
          // When video ends, play next video
          if (event.data === YT.PlayerState.ENDED) {
            const nextIndex = (currentVideoIndex + 1) % youtubeVideos.length;
            setCurrentVideoIndex(nextIndex);
            event.target.loadVideoById(youtubeVideos[nextIndex]);
          }
        },
      },
    });
    setPlayer(newPlayer);
  };

  const initAudioContext = () => {
    try {
      // Note: Direct audio analysis from YouTube iframe is restricted due to CORS
      // We'll create visual effects based on time/random instead
      startVisualization();
    } catch (error) {
      console.error('Audio context error:', error);
      // Fallback to time-based visualization
      startVisualization();
    }
  };

  const startVisualization = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Particles array
    const particles: Particle[] = [];
    const particleCount = 150;

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      hue: number;

      constructor() {
        this.x = Math.random() * canvasWidth;
        this.y = Math.random() * canvasHeight;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
        this.size = Math.random() * 3 + 1;
        this.hue = Math.random() * 60 + 170; // Cyan/blue colors
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off edges
        if (this.x < 0 || this.x > canvasWidth) this.vx *= -1;
        if (this.y < 0 || this.y > canvasHeight) this.vy *= -1;

        // Keep within bounds
        this.x = Math.max(0, Math.min(canvasWidth, this.x));
        this.y = Math.max(0, Math.min(canvasHeight, this.y));
      }

      draw(ctx: CanvasRenderingContext2D, intensity: number) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * intensity, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${this.hue}, 70%, 50%, ${0.3 + intensity * 0.5})`;
        ctx.fill();
      }
    }

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    let time = 0;

    const animate = () => {
      time += 0.01;

      // Create gradient background
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width / 2
      );
      gradient.addColorStop(0, 'rgba(0, 10, 20, 0.1)');
      gradient.addColorStop(1, 'rgba(0, 30, 50, 0.1)');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Simulate audio intensity with sine wave
      const intensity = Math.abs(Math.sin(time)) * 0.5 + 0.5;

      // Update and draw particles
      particles.forEach(particle => {
        particle.update();
        particle.draw(ctx, intensity);
      });

      // Draw connecting lines between close particles
      ctx.strokeStyle = `rgba(0, 217, 255, ${0.1 * intensity})`;
      ctx.lineWidth = 0.5;

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw pulsing circles
      const pulseRadius = 50 + intensity * 100;
      const pulse2Radius = 30 + intensity * 80;

      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, pulseRadius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(0, 217, 255, ${0.2 * intensity})`;
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, pulse2Radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(51, 255, 204, ${0.3 * intensity})`;
      ctx.lineWidth = 1;
      ctx.stroke();

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  };

  return (
    <div className="offline-visualizer">
      <canvas ref={canvasRef} className="visualization-canvas" />

      <div className="youtube-container">
        <div id="youtube-player"></div>
      </div>

      <div className="offline-overlay">
        <h1>🎵 KUFF 24/7 Stream</h1>
        <p>Transmisión continua • Vuelve pronto para sets en vivo</p>
      </div>

      <style jsx>{`
        .offline-visualizer {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: #000;
          overflow: hidden;
        }

        .visualization-canvas {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
        }

        .youtube-container {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 80%;
          max-width: 1200px;
          aspect-ratio: 16/9;
          z-index: 2;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 217, 255, 0.3);
          border: 2px solid rgba(0, 217, 255, 0.5);
        }

        :global(#youtube-player) {
          width: 100%;
          height: 100%;
        }

        .offline-overlay {
          position: absolute;
          bottom: 50px;
          left: 50%;
          transform: translateX(-50%);
          text-align: center;
          z-index: 3;
          color: white;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(10px);
          padding: 20px 40px;
          border-radius: 15px;
          border: 1px solid rgba(0, 217, 255, 0.3);
        }

        .offline-overlay h1 {
          font-size: 2em;
          margin: 0 0 10px 0;
          font-weight: 700;
          background: linear-gradient(135deg, #00d9ff, #33ffcc);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .offline-overlay p {
          margin: 0;
          font-size: 1em;
          color: rgba(255, 255, 255, 0.8);
        }

        @media (max-width: 768px) {
          .youtube-container {
            width: 95%;
            top: 40%;
          }

          .offline-overlay {
            bottom: 30px;
            padding: 15px 25px;
          }

          .offline-overlay h1 {
            font-size: 1.5em;
          }

          .offline-overlay p {
            font-size: 0.9em;
          }
        }
      `}</style>
    </div>
  );
}
