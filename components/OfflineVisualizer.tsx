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
      time += 0.02;

      // Create animated gradient background
      const gradient = ctx.createRadialGradient(
        canvas.width / 2 + Math.sin(time * 0.5) * 50,
        canvas.height / 2 + Math.cos(time * 0.5) * 50,
        0,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width / 2
      );
      gradient.addColorStop(0, 'rgba(0, 10, 20, 0.15)');
      gradient.addColorStop(1, 'rgba(0, 30, 50, 0.15)');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Simulate audio frequencies (bass, mid, treble)
      const bass = Math.abs(Math.sin(time * 0.8)) * 0.7 + 0.3;
      const mid = Math.abs(Math.sin(time * 1.5)) * 0.6 + 0.4;
      const treble = Math.abs(Math.sin(time * 2.3)) * 0.5 + 0.5;
      const intensity = (bass + mid + treble) / 3;

      // Update and draw particles with frequency-based sizing
      particles.forEach((particle, index) => {
        // Different particles react to different frequencies
        const freqIndex = index % 3;
        let particleIntensity = intensity;
        if (freqIndex === 0) particleIntensity = bass;
        else if (freqIndex === 1) particleIntensity = mid;
        else particleIntensity = treble;

        particle.update();
        particle.draw(ctx, particleIntensity);
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

      // Draw multiple frequency rings (bass, mid, treble)
      // Bass ring (low frequency - big and slow)
      const bassRadius = 100 + bass * 150;
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, bassRadius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(0, 217, 255, ${0.3 * bass})`;
      ctx.lineWidth = 3;
      ctx.stroke();

      // Mid ring
      const midRadius = 70 + mid * 100;
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, midRadius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(51, 255, 204, ${0.4 * mid})`;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Treble ring (high frequency - small and fast)
      const trebleRadius = 40 + treble * 60;
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, trebleRadius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(102, 255, 255, ${0.5 * treble})`;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Draw frequency bars (visualizer style)
      const barCount = 64;
      const barWidth = canvas.width / barCount;
      for (let i = 0; i < barCount; i++) {
        // Simulate different frequencies
        const freq = Math.abs(Math.sin(time * 2 + i * 0.1)) *
                     Math.abs(Math.cos(time * 1.5 + i * 0.05));
        const barHeight = freq * 200 * (bass * 0.5 + mid * 0.3 + treble * 0.2);

        const x = i * barWidth;
        const y = canvas.height - barHeight;

        const gradient = ctx.createLinearGradient(x, y, x, canvas.height);
        gradient.addColorStop(0, `rgba(0, 217, 255, ${0.6 * intensity})`);
        gradient.addColorStop(1, `rgba(0, 217, 255, ${0.1 * intensity})`);

        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, barWidth - 2, barHeight);
      }

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
          box-shadow:
            0 0 40px rgba(0, 217, 255, 0.4),
            0 0 80px rgba(0, 217, 255, 0.2),
            0 20px 60px rgba(0, 0, 0, 0.5);
          border: 3px solid rgba(0, 217, 255, 0.6);
          animation: videoGlow 2s ease-in-out infinite;
        }

        @keyframes videoGlow {
          0%, 100% {
            box-shadow:
              0 0 40px rgba(0, 217, 255, 0.4),
              0 0 80px rgba(0, 217, 255, 0.2),
              0 20px 60px rgba(0, 0, 0, 0.5);
          }
          50% {
            box-shadow:
              0 0 60px rgba(0, 217, 255, 0.6),
              0 0 120px rgba(0, 217, 255, 0.3),
              0 20px 80px rgba(0, 0, 0, 0.6);
          }
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
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(15px);
          padding: 25px 50px;
          border-radius: 20px;
          border: 2px solid rgba(0, 217, 255, 0.4);
          box-shadow:
            0 0 30px rgba(0, 217, 255, 0.3),
            0 10px 40px rgba(0, 0, 0, 0.5);
          animation: overlayPulse 3s ease-in-out infinite;
        }

        @keyframes overlayPulse {
          0%, 100% {
            border-color: rgba(0, 217, 255, 0.4);
            box-shadow:
              0 0 30px rgba(0, 217, 255, 0.3),
              0 10px 40px rgba(0, 0, 0, 0.5);
          }
          50% {
            border-color: rgba(0, 217, 255, 0.7);
            box-shadow:
              0 0 50px rgba(0, 217, 255, 0.5),
              0 10px 60px rgba(0, 0, 0, 0.6);
          }
        }

        .offline-overlay h1 {
          font-size: 2.2em;
          margin: 0 0 10px 0;
          font-weight: 800;
          background: linear-gradient(135deg, #00d9ff 0%, #33ffcc 50%, #00d9ff 100%);
          background-size: 200% 200%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gradientShift 3s ease infinite;
          text-shadow: 0 0 30px rgba(0, 217, 255, 0.3);
        }

        @keyframes gradientShift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .offline-overlay p {
          margin: 0;
          font-size: 1.1em;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.9);
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
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
