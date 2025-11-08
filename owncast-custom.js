// KUFF DJ - Custom Owncast Page Styling
// Insert this code in Owncast Admin → Appearance → Custom Javascript

(function() {
  'use strict';

  // Inject custom CSS styles
  const injectStyles = () => {
    const styleId = 'kuff-custom-styles';
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      /* KUFF Color Scheme - Cyan Theme */
      :root {
        --kuff-cyan: #00d9ff;
        --kuff-cyan-dark: #0099cc;
        --kuff-cyan-light: #00ffff;
        --kuff-bg-dark: #000000;
        --kuff-bg-darker: #0a0a0a;
      }

      /* Main Background */
      body {
        background: linear-gradient(135deg, #000000 0%, #0a0a0a 50%, #000814 100%) !important;
        font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif !important;
        position: relative;
        overflow-x: hidden;
      }

      /* Background Gradient Overlay */
      body::before {
        content: '';
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background:
          radial-gradient(circle at 20% 50%, rgba(0, 217, 255, 0.08) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(0, 153, 204, 0.08) 0%, transparent 50%);
        animation: kuff-pulse 8s ease-in-out infinite;
        pointer-events: none;
        z-index: 0;
      }

      @keyframes kuff-pulse {
        0%, 100% { opacity: 0.5; }
        50% { opacity: 1; }
      }

      /* Animated Background Shapes */
      .kuff-bg-shapes {
        position: fixed;
        inset: 0;
        overflow: hidden;
        z-index: 0;
        pointer-events: none;
      }

      .kuff-shape {
        position: absolute;
        background: rgba(0, 217, 255, 0.03);
        border-radius: 50%;
        border: 1px solid rgba(0, 217, 255, 0.1);
      }

      .kuff-shape:nth-child(1) {
        width: 300px;
        height: 300px;
        top: -150px;
        right: -150px;
        animation: kuff-float 6s ease-in-out infinite;
      }

      .kuff-shape:nth-child(2) {
        width: 200px;
        height: 200px;
        bottom: -100px;
        left: -100px;
        animation: kuff-float 8s ease-in-out infinite reverse;
      }

      .kuff-shape:nth-child(3) {
        width: 250px;
        height: 250px;
        top: 50%;
        left: 50%;
        animation: kuff-float 7s ease-in-out infinite;
      }

      @keyframes kuff-float {
        0%, 100% { transform: translateY(0px) translateX(0px); }
        33% { transform: translateY(-20px) translateX(10px); }
        66% { transform: translateY(10px) translateX(-10px); }
      }

      /* Header & Logo Styling */
      header,
      .header {
        position: relative;
        z-index: 10;
        background: rgba(0, 0, 0, 0.5) !important;
        backdrop-filter: blur(10px);
        border-bottom: 2px solid rgba(0, 217, 255, 0.2) !important;
      }

      /* Logo Glow Effect */
      .logo,
      img[alt*="logo"],
      img[src*="logo"] {
        filter:
          drop-shadow(0 0 20px rgba(0, 217, 255, 0.5))
          drop-shadow(0 0 40px rgba(0, 217, 255, 0.3))
          drop-shadow(0 0 60px rgba(0, 217, 255, 0.2)) !important;
        animation: kuff-logo-glow 2s ease-in-out infinite;
      }

      @keyframes kuff-logo-glow {
        0%, 100% {
          filter:
            drop-shadow(0 0 20px rgba(0, 217, 255, 0.5))
            drop-shadow(0 0 40px rgba(0, 217, 255, 0.3))
            drop-shadow(0 0 60px rgba(0, 217, 255, 0.2));
        }
        50% {
          filter:
            drop-shadow(0 0 40px rgba(0, 217, 255, 0.8))
            drop-shadow(0 0 80px rgba(0, 217, 255, 0.5))
            drop-shadow(0 0 120px rgba(0, 255, 255, 0.3));
        }
      }

      /* Video Player Container */
      #video-container,
      .video-container,
      video {
        position: relative;
        z-index: 10;
        border-radius: 20px !important;
        overflow: hidden;
        box-shadow: 0 20px 60px rgba(0, 217, 255, 0.2) !important;
        border: 2px solid rgba(0, 217, 255, 0.3) !important;
      }

      /* Online/Offline Status Badge */
      .online-indicator,
      .status-indicator,
      [class*="status"] {
        background: linear-gradient(135deg, #51cf66 0%, #37b24d 100%) !important;
        color: white !important;
        padding: 8px 20px;
        border-radius: 50px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 1px;
        box-shadow: 0 0 30px rgba(81, 207, 102, 0.6);
        animation: kuff-status-pulse 2s ease-in-out infinite;
      }

      @keyframes kuff-status-pulse {
        0%, 100% {
          box-shadow: 0 0 30px rgba(81, 207, 102, 0.6);
        }
        50% {
          box-shadow: 0 0 50px rgba(81, 207, 102, 0.9);
        }
      }

      /* Offline Badge */
      .offline-indicator {
        background: linear-gradient(135deg, #868e96 0%, #495057 100%) !important;
        box-shadow: none !important;
      }

      /* Buttons & Interactive Elements */
      button,
      .button,
      a.button,
      [role="button"] {
        background: var(--kuff-cyan) !important;
        color: #000000 !important;
        border: none !important;
        border-radius: 50px !important;
        font-weight: 600 !important;
        text-transform: uppercase;
        letter-spacing: 1px;
        transition: all 0.3s ease !important;
        box-shadow: 0 10px 30px rgba(0, 217, 255, 0.3) !important;
      }

      button:hover,
      .button:hover,
      a.button:hover,
      [role="button"]:hover {
        background: var(--kuff-cyan-light) !important;
        transform: translateY(-3px);
        box-shadow: 0 15px 40px rgba(0, 217, 255, 0.5) !important;
      }

      /* Chat & Sidebar */
      #chat,
      .chat-container,
      aside {
        background: rgba(0, 0, 0, 0.6) !important;
        backdrop-filter: blur(10px);
        border-left: 2px solid rgba(0, 217, 255, 0.2) !important;
        border-radius: 15px;
      }

      /* Chat Messages */
      .chat-message,
      [class*="message"] {
        background: rgba(0, 0, 0, 0.3) !important;
        border-left: 3px solid var(--kuff-cyan) !important;
        border-radius: 10px;
        margin: 8px 0;
        padding: 10px;
      }

      /* Username in Chat */
      .username,
      [class*="username"] {
        color: var(--kuff-cyan) !important;
        font-weight: 700;
      }

      /* Text Colors */
      h1, h2, h3, h4, h5, h6 {
        color: white !important;
        text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
      }

      p, span, div {
        color: rgba(255, 255, 255, 0.9) !important;
      }

      /* Links */
      a {
        color: var(--kuff-cyan) !important;
        text-decoration: none;
        transition: all 0.3s;
      }

      a:hover {
        color: var(--kuff-cyan-light) !important;
        text-shadow: 0 0 10px rgba(0, 217, 255, 0.5);
      }

      /* Info/Description Boxes */
      .description,
      .info,
      [class*="description"],
      [class*="info"] {
        background: rgba(0, 0, 0, 0.4) !important;
        border-left: 4px solid var(--kuff-cyan) !important;
        border-radius: 10px;
        padding: 15px;
        margin: 15px 0;
      }

      /* Viewer Count */
      .viewer-count,
      [class*="viewer"] {
        background: rgba(0, 217, 255, 0.15) !important;
        color: var(--kuff-cyan) !important;
        padding: 5px 15px;
        border-radius: 20px;
        font-weight: 700;
        border: 2px solid rgba(0, 217, 255, 0.3);
      }

      /* Social Links */
      .social-links a,
      [class*="social"] a {
        background: rgba(0, 217, 255, 0.1) !important;
        border: 2px solid var(--kuff-cyan) !important;
        color: var(--kuff-cyan) !important;
        padding: 10px 20px;
        border-radius: 50px;
        margin: 5px;
        display: inline-block;
        transition: all 0.3s;
      }

      .social-links a:hover,
      [class*="social"] a:hover {
        background: var(--kuff-cyan) !important;
        color: #000000 !important;
        transform: translateY(-2px);
        box-shadow: 0 5px 20px rgba(0, 217, 255, 0.4);
      }

      /* Tags */
      .tag,
      [class*="tag"] {
        background: rgba(0, 217, 255, 0.15) !important;
        color: var(--kuff-cyan) !important;
        border: 1px solid rgba(0, 217, 255, 0.3);
        border-radius: 15px;
        padding: 5px 12px;
        font-size: 0.85em;
      }

      /* Cards/Containers */
      .card,
      [class*="card"] {
        background: rgba(0, 0, 0, 0.5) !important;
        border: 2px solid rgba(0, 217, 255, 0.2) !important;
        border-radius: 15px;
        box-shadow: 0 10px 30px rgba(0, 217, 255, 0.1) !important;
        backdrop-filter: blur(10px);
      }

      /* Input Fields */
      input,
      textarea {
        background: rgba(0, 0, 0, 0.5) !important;
        border: 2px solid rgba(0, 217, 255, 0.3) !important;
        border-radius: 10px !important;
        color: white !important;
        padding: 10px 15px;
      }

      input:focus,
      textarea:focus {
        border-color: var(--kuff-cyan) !important;
        box-shadow: 0 0 20px rgba(0, 217, 255, 0.3) !important;
        outline: none;
      }

      /* Scrollbar Styling */
      ::-webkit-scrollbar {
        width: 10px;
      }

      ::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.3);
      }

      ::-webkit-scrollbar-thumb {
        background: var(--kuff-cyan);
        border-radius: 10px;
      }

      ::-webkit-scrollbar-thumb:hover {
        background: var(--kuff-cyan-light);
      }

      /* LIVE Badge Animation */
      .live-badge {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        background: #ff0000 !important;
        padding: 12px 30px;
        border-radius: 50px;
        font-size: 1.2em;
        font-weight: bold;
        color: white !important;
        animation: kuff-live-pulse 2s infinite;
        box-shadow: 0 5px 25px rgba(255, 0, 0, 0.6), 0 0 40px rgba(0, 217, 255, 0.3);
        border: 2px solid rgba(0, 217, 255, 0.4);
      }

      @keyframes kuff-live-pulse {
        0%, 100% {
          box-shadow: 0 5px 25px rgba(255, 0, 0, 0.6), 0 0 40px rgba(0, 217, 255, 0.3);
        }
        50% {
          box-shadow: 0 8px 35px rgba(255, 0, 0, 0.8), 0 0 60px rgba(0, 217, 255, 0.5);
        }
      }

      /* Mobile Responsive */
      @media (max-width: 768px) {
        .kuff-shape {
          width: 150px !important;
          height: 150px !important;
        }
      }
    `;

    document.head.appendChild(style);
  };

  // Create animated background shapes
  const createBackgroundShapes = () => {
    if (document.querySelector('.kuff-bg-shapes')) return;

    const bgShapes = document.createElement('div');
    bgShapes.className = 'kuff-bg-shapes';

    for (let i = 0; i < 3; i++) {
      const shape = document.createElement('div');
      shape.className = 'kuff-shape';
      bgShapes.appendChild(shape);
    }

    document.body.insertBefore(bgShapes, document.body.firstChild);
  };

  // Update logo to KUFF logo
  const updateLogo = () => {
    const logoImages = document.querySelectorAll('img[alt*="logo"], img[src*="logo"], .logo img, header img');

    logoImages.forEach(img => {
      // Change to KUFF logo - update this URL with your actual logo path
      // For now, just add the glow effect to existing logo
      img.style.animation = 'kuff-logo-glow 2s ease-in-out infinite';
    });

    // Update site title
    const titleElements = document.querySelectorAll('h1, .title, [class*="title"]');
    titleElements.forEach(title => {
      if (title.textContent && !title.textContent.includes('KUFF')) {
        // Optionally add KUFF branding
        // title.textContent = 'KUFF DJ - ' + title.textContent;
      }
    });
  };

  // Add LIVE indicator enhancements
  const enhanceLiveIndicator = () => {
    const liveIndicators = document.querySelectorAll('.online-indicator, .status-indicator, [class*="online"]');

    liveIndicators.forEach(indicator => {
      // Add pulsing dot
      if (!indicator.querySelector('.live-dot')) {
        const dot = document.createElement('span');
        dot.className = 'live-dot';
        dot.style.cssText = `
          display: inline-block;
          width: 10px;
          height: 10px;
          background: white;
          border-radius: 50%;
          margin-right: 8px;
          animation: kuff-blink 1s infinite;
        `;
        indicator.prepend(dot);

        // Add blink animation
        const blinkStyle = document.createElement('style');
        blinkStyle.textContent = `
          @keyframes kuff-blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.3; }
          }
        `;
        document.head.appendChild(blinkStyle);
      }
    });
  };

  // Initialize all customizations
  const init = () => {
    injectStyles();
    createBackgroundShapes();
    updateLogo();
    enhanceLiveIndicator();
  };

  // Run on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Re-run when DOM changes (for dynamic content)
  const observer = new MutationObserver(() => {
    enhanceLiveIndicator();
    updateLogo();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  // Console message
  console.log('%c🎵 KUFF DJ - Owncast Custom Theme Loaded', 'color: #00d9ff; font-size: 16px; font-weight: bold;');
})();
