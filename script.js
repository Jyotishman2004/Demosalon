/* ═══════════════════════════════════════════════════════════════
   PHLOX UNISEX SALON — Interactive Features
   - Navbar scroll effects
   - Mobile menu toggle
   - Hero gold particles
   - Counter animations (supports decimal for 4.9 rating)
   - Scroll-reveal animations
   - Gallery marquee
   - Booking form with validation + success state
   - Active nav link highlighting
   ═══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ─── Navbar Scroll Effect ─────────────────────────────────
  const navbar = document.getElementById('navbar');
  let lastScrollY = 0;

  function handleNavbarScroll() {
    const currentScrollY = window.scrollY;
    if (currentScrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScrollY = currentScrollY;
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll(); // Run on load

  // ─── Mobile Menu Toggle ───────────────────────────────────
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');

  menuToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    menuToggle.classList.toggle('active');
    menuToggle.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close mobile menu on link click
  navLinks.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      menuToggle.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // ─── Active Nav Link Highlighting ─────────────────────────
  const sections = document.querySelectorAll('section[id]');
  const navLinkElements = document.querySelectorAll('.nav-link:not(.btn)');

  function updateActiveNav() {
    const scrollPos = window.scrollY + 120;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navLinkElements.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });

  // ─── Hero Gold Particles ──────────────────────────────────
  const particlesContainer = document.getElementById('hero-particles');

  function createParticles() {
    const count = window.innerWidth < 768 ? 15 : 30;

    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.classList.add('particle');

      const size = Math.random() * 4 + 1;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.animationDelay = `${Math.random() * 8}s`;
      particle.style.animationDuration = `${Math.random() * 6 + 6}s`;
      particle.style.opacity = `${Math.random() * 0.5 + 0.1}`;

      particlesContainer.appendChild(particle);
    }
  }

  createParticles();

  // ─── Counter Animation ────────────────────────────────────
  const statNumbers = document.querySelectorAll('.hero-stat-number[data-target]');
  let countersAnimated = false;

  function animateCounters() {
    if (countersAnimated) return;

    statNumbers.forEach((el) => {
      const isDecimal = el.hasAttribute('data-decimal');
      const target = isDecimal
        ? parseFloat(el.getAttribute('data-target'))
        : parseInt(el.getAttribute('data-target'), 10);
      const duration = 2000;
      const startTime = performance.now();

      function easeOutExpo(t) {
        return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      }

      function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutExpo(progress);
        const currentValue = easedProgress * target;

        if (isDecimal) {
          el.textContent = currentValue.toFixed(1) + '★';
        } else {
          el.textContent = Math.floor(currentValue).toLocaleString() + '+';
        }

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          if (isDecimal) {
            el.textContent = target.toFixed(1) + '★';
          } else {
            el.textContent = target.toLocaleString() + '+';
          }
        }
      }

      requestAnimationFrame(updateCounter);
    });

    countersAnimated = true;
  }

  // Trigger counters when hero stats are in view
  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) {
    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounters();
            statsObserver.disconnect();
          }
        });
      },
      { threshold: 0.5 }
    );
    statsObserver.observe(heroStats);
  }

  // ─── Scroll Reveal Animation ──────────────────────────────
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  // ─── Gallery Marquee ──────────────────────────────────────
  const marqueeTrack = document.getElementById('marquee-track');
  const galleryImages = [
    { src: 'images/hero.png', alt: 'Phlox Salon interior' },
    { src: 'images/service-hair.png', alt: 'Hair styling service' },
    { src: 'images/service-facial.png', alt: 'Facial and skincare treatment' },
    { src: 'images/service-grooming.png', alt: 'Beard grooming service' },
    { src: 'images/about.png', alt: 'Salon waiting area' },
    { src: 'images/stylist-1.png', alt: 'Phlox team member' },
    { src: 'images/stylist-2.png', alt: 'Firoz - Lead Stylist' },
    { src: 'images/stylist-3.png', alt: 'Phlox team member' },
  ];

  function buildMarquee() {
    // Double the items for seamless infinite scroll
    const items = [...galleryImages, ...galleryImages];

    items.forEach((img) => {
      const item = document.createElement('div');
      item.classList.add('marquee-item');

      const imgEl = document.createElement('img');
      imgEl.src = img.src;
      imgEl.alt = img.alt;
      imgEl.loading = 'lazy';

      item.appendChild(imgEl);
      marqueeTrack.appendChild(item);
    });
  }

  buildMarquee();

  // ─── Menu Tabs Logic ──────────────────────────────────────
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons and panes
      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));
      
      // Add active class to clicked button
      btn.classList.add('active');
      
      // Show corresponding pane
      const targetId = btn.getAttribute('data-target');
      const targetPane = document.getElementById(targetId);
      if (targetPane) {
        targetPane.classList.add('active');
      }
    });
  });

  // ─── Accordion Logic ──────────────────────────────────────
  const accordionHeaders = document.querySelectorAll('.accordion-header');

  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const content = item.querySelector('.accordion-content');
      
      // Toggle active class on the item
      item.classList.toggle('active');
      
      // Animate max-height
      if (item.classList.contains('active')) {
        content.style.maxHeight = content.scrollHeight + "px";
      } else {
        content.style.maxHeight = 0;
      }
    });
  });

  // ─── Booking Form ─────────────────────────────────────────
  const bookingForm = document.getElementById('booking-form');
  const formSuccess = document.getElementById('form-success');

  // Set min date to today
  const dateInput = document.getElementById('booking-date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Basic validation
    const name = document.getElementById('booking-name').value.trim();
    const email = document.getElementById('booking-email').value.trim();
    const phone = document.getElementById('booking-phone').value.trim();
    const service = document.getElementById('booking-service').value;
    const date = document.getElementById('booking-date').value;

    if (!name || !email || !phone || !service || !date) {
      // Shake the submit button for feedback
      const btn = document.getElementById('booking-submit');
      btn.style.animation = 'none';
      btn.offsetHeight; // trigger reflow
      btn.style.animation = 'shake 0.5s ease';
      return;
    }

    // Show loading state
    const submitBtn = document.getElementById('booking-submit');
    const originalContent = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span>Sending...</span>';
    submitBtn.disabled = true;

    // Simulate API call
    setTimeout(() => {
      bookingForm.style.display = 'none';
      formSuccess.classList.add('active');
      submitBtn.innerHTML = originalContent;
      submitBtn.disabled = false;
    }, 1500);
  });

  // ─── Smooth Scroll for CTA buttons ───────────────────────
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ─── Shake Animation (injected via JS for form) ──────────
  const shakeKeyframes = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
      20%, 40%, 60%, 80% { transform: translateX(4px); }
    }
  `;
  const styleSheet = document.createElement('style');
  styleSheet.textContent = shakeKeyframes;
  document.head.appendChild(styleSheet);

  // ─── Parallax-lite on Hero Background ─────────────────────
  const heroBg = document.querySelector('.hero-bg img');

  function handleParallax() {
    if (window.innerWidth < 768) return;
    const scrolled = window.scrollY;
    if (scrolled < window.innerHeight) {
      heroBg.style.transform = `scale(1.1) translateY(${scrolled * 0.15}px)`;
    }
  }

  window.addEventListener('scroll', handleParallax, { passive: true });

  // ─── Preloader fade (optional graceful entry) ─────────────
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.6s ease';
  window.addEventListener('load', () => {
    document.body.style.opacity = '1';
  });
  // Fallback: ensure body is visible after 1s even if load event doesn't fire
  setTimeout(() => {
    document.body.style.opacity = '1';
  }, 1000);
});
