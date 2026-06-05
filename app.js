/* ============================================================
   The Cookbook — shared scripts
   - Language toggle (EN default, MS). Persisted via ?lang= in URL
     so the choice survives navigation on static GitHub Pages.
   - Recipe tabs
   - Serving scaler (multiplies quantities by pack count)
   ============================================================ */

(function () {
  // ---------- Language ----------
  const params = new URLSearchParams(window.location.search);
  let lang = params.get('lang') === 'ms' ? 'ms' : 'en';

  function applyLang(l) {
    lang = l;
    document.body.classList.toggle('lang-ms', l === 'ms');
    document.querySelectorAll('.lang-toggle button').forEach(b => {
      b.classList.toggle('active', b.dataset.lang === l);
    });
    // keep all internal links carrying the current language
    document.querySelectorAll('a[href]').forEach(a => {
      const href = a.getAttribute('href');
      if (!href || href.startsWith('http') || href.startsWith('#')) return;
      try {
        const u = new URL(href, window.location.href);
        if (u.origin !== window.location.origin) return;
        if (l === 'ms') u.searchParams.set('lang', 'ms');
        else u.searchParams.delete('lang');
        a.setAttribute('href', u.pathname + u.search + u.hash);
      } catch (e) { /* ignore */ }
    });
    document.documentElement.lang = l === 'ms' ? 'ms' : 'en';
  }

  document.addEventListener('DOMContentLoaded', () => {
    applyLang(lang);
    document.querySelectorAll('.lang-toggle button').forEach(btn => {
      btn.addEventListener('click', () => applyLang(btn.dataset.lang));
    });

    // ---------- Tabs ----------
    const tabBtns = document.querySelectorAll('.tabs button');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.tab;
        tabBtns.forEach(b => b.classList.toggle('active', b === btn));
        document.querySelectorAll('.panel').forEach(p => {
          p.classList.toggle('active', p.id === target);
        });
      });
    });

    // ---------- Serving scaler ----------
    const scaler = document.querySelector('.scaler');
    if (scaler) {
      const qtyEl = scaler.querySelector('.qty');
      const dec = scaler.querySelector('[data-step="-1"]');
      const inc = scaler.querySelector('[data-step="1"]');
      let packs = 1;

      function fmt(n) {
        // tidy number: drop trailing .0, keep fractions readable
        const r = Math.round(n * 100) / 100;
        return Number.isInteger(r) ? String(r) : String(r);
      }
      function render() {
        qtyEl.textContent = packs;
        document.querySelectorAll('[data-base]').forEach(el => {
          const base = parseFloat(el.dataset.base);
          const unit = el.dataset.unit || '';
          el.textContent = fmt(base * packs) + (unit ? ' ' + unit : '');
        });
        const servings = document.querySelector('[data-servings]');
        if (servings) servings.textContent = (12 * packs);
      }
      dec.addEventListener('click', () => { if (packs > 1) { packs--; render(); } });
      inc.addEventListener('click', () => { if (packs < 20) { packs++; render(); } });
      render();
    }
  });
})();
