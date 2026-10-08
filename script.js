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
        kpis: ['ISV & SI Ecosystem Day @ Salesforce', 'AE & ISV Speed Dating @ Salesforce'],
        color: '#e8710a'
      },
      {
        label: 'Business\nPlanning',
        title: 'Joint Business Planning',
        desc: 'Develop comprehensive joint business plans with ISV partners, including pipeline targets, investment asks, and product roadmap. Deliver quarterly business reviews with data-backed insights that shape partner strategy.',
        kpis: ['Mutual Success Criteria'],
        color: '#1e8e3e'
      },
      {
        label: 'C-Level\nEngagement',
        title: 'Executive Engagement',
        desc: 'Own strategic executive relationships with ISV partner leadership, driving commitment on product integration, go-to-market investment, and innovation roadmap. Negotiate commercial terms and revenue-share agreements at the highest level.',
        kpis: ['Executive Sponsors'],
        color: '#9334e6'
      },
      {
        label: 'Cross-Func\nAlignment',
        title: 'Cross-Functional Orchestration',
        desc: 'Act as ecosystem quarterback, orchestrating Sales, Solution Engineering, Product, Partner Operations, Legal and Marketing teams around joint partner opportunities. Drive deal velocity through internal advocacy and escalation management.',
        kpis: ['Cross-Functional Collaboration'],
        color: '#d93025'
      },
      {
        label: 'Cloud\nConsumption',
        title: 'Cloud & Credits Consumption Growth',
        desc: 'Accelerate platform adoption and consumption revenue through new use cases and product/cloud modernization opportunities.',
        kpis: ['From SaaS to Consumption-Based'],
        color: '#00897b'
      },
      {
        label: 'Marketplace\nOps',
        title: 'Marketplace & Monetization',
        desc: 'Scale partner revenue through marketplace listings, transaction optimization and new monetization models. Manage the commercial partner lifecycle from onboarding to revenue-share growth.',
        kpis: ['Marketplace Growth'],
        color: '#c2185b'
      },
      {
        label: 'Ecosystem\nScaling',
        title: 'Ecosystem Scaling',
        desc: 'Recruit, enable, and grow the ISV partner portfolio across regions and verticals. Design repeatable multi-regional co-sell programs and scalable enablement frameworks.',
        kpis: ['Tour de France des Éditeurs', '100+ Startups Engaged', '5-City Tour', '140% vs Target'],
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

  // ─── Slack Praise Carousel ───
  const slackStage = document.getElementById('slackStage');
  if (slackStage) {
    const SLACK_MSGS = [
      {
        sender: 'Thomas Mendy', initials: 'TM', color: '#4A154B', time: '09:24',
        text: 'Billy.io, ils ont signé hier ! P\'tit contrat de six mois, mais sur les dash ça me fait comme s\'ils avaient pris 1 an, MERCI STEVE !!!!!!!!!!!',
        reactions: [{ emoji: '🎉', count: 3 }, { emoji: '🔥', count: 2 }]
      },
      {
        sender: 'Guillaume Deshayes', initials: 'GD', color: '#1264A3', time: '12:20',
        text: 'Salut Steve, Merci encore pour ton aide auprès du partenaire pour booker Rothelec.',
        reactions: [{ emoji: '🙏', count: 1 }]
      },
      {
        sender: 'Amy Gorman', initials: 'AG', color: '#E01E5A', time: 'Aug 6, 2025 · 14:20',
        text: '<span class="slack-mention">@Steve Gasdeblay</span> Congrats on the promotion! So well deserved. Thank you for all you do for your partners!! Cheers. 🙌',
        reactions: [{ emoji: '❤️', count: 5 }, { emoji: '🎉', count: 4 }]
      },
      {
        sender: 'Maxime Briant', initials: 'MB', color: '#36C5F0', time: '09:57',
        text: 'You rock !',
        reactions: [{ emoji: '💪', count: 2 }]
      },
      {
        sender: 'Mathieu Estrela', initials: 'ME', color: '#2EB67D', time: 'Nov 8, 2024 · 14:48',
        text: 'super !! Merci Steve pour l\'enorme boulot auprès des partenaires',
        reactions: [{ emoji: '👏', count: 3 }]
      },
      {
        sender: 'Amaury Milliot', initials: 'AM', color: '#ECB22E', time: '11:06',
        text: 'Merci bcp pour ton aide ! Franchement sans toi les isv ca serait compliqué',
        reactions: [{ emoji: '🙏', count: 2 }]
      },
      {
        sender: 'Jean-Yves FALIERE', initials: 'JF', color: '#4A154B', time: '16:50',
        text: 'Hello Steve ! Merci beaucoup ! Tu es le meilleur !',
        reactions: [{ emoji: '⭐', count: 2 }, { emoji: '❤️', count: 1 }]
      },
      {
        sender: 'Julia Taube', initials: 'JT', color: '#E01E5A', time: 'Dec 4, 2023 · 12:31',
        text: 'Monday Update: saying hi to the DQE team sponsoring the Sales Development Summit in Dublin and Eric, who could not stop talking about how great it is working with <span class="slack-mention">@Steve Gasdeblay</span> 😃',
        reactions: [{ emoji: '🔥', count: 3 }, { emoji: '👏', count: 2 }]
      },
      {
        sender: 'Silke Pumberger-Schreck', initials: 'SP', color: '#1264A3', time: '12:28',
        text: 'Well done, Steve. Together with Hope you\'re having great success with supporting Tuvis! I see that they closed a lot of customers. Nice!',
        reactions: [{ emoji: '🎉', count: 2 }]
      },
      {
        sender: 'Simona Nanda', initials: 'SN', color: '#2EB67D', time: '16:01',
        text: 'Hey <span class="slack-mention">@Steve Gasdeblay</span>, thank you so much for assisting <span class="slack-mention">@Amaury Milliot</span> with the questions about ACV recognition! Really appreciate the support there!',
        reactions: [{ emoji: '🙏', count: 2 }, { emoji: '❤️', count: 1 }]
      },
      {
        sender: 'Nawal Chakour', initials: 'NC', color: '#4A154B', time: '21:07',
        text: 'Merci Steve pour ton aide today',
        reactions: [{ emoji: '🙏', count: 1 }]
      },
      {
        sender: 'Guillaume Jouquan', initials: 'GJ', color: '#36C5F0', time: 'Sep 29, 2022 · 10:23',
        text: 'Amazing day! Feedbacks are really great!! Our partners on AgentExchange were delighted to be there (Copado, sofacto, AWS, Gonexa, Secutix, Odaseva) <span class="slack-mention">@Steve Gasdeblay</span>, thanks for taking care of them 😊',
        reactions: [{ emoji: '🎉', count: 5 }, { emoji: '🔥', count: 3 }]
      },
      {
        sender: 'Mario Riley', initials: 'MR', color: '#ECB22E', time: '18:00',
        text: '🏆 <strong>Q2 ISV SPIFF Winners</strong> 🏆<br>Top ISV PAMs:<br><strong>#1 <span class="slack-mention">@Steve Gasdeblay</span> — 55% above target — $2,000</strong>',
        reactions: [{ emoji: '🏆', count: 6 }, { emoji: '🎉', count: 4 }, { emoji: '🔥', count: 3 }]
      },
      {
        sender: 'Ximena Roth', initials: 'XR', color: '#E01E5A', time: 'Jun 18, 2025 · 01:03',
        text: 'I wanted to sincerely thank Steve for jumping in for one of the TDX sessions that I led: <strong>Grow Your Business as an Agentforce Partner</strong>. His professionalism and flexibility throughout the entire process was commendable.',
        reactions: [{ emoji: '👏', count: 4 }, { emoji: '🔥', count: 2 }, { emoji: '❤️', count: 3 }]
      }
    ];

    let slackIdx = 0;
    let slackTransitioning = false;
    let slackScrollDriven = true;
    const slackMsgEl = document.getElementById('slackMessage');
    const slackCounterEl = document.getElementById('slackCounter');
    const slackDotsEl = document.getElementById('slackDots');
    const slackProgressEl = document.getElementById('slackProgress');
    const slackPrevBtn = document.getElementById('slackPrev');
    const slackNextBtn = document.getElementById('slackNext');

    SLACK_MSGS.forEach(function(_, i) {
      var dot = document.createElement('span');
      dot.className = 'slack-dot' + (i === 0 ? ' active' : '');
      dot.addEventListener('click', function() { slackGoTo(i); });
      slackDotsEl.appendChild(dot);
    });

    function slackRender(idx) {
      var m = SLACK_MSGS[idx];
      slackMsgEl.innerHTML =
        '<div class="slack-msg-avatar" style="background:' + m.color + '">' + m.initials + '</div>' +
        '<div class="slack-msg-body">' +
          '<div class="slack-msg-header">' +
            '<span class="slack-msg-sender">' + m.sender + '</span>' +
            '<span class="slack-msg-time">' + m.time + '</span>' +
          '</div>' +
          '<div class="slack-msg-text">' + m.text + '</div>' +
          '<div class="slack-msg-reactions">' +
            m.reactions.map(function(r) {
              return '<span class="slack-reaction">' + r.emoji +
                '<span class="slack-reaction-count">' + r.count + '</span></span>';
            }).join('') +
          '</div>' +
        '</div>';

      slackCounterEl.textContent = (idx + 1) + ' of ' + SLACK_MSGS.length;

      var dots = slackDotsEl.querySelectorAll('.slack-dot');
      for (var i = 0; i < dots.length; i++) {
        dots[i].classList.toggle('active', i === idx);
      }

      slackPrevBtn.disabled = idx === 0;
      slackNextBtn.disabled = idx === SLACK_MSGS.length - 1;
      slackProgressEl.style.width = ((idx + 1) / SLACK_MSGS.length * 100) + '%';
      slackIdx = idx;
    }

    function slackGoTo(idx) {
      if (idx === slackIdx || slackTransitioning || idx < 0 || idx >= SLACK_MSGS.length) return;
      slackTransitioning = true;
      slackMsgEl.classList.add('slack-exit');

      setTimeout(function() {
        slackRender(idx);
        slackMsgEl.classList.remove('slack-exit');
        slackMsgEl.classList.add('slack-enter');
        requestAnimationFrame(function() {
          requestAnimationFrame(function() {
            slackMsgEl.classList.remove('slack-enter');
            slackTransitioning = false;
          });
        });
      }, 250);
    }

    slackRender(0);

    function slackScrollToMsg(idx) {
      if (idx < 0 || idx >= SLACK_MSGS.length) return;
      var stageTop = slackStage.getBoundingClientRect().top + window.pageYOffset;
      var stageH = slackStage.offsetHeight;
      var viewH = window.innerHeight;
      var scrollRange = stageH - viewH;
      var targetScroll = stageTop + (idx / SLACK_MSGS.length) * scrollRange;
      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    }

    slackPrevBtn.addEventListener('click', function() {
      var target = slackIdx - 1;
      if (target >= 0) {
        slackScrollDriven = false;
        slackGoTo(target);
        slackScrollToMsg(target);
        setTimeout(function() { slackScrollDriven = true; }, 800);
      }
    });

    slackNextBtn.addEventListener('click', function() {
      var target = slackIdx + 1;
      if (target < SLACK_MSGS.length) {
        slackScrollDriven = false;
        slackGoTo(target);
        slackScrollToMsg(target);
        setTimeout(function() { slackScrollDriven = true; }, 800);
      }
    });

    SLACK_MSGS.forEach(function(_, i) {
      slackDotsEl.children[i].addEventListener('click', function() {
        slackScrollDriven = false;
        slackGoTo(i);
        slackScrollToMsg(i);
        setTimeout(function() { slackScrollDriven = true; }, 800);
      });
    });

    window.addEventListener('scroll', function() {
      if (window.innerWidth <= 900 || !slackScrollDriven) return;

      var rect = slackStage.getBoundingClientRect();
      var stageH = slackStage.offsetHeight;
      var viewH = window.innerHeight;
      var scrolled = -rect.top;
      var scrollRange = stageH - viewH;
      if (scrollRange <= 0) return;

      var progress = Math.max(0, Math.min(0.999, scrolled / scrollRange));
      var newIdx = Math.floor(progress * SLACK_MSGS.length);
      newIdx = Math.max(0, Math.min(SLACK_MSGS.length - 1, newIdx));

      if (newIdx !== slackIdx) {
        slackGoTo(newIdx);
      }
    }, { passive: true });

    // ─── Flying Stars Background ───
    var starsContainer = document.getElementById('starsContainer');
    if (starsContainer) {
      var STAR_PALETTE = [
        { color: '#FBBC05', glow: 'rgba(251,188,5,0.45)' },
        { color: '#4285F4', glow: 'rgba(66,133,244,0.4)' },
        { color: '#34A853', glow: 'rgba(52,168,83,0.4)' },
        { color: '#EA4335', glow: 'rgba(234,67,53,0.4)' },
        { color: '#E01E5A', glow: 'rgba(224,30,90,0.4)' }
      ];
      var STAR_CHARS = ['★', '✦', '✨', '★', '✦'];
      var starsActive = false;
      var starThrottle = 0;

      var starsObserver = new IntersectionObserver(function(entries) {
        starsActive = entries[0].isIntersecting;
      }, { threshold: 0 });
      starsObserver.observe(slackStage);

      function spawnStar() {
        var star = document.createElement('span');
        star.className = 'star';

        var side = Math.random() < 0.5;
        var leftPct = side ? Math.random() * 18 : 82 + Math.random() * 18;

        var viewH = window.innerHeight;
        var stageRect = slackStage.getBoundingClientRect();
        var visibleTop = Math.max(0, -stageRect.top);
        var visibleBottom = Math.min(slackStage.offsetHeight, -stageRect.top + viewH);
        var topPx = visibleTop + Math.random() * (visibleBottom - visibleTop);

        var size = 18 + Math.random() * 18;
        var duration = (2.5 + Math.random() * 2).toFixed(2);
        var drift = (-40 + Math.random() * 80).toFixed(0);
        var driftEnd = (-60 + Math.random() * 120).toFixed(0);
        var palette = STAR_PALETTE[Math.floor(Math.random() * STAR_PALETTE.length)];
        var ch = STAR_CHARS[Math.floor(Math.random() * STAR_CHARS.length)];

        star.textContent = ch;
        star.style.left = leftPct + '%';
        star.style.top = topPx + 'px';
        star.style.fontSize = size + 'px';
        star.style.color = palette.color;
        star.style.setProperty('--star-duration', duration + 's');
        star.style.setProperty('--star-drift', drift + 'px');
        star.style.setProperty('--star-drift-end', driftEnd + 'px');
        star.style.setProperty('--star-glow', palette.glow);

        starsContainer.appendChild(star);
        star.addEventListener('animationend', function() {
          star.remove();
        });
      }

      window.addEventListener('scroll', function() {
        if (!starsActive) return;
        var now = Date.now();
        if (now - starThrottle < 60) return;
        starThrottle = now;

        var count = 2 + Math.floor(Math.random() * 2);
        for (var i = 0; i < count; i++) {
          spawnStar();
        }
      }, { passive: true });
    }
  }
})();
