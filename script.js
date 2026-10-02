(() => {
  // ─── Particle field ───
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let particles = [];
  const PARTICLE_COUNT = 50;
  const CONNECT_DIST = 120;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: 1 + Math.random(),
        opacity: 0.3 + Math.random() * 0.4,
      });
    }
  }

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${p.opacity})`;
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECT_DIST) {
          const alpha = (1 - dist / CONNECT_DIST) * 0.15;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(drawParticles);
  }

  resize();
  createParticles();
  drawParticles();
  window.addEventListener('resize', () => {
    resize();
    createParticles();
  });

  // ─── Sidebar active state on scroll ───
  const sections = document.querySelectorAll('.section, .hero');
  const navLinks = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach((link) => {
            link.classList.toggle('active', link.dataset.section === id);
          });
        }
      });
    },
    {
      rootMargin: '-20% 0px -60% 0px',
    }
  );

  sections.forEach((s) => observer.observe(s));

  // ─── Smooth scroll for nav links ───
  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.getElementById(link.dataset.section);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ─── Scroll-driven reveal ───
  const hero = document.querySelector('.hero');
  if (hero) hero.classList.add('reveal');

  document.querySelectorAll('.section').forEach((section) => {
    section.classList.add('reveal');
  });

  const childSelectors = '.card, .timeline-item, .skill-table-wrap, .skill-legend, .subsection-title, .action-plan-grid > .card, .about-stats .stat, .contact-item, .aspirations-grid .aspiration, .journey-node';
  document.querySelectorAll(childSelectors).forEach((el) => {
    el.classList.add('reveal-child');
  });

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          el.classList.add('visible');

          if (el.classList.contains('reveal')) {
            const children = el.querySelectorAll('.reveal-child');
            children.forEach((child, i) => {
              setTimeout(() => child.classList.add('visible'), 120 + i * 80);
            });
          }

          revealObserver.unobserve(el);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

  // ─── Google Chat feed: stacked → spread on scroll + hover zoom ───
  const gchatStream = document.getElementById('gchatStream');
  if (gchatStream) {
    const msgs = Array.from(gchatStream.querySelectorAll('.gchat-msg'));
    msgs.forEach((msg, i) => {
      msg.style.transitionDelay = `${i * 70}ms`;
    });

    const gchatObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gchatStream.classList.add('spread');
            gchatObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    gchatObserver.observe(gchatStream);

    msgs.forEach((msg, i) => {
      msg.addEventListener('mouseenter', () => {
        msgs.forEach((m) => m.classList.remove('hovered', 'neighbor'));
        msg.classList.add('hovered');
        if (i > 0) msgs[i - 1].classList.add('neighbor');
        if (i < msgs.length - 1) msgs[i + 1].classList.add('neighbor');
      });

      msg.addEventListener('mouseleave', () => {
        msgs.forEach((m) => m.classList.remove('hovered', 'neighbor'));
      });
    });
  }
})();
