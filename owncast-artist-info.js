// KUFF - Owncast Artist Info & Music Visualizer
// Paste this in Owncast Admin → Appearance → Custom Javascript

(function() {
  'use strict';

  // Hide unwanted Owncast elements
  function hideOwncastBranding() {
    const hideSelectors = [
      '[class*="statusbar"]',
      '[class*="streamDetails"]',
      '.ant-statistic',
      '.ant-statistic-content',
      'time',
      '[class*="streamStart"]'
    ];

    hideSelectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => {
        el.style.display = 'none';
      });
    });

    // Hide text containing specific phrases
    const textNodes = document.evaluate(
      "//text()[contains(., 'Streaming on Owncast') or contains(., 'Started')]",
      document,
      null,
      XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
      null
    );

    for (let i = 0; i < textNodes.snapshotLength; i++) {
      const node = textNodes.snapshotItem(i);
      if (node.parentElement) {
        node.parentElement.style.display = 'none';
      }
    }
  }

  // Create artist info overlay
  function createArtistInfo() {
    // Remove existing if any
    const existing = document.querySelector('.kuff-artist-info');
    if (existing) existing.remove();

    const artistInfo = document.createElement('div');
    artistInfo.className = 'kuff-artist-info';
    artistInfo.innerHTML = `
      <div class="kuff-pulse-circle" style="animation-delay: 0s;"></div>
      <div class="kuff-pulse-circle" style="animation-delay: 1s;"></div>
      <div class="kuff-pulse-circle" style="animation-delay: 2s;"></div>

      <h1 class="kuff-artist-name">KUFF</h1>
      <p class="kuff-artist-title">International DJ & Producer</p>

      <div class="kuff-genres">
        <span class="kuff-genre-tag">Minimal Bass</span>
        <span class="kuff-genre-tag">Tech House</span>
        <span class="kuff-genre-tag">Indie Dance</span>
      </div>

      <div class="kuff-status-badge">
        🔴 LIVE NOW
      </div>
    `;

    document.body.appendChild(artistInfo);
  }

  // Create music visualizer bars
  function createVisualizer() {
    const existing = document.querySelector('.kuff-visualizer');
    if (existing) return;

    const visualizer = document.createElement('div');
    visualizer.className = 'kuff-visualizer';

    // Create 40 bars
    for (let i = 0; i < 40; i++) {
      const bar = document.createElement('div');
      bar.className = 'kuff-bar';
      bar.style.height = '10px';
      visualizer.appendChild(bar);
    }

    document.body.appendChild(visualizer);

    // Animate bars to simulate music reactivity
    animateVisualizer();
  }

  // Animate visualizer bars
  function animateVisualizer() {
    const bars = document.querySelectorAll('.kuff-bar');

    setInterval(() => {
      bars.forEach((bar, index) => {
        // Create wave pattern
        const wave1 = Math.sin(Date.now() / 300 + index / 3) * 50;
        const wave2 = Math.sin(Date.now() / 500 + index / 5) * 30;
        const randomness = Math.random() * 20;

        const height = Math.abs(wave1 + wave2 + randomness) + 10;
        bar.style.height = `${height}px`;

        // Vary opacity for depth
        bar.style.opacity = (height / 100) + 0.3;
      });
    }, 50);
  }

  // Create floating particles
  function createParticles() {
    setInterval(() => {
      const particle = document.createElement('div');
      particle.className = 'kuff-particle';

      // Random starting position
      const startX = Math.random() * window.innerWidth;
      particle.style.left = startX + 'px';
      particle.style.bottom = '0';

      // Random drift amount
      const driftX = (Math.random() - 0.5) * 200;
      particle.style.setProperty('--float-x', driftX + 'px');

      // Random duration
      const duration = 5 + Math.random() * 10;
      particle.style.animationDuration = duration + 's';

      document.body.appendChild(particle);

      // Remove after animation
      setTimeout(() => particle.remove(), duration * 1000);
    }, 300);
  }

  // Add pulsing effect to artist name based on beat
  function addBeatPulse() {
    const artistName = document.querySelector('.kuff-artist-name');
    if (!artistName) return;

    // Simulate beat detection (120 BPM = 500ms per beat)
    const bpm = 120;
    const beatInterval = 60000 / bpm;

    setInterval(() => {
      artistName.style.transform = 'scale(1.1)';
      setTimeout(() => {
        artistName.style.transform = 'scale(1)';
      }, 100);
    }, beatInterval);
  }

  // Add genre tag hover effects
  function addGenreEffects() {
    document.querySelectorAll('.kuff-genre-tag').forEach((tag, index) => {
      // Staggered glow animation
      setInterval(() => {
        tag.style.boxShadow = '0 0 20px rgba(0, 217, 255, 0.6)';
        setTimeout(() => {
          tag.style.boxShadow = 'none';
        }, 200);
      }, 3000 + (index * 500));
    });
  }

  // Reactive background color shift
  function addBackgroundPulse() {
    let hue = 180; // Cyan base

    setInterval(() => {
      hue = (hue + 0.5) % 360;
      const saturation = 50 + Math.sin(Date.now() / 1000) * 20;
      const lightness = 5 + Math.sin(Date.now() / 2000) * 2;

      document.body.style.background = `
        linear-gradient(135deg,
          hsl(${hue}, ${saturation}%, ${lightness}%) 0%,
          hsl(${hue - 10}, ${saturation - 10}%, ${lightness + 2}%) 50%,
          hsl(${hue + 10}, ${saturation}%, ${lightness}%) 100%
        )
      `;
    }, 100);
  }

  // Initialize everything
  function init() {
    console.log('🎵 KUFF Artist Info & Visualizer Loading...');

    // Initial setup
    hideOwncastBranding();
    createArtistInfo();
    createVisualizer();
    createParticles();

    // Start animations
    setTimeout(() => {
      addBeatPulse();
      addGenreEffects();
      addBackgroundPulse();
    }, 1000);

    // Re-hide branding periodically (in case Owncast re-renders)
    setInterval(hideOwncastBranding, 2000);

    console.log('✅ KUFF Artist Info & Visualizer Ready!');
  }

  // Wait for page to load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
