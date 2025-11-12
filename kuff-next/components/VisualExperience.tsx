'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Script from 'next/script';

// Declare global type for TubesCursor library
declare global {
  interface Window {
    TubesCursor: any;
  }
}

// Cloudinary video configuration
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dvpsdkep2';

interface Video {
  publicId: string;
  title?: string;
}

// Videos uploaded to Cloudinary - Real Public IDs from your account
const videos: Video[] = [
  { publicId: 'REEL_1_compressed_xyzub5', title: 'KUFF Reel 1' },
  { publicId: 'REEL_2_compressed_ntpptd', title: 'KUFF Reel 2' },
  { publicId: 'REEL_4_compressed_gnqyv3', title: 'KUFF Reel 4' },
  { publicId: 'REEL_5_compressed_pe6fwz', title: 'KUFF Reel 5' },
  { publicId: 'REEL_6_compressed_mzlnm1', title: 'KUFF Reel 6' },
  { publicId: 'REEL_7_compressed_aisuvb', title: 'KUFF Reel 7' },
  { publicId: 'REEL_8_compressed_dxx62m', title: 'KUFF Reel 8' },
  { publicId: 'REEL_9_compressed_ze6lqx', title: 'KUFF Reel 9' },
  { publicId: 'REEL_10_compressed_tz5b3q', title: 'KUFF Reel 10' },
  { publicId: 'REEL_14_compressed_daj3ay', title: 'KUFF Reel 14' },
];

