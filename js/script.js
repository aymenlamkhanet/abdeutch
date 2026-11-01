// ===== DOM Elements =====
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const backToTop = document.getElementById('backToTop');
const slides = document.querySelectorAll('.slide');
const sliderDots = document.getElementById('sliderDots');
const contactForm = document.getElementById('contactForm');

// NOTE: Mobile menu is handled by mobile.js (loads first)

// ===== Handle Broken Images =====
document.querySelectorAll('img').forEach(img => {
    img.onerror = function() {
        this.style.display = 'none';
        // Or show a placeholder
        // this.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="150" viewBox="0 0 200 150"%3E%3Crect fill="%23f0f0f0" width="200" height="150"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="14" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EImage%3C/text%3E%3C/svg%3E';
    };
});

// ===== Slider Variables =====
let currentSlide = 0;
let slideInterval;
const slideDelay = 7000; // 7 seconds between slides for smoother experience

// ===== Initialize Slider =====
function initSlider() {
    if (!sliderDots || !slides.length) return;
    
    // Create dots
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('slider-dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        sliderDots.appendChild(dot);
    });

    // Start auto-slide
    startSlideInterval();
}

function goToSlide(index) {
    if (!slides.length || !sliderDots) return;
    
    slides[currentSlide].classList.remove('active');
    sliderDots.children[currentSlide].classList.remove('active');
    
    currentSlide = index;
    if (currentSlide >= slides.length) currentSlide = 0;
    if (currentSlide < 0) currentSlide = slides.length - 1;
    
    slides[currentSlide].classList.add('active');
    sliderDots.children[currentSlide].classList.add('active');
}

function nextSlideFunc() {
    goToSlide(currentSlide + 1);
}

function prevSlideFunc() {
    goToSlide(currentSlide - 1);
}

function startSlideInterval() {
    slideInterval = setInterval(nextSlideFunc, slideDelay);
}

// ===== Course Carousel - Infinite Continuous =====
const courseCarousel = document.getElementById('courseCarousel');
const courseTrack = document.querySelector('.course-carousel-track');
const courseCards = document.querySelectorAll('.course-card-new');
const coursePrev = document.getElementById('coursePrev');
const courseNext = document.getElementById('courseNext');
const courseDots = document.getElementById('courseDots');

let currentCourseIndex = 0;
let courseAutoSlide;
const courseAutoDelay = 4000;
let isTransitioning = false;

function initCourseCarousel() {
    if (!courseTrack || courseCards.length === 0) return;
    
    // Clone first and last cards for infinite loop
    const firstClone = courseCards[0].cloneNode(true);
    const lastClone = courseCards[courseCards.length - 1].cloneNode(true);
    firstClone.classList.add('clone');
    lastClone.classList.add('clone');
    
    // Only add clones if they don't exist yet
    if (!courseTrack.querySelector('.clone')) {
        courseTrack.appendChild(firstClone);
        courseTrack.insertBefore(lastClone, courseTrack.firstChild);
    }
    
    // Set initial position (after the cloned last card)
    const cardWidth = courseCards[0].offsetWidth + 30;
    courseTrack.style.transition = 'none';
    courseTrack.style.transform = `translateX(-${cardWidth}px)`;
    
    // Create dots - one per original card
    if (courseDots) {
        courseDots.innerHTML = '';
        for (let i = 0; i < courseCards.length; i++) {
            const dot = document.createElement('div');
            dot.classList.add('carousel-dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                if (!isTransitioning) {
                    goToCourseSlide(i);
                    resetCourseAutoSlide();
                }
            });
            courseDots.appendChild(dot);
        }
    }
    
    // Start auto-slide
    startCourseAutoSlide();
}

