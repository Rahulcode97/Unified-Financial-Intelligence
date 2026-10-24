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

    // Scroll reveal
    var els = document.querySelectorAll('.cs-reveal');
    if (!('IntersectionObserver' in window)) {
        els.forEach(function (el) { el.classList.add('is-in'); });
    } else {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
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