export default function VisualExperience() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [showSpotify, setShowSpotify] = useState(false);
  const [tubesLoaded, setTubesLoaded] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false); // Estado para collapse/expand
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tubesAppRef = useRef<any>(null);

  // Initialize Tubes Cursor effect - solo cuando está expandido
  useEffect(() => {
    if (!tubesLoaded || !canvasRef.current || !isExpanded) return;

    const initTubes = async () => {
      try {
        // @ts-ignore - External library
        const TubesCursor = window.TubesCursor;
        if (!TubesCursor) return;

        // Initialize with KUFF colors
        tubesAppRef.current = TubesCursor(canvasRef.current, {
          tubes: {
            colors: ["#00FFFF", "#0080FF", "#8B5CF6"], // Cyan, Blue, Purple - KUFF signature
            lights: {
              intensity: 250,
              colors: ["#00FFFF", "#0080FF", "#8B5CF6", "#FF00FF"] // KUFF color palette
            }
          }
        });

        console.log('Tubes Cursor initialized with KUFF colors');
      } catch (error) {
        console.error('Error initializing Tubes Cursor:', error);
      }
    };

    initTubes();

    return () => {
      if (tubesAppRef.current?.dispose) {
        tubesAppRef.current.dispose();
      }
    };
  }, [tubesLoaded, isExpanded]);

  useEffect(() => {
    // Lazy load videos on intersection - solo cuando está expandido
    if (!isExpanded) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const video = entry.target as HTMLVideoElement;
            if (video.dataset.src) {
              video.src = video.dataset.src;
              video.load();
            }
          }
        });
      },
      { rootMargin: '50px' }
    );

    videoRefs.current.forEach((video) => {
      if (video) observer.observe(video);
    });

    return () => observer.disconnect();
  }, [isExpanded]);

  const getCloudinaryVideoUrl = (publicId: string) => {
    return `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/q_auto,f_auto,w_600,ar_9:16,c_fill/${publicId}.mp4`;
  };

  const getCloudinaryThumbnail = (publicId: string) => {
    return `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/q_auto,f_auto,w_600,ar_9:16,c_fill,so_2/${publicId}.jpg`;
  };

  return (
    <>
      {/* Tubes Cursor Script */}
      <Script
        src="https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js"
        onLoad={() => setTubesLoaded(true)}
        strategy="lazyOnload"
      />

      <section className="relative py-20 bg-black overflow-hidden">
        {/* 3D Tubes Cursor Canvas - Full page interactive background */}
        <canvas
          ref={canvasRef}
          id="tubes-canvas"
          className="fixed top-0 left-0 w-full h-full pointer-events-none"
          style={{
            opacity: 0.4,
            zIndex: 1,
            mixBlendMode: 'screen'
          }}
        />

        {/* Background with subtle blue glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-950/20 via-black to-black z-0" />

      {/* Animated grid pattern - pulses with beat */}
      <div className="absolute inset-0 opacity-10 z-10">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,255,255,0.1)_1px,transparent_1px),linear-gradient(rgba(0,255,255,0.1)_1px,transparent_1px)] bg-[size:50px_50px] animate-beat-pulse" />
      </div>

      {/* Audio Visualizer Bars - Left Side */}
      <div className="absolute left-0 top-0 bottom-0 flex items-end gap-1 p-8 opacity-20 z-10">
        {[...Array(12)].map((_, i) => (
          <div
            key={`left-${i}`}
            className="w-1 bg-gradient-to-t from-cyan-400 to-blue-500 rounded-t animate-audio-bar"
            style={{
              height: '100%',
              animationDelay: `${i * 0.08}s`,
              animationDuration: `${0.48 + (i % 3) * 0.1}s`
            }}
          />
        ))}
      </div>

      {/* Audio Visualizer Bars - Right Side */}
      <div className="absolute right-0 top-0 bottom-0 flex items-end gap-1 p-8 opacity-20 z-10">
        {[...Array(12)].map((_, i) => (
          <div
            key={`right-${i}`}
            className="w-1 bg-gradient-to-t from-cyan-400 to-blue-500 rounded-t animate-audio-bar"
            style={{
              height: '100%',
              animationDelay: `${i * 0.08}s`,
              animationDuration: `${0.48 + (i % 3) * 0.1}s`
            }}
          />
        ))}
      </div>

      {/* Pulsing rings that sync with beat */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <div className="absolute w-32 h-32 border-2 border-cyan-400/20 rounded-full animate-ring-pulse" />
        <div className="absolute w-64 h-64 border-2 border-cyan-400/10 rounded-full animate-ring-pulse" style={{ animationDelay: '0.24s' }} />
        <div className="absolute w-96 h-96 border-2 border-cyan-400/5 rounded-full animate-ring-pulse" style={{ animationDelay: '0.48s' }} />
      </div>

      <div className="container mx-auto px-4 relative z-20">
        {/* Header with KUFF Logo */}
        <div className="text-center mb-16">
          {/* KUFF Logo - Pulses with beat */}
          <div className="flex justify-center mb-8">
            <div className="relative group">
              {/* Cyan glow effect behind logo - pulses with beat */}
              <div className="absolute inset-0 bg-cyan-400/30 blur-3xl rounded-full animate-beat-glow" />

              {/* Logo container - subtle scale pulse */}
              <div className="relative animate-beat-scale">
                <Image
                  src="/assets/images/kuff-white.png"
                  alt="KUFF"
                  width={200}
                  height={200}
                  className="w-32 h-32 md:w-48 md:h-48 object-contain filter drop-shadow-[0_0_30px_rgba(0,255,255,0.5)]"
                  priority
                />
              </div>

              {/* Rotating border effect - synced with beat */}
              <div className="absolute inset-0 rounded-full border-2 border-cyan-400/30 animate-spin-slow" />
              <div className="absolute inset-0 rounded-full border-2 border-cyan-400/20 animate-spin-reverse" />

              {/* Beat indicator dots */}
              <div className="absolute -top-2 -right-2 w-3 h-3 bg-cyan-400 rounded-full animate-beat-dot" />
              <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-blue-500 rounded-full animate-beat-dot" style={{ animationDelay: '0.24s' }} />
            </div>
          </div>

          <h2 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
            VISUAL EXPERIENCE
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
            Sumérgete en la experiencia audiovisual de KUFF - donde la música electrónica cobra vida
          </p>

          {/* Toggle Button - Expandir/Colapsar */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-500/50"
          >
            <svg
              className={`w-6 h-6 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            {isExpanded ? 'Ocultar' : 'Ver'} Experiencia Visual
          </button>
        </div>

        {/* Collapsible Content */}
        <div
          className={`transition-all duration-500 ease-in-out overflow-hidden ${
            isExpanded ? 'max-h-[10000px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          {/* Spotify Player Toggle - Solo visible cuando expandido */}
          {isExpanded && (
            <div className="text-center mb-8">
              <button
                onClick={() => setShowSpotify(!showSpotify)}
                className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg shadow-green-500/50"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                </svg>
                {showSpotify ? 'Ocultar' : 'Escuchar'} en Spotify
              </button>
            </div>
          )}

        {/* Spotify Player */}
        {showSpotify && (
          <div className="mb-16 max-w-4xl mx-auto animate-fadeIn">
            <div className="bg-gradient-to-r from-gray-900 to-black p-6 rounded-2xl shadow-2xl border border-green-500/30">
              <iframe
                src="https://open.spotify.com/embed/artist/0kEV1h5WAEMDTn40e0TjU0?utm_source=generator&theme=0"
                width="100%"
                height="352"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                className="rounded-xl border-0"
              />
            </div>
          </div>
        )}

        {/* Nervous Records Feature */}
        <div className="mb-16 max-w-5xl mx-auto">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 via-black to-gray-900 border border-yellow-400/20 p-8 md:p-12 animate-nervous-glow">
            {/* Background Pattern - pulses with beat */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,227,13,0.1)_1px,transparent_1px),linear-gradient(-45deg,rgba(255,227,13,0.1)_1px,transparent_1px)] bg-[size:20px_20px] animate-beat-pulse" />
            </div>

            {/* Glow Effect - pulses with beat */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-32 bg-yellow-400/10 blur-3xl rounded-full animate-nervous-pulse" />

            <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
              {/* Text Content */}
              <div className="flex-1 text-center md:text-left">
                <div className="inline-block mb-4 px-4 py-2 bg-yellow-400/10 rounded-full border border-yellow-400/30">
                  <span className="text-yellow-400 font-bold text-sm tracking-wider">FEATURED LABEL</span>
                </div>
                <h3 className="text-3xl md:text-4xl font-black text-white mb-3">
                  Released on{' '}
                  <span className="bg-gradient-to-r from-yellow-400 to-yellow-200 bg-clip-text text-transparent">
                    Nervous Records
                  </span>
                </h3>
                <p className="text-gray-400 text-base md:text-lg mb-6 leading-relaxed max-w-xl">
                  One of the longest standing independent record labels in the US, building its reputation through a willingness to take chances on new sounds and new producers.
                </p>
                <a
                  href="https://nervousnyc.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-400 hover:bg-yellow-300 text-black font-bold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-yellow-400/30"
                >
                  <span>Visitar Nervous Records</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>

              {/* Logo */}
              <div className="flex-shrink-0">
                <div className="relative group">
                  {/* Glow behind logo */}
                  <div className="absolute inset-0 bg-yellow-400/20 blur-2xl rounded-full scale-110 group-hover:scale-125 transition-transform duration-500" />

                  {/* Logo container */}
                  <div className="relative bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-yellow-400/30 group-hover:border-yellow-400/60 transition-all duration-300">
                    <Image
                      src="https://nervousnyc.com/wp-content/uploads/2016/05/Nervous_Text_Logo-1-01.png"
                      alt="Nervous Records"
                      width={300}
                      height={100}
                      className="w-64 md:w-80 h-auto object-contain filter brightness-110 group-hover:brightness-125 transition-all duration-300"
                      priority={false}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative corner accents */}
            <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-yellow-400/30 rounded-tl-2xl" />
            <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-yellow-400/30 rounded-br-2xl" />
          </div>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {videos.map((video, index) => (
            <div
              key={index}
              className="relative group cursor-pointer"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Video Container with Blue Filter - Pulses with beat */}
              <div className="relative aspect-[9/16] rounded-lg overflow-hidden bg-black/50">
                {/* Blue Filter Overlay - This creates the cyan/blue tint - pulses with beat */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/40 via-blue-600/30 to-purple-600/20 mix-blend-multiply z-10 pointer-events-none animate-filter-pulse" />

                {/* Additional Glow Effect - pulses with beat */}
                <div className="absolute inset-0 bg-cyan-400/10 mix-blend-screen z-10 pointer-events-none animate-glow-pulse" />

                {/* Video Element */}
                <video
                  ref={(el) => { videoRefs.current[index] = el; }}
                  data-src={getCloudinaryVideoUrl(video.publicId)}
                  poster={getCloudinaryThumbnail(video.publicId)}
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onMouseEnter={(e) => e.currentTarget.play()}
                  onMouseLeave={(e) => {
                    e.currentTarget.pause();
                    e.currentTarget.currentTime = 0;
                  }}
                />

                {/* Hover Overlay with Glitch Effect */}
                <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent transition-opacity duration-300 z-20 ${hoveredIndex === index ? 'opacity-100' : 'opacity-0'}`}>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-white font-bold text-sm md:text-base drop-shadow-lg">
                      {video.title || `KUFF Video ${index + 1}`}
                    </p>
                  </div>
                </div>

                {/* Play Icon Overlay */}
                <div className={`absolute inset-0 flex items-center justify-center z-20 transition-opacity duration-300 ${hoveredIndex === index ? 'opacity-0' : 'opacity-100'}`}>
                  <div className="w-16 h-16 rounded-full bg-cyan-500/30 backdrop-blur-sm flex items-center justify-center border-2 border-cyan-400/50">
                    <svg className="w-8 h-8 text-cyan-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>

                {/* Glitch Border Effect on Hover */}
                <div className={`absolute inset-0 border-2 border-cyan-400 z-30 pointer-events-none transition-opacity duration-300 ${hoveredIndex === index ? 'opacity-100 animate-glitch-border' : 'opacity-0'}`} />
              </div>

              {/* Bottom Glow Effect */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-cyan-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
        </div>

        {/* Instructions Note */}
        <div className="mt-16 text-center">
          <p className="text-gray-500 text-sm md:text-base">
            Pasa el cursor sobre los videos para reproducir • Todos los videos con filtro azul KUFF signature
          </p>
        </div>
        </div>
        {/* End Collapsible Content */}
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes glitch-border {
          0%, 100% {
            transform: translate(0);
          }
          20% {
            transform: translate(-2px, 2px);
          }
          40% {
            transform: translate(-2px, -2px);
          }
          60% {
            transform: translate(2px, 2px);
          }
          80% {
            transform: translate(2px, -2px);
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes spin-reverse {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }

        /* Beat-synced animations - 125 BPM (0.48s per beat) */
        @keyframes beat-pulse {
          0%, 100% {
            opacity: 0.1;
            transform: scale(1);
          }
          50% {
            opacity: 0.15;
            transform: scale(1.02);
          }
        }

        @keyframes audio-bar {
          0%, 100% {
            transform: scaleY(0.3);
            opacity: 0.5;
          }
          25% {
            transform: scaleY(0.8);
            opacity: 0.8;
          }
          50% {
            transform: scaleY(1);
            opacity: 1;
          }
          75% {
            transform: scaleY(0.6);
            opacity: 0.7;
          }
        }

        @keyframes ring-pulse {
          0% {
            transform: scale(0.95);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.6;
          }
          100% {
            transform: scale(0.95);
            opacity: 0.3;
          }
        }

        @keyframes beat-glow {
          0%, 100% {
            transform: scale(1.25);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.5);
            opacity: 0.5;
          }
        }

        @keyframes beat-scale {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        @keyframes beat-dot {
          0%, 100% {
            transform: scale(1);
            opacity: 0.5;
            box-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
          }
          50% {
            transform: scale(1.5);
            opacity: 1;
            box-shadow: 0 0 20px rgba(0, 255, 255, 1);
          }
        }

        @keyframes filter-pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.85;
          }
        }

        @keyframes glow-pulse {
          0%, 100% {
            opacity: 0.1;
          }
          50% {
            opacity: 0.2;
          }
        }

        @keyframes nervous-glow {
          0%, 100% {
            border-color: rgba(255, 227, 13, 0.2);
            box-shadow: 0 0 20px rgba(255, 227, 13, 0.1);
          }
          50% {
            border-color: rgba(255, 227, 13, 0.4);
            box-shadow: 0 0 40px rgba(255, 227, 13, 0.2);
          }
        }

        @keyframes nervous-pulse {
          0%, 100% {
            transform: translate(-50%, 0) scale(1);
            opacity: 0.1;
          }
          50% {
            transform: translate(-50%, 0) scale(1.2);
            opacity: 0.2;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }

        .animate-glitch-border {
          animation: glitch-border 0.3s infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }

        .animate-spin-reverse {
          animation: spin-reverse 15s linear infinite;
        }

        .animate-beat-pulse {
          animation: beat-pulse 0.48s ease-in-out infinite;
        }

        .animate-audio-bar {
          animation: audio-bar 0.48s ease-in-out infinite;
          transform-origin: bottom;
        }

        .animate-ring-pulse {
          animation: ring-pulse 0.96s ease-in-out infinite;
        }

        .animate-beat-glow {
          animation: beat-glow 0.48s ease-in-out infinite;
        }

        .animate-beat-scale {
          animation: beat-scale 0.48s ease-in-out infinite;
        }

        .animate-beat-dot {
          animation: beat-dot 0.48s ease-in-out infinite;
        }

        .animate-filter-pulse {
          animation: filter-pulse 0.96s ease-in-out infinite;
        }

        .animate-glow-pulse {
          animation: glow-pulse 0.96s ease-in-out infinite;
        }

        .animate-nervous-glow {
          animation: nervous-glow 0.96s ease-in-out infinite;
        }

        .animate-nervous-pulse {
          animation: nervous-pulse 0.96s ease-in-out infinite;
        }
      `}</style>
    </section>
    </>
  );
}
