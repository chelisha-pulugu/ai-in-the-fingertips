/* ============================================================
   HOLLOW PINE — script.js
   ============================================================ */

(function () {
  'use strict';

  /* ---- Scroll-triggered fade-up animations ---- */
  const observerOptions = {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  };

  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-up').forEach(el => {
    fadeObserver.observe(el);
  });

  /* ---- Mobile nav toggle ---- */
  const menuToggle = document.getElementById('menuToggle');
  const mobileNav  = document.getElementById('mobileNav');
  let menuOpen = false;

  menuToggle.addEventListener('click', () => {
    menuOpen = !menuOpen;
    mobileNav.classList.toggle('open', menuOpen);
    mobileNav.setAttribute('aria-hidden', String(!menuOpen));

    const spans = menuToggle.querySelectorAll('span');
    if (menuOpen) {
      spans[0].style.transform = 'translateY(6px) rotate(45deg)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'translateY(-6px) rotate(-45deg)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });

  // Close mobile nav on link click
  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
      menuOpen = false;
      mobileNav.classList.remove('open');
      mobileNav.setAttribute('aria-hidden', 'true');
      menuToggle.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });

  /* ---- Smooth scroll for all internal anchors ---- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* ---- Nav background on scroll ---- */
  const nav = document.querySelector('.nav');
  let lastScrollY = 0;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Subtle shadow on scroll
    if (scrollY > 60) {
      nav.style.background = 'rgba(30,30,30,0.92)';
      nav.style.backdropFilter = 'blur(12px)';
      nav.style.webkitBackdropFilter = 'blur(12px)';
      nav.style.borderBottom = '1px solid rgba(199,183,138,0.08)';
    } else {
      nav.style.background = '';
      nav.style.backdropFilter = '';
      nav.style.webkitBackdropFilter = '';
      nav.style.borderBottom = '';
    }

    // Hide nav on scroll down, show on scroll up
    if (scrollY > lastScrollY && scrollY > 200) {
      nav.style.transform = 'translateY(-110%)';
    } else {
      nav.style.transform = 'translateY(0)';
    }
    nav.style.transition = 'transform 0.4s ease, background 0.4s ease, border-bottom 0.4s ease';
    lastScrollY = scrollY;
  }, { passive: true });

  /* ---- Animated waveform canvas ---- */
  const canvas = document.getElementById('waveformCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let frame = 0;

    function resizeCanvas() {
      width  = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width  = width  * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });

    // Multiple sine wave layers
    const waves = [
      { amp: 10, freq: 0.012, speed: 0.018, color: 'rgba(163,177,138,0.35)', lineWidth: 1.2 },
      { amp: 15, freq: 0.009, speed: 0.012, color: 'rgba(199,183,138,0.25)', lineWidth: 1.0 },
      { amp: 7,  freq: 0.018, speed: 0.025, color: 'rgba(214,204,194,0.18)', lineWidth: 0.8 },
      { amp: 20, freq: 0.006, speed: 0.008, color: 'rgba(163,177,138,0.12)', lineWidth: 1.5 },
    ];

    function drawWave(wave, t) {
      ctx.beginPath();
      ctx.lineWidth = wave.lineWidth;
      ctx.strokeStyle = wave.color;

      const mid = height / 2;
      const step = 4;

      for (let x = 0; x <= width; x += step) {
        const y = mid +
          Math.sin(x * wave.freq + t * wave.speed) * wave.amp +
          Math.sin(x * wave.freq * 1.7 + t * wave.speed * 0.7) * (wave.amp * 0.4);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    function animateWaveform() {
      ctx.clearRect(0, 0, width, height);

      // Center line
      ctx.beginPath();
      ctx.lineWidth = 0.5;
      ctx.strokeStyle = 'rgba(199,183,138,0.07)';
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();

      waves.forEach(wave => drawWave(wave, frame));
      frame++;
      requestAnimationFrame(animateWaveform);
    }

    animateWaveform();
  }

  /* ---- Parallax on hero blobs ---- */
  const blobs = document.querySelectorAll('.blob');

  window.addEventListener('mousemove', (e) => {
    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;

    blobs.forEach((blob, i) => {
      const factor = (i + 1) * 12;
      blob.style.transform = `translate(${dx * factor}px, ${dy * factor}px)`;
    });
  }, { passive: true });

  /* ---- Vinyl ring parallax on scroll ---- */
  const rings = document.querySelectorAll('.vinyl-ring');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    rings.forEach((ring, i) => {
      const speed = (i + 1) * 0.08;
      ring.style.transform = `rotate(${scrollY * speed}deg)`;
    });
  }, { passive: true });

  /* ---- Play button interaction ---- */
  document.querySelectorAll('.play-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const svg = this.querySelector('svg');
      const isPlaying = this.dataset.playing === 'true';

      // Simple toggle icon (play / pause)
      if (!isPlaying) {
        this.dataset.playing = 'true';
        svg.innerHTML = '<rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/>';
        svg.setAttribute('stroke', 'currentColor');
        svg.setAttribute('stroke-width', '1.5');
        svg.setAttribute('fill', 'none');
      } else {
        this.dataset.playing = 'false';
        svg.innerHTML = '<polygon points="5,3 19,12 5,21"/>';
      }
    });
  });

  /* ---- Staggered show rows appearance ---- */
  const showRows = document.querySelectorAll('.show-row');
  const showObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity  = '1';
          entry.target.style.transform = 'translateX(0)';
        }, i * 80);
        showObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  showRows.forEach(row => {
    row.style.opacity   = '0';
    row.style.transform = 'translateX(-20px)';
    row.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    showObserver.observe(row);
  });

  /* ---- Hero title letter-stagger on load ---- */
  document.querySelectorAll('.title-line').forEach((line) => {
    const text  = line.textContent;
    const chars = text.split('').map((ch, i) => {
      const span = document.createElement('span');
      span.textContent = ch === ' ' ? '\u00A0' : ch;
      span.style.display         = 'inline-block';
      span.style.opacity         = '0';
      span.style.transform       = 'translateY(20px)';
      span.style.transition      = `opacity 0.6s ease ${0.35 + i * 0.04}s, transform 0.6s ease ${0.35 + i * 0.04}s`;
      return span;
    });
    line.textContent = '';
    chars.forEach(s => line.appendChild(s));

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        chars.forEach(s => {
          s.style.opacity   = '1';
          s.style.transform = 'translateY(0)';
        });
      });
    });
  });

  /* ---- Cursor glow effect (desktop only) ---- */
  if (window.matchMedia('(pointer: fine)').matches) {
    const glow = document.createElement('div');
    glow.style.cssText = `
      position: fixed;
      width: 300px;
      height: 300px;
      border-radius: 50%;
      pointer-events: none;
      z-index: 0;
      background: radial-gradient(circle, rgba(199,183,138,0.04) 0%, transparent 70%);
      transform: translate(-50%, -50%);
      transition: left 0.15s ease, top 0.15s ease;
      mix-blend-mode: screen;
    `;
    document.body.appendChild(glow);

    window.addEventListener('mousemove', (e) => {
      glow.style.left = e.clientX + 'px';
      glow.style.top  = e.clientY + 'px';
    }, { passive: true });
  }

})();
