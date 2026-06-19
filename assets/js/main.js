/* ── TIMING CONSTANTS ── */
const DELAY_BAR_ANIMATE = 100;
const DELAY_SCORE_HOLD = 2500;
const DELAY_STEP_TRANSITION = 280;

/* ── QUIZ / FORM CONSTANTS ── */
const QUIZ_MAX_SCORE = 30;
const TIER_LOW_THRESHOLD = 10;
const TIER_MID_THRESHOLD = 20;
const FORM_STEPS = 4;
const REF_SUFFIX_LENGTH = 8;
const MIN_OVERVIEW_CHARS = 50;
const MIN_INTENT_CHARS = 80;
const MIN_MILESTONE_CHARS = 40;
const OVERVIEW_MAX_CHARS = 500;
const OVERVIEW_WARN_AT = 450;

/* ── SIDEBAR ── */
function initSidebar() {
  const hamburger = document.getElementById('hamburger');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar_overlay');
  const closeBtn = document.getElementById('sidebar_close');
  if (!hamburger || !sidebar || !overlay || !closeBtn) return;

  function openSidebar() {
    sidebar.classList.add('open');
    overlay.classList.add('active');
    hamburger.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeSidebar() {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
    hamburger.classList.remove('open');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () =>
    sidebar.classList.contains('open') ? closeSidebar() : openSidebar()
  );
  closeBtn.addEventListener('click', closeSidebar);
  overlay.addEventListener('click', closeSidebar);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeSidebar();
  });
}

/* ── AUDIT MODAL DATA ── */
const QUESTIONS = [
  { text: 'How do you currently separate personal and business finances?', options: [
    { label: 'Fully integrated: one account for all transactions.', pts: 0 },
    { label: 'Mostly separate, with occasional mixing during cash flow pressures.', pts: 1 },
    { label: 'Largely separate with internal controls and some formal boundaries.', pts: 2 },
    { label: 'Fully separated through governance structures, audited accounts, and legal entity separation.', pts: 3 }
  ]},
  { text: 'What governance structures are in place for significant business decisions?', options: [
    { label: 'None. Decisions are made informally as situations arise.', pts: 0 },
    { label: 'Ad-hoc processes with limited documentation or accountability frameworks.', pts: 1 },
    { label: 'Documented internal approval processes for material decisions.', pts: 2 },
    { label: 'Institutional governance frameworks with board-level oversight and formal reporting structures.', pts: 3 }
  ]},
  { text: 'How frequently do you review formal liquidity and cash flow projections?', options: [
    { label: 'Never. Liquidity is managed reactively as it arises.', pts: 0 },
    { label: 'Occasionally, when a specific issue or opportunity demands it.', pts: 1 },
    { label: 'Quarterly, through structured internal reviews.', pts: 2 },
    { label: 'Monthly or continuously, with structured forecasting and advisory review.', pts: 3 }
  ]},
  { text: 'To what degree are personal or extended family financial obligations drawing on business liquidity?', options: [
    { label: 'Constantly. Family obligations are the primary drain on available cash.', pts: 0 },
    { label: 'Frequently. Family requests are managed but consistently impact capital reserves.', pts: 1 },
    { label: 'Occasionally. Some structure exists but boundaries are not fully enforced.', pts: 2 },
    { label: 'Rarely or never. Formal boundary and obligation frameworks protect business liquidity.', pts: 3 }
  ]},
  { text: 'How accessible is institutional capital to your business at present?', options: [
    { label: 'Not at all. Conventional and institutional capital channels are effectively closed.', pts: 0 },
    { label: 'Limited. Some banking relationships exist but institutional access is restricted.', pts: 1 },
    { label: 'Moderate. Relationships exist but governance gaps limit access to larger facilities.', pts: 2 },
    { label: 'Fully integrated. Institutional capital access exists through established governance and financial credibility.', pts: 3 }
  ]},
  { text: 'Do you hold formal asset structures outside of your primary operating business?', options: [
    { label: 'None. All personal and business assets remain fully integrated.', pts: 0 },
    { label: 'Minimal. Some personal property or investments held informally.', pts: 1 },
    { label: 'Some formal separation. Certain assets held in distinct structures.', pts: 2 },
    { label: 'Full family-office-style asset separation with trust structures, legal entities, and governance oversight.', pts: 3 }
  ]},
  { text: 'How are high-value capital allocations tracked and reviewed within your business?', options: [
    { label: 'Not tracked. Capital movements are managed informally.', pts: 0 },
    { label: 'Informally tracked via spreadsheets or basic accounting tools.', pts: 1 },
    { label: 'Structured ledger or accounting software with internal review.', pts: 2 },
    { label: 'Audited, professionally reviewed, and reported through institutional-grade financial reporting.', pts: 3 }
  ]},
  { text: 'Do you have succession or contingency plans governing business continuity?', options: [
    { label: 'None. Business continuity depends entirely on key individuals.', pts: 0 },
    { label: 'Basic ideas or informal arrangements exist but remain undocumented.', pts: 1 },
    { label: 'Documented plans exist for key operational roles.', pts: 2 },
    { label: 'Comprehensive governance covering family wealth transfer, business continuity, and formal succession structures.', pts: 3 }
  ]},
  { text: 'How consistently do you convert revenue into wealth-generating structures rather than operational consumption?', options: [
    { label: 'Never. Revenue is consumed entirely by operational demands and personal obligations.', pts: 0 },
    { label: 'Rarely. Occasional capital allocation occurs without a structured framework.', pts: 1 },
    { label: 'Sometimes. Capital conversion occurs when cash flow permits.', pts: 2 },
    { label: 'Regularly. A defined capital conversion strategy aligned with long-term institutional wealth goals.', pts: 3 }
  ]},
  { text: 'How would you assess your liquidity position and capital structure over the next 12 months?', options: [
    { label: 'Not confident. Significant structural vulnerabilities remain unaddressed.', pts: 0 },
    { label: 'Slightly confident. Basic cash flow management exists but structural exposure remains.', pts: 1 },
    { label: 'Moderately confident. Reasonable structure in place with identifiable gaps.', pts: 2 },
    { label: 'Fully confident. Liquidity is governed, stress-tested, and protected through formal structures.', pts: 3 }
  ]}
];

