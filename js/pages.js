// ===== DOM Elements =====
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const backToTop = document.getElementById('backToTop');
const contactForm = document.getElementById('contactForm');
const faqItems = document.querySelectorAll('.faq-item');

// ===== Mobile Menu Toggle =====
if (hamburger && navMenu) {
    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        if (navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });

    // ===== Mobile Dropdown Toggle =====
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        if (toggle) {
            toggle.addEventListener('click', (e) => {
                // Only for mobile
                if (window.innerWidth <= 992) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Close other dropdowns
                    dropdowns.forEach(other => {
                        if (other !== dropdown) {
                            other.classList.remove('open');
                        }
                    });
                    
                    // Toggle current dropdown
                    dropdown.classList.toggle('open');
                }
            });
        }
    });

    // Close menu on link click (but not dropdown toggles on mobile)
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            // Don't close for dropdown toggles on mobile
            if (link.classList.contains('dropdown-toggle') && window.innerWidth <= 992) {
                return;
            }
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Close dropdown menu items on click
    document.querySelectorAll('.dropdown-menu a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('active') && 
            !navMenu.contains(e.target) && 
            !hamburger.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Handle touch swipe to close menu
    let touchStartX = 0;
    let touchEndX = 0;
    
    navMenu.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    navMenu.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        if (touchEndX - touchStartX > 50) { // Swipe right to close
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    }, { passive: true });
}

// ===== Navbar Scroll Effect =====
function handleScroll() {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    }

    // Back to top button
    if (backToTop) {
        if (window.scrollY > 500) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    }
}

window.addEventListener('scroll', handleScroll);

// ===== Back to Top =====
if (backToTop) {
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===== Smooth Scroll =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const offsetTop = target.offsetTop - 100;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// ===== FAQ Accordion =====
faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
        question.addEventListener('click', () => {
            // Close other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            // Toggle current item
            item.classList.toggle('active');
        });
    }
});

// ===== Contact Form =====
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const firstName = document.getElementById('firstName')?.value || '';
        const lastName = document.getElementById('lastName')?.value || '';
        const email = document.getElementById('email')?.value || '';
        const phone = document.getElementById('phone')?.value || '';
        const subject = document.getElementById('subject')?.value || '';
        const message = document.getElementById('message')?.value || '';

        // Simple validation
        if (!firstName || !lastName || !email || !subject || !message) {
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
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
        submitBtn.disabled = true;

        setTimeout(() => {
            showNotification('Votre message a été envoyé avec succès! Nous vous contacterons bientôt.', 'success');
            this.reset();
            submitBtn.innerHTML = originalText;
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
document.querySelectorAll('.mission-card, .why-us-item, .team-card, .service-detail, .pricing-card, .faq-item, .contact-card, .quick-contact-item').forEach(el => {
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
    const isPercentage = element.textContent.includes('%');
    const increment = target / (duration / 16);
    
    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start) + (isPercentage ? '%' : '+');
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target + (isPercentage ? '%' : '+');
        }
    }
    
    updateCounter();
}

// Observe stat numbers for counter animation
const statNumbers = document.querySelectorAll('.stat-number');
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = parseInt(entry.target.dataset.target || entry.target.textContent);
            animateCounter(entry.target, target);
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

statNumbers.forEach(stat => statsObserver.observe(stat));

// ===== Scroll Animations for Page Elements =====
const pageAnimateElements = document.querySelectorAll('.service-detail, .mission-card, .why-us-item, .team-card, .pricing-card, .success-story-card, .gallery-item, .contact-card, .event-large-card');

const pageAnimationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-on-scroll', 'visible');
            pageAnimationObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

pageAnimateElements.forEach(el => {
    el.classList.add('animate-on-scroll');
    pageAnimationObserver.observe(el);
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
        if (window.innerWidth > 992 && navMenu && navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    }, 250);
});

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    handleScroll();
    
    // Open first FAQ item by default
    const firstFaq = document.querySelector('.faq-item');
    if (firstFaq) {
        firstFaq.classList.add('active');
    }
});

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

// ===== Mode Toggle for Course Levels =====
document.addEventListener('DOMContentLoaded', function() {
    const modeToggles = document.querySelectorAll('.mode-toggle');
    
    modeToggles.forEach(toggle => {
        const buttons = toggle.querySelectorAll('.mode-btn');
        const card = toggle.closest('.level-showcase-card');
        
        buttons.forEach(btn => {
            btn.addEventListener('click', function() {
                const mode = this.dataset.mode;
                
                // Update active button
                buttons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                // Update visible content
                const presentielContent = card.querySelector('.presentiel-content');
                const onlineContent = card.querySelector('.online-content');
                
                if (mode === 'presentiel') {
                    presentielContent.classList.add('active');
                    onlineContent.classList.remove('active');
                } else {
                    presentielContent.classList.remove('active');
                    onlineContent.classList.add('active');
                }
            });
        });
    });
});

// ===== Mobile Stats Infinite Carousel =====
function initStatsCarousel() {
    const statsGrid = document.querySelector('.stats-grid');
    if (!statsGrid || window.innerWidth > 768) return;
    
    const statItems = statsGrid.querySelectorAll('.stat-item');
    if (statItems.length === 0) return;
    
    // Clone all items for seamless loop
    statItems.forEach(item => {
        const clone = item.cloneNode(true);
        statsGrid.appendChild(clone);
    });
}

// ===== Mobile Certifications Infinite Carousel =====
function initCertificationsCarousel() {
    const certificationsGrid = document.querySelector('.certifications-grid');
    if (!certificationsGrid || window.innerWidth > 768) return;
    
    const certCards = certificationsGrid.querySelectorAll('.certification-card');
    if (certCards.length === 0) return;
    
    // Clone all items for seamless loop
    certCards.forEach(card => {
        const clone = card.cloneNode(true);
        certificationsGrid.appendChild(clone);
    });
}

// ===== Mobile Success Stories Infinite Carousel =====
function initStoriesCarousel() {
    const storiesGrid = document.querySelector('.success-stories-grid');
    if (!storiesGrid || window.innerWidth > 768) return;
    
    const storyCards = storiesGrid.querySelectorAll('.success-story-card');
    if (storyCards.length === 0) return;
    
    // Clone all items for seamless loop
    storyCards.forEach(card => {
        const clone = card.cloneNode(true);
        storiesGrid.appendChild(clone);
    });
    
    // Get all cards including clones
    const allCards = storiesGrid.querySelectorAll('.success-story-card');
    
    // Click to toggle card and pause animation
    allCards.forEach(card => {
        card.addEventListener('click', (e) => {
            e.stopPropagation();
            
            // Remove active from all other cards
            allCards.forEach(c => {
                if (c !== card) c.classList.remove('active');
            });
            
            // Toggle current card
            card.classList.toggle('active');
            
            // Pause/resume animation
            if (card.classList.contains('active')) {
                storiesGrid.classList.add('paused');
            } else {
                storiesGrid.classList.remove('paused');
            }
        });
    });
    
    // Click outside to close and resume
    document.addEventListener('click', (e) => {
        if (!storiesGrid.contains(e.target)) {
            allCards.forEach(c => c.classList.remove('active'));
            storiesGrid.classList.remove('paused');
        }
    });
}

// Initialize on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initStatsCarousel();
        initCertificationsCarousel();
        initStoriesCarousel();
    });
} else {
    initStatsCarousel();
    initCertificationsCarousel();
    initStoriesCarousel();
}

console.log('Abdeutsch Center pages loaded successfully! 🇩🇪');
