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
  // 6. Expand Feature Journey
  // ==========================================================================
  const expandBtn = document.getElementById('btn-expand-features');
  const featuresContainer = document.getElementById('features-collapsible');
  const featuresWrapper = document.getElementById('features-wrapper');
  const featuresButtonContainer = expandBtn ? expandBtn.closest('.sticky-btn-container') : null;
  const journeyOrbit = document.getElementById('journey-orbit');
  const journeyOrbitCurrent = journeyOrbit ? journeyOrbit.querySelector('.journey-orbit-current') : null;
  let featureJourneyOpen = false;

  const syncFeaturesButtonPosition = () => {
    if (!featuresButtonContainer || !featuresContainer) return;
    const bounds = featuresContainer.getBoundingClientRect();
    const isWithinJourney = featuresContainer.classList.contains('expanded') && bounds.bottom > 76 && bounds.top < window.innerHeight;
    featuresButtonContainer.classList.toggle('within-feature-journey', isWithinJourney);
    if (journeyOrbit) journeyOrbit.classList.toggle('is-visible', isWithinJourney);
  };

  window.addEventListener('scroll', syncFeaturesButtonPosition, { passive: true });
  window.addEventListener('resize', syncFeaturesButtonPosition);

  const closeFeatureJourney = () => {
    if (!featuresContainer || !featuresContainer.classList.contains('expanded')) return;
    featuresContainer.style.maxHeight = featuresContainer.scrollHeight + 'px';
    void featuresContainer.offsetWidth;
    featuresContainer.style.maxHeight = '0';
    featuresContainer.classList.remove('expanded');
    if (featuresWrapper) featuresWrapper.classList.remove('expanded');
    document.body.classList.remove('feature-journey-open');
    featureJourneyOpen = false;
    if (featuresButtonContainer) featuresButtonContainer.classList.remove('within-feature-journey');
    if (journeyOrbit) journeyOrbit.classList.remove('is-visible');
    if (expandBtn) {
      expandBtn.setAttribute('aria-expanded', 'false');
      expandBtn.innerHTML = '<span class="mai-layers-outline mr-2"></span> List of features we can implement';
    }
    window.setTimeout(() => {
      if (!featuresContainer.classList.contains('expanded')) {
        featuresContainer.style.display = 'none';
        if (expandBtn) expandBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 800);
  };

  if (expandBtn && featuresContainer) {
    expandBtn.addEventListener('click', () => {
      if (featuresContainer.style.display === 'none' || featuresContainer.style.display === '') {
        featuresContainer.style.display = 'block';
        // force reflow
        void featuresContainer.offsetWidth;
        featuresContainer.classList.add('expanded');
        if (featuresWrapper) featuresWrapper.classList.add('expanded');
        document.body.classList.add('feature-journey-open');
        featureJourneyOpen = true;
        featuresContainer.style.maxHeight = (featuresContainer.scrollHeight + 100) + 'px';
        expandBtn.setAttribute('aria-expanded', 'true');
        expandBtn.innerHTML = '<span class="mai-chevron-up mr-2"></span> Hide features list';
        syncFeaturesButtonPosition();
        window.setTimeout(() => {
          const featureStory = document.querySelector('.features-masonry-mobile');
          if (featureStory && featureJourneyOpen) {
            const storyTop = window.scrollY + featureStory.getBoundingClientRect().top;
            window.scrollTo({ top: storyTop, behavior: 'smooth' });
          }
        }, 120);
        
        // After transition, allow responsive height
        setTimeout(() => {
          if (featuresContainer.classList.contains('expanded')) {
            featuresContainer.style.maxHeight = 'none';
          }
        }, 850);
      } else {
        closeFeatureJourney();
      }
    });
  }

  // ==========================================================================
  // 7. Feature Journey navigation and scroll state (Desktop)
  // ==========================================================================
  const tabBtns = document.querySelectorAll('.frt-tab-btn');
  const tabPanes = document.querySelectorAll('.frt-category');

  const featureStory = document.querySelector('.features-masonry-mobile');
  const desktopJourney = window.matchMedia('(min-width: 992px)');

  function setActiveFeature(targetId) {
    const activeIndex = Array.from(tabPanes).findIndex(pane => pane.id === targetId);
    if (activeIndex < 0) return;
    tabBtns.forEach(btn => {
      const isActive = btn.dataset.target === targetId;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-current', isActive ? 'step' : 'false');
      if (isActive && desktopJourney.matches) btn.scrollIntoView({ block: 'nearest' });
    });
    tabPanes.forEach((pane, index) => {
      pane.classList.toggle('is-current', index === activeIndex);
      pane.classList.toggle('is-past', index < activeIndex);
    });
    if (journeyOrbit && journeyOrbitCurrent) {
      journeyOrbitCurrent.textContent = String(activeIndex + 1).padStart(2, '0');
      journeyOrbit.style.setProperty('--journey-progress', `${((activeIndex + 1) / tabPanes.length) * 100}%`);
      journeyOrbit.setAttribute('aria-label', `Feature category ${activeIndex + 1} of ${tabPanes.length}`);
    }
  }

  tabBtns.forEach(btn => {
    btn.setAttribute('aria-controls', btn.dataset.target);
    btn.addEventListener('click', () => {
      const targetPane = document.getElementById(btn.dataset.target);
      if (!targetPane) return;
      setActiveFeature(targetPane.id);
      if (!desktopJourney.matches) {
        targetPane.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  if (featureStory && tabPanes.length) {
    let wheelLocked = false;
    const advanceJourney = event => {
      if (!desktopJourney.matches || !featureJourneyOpen) return;
      const bounds = featureStory.getBoundingClientRect();
      if (bounds.bottom <= 0 || bounds.top >= window.innerHeight) return;
      const direction = Math.sign(event.deltaY);
      const currentIndex = Array.from(tabPanes).findIndex(pane => pane.classList.contains('is-current'));
      const nextIndex = currentIndex + direction;
      if (nextIndex < 0 || nextIndex >= tabPanes.length) {
        event.preventDefault();
        closeFeatureJourney();
        return;
      }
      event.preventDefault();
      if (wheelLocked || Math.abs(event.deltaY) < 8) return;
      wheelLocked = true;
      setActiveFeature(tabPanes[nextIndex].id);
      window.setTimeout(() => { wheelLocked = false; }, 650);
    };
    window.addEventListener('wheel', advanceJourney, { passive: false });
    desktopJourney.addEventListener('change', () => setActiveFeature('frt-cat-1'));
    setActiveFeature('frt-cat-1');
  }
