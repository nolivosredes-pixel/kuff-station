'use client';

import { useState } from 'react';
import Image from 'next/image';
import Navigation from '@/components/Navigation';

// Cloudinary video configuration
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dvpsdkep2';

interface Video {
  publicId: string;
  title: string;
  description: string;
}

// Videos uploaded to Cloudinary
const videos: Video[] = [
  { publicId: 'REEL_1_compressed_xyzub5', title: 'Visual Performance', description: 'Live Energy' },
  { publicId: 'REEL_2_compressed_ntpptd', title: 'Tech House Vibes', description: 'Peak Hour' },
  { publicId: 'REEL_4_compressed_gnqyv3', title: 'Live Set', description: 'Underground' },
  { publicId: 'REEL_5_compressed_pe6fwz', title: 'Festival Energy', description: 'Main Stage' },
  { publicId: 'REEL_6_compressed_mzlnm1', title: 'Club Night', description: 'Dark Room' },
  { publicId: 'REEL_7_compressed_aisuvb', title: 'Minimal Bass', description: 'Deep Grooves' },
  { publicId: 'REEL_8_compressed_dxx62m', title: 'Underground', description: 'Raw Energy' },
  { publicId: 'REEL_9_compressed_ze6lqx', title: 'Peak Time', description: 'Crowd Control' },
  { publicId: 'REEL_10_compressed_tz5b3q', title: 'Indie Dance', description: 'Melodic Beats' },
  { publicId: 'REEL_14_compressed_daj3ay', title: 'Special Set', description: 'Exclusive' },
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
    <>
      <Navigation />

      {/* Visual Experience Section */}
      <section className="visual-section" style={{
        paddingTop: '120px',
        paddingBottom: '80px',
        background: 'linear-gradient(180deg, #000000 0%, #0a0a0a 50%, #000000 100%)'
      }}>
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 className="section-title" style={{
              background: 'linear-gradient(135deg, #00d9ff 0%, #00ffff 50%, #00d9ff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontSize: '3.5rem',
              fontWeight: '900',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              animation: 'gradientShift 3s ease infinite',
              marginBottom: '20px'
            }}>
              Visual Experience
            </h2>
            <div className="title-underline" style={{ margin: '0 auto' }}></div>
            <p style={{
              color: 'var(--text-secondary)',
              fontSize: '1.1rem',
              marginTop: '20px',
              maxWidth: '700px',
              margin: '20px auto 0'
            }}>
              Explore the best moments of KUFF on stage. Official videos released on{' '}
              <span style={{
                background: 'linear-gradient(90deg, #ffd700 0%, #ffed4e 50%, #ffd700 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontWeight: 'bold',
                animation: 'gradientShift 3s ease infinite'
              }}>
                NERVOUS RECORDS
              </span>
            </p>
          </div>

          {/* Videos Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '30px',
            marginTop: '40px'
          }}>
            {videos.map((video, index) => (
              <div
                key={index}
                className="video-card"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{
                  position: 'relative',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  background: 'var(--dark-bg-tertiary)',
                  transition: 'all 0.3s ease',
                  transform: hoveredIndex === index ? 'translateY(-10px)' : 'translateY(0)',
                  boxShadow: hoveredIndex === index
                    ? '0 20px 40px rgba(0, 217, 255, 0.3)'
                    : '0 5px 15px rgba(0, 0, 0, 0.5)',
                }}
              >
                {/* Video Container */}
                <div style={{
                  position: 'relative',
                  aspectRatio: '9/16',
                  background: '#000',
                  overflow: 'hidden'
                }}>
                  <video
                    src={getCloudinaryVideoUrl(video.publicId)}
                    poster={getCloudinaryThumbnail(video.publicId)}
                    loop
                    playsInline
                    controls
                    controlsList="nodownload"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />

                  {/* Blue Filter Overlay */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(135deg, rgba(0, 217, 255, 0.2) 0%, rgba(0, 153, 204, 0.15) 50%, rgba(138, 43, 226, 0.1) 100%)',
                    mixBlendMode: 'multiply',
                    pointerEvents: 'none'
                  }} />

                  {/* Play Icon Overlay */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: hoveredIndex === index ? 0 : 1,
                    transition: 'opacity 0.3s ease',
                    pointerEvents: 'none'
                  }}>
                    <div style={{
                      width: '70px',
                      height: '70px',
                      borderRadius: '50%',
                      background: 'rgba(0, 217, 255, 0.3)',
                      backdropFilter: 'blur(10px)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '3px solid rgba(0, 217, 255, 0.6)'
                    }}>
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="var(--primary-color)">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Video Info */}
                <div style={{
                  padding: '20px',
                  background: 'linear-gradient(180deg, rgba(10, 10, 10, 0.95) 0%, rgba(0, 0, 0, 0.98) 100%)'
                }}>
                  <h3 style={{
                    background: 'linear-gradient(90deg, #00d9ff 0%, #00ffff 50%, #00d9ff 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    fontSize: '1.1rem',
                    fontWeight: '700',
                    marginBottom: '8px',
                    letterSpacing: '0.5px',
                    backgroundSize: '200% auto',
                    animation: 'gradientShift 3s linear infinite'
                  }}>
                    {video.title}
                  </h3>
                  <p style={{
                    color: 'var(--text-secondary)',
                    fontSize: '0.9rem',
                    margin: 0
                  }}>
                    {video.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Nervous Records Badge */}
          <div style={{
            textAlign: 'center',
            marginTop: '60px',
            padding: '30px',
            background: 'linear-gradient(135deg, rgba(0, 217, 255, 0.05) 0%, rgba(138, 43, 226, 0.05) 100%)',
            borderRadius: '16px',
            border: '1px solid rgba(0, 217, 255, 0.2)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '15px',
              flexWrap: 'wrap'
            }}>
              <Image
                src="/assets/images/kuff-white.png"
                alt="KUFF"
                width={60}
                height={60}
                style={{
                  filter: 'drop-shadow(0 0 20px rgba(0, 217, 255, 0.5))'
                }}
              />
              <div style={{ textAlign: 'left' }}>
                <p style={{
                  color: 'var(--text-secondary)',
                  fontSize: '0.9rem',
                  margin: 0,
                  textTransform: 'uppercase',
                  letterSpacing: '2px'
                }}>
                  Officially Released on
                </p>
                <p style={{
                  background: 'linear-gradient(90deg, #ffd700 0%, #ffed4e 50%, #ffd700 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontSize: '1.5rem',
                  fontWeight: '900',
                  margin: 0,
                  letterSpacing: '3px',
                  textShadow: '0 0 20px rgba(255, 215, 0, 0.5)',
                  backgroundSize: '200% auto',
                  animation: 'gradientShift 3s linear infinite'
                }}>
                  NERVOUS RECORDS
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .video-card {
          cursor: pointer;
        }

        .video-card:hover {
          border: 2px solid var(--primary-color);
        }

        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        @media (max-width: 768px) {
          .visual-section {
            padding-top: 100px !important;
            padding-bottom: 60px !important;
          }

          .section-header {
            margin-bottom: 40px !important;
          }

          .section-title {
            font-size: 2.5rem !important;
          }
        }
      `}</style>
    </>
  );
}
