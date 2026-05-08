/**
 * Homepage motion: hero parallax + scroll drama, scroll reveals, stat count-up.
 * Respects prefers-reduced-motion.
 */
(function () {
  const hero = document.querySelector('.land-hero');
  const body = document.body;
  if (!hero) return;

  let reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function listenReduce() {
    reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      hero.style.removeProperty('--hero-parallax');
      hero.style.removeProperty('--hero-parallax-deep');
      hero.style.removeProperty('--hero-drama');
      body.classList.remove('land-hero-scroll');
    }
    document.querySelectorAll('.land-reveal').forEach((el) => {
      if (reduceMotion) el.classList.add('land-reveal--visible');
    });
  }
  window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', listenReduce);

  function setHeroVars() {
    if (reduceMotion) return;
    const y = window.scrollY;
    const h = hero.offsetHeight || 1;
    const drama = Math.min(1, Math.max(0, y / (h * 0.5)));
    hero.style.setProperty('--hero-drama', drama.toFixed(4));
    hero.style.setProperty('--hero-parallax', `${y * 0.38}px`);
    hero.style.setProperty('--hero-parallax-deep', `${y * 0.2}px`);
    body.classList.toggle('land-hero-scroll', y > 24);
  }

  let scrollTick = false;
  function onScroll() {
    if (!scrollTick) {
      requestAnimationFrame(() => {
        setHeroVars();
        scrollTick = false;
      });
      scrollTick = true;
    }
  }

  document.querySelectorAll('[data-reveal-i]').forEach((el) => {
    el.style.setProperty('--reveal-i', el.getAttribute('data-reveal-i'));
  });

  const revealIO = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add('land-reveal--visible');
        revealIO.unobserve(e.target);
      });
    },
    { rootMargin: '0px 0px -6% 0px', threshold: 0.05 }
  );

  document.querySelectorAll('.land-reveal').forEach((el) => {
    if (reduceMotion) {
      el.classList.add('land-reveal--visible');
    } else {
      revealIO.observe(el);
    }
  });

  function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  function formatCount(n, decimals) {
    if (decimals > 0) return n.toFixed(decimals);
    return Math.round(n).toLocaleString('en-IN');
  }

  const countIO = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        if (el.dataset.countDone) return;
        el.dataset.countDone = '1';
        countIO.unobserve(el);
        if (reduceMotion) return;

        const target = parseFloat(el.dataset.target, 10);
        if (Number.isNaN(target)) return;
        const prefix = el.dataset.prefix || '';
        const suffix = el.dataset.suffix || '';
        const decimals = parseInt(el.dataset.decimals || '0', 10);
        const duration = Math.min(2000, 720 + Math.min(target, 500) * 3.2);
        const t0 = performance.now();

        function frame(now) {
          const t = Math.min(1, (now - t0) / duration);
          const v = target * easeOutQuart(t);
          el.textContent = prefix + formatCount(v, decimals) + suffix;
          if (t < 1) requestAnimationFrame(frame);
          else el.textContent = prefix + formatCount(target, decimals) + suffix;
        }
        requestAnimationFrame(frame);
      });
    },
    { threshold: 0.2, rootMargin: '30px' }
  );

  document.querySelectorAll('[data-land-count]').forEach((el) => {
    if (!reduceMotion) {
      const decimals = parseInt(el.dataset.decimals || '0', 10);
      const prefix = el.dataset.prefix || '';
      const suffix = el.dataset.suffix || '';
      el.textContent = prefix + formatCount(0, decimals) + suffix;
      countIO.observe(el);
    }
  });

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', setHeroVars);
  setHeroVars();
})();
