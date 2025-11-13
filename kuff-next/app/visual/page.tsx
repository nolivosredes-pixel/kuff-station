'use client';

import { useState } from 'react';
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

export default function VisualPage() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const getCloudinaryVideoUrl = (publicId: string) => {
    return `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/q_auto,f_auto,w_800,ar_9:16,c_fill/${publicId}.mp4`;
  };

  const getCloudinaryThumbnail = (publicId: string) => {
    return `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/q_auto,f_auto,w_800,ar_9:16,c_fill,so_2/${publicId}.jpg`;
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-gradient-to-b from-black via-gray-900 to-black border-b border-cyan-500/20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Image
                src="/assets/images/kuff-white.png"
                alt="KUFF"
                width={50}
                height={50}
                className="object-contain filter drop-shadow-[0_0_15px_rgba(0,255,255,0.4)]"
              />
              <div>
                <h1 className="text-3xl font-black text-white">KUFF VIDEOS</h1>
                <p className="text-cyan-400 text-sm">Visual Experience Collection</p>
              </div>
            </div>
            <Link
              href="/"
              className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-black font-bold rounded-lg transition-all duration-300"
            >
              ← Volver
            </Link>
          </div>
        </div>
      </div>

      {/* Videos Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8 text-center">
          <div className="inline-block bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-lg px-6 py-3 mb-4">
            <p className="text-cyan-400 text-sm font-bold">
              Released on <span className="text-yellow-400">NERVOUS RECORDS</span>
            </p>
          </div>
          <p className="text-gray-400">Haz clic en cualquier video para reproducir</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {videos.map((video, index) => (
            <div
              key={index}
              className="group relative cursor-pointer"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="relative aspect-[9/16] rounded-lg overflow-hidden bg-gray-900 border-2 border-cyan-500/20 hover:border-cyan-500/60 transition-all duration-300">
                {/* Video */}
                <video
                  src={getCloudinaryVideoUrl(video.publicId)}
                  poster={getCloudinaryThumbnail(video.publicId)}
                  loop
                  muted
                  playsInline
                  controls
                  className="w-full h-full object-cover"
                />

                {/* Blue Filter Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/30 via-blue-600/20 to-purple-600/10 mix-blend-multiply pointer-events-none" />

                {/* Title Overlay */}
                <div
                  className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-4 transition-opacity duration-300 ${
                    hoveredIndex === index ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <p className="text-white font-bold text-sm drop-shadow-lg">
                    {video.title}
                  </p>
                </div>

                {/* Play Icon Overlay */}
                <div
                  className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 pointer-events-none ${
                    hoveredIndex === index ? 'opacity-0' : 'opacity-100'
                  }`}
                >
                  <div className="w-16 h-16 rounded-full bg-cyan-500/40 backdrop-blur-sm flex items-center justify-center border-2 border-cyan-400/60">
                    <svg className="w-8 h-8 text-cyan-400 ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>

                {/* Glow Effect on Hover */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-cyan-500/30 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        /* Custom scrollbar */
        :global(body) {
          scrollbar-width: thin;
          scrollbar-color: #00d9ff #1a1a1a;
        }

        :global(body::-webkit-scrollbar) {
          width: 8px;
        }

        :global(body::-webkit-scrollbar-track) {
          background: #1a1a1a;
        }

        :global(body::-webkit-scrollbar-thumb) {
          background: #00d9ff;
          border-radius: 4px;
        }

        :global(body::-webkit-scrollbar-thumb:hover) {
          background: #00ffff;
        }
      `}</style>
    </div>
  );
}
