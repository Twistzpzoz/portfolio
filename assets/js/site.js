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

  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
