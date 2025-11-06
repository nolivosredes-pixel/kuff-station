// ========================================
// Navigation & Mobile Menu
// ========================================
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const navbar = document.getElementById('navbar');

// Toggle mobile menu
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ========================================
// Smooth Scrolling
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 70;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ========================================
// Intersection Observer for Scroll Animations
// ========================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});

// ========================================
// Counter Animation for Stats
// ========================================
const animateCounter = (element, target, suffix = '') => {
    let current = 0;
    const increment = target / 100;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + suffix;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + suffix;
        }
    }, 20);
};

// Observe stats section
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const text = stat.textContent;
                const number = parseInt(text);
                const suffix = text.replace(number, '');
                animateCounter(stat, number, suffix);
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const aboutSection = document.querySelector('.about');
if (aboutSection) {
    statsObserver.observe(aboutSection);
}

// ========================================
// Parallax Effect for Hero
// ========================================
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero-content');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        hero.style.opacity = 1 - (scrolled / 700);
    }
});

// ========================================
// Add Hover Sound Effect (Optional)
// ========================================
const buttons = document.querySelectorAll('.btn, .platform-card, .social-icon');
buttons.forEach(button => {
    button.addEventListener('mouseenter', () => {
        button.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    });
});

// ========================================
// Loading Animation
// ========================================
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// ========================================
// Dynamic Year in Footer
// ========================================
const footerText = document.querySelector('.footer-text');
if (footerText) {
    const currentYear = new Date().getFullYear();
    footerText.textContent = `© ${currentYear} KUFF. All rights reserved.`;
}

// ========================================
// Platform Cards Animation on Hover
// ========================================
const platformCards = document.querySelectorAll('.platform-card');
platformCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });

    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// ========================================
// Supported Artists Shuffle Animation
// ========================================
const supportedArtists = document.querySelectorAll('.supported-artists span');
supportedArtists.forEach((artist, index) => {
    artist.style.animation = `fadeIn 0.5s ease ${index * 0.1}s forwards`;
    artist.style.opacity = '0';
});

// ========================================
// Add Active State to Nav Links Based on Scroll
// ========================================
const sections = document.querySelectorAll('section[id]');

const highlightNavLink = () => {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (navLink) {
                navLink.classList.add('active');
            }
        }
    });
};

window.addEventListener('scroll', highlightNavLink);

