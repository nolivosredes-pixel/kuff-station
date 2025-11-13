'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Navigation from '@/components/Navigation';

// Cloudinary video configuration
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dvpsdkep2';

interface Video {
  publicId: string;
  title: string;
  description: string;
  id: string;
}

// Videos uploaded to Cloudinary
const videos: Video[] = [
  { publicId: 'REEL_1_compressed_xyzub5', title: 'Visual Performance', description: 'Live Energy', id: 'reel-1' },
  { publicId: 'REEL_2_compressed_ntpptd', title: 'Tech House Vibes', description: 'Peak Hour', id: 'reel-2' },
  { publicId: 'REEL_4_compressed_gnqyv3', title: 'Live Set', description: 'Underground', id: 'reel-4' },
  { publicId: 'REEL_5_compressed_pe6fwz', title: 'Festival Energy', description: 'Main Stage', id: 'reel-5' },
  { publicId: 'REEL_6_compressed_mzlnm1', title: 'Club Night', description: 'Dark Room', id: 'reel-6' },
  { publicId: 'REEL_7_compressed_aisuvb', title: 'Minimal Bass', description: 'Deep Grooves', id: 'reel-7' },
  { publicId: 'REEL_8_compressed_dxx62m', title: 'Underground', description: 'Raw Energy', id: 'reel-8' },
  { publicId: 'REEL_9_compressed_ze6lqx', title: 'Peak Time', description: 'Crowd Control', id: 'reel-9' },
  { publicId: 'REEL_10_compressed_tz5b3q', title: 'Indie Dance', description: 'Melodic Beats', id: 'reel-10' },
  { publicId: 'REEL_14_compressed_daj3ay', title: 'Special Set', description: 'Exclusive', id: 'reel-14' },
];

