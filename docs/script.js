// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add scroll effect to navbar
const navbar = document.querySelector('.navbar');
let lastScrollTop = 0;

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 100) {
        navbar.style.boxShadow = '0 4px 12px rgba(15, 40, 24, 0.12)';
    } else {
        navbar.style.boxShadow = 'none';
    }
    
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe service cards and why items
document.querySelectorAll('.service-card, .why-item, .process-step').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    observer.observe(el);
});

// Button interactions
const buttons = document.querySelectorAll('.btn');
buttons.forEach(button => {
    button.addEventListener('click', function(e) {
        // Create ripple effect
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// Add CSS for ripple effect dynamically
const style = document.createElement('style');
style.textContent = `
    .btn {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background-color: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Parallax effect on hero blobs
const blobs = document.querySelectorAll('.blob');
window.addEventListener('mousemove', (e) => {
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    
    blobs.forEach((blob, index) => {
        const moveX = (x - 0.5) * (index === 0 ? 30 : 20);
        const moveY = (y - 0.5) * (index === 0 ? 30 : 20);
        blob.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
});

// Animate numbers in why section
const animateValue = (element, start, end, duration) => {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
};

// Observe why items for animation
const whyObserverOptions = {
    threshold: 0.3
};

const whyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const number = entry.target.querySelector('.why-number');
            if (number && number.textContent) {
                const endValue = parseInt(number.textContent);
                animateValue(number, 0, endValue, 1000);
            }
            whyObserver.unobserve(entry.target);
        }
    });
}, whyObserverOptions);

document.querySelectorAll('.why-item').forEach(el => {
    whyObserver.observe(el);
});

// Add staggered animation to service cards on scroll
const serviceObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            entry.target.style.animationDelay = `${index * 0.1}s`;
            serviceObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.service-card').forEach(el => {
    serviceObserver.observe(el);
});

// Mobile menu toggle (if needed for future enhancement)
const navBtn = document.querySelector('.nav-btn');
if (navBtn) {
    navBtn.addEventListener('click', () => {
        alert('Booking system would open here!');
    });
}

// Handle form submissions (placeholder for future contact form)
document.querySelectorAll('.btn-primary').forEach(btn => {
    btn.addEventListener('click', (e) => {
        if (e.target.textContent.includes('Book') || e.target.textContent.includes('Get Started')) {
            console.log('Opening booking system...');
            // In production, this would trigger a booking modal or redirect
        }
    });
});

// Cursor effects for interactive elements
const interactiveElements = document.querySelectorAll('a, button, .service-card, .why-item');

interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', function() {
        if (this.classList.contains('btn') || this.classList.contains('nav-btn')) {
            this.style.transform = 'translateY(-2px)';
        }
    });
    
    el.addEventListener('mouseleave', function() {
        if (this.classList.contains('btn') || this.classList.contains('nav-btn')) {
            this.style.transform = 'translateY(0)';
        }
    });
});

// Lazy load images when they come into view (future enhancement)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Responsive navbar adjustments
function handleResize() {
    const navLinks = document.querySelector('.nav-links');
    if (window.innerWidth < 768) {
        if (navLinks) navLinks.style.display = 'none';
    } else {
        if (navLinks) navLinks.style.display = 'flex';
    }
}

window.addEventListener('resize', handleResize);
handleResize();

// Page visibility optimization
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        blobs.forEach(blob => {
            blob.style.animation = 'none';
        });
    } else {
        blobs.forEach(blob => {
            blob.style.animation = '';
        });
    }
});

console.log('Clays Fresh Start Cleaning - Website Loaded ✨');
