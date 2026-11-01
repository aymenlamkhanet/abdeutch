/* =====================================================
   MOBILE.JS - Mobile Optimizations & Performance
   Abdeutsch Center - Enhanced Mobile Experience
   ===================================================== */

(function() {
    'use strict';

    // ===== Performance Utilities =====
    
    // Debounce function for resize/scroll events
    function debounce(func, wait = 100) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Throttle function for frequent events
    function throttle(func, limit = 100) {
        let inThrottle;
        return function executedFunction(...args) {
            if (!inThrottle) {
                func(...args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // ===== Device Detection =====
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);

    // Add device classes to body
    document.body.classList.toggle('is-mobile', isMobile);
    document.body.classList.toggle('is-touch', isTouchDevice);
    document.body.classList.toggle('is-ios', isIOS);
    document.body.classList.toggle('is-android', isAndroid);

    // ===== Viewport Height Fix for Mobile =====
    function setViewportHeight() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    setViewportHeight();
    window.addEventListener('resize', debounce(setViewportHeight, 100));
    window.addEventListener('orientationchange', () => {
        setTimeout(setViewportHeight, 100);
    });

    // ===== Enhanced Mobile Navigation =====
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navOverlay = document.getElementById('navOverlay');
    const dropdowns = document.querySelectorAll('.dropdown');

    if (hamburger && navMenu) {
        // Hamburger click handler
        function toggleMobileMenu() {
            const isOpen = navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', isOpen);
            
            if (navOverlay) {
                navOverlay.classList.toggle('active');
            }
            
            // Prevent body scroll when menu is open
            document.body.style.overflow = isOpen ? 'hidden' : '';
            document.body.classList.toggle('menu-open', isOpen);
        }

        function closeMobileMenu() {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            
            if (navOverlay) {
                navOverlay.classList.remove('active');
            }
            
            document.body.style.overflow = '';
            document.body.classList.remove('menu-open');
            
            // Close all dropdowns
            dropdowns.forEach(d => d.classList.remove('active'));
        }

        // Click event
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMobileMenu();
        });

        // Keyboard accessibility
        hamburger.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleMobileMenu();
            }
        });

        // Overlay click to close
        if (navOverlay) {
            navOverlay.addEventListener('click', closeMobileMenu);
        }

        // Touch swipe to close menu
        let touchStartX = 0;
        let touchCurrentX = 0;
        
        navMenu.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        }, { passive: true });

        navMenu.addEventListener('touchmove', (e) => {
            touchCurrentX = e.touches[0].clientX;
        }, { passive: true });

        navMenu.addEventListener('touchend', () => {
            const diff = touchCurrentX - touchStartX;
            if (diff > 80) { // Swipe right to close
                closeMobileMenu();
            }
        }, { passive: true });

        // Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                closeMobileMenu();
            }
        });

        // Mobile dropdown toggle
        dropdowns.forEach(dropdown => {
            const toggle = dropdown.querySelector('.dropdown-toggle');
            if (toggle) {
                toggle.addEventListener('click', (e) => {
                    if (window.innerWidth <= 992) {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        const isActive = dropdown.classList.contains('active');
                        
                        // Close other dropdowns
                        dropdowns.forEach(d => {
                            if (d !== dropdown) d.classList.remove('active');
                        });
                        
                        dropdown.classList.toggle('active', !isActive);
                    }
                });
            }
        });

        // Close menu on link click
        navMenu.querySelectorAll('a:not(.dropdown-toggle)').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 992) {
                    closeMobileMenu();
                }
            });
        });

        // Handle resize
        window.addEventListener('resize', debounce(() => {
            if (window.innerWidth > 992) {
                closeMobileMenu();
            }
        }, 100));
    }

    // ===== Lazy Loading Images =====
    function initLazyLoading() {
        // Native lazy loading support check
        if ('loading' in HTMLImageElement.prototype) {
            document.querySelectorAll('img[loading="lazy"]').forEach(img => {
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                }
            });
        } else {
            // Fallback with Intersection Observer
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                        }
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                    }
                });
            }, {
                rootMargin: '100px 0px',
                threshold: 0.01
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    // ===== Lazy Loading Iframes (Instagram, Maps) =====
    function initIframeLazyLoading() {
        const iframes = document.querySelectorAll('iframe[data-src], .instagram-video-item iframe, .map-container iframe');
        
        const iframeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const iframe = entry.target;
                    if (iframe.dataset.src && !iframe.src) {
                        iframe.src = iframe.dataset.src;
                    }
                    iframe.classList.add('loaded');
                    iframeObserver.unobserve(iframe);
                }
            });
        }, {
            rootMargin: '200px 0px',
            threshold: 0.01
        });

        iframes.forEach(iframe => {
            iframeObserver.observe(iframe);
        });
    }

    // ===== Touch-Friendly Enhancements =====
    function initTouchEnhancements() {
        if (!isTouchDevice) return;

        // Add active state for touch feedback
        document.querySelectorAll('.btn, .service-card, .course-item, .quick-link-card, .exam-card').forEach(el => {
            el.addEventListener('touchstart', function() {
                this.classList.add('touch-active');
            }, { passive: true });

            el.addEventListener('touchend', function() {
                this.classList.remove('touch-active');
            }, { passive: true });

            el.addEventListener('touchcancel', function() {
                this.classList.remove('touch-active');
            }, { passive: true });
        });

        // Prevent double-tap zoom on buttons
        document.querySelectorAll('button, .btn, a').forEach(el => {
            el.style.touchAction = 'manipulation';
        });
    }

    // ===== Optimized Scroll Handler =====
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('backToTop');
    
    const handleScroll = throttle(() => {
        const scrollY = window.scrollY || window.pageYOffset;
        
        // Navbar scroll effect
        if (navbar) {
            navbar.classList.toggle('scrolled', scrollY > 100);
        }
        
        // Back to top button
        if (backToTop) {
            backToTop.classList.toggle('show', scrollY > 500);
        }
    }, 100);

    window.addEventListener('scroll', handleScroll, { passive: true });

    // ===== Form Input Optimization for iOS =====
    function initFormOptimization() {
        // Prevent zoom on input focus (iOS)
        const inputs = document.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            // Set minimum font size to prevent zoom
            if (input.style.fontSize === '' || parseInt(input.style.fontSize) < 16) {
                input.style.fontSize = '16px';
            }
        });

        // Better touch targets
        document.querySelectorAll('input[type="checkbox"], input[type="radio"]').forEach(input => {
            const label = input.closest('label') || document.querySelector(`label[for="${input.id}"]`);
            if (label) {
                label.style.minHeight = '44px';
                label.style.display = 'inline-flex';
                label.style.alignItems = 'center';
            }
        });
    }

    // ===== Smooth Scroll Polyfill for Safari =====
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#') return;
                
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    const navHeight = navbar ? navbar.offsetHeight : 0;
                    const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // ===== Responsive Images Srcset Helper =====
    function initResponsiveImages() {
        // Add srcset for better image loading on different devices
        document.querySelectorAll('img:not([srcset])').forEach(img => {
            const src = img.getAttribute('src');
            if (src && !src.includes('data:') && !src.includes('svg')) {
                // Skip external images (Unsplash handles its own responsive images)
                if (!src.includes('unsplash.com')) {
                    img.setAttribute('loading', 'lazy');
                    img.setAttribute('decoding', 'async');
                }
            }
        });
    }

    // ===== Performance: Reduce Motion if Preferred =====
    function initReducedMotion() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (prefersReducedMotion) {
            document.body.classList.add('reduced-motion');
            
            // Disable animations
            const style = document.createElement('style');
            style.textContent = `
                .reduced-motion * {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                }
            `;
            document.head.appendChild(style);
        }
    }

    // ===== Connection-Aware Loading =====
    function initConnectionAwareLoading() {
        if ('connection' in navigator) {
            const connection = navigator.connection;
            
            // Slow connection optimizations
            if (connection.saveData || connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
                document.body.classList.add('slow-connection');
                
                // Disable background animations
                const floatingIcons = document.querySelector('.floating-icons-bg');
                if (floatingIcons) {
                    floatingIcons.style.display = 'none';
                }
                
                // Reduce image quality (if using a service)
                console.log('Slow connection detected - optimizing performance');
            }
        }
    }

    // ===== Pull to Refresh Prevention =====
    function preventPullToRefresh() {
        let startY = 0;
        
        document.addEventListener('touchstart', (e) => {
            startY = e.touches[0].pageY;
        }, { passive: true });

        document.addEventListener('touchmove', (e) => {
            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            const currentY = e.touches[0].pageY;
            
            // At top of page and pulling down
            if (scrollTop <= 0 && currentY > startY) {
                // Allow default behavior for mobile menu scrolling
                if (!document.body.classList.contains('menu-open')) {
                    // Can add pull-to-refresh UI here if desired
                }
            }
        }, { passive: true });
    }

    // ===== Orientation Change Handler =====
    function handleOrientationChange() {
        window.addEventListener('orientationchange', () => {
            // Small delay to allow for orientation change
            setTimeout(() => {
                // Close mobile menu on orientation change
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    if (hamburger) hamburger.classList.remove('active');
                    document.body.style.overflow = '';
                }
                
                // Recalculate viewport height
                setViewportHeight();
            }, 100);
        });
    }

    // ===== Instagram Embed Optimization =====
    function optimizeInstagramEmbeds() {
        const instagramItems = document.querySelectorAll('.instagram-video-item');
        
        instagramItems.forEach(item => {
            const iframe = item.querySelector('iframe');
            if (iframe) {
                // Add loading state
                item.classList.add('loading');
                
                iframe.addEventListener('load', () => {
                    item.classList.remove('loading');
                    item.classList.add('loaded');
                });
            }
        });
    }

    // ===== Service Worker Registration (PWA-ready) =====
    function registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                // Service worker file would need to be created separately
                // navigator.serviceWorker.register('/sw.js')
                //     .then(registration => console.log('SW registered'))
                //     .catch(error => console.log('SW registration failed'));
            });
        }
    }

    // ===== Initialize All Mobile Optimizations =====
    function init() {
        // Wait for DOM
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initAll);
        } else {
            initAll();
        }
    }

    function initAll() {
        initLazyLoading();
        initIframeLazyLoading();
        initTouchEnhancements();
        initFormOptimization();
        initSmoothScroll();
        initResponsiveImages();
        initReducedMotion();
        initConnectionAwareLoading();
        preventPullToRefresh();
        handleOrientationChange();
        optimizeInstagramEmbeds();
        
        // Log initialization
        console.log('📱 Mobile optimizations initialized');
        console.log(`Device: ${isMobile ? 'Mobile' : 'Desktop'}, Touch: ${isTouchDevice}`);
    }

    // Start initialization
    init();

    // ===== Export utilities for external use =====
    window.MobileUtils = {
        debounce,
        throttle,
        isMobile,
        isTouchDevice,
        isIOS,
        isAndroid
    };

})();
