(function () {
  'use strict';

  /* ── Smooth Nav Scroll ── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* ── Nav Scroll Treatment ── */
  var nav = document.getElementById('nav');
  var ticking = false;
  function updateNav() {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) {
      requestAnimationFrame(updateNav);
      ticking = true;
    }
  }, { passive: true });

  /* ── Hero Zoom ── */
  var hero = document.querySelector('.hero');
  if (hero) {
    setTimeout(function () { hero.classList.add('hero-zoomed'); }, 300);
  }

  /* ── Animated Counters ── */
  var countersAnimated = false;
  var statNumbers = document.querySelectorAll('.stat-number');

  function animateCounters() {
    if (countersAnimated) return;
    countersAnimated = true;
    statNumbers.forEach(function (el) {
      var target = parseInt(el.getAttribute('data-count'), 10);
      var current = 0;
      var duration = 2000;
      var startTime = null;
      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        current = Math.floor(eased * target);
        el.textContent = current;
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = target;
        }
      }
      requestAnimationFrame(step);
    });
  }

  /* ── Intersection Observer for Counters ── */
  var statsSection = document.querySelector('.stats-section');
  if (statsSection && statNumbers.length) {
    var statsObserver = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        animateCounters();
        statsObserver.unobserve(statsSection);
      }
    }, { threshold: 0.3 });
    statsObserver.observe(statsSection);
  }

  /* ── Scroll Reveal ── */
  var revealElements = document.querySelectorAll(
    '.section-header, .card, .why-card, .step, .gallery-pair, .comparison'
  );

  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal', 'visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  revealElements.forEach(function (el) {
    el.classList.add('reveal');
    revealObserver.observe(el);
  });

  /* ── Before/After Comparison Slider ── */
  var container = document.getElementById('comparisonContainer');
  var afterWrap = document.getElementById('afterWrap');
  var handle = document.getElementById('comparisonHandle');
  var comparison = document.getElementById('comparison');

  if (container && afterWrap && handle) {
    var isDragging = false;
    var hasAutoPlayed = false;

    function setPosition(x) {
      var rect = container.getBoundingClientRect();
      var pos = (x - rect.left) / rect.width;
      pos = Math.max(0, Math.min(1, pos));
      var percent = pos * 100;
      afterWrap.style.clipPath = 'inset(0 ' + (100 - percent) + '% 0 0)';
      handle.style.left = percent + '%';
    }

    function getClientX(e) {
      if (e.touches && e.touches.length) {
        return e.touches[0].clientX;
      }
      return e.clientX;
    }

    /* Mouse */
    handle.addEventListener('mousedown', function (e) {
      isDragging = true;
      e.preventDefault();
    });
    document.addEventListener('mousemove', function (e) {
      if (!isDragging) return;
      setPosition(e.clientX);
    });
    document.addEventListener('mouseup', function () {
      isDragging = false;
    });

    /* Touch */
    handle.addEventListener('touchstart', function (e) {
      isDragging = true;
      e.preventDefault();
    }, { passive: false });
    document.addEventListener('touchmove', function (e) {
      if (!isDragging) return;
      setPosition(getClientX(e));
    }, { passive: false });
    document.addEventListener('touchend', function () {
      isDragging = false;
    });

    /* Click on container to jump */
    container.addEventListener('click', function (e) {
      if (e.target === handle || handle.contains(e.target)) return;
      setPosition(e.clientX);
    });

    /* Auto-play demo when scrolled into view */
    var autoPlayObserver = new IntersectionObserver(function (entries) {
      var entry = entries[0];
      if (entry.isIntersecting && !hasAutoPlayed) {
        hasAutoPlayed = true;
        autoPlayDemo();
        autoPlayObserver.unobserve(container);
      }
    }, { threshold: 0.3 });

    autoPlayObserver.observe(container);

    function autoPlayDemo() {
      var rect = container.getBoundingClientRect();
      var startX = rect.left;
      var endX = rect.left + rect.width;
      var duration = 1800;
      var startTime = null;

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        var eased = progress < 0.5
          ? 2 * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;
        var x = startX + eased * (endX - startX);
        setPosition(x);
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          /* Pause at the end, then return */
          setTimeout(function () {
            var returnStart = null;
            var returnDuration = 1200;
            var startPos = rect.left + rect.width;
            var endPos = rect.left + rect.width * 0.5;
            function returnStep(ts) {
              if (!returnStart) returnStart = ts;
              var p = Math.min((ts - returnStart) / returnDuration, 1);
              var e = 1 - Math.pow(1 - p, 3);
              var x = startPos + e * (endPos - startPos);
              setPosition(x);
              if (p < 1) requestAnimationFrame(returnStep);
            }
            requestAnimationFrame(returnStep);
          }, 600);
        }
      }
      requestAnimationFrame(step);
    }
  }

  /* ── Parallax Hero ── */
  var heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    window.addEventListener('scroll', function () {
      var scrolled = window.scrollY;
      var maxScroll = window.innerHeight;
      var offset = Math.min(scrolled / maxScroll, 0.5) * 30;
      heroBg.style.transform = 'translateY(' + offset + 'px)';
    }, { passive: true });
  }

})();
