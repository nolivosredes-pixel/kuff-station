'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Cloudinary video configuration
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dvpsdkep2';

interface Video {
  publicId: string;
  title?: string;
}

// Videos uploaded to Cloudinary
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

export default function VJMixPage() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [nextVideoIndex, setNextVideoIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const currentVideoRef = useRef<HTMLVideoElement>(null);
  const nextVideoRef = useRef<HTMLVideoElement>(null);

  // Auto-transition between videos every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);

      // After 2 seconds (crossfade duration), switch videos
      setTimeout(() => {
        setCurrentVideoIndex(nextVideoIndex);
        setNextVideoIndex((nextVideoIndex + 1) % videos.length);
        setIsTransitioning(false);
      }, 2000);
    }, 8000); // Change video every 8 seconds

    return () => clearInterval(interval);
  }, [nextVideoIndex]);

  // Auto-play videos with error handling
  useEffect(() => {
    const playVideo = async (videoRef: React.RefObject<HTMLVideoElement | null>) => {
      if (videoRef.current) {
        try {
          await videoRef.current.play();
        } catch (error) {
          console.log('Video autoplay blocked or error:', error);
        }
      }
    };

    playVideo(currentVideoRef);
    playVideo(nextVideoRef);
  }, [currentVideoIndex, nextVideoIndex]);

  const getCloudinaryVideoUrl = (publicId: string) => {
    return `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/q_auto,f_auto,w_1920,ar_9:16,c_fill/${publicId}.mp4`;
  };

  return (
    <>
      <div className="fixed inset-0 bg-black overflow-hidden">
        {/* Current Video Layer */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            opacity: isTransitioning ? 0 : 1,
            transition: 'opacity 2s ease-in-out',
            zIndex: 2
          }}
        >
          <video
            ref={currentVideoRef}
            src={getCloudinaryVideoUrl(videos[currentVideoIndex].publicId)}
            loop
            muted
            playsInline
            className="min-w-full min-h-full object-cover"
          />
          {/* Blue filter overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/40 via-blue-600/30 to-purple-600/20 mix-blend-multiply animate-filter-pulse" />
          <div className="absolute inset-0 bg-cyan-400/10 mix-blend-screen animate-glow-pulse" />
        </div>

        {/* Next Video Layer (for crossfade) */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            opacity: isTransitioning ? 1 : 0,
            transition: 'opacity 2s ease-in-out',
            zIndex: 1
          }}
        >
          <video
            ref={nextVideoRef}
            src={getCloudinaryVideoUrl(videos[nextVideoIndex].publicId)}
            loop
            muted
            playsInline
            className="min-w-full min-h-full object-cover"
          />
          {/* Blue filter overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/40 via-blue-600/30 to-purple-600/20 mix-blend-multiply animate-filter-pulse" />
          <div className="absolute inset-0 bg-cyan-400/10 mix-blend-screen animate-glow-pulse" />
        </div>

        {/* Pulsing rings that sync with beat */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="absolute w-32 h-32 border-2 border-cyan-400/20 rounded-full animate-ring-pulse" />
          <div className="absolute w-64 h-64 border-2 border-cyan-400/10 rounded-full animate-ring-pulse" style={{ animationDelay: '0.24s' }} />
          <div className="absolute w-96 h-96 border-2 border-cyan-400/5 rounded-full animate-ring-pulse" style={{ animationDelay: '0.48s' }} />
        </div>

        {/* Audio Visualizer Bars - Left Side */}
        <div className="absolute left-0 top-0 bottom-0 flex items-end gap-1 p-8 opacity-20 z-10 pointer-events-none">
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
        <div className="absolute right-0 top-0 bottom-0 flex items-end gap-1 p-8 opacity-20 z-10 pointer-events-none">
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

        {/* Top UI Overlay */}
        <div className="absolute top-0 left-0 right-0 p-8 z-20 bg-gradient-to-b from-black/50 to-transparent">
          <div className="flex items-center justify-between">
            {/* KUFF Logo */}
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 bg-cyan-400/30 blur-xl rounded-full animate-beat-glow" />
                <Image
                  src="/assets/images/kuff-white.png"
                  alt="KUFF"
                  width={64}
                  height={64}
                  className="relative object-contain filter drop-shadow-[0_0_20px_rgba(0,255,255,0.5)]"
                />
              </div>
              <div>
                <h1 className="text-2xl font-black text-white">KUFF VJ MIX</h1>
                <p className="text-cyan-400 text-sm">Live Visual Experience</p>
              </div>
            </div>

            {/* Close Button */}
            <Link
              href="/"
              className="px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-bold rounded-full transition-all duration-300 border border-white/20"
            >
              ← Back to Site
            </Link>
          </div>
        </div>

        {/* Bottom UI - Current Track Info */}
        <div className="absolute bottom-0 left-0 right-0 p-8 z-20 bg-gradient-to-t from-black/70 to-transparent">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-cyan-400 text-sm font-bold mb-1">NOW PLAYING</div>
              <div className="text-white text-2xl font-black">{videos[currentVideoIndex].title}</div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-white font-bold">LIVE</span>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="mt-4 h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 animate-progress"
              style={{
                animation: 'progress 8s linear infinite'
              }}
            />
          </div>
        </div>

        {/* Nervous Records Badge */}
        <div className="absolute top-1/2 right-8 -translate-y-1/2 z-20">
          <div className="bg-black/50 backdrop-blur-sm border border-yellow-400/30 rounded-lg p-4 text-center">
            <div className="text-yellow-400 text-xs font-bold mb-2">RELEASED ON</div>
            <div className="relative w-24 h-12">
              <Image
                src="/assets/images/nervous-records-yellow.png"
                alt="Nervous Records"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes ring-pulse {
          0%, 100% {
            opacity: 0.1;
            transform: scale(1);
          }
          50% {
            opacity: 0.3;
            transform: scale(1.05);
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

        @keyframes filter-pulse {
          0%, 100% {
            opacity: 0.4;
          }
          50% {
            opacity: 0.6;
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

        @keyframes beat-glow {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.1);
          }
        }

        @keyframes progress {
          0% {
            width: 0%;
          }
          100% {
            width: 100%;
          }
        }

        .animate-ring-pulse {
          animation: ring-pulse 0.96s ease-in-out infinite;
        }

        .animate-audio-bar {
          animation: audio-bar 0.48s ease-in-out infinite;
        }

        .animate-filter-pulse {
          animation: filter-pulse 0.96s ease-in-out infinite;
        }

        .animate-glow-pulse {
          animation: glow-pulse 0.96s ease-in-out infinite;
        }

        .animate-beat-glow {
          animation: beat-glow 0.96s ease-in-out infinite;
        }

        .animate-progress {
          animation: progress 8s linear infinite;
        }
      `}</style>
    </>
  );
}