const RESULTS = {
  tier0: {
    badge: 'Revenue Dependent',
    cls: 'tier-0',
    category: 'Revenue Dependent',
    diagnostic: 'Your diagnostic indicates that your enterprise is generating revenue without the structural architecture required to convert it into sustainable, transferable wealth. Liquidity fragility, governance gaps, and the absence of formal capital structures leave your position exposed to market cycles, family obligations, and institutional exclusion.',
    implication: 'Strategic implication: Without intervention, revenue continues to be consumed rather than compounded. The gap between what you earn and what you retain widens over time, not from lack of effort, but from the absence of architecture.'
  },
  tier1: {
    badge: 'Structurally Exposed',
    cls: 'tier-1',
    category: 'Operationally Strong, Structurally Exposed',
    diagnostic: 'Your diagnostic reflects an operator with demonstrable business capability and revenue capacity, but with identifiable structural vulnerabilities in liquidity governance, capital architecture, and institutional access. Operational performance has outpaced wealth structuring.',
    implication: 'Strategic implication: The infrastructure required to protect and compound what you have built remains incomplete. You are operating in a window where structured intervention can transition your position from revenue generation to institutional wealth realization.'
  },
  tier2: {
    badge: 'Capital Ready',
    cls: 'tier-2',
    category: 'Capital Ready',
    diagnostic: 'Your diagnostic reflects a structurally sophisticated operator, one with meaningful governance frameworks, some degree of personal and business separation, and an existing orientation toward institutional capital positioning. You are operating within the range EWC works with at the highest level of engagement.',
    implication: "Strategic implication: Capital readiness alone does not guarantee capital access. EWC's advisory engagement is designed to convert structural readiness into active institutional positioning, placing you into the capital networks your governance already qualifies you for."
  }
};

