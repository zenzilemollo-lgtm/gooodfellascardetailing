// ============================================
// GOODFELLAS CAR DETAILING - Interactive Script
// Water Drip Animation + Sound Effects + Gallery
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all features
    initWaterDrip();
    initSoundToggle();
    initNavigation();
    initGallery();
    initScrollReveal();
    initSmoothScroll();
});

// ============================================
// WATER DRIP ANIMATION
// ============================================
function initWaterDrip() {
    const dripContainer = document.getElementById('dripContainer');
    const logoContainer = document.getElementById('logoContainer');
    
    if (!dripContainer || !logoContainer) return;
    
    // Get logo position for drip origin
    const logoRect = logoContainer.getBoundingClientRect();
    const logoCenterX = logoRect.left + logoRect.width / 2;
    
    // Create water drops
    const dropCount = 15;
    const drops = [];
    
    for (let i = 0; i < dropCount; i++) {
        setTimeout(() => {
            createWaterDrop(dripContainer, logoCenterX, i);
        }, i * 150);
    }
    
    // Clear container after animation
    setTimeout(() => {
        dripContainer.innerHTML = '';
    }, 4000);
}

function createWaterDrop(container, originX, index) {
    const drop = document.createElement('div');
    drop.className = 'water-drop';
    
    // Randomize position slightly around logo center
    const randomOffset = (Math.random() - 0.5) * 100;
    const startX = originX + randomOffset;
    
    // Randomize size
    const size = 6 + Math.random() * 6;
    drop.style.width = `${size}px`;
    drop.style.height = `${size * 1.5}px`;
    
    // Set position
    drop.style.left = `${startX}px`;
    drop.style.top = '120px';
    
    // Randomize animation duration
    const duration = 2 + Math.random() * 1;
    drop.style.animation = `dripFall ${duration}s ease-in forwards`;
    
    container.appendChild(drop);
    
    // Remove drop after animation
    setTimeout(() => {
        if (drop.parentNode) {
            drop.parentNode.removeChild(drop);
        }
    }, duration * 1000);
}

// ============================================
// SOUND TOGGLE & EFFECTS
// ============================================
let soundEnabled = false;
let audioContext = null;

function initSoundToggle() {
    const soundToggle = document.getElementById('soundToggle');
    if (!soundToggle) return;
    
    soundToggle.addEventListener('click', () => {
        soundEnabled = !soundEnabled;
        soundToggle.classList.toggle('active', soundEnabled);
        
        if (soundEnabled) {
            initAudioContext();
            playWaterSplash();
        }
    });
    
    // Add click sounds to interactive elements
    addClickSounds();
}

function initAudioContext() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
}

function playWaterSplash() {
    if (!soundEnabled || !audioContext) return;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    const filter = audioContext.createBiquadFilter();
    
    // Create water splash sound
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.3);
    
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1000, audioContext.currentTime);
    filter.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.3);
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
}

function playEnginePurr() {
    if (!soundEnabled || !audioContext) return;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    const filter = audioContext.createBiquadFilter();
    
    // Create engine purr sound
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(80, audioContext.currentTime);
    oscillator.frequency.linearRampToValueAtTime(60, audioContext.currentTime + 0.1);
    
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, audioContext.currentTime);
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
    
    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.4);
}

function addClickSounds() {
    const clickableElements = document.querySelectorAll('a, button, .price-card, .contact-card, .gallery-btn');
    
    clickableElements.forEach(el => {
        el.addEventListener('click', (e) => {
            if (soundEnabled) {
                // Alternate between water splash and engine purr
                if (Math.random() > 0.5) {
                    playWaterSplash();
                } else {
                    playEnginePurr();
                }
            }
        });
    });
}

// ============================================
// NAVIGATION
// ============================================
function initNavigation() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    
    // Add scroll class
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle (if needed in future)
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            // Close mobile menu if open
            const nav = document.querySelector('.nav-links');
            if (nav && nav.classList.contains('active')) {
                nav.classList.remove('active');
            }
        });
    });
}

// ============================================
// GALLERY SLIDER
// ============================================
function initGallery() {
    const slider = document.getElementById('gallerySlider');
    const dotsContainer = document.getElementById('galleryDots');
    const prevBtn = document.getElementById('galleryPrev');
    const nextBtn = document.getElementById('galleryNext');
    
    if (!slider || !dotsContainer) return;
    
    const slides = slider.querySelectorAll('.gallery-slide');
    const totalSlides = slides.length;
    let currentSlide = 0;
    let autoPlayInterval;
    
    // Create dots
    slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.className = 'gallery-dot';
        dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
        if (index === 0) dot.classList.add('active');
        
        dot.addEventListener('click', () => {
            goToSlide(index);
            resetAutoPlay();
        });
        
        dotsContainer.appendChild(dot);
    });
    
    const dots = dotsContainer.querySelectorAll('.gallery-dot');
    
    function goToSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
        
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        
        currentSlide = index;
    }
    
    function nextSlide() {
        const next = (currentSlide + 1) % totalSlides;
        goToSlide(next);
    }
    
    function prevSlide() {
        const prev = (currentSlide - 1 + totalSlides) % totalSlides;
        goToSlide(prev);
    }
    
    function startAutoPlay() {
        autoPlayInterval = setInterval(nextSlide, 4000);
    }
    
    function resetAutoPlay() {
        clearInterval(autoPlayInterval);
        startAutoPlay();
    }
    
    // Event listeners
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetAutoPlay();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetAutoPlay();
        });
    }
    
    // Touch support
    let touchStartX = 0;
    let touchEndX = 0;
    
    slider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    slider.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
            resetAutoPlay();
        }
    }
    
    // Start autoplay
    startAutoPlay();
}

// ============================================
// SCROLL REVEAL ANIMATIONS
// ============================================
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.price-card, .contact-card, .section-header, .location-card');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('reveal', 'active');
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    revealElements.forEach(el => {
        el.classList.add('reveal');
        observer.observe(el);
    });
}

// ============================================
// SMOOTH SCROLL
// ============================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navHeight = document.getElementById('navbar')?.offsetHeight || 0;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ============================================
// TIKTOK EMBED FALLBACK
// ============================================
function initTikTokFallback() {
    const tiktokContainer = document.querySelector('.tiktok-container');
    const fallback = document.querySelector('.tiktok-fallback');
    
    if (!tiktokContainer || !fallback) return;
    
    // Check if TikTok embed loaded after 5 seconds
    setTimeout(() => {
        const embed = tiktokContainer.querySelector('iframe');
        if (!embed) {
            fallback.classList.add('visible');
        }
    }, 5000);
}

// Initialize TikTok fallback
document.addEventListener('DOMContentLoaded', initTikTokFallback);

// ============================================
// PERFORMANCE OPTIMIZATIONS
// ============================================
// Lazy load images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                imageObserver.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Preload critical resources
const preloadLinks = [
    { href: 'logo.png', as: 'image' },
    { href: 'gallery1.jpg', as: 'image' }
];

preloadLinks.forEach(link => {
    const preload = document.createElement('link');
    preload.rel = 'preload';
    preload.href = link.href;
    preload.as = link.as;
    document.head.appendChild(preload);
});