/* ============================================
   ENDEVERA COOKIE BANNER COMPONENT
   GDPR-compliant cookie consent management
   ============================================ */

document.addEventListener('endevera:components-loaded', function() {
    initCookieBanner();
});

function initCookieBanner() {
    const cookieBanner = document.getElementById('cookieBanner');
    const acceptBtn = document.getElementById('cookieAccept');
    const rejectBtn = document.getElementById('cookieReject');
    
    if (!cookieBanner) return;

    // Check if user has already made a choice
    const cookieConsent = localStorage.getItem('endevera_cookie_consent');
    
    if (!cookieConsent) {
        // Show banner after a delay
        setTimeout(() => {
            cookieBanner.classList.add('visible');
        }, 1500);
    }

    // Accept cookies
    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            setCookieConsent('accepted');
            hideBanner();
            enableTracking();
        });
    }

    // Reject cookies
    if (rejectBtn) {
        rejectBtn.addEventListener('click', () => {
            setCookieConsent('rejected');
            hideBanner();
            disableTracking();
        });
    }

    function setCookieConsent(value) {
        const consentData = {
            status: value,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('endevera_cookie_consent', JSON.stringify(consentData));
    }

    function hideBanner() {
        cookieBanner.classList.remove('visible');
        setTimeout(() => {
            cookieBanner.style.display = 'none';
        }, 400);
    }

    function enableTracking() {
        // Add your analytics initialization here
        // Example: Google Analytics, Facebook Pixel, etc.
        console.log('Tracking enabled');
        
        // If using Google Analytics:
        // window.dataLayer = window.dataLayer || [];
        // function gtag(){dataLayer.push(arguments);}
        // gtag('consent', 'update', {
        //     'analytics_storage': 'granted'
        // });
    }

    function disableTracking() {
        // Disable all tracking
        console.log('Tracking disabled');
        
        // If using Google Analytics:
        // window['ga-disable-GA_MEASUREMENT_ID'] = true;
    }
}

// Utility function to check if user has consented
window.hasUserConsented = function() {
    const consent = localStorage.getItem('endevera_cookie_consent');
    if (!consent) return null;
    
    try {
        const data = JSON.parse(consent);
        return data.status === 'accepted';
    } catch (e) {
        return null;
    }
};