export default function VisualPage() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [showShareMenu, setShowShareMenu] = useState<number | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [selectedVideoIndex, setSelectedVideoIndex] = useState<number | null>(null);

  const getCloudinaryVideoUrl = (publicId: string) => {
    return `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/q_auto,f_auto,w_800,ar_9:16,c_fill/${publicId}.mp4`;
  };

  const getCloudinaryThumbnail = (publicId: string) => {
    return `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/q_auto,f_auto,w_800,ar_9:16,c_fill,so_2/${publicId}.jpg`;
  };

  const getShareUrl = (videoId: string) => {
    return `https://kuffdj.net/visual#${videoId}`;
  };

  const handleShare = (video: Video, platform: string) => {
    const shareUrl = getShareUrl(video.id);
    const text = `Check out "${video.title}" by KUFF - ${video.description}`;

    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + shareUrl)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(shareUrl);
        setCopiedIndex(videos.indexOf(video));
        setTimeout(() => setCopiedIndex(null), 2000);
        break;
    }
  };

  // Close share menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowShareMenu(null);
    };

    if (showShareMenu !== null) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showShareMenu]);

  // Scroll to video if hash in URL
  useEffect(() => {
    const hash = window.location.hash.substring(1);
    if (hash) {
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);
    }
  }, []);

  // Handle keyboard navigation for modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedVideoIndex === null) return;

      if (e.key === 'Escape') {
        setSelectedVideoIndex(null);
      } else if (e.key === 'ArrowLeft') {
        setSelectedVideoIndex((prev) => (prev === null || prev === 0 ? videos.length - 1 : prev - 1));
      } else if (e.key === 'ArrowRight') {
        setSelectedVideoIndex((prev) => (prev === null || prev === videos.length - 1 ? 0 : prev + 1));
      }
    };

    if (selectedVideoIndex !== null) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [selectedVideoIndex]);

  const handleVideoClick = (index: number) => {
    setSelectedVideoIndex(index);
  };

  const handlePrevVideo = () => {
    setSelectedVideoIndex((prev) => (prev === null || prev === 0 ? videos.length - 1 : prev - 1));
  };

  const handleNextVideo = () => {
    setSelectedVideoIndex((prev) => (prev === null || prev === videos.length - 1 ? 0 : prev + 1));
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
                id={video.id}
                className="video-card"
                onClick={() => handleVideoClick(index)}
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
                    muted
                    playsInline
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      pointerEvents: 'none'
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
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <h3 style={{
                      background: 'linear-gradient(90deg, #00d9ff 0%, #00ffff 50%, #00d9ff 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      fontSize: '1.1rem',
                      fontWeight: '700',
                      letterSpacing: '0.5px',
                      backgroundSize: '200% auto',
                      animation: 'gradientShift 3s linear infinite',
                      margin: 0,
                      flex: 1
                    }}>
                      {video.title}
                    </h3>

                    {/* Share Button */}
                    <div style={{ position: 'relative' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowShareMenu(showShareMenu === index ? null : index);
                        }}
                        style={{
                          background: 'rgba(0, 217, 255, 0.1)',
                          border: '1px solid rgba(0, 217, 255, 0.3)',
                          borderRadius: '8px',
                          padding: '8px 12px',
                          color: 'var(--primary-color)',
                          cursor: 'pointer',
                          fontSize: '0.85rem',
                          fontWeight: '600',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(0, 217, 255, 0.2)';
                          e.currentTarget.style.borderColor = 'var(--primary-color)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(0, 217, 255, 0.1)';
                          e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.3)';
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="18" cy="5" r="3"/>
                          <circle cx="6" cy="12" r="3"/>
                          <circle cx="18" cy="19" r="3"/>
                          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                        </svg>
                        Share
                      </button>

                      {/* Share Menu */}
                      {showShareMenu === index && (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            position: 'absolute',
                            top: '110%',
                            right: 0,
                            background: 'rgba(10, 10, 10, 0.98)',
                            border: '1px solid rgba(0, 217, 255, 0.3)',
                            borderRadius: '12px',
                            padding: '12px',
                            minWidth: '200px',
                            zIndex: 100,
                            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)'
                          }}
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleShare(video, 'twitter');
                            }}
                            style={{
                              width: '100%',
                              background: 'transparent',
                              border: 'none',
                              color: 'var(--text-primary)',
                              padding: '10px 12px',
                              textAlign: 'left',
                              cursor: 'pointer',
                              borderRadius: '8px',
                              fontSize: '0.9rem',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              marginBottom: '4px'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = 'rgba(0, 217, 255, 0.1)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'transparent';
                            }}
                          >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                            </svg>
                            Twitter
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleShare(video, 'facebook');
                            }}
                            style={{
                              width: '100%',
                              background: 'transparent',
                              border: 'none',
                              color: 'var(--text-primary)',
                              padding: '10px 12px',
                              textAlign: 'left',
                              cursor: 'pointer',
                              borderRadius: '8px',
                              fontSize: '0.9rem',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              marginBottom: '4px'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = 'rgba(0, 217, 255, 0.1)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'transparent';
                            }}
                          >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                            </svg>
                            Facebook
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleShare(video, 'whatsapp');
                            }}
                            style={{
                              width: '100%',
                              background: 'transparent',
                              border: 'none',
                              color: 'var(--text-primary)',
                              padding: '10px 12px',
                              textAlign: 'left',
                              cursor: 'pointer',
                              borderRadius: '8px',
                              fontSize: '0.9rem',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              marginBottom: '4px'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = 'rgba(0, 217, 255, 0.1)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'transparent';
                            }}
                          >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                            </svg>
                            WhatsApp
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleShare(video, 'copy');
                            }}
                            style={{
                              width: '100%',
                              background: 'transparent',
                              border: 'none',
                              color: copiedIndex === index ? '#4ade80' : 'var(--text-primary)',
                              padding: '10px 12px',
                              textAlign: 'left',
                              cursor: 'pointer',
                              borderRadius: '8px',
                              fontSize: '0.9rem',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px'
                            }}
                            onMouseEnter={(e) => {
                              if (copiedIndex !== index) {
                                e.currentTarget.style.background = 'rgba(0, 217, 255, 0.1)';
                              }
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'transparent';
                            }}
                          >
                            {copiedIndex === index ? (
                              <>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <polyline points="20 6 9 17 4 12"/>
                                </svg>
                                Copied!
                              </>
                            ) : (
                              <>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                                </svg>
                                Copy Link
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

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

      {/* Video Modal */}
      {selectedVideoIndex !== null && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0, 0, 0, 0.95)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'fadeIn 0.3s ease'
          }}
          onClick={() => setSelectedVideoIndex(null)}
        >
          {/* Close Button */}
          <button
            onClick={() => setSelectedVideoIndex(null)}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'rgba(0, 217, 255, 0.1)',
              border: '2px solid rgba(0, 217, 255, 0.3)',
              borderRadius: '50%',
              width: '50px',
              height: '50px',
              color: 'var(--primary-color)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              transition: 'all 0.3s ease',
              zIndex: 10001
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(0, 217, 255, 0.2)';
              e.currentTarget.style.borderColor = 'var(--primary-color)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(0, 217, 255, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.3)';
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>

          {/* Previous Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrevVideo();
            }}
            style={{
              position: 'absolute',
              left: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(0, 217, 255, 0.1)',
              border: '2px solid rgba(0, 217, 255, 0.3)',
              borderRadius: '50%',
              width: '60px',
              height: '60px',
              color: 'var(--primary-color)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              transition: 'all 0.3s ease',
              zIndex: 10001
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(0, 217, 255, 0.2)';
              e.currentTarget.style.borderColor = 'var(--primary-color)';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(0, 217, 255, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.3)';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>

          {/* Next Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNextVideo();
            }}
            style={{
              position: 'absolute',
              right: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(0, 217, 255, 0.1)',
              border: '2px solid rgba(0, 217, 255, 0.3)',
              borderRadius: '50%',
              width: '60px',
              height: '60px',
              color: 'var(--primary-color)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              transition: 'all 0.3s ease',
              zIndex: 10001
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(0, 217, 255, 0.2)';
              e.currentTarget.style.borderColor = 'var(--primary-color)';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(0, 217, 255, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.3)';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>

          {/* Video Container */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '90vw',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '20px',
              animation: 'scaleIn 0.3s ease'
            }}
          >
            {/* Video */}
            <div style={{
              position: 'relative',
              maxHeight: '80vh',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 20px 60px rgba(0, 217, 255, 0.3)',
              border: '2px solid rgba(0, 217, 255, 0.3)'
            }}>
              <video
                key={selectedVideoIndex}
                src={getCloudinaryVideoUrl(videos[selectedVideoIndex].publicId)}
                autoPlay
                loop
                controls
                playsInline
                style={{
                  maxWidth: '90vw',
                  maxHeight: '80vh',
                  display: 'block'
                }}
              />
            </div>

            {/* Video Info */}
            <div style={{
              textAlign: 'center',
              maxWidth: '600px',
              padding: '20px',
              background: 'rgba(10, 10, 10, 0.8)',
              borderRadius: '12px',
              border: '1px solid rgba(0, 217, 255, 0.3)'
            }}>
              <h3 style={{
                background: 'linear-gradient(90deg, #00d9ff 0%, #00ffff 50%, #00d9ff 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontSize: '1.5rem',
                fontWeight: '700',
                marginBottom: '10px',
                backgroundSize: '200% auto',
                animation: 'gradientShift 3s linear infinite'
              }}>
                {videos[selectedVideoIndex].title}
              </h3>
              <p style={{
                color: 'var(--text-secondary)',
                fontSize: '1rem',
                margin: 0
              }}>
                {videos[selectedVideoIndex].description}
              </p>
              <p style={{
                color: 'var(--text-muted)',
                fontSize: '0.9rem',
                marginTop: '10px'
              }}>
                {selectedVideoIndex + 1} / {videos.length}
              </p>
            </div>
          </div>
        </div>
      )}

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

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
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
