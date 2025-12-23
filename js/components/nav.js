/* ============================================
   ENDEVERA NAVIGATION COMPONENT
   Mobile menu toggle and scroll effects
   ============================================ */

document.addEventListener('endevera:components-loaded', function() {
    initNavigation();
});

function initNavigation() {
    const nav = document.getElementById('nav');
    const navToggle = document.getElementById('navToggle');
    const mobileNav = document.getElementById('mobileNav');
    const mobileNavOverlay = document.getElementById('mobileNavOverlay');
    const mobileNavClose = document.getElementById('mobileNavClose');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');

    if (!nav || !navToggle || !mobileNav) return;

    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        const isActive = mobileNav.classList.contains('active');
        
        if (isActive) {
            closeMobileNav();
        } else {
            openMobileNav();
        }
    });

    // Close button
    if (mobileNavClose) {
        mobileNavClose.addEventListener('click', closeMobileNav);
    }

    // Overlay click
    if (mobileNavOverlay) {
        mobileNavOverlay.addEventListener('click', closeMobileNav);
    }

    // Close on link click
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            setTimeout(closeMobileNav, 300);
        });
    });

    // Scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });

    // Close on window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 992 && mobileNav.classList.contains('active')) {
            closeMobileNav();
        }
    });

    function openMobileNav() {
        mobileNav.classList.add('active');
        navToggle.classList.add('active');
        if (mobileNavOverlay) {
            mobileNavOverlay.classList.add('active');
        }
        document.body.style.overflow = 'hidden';
    }

    function closeMobileNav() {
        mobileNav.classList.remove('active');
        navToggle.classList.remove('active');
        if (mobileNavOverlay) {
            mobileNavOverlay.classList.remove('active');
        }
        document.body.style.overflow = '';
    }
}
