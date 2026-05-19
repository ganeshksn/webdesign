/**
 * Template Name: GreatIndian Native Redesign
 * Native JS: Custom Cursor, Navbar, Scroll Animations, Counter
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================================
  // 1. Custom Creative Cursor (ring + dot, lerp-smoothed)
  // ==========================================================================
  (function initCursor() {
    if (!window.matchMedia('(hover: hover)').matches) return;

    const ring = document.createElement('div');
    ring.className = 'cursor-ring';
    const dot = document.createElement('div');
    dot.className = 'cursor-dot';
    document.body.appendChild(ring);
    document.body.appendChild(dot);

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX  = mouseX;
    let ringY  = mouseY;

    function lerp(a, b, t) { return a + (b - a) * t; }

    (function animateRing() {
      ringX = lerp(ringX, mouseX, 0.12);
      ringY = lerp(ringY, mouseY, 0.12);
      ring.style.left = ringX + 'px';
      ring.style.top  = ringY + 'px';
      requestAnimationFrame(animateRing);
    })();

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = mouseX + 'px';
      dot.style.top  = mouseY + 'px';
      document.body.classList.remove('cursor-hidden');
    }, { passive: true });

    document.addEventListener('mouseleave', () => document.body.classList.add('cursor-hidden'));
    document.addEventListener('mouseenter', () => document.body.classList.remove('cursor-hidden'));

    const interactive = 'a, button, [role="button"], input, textarea, select, label, .btn, .card, .nav-link';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(interactive)) document.body.classList.add('cursor-hover');
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(interactive)) document.body.classList.remove('cursor-hover');
    });

    document.addEventListener('mousedown', () => document.body.classList.add('cursor-click'));
    document.addEventListener('mouseup',   () => document.body.classList.remove('cursor-click'));
  })();

  // ==========================================================================
  // 2. Navbar Toggle
  // ==========================================================================
  const navbarToggler  = document.querySelector('.navbar-toggler');
  const navbarCollapse = document.querySelector('.navbar-collapse');

  if (navbarToggler && navbarCollapse) {
    navbarToggler.addEventListener('click', () => navbarCollapse.classList.toggle('show'));
  }

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      if (navbarCollapse && navbarCollapse.classList.contains('show')) {
        navbarCollapse.classList.remove('show');
      }
    });
  });

  // ==========================================================================
  // 3. Sticky Navbar & Back to Top
  // ==========================================================================
  const navbar    = document.querySelector('.navbar');
  const backToTop = document.querySelector('.back-to-top');

  window.addEventListener('scroll', () => {
    const s = window.scrollY > 50;
    if (navbar)    navbar.classList.toggle('scrolled', s);
    if (backToTop) backToTop.classList.toggle('show', s);
  }, { passive: true });

  if (backToTop) {
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // ==========================================================================
  // 4. Scroll Animations via IntersectionObserver (replaces Wow.js)
  // ==========================================================================
  const wowMap = {
    fadeInUp:    'fade-in-up',
    fadeInLeft:  'fade-in-left',
    fadeInRight: 'fade-in-right',
    zoomIn:      'zoom-in',
  };

  document.querySelectorAll('.wow').forEach(el => {
    el.classList.remove('wow');
    let matched = false;
    for (const [wowCls, nativeCls] of Object.entries(wowMap)) {
      if (el.classList.contains(wowCls)) {
        el.classList.remove(wowCls);
        el.classList.add(nativeCls);
        matched = true;
        break;
      }
    }
    if (!matched) el.classList.add('fade-in-up');
  });

  const scrollObs = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        obs.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px', threshold: 0.15 });

  document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right, .zoom-in')
    .forEach(el => scrollObs.observe(el));

  // ==========================================================================
  // 5. Animated Number Counter
  // ==========================================================================
  const counters = document.querySelectorAll('.number');
  if (counters.length) {
    const cntObs = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el  = entry.target;
          const end = parseInt(el.dataset.number, 10);
          animateCounter(el, end, 2000);
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => cntObs.observe(c));
  }

  function animateCounter(el, end, duration) {
    let start = null;
    function step(ts) {
      if (!start) start = ts;
      const p    = Math.min((ts - start) / duration, 1);
      const ease = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      el.textContent = Math.floor(ease * end).toLocaleString();
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = end.toLocaleString();
    }
    requestAnimationFrame(step);
  }

});

  // ==========================================================================
  // 5. Anti-Bot Contact Protection
  // ==========================================================================
  const cData = {
    e_user: 'info', e_domain: 'greatindian.net',
    p_code: '+91', p_num: '7075722270'
  };

  document.querySelectorAll('.prot-email').forEach(el => {
    el.href = 'mailto:' + cData.e_user + '@' + cData.e_domain;
    let t = el.querySelector('.c-text');
    if (t) t.textContent = cData.e_user + '@' + cData.e_domain;
    else el.textContent = cData.e_user + '@' + cData.e_domain;
  });

  document.querySelectorAll('.prot-phone').forEach(el => {
    el.href = 'tel:' + cData.p_code + cData.p_num;
    let t = el.querySelector('.c-text');
    if (t) t.textContent = cData.p_code + ' ' + cData.p_num;
    else el.textContent = cData.p_code + ' ' + cData.p_num;
  });

  window.getProtectedEmail = function() { return cData.e_user + '@' + cData.e_domain; };
  window.getProtectedPhone = function() { return cData.p_code.replace('+','') + cData.p_num; };
  // ==========================================================================
  // 6. Expand Features List
  // ==========================================================================
  const expandBtn = document.getElementById('btn-expand-features');
  const featuresContainer = document.getElementById('features-collapsible');
  const featuresWrapper = document.getElementById('features-wrapper');
  const featuresButtonContainer = expandBtn ? expandBtn.closest('.sticky-btn-container') : null;
  
  if (expandBtn && featuresContainer) {
    const syncFeaturesButtonPosition = () => {
      if (!featuresButtonContainer) return;

      const isExpanded = featuresContainer.classList.contains('expanded');
      if (!isExpanded) {
        featuresButtonContainer.classList.remove('within-features-collapsible');
        return;
      }

      const topOffset = 76;
      const bounds = featuresContainer.getBoundingClientRect();
      const isWithinFeatures = bounds.bottom > topOffset && bounds.top < window.innerHeight;
      featuresButtonContainer.classList.toggle('within-features-collapsible', isWithinFeatures);
    };

    window.addEventListener('scroll', syncFeaturesButtonPosition, { passive: true });
    window.addEventListener('resize', syncFeaturesButtonPosition);

    expandBtn.addEventListener('click', () => {
      if (featuresContainer.style.display === 'none' || featuresContainer.style.display === '') {
        featuresContainer.style.display = 'block';
        // force reflow
        void featuresContainer.offsetWidth;
        featuresContainer.classList.add('expanded');
        if (featuresWrapper) featuresWrapper.classList.add('expanded');
        featuresContainer.style.maxHeight = (featuresContainer.scrollHeight + 100) + 'px';
        expandBtn.innerHTML = '<span class="mai-chevron-up mr-2"></span> Hide features list';
        syncFeaturesButtonPosition();
        
        // After transition, allow responsive height
        setTimeout(() => {
          if (featuresContainer.classList.contains('expanded')) {
            featuresContainer.style.maxHeight = 'none';
            syncFeaturesButtonPosition();
          }
        }, 850);
      } else {
        featuresContainer.style.maxHeight = featuresContainer.scrollHeight + 'px';
        // force reflow
        void featuresContainer.offsetWidth;
        featuresContainer.style.maxHeight = '0';
        featuresContainer.classList.remove('expanded');
        if (featuresWrapper) featuresWrapper.classList.remove('expanded');
        if (featuresButtonContainer) featuresButtonContainer.classList.remove('within-features-collapsible');
        expandBtn.innerHTML = '<span class="mai-layers-outline mr-2"></span> List of features we can implement';
        
        setTimeout(() => {
          if (!featuresContainer.classList.contains('expanded')) {
            featuresContainer.style.display = 'none';
            expandBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 800);
      }
    });
  }

  // ==========================================================================
  // 7. Feature Tabs (Desktop)
  // ==========================================================================
  const tabBtns = document.querySelectorAll('.frt-tab-btn');
  const tabPanes = document.querySelectorAll('.frt-category');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active from all
      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.style.display = 'none');
      
      // Add active to clicked
      btn.classList.add('active');
      const targetId = btn.getAttribute('data-target');
      const targetPane = document.getElementById(targetId);
      if (targetPane) {
        targetPane.style.display = 'block';
      }
    });
  });
