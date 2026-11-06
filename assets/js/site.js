// Shared behaviour: theme toggle, hero load animation, scroll reveals, copy-email.
(() => {
  const root = document.documentElement;

  // Theme toggle (remembers choice per browser; falls back to system setting)
  const btn = document.querySelector('.theme-toggle');
  const current = () => root.dataset.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  const label = () => { if (btn) btn.setAttribute('aria-label', current() === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'); };
  if (btn) {
    label();
    btn.addEventListener('click', () => {
      const next = current() === 'dark' ? 'light' : 'dark';
      root.dataset.theme = next;
      try { localStorage.setItem('theme', next); } catch (e) {}
      label();
    });
  }

  // Hero entrance
  requestAnimationFrame(() => requestAnimationFrame(() => root.classList.add('loaded')));

  // Scroll reveals
  const els = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    els.forEach((el) => io.observe(el));
  } else {
    els.forEach((el) => el.classList.add('in'));
  }

  // Copy email
  const copy = document.querySelector('[data-copy]');
  if (copy) {
    const hint = copy.querySelector('small');
    copy.addEventListener('click', () => {
      const text = copy.dataset.copy;
      const done = (msg) => { hint.textContent = msg; setTimeout(() => (hint.textContent = 'Copy'), 1800); };
      if (navigator.clipboard) navigator.clipboard.writeText(text).then(() => done('Copied'), () => { location.href = 'mailto:' + text; });
      else location.href = 'mailto:' + text;
    });
  }

  // Image viewer: every .zoom button on the page joins one sequence
  const zooms = [...document.querySelectorAll('.zoom[data-full]')];
  if (zooms.length && window.HTMLDialogElement) {
    const dlg = document.createElement('dialog');
    dlg.className = 'viewer';
    dlg.setAttribute('aria-label', 'Image viewer');
    dlg.innerHTML = '<div class="vf"><div class="vt"><span aria-live="polite"></span><button type="button" data-a="close">Close ✕</button></div>' +
      '<div class="vs"><img alt=""></div><div class="vn"><button type="button" data-a="prev">← Prev</button><button type="button" data-a="next">Next →</button></div></div>';
    document.body.appendChild(dlg);
    const img = dlg.querySelector('img'), cap = dlg.querySelector('.vt span');
    let i = 0;
    const show = () => {
      const z = zooms[i], alt = z.querySelector('img').alt;
      img.src = z.dataset.full; img.alt = alt;
      cap.textContent = (i + 1) + ' / ' + zooms.length + ' · ' + alt;
    };
    const step = (d) => { i = (i + d + zooms.length) % zooms.length; show(); };
    zooms.forEach((z, idx) => z.addEventListener('click', () => { i = idx; show(); dlg.showModal(); }));
    dlg.addEventListener('click', (e) => {
      const a = e.target.closest('[data-a]');
      if (a) { if (a.dataset.a === 'close') dlg.close(); else step(a.dataset.a === 'next' ? 1 : -1); }
      else if (e.target === dlg || e.target.classList.contains('vs')) dlg.close();
    });
    dlg.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') step(1); if (e.key === 'ArrowLeft') step(-1); });
    dlg.addEventListener('close', () => img.removeAttribute('src'));
  }

  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
