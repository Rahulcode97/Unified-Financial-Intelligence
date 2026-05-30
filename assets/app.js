/**
 * Portfolio app shell: sidebar, mobile menu, transaction modal
 */
(function () {
    var sidebar = document.getElementById('sidebar');
    var toggle = document.getElementById('sidebarToggle');
    var mobileBtn = document.getElementById('mobileMenuBtn');
    if (toggle && sidebar) {
        toggle.addEventListener('click', function () {
            sidebar.classList.toggle('collapsed');
            toggle.textContent = sidebar.classList.contains('collapsed') ? '\u203a' : '\u2039';
            toggle.setAttribute('title', sidebar.classList.contains('collapsed') ? 'Expand sidebar' : 'Collapse sidebar');
        });
    }
    function syncMobileNav() {
        if (!sidebar) return;
        var isMobile = window.innerWidth <= 900;
        if (!isMobile) {
            sidebar.classList.remove('mobile-open');
            document.body.classList.remove('fd-nav-open');
            return;
        }
        document.body.classList.toggle('fd-nav-open', sidebar.classList.contains('mobile-open'));
    }

    if (mobileBtn && sidebar) {
        mobileBtn.addEventListener('click', function () {
            sidebar.classList.toggle('mobile-open');
            syncMobileNav();
        });
        sidebar.querySelectorAll('.nav-item[href]').forEach(function (link) {
            link.addEventListener('click', function () {
                if (window.innerWidth > 900) return;
                sidebar.classList.remove('mobile-open');
                syncMobileNav();
            });
        });
    }
    document.addEventListener('click', function (e) {
        if (!sidebar || !mobileBtn) return;
        if (window.innerWidth > 900) return;
        if (sidebar.classList.contains('mobile-open') &&
            !sidebar.contains(e.target) && !mobileBtn.contains(e.target)) {
            sidebar.classList.remove('mobile-open');
            syncMobileNav();
        }
    });
    window.addEventListener('resize', syncMobileNav);

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
        if (e.key === 'Escape' && overlay && overlay.classList.contains('is-open')) {
            closeTxModal();
        }
    });
})();

// Live date display
(function() {
    var el = document.getElementById('live-date');
    if (el) {
        el.textContent = new Date().toLocaleDateString('en-IN', {
            weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
        });
    }
})();
