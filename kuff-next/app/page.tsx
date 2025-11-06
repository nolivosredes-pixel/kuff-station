"use client";

import Image from "next/image";
import Link from "next/link";
import EventsSection from "@/components/EventsSection";
import Navigation from "@/components/Navigation";
import GallerySection from "@/components/GallerySection";
import FallingIcons from "@/components/FallingIcons";

export default function Home() {
  return (
    <>
      <Navigation />

      {/* Hero Section */}
      <section id="home" className="hero">
        <video className="hero-video" autoPlay loop muted playsInline>
          <source src="/assets/images/Video Project 21.mp4" type="video/mp4" />
        </video>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-logo">
            <Image
              src="/assets/images/kuff-white.png"
              alt="KUFF"
              className="hero-logo-img"
              width={400}
              height={400}
              priority
            />
          </div>
          <h1 className="hero-title">International DJ & Producer</h1>
          <p className="hero-subtitle">Minimal Bass, Tech House, Indie Dance</p>
          <div className="hero-cta">
            <Link href="#music" className="btn btn-primary">
              Listen Now
            </Link>
            <Link href="#contact" className="btn btn-secondary">
              Book Me
            </Link>
          </div>
        </div>
        <div className="scroll-indicator">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">About KUFF</h2>
            <div className="title-underline"></div>
          </div>
          <div className="about-content">
            <div className="about-text">
              <p className="lead">
                Since 2011, KUFF has been delivering his unique energy and unmistakable sound to dance floors around the world.
              </p>
              <p>
                Specializing in <strong>Minimal Bass, Tech House, and Indie Dance</strong>, his style is crafted to create a deep connection with the audience, turning every set into an unforgettable experience.
              </p>
              <p>
                With performances spanning across Argentina, Colombia, Peru, Guatemala, Costa Rica, Brazil, Uruguay, Chile, Mexico, the United States, Spain, and France, among others, KUFF has proven himself as a global artist who captivates audiences everywhere he goes.
              </p>
              <p>
                His talent extends to his productions, signed to renowned labels such as <strong>Hellbent Records, Repopulate Mars, and CUFF</strong>, showcasing his ability to innovate and set trends with every release.
              </p>
              <p className="highlight">
                KUFF's approach behind the decks is clear: to energize, exchange emotions, and keep the crowd moving nonstop. His signature groove guarantees a musical journey that takes the audience to its ultimate peak.
              </p>
            </div>
            <div className="about-stats">
              <div className="stat-item">
                <div className="stat-number">14+</div>
                <div className="stat-label">Years of Experience</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">12+</div>
                <div className="stat-label">Countries</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">3</div>
                <div className="stat-label">Major Labels</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Parallax Gallery Section */}
      <GallerySection />

      {/* Supported By Section */}
      <section className="supported-by">
        <div className="container">
          <h3 className="supported-title">Supported By</h3>
          <div className="supported-artists">
            <span>Cloonee</span>
            <span>Paco Osuna</span>
            <span>The Martinez Brothers</span>
            <span>Loco Dice</span>
            <span>Marco Carola</span>
            <span>Jamie Jones</span>
            <span>Franky Rizardo</span>
            <span>Syreeta</span>
          </div>
        </div>
      </section>

      {/* KUFF Music Hub Section */}
      <section id="music-hub" className="music-hub">
        <div className="music-hub-header">
          <div className="container">
            <div className="hub-content">
              <div className="hub-image">
                <Image
                  src="/assets/images/kuff-white.png"
                  alt="KUFF"
                  className="hub-logo"
                  width={300}
                  height={300}
                />
              </div>
              <div className="hub-text">
                <h2 className="hub-title">KUFF Music Hub</h2>
                <p className="hub-subtitle">Listen to my latest tracks, mixes, and releases</p>
                <button className="hub-cta" onClick={() => document.getElementById('soundcloud-player')?.scrollIntoView({ behavior: 'smooth' })}>
                  <span>Escuchar Ahora</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="soundcloud-player-section" id="soundcloud-player">
          <div className="container">
            <div className="player-wrapper">
              <iframe
                style={{ borderRadius: '12px' }}
                src="https://open.spotify.com/embed/artist/7EweleO43shWafWUjYQwmx?utm_source=generator&theme=0"
                width="100%"
                height="352"
                frameBorder="0"
                allowFullScreen
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
              ></iframe>
            </div>

            <div className="player-wrapper">
              <iframe
                width="100%"
                height="450"
                scrolling="no"
                frameBorder="no"
                allow="autoplay"
                src="https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/kuffdj&color=%2300d9ff&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"
              ></iframe>
            </div>

            {/* YouTube Videos */}
            {['e9PDVqLDkPw', 'YdLvREdVBpQ', 'zn1GdslyqNo'].map((videoId) => (
              <div key={videoId} className="player-wrapper">
                <iframe
                  width="100%"
                  height="352"
                  src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                  style={{ borderRadius: '12px' }}
                ></iframe>
              </div>
            ))}
          </div>
        </div>

        {/* Background Animation */}
        <div className="sound-waves">
          <div className="wave wave-1"></div>
          <div className="wave wave-2"></div>
          <div className="wave wave-3"></div>
        </div>

        {/* Falling Icons Animation */}
        <FallingIcons />
      </section>

      {/* Music Section */}
      <section id="music" className="music">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Music & Platforms</h2>
            <div className="title-underline"></div>
          </div>
          <div className="music-platforms">
            <a href="https://open.spotify.com/artist/7EweleO43shWafWUjYQwmx" className="platform-card" target="_blank" rel="noopener noreferrer">
              <div className="platform-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                </svg>
              </div>
              <h4>Spotify</h4>
              <p>Stream on Spotify</p>
            </a>
            <a href="https://soundcloud.com/kuffdj" className="platform-card" target="_blank" rel="noopener noreferrer">
              <div className="platform-icon">
                <svg viewBox="0 0 512 512" fill="currentColor">
                  <path d="M502.1 256c0 58.8-47.7 106.5-106.5 106.5h-179c-11 0-20-9-20-20s9-20 20-20h179c36.8 0 66.5-29.8 66.5-66.5 0-36.2-29-65.8-65.1-66.5-11-.2-19.9-9.3-19.9-20.3 0-70.3-57.2-127.5-127.5-127.5-49.7 0-94.6 28.6-116.3 72.8-3.5 7.1-10.6 11.7-18.5 12-43 1.4-77.5 36.3-77.5 79.5 0 43.9 35.6 79.5 79.5 79.5h59.8c11 0 20 9 20 20s-9 20-20 20H116.7C64.4 305.5 22.2 263.3 22.2 211s42.2-94.5 94.5-94.5c1.7 0 3.3.1 5 .2C148.5 52.4 200.7 2 263.7 2c70.1 0 129.1 47.7 146.9 112.5 56.5 9.6 99.5 59.2 99.5 118.3z"/>
                </svg>
              </div>
              <h4>SoundCloud</h4>
              <p>Listen on SoundCloud</p>
            </a>
            <a href="https://www.youtube.com/@KUFFDJ" className="platform-card" target="_blank" rel="noopener noreferrer">
              <div className="platform-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </div>
              <h4>YouTube</h4>
              <p>Watch Video Sets</p>
            </a>
          </div>

          <div className="labels-section">
            <h3>Released On</h3>
            <div className="labels">
              <div className="label-logo">
                <Image src="/assets/images/Hellbent_Clean_2.webp" alt="Hellbent Records" width={150} height={80} style={{ objectFit: 'contain' }} />
              </div>
              <div className="label-logo">
                <Image src="/assets/images/rpm-logo.webp" alt="Repopulate Mars" width={150} height={80} style={{ objectFit: 'contain' }} />
              </div>
              <div className="label-logo">
                <Image src="/assets/images/cuff.png" alt="CUFF" width={150} height={80} style={{ objectFit: 'contain' }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tour Section with Events */}
      <EventsSection />

      {/* Contact Section */}
      <section id="contact" className="contact">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Get In Touch</h2>
            <div className="title-underline"></div>
          </div>
          <div className="contact-content">
            <div className="contact-info">
              <h3>Management & Booking</h3>
              <a href="mailto:mgmt@kuffdj.net" className="contact-email" title="Contact KUFF Management">
                mgmt@kuffdj.net
              </a>
            </div>
            <div className="social-links">
              <h3>Follow KUFF</h3>
              <div className="social-icons">
                <a href="https://www.instagram.com/kuffdj" className="social-icon" target="_blank" rel="noopener" aria-label="Instagram">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a href="https://open.spotify.com/artist/7EweleO43shWafWUjYQwmx" className="social-icon" target="_blank" rel="noopener" aria-label="Spotify">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                  </svg>
                </a>
                <a href="https://soundcloud.com/kuffdj" className="social-icon" target="_blank" rel="noopener" aria-label="SoundCloud">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7 17.939h-1v-8.068c.308-.231.639-.429 1-.566v8.634zm3 0h1v-9.224c-.229.265-.443.548-.621.857l-.379-.184v8.551zm-2 0h1v-8.848c-.508-.079-.623-.05-1-.01v8.858zm-4 0h1v-7.02c-.312.458-.555.971-.692 1.535l-.308-.182v5.667zm-3-5.25c-.606.547-1 1.354-1 2.268 0 .914.394 1.721 1 2.268v-4.536zm18.879-.671c-.204-2.837-2.404-5.079-5.117-5.079-1.022 0-1.964.328-2.762.877v10.123h9.089c1.607 0 2.911-1.393 2.911-3.106 0-2.233-2.168-3.772-4.121-2.815zm-16.879-.027v-2.202c.596.232 1.096.63 1.466 1.133-.313.386-.566.824-.734 1.303l-.732-.234zm1 0c.4-1.32 1.3-2.314 2.466-2.748v2.931l-2.466-.183zm7-2.859c.314-.288.671-.526 1.066-.712v3.33l-1.066-.116v-2.502zm-2 .661v2.931l-1.577-.117c-.126-.379-.304-.722-.556-1.013.427-.849 1.158-1.527 2.133-1.801zm-6 4.116v-1.711l-.866-.279c-.119.394-.189.809-.189 1.237 0 .393.055.771.156 1.127l.899-.374zm2 0v-1.672l-.996-.078c-.094.28-.144.579-.144.889 0 .328.061.639.172.927l.968-.066zm2 0v-1.71l-1 .109v1.172l1 .429zm4 0v-1.173c-.33-.04-.66-.076-1-.109v1.392l1-.11zm2 0v-1.77c.456.15.9.358 1.33.615-.257.44-.596.8-1.004 1.057l-.326-.902z"/>
                  </svg>
                </a>
                <a href="https://wa.me/573056840433" className="social-icon" target="_blank" rel="noopener" aria-label="WhatsApp">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-logo">
              <Image src="/assets/images/kuff-white.png" alt="KUFF Logo" width={50} height={50} />
            </div>
            <p className="footer-text">&copy; 2025 KUFF. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
