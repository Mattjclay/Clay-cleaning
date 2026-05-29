// Smooth scroll for navigation links
const smoothLinks = document.querySelectorAll('a[href^="#"]');

smoothLinks.forEach((anchor) => {
  anchor.addEventListener('click', (event) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// Navbar treatment on scroll
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
  const scrolled = window.scrollY > 90;
  if (navbar) {
    navbar.style.boxShadow = scrolled ? '0 10px 24px rgba(23, 36, 32, 0.08)' : 'none';
  }
});

// Reveal cards and image blocks on scroll with a richer cinematic lift
const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.service-card, .why-item, .process-step, .photo-card, .narrative-intro, .story-split').forEach((card) => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(16px)';
  card.style.transition = 'opacity 520ms cubic-bezier(.2,.8,.2,1), transform 520ms cubic-bezier(.2,.8,.2,1)';
  revealObserver.observe(card);
});

// Subtle button ripple effect
const buttons = document.querySelectorAll('.btn');
buttons.forEach((button) => {
  button.addEventListener('click', (event) => {
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.className = 'ripple';

    button.appendChild(ripple);
    setTimeout(() => ripple.remove(), 500);
  });
});

const rippleStyles = document.createElement('style');
rippleStyles.textContent = `
  .photo-card img {
    transform: scale(1);
    transition: transform 700ms cubic-bezier(.2,.8,.2,1), filter 700ms ease;
  }
  .photo-card:hover img {
    transform: scale(1.03);
    filter: saturate(1.08);
  }

  .panel, .glass-card, .photo-card, .service-card, .why-item, .process-step {
    will-change: transform, opacity;
  }

  .btn { position: relative; overflow: hidden; }
  .ripple {
    position: absolute;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.35);
    transform: scale(0);
    animation: ripple 420ms ease-out;
    pointer-events: none;
  }
  @keyframes ripple {
    to { transform: scale(2.4); opacity: 0; }
  }
`;
document.head.appendChild(rippleStyles);

// Add a soft parallax feel to the image gallery as the user scrolls
const galleryCards = document.querySelectorAll('.photo-card');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  galleryCards.forEach((card, index) => {
    const depth = (index % 2 === 0 ? 1 : -1) * 8;
    card.style.transform = `translateY(${Math.max(-8, Math.min(8, scrollY * 0.015 * depth))}px)`;
  });
}, { passive: true });

console.log('Clays Fresh Start Cleaning - cinematic design loaded ✨');
