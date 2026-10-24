# Rahul Srivastava: Engineering & Data Platforms

Portfolio of two systems I designed, built and operate end to end.

### Live site
https://rahulcode97.github.io/Unified-Financial-Intelligence/

---

## 1. Research Intelligence Platform (flagship)
[Case study](https://rahulcode97.github.io/Unified-Financial-Intelligence/research-platform.html) · [ML pipeline](https://rahulcode97.github.io/Unified-Financial-Intelligence/ml-analysis.html)

Marketing used to reach academic researchers with blind lists kept in Excel. This platform collects public academic profiles, classifies every researcher by department and field, ranks them by work history, and hands marketing a targeted shortlist.

**Impact**
* **10M+** records under management, deduplicated to one identity each
* **2,000+** universities covered, department by department
* **8% → 36%** outreach open rate (4.5×) after moving from blind lists to work-history targeting
* **~30 hours/week** of manual spreadsheet work removed
* **10 idle PCs** turned into a managed collection fleet, with no new hardware
* Used daily by directors, marketing and the junior team

**What I built**
* **Distributed collection fleet:** a Rust agent with PIN pairing, self-update, capacity heartbeats, workload placement and self-healing browser slots
* **Hybrid ML pipeline:** a confidence-gated scikit-learn classifier, LLM classification and enrichment that records provenance, fingerprint-based identity resolution, and a human-in-the-loop feedback loop
* **Ops Copilot:** natural-language fleet control over MCP, with dry-run, audit log, undo and code-level safety bounds
* **Contact intelligence platform:** year-partitioned PostgreSQL, an `ltree` catalogue, transactional bulk imports and deliverability scoring
* **Deploy Guard:** a VS Code extension that flags lock-risk SQL migrations before deploy, plus browser-level health checks after it
* **Staff operations console:** RBAC with field-level stripping, an AES-256-GCM credential vault, and Google Workspace on/offboarding

**Stack:** Python · FastAPI · PostgreSQL 18 · Rust (Tokio, Axum) · scikit-learn · LLM agents (Grok) · MCP · React · TypeScript · Docker · Coolify · Playwright · passkeys and Google SSO

Internal names, data sources and identifying details are withheld for confidentiality.

---

## 2. Unified Financial Orchestration Suite
[Case study](https://rahulcode97.github.io/Unified-Financial-Intelligence/finance-suite.html) · [Interactive demo](https://rahulcode97.github.io/Unified-Financial-Intelligence/dashboard.html)

* **Efficiency:** reporting cycles cut from 1 week to under 1 hour
* **Accuracy:** automated reconciliation across PayPal, CCAvenue and bank transfers, removing GST and tax mismatches
* **Scale:** ₹63 Cr+ of transactions across 5 event portfolios
* **Security:** passkey authentication and RBAC
* **ML (earlier work):** Prophet + ARIMA forecasting and K-Means + DBSCAN payment clustering ([page](https://rahulcode97.github.io/Unified-Financial-Intelligence/ml-finance.html))

**Stack:** React · Node.js · PHP · Python · MySQL · Google Cloud

---

## Site structure
* `index.html`: overview of both projects, leadership and stack
* `research-platform.html`, `ml-analysis.html`: research platform case study
* `finance-suite.html` plus the demo pages (`dashboard`, `graphs`, `ccavenue-master`, `paypal-master`, `reports`, `portal-account`, `login`, `ml-finance`, `ai-integration`): finance suite
* `leadership.html`: leadership across both projects
* `assets/site.css` and `assets/site.js`: the shared design system (Ink + Indigo, light and dark)