const TIER_SCORE_MESSAGES = {
  'tier-0': 'Your capital architecture requires urgent structural attention.',
  'tier-1': 'Strong operational foundation. Structural gaps remain to be closed.',
  'tier-2': 'You are positioned for institutional-level capital engagement.'
};

function getTierResult(score) {
  if (score <= TIER_LOW_THRESHOLD) return RESULTS.tier0;
  if (score <= TIER_MID_THRESHOLD) return RESULTS.tier1;
  return RESULTS.tier2;
}

/* ── AUDIT MODAL (index.html only) ── */
function initAuditModal() {
  const modalBg = document.getElementById('audit_modal_bg');
  if (!modalBg) return;

  const quizView = document.getElementById('modal_quiz_view');
  const instantView = document.getElementById('modal_instant_score_view');
  const captureView = document.getElementById('modal_capture_view');
  const resultsView = document.getElementById('modal_results_view');
  const progressFill = document.getElementById('modal_progress_fill');
  const progressLabel = document.getElementById('modal_progress_label');
  const qLabel = document.getElementById('modal_q_label');
  const qText = document.getElementById('modal_q_text');
  const qOptions = document.getElementById('modal_options');
  const btnBack = document.getElementById('modal_btn_back');
  const btnNext = document.getElementById('modal_btn_next');
  const captureForm = document.getElementById('modal_capture_form');
  const retakeBtn = document.getElementById('res_retake');

  let current = 0;
  let answers = new Array(QUESTIONS.length).fill(null);
  let totalScore = 0;

  function openModal() {
    modalBg.classList.add('open');
    document.body.style.overflow = 'hidden';
    renderQuestion(current);
  }

  function closeModal() {
    modalBg.classList.remove('open');
    document.body.style.overflow = '';
  }

  function buildOptionEl(qIdx, optIdx, opt) {
    const div = document.createElement('div');
    div.className = 'modal-option' + (answers[qIdx] === optIdx ? ' selected' : '');

    const dot = document.createElement('div');
    dot.className = 'modal-option-dot';

    const text = document.createElement('div');
    text.className = 'modal-option-text';
    text.textContent = opt.label;

    div.appendChild(dot);
    div.appendChild(text);
    div.addEventListener('click', () => selectOption(qIdx, optIdx));
    return div;
  }

  function selectOption(qIdx, optIdx) {
    answers[qIdx] = optIdx;
    qOptions.querySelectorAll('.modal-option').forEach((el, i) =>
      el.classList.toggle('selected', i === optIdx)
    );
    syncNextBtn(qIdx);
  }

  function syncNextBtn(idx) {
    const ready = answers[idx] !== null;
    btnNext.classList.toggle('ready', ready);
    btnNext.textContent = idx === QUESTIONS.length - 1 ? 'View My Score →' : 'Continue →';
  }

  function renderQuestion(idx) {
    const q = QUESTIONS[idx];
    progressFill.style.width = ((idx / QUESTIONS.length) * 100) + '%';
    progressLabel.textContent = 'Question ' + (idx + 1) + ' of ' + QUESTIONS.length;
    qLabel.textContent = 'Question ' + String(idx + 1).padStart(2, '0');
    qText.textContent = q.text;
    qOptions.replaceChildren();
    q.options.forEach((opt, i) => qOptions.appendChild(buildOptionEl(idx, i, opt)));
    btnBack.disabled = idx === 0;
    syncNextBtn(idx);
    document.getElementById('audit_modal').scrollTop = 0;
  }

  function showInstantScore() {
    totalScore = QUESTIONS.reduce((sum, q, i) =>
      sum + (answers[i] !== null ? q.options[answers[i]].pts : 0), 0
    );
    const result = getTierResult(totalScore);
    progressFill.style.width = '100%';
    progressLabel.textContent = 'Diagnostic Complete';
    quizView.style.display = 'none';
    instantView.classList.add('active');

    document.getElementById('instant_score_val').textContent = totalScore;
    document.getElementById('instant_score_msg').textContent = TIER_SCORE_MESSAGES[result.cls];

    setTimeout(() => {
      document.getElementById('instant_score_bar_fill').style.width =
        Math.round((totalScore / QUIZ_MAX_SCORE) * 100) + '%';
    }, DELAY_BAR_ANIMATE);

    document.getElementById('audit_modal').scrollTop = 0;

    setTimeout(() => {
      document.getElementById('hidden_score').value = totalScore + '/' + QUIZ_MAX_SCORE;
      document.getElementById('hidden_category').value = result.category;
      document.getElementById('hidden_answers').value = QUESTIONS.map((q, i) => {
        const sel = answers[i] !== null ? q.options[answers[i]] : null;
        return 'Q' + (i + 1) + ': ' + (sel ? sel.label : '—') + ' (' + (sel ? sel.pts : 0) + ' pts)';
      }).join('\n');
      instantView.classList.remove('active');
      captureView.classList.add('active');
      document.getElementById('audit_modal').scrollTop = 0;
    }, DELAY_SCORE_HOLD);
  }

  function showResults() {
    captureView.classList.remove('active');
    resultsView.classList.add('active');
    const result = getTierResult(totalScore);
    const badge = document.getElementById('res_badge');
    badge.textContent = result.badge;
    badge.className = 'result-badge ' + result.cls;
    document.getElementById('res_score').textContent = totalScore;
    document.getElementById('res_category').textContent = result.category;
    document.getElementById('res_diagnostic').textContent = result.diagnostic;
    document.getElementById('res_implication').textContent = result.implication;
    const bar = document.getElementById('res_bar_fill');
    bar.className = 'result-bar-fill ' + result.cls;
    setTimeout(() => {
      bar.style.width = Math.round((totalScore / QUIZ_MAX_SCORE) * 100) + '%';
    }, DELAY_BAR_ANIMATE);
    document.getElementById('audit_modal').scrollTop = 0;
  }

  function resetQuiz() {
    current = 0;
    answers = new Array(QUESTIONS.length).fill(null);
    totalScore = 0;
    quizView.style.display = '';
    instantView.classList.remove('active');
    captureView.classList.remove('active');
    resultsView.classList.remove('active');
    if (captureForm) captureForm.reset();
    document.getElementById('res_bar_fill').style.width = '0%';
    document.getElementById('instant_score_bar_fill').style.width = '0%';
    renderQuestion(0);
  }

  const openBtn = document.getElementById('open_audit_btn');
  const manifestoBtn = document.getElementById('manifesto_audit_btn');
  const closeBtn = document.getElementById('modal_close');

  if (openBtn) openBtn.addEventListener('click', openModal);
  if (manifestoBtn) manifestoBtn.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (retakeBtn) retakeBtn.addEventListener('click', resetQuiz);

  modalBg.addEventListener('click', e => { if (e.target === modalBg) closeModal(); });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });

  btnNext.addEventListener('click', () => {
    if (answers[current] === null) return;
    if (current < QUESTIONS.length - 1) {
      current++;
      renderQuestion(current);
    } else {
      showInstantScore();
    }
  });

  btnBack.addEventListener('click', () => {
    if (current > 0) { current--; renderQuestion(current); }
  });

  if (captureForm) {
    captureForm.addEventListener('submit', async e => {
      e.preventDefault();
      const btn = e.target.querySelector('.capture-submit');
      btn.textContent = 'Submitting…';
      btn.disabled = true;
      try {
        await fetch(e.target.action, {
          method: 'POST',
          body: new FormData(e.target),
          headers: { Accept: 'application/json' }
        });
      } catch (_) { /* silent — results shown regardless of network */ }
      showResults();
    });
  }
}

