/* ==========================================
   SCRIPT.JS - MODERNWEB INTERACTIVE FUNCTIONALITY
   ========================================== */

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initScrollEffects();
    initMobileMenu();
    initSmoothScrolling();
    initPageTransitions();
    initAccessibility();
});

/* ==========================================
   NAVIGATION FUNCTIONALITY
   ========================================== */
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    let lastScrollTop = 0;
    let scrollTimeout;

    // Navbar scroll effects
    function handleNavbarScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add scrolled class for styling
        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }

    // Throttled scroll event
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(handleNavbarScroll, 10);
    });

    // Active link highlighting based on scroll position
    function updateActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const correspondingLink = document.querySelector(`a[href="#${sectionId}"]`);

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                // Remove active class from all links
                navLinks.forEach(link => link.classList.remove('active'));
                // Add active class to current link
                if (correspondingLink) {
                    correspondingLink.classList.add('active');
                }
            }
        });
    }

    // Throttled scroll event for active link updates
    let linkUpdateTimeout;
    window.addEventListener('scroll', function() {
        if (linkUpdateTimeout) {
            clearTimeout(linkUpdateTimeout);
        }
        linkUpdateTimeout = setTimeout(updateActiveLink, 50);
    });
}

/* ==========================================
   MOBILE MENU FUNCTIONALITY
   ========================================== */
function initMobileMenu() {
    const toggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const body = document.body;

    // Close mobile menu when clicking on nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth < 992) {
                // Close the mobile menu
                const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
                    hide: true
                });
                
                // Remove mobile menu open class
                body.classList.remove('mobile-menu-open');
            }
        });
    });

    // Add body class when mobile menu is opened/closed
    if (toggler) {
        toggler.addEventListener('click', function() {
            setTimeout(() => {
                if (navbarCollapse.classList.contains('show')) {
                    body.classList.add('mobile-menu-open');
                } else {
                    body.classList.remove('mobile-menu-open');
                }
            }, 100);
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInsideNav = navbarCollapse.contains(event.target) || 
                                 toggler.contains(event.target);
        
        if (!isClickInsideNav && navbarCollapse.classList.contains('show')) {
            const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
                hide: true
            });
            body.classList.remove('mobile-menu-open');
        }
    });

    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth >= 992) {
            body.classList.remove('mobile-menu-open');
        }
    });
}

/* ==========================================
   SMOOTH SCROLLING
   ========================================== */
function initSmoothScrolling() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ==========================================
   SCROLL EFFECTS & ANIMATIONS
   ========================================== */
function initScrollEffects() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Add stagger delay for multiple items
                const siblings = entry.target.parentNode.querySelectorAll('.fade-in');
                siblings.forEach((sibling, index) => {
                    if (sibling === entry.target) {
                        sibling.style.animationDelay = `${index * 0.1}s`;
                    }
                });
            }
        });
    }, observerOptions);

    // Observe elements with fade-in class
    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });

    // Parallax effect for elements with parallax class
    function handleParallax() {
        const parallaxElements = document.querySelectorAll('.parallax');
        const scrollTop = window.pageYOffset;

        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            const yPos = -(scrollTop * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }

    // Throttled parallax scroll
    let parallaxTimeout;
    window.addEventListener('scroll', function() {
        if (parallaxTimeout) {
            clearTimeout(parallaxTimeout);
        }
        parallaxTimeout = setTimeout(handleParallax, 10);
    });
}

/* ==========================================
   PAGE TRANSITIONS
   ========================================== */
function initPageTransitions() {
    // Add loaded class to body for initial page load animation
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
        
        // Initialize any page-specific animations
        const pageTransitionElements = document.querySelectorAll('.page-transition');
        pageTransitionElements.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add('loaded');
            }, index * 100);
        });
    });
}

/* ==========================================
   ACCESSIBILITY ENHANCEMENTS
   ========================================== */
function initAccessibility() {
    // Skip to content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-link sr-only sr-only-focusable';
    skipLink.textContent = 'Skip to main content';
    document.body.insertBefore(skipLink, document.body.firstChild);

    // Keyboard navigation for mobile menu
    const toggler = document.querySelector('.navbar-toggler');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

    if (toggler) {
        toggler.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    }

    // Enhanced focus management for mobile menu
    navLinks.forEach((link, index) => {
        link.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                const nextLink = navLinks[index + 1] || navLinks[0];
                nextLink.focus();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                const prevLink = navLinks[index - 1] || navLinks[navLinks.length - 1];
                prevLink.focus();
            } else if (e.key === 'Escape') {
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse.classList.contains('show')) {
                    const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
                        hide: true
                    });
                    toggler.focus();
                }
            }
        });
    });

    // Announce page changes for screen readers
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    announcer.id = 'page-announcer';
    document.body.appendChild(announcer);
}

/* ==========================================
   UTILITY FUNCTIONS
   ========================================== */

// Debounce function for performance optimization
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Smooth scroll to element
function scrollToElement(element, offset = 0) {
    const elementPosition = element.offsetTop - offset;
    window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
    });
}

/* ==========================================
   FORM ENHANCEMENTS (for future contact forms)
   ========================================== */
function initFormEnhancements() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        // Add form validation classes
        form.addEventListener('submit', function(e) {
            if (!form.checkValidity()) {
                e.preventDefault();
                e.stopPropagation();
            }
            form.classList.add('was-validated');
        });

        // Real-time validation for inputs
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                if (this.checkValidity()) {
                    this.classList.remove('is-invalid');
                    this.classList.add('is-valid');
                } else {
                    this.classList.remove('is-valid');
                    this.classList.add('is-invalid');
                }
            });
        });
    });
}

/* ==========================================
   LOADING ANIMATION
   ========================================== */
function initLoadingAnimation() {
    // Create loading spinner
    const loader = document.createElement('div');
    loader.className = 'page-loader';
    loader.innerHTML = `
        <div class="loader-spinner">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
    `;
    
    // Add loader styles
    const loaderStyles = `
        .page-loader {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 255, 0.95);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            backdrop-filter: blur(5px);
            opacity: 1;
            visibility: visible;
            transition: opacity 0.3s ease, visibility 0.3s ease;
        }
        
        .page-loader.hidden {
            opacity: 0;
            visibility: hidden;
        }
        
        .loader-spinner {
            text-align: center;
        }
    `;
    
    // Add styles to head
    const style = document.createElement('style');
    style.textContent = loaderStyles;
    document.head.appendChild(style);
    
    // Add loader to body
    document.body.appendChild(loader);
    
    // Hide loader when page is fully loaded
    window.addEventListener('load', function() {
        setTimeout(() => {
            loader.classList.add('hidden');
            setTimeout(() => {
                loader.remove();
            }, 300);
        }, 500);
    });
}

/* ==========================================
   INITIALIZE ON WINDOW LOAD
   ========================================== */
window.addEventListener('load', function() {
    // Initialize additional features that need full page load
    initFormEnhancements();
    
    // Performance optimization - lazy load images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
});