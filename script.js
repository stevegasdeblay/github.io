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

  const childSelectors = '.card, .timeline-item, .skill-table-wrap, .skill-legend, .subsection-title, .action-plan-grid > .card, .about-stats .stat, .contact-item, .aspirations-grid .aspiration, .journey-node, .li-rec-card';
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

  // ─── Kudos stream: stacked → spread on scroll + hover zoom ───
  const kudosStream = document.getElementById('kudosStream');
  if (kudosStream) {
    const msgs = Array.from(kudosStream.querySelectorAll('.kudos-msg'));
    msgs.forEach((msg, i) => {
      msg.style.transitionDelay = `${i * 60}ms`;
    });

    const kudosObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            kudosStream.classList.add('spread');
            kudosObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    kudosObserver.observe(kudosStream);

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

  // ─── Task Wheel ───
  const wheelCanvas = document.getElementById('taskWheel');
  if (wheelCanvas) {
    const SEGMENTS = [
      {
        label: 'Co-Sell\nRevenue',
        title: 'ISV Co-Sell Revenue',
        desc: 'Drive partner-sourced pipeline and close co-sell deals alongside field sales teams. Own quota attainment across a portfolio of ISV partners, from opportunity identification through negotiation to close.',
        kpis: ['$2.1M Quota', '138% Attainment', '22 ISV Partners'],
        color: '#1a73e8'
      },
      {
        label: 'GTM\nExecution',
        title: 'Go-to-Market Execution',
        desc: 'Design and launch joint go-to-market motions with ISV partners to accelerate customer adoption and platform consumption. Build sales plays, enablement kits, and ROI narratives that equip field teams to sell partner solutions.',
        kpis: ['Partner Pipeline', 'Campaign Conversion', 'Time-to-Revenue'],
        color: '#e8710a'
      },
      {
        label: 'Business\nPlanning',
        title: 'Joint Business Planning',
        desc: 'Develop comprehensive joint business plans with ISV partners, including pipeline targets, investment asks, and mutual success criteria. Deliver quarterly business reviews with data-backed insights that shape partner strategy.',
        kpis: ['JBP Execution', 'Forecast Accuracy', 'QBR Cadence'],
        color: '#1e8e3e'
      },
      {
        label: 'C-Level\nEngagement',
        title: 'Executive Engagement',
        desc: 'Own strategic executive relationships with ISV partner leadership, driving commitment on product integration, go-to-market investment, and innovation roadmap. Negotiate commercial terms and revenue-share agreements at the highest level.',
        kpis: ['$95K→$566K Rev Share', 'Exec Sponsors', 'Strategic Deals'],
        color: '#9334e6'
      },
      {
        label: 'Cross-Func\nAlignment',
        title: 'Cross-Functional Orchestration',
        desc: 'Act as ecosystem quarterback, orchestrating Sales, Solution Engineering, Product, and Marketing teams around joint partner opportunities. Drive deal velocity through internal advocacy and escalation management.',
        kpis: ['5+ Teams Coordinated', 'Deal Cycle Time', 'Win Rate Lift'],
        color: '#d93025'
      },
      {
        label: 'Cloud\nConsumption',
        title: 'Cloud Consumption Growth',
        desc: 'Accelerate platform adoption and consumption revenue through partner-led solutions and joint customer engagements. Identify workload migration and cloud modernization opportunities with ISV partners.',
        kpis: ['€2.6M Pipeline', 'Workload Migrations', 'Attach Rate'],
        color: '#00897b'
      },
      {
        label: 'Marketplace\nOps',
        title: 'Marketplace & Monetization',
        desc: 'Scale partner revenue through marketplace listings, billing integration, and transaction optimization. Manage the commercial partner lifecycle from onboarding through revenue-share growth.',
        kpis: ['Marketplace Growth', 'Rev Share Uplift', 'Partner Activation'],
        color: '#c2185b'
      },
      {
        label: 'Ecosystem\nScaling',
        title: 'Ecosystem Scaling',
        desc: 'Recruit, enable, and grow the ISV partner portfolio across regions and verticals. Design repeatable multi-regional co-sell programs and scalable enablement frameworks.',
        kpis: ['100+ Startups Engaged', '5-City Tour', '140% vs Target'],
        color: '#f9ab00',
        textColor: '#202124'
      }
    ];

    const SEG_N = SEGMENTS.length;
    const ARC_DEG = 360 / SEG_N;
    const ARC = (2 * Math.PI) / SEG_N;

    function hexToRgb(hex) {
      return parseInt(hex.slice(1, 3), 16) + ',' +
             parseInt(hex.slice(3, 5), 16) + ',' +
             parseInt(hex.slice(5, 7), 16);
    }

    function drawWheel() {
      const S = 400;
      const dpr = window.devicePixelRatio || 1;
      wheelCanvas.width = S * dpr;
      wheelCanvas.height = S * dpr;
      const ctx = wheelCanvas.getContext('2d');
      ctx.scale(dpr, dpr);

      const cx = S / 2, cy = S / 2, r = cx - 8;

      SEGMENTS.forEach((seg, i) => {
        const a0 = i * ARC - Math.PI / 2;
        const a1 = (i + 1) * ARC - Math.PI / 2;
        const mid = a0 + ARC / 2;

        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, r, a0, a1);
        ctx.closePath();
        ctx.fillStyle = seg.color;
        ctx.fill();
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = 'rgba(255,255,255,0.85)';
        ctx.stroke();

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(mid);

        const nm = ((mid % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
        const flip = nm > Math.PI / 2 && nm < Math.PI * 1.5;
        if (flip) ctx.rotate(Math.PI);

        ctx.fillStyle = seg.textColor || '#fff';
        ctx.font = 'bold 12px "Google Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const tr = r * 0.67;
        seg.label.split('\n').forEach((line, j, arr) => {
          const y = (j - (arr.length - 1) / 2) * 15;
          ctx.fillText(line, flip ? -tr : tr, y);
        });
        ctx.restore();
      });

      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.lineWidth = 4;
      ctx.strokeStyle = 'rgba(0,0,0,0.06)';
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx, cy, 42, 0, Math.PI * 2);
      ctx.fillStyle = '#fff';
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#e8eaed';
      ctx.stroke();
    }

    drawWheel();

    let currentAngle = 0;
    let isSpinning = false;
    const spinBtn = document.getElementById('wheelSpinBtn');
    const detailEl = document.getElementById('wheelDetail');

    function spinWheel() {
      if (isSpinning) return;
      isSpinning = true;
      spinBtn.textContent = '•••';

      const turns = 5 + Math.floor(Math.random() * 4);
      const offset = Math.random() * 360;
      currentAngle += turns * 360 + offset;

      wheelCanvas.classList.add('wheel-spinning');
      wheelCanvas.style.transform = 'rotate(' + currentAngle + 'deg)';

      let cleaned = false;
      function finish() {
        if (cleaned) return;
        cleaned = true;
        wheelCanvas.removeEventListener('transitionend', finish);
        clearTimeout(safety);
        isSpinning = false;
        spinBtn.textContent = 'SPIN';
        wheelCanvas.classList.remove('wheel-spinning');

        const nd = ((currentAngle % 360) + 360) % 360;
        const pp = (360 - nd) % 360;
        const idx = Math.floor(pp / ARC_DEG) % SEG_N;
        showSegment(idx);
      }

      wheelCanvas.addEventListener('transitionend', finish);
      const safety = setTimeout(finish, 5200);
    }

    function showSegment(idx) {
      const s = SEGMENTS[idx];
      const rgb = hexToRgb(s.color);
      const kpis = s.kpis.map(
        (k) => '<span class="wheel-kpi" style="color:' + s.color +
               ';background:rgba(' + rgb + ',0.1)">' + k + '</span>'
      ).join('');

      detailEl.innerHTML =
        '<div class="wheel-detail-content" style="border-left-color:' + s.color + '">' +
          '<div class="wheel-detail-title">' + s.title + '</div>' +
          '<p class="wheel-detail-desc">' + s.desc + '</p>' +
          '<div class="wheel-detail-kpis">' + kpis + '</div>' +
        '</div>';
    }

    spinBtn.addEventListener('click', spinWheel);

    const hitArea = document.getElementById('wheelHitArea');
    hitArea.addEventListener('click', (e) => {
      if (isSpinning) return;
      const rect = hitArea.getBoundingClientRect();
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const x = e.clientX - rect.left - cx;
      const y = e.clientY - rect.top - cy;
      const dist = Math.sqrt(x * x + y * y);

      if (dist < cx * 0.22) {
        spinWheel();
        return;
      }

      if (dist < cx * 0.95) {
        let angle = Math.atan2(y, x) + Math.PI / 2;
        if (angle < 0) angle += Math.PI * 2;
        const rotRad = ((currentAngle % 360) * Math.PI) / 180;
        let segAngle = ((angle - rotRad) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
        const idx = Math.floor(segAngle / ARC) % SEG_N;
        showSegment(idx);
      }
    });
  }
})();
