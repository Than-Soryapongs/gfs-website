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
    let lastScrollTop = 0;
    let scrollTimeout;

    // Set active link based on current page
    setActivePage();

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

    // For single-page sections (like home page), still maintain section-based active links
    if (isHomePage()) {
        initSectionBasedNavigation();
    }
}

/* ==========================================
   PAGE-BASED ACTIVE LINK FUNCTIONALITY
   ========================================== */
function setActivePage() {
    const navLinks = document.querySelectorAll('.nav-link');
    const dropdownItems = document.querySelectorAll('.dropdown-item');
    const currentPath = window.location.pathname;
    
    // Remove all active classes first
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    dropdownItems.forEach(item => {
        item.classList.remove('active');
    });

    // Define page mapping with more comprehensive matching
    const pageMapping = {
        '/': 'home',
        '/index.html': 'home',
        '/pages/our-story.html': 'about',
        '/pages/mission-vision.html': 'about', 
        '/pages/careers.html': 'about',
        '/pages/account-opening.html': 'services',
        '/pages/fund-management.html': 'services',
        '/pages/consulting.html': 'services',
        '/pages/technical-support.html': 'services',
        '/pages/market-summary.html': 'market-overview',
        '/pages/daily-prices.html': 'market-overview',
        '/pages/csx-index.html': 'market-overview',
        '/pages/trading-calendar.html': 'market-overview',
        '/pages/companies-list.html': 'market-overview',
        '/pages/trading.html': 'market-overview',
        '/pages/csx-trade.html': 'trading-platform',
        '/pages/contact.html': 'contact'
    };

    const activeSection = pageMapping[currentPath];

    if (activeSection) {
        // Find main nav link with matching data-page
        const mainNavLink = document.querySelector(`.nav-link[data-page="${activeSection}"]`);
        if (mainNavLink) {
            mainNavLink.classList.add('active');
        }

        // Find specific dropdown item for exact page
        const exactPageName = getPageNameFromPath(currentPath);
        const dropdownItem = document.querySelector(`.dropdown-item[data-page="${exactPageName}"]`);
        if (dropdownItem) {
            dropdownItem.classList.add('active');
        }
    }

    const exactMatch = document.querySelector(`a[href="${currentPath}"]`);
    if (exactMatch) {
        exactMatch.classList.add('active');
        
        // If it's a dropdown item, also highlight parent dropdown
        const parentDropdown = exactMatch.closest('.dropdown');
        if (parentDropdown) {
            const dropdownToggle = parentDropdown.querySelector('.dropdown-toggle');
            if (dropdownToggle && !dropdownToggle.classList.contains('active')) {
                dropdownToggle.classList.add('active');
            }
        }
    }

    // Method 3: Handle special cases and relative paths
    handleSpecialCases(currentPath);
}

function getPageNameFromPath(path) {
    if (path === '/' || path === '/index.html') return 'home';
    const filename = path.split('/').pop();
    return filename ? filename.replace('.html', '') : 'home';
}

function handleSpecialCases(currentPath) {
    // Handle home page variants
    if (currentPath === '/' || currentPath === '/index.html' || currentPath === '') {
        const homeLink = document.querySelector('.nav-link[data-page="home"]') || 
                        document.querySelector('a[href="/"]') || 
                        document.querySelector('a[href="/index.html"]');
        if (homeLink && !homeLink.classList.contains('active')) {
            homeLink.classList.add('active');
        }
    }

    // Handle contact page with quote section
    if (currentPath.includes('/pages/contact.html')) {
        const contactLink = document.querySelector('.nav-link[data-page="contact"]');
        const quoteButton = document.querySelector('[data-page="quote"]');
        
        if (contactLink) contactLink.classList.add('active');
        
        // If URL has #quote, also highlight the quote button
        if (window.location.hash === '#quote' && quoteButton) {
            quoteButton.classList.add('active');
        }
    }
}

function getCurrentPageIdentifier() {
    const path = window.location.pathname;
    const filename = path.split('/').pop() || 'index.html';
    return filename.replace('.html', '');
}

function isHomePage() {
    const path = window.location.pathname;
    return path === '/' || path === '/index.html' || path.endsWith('/') || path === '';
}

/* ==========================================
   SECTION-BASED NAVIGATION (for single-page areas)
   ========================================== */