function goToCourseSlide(index, instant = false) {
    if (!courseTrack || courseCards.length === 0 || isTransitioning) return;
    
    isTransitioning = true;
    currentCourseIndex = index;
    
    const cardWidth = courseCards[0].offsetWidth + 30;
    // Add 1 to account for the cloned last card at the beginning
    const offset = (currentCourseIndex + 1) * cardWidth;
    
    if (instant) {
        courseTrack.style.transition = 'none';
    } else {
        courseTrack.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    }
    
    courseTrack.style.transform = `translateX(-${offset}px)`;
    
    // Update dots
    if (courseDots) {
        const dots = courseDots.querySelectorAll('.carousel-dot');
        const dotIndex = ((currentCourseIndex % courseCards.length) + courseCards.length) % courseCards.length;
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === dotIndex);
        });
    }
    
    setTimeout(() => {
        isTransitioning = false;
    }, instant ? 50 : 600);
}

function nextCourseSlide() {
    if (isTransitioning) return;
    
    currentCourseIndex++;
    const cardWidth = courseCards[0].offsetWidth + 30;
    const offset = (currentCourseIndex + 1) * cardWidth;
    
    isTransitioning = true;
    courseTrack.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    courseTrack.style.transform = `translateX(-${offset}px)`;
    
    // Update dots
    if (courseDots) {
        const dots = courseDots.querySelectorAll('.carousel-dot');
        const dotIndex = currentCourseIndex % courseCards.length;
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === dotIndex);
        });
    }
    
    // Check if we reached the cloned first card
    if (currentCourseIndex >= courseCards.length) {
        setTimeout(() => {
            courseTrack.style.transition = 'none';
            currentCourseIndex = 0;
            const resetOffset = cardWidth; // Position at first real card
            courseTrack.style.transform = `translateX(-${resetOffset}px)`;
            isTransitioning = false;
        }, 600);
    } else {
        setTimeout(() => {
            isTransitioning = false;
        }, 600);
    }
}

function prevCourseSlide() {
    if (isTransitioning) return;
    
    currentCourseIndex--;
    const cardWidth = courseCards[0].offsetWidth + 30;
    const offset = (currentCourseIndex + 1) * cardWidth;
    
    isTransitioning = true;
    courseTrack.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    courseTrack.style.transform = `translateX(-${offset}px)`;
    
    // Update dots
    if (courseDots) {
        const dots = courseDots.querySelectorAll('.carousel-dot');
        const dotIndex = ((currentCourseIndex % courseCards.length) + courseCards.length) % courseCards.length;
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === dotIndex);
        });
    }
    
    // Check if we reached the cloned last card
    if (currentCourseIndex < 0) {
        setTimeout(() => {
            courseTrack.style.transition = 'none';
            currentCourseIndex = courseCards.length - 1;
            const resetOffset = (currentCourseIndex + 1) * cardWidth;
            courseTrack.style.transform = `translateX(-${resetOffset}px)`;
            isTransitioning = false;
        }, 600);
    } else {
        setTimeout(() => {
            isTransitioning = false;
        }, 600);
    }
}

function startCourseAutoSlide() {
    if (courseAutoSlide) clearInterval(courseAutoSlide);
    courseAutoSlide = setInterval(nextCourseSlide, courseAutoDelay);
}

function resetCourseAutoSlide() {
    clearInterval(courseAutoSlide);
    startCourseAutoSlide();
}

// Course Carousel Controls
if (coursePrev) {
    coursePrev.addEventListener('click', () => {
        prevCourseSlide();
        resetCourseAutoSlide();
    });
}

if (courseNext) {
    courseNext.addEventListener('click', () => {
        nextCourseSlide();
        resetCourseAutoSlide();
    });
}

// Touch swipe for course carousel
if (courseCarousel) {
    let courseTouchStartX = 0;
    let courseTouchEndX = 0;
    
    courseCarousel.addEventListener('touchstart', (e) => {
        courseTouchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    courseCarousel.addEventListener('touchend', (e) => {
        courseTouchEndX = e.changedTouches[0].screenX;
        const diff = courseTouchStartX - courseTouchEndX;
        
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                nextCourseSlide();
            } else {
                prevCourseSlide();
            }
            resetCourseAutoSlide();
        }
    }, { passive: true });
}

// Initialize course carousel
if (courseCards.length > 0) {
    initCourseCarousel();
    
    // Reinitialize on resize
    window.addEventListener('resize', () => {
        initCourseCarousel();
        goToCourseSlide(0);
    });
}

// Touch swipe for slider on mobile
const sliderContainer = document.querySelector('.slider-container');
if (sliderContainer) {
    let sliderTouchStartX = 0;
    let sliderTouchEndX = 0;
    
    sliderContainer.addEventListener('touchstart', (e) => {
        sliderTouchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    sliderContainer.addEventListener('touchend', (e) => {
        sliderTouchEndX = e.changedTouches[0].screenX;
        const diff = sliderTouchStartX - sliderTouchEndX;
        
        if (Math.abs(diff) > 50) { // Minimum swipe distance
            if (diff > 0) {
                // Swipe left - next slide
                nextSlideFunc();
            } else {
                // Swipe right - previous slide
                prevSlideFunc();
            }
            resetSlideInterval();
        }
    }, { passive: true });
}

// ===== Navbar Scroll Effect =====
function handleScroll() {
    if (navbar) {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    // Back to top button
    if (backToTop) {
        if (window.scrollY > 500) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    }

    // Active nav link on scroll
    let current = '';
    document.querySelectorAll('section[id]').forEach(section => {
        const sectionTop = section.offsetTop - 150;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    if (navLinks) {
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') && link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    }
}

window.addEventListener('scroll', handleScroll);

// ===== Smooth Scroll =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ===== Back to Top =====
if (backToTop) {
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===== Contact Form =====
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;

        // Simple validation
        if (!name || !email || !subject || !message) {
            showNotification('Veuillez remplir tous les champs obligatoires.', 'error');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNotification('Veuillez entrer une adresse email valide.', 'error');
            return;
        }

        // Simulate form submission
        const submitBtn = this.querySelector('button[type="submit"]');
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
        submitBtn.disabled = true;

        setTimeout(() => {
            showNotification('Votre message a été envoyé avec succès! Nous vous contacterons bientôt.', 'success');
            this.reset();
            submitBtn.innerHTML = 'Envoyer le message';
            submitBtn.disabled = false;
        }, 2000);
    });
}

// ===== Notification System =====
function showNotification(message, type) {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 15px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        max-width: 400px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        ${type === 'success' 
            ? 'background: #d4edda; color: #155724; border: 1px solid #c3e6cb;' 
            : 'background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb;'}
    `;

    document.body.appendChild(notification);

    // Close button
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });

    // Auto remove
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Add notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    .notification-close {
        background: none;
        border: none;
        font-size: 20px;
        cursor: pointer;
        margin-left: 10px;
        opacity: 0.7;
        transition: opacity 0.3s;
    }
    .notification-close:hover {
        opacity: 1;
    }
`;
document.head.appendChild(style);

// ===== Intersection Observer for Animations =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.service-card, .course-card, .exam-card, .event-card, .testimonial-card, .quick-link-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Add animation class styles
const animationStyle = document.createElement('style');
animationStyle.textContent = `
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(animationStyle);

// ===== Counter Animation =====
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start) + '+';
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target + '+';
        }
    }
    
    updateCounter();
}

// Observe stat numbers for counter animation
const statNumbers = document.querySelectorAll('.stat-number');
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = parseInt(entry.target.textContent);
            animateCounter(entry.target, target);
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

statNumbers.forEach(stat => statsObserver.observe(stat));

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    initSlider();
    handleScroll();
});

// ===== Keyboard Navigation =====
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        prevSlideFunc();
        resetSlideInterval();
    } else if (e.key === 'ArrowRight') {
        nextSlideFunc();
        resetSlideInterval();
    }
});

// ===== Touch/Swipe Support for Slider =====
// (Touch swipe already handled above in sliderContainer section)

// ===== Lazy Loading Images =====
const lazyImages = document.querySelectorAll('img[data-src]');
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
        }
    });
});

lazyImages.forEach(img => imageObserver.observe(img));

// ===== Scroll Animations =====
const animateElements = document.querySelectorAll('.service-card, .course-card, .exam-card, .testimonial-card, .event-preview-card, .quick-link-card, .section-header');

const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-on-scroll', 'visible');
            animationObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

animateElements.forEach(el => {
    el.classList.add('animate-on-scroll');
    animationObserver.observe(el);
});

// ===== Handle Image Loading States =====
document.querySelectorAll('img[loading="lazy"]').forEach(img => {
    img.addEventListener('load', () => {
        img.classList.add('loaded');
    });
    
    // If image is already cached
    if (img.complete) {
        img.classList.add('loaded');
    }
});

// ===== Detect Touch Device =====
function isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

if (isTouchDevice()) {
    document.body.classList.add('touch-device');
}

// ===== Smooth Resize Handler =====
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Close mobile menu on resize to desktop
        if (navMenu && hamburger && window.innerWidth > 992 && navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    }, 250);
});

// ===== Prevent 300ms Click Delay on Mobile =====
if ('addEventListener' in document) {
    document.addEventListener('DOMContentLoaded', function() {
        // FastClick-like behavior for older browsers
    }, false);
}

// ===== Language Translator Button =====
const translateFloat = document.querySelector('.translate-float');
const translateMenu = document.querySelector('.translate-menu');

if (translateFloat && translateMenu) {
    // Toggle menu on button click
    const translateBtn = translateFloat.querySelector('.translate-btn');
    if (translateBtn) {
        translateBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            translateFloat.classList.toggle('active');
        });
    } else {
        translateFloat.addEventListener('click', function(e) {
            e.stopPropagation();
            translateFloat.classList.toggle('active');
        });
    }

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!translateFloat.contains(e.target)) {
            translateFloat.classList.remove('active');
        }
    });

    // Handle language selection
    const translateOptions = document.querySelectorAll('.translate-option');
    translateOptions.forEach(option => {
        option.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const lang = this.getAttribute('data-lang');
            
            // Function to change language
            function changeLanguage(langCode) {
                // Wait for Google Translate to load
                const checkGoogleTranslate = setInterval(function() {
                    const gtCombo = document.querySelector('.goog-te-combo');
                    if (gtCombo) {
                        clearInterval(checkGoogleTranslate);
                        gtCombo.value = langCode;
                        gtCombo.dispatchEvent(new Event('change'));
                    }
                }, 100);
                
                // Clear interval after 5 seconds if not found
                setTimeout(function() {
                    clearInterval(checkGoogleTranslate);
                }, 5000);
            }
            
            // Change language
            changeLanguage(lang);
            
            // Close menu after selection
            translateFloat.classList.remove('active');
            
            // Hide Google Translate bar after translation
            setTimeout(hideGoogleTranslateBar, 100);
        });
    });
}

// Function to hide Google Translate toolbar
function hideGoogleTranslateBar() {
    // Remove the Google Translate bar
    const frames = document.querySelectorAll('iframe.goog-te-banner-frame, iframe.skiptranslate, .goog-te-banner-frame');
    frames.forEach(frame => {
        frame.style.display = 'none';
        frame.style.visibility = 'hidden';
        frame.style.height = '0';
    });
    
    // Reset body position
    document.body.style.top = '0';
    document.body.style.position = 'static';
    document.documentElement.style.marginTop = '0';
    
    // Remove any margin/padding added by Google
    const html = document.documentElement;
    html.style.marginTop = '0';
    html.style.paddingTop = '0';
}

// Run on page load and after any changes
document.addEventListener('DOMContentLoaded', hideGoogleTranslateBar);
window.addEventListener('load', function() {
    hideGoogleTranslateBar();
    // Keep checking periodically
    setInterval(hideGoogleTranslateBar, 500);
});

console.log('Abdeutsch Center website loaded successfully! 🇩🇪');
