/* ============================================
   ENDEVERA SHARED SCRIPTS
   Global functionality for public site and member portal
   ============================================ */

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    initScrollProgress();
    initSmoothScroll();
    initIntersectionObserver();
    initAnimatedCounters();
});

// ============================================
// SCROLL PROGRESS BAR
// ============================================
function initScrollProgress() {
    const scrollProgress = document.getElementById('scrollProgress');
    if (!scrollProgress) return;
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        scrollProgress.style.width = scrollPercent + '%';
    });
}

// ============================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ============================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            
            // Skip if href is just "#" or empty
            if (!href || href === '#') {
                e.preventDefault();
                return;
            }
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Close mobile nav if open
                const mobileNav = document.getElementById('mobileNav');
                const navToggle = document.getElementById('navToggle');
                const mobileNavOverlay = document.getElementById('mobileNavOverlay');
                
                if (mobileNav && mobileNav.classList.contains('active')) {
                    mobileNav.classList.remove('active');
                    navToggle.classList.remove('active');
                    mobileNavOverlay.classList.remove('active');
                    document.body.style.overflow = '';
                }
            }
        });
    });
}

// ============================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ============================================
function initIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe common animated elements
    const animatedElements = document.querySelectorAll(
        '.service-card, .team-card, .portfolio-item, .pillar-card, .feature, .animate-on-scroll'
    );
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
}

// ============================================
// ANIMATED STATS COUNTER
// ============================================
function initAnimatedCounters() {
    const stats = document.querySelectorAll('.stat-value');
    if (stats.length === 0) return;
    
    const statsObserved = new Set();

    function animateCounter(el) {
        const text = el.textContent;
        const hasPlus = text.includes('+');
        const hasDollar = text.includes('$');
        const hasB = text.includes('B');
        const hasK = text.includes('K');
        const hasM = text.includes('M');
        const numericValue = parseFloat(text.replace(/[^0-9.]/g, ''));
        
        const duration = 2000;
        const steps = 60;
        const stepDuration = duration / steps;
        let current = 0;
        
        const increment = numericValue / steps;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= numericValue) {
                current = numericValue;
                clearInterval(timer);
            }
            
            let display = '';
            if (hasDollar) display += '$';
            
            if (hasB) {
                display += current.toFixed(current === numericValue ? 1 : 1) + 'B';
            } else if (hasM) {
                display += current.toFixed(current === numericValue ? 1 : 1) + 'M';
            } else if (hasK) {
                display += current.toFixed(current === numericValue ? 1 : 1) + 'K';
            } else {
                display += Math.floor(current);
            }
            
            if (hasPlus) display += '+';
            
            el.textContent = display;
        }, stepDuration);
    }

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !statsObserved.has(entry.target)) {
                statsObserved.add(entry.target);
                animateCounter(entry.target);
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(stat => {
        statsObserver.observe(stat);
    });
}

// ============================================
// FORM VALIDATION HELPER
// ============================================
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

function validatePhone(phone) {
    const re = /^[\d\s\-\(\)]+$/;
    return re.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

function showFormError(inputElement, message) {
    const formGroup = inputElement.closest('.form-group');
    let errorElement = formGroup.querySelector('.form-error');
    
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'form-error';
        errorElement.style.cssText = 'color: #ff6b6b; font-size: 12px; margin-top: 5px;';
        formGroup.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
    inputElement.style.borderColor = '#ff6b6b';
}

function clearFormError(inputElement) {
    const formGroup = inputElement.closest('.form-group');
    const errorElement = formGroup.querySelector('.form-error');
    
    if (errorElement) {
        errorElement.remove();
    }
    
    inputElement.style.borderColor = '';
}

// ============================================
// GENERIC FORM SUBMISSION HANDLER
// ============================================
function handleFormSubmit(formElement, successMessage, onSuccess) {
    formElement.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Basic validation
        const requiredInputs = formElement.querySelectorAll('[required]');
        let isValid = true;
        
        requiredInputs.forEach(input => {
            clearFormError(input);
            
            if (!input.value.trim()) {
                showFormError(input, 'This field is required');
                isValid = false;
            } else if (input.type === 'email' && !validateEmail(input.value)) {
                showFormError(input, 'Please enter a valid email address');
                isValid = false;
            } else if (input.type === 'tel' && !validatePhone(input.value)) {
                showFormError(input, 'Please enter a valid phone number');
                isValid = false;
            }
        });
        
        if (!isValid) return;
        
        // Disable submit button
        const submitBtn = formElement.querySelector('[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'SUBMITTING...';
        
        try {
            // If onSuccess callback is provided, call it
            if (typeof onSuccess === 'function') {
                await onSuccess(new FormData(formElement));
            }
            
            // Show success message
            alert(successMessage);
            formElement.reset();
            
        } catch (error) {
            console.error('Form submission error:', error);
            alert('An error occurred. Please try again later.');
        } finally {
            // Re-enable submit button
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
}

// ============================================
// MOBILE DETECTION
// ============================================
function isMobile() {
    return window.innerWidth <= 768;
}

function isTablet() {
    return window.innerWidth > 768 && window.innerWidth <= 992;
}

// ============================================
// LOCAL STORAGE HELPERS
// ============================================
function setLocalStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (e) {
        console.error('Error saving to localStorage:', e);
        return false;
    }
}

function getLocalStorage(key) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (e) {
        console.error('Error reading from localStorage:', e);
        return null;
    }
}

function removeLocalStorage(key) {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (e) {
        console.error('Error removing from localStorage:', e);
        return false;
    }
}

// ============================================
// DEBOUNCE HELPER
// ============================================
function debounce(func, wait) {
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

// ============================================
// THROTTLE HELPER
// ============================================
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ============================================
// ESCAPE KEY HANDLER FOR MODALS
// ============================================
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close any active modals
        document.querySelectorAll('.modal.active').forEach(modal => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        });
        
        // Close mobile nav if open
        const mobileNav = document.getElementById('mobileNav');
        const navToggle = document.getElementById('navToggle');
        const mobileNavOverlay = document.getElementById('mobileNavOverlay');
        
        if (mobileNav && mobileNav.classList.contains('active')) {
            mobileNav.classList.remove('active');
            navToggle.classList.remove('active');
            mobileNavOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
        
        // Close chatbot if open
        const chatbotWindow = document.getElementById('chatbotWindow');
        if (chatbotWindow && chatbotWindow.classList.contains('active')) {
            chatbotWindow.classList.remove('active');
            if (!isMobile()) {
                document.body.style.overflow = '';
            }
        }
    }
});

// ============================================
// EXPORT FUNCTIONS (for use in other scripts)
// ============================================
window.EndeveraUtils = {
    validateEmail,
    validatePhone,
    showFormError,
    clearFormError,
    handleFormSubmit,
    isMobile,
    isTablet,
    setLocalStorage,
    getLocalStorage,
    removeLocalStorage,
    debounce,
    throttle
};
