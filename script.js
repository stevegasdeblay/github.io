(() => {
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

  // ─── Scroll-driven center-viewport zoom ───
  const centerObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle('is-centered', entry.isIntersecting);
      });
    },
    { rootMargin: '-35% 0px -35% 0px', threshold: 0 }
  );

  document.querySelectorAll('.section, .hero').forEach((el) => {
    centerObserver.observe(el);
  });

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
