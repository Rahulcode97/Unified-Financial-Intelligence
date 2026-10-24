/**
 * Site behaviour: theme toggle, scroll reveal, transaction modal, live date.
 * The theme is applied early by the inline snippet in each page's <head>.
 */
(function () {
    var root = document.documentElement;
    root.classList.add('js');

    // Theme toggle (light default; choice remembered per viewer)
    document.querySelectorAll('.cs-theme').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            root.setAttribute('data-theme', next);
            try { localStorage.setItem('rs-theme', next); } catch (e) {}
            btn.setAttribute('aria-pressed', next === 'dark' ? 'true' : 'false');
            document.dispatchEvent(new CustomEvent('rs-theme', { detail: next }));
        });
        btn.setAttribute('aria-pressed', root.getAttribute('data-theme') === 'dark' ? 'true' : 'false');
    });

    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    requestAnimationFrame(function () { document.body.classList.add('is-ready'); });

    // Stagger index for grid children
    document.querySelectorAll('.cs-stagger').forEach(function (g) {
        Array.prototype.forEach.call(g.children, function (c, i) { c.style.setProperty('--i', i); });
    });

    // Count-up numbers: <span data-count="36" data-decimals="0">36</span>
    function countUp(el) {
        var target = parseFloat(el.getAttribute('data-count'));
        var dec = parseInt(el.getAttribute('data-decimals') || '0', 10);
        if (isNaN(target) || reduce) return;
        var start = null, dur = 1100;
        function fmt(v) { return v.toLocaleString('en-IN', { minimumFractionDigits: dec, maximumFractionDigits: dec }); }
        function step(ts) {
            if (start === null) start = ts;
            var p = Math.min(1, (ts - start) / dur);
            var e = 1 - Math.pow(1 - p, 3);
            el.textContent = fmt(target * e);
            if (p < 1) requestAnimationFrame(step); else el.textContent = fmt(target);
        }
        el.textContent = fmt(0);
        requestAnimationFrame(step);
    }

    // Pointer-follow glow
    document.querySelectorAll('.cs-glow').forEach(function (el) {
        el.addEventListener('pointermove', function (e) {
            var r = el.getBoundingClientRect();
            el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
            el.style.setProperty('--my', (e.clientY - r.top) + 'px');
        });
    });

    // Homepage fleet teaser: random slot lights
    document.querySelectorAll('[data-fleet-mini]').forEach(function (wrap) {
        var leds = wrap.querySelectorAll('.fl-led');
        function tick() {
            leds.forEach(function (l) {
                var r = Math.random();
                l.className = 'fl-led' + (r < 0.55 ? ' on' : r < 0.75 ? ' ai' : r < 0.8 ? ' warn' : '');
            });
        }
        tick();
        if (!reduce) setInterval(tick, 1400);
    });

    // Scroll reveal
    var els = document.querySelectorAll('.cs-reveal, .cs-stagger, [data-count]');
    if (!('IntersectionObserver' in window)) {
        els.forEach(function (el) { el.classList.add('is-in'); });
    } else {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (e.isIntersecting) {
                    e.target.classList.add('is-in');
                    if (e.target.hasAttribute('data-count')) countUp(e.target);
                    io.unobserve(e.target);
                }
            });
        }, { rootMargin: '0px 0px -8% 0px' });
        els.forEach(function (el) { io.observe(el); });
    }

    // Transaction detail modal (finance demo pages)
    var overlay = document.getElementById('txModalOverlay');
    var modalBody = document.getElementById('txModalBody');
    var modalTitle = document.getElementById('txModalTitle');

    function openTxModal(ref, title) {
        if (!overlay || !modalBody) return;
        var html = window.PORTFOLIO_TX_DETAILS && window.PORTFOLIO_TX_DETAILS[ref];
        if (modalTitle) modalTitle.textContent = title || 'Transaction Detail';
        modalBody.innerHTML = html || '<p class="cc-api-missing">No detail for this reference.</p>';
        overlay.classList.add('is-open');
        overlay.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeTxModal() {
        if (!overlay) return;
        overlay.classList.remove('is-open');
        overlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    window.openPortfolioTxModal = openTxModal;
    window.closePortfolioTxModal = closeTxModal;

    if (overlay) {
        overlay.addEventListener('click', function (e) {
            if (e.target === overlay) closeTxModal();
        });
    }
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && overlay && overlay.classList.contains('is-open')) closeTxModal();
    });

    // Live date
    var dateEl = document.getElementById('live-date');
    if (dateEl) {
        dateEl.textContent = new Date().toLocaleDateString('en-IN', {
            weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
        });
    }
})();
