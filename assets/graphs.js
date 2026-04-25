/**
 * Portfolio analytics — FY series (Apr 25 – Mar 26), drill-down by conference.
 */
(function () {
    var MONTHS = ['Apr 25', 'May 25', 'Jun 25', 'Jul 25', 'Aug 25', 'Sep 25', 'Oct 25', 'Nov 25', 'Dec 25', 'Jan 26', 'Feb 26', 'Mar 26'];

    var CONF = [
        { id: 'icrai', name: 'ICRAI 2026', color: '#0c5252' },
        { id: 'ncme', name: 'NCME 2026', color: '#0e7490' },
        { id: 'wcm', name: 'WCM 2026', color: '#059669' },
        { id: 'gs', name: 'Global Summit 2026', color: '#7c3aed' },
        { id: 'other', name: 'Open / unassigned', color: '#64748b' }
    ];

    var confShare = { icrai: 0.34, ncme: 0.22, wcm: 0.18, gs: 0.14, other: 0.12 };
    var monthlyRevenue = [42, 38, 45, 52, 48, 55, 61, 58, 63, 70, 66, 72];
    var monthlyFees = [4.2, 3.8, 4.5, 5.0, 4.5, 5.1, 5.5, 5.2, 5.8, 6.2, 5.7, 6.0];

    var byConf = {};
    CONF.forEach(function (c) {
        var s = confShare[c.id];
        byConf[c.id] = { name: c.name, color: c.color, monthProfit: [], totalRevenue: 0, totalFees: 0, totalProfit: 0 };
        for (var m = 0; m < 12; m++) {
            var rev = Math.round(monthlyRevenue[m] * s * 10) / 10;
            var fee = Math.round(monthlyFees[m] * s * 10) / 10;
            var prof = Math.round((rev - fee - rev * 0.08) * 10) / 10;
            byConf[c.id].monthProfit.push(prof);
            byConf[c.id].totalRevenue += rev;
            byConf[c.id].totalFees += fee;
            byConf[c.id].totalProfit += prof;
        }
        byConf[c.id].totalRevenue = Math.round(byConf[c.id].totalRevenue * 10) / 10;
        byConf[c.id].totalFees = Math.round(byConf[c.id].totalFees * 10) / 10;
        byConf[c.id].totalProfit = Math.round(byConf[c.id].totalProfit * 10) / 10;
    });

    var monthlyProfit = monthlyRevenue.map(function (r, i) {
        return Math.round((r - monthlyFees[i] - r * 0.08) * 10) / 10;
    });

    var totalRev = monthlyRevenue.reduce(function (a, b) { return a + b; }, 0);
    var totalFee = monthlyFees.reduce(function (a, b) { return a + b; }, 0);
    var totalProf = monthlyProfit.reduce(function (a, b) { return a + b; }, 0);

    var fmtLakh = function (n) { return '₹ ' + n.toLocaleString('en-IN', { maximumFractionDigits: 1 }) + ' L'; };
    var fmtCrore = function (n) { return '₹ ' + (n / 100).toFixed(2) + ' Cr'; };

    var chartMonth = null;
    var chartConfBar = null;
    var chartDrill = null;
    var chartShare = null;
    var activeConfId = 'icrai';

    function setKpis() {
        var elR = document.getElementById('kpiRevenue');
        var elF = document.getElementById('kpiFees');
        var elP = document.getElementById('kpiProfit');
        var elM = document.getElementById('kpiMargin');
        if (elR) elR.textContent = fmtCrore(totalRev);
        if (elF) elF.textContent = fmtCrore(totalFee);
        if (elP) elP.textContent = fmtCrore(totalProf);
        if (elM) elM.textContent = ((totalProf / totalRev) * 100).toFixed(1) + '%';
    }

    function buildCharts() {
        if (typeof Chart === 'undefined') return;

        var c1 = document.getElementById('chartMonthly');
        if (c1) {
            if (chartMonth) chartMonth.destroy();
            chartMonth = new Chart(c1, {
                type: 'line',
                data: {
                    labels: MONTHS,
                    datasets: [
                        { label: 'Gross Revenue', data: monthlyRevenue, borderColor: '#0c5252', backgroundColor: 'rgba(12, 82, 82, 0.12)', fill: true, tension: 0.35, borderWidth: 2 },
                        { label: 'Payment Fees (PG + Gateway)', data: monthlyFees, borderColor: '#ea580c', backgroundColor: 'rgba(234, 88, 12, 0.1)', fill: true, tension: 0.35, borderWidth: 2 },
                        { label: 'Net Profit (After Fees & Est. COGS)', data: monthlyProfit, borderColor: '#059669', borderDash: [5, 4], tension: 0.35, borderWidth: 2, fill: false }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: { mode: 'index', intersect: false },
                    plugins: {
                        legend: { position: 'bottom', labels: { usePointStyle: true, padding: 14, font: { size: 10, family: "'Plus Jakarta Sans', sans-serif" } } },
                        tooltip: { callbacks: { label: function (c) { return c.dataset.label + ': ' + fmtLakh(c.parsed.y); } } }
                    },
                    scales: {
                        y: { beginAtZero: true, title: { display: true, text: '₹ Lakh' }, grid: { color: 'rgba(0,0,0,0.05)' } },
                        x: { grid: { display: false } }
                    }
                }
            });
        }

        var c2 = document.getElementById('chartConfProfit');
        if (c2) {
            if (chartConfBar) chartConfBar.destroy();
            chartConfBar = new Chart(c2, {
                type: 'bar',
                data: {
                    labels: CONF.map(function (c) { return c.name; }),
                    datasets: [{ label: 'FY Profit', data: CONF.map(function (c) { return byConf[c.id].totalProfit; }), backgroundColor: CONF.map(function (c) { return c.color; }), borderRadius: 6 }]
                },
                options: {
                    indexAxis: 'y',
                    responsive: true,
                    maintainAspectRatio: false,
                    onClick: function (e, elts) {
                        if (!elts || !elts.length) return;
                        var i = elts[0].index;
                        activeConfId = CONF[i].id;
                        document.querySelectorAll('.gfx-pill[data-conf]').forEach(function (p) {
                            p.classList.toggle('is-active', p.getAttribute('data-conf') === activeConfId);
                        });
                        renderDrill();
                    },
                    plugins: { legend: { display: false }, tooltip: { callbacks: { label: function (c) { return fmtLakh(c.parsed.x); } } } },
                    scales: {
                        x: { beginAtZero: true, title: { display: true, text: '₹ Lakh' }, grid: { color: 'rgba(0,0,0,0.05)' } },
                        y: { grid: { display: false } }
                    }
                }
            });
        }

        var c3 = document.getElementById('chartShare');
        if (c3) {
            if (chartShare) chartShare.destroy();
            chartShare = new Chart(c3, {
                type: 'doughnut',
                data: {
                    labels: CONF.map(function (c) { return c.name; }),
                    datasets: [{ data: CONF.map(function (c) { return byConf[c.id].totalRevenue; }), backgroundColor: CONF.map(function (c) { return c.color; }), borderWidth: 2, borderColor: '#fff' }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '58%',
                    plugins: {
                        legend: { position: 'right', labels: { font: { size: 10 }, usePointStyle: true, padding: 10 } },
                        tooltip: { callbacks: { label: function (c) { return c.label + ': ' + fmtLakh(c.parsed) + ' (rev)'; } } }
                    }
                }
            });
        }
    }

    function renderDrill() {
        var c = byConf[activeConfId];
        if (!c) return;
        var title = document.getElementById('drillTitle');
        if (title) title.textContent = c.name;
        var sub = document.getElementById('drillSub');
        if (sub) {
            sub.textContent = 'FY allocation ~' + (confShare[activeConfId] * 100).toFixed(0) + '% of flow · conference drill-down';
        }
        var tbody = document.querySelector('#drillTable tbody');
        if (tbody) {
            tbody.innerHTML = '';
            var s = confShare[activeConfId];
            for (var i = 0; i < 12; i++) {
                var r = Math.round(monthlyRevenue[i] * s * 10) / 10;
                var f = Math.round(monthlyFees[i] * s * 10) / 10;
                var tr = document.createElement('tr');
                tr.innerHTML = '<td>' + MONTHS[i] + '</td><td>' + fmtLakh(r) + '</td><td>' + fmtLakh(f) + '</td><td><strong>' + fmtLakh(c.monthProfit[i]) + '</strong></td>';
                tbody.appendChild(tr);
            }
        }
        var dEl = document.getElementById('chartDrill');
        if (dEl) {
            if (chartDrill) chartDrill.destroy();
            chartDrill = new Chart(dEl, {
                type: 'bar',
                data: {
                    labels: MONTHS,
                    datasets: [{ label: 'Profit', data: c.monthProfit, backgroundColor: c.color + 'bb', borderColor: c.color, borderWidth: 1, borderRadius: 4 }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: { beginAtZero: true, title: { display: true, text: '₹ Lakh' }, grid: { color: 'rgba(0,0,0,0.05)' } },
                        x: { ticks: { maxRotation: 45, minRotation: 45, font: { size: 8 } } }
                    }
                }
            });
        }
    }

    function wirePills() {
        document.querySelectorAll('.gfx-pill[data-conf]').forEach(function (p) {
            p.addEventListener('click', function () {
                activeConfId = p.getAttribute('data-conf');
                document.querySelectorAll('.gfx-pill[data-conf]').forEach(function (x) {
                    x.classList.toggle('is-active', x.getAttribute('data-conf') === activeConfId);
                });
                renderDrill();
            });
        });
    }

    function start() {
        setKpis();
        buildCharts();
        renderDrill();
        wirePills();
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
    else start();
})();