// ========================================
// Logo Interactive Effects
// ========================================
const heroLogo = document.querySelector('.hero-logo-img');
if (heroLogo) {
    // Click effect - Explosion de luz
    heroLogo.addEventListener('click', () => {
        // Crear ondas de expansión
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                createLogoWave();
            }, i * 200);
        }

        // Efecto de sacudida
        heroLogo.style.animation = 'none';
        setTimeout(() => {
            heroLogo.style.animation = `
                logoGlow 2s ease-in-out infinite,
                logoFloat 4s ease-in-out infinite,
                logoPulse 3s ease-in-out infinite
            `;
        }, 10);
    });

    // Efecto de partículas al pasar el mouse
    heroLogo.addEventListener('mouseenter', () => {
        createLogoParticles();
    });

    // Movimiento con el mouse
    heroLogo.addEventListener('mousemove', (e) => {
        const rect = heroLogo.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        const moveX = x / 20;
        const moveY = y / 20;

        heroLogo.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.05)`;
    });

    heroLogo.addEventListener('mouseleave', () => {
        heroLogo.style.transform = '';
    });
}

// Crear onda de expansión desde el logo
function createLogoWave() {
    const wave = document.createElement('div');
    const logoRect = heroLogo.getBoundingClientRect();

    wave.style.position = 'fixed';
    wave.style.left = logoRect.left + logoRect.width / 2 + 'px';
    wave.style.top = logoRect.top + logoRect.height / 2 + 'px';
    wave.style.width = '0px';
    wave.style.height = '0px';
    wave.style.border = '3px solid rgba(0, 217, 255, 0.8)';
    wave.style.borderRadius = '50%';
    wave.style.transform = 'translate(-50%, -50%)';
    wave.style.pointerEvents = 'none';
    wave.style.zIndex = '9999';

    document.body.appendChild(wave);

    wave.animate([
        {
            width: '0px',
            height: '0px',
            opacity: 1,
            borderWidth: '3px'
        },
        {
            width: '800px',
            height: '800px',
            opacity: 0,
            borderWidth: '0px'
        }
    ], {
        duration: 1500,
        easing: 'ease-out'
    }).onfinish = () => wave.remove();
}

// Crear partículas alrededor del logo
function createLogoParticles() {
    const logoRect = heroLogo.getBoundingClientRect();
    const centerX = logoRect.left + logoRect.width / 2;
    const centerY = logoRect.top + logoRect.height / 2;

    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            const particle = document.createElement('div');
            const angle = (Math.PI * 2 * i) / 15;
            const velocity = 2 + Math.random() * 3;

            particle.style.position = 'fixed';
            particle.style.left = centerX + 'px';
            particle.style.top = centerY + 'px';
            particle.style.width = (3 + Math.random() * 5) + 'px';
            particle.style.height = particle.style.width;
            particle.style.backgroundColor = `rgba(0, ${200 + Math.random() * 55}, 255, ${0.8 + Math.random() * 0.2})`;
            particle.style.borderRadius = '50%';
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '9999';
            particle.style.boxShadow = '0 0 10px rgba(0, 217, 255, 0.8)';

            document.body.appendChild(particle);

            const distance = 100 + Math.random() * 150;
            const endX = centerX + Math.cos(angle) * distance;
            const endY = centerY + Math.sin(angle) * distance;

            particle.animate([
                {
                    left: centerX + 'px',
                    top: centerY + 'px',
                    opacity: 1,
                    transform: 'scale(1)'
                },
                {
                    left: endX + 'px',
                    top: endY + 'px',
                    opacity: 0,
                    transform: 'scale(0)'
                }
            ], {
                duration: 1000 + Math.random() * 500,
                easing: 'cubic-bezier(0, 0.5, 0.5, 1)'
            }).onfinish = () => particle.remove();
        }, i * 30);
    }
}

// ========================================
// Label Badges Click Animation
// ========================================
const labelBadges = document.querySelectorAll('.label-badge');
labelBadges.forEach(badge => {
    badge.addEventListener('click', function(e) {
        e.preventDefault();
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = 'scale(1.05)';
        }, 100);
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 200);
    });
});

// ========================================
// Mouse Trail Effect (Advanced)
// ========================================
let mouseTrail = [];
const trailLength = 20;

document.addEventListener('mousemove', (e) => {
    mouseTrail.push({ x: e.clientX, y: e.clientY });
    if (mouseTrail.length > trailLength) {
        mouseTrail.shift();
    }
});

// ========================================
// Scroll to Top Button (Hidden by default)
// ========================================
const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
};

// Show/hide scroll to top button
window.addEventListener('scroll', () => {
    const scrollBtn = document.querySelector('.scroll-to-top');
    if (scrollBtn) {
        if (window.pageYOffset > 300) {
            scrollBtn.style.display = 'block';
        } else {
            scrollBtn.style.display = 'none';
        }
    }
});

// ========================================
// Performance Optimization: Debounce Scroll Events
// ========================================
const debounce = (func, wait = 10, immediate = true) => {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

// Apply debounce to scroll handlers
window.addEventListener('scroll', debounce(() => {
    highlightNavLink();
}));

// ========================================
// Parallax Gallery Effect
// ========================================
const parallaxImages = document.querySelectorAll('.parallax-image');
const parallaxGallery = document.querySelector('.parallax-gallery');

let ticking = false;

function updateParallax() {
    if (!parallaxGallery) return;

    const galleryRect = parallaxGallery.getBoundingClientRect();
    const galleryCenter = galleryRect.top + galleryRect.height / 2;
    const windowCenter = window.innerHeight / 2;
    const scrollProgress = (windowCenter - galleryCenter) / window.innerHeight;

    parallaxImages.forEach((image, index) => {
        const speed = parseFloat(image.getAttribute('data-speed')) || 0.5;
        const layer = image.closest('.parallax-layer');

        // Parallax basado en scroll
        const yOffset = scrollProgress * 300 * speed;

        // Rotación sutil basada en la posición
        const rotation = scrollProgress * 5 * (speed - 0.5);

        // Aplicar transformación
        layer.style.transform = `translateY(${yOffset}px) rotate(${rotation}deg)`;

        // Fade in/out basado en visibilidad
        const distanceFromCenter = Math.abs(scrollProgress);
        const opacity = Math.max(0.3, 1 - distanceFromCenter * 0.8);
        image.style.opacity = opacity;
    });

    ticking = false;
}

// Optimizar con requestAnimationFrame
function requestParallaxUpdate() {
    if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
    }
}

window.addEventListener('scroll', requestParallaxUpdate);
window.addEventListener('resize', updateParallax);

// Parallax con movimiento del mouse
if (parallaxGallery) {
    parallaxGallery.addEventListener('mousemove', (e) => {
        const rect = parallaxGallery.getBoundingClientRect();
        const mouseX = (e.clientX - rect.left) / rect.width - 0.5;
        const mouseY = (e.clientY - rect.top) / rect.height - 0.5;

        parallaxImages.forEach((image) => {
            const speed = parseFloat(image.getAttribute('data-speed')) || 0.5;
            const layer = image.closest('.parallax-layer');

            // Movimiento paralelo al mouse
            const moveX = mouseX * 50 * speed;
            const moveY = mouseY * 50 * speed;

            // Obtener transformación actual de scroll
            const currentTransform = layer.style.transform || '';
            const scrollY = currentTransform.match(/translateY\(([-\d.]+)px\)/);
            const scrollRotate = currentTransform.match(/rotate\(([-\d.]+)deg\)/);

            const currentY = scrollY ? parseFloat(scrollY[1]) : 0;
            const currentRotation = scrollRotate ? parseFloat(scrollRotate[1]) : 0;

            // Combinar transformaciones
            layer.style.transform = `
                translate(${moveX}px, ${currentY + moveY}px)
                rotate(${currentRotation}deg)
            `;
        });
    });

    // Reset al salir del mouse
    parallaxGallery.addEventListener('mouseleave', () => {
        updateParallax();
    });
}

// Inicializar parallax
updateParallax();

// Animación de entrada para las imágenes
const observerParallax = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.animation = 'fadeInScale 0.8s ease-out forwards';
            }, index * 100);
            observerParallax.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

parallaxImages.forEach(image => {
    image.style.opacity = '0';
    observerParallax.observe(image);
});

// Click en imagen para ampliar (lightbox simple)
// Asegurarse de que el DOM esté listo y re-seleccionar las imágenes
document.addEventListener('DOMContentLoaded', () => {
    const allParallaxImages = document.querySelectorAll('.parallax-image');
    console.log(`Total de imágenes encontradas: ${allParallaxImages.length}`);

    allParallaxImages.forEach((image, index) => {
        // Asegurar que la imagen sea clickeable
        image.style.cursor = 'pointer';
        image.style.pointerEvents = 'auto';

        // Agregar z-index para cada capa
        const layer = image.closest('.parallax-layer');
        if (layer) {
            layer.style.zIndex = 10 + index;
        }

        image.addEventListener('click', function(e) {
            console.log(`Click en imagen ${index + 1}, src: ${this.querySelector('img')?.src}`);
            e.preventDefault();
            e.stopPropagation();

            const imgElement = this.querySelector('img');
            if (imgElement) {
                const imgSrc = imgElement.src;
                createLightbox(imgSrc);
            } else {
                console.error(`No se encontró img dentro de la imagen ${index + 1}`);
            }
        });

        console.log(`Imagen ${index + 1} configurada correctamente`);
    });
});

function createLightbox(imageSrc) {
    // Crear overlay
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox-modal';
    lightbox.style.position = 'fixed';
    lightbox.style.top = '0';
    lightbox.style.left = '0';
    lightbox.style.width = '100%';
    lightbox.style.height = '100%';
    lightbox.style.background = 'rgba(0, 0, 0, 0.95)';
    lightbox.style.backdropFilter = 'blur(10px)';
    lightbox.style.zIndex = '10000';
    lightbox.style.display = 'flex';
    lightbox.style.alignItems = 'center';
    lightbox.style.justifyContent = 'center';
    lightbox.style.animation = 'fadeIn 0.3s ease';
    lightbox.style.padding = '20px';

    // Crear contenedor de imagen
    const imgContainer = document.createElement('div');
    imgContainer.style.position = 'relative';
    imgContainer.style.maxWidth = '90vw';
    imgContainer.style.maxHeight = '90vh';
    imgContainer.style.display = 'flex';
    imgContainer.style.alignItems = 'center';
    imgContainer.style.justifyContent = 'center';

    // Crear imagen
    const img = document.createElement('img');
    img.src = imageSrc;
    img.style.maxWidth = '100%';
    img.style.maxHeight = '90vh';
    img.style.objectFit = 'contain';
    img.style.borderRadius = '15px';
    img.style.boxShadow = '0 0 60px rgba(0, 217, 255, 0.6), 0 0 100px rgba(0, 217, 255, 0.3)';
    img.style.animation = 'fadeInScale 0.4s ease';
    img.style.border = '2px solid rgba(0, 217, 255, 0.3)';
    img.style.cursor = 'default';

    // Prevenir que el click en la imagen cierre el modal
    img.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // Crear botón de cerrar
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '&times;';
    closeBtn.style.position = 'absolute';
    closeBtn.style.top = '20px';
    closeBtn.style.right = '20px';
    closeBtn.style.width = '50px';
    closeBtn.style.height = '50px';
    closeBtn.style.background = 'rgba(0, 217, 255, 0.2)';
    closeBtn.style.border = '2px solid var(--primary-color)';
    closeBtn.style.borderRadius = '50%';
    closeBtn.style.color = 'var(--primary-color)';
    closeBtn.style.fontSize = '32px';
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.display = 'flex';
    closeBtn.style.alignItems = 'center';
    closeBtn.style.justifyContent = 'center';
    closeBtn.style.transition = 'all 0.3s ease';
    closeBtn.style.zIndex = '10001';
    closeBtn.style.fontWeight = '300';
    closeBtn.style.lineHeight = '1';
    closeBtn.style.padding = '0';
    closeBtn.style.backdropFilter = 'blur(10px)';

    closeBtn.addEventListener('mouseenter', () => {
        closeBtn.style.background = 'var(--primary-color)';
        closeBtn.style.color = 'var(--dark-bg)';
        closeBtn.style.transform = 'scale(1.1) rotate(90deg)';
        closeBtn.style.boxShadow = '0 0 20px rgba(0, 217, 255, 0.6)';
    });

    closeBtn.addEventListener('mouseleave', () => {
        closeBtn.style.background = 'rgba(0, 217, 255, 0.2)';
        closeBtn.style.color = 'var(--primary-color)';
        closeBtn.style.transform = 'scale(1) rotate(0deg)';
        closeBtn.style.boxShadow = 'none';
    });

    imgContainer.appendChild(img);
    lightbox.appendChild(imgContainer);
    lightbox.appendChild(closeBtn);
    document.body.appendChild(lightbox);

    // Prevenir scroll del body
    document.body.style.overflow = 'hidden';

    // Función para cerrar el modal
    const closeLightbox = () => {
        lightbox.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            lightbox.remove();
            document.body.style.overflow = '';
        }, 300);
    };

    // Cerrar al hacer click en el overlay (fondo)
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Cerrar con el botón X
    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeLightbox();
    });

    // Cerrar con ESC
    const closeOnEsc = (e) => {
        if (e.key === 'Escape') {
            closeLightbox();
            document.removeEventListener('keydown', closeOnEsc);
        }
    };
    document.addEventListener('keydown', closeOnEsc);
}

// Agregar animaciones de fadeIn/fadeOut
const parallaxStyle = document.createElement('style');
parallaxStyle.textContent = `
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
`;
document.head.appendChild(parallaxStyle);

// ========================================
// Music Hub - Scroll to Player
// ========================================
function scrollToPlayer() {
    const player = document.getElementById('soundcloud-player');
    if (player) {
        const offsetTop = player.offsetTop - 80;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// ========================================
// Console Message
// ========================================
console.log('%c🎧 KUFF - International DJ & Producer', 'color: #00d9ff; font-size: 20px; font-weight: bold;');
console.log('%cWebsite by Claude Code', 'color: #00d9ff; font-size: 12px;');
console.log('%cFor bookings: mgmt@kuffdj.net', 'color: #ffffff; font-size: 12px;');

// ========================================
// Add CSS Animation Keyframes Dynamically
// ========================================
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInLeft {
        from {
            opacity: 0;
            transform: translateX(-50px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(50px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    .nav-link.active {
        color: var(--primary-color);
    }

    .nav-link.active::after {
        width: 100%;
    }
`;
document.head.appendChild(style);

// ========================================
// Easter Egg: Konami Code
// ========================================
let konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            activateEasterEgg();
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

function activateEasterEgg() {
    document.body.style.animation = 'pulse 1s ease-in-out 3';
    console.log('%c🎉 You found the secret! KUFF approved!', 'color: #00ffff; font-size: 24px; font-weight: bold;');

    // Create confetti effect
    for (let i = 0; i < 50; i++) {
        createConfetti();
    }
}

function createConfetti() {
    const confetti = document.createElement('div');
    confetti.style.position = 'fixed';
    confetti.style.width = '10px';
    confetti.style.height = '10px';
    confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
    confetti.style.left = Math.random() * window.innerWidth + 'px';
    confetti.style.top = '-10px';
    confetti.style.opacity = '1';
    confetti.style.pointerEvents = 'none';
    confetti.style.zIndex = '10000';
    document.body.appendChild(confetti);

    const fallDuration = Math.random() * 3 + 2;
    const fallDistance = window.innerHeight + 10;

    confetti.animate([
        { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
        { transform: `translateY(${fallDistance}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
    ], {
        duration: fallDuration * 1000,
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    }).onfinish = () => confetti.remove();
}

// ========================================
// Music Hub - Falling Logos Animation
// ========================================
const musicLogos = {
    spotify: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>`,
    soundcloud: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M1.175 12.225c-.051 0-.094.046-.101.1l-.233 2.154.233 2.105c.007.058.05.098.101.098.05 0 .09-.04.099-.098l.255-2.105-.27-2.154c0-.057-.045-.1-.09-.1m-.899.828c-.05 0-.078.045-.084.092l-.194 1.326.194 1.261c.006.053.034.09.084.09.051 0 .082-.037.088-.09l.227-1.261-.238-1.326c0-.047-.036-.092-.08-.092m1.77-1.179c-.058 0-.1.048-.109.108l-.227 2.336.227 2.257c0 .06.051.112.109.112.06 0 .11-.052.117-.112l.255-2.257-.27-2.336c0-.06-.056-.108-.11-.108m.899-.269c-.066 0-.115.058-.124.12l-.214 2.605.214 2.52c.009.067.058.125.124.125.066 0 .117-.058.126-.125l.239-2.52-.248-2.605c0-.062-.06-.12-.117-.12m.904-.284c-.072 0-.13.063-.136.134l-.194 2.889.194 2.797c.006.077.064.138.136.138.076 0 .137-.061.145-.138l.22-2.797-.22-2.889c-.008-.071-.069-.134-.145-.134zm.893-.221c-.08 0-.143.069-.148.148l-.181 3.11.181 2.835c.005.08.068.147.148.147.08 0 .145-.067.152-.147l.207-2.835-.207-3.11c-.007-.079-.072-.148-.152-.148zm.9.005c-.084 0-.152.073-.162.158l-.165 3.105.165 2.88c.01.084.078.16.162.16.085 0 .155-.076.164-.16l.189-2.88-.189-3.105c-.009-.085-.079-.158-.164-.158zm.892.046c-.092 0-.166.08-.176.173l-.148 3.059.148 2.898c.01.097.084.178.176.178.093 0 .168-.081.178-.178l.17-2.898-.17-3.059c-.01-.093-.085-.173-.178-.173zm.897.081c-.098 0-.177.086-.185.186l-.132 2.978.132 2.94c.008.1.087.188.185.188.099 0 .179-.088.188-.188l.155-2.94-.155-2.978c-.009-.1-.089-.186-.188-.186zm.875.098c-.105 0-.19.093-.199.201l-.117 2.88.117 2.938c.009.11.094.202.199.202.106 0 .191-.092.201-.202l.138-2.938-.138-2.88c-.01-.108-.095-.201-.201-.201zm.907.107c-.11 0-.197.097-.208.212l-.101 2.773.101 2.946c.011.119.098.215.208.215.112 0 .199-.096.21-.215l.125-2.946-.125-2.773c-.011-.115-.098-.212-.21-.212zm-13.815-.094c-.055 0-.101.05-.107.106l-.177 1.207.177 1.146c.006.059.052.107.107.107.056 0 .104-.048.109-.107l.205-1.146-.205-1.207c-.005-.056-.053-.106-.109-.106zm2.699 1.867c.113 0 .201-.101.211-.221l.111-2.666-.111-1.427c-.01-.12-.098-.221-.211-.221-.113 0-.202.101-.213.221l-.1 1.427.1 2.666c.011.12.1.221.213.221zm.906.094c.119 0 .211-.104.223-.227l.105-2.76-.105-1.37c-.012-.126-.104-.23-.223-.23-.12 0-.213.104-.225.23l-.092 1.37.092 2.76c.012.123.105.227.225.227zm.904.116c.126 0 .222-.109.234-.24l.098-2.876-.098-1.333c-.012-.131-.108-.241-.234-.241-.127 0-.223.11-.235.241l-.087 1.333.087 2.876c.012.131.108.24.235.24zm.91.137c.129 0 .228-.115.241-.252l.088-3.013-.088-1.297c-.013-.137-.112-.252-.241-.252-.131 0-.23.115-.242.252l-.078 1.297.078 3.013c.012.137.111.252.242.252zm.903.155c.134 0 .236-.121.248-.265l.08-3.168-.08-1.264c-.012-.144-.114-.265-.248-.265-.135 0-.238.121-.251.265l-.07 1.264.07 3.168c.013.144.116.265.251.265zm.908.181c.139 0 .242-.126.256-.277l.071-3.349-.071-1.23c-.014-.15-.117-.277-.256-.277-.141 0-.244.127-.257.277l-.062 1.23.062 3.349c.013.151.116.277.257.277zm.904.21c.145 0 .249-.131.264-.288l.063-3.559-.063-1.195c-.015-.157-.119-.288-.264-.288-.146 0-.25.131-.265.288l-.055 1.195.055 3.559c.015.157.119.288.265.288zm.907.238c.15 0 .256-.137.271-.301l.055-3.797-.055-1.161c-.015-.164-.121-.301-.271-.301-.151 0-.258.137-.272.301l-.046 1.161.046 3.797c.014.164.121.301.272.301zm.905.271c.155 0 .262-.142.279-.313l.046-4.068-.046-1.127c-.017-.171-.124-.313-.279-.313-.157 0-.264.142-.281.313l-.038 1.127.038 4.068c.017.171.124.313.281.313zm.909.303c.16 0 .269-.148.286-.326l.037-4.371-.037-1.093c-.017-.178-.126-.326-.286-.326-.161 0-.27.148-.287.326l-.03 1.093.03 4.371c.017.178.126.326.287.326zm.906.337c.166 0 .276-.154.294-.339l.029-4.708-.029-1.058c-.018-.185-.128-.339-.294-.339-.167 0-.277.154-.295.339l-.022 1.058.022 4.708c.018.185.128.339.295.339zm.908.371c.172 0 .283-.16.302-.352l.02-5.079-.02-1.024c-.019-.192-.13-.352-.302-.352-.173 0-.284.16-.303.352l-.013 1.024.013 5.079c.019.192.13.352.303.352z"/></svg>`,
    youtube: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`
};

function createFallingLogo() {
    const musicHub = document.querySelector('.music-hub');
    if (!musicHub) return;

    const logoKeys = Object.keys(musicLogos);
    const randomLogo = logoKeys[Math.floor(Math.random() * logoKeys.length)];

    const logo = document.createElement('div');
    logo.innerHTML = musicLogos[randomLogo];
    logo.style.position = 'absolute';
    logo.style.top = '-50px';
    logo.style.left = Math.random() * 100 + '%';
    logo.style.width = (Math.random() * 30 + 20) + 'px';
    logo.style.height = (Math.random() * 30 + 20) + 'px';
    logo.style.opacity = (Math.random() * 0.3 + 0.1).toString();
    logo.style.pointerEvents = 'none';
    logo.style.zIndex = '1';

    // All logos in blue/cyan tones
    const colors = {
        spotify: '#00d9ff',
        soundcloud: '#00b8e6',
        youtube: '#0099cc'
    };
    logo.style.color = colors[randomLogo];

    musicHub.appendChild(logo);

    const fallDuration = Math.random() * 8 + 6; // 6-14 seconds
    const fallDistance = musicHub.offsetHeight + 100;
    const horizontalDrift = (Math.random() - 0.5) * 100; // Drift left/right

    logo.animate([
        {
            transform: 'translateY(0) translateX(0) rotate(0deg)',
            opacity: logo.style.opacity
        },
        {
            transform: `translateY(${fallDistance}px) translateX(${horizontalDrift}px) rotate(${Math.random() * 360}deg)`,
            opacity: 0
        }
    ], {
        duration: fallDuration * 1000,
        easing: 'linear'
    }).onfinish = () => logo.remove();
}

// Start falling logos animation when Music Hub is visible
function startFallingLogos() {
    const musicHub = document.querySelector('.music-hub');
    if (!musicHub) return;

    // Create logos continuously
    setInterval(() => {
        createFallingLogo();
    }, 800); // Create a new logo every 800ms

    // Create initial batch
    for (let i = 0; i < 5; i++) {
        setTimeout(() => createFallingLogo(), i * 200);
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startFallingLogos);
} else {
    startFallingLogos();
}

// ========================================
// Events Loading System
// ========================================

// Load and display events
async function loadEvents() {
    const eventsContainer = document.getElementById('events-container');
    const noEventsMessage = document.getElementById('no-events-message');
    const pastEventsSection = document.getElementById('past-events-section');
    const pastEventsContainer = document.getElementById('past-events-container');

    if (!eventsContainer) return;

    try {
        const response = await fetch('data/events.json');
        if (!response.ok) throw new Error('Failed to load events');

        const data = await response.json();
        const events = data.events || [];

        // Filter upcoming and past events
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const upcomingEvents = events.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate >= today;
        }).sort((a, b) => new Date(a.date) - new Date(b.date));

        const pastEvents = events.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate < today && event.photos && event.photos.length > 0;
        }).sort((a, b) => new Date(b.date) - new Date(a.date)); // Most recent first

        // Clear loading message
        eventsContainer.innerHTML = '';

        // Load upcoming events
        if (upcomingEvents.length === 0) {
            // Show no events message
            if (noEventsMessage) {
                noEventsMessage.style.display = 'flex';
            }
        } else {
            // Hide no events message
            if (noEventsMessage) {
                noEventsMessage.style.display = 'none';
            }

            // Create event cards
            upcomingEvents.forEach((event, index) => {
                const eventCard = createEventCard(event, index);
                eventsContainer.appendChild(eventCard);
            });

            // Animate cards
            const cards = eventsContainer.querySelectorAll('.event-card');
            cards.forEach((card, index) => {
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 150);
            });
        }

        // Load past events with photos
        if (pastEvents.length > 0 && pastEventsContainer) {
            pastEventsSection.style.display = 'block';
            pastEventsContainer.innerHTML = '';

            pastEvents.forEach((event, index) => {
                const pastEventCard = createPastEventCard(event, index);
                pastEventsContainer.appendChild(pastEventCard);
            });

            // Animate past event cards
            const pastCards = pastEventsContainer.querySelectorAll('.past-event-card');
            pastCards.forEach((card, index) => {
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 150 + 300); // Delay after upcoming events
            });
        }
    } catch (error) {
        console.error('Error loading events:', error);
        eventsContainer.innerHTML = `
            <div class="events-error">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <h3>Error Loading Events</h3>
                <p>Please try refreshing the page</p>
            </div>
        `;
    }
}

// Create event card element
function createEventCard(event, index) {
    const card = document.createElement('div');
    card.className = 'event-card';
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'all 0.6s ease';

    // Format date
    const eventDate = new Date(event.date);
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    const formattedDate = eventDate.toLocaleDateString('en-US', options);

    // Get day and month for date badge
    const day = eventDate.getDate();
    const month = eventDate.toLocaleDateString('en-US', { month: 'short' });

    card.innerHTML = `
        <div class="event-flyer">
            <img src="${event.flyer}" alt="${event.title}" loading="lazy">
            <div class="event-date-badge">
                <span class="event-day">${day}</span>
                <span class="event-month">${month}</span>
            </div>
        </div>
        <div class="event-details">
            <h3 class="event-title">${event.title}</h3>
            <div class="event-info">
                <div class="event-info-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    <span>${event.venue}, ${event.location}</span>
                </div>
                <div class="event-info-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    <span>${formattedDate} at ${event.time}</span>
                </div>
            </div>
            <p class="event-description">${event.description}</p>
            <div class="event-actions">
                ${event.ticketLink ? `
                    <a href="${event.ticketLink}" class="event-btn event-btn-primary" target="_blank" rel="noopener">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 0 0-2 2v3a2 2 0 1 1 0 4v3a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3a2 2 0 1 1 0-4V7a2 2 0 0 0-2-2H5z"></path>
                        </svg>
                        Get Tickets
                    </a>
                ` : ''}
                ${event.address ? `
                    <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.address)}"
                       class="event-btn event-btn-secondary" target="_blank" rel="noopener">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        View Map
                    </a>
                ` : ''}
            </div>
        </div>
    `;

    return card;
}

// Create past event card with photo gallery
function createPastEventCard(event) {
    const card = document.createElement('div');
    card.className = 'past-event-card';
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'all 0.6s ease';

    // Format date
    const eventDate = new Date(event.date);
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    const formattedDate = eventDate.toLocaleDateString('en-US', options);

    card.innerHTML = `
        <div class="past-event-header">
            <h3 class="past-event-title">${event.title}</h3>
            <div class="past-event-meta">
                <div class="past-event-info-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    <span>${formattedDate}</span>
                </div>
                <div class="past-event-info-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    <span>${event.venue}, ${event.location}</span>
                </div>
            </div>
        </div>
        <div class="past-event-gallery">
            ${event.photos.map((photo, idx) => `
                <div class="past-event-photo" data-photo-index="${idx}">
                    <img src="${photo}" alt="${event.title} - Photo ${idx + 1}" loading="lazy">
                    <div class="photo-overlay">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="11" cy="11" r="8"></circle>
                            <path d="m21 21-4.35-4.35"></path>
                        </svg>
                    </div>
                </div>
            `).join('')}
        </div>
    `;

    // Add click handlers for photo lightbox
    setTimeout(() => {
        const photos = card.querySelectorAll('.past-event-photo');
        photos.forEach((photoElement, idx) => {
            photoElement.addEventListener('click', () => {
                createPhotoLightbox(event.photos, idx, event.title);
            });
        });
    }, 100);

    return card;
}

// Create photo lightbox for past event photos
function createPhotoLightbox(photos, startIndex, eventTitle) {
    let currentIndex = startIndex;

    const lightbox = document.createElement('div');
    lightbox.className = 'photo-lightbox';
    lightbox.style.position = 'fixed';
    lightbox.style.top = '0';
    lightbox.style.left = '0';
    lightbox.style.width = '100%';
    lightbox.style.height = '100%';
    lightbox.style.background = 'rgba(0, 0, 0, 0.95)';
    lightbox.style.backdropFilter = 'blur(10px)';
    lightbox.style.zIndex = '10000';
    lightbox.style.display = 'flex';
    lightbox.style.alignItems = 'center';
    lightbox.style.justifyContent = 'center';
    lightbox.style.animation = 'fadeIn 0.3s ease';
    lightbox.style.padding = '20px';

    const container = document.createElement('div');
    container.style.position = 'relative';
    container.style.maxWidth = '90vw';
    container.style.maxHeight = '90vh';
    container.style.display = 'flex';
    container.style.alignItems = 'center';
    container.style.justifyContent = 'center';

    const img = document.createElement('img');
    img.style.maxWidth = '100%';
    img.style.maxHeight = '90vh';
    img.style.objectFit = 'contain';
    img.style.borderRadius = '15px';
    img.style.boxShadow = '0 0 60px rgba(0, 217, 255, 0.6)';
    img.style.border = '2px solid rgba(0, 217, 255, 0.3)';
    img.style.animation = 'fadeInScale 0.4s ease';

    const updateImage = (index) => {
        img.src = photos[index];
        img.alt = `${eventTitle} - Photo ${index + 1} of ${photos.length}`;
    };

    updateImage(currentIndex);

    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '&times;';
    closeBtn.style.position = 'absolute';
    closeBtn.style.top = '20px';
    closeBtn.style.right = '20px';
    closeBtn.style.width = '50px';
    closeBtn.style.height = '50px';
    closeBtn.style.background = 'rgba(0, 217, 255, 0.2)';
    closeBtn.style.border = '2px solid var(--primary-color)';
    closeBtn.style.borderRadius = '50%';
    closeBtn.style.color = 'var(--primary-color)';
    closeBtn.style.fontSize = '32px';
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.display = 'flex';
    closeBtn.style.alignItems = 'center';
    closeBtn.style.justifyContent = 'center';
    closeBtn.style.transition = 'all 0.3s ease';
    closeBtn.style.zIndex = '10001';
    closeBtn.style.backdropFilter = 'blur(10px)';

    // Navigation buttons (if multiple photos)
    if (photos.length > 1) {
        const prevBtn = document.createElement('button');
        prevBtn.innerHTML = '‹';
        prevBtn.className = 'lightbox-nav-btn prev-btn';
        Object.assign(prevBtn.style, {
            position: 'absolute',
            left: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '50px',
            height: '50px',
            background: 'rgba(0, 217, 255, 0.2)',
            border: '2px solid var(--primary-color)',
            borderRadius: '50%',
            color: 'var(--primary-color)',
            fontSize: '32px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(10px)',
            zIndex: '10001'
        });

        const nextBtn = document.createElement('button');
        nextBtn.innerHTML = '›';
        nextBtn.className = 'lightbox-nav-btn next-btn';
        Object.assign(nextBtn.style, {
            position: 'absolute',
            right: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '50px',
            height: '50px',
            background: 'rgba(0, 217, 255, 0.2)',
            border: '2px solid var(--primary-color)',
            borderRadius: '50%',
            color: 'var(--primary-color)',
            fontSize: '32px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(10px)',
            zIndex: '10001'
        });

        // Counter
        const counter = document.createElement('div');
        counter.style.position = 'absolute';
        counter.style.bottom = '20px';
        counter.style.left = '50%';
        counter.style.transform = 'translateX(-50%)';
        counter.style.background = 'rgba(0, 217, 255, 0.2)';
        counter.style.border = '2px solid var(--primary-color)';
        counter.style.borderRadius = '25px';
        counter.style.padding = '10px 20px';
        counter.style.color = 'var(--primary-color)';
        counter.style.fontSize = '16px';
        counter.style.fontWeight = '600';
        counter.style.backdropFilter = 'blur(10px)';
        counter.style.zIndex = '10001';

        const updateCounter = () => {
            counter.textContent = `${currentIndex + 1} / ${photos.length}`;
        };
        updateCounter();

        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            currentIndex = (currentIndex - 1 + photos.length) % photos.length;
            updateImage(currentIndex);
            updateCounter();
        });

        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            currentIndex = (currentIndex + 1) % photos.length;
            updateImage(currentIndex);
            updateCounter();
        });

        // Keyboard navigation
        const handleKeyPress = (e) => {
            if (e.key === 'ArrowLeft') {
                prevBtn.click();
            } else if (e.key === 'ArrowRight') {
                nextBtn.click();
            }
        };
        document.addEventListener('keydown', handleKeyPress);

        // Hover effects
        [prevBtn, nextBtn].forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                btn.style.background = 'var(--primary-color)';
                btn.style.color = 'var(--dark-bg)';
                btn.style.transform = btn === prevBtn ? 'translateY(-50%) scale(1.1)' : 'translateY(-50%) scale(1.1)';
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.background = 'rgba(0, 217, 255, 0.2)';
                btn.style.color = 'var(--primary-color)';
                btn.style.transform = 'translateY(-50%) scale(1)';
            });
        });

        lightbox.appendChild(prevBtn);
        lightbox.appendChild(nextBtn);
        lightbox.appendChild(counter);

        // Store cleanup function
        lightbox._cleanupKeyPress = () => document.removeEventListener('keydown', handleKeyPress);
    }

    closeBtn.addEventListener('mouseenter', () => {
        closeBtn.style.background = 'var(--primary-color)';
        closeBtn.style.color = 'var(--dark-bg)';
        closeBtn.style.transform = 'scale(1.1) rotate(90deg)';
    });

    closeBtn.addEventListener('mouseleave', () => {
        closeBtn.style.background = 'rgba(0, 217, 255, 0.2)';
        closeBtn.style.color = 'var(--primary-color)';
        closeBtn.style.transform = 'scale(1) rotate(0deg)';
    });

    container.appendChild(img);
    lightbox.appendChild(container);
    lightbox.appendChild(closeBtn);
    document.body.appendChild(lightbox);

    document.body.style.overflow = 'hidden';

    const closeLightbox = () => {
        lightbox.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            lightbox.remove();
            document.body.style.overflow = '';
            if (lightbox._cleanupKeyPress) {
                lightbox._cleanupKeyPress();
            }
        }, 300);
    };

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeLightbox();
    });

    const closeOnEsc = (e) => {
        if (e.key === 'Escape') {
            closeLightbox();
            document.removeEventListener('keydown', closeOnEsc);
        }
    };
    document.addEventListener('keydown', closeOnEsc);
}

// Initialize events loading when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadEvents);
} else {
    loadEvents();
}