/* ── EMAILJS LOADER ── */
function loadEmailJS(callback) {
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/emailjs-com@3/dist/email.min.js';
  script.onload = callback;
  document.body.appendChild(script);
}

/* ── CONTACT FORM (contact.html only) ── */
function initContactForm() {
  if (!document.getElementById('prog_1')) return;

  const EMAILJS_PUBLIC_KEY = '32FOtBf-pk-tbd2XU';
  const EMAILJS_SERVICE_ID = 'service_0bs1ljq';
  const EMAILJS_TEMPLATE_ID = 'template_zqnhmhe';

  loadEmailJS(() => {
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  });

  let currentStep = 1;
  let recaptchaVerified = false;

  const btnBack = document.getElementById('btn_back');
  const btnNext = document.getElementById('btn_next');
  const cardFooter = document.getElementById('card_footer');

  const overviewEl = document.getElementById('overview');
  if (overviewEl) {
    overviewEl.addEventListener('input', function () {
      const len = this.value.length;
      const counter = document.getElementById('overview_counter');
      if (counter) {
        counter.textContent = len + ' / ' + OVERVIEW_MAX_CHARS;
        counter.classList.toggle('warn', len >= OVERVIEW_WARN_AT);
      }
    });
  }

  const recaptchaBox = document.getElementById('recaptcha_box');
  if (recaptchaBox) {
    recaptchaBox.addEventListener('click', function () {
      recaptchaVerified = !recaptchaVerified;
      this.classList.toggle('checked', recaptchaVerified);
      if (recaptchaVerified) {
        const errEl = document.getElementById('err_recaptcha');
        if (errEl) errEl.classList.remove('visible');
      }
    });
  }

  function setFieldError(fgId, errId, show) {
    const fg = document.getElementById(fgId);
    const err = document.getElementById(errId);
    if (fg) fg.classList.toggle('has-error', show);
    if (err) err.classList.toggle('visible', show);
  }

  function isValidUrl(val) {
    try {
      new URL(val);
      return val.startsWith('https://');
    } catch (_) {
      return false;
    }
  }

  function validateStep(step) {
    let ok = true;
    if (step === 1) {
      const cn = document.getElementById('company_name').value.trim();
      setFieldError('fg_company_name', 'err_company_name', !cn);
      if (!cn) ok = false;
      const sc = document.getElementById('sector').value;
      setFieldError('fg_sector', 'err_sector', !sc);
      if (!sc) ok = false;
      const yo = document.getElementById('years_op').value;
      setFieldError('fg_years_op', 'err_years_op', !yo);
      if (!yo) ok = false;
      const rv = document.getElementById('revenue').value;
      setFieldError('fg_revenue', 'err_revenue', !rv);
      if (!rv) ok = false;
      const aud = document.querySelector('input[name="audited"]:checked');
      setFieldError('fg_audited', 'err_audited', !aud);
      if (!aud) ok = false;
    }
    if (step === 2) {
      const en = document.getElementById('exec_name').value.trim();
      setFieldError('fg_exec_name', 'err_exec_name', !en);
      if (!en) ok = false;
      const et = document.getElementById('exec_title').value.trim();
      setFieldError('fg_exec_title', 'err_exec_title', !et);
      if (!et) ok = false;
      const em = document.getElementById('exec_email').value.trim();
      setFieldError('fg_exec_email', 'err_exec_email', !em);
      if (!em) ok = false;
      const ws = document.getElementById('website').value.trim();
      const badWs = !ws || !isValidUrl(ws);
      setFieldError('fg_website', 'err_website', badWs);
      if (badWs) ok = false;
      const ov = document.getElementById('overview').value.trim();
      setFieldError('fg_overview', 'err_overview', ov.length < MIN_OVERVIEW_CHARS);
      if (ov.length < MIN_OVERVIEW_CHARS) ok = false;
    }
    if (step === 3) {
      const r1 = document.getElementById('rev_1').value.trim();
      const r2 = document.getElementById('rev_2').value.trim();
      const r3 = document.getElementById('rev_3').value.trim();
      const badRev = !r1 || !r2 || !r3;
      const errRev = document.getElementById('err_rev');
      if (errRev) errRev.classList.toggle('visible', badRev);
      if (badRev) ok = false;
      const eb = document.getElementById('ebitda').value;
      setFieldError('fg_ebitda', 'err_ebitda', !eb);
      if (!eb) ok = false;
      const ca = document.getElementById('capital').value;
      setFieldError('fg_capital', 'err_capital', !ca);
      if (!ca) ok = false;
      const it = document.getElementById('intent').value.trim();
      setFieldError('fg_intent', 'err_intent', it.length < MIN_INTENT_CHARS);
      if (it.length < MIN_INTENT_CHARS) ok = false;
      const ms = document.getElementById('milestone').value.trim();
      setFieldError('fg_milestone', 'err_milestone', ms.length < MIN_MILESTONE_CHARS);
      if (ms.length < MIN_MILESTONE_CHARS) ok = false;
    }
    if (step === FORM_STEPS) {
      const errR = document.getElementById('err_recaptcha');
      if (errR) errR.classList.toggle('visible', !recaptchaVerified);
      if (!recaptchaVerified) ok = false;
    }
    return ok;
  }

  function populateReview() {
    function setReview(id, val) {
      const el = document.getElementById(id);
      if (!el) return;
      const v = (val || '').toString().trim();
      el.textContent = v || '—';
      el.classList.toggle('empty', !v);
    }
    const aud = document.querySelector('input[name="audited"]:checked');
    setReview('rv_company_name', document.getElementById('company_name').value);
    setReview('rv_sector', document.getElementById('sector').value);
    setReview('rv_years_op', document.getElementById('years_op').value);
    setReview('rv_revenue', document.getElementById('revenue').value);
    setReview('rv_audited', aud ? aud.value : '');
    setReview('rv_exec_name', document.getElementById('exec_name').value);
    setReview('rv_exec_title', document.getElementById('exec_title').value);
    setReview('rv_exec_email', document.getElementById('exec_email').value);
    setReview('rv_website', document.getElementById('website').value);
    setReview('rv_overview', document.getElementById('overview').value);
    const r1 = document.getElementById('rev_1').value.trim();
    const r2 = document.getElementById('rev_2').value.trim();
    const r3 = document.getElementById('rev_3').value.trim();
    setReview('rv_revenue3', r1 + ' → ' + r2 + ' → ' + r3);
    setReview('rv_ebitda', document.getElementById('ebitda').value);
    setReview('rv_capital', document.getElementById('capital').value);
    setReview('rv_intent', document.getElementById('intent').value);
    setReview('rv_milestone', document.getElementById('milestone').value);
  }

  function updateProgress(active) {
    for (let i = 1; i <= FORM_STEPS; i++) {
      const p = document.getElementById('prog_' + i);
      if (!p) continue;
      p.classList.remove('active', 'completed');
      if (i < active) p.classList.add('completed');
      if (i === active) p.classList.add('active');
    }
  }

  function updateNavButtons() {
    const btnTextEl = btnNext.querySelector('.btn-text');
    const btnImg = btnNext.querySelector('img');
    btnBack.style.visibility = currentStep === 1 ? 'hidden' : 'visible';
    if (currentStep === FORM_STEPS) {
      if (btnTextEl) btnTextEl.textContent = 'Submit Application';
      if (btnImg) btnImg.src = 'https://img.icons8.com/ios/20/ffffff/send--v1.png';
    } else {
      if (btnTextEl) btnTextEl.textContent = 'Continue';
      if (btnImg) btnImg.src = 'https://img.icons8.com/ios/20/ffffff/right--v1.png';
    }
  }

  function goToStep(target) {
    const fromEl = document.getElementById('step_' + currentStep);
    const toEl = document.getElementById('step_' + target);
    fromEl.classList.add('exit');
    setTimeout(() => {
      fromEl.classList.remove('active', 'exit');
      toEl.classList.add('active');
      currentStep = target;
      updateProgress(currentStep);
      updateNavButtons();
      const form = document.querySelector('.application-form');
      if (form) form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, DELAY_STEP_TRANSITION);
  }

  function generateRef() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let ref = 'EWC-';
    for (let i = 0; i < REF_SUFFIX_LENGTH; i++) ref += chars[Math.floor(Math.random() * chars.length)];
    return ref;
  }

  function buildEmailBody() {
    const aud = document.querySelector('input[name="audited"]:checked');
    const lines = [
      'EWC MEMBERSHIP APPLICATION',
      '═══════════════════════════════════════════',
      '',
      'SECTION 1 — ELIGIBILITY',
      '────────────────────────────────────────────',
      'Company Name:         ' + document.getElementById('company_name').value.trim(),
      'Sector:               ' + document.getElementById('sector').value,
      'Years in Operation:   ' + document.getElementById('years_op').value,
      'Annual Revenue:       ' + document.getElementById('revenue').value,
      'Audited Financials:   ' + (aud ? aud.value : 'Not specified'),
      '',
      'SECTION 2 — EXECUTIVE PROFILE',
      '────────────────────────────────────────────',
      'Name:                 ' + document.getElementById('exec_name').value.trim(),
      'Title:                ' + document.getElementById('exec_title').value.trim(),
      'Email:                ' + document.getElementById('exec_email').value.trim(),
      'Website:              ' + document.getElementById('website').value.trim(),
      '',
      'Company Overview:',
      document.getElementById('overview').value.trim(),
      '',
      'SECTION 3 — FINANCIAL SNAPSHOT',
      '────────────────────────────────────────────',
      'Revenue (3 Years):    ' + document.getElementById('rev_1').value.trim() + ' → ' + document.getElementById('rev_2').value.trim() + ' → ' + document.getElementById('rev_3').value.trim(),
      'EBITDA Range:         ' + document.getElementById('ebitda').value,
      'Capital Sought:       ' + document.getElementById('capital').value,
      '',
      'Strategic Intent:',
      document.getElementById('intent').value.trim(),
      '',
      'Growth Milestone:',
      document.getElementById('milestone').value.trim(),
      '',
      '═══════════════════════════════════════════',
      'Submitted via entrepreneurwealthcreation.com'
    ];
    return lines.join('\n');
  }

  async function submitApplication() {
    btnNext.disabled = true;
    btnNext.classList.add('loading');
    const refNumber = generateRef();
    try {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        subject: 'EWC Application — ' + document.getElementById('company_name').value.trim() + ' [' + refNumber + ']',
        message: buildEmailBody(),
        name: document.getElementById('exec_name').value.trim(),
        email: document.getElementById('exec_email').value.trim()
      });
    } catch (_) { /* silent — confirmation shown regardless of send result */ }
    showConfirmation(refNumber);
  }

  function showConfirmation(refNumber) {
    if (cardFooter) cardFooter.style.display = 'none';
    const fromEl = document.getElementById('step_' + FORM_STEPS);
    const toEl = document.getElementById('step_confirm');
    fromEl.classList.add('exit');
    setTimeout(() => {
      fromEl.classList.remove('active', 'exit');
      toEl.classList.add('active');
      const refEl = document.getElementById('confirm_ref');
      if (refEl) refEl.textContent = 'Reference: ' + refNumber;
      for (let i = 1; i <= FORM_STEPS; i++) {
        const p = document.getElementById('prog_' + i);
        if (p) { p.classList.remove('active'); p.classList.add('completed'); }
      }
      const form = document.querySelector('.application-form');
      if (form) form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, DELAY_STEP_TRANSITION);
  }

  if (btnNext) {
    btnNext.addEventListener('click', () => {
      if (!validateStep(currentStep)) return;
      if (currentStep < FORM_STEPS - 1) goToStep(currentStep + 1);
      else if (currentStep === FORM_STEPS - 1) { populateReview(); goToStep(FORM_STEPS); }
      else if (currentStep === FORM_STEPS) submitApplication();
    });
  }

  if (btnBack) {
    btnBack.addEventListener('click', () => {
      if (currentStep > 1) goToStep(currentStep - 1);
    });
  }

  document.addEventListener('keydown', e => {
    if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA' && e.target.tagName !== 'BUTTON') {
      e.preventDefault();
      if (btnNext) btnNext.click();
    }
  });

  document.querySelectorAll('.form-field').forEach(el => {
    el.addEventListener('input', function () { this.closest('.form-group')?.classList.remove('has-error'); });
    el.addEventListener('change', function () { this.closest('.form-group')?.classList.remove('has-error'); });
  });
}

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', () => {
  initSidebar();
  initAuditModal();
  initContactForm();
});
