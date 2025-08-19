// script.js
/* =========================================================
   NovaTech — Interactions
   Features:
   - Preloader
   - Sticky header shrink on scroll
   - Dark mode toggle (with localStorage)
   - Mobile menu toggle
   - Smooth scrolling
   - IntersectionObserver reveal animations
   - Testimonials carousel
   - Back to Top button
   - Form validation (Contact + Newsletter)
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  /* ========== Preloader ========== */
  const preloader = document.getElementById('preloader');
  setTimeout(() => preloader?.classList.add('hidden'), 600);

  /* ========== Header shrink on scroll ========== */
  const header = document.getElementById('site-header');
  const backToTop = document.getElementById('backToTop');
  const onScroll = () => {
    const y = window.scrollY || document.documentElement.scrollTop;
    header.classList.toggle('scrolled', y > 8);
    if (backToTop){
      if (y > 400) backToTop.classList.add('show');
      else backToTop.classList.remove('show');
    }
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ========== Dark mode toggle ========== */
  const themeToggle = document.getElementById('themeToggle');
  const root = document.documentElement;
  const THEME_KEY = 'novatech-theme';

  const setTheme = (mode) => {
    root.setAttribute('data-theme', mode);
    try { localStorage.setItem(THEME_KEY, mode); } catch {}
    themeToggle.innerHTML = mode === 'dark'
      ? '<i class="fa-solid fa-sun"></i>'
      : '<i class="fa-solid fa-moon"></i>';
    themeToggle.setAttribute('aria-label', `Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`);
  };

  // Initialize theme
  const saved = (() => { try { return localStorage.getItem(THEME_KEY); } catch { return null } })();
  if (saved) setTheme(saved);
  else {
    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDark ? 'dark' : 'light');
  }
  themeToggle?.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    setTheme(next);
  });

  /* ========== Mobile menu toggle ========== */
  const menuToggle = document.getElementById('menuToggle');
  const navList = document.getElementById('navList');
  menuToggle?.addEventListener('click', () => {
    const open = navList.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
  });

  /* ========== Smooth scrolling for on-page anchors ========== */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Close mobile nav if open
        if (navList.classList.contains('open')) {
          navList.classList.remove('open');
          menuToggle.setAttribute('aria-expanded', 'false');
        }
      }
    });
  });

  /* ========== Reveal on scroll (fade/slide) ========== */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  /* ========== Testimonials carousel ========== */
  const track = document.getElementById('testimonialTrack');
  const prev = document.querySelector('.carousel .prev');
  const next = document.querySelector('.carousel .next');
  let index = 0;

  function updateCarousel(dir = 0) {
    const slides = track.querySelectorAll('.testimonial');
    if (!slides.length) return;
    index = (index + dir + slides.length) % slides.length;
    const x = index * slides[0].offsetWidth;
    track.scrollTo({ left: x, behavior: 'smooth' });
  }
  prev?.addEventListener('click', () => updateCarousel(-1));
  next?.addEventListener('click', () => updateCarousel(1));
  window.addEventListener('resize', () => updateCarousel(0));

  /* ========== Back to top ========== */
  backToTop?.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ========== Year in footer ========== */
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  /* ========== Forms: validation ========== */
  // Contact form
  const contactForm = document.getElementById('contactForm');
  const formMsg = document.getElementById('formMsg');
  const nameField = document.getElementById('name');
  const emailField = document.getElementById('email');
  const messageField = document.getElementById('message');
  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const messageError = document.getElementById('messageError');

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    if (!nameField.value.trim()) { nameError.textContent = 'Please enter your name.'; valid = false; } else nameError.textContent = '';
    if (!emailPattern.test(emailField.value.trim())) { emailError.textContent = 'Enter a valid email address.'; valid = false; } else emailError.textContent = '';
    if (!messageField.value.trim()) { messageError.textContent = 'Please add a message.'; valid = false; } else messageError.textContent = '';

    if (!valid) return;

    formMsg.textContent = 'Sending...';
    setTimeout(() => {
      formMsg.textContent = 'Thanks! We will get back to you shortly.';
      contactForm.reset();
    }, 700);
  });

  // Newsletter form
  const newsletterForm = document.getElementById('newsletterForm');
  const newsletterEmail = document.getElementById('newsletterEmail');
  const newsletterError = document.getElementById('newsletterError');
  const newsletterMsg = document.getElementById('newsletterMsg');

  newsletterForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!emailPattern.test(newsletterEmail.value.trim())) {
      newsletterError.textContent = 'Enter a valid email address.';
      return;
    }
    newsletterError.textContent = '';
    newsletterMsg.textContent = 'Subscribed!';
    setTimeout(() => { newsletterMsg.textContent = ''; newsletterForm.reset(); }, 1600);
  });
});