function initSectionBasedNavigation() {
    // Active link highlighting based on scroll position (for home page)
    function updateActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;
        let currentSection = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                currentSection = sectionId;
            }
        });

        // Update nav links based on current section
        if (currentSection) {
            const navLinks = document.querySelectorAll('.nav-link');
            const correspondingLink = document.querySelector(`a[href="#${currentSection}"]`);

            // Remove active from all nav links
            navLinks.forEach(link => {
                if (link.getAttribute('href')?.startsWith('#')) {
                    link.classList.remove('active');
                }
            });

            // Add active to current section link
            if (correspondingLink && correspondingLink.classList.contains('nav-link')) {
                correspondingLink.classList.add('active');
            }
        }
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
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link:not(.dropdown-toggle)');
    const body = document.body;

    // Close mobile menu when clicking on regular nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (!link.closest('.dropdown-submenu') && window.innerWidth < 992) {
                // Allow navigation to complete before closing menu
                setTimeout(() => {
                    const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse) || 
                                     new bootstrap.Collapse(navbarCollapse);
                    bsCollapse.hide();
                    body.classList.remove('mobile-menu-open');
                }, 150);
            }
        });
    });

    // Handle dropdown items separately
    const dropdownItems = document.querySelectorAll('.dropdown-item:not(.dropdown-submenu .dropdown-item)');
    dropdownItems.forEach(item => {
        item.addEventListener('click', function() {
            if (window.innerWidth < 992 && !item.closest('.dropdown-submenu')) {
                setTimeout(() => {
                    const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse) || 
                                     new bootstrap.Collapse(navbarCollapse);
                    bsCollapse.hide();
                    body.classList.remove('mobile-menu-open');
                }, 200);
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

    // Listen for Bootstrap collapse events
    if (navbarCollapse) {
        navbarCollapse.addEventListener('shown.bs.collapse', function() {
            body.classList.add('mobile-menu-open');
        });
        
        navbarCollapse.addEventListener('hidden.bs.collapse', function() {
            body.classList.remove('mobile-menu-open');
            document.querySelectorAll('.dropdown-submenu.show').forEach(submenu => {
                submenu.classList.remove('show');
            });
        });
    }

    // Outside click handling
    document.addEventListener('click', function(event) {
        const navbar = document.querySelector('.navbar');
        const isClickInsideNavbar = navbar && navbar.contains(event.target);
        
        if (!isClickInsideNavbar && navbarCollapse.classList.contains('show') && window.innerWidth < 992) {
            const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse) || 
                             new bootstrap.Collapse(navbarCollapse);
            bsCollapse.hide();
        }
    });

    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth >= 992) {
            body.classList.remove('mobile-menu-open');
            document.querySelectorAll('.dropdown-submenu.show').forEach(submenu => {
                submenu.classList.remove('show');
            });
            
            if (navbarCollapse.classList.contains('show')) {
                const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse) || 
                                 new bootstrap.Collapse(navbarCollapse);
                bsCollapse.hide();
            }
        }
    });
}

/* ==========================================
   SMOOTH SCROLLING
   ========================================== */
function initSmoothScrolling() {
    // Smooth scrolling for anchor links (same page)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                e.preventDefault();
                const headerHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
            // If target doesn't exist on current page, allow normal navigation
        });
    });

    // Handle external page links with hash fragments
    document.querySelectorAll('a[href*="#"]:not([href^="#"])').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            const [page, hash] = href.split('#');
            
            // If linking to a different page with hash, store the hash for after navigation
            if (hash && page !== window.location.pathname) {
                sessionStorage.setItem('scrollToSection', hash);
            }
        });
    });

    // Check for stored hash on page load
    window.addEventListener('load', function() {
        const scrollToSection = sessionStorage.getItem('scrollToSection');
        if (scrollToSection) {
            sessionStorage.removeItem('scrollToSection');
            setTimeout(() => {
                const targetSection = document.querySelector(`#${scrollToSection}`);
                if (targetSection) {
                    const headerHeight = document.querySelector('.navbar').offsetHeight;
                    const targetPosition = targetSection.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }, 500); // Delay to ensure page is fully rendered
        }
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
        
        // Re-run active page setting after load to ensure it works
        setTimeout(setActivePage, 100);
        
        // Initialize any page-specific animations
        const pageTransitionElements = document.querySelectorAll('.page-transition');
        pageTransitionElements.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add('loaded');
            }, index * 100);
        });
    });

    document.addEventListener('click', function(e) {
        const link = e.target.closest('a[href]');
        if (link && !link.hasAttribute('target') && !link.href.includes('#') && 
            link.hostname === window.location.hostname) {
            
            const href = link.getAttribute('href');
            if (href && href !== window.location.pathname) {
                // Add exit animation class
                document.body.classList.add('page-exit');                
                e.preventDefault();
                setTimeout(() => {
                    window.location.href = href;
                }, 300);
            }
        }
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

    // Enhanced focus management
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
   FORM ENHANCEMENTS
   ========================================== */
function initFormEnhancements() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!form.checkValidity()) {
                e.preventDefault();
                e.stopPropagation();
            }
            form.classList.add('was-validated');
        });

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
    const loader = document.createElement('div');
    loader.className = 'page-loader';
    loader.innerHTML = `
        <div class="loader-spinner">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
    `;
    
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
    
    const style = document.createElement('style');
    style.textContent = loaderStyles;
    document.head.appendChild(style);
    document.body.appendChild(loader);
    
    window.addEventListener('load', function() {
        setTimeout(() => {
            loader.classList.add('hidden');
            setTimeout(() => {
                loader.remove();
            }, 300);
        }, 500);
    });
}