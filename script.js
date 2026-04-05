// ---------- Polaroid stack ----------
(function () {
  var stacks = document.querySelectorAll('.polaroid-stack');
  stacks.forEach(function (stack) {
    var cards = stack.querySelectorAll('.polaroid');
    cards.forEach(function (card) {
      var activate = function () {
        if (card.dataset.slot === 'center') return;
        var center = stack.querySelector('[data-slot="center"]');
        var targetSlot = card.dataset.slot;
        center.dataset.slot = targetSlot;
        card.dataset.slot = 'center';
        cards.forEach(function (c) {
          if (c.dataset.slot === 'center') {
            c.removeAttribute('tabindex');
            c.removeAttribute('role');
          } else {
            c.setAttribute('tabindex', '0');
            c.setAttribute('role', 'button');
          }
        });
      };
      card.addEventListener('click', activate);
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          activate();
        }
      });
    });
  });
})();


// ---------- Theme toggle ----------
(function () {
  var root = document.documentElement;
  var btn = document.querySelector('.theme-toggle');
  var icon = document.querySelector('.theme-toggle__icon');

  var stored = localStorage.getItem('theme');
  var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

  var setTheme = function (theme) {
    root.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    if (icon) icon.textContent = theme === 'dark' ? '\u2600\uFE0F' : '\uD83C\uDF19';
  };

  if (stored) setTheme(stored);
  else setTheme(prefersDark ? 'dark' : 'light');

  if (!btn) return;
  btn.addEventListener('click', function () {
    root.classList.add('theme-transitioning');
    var current = root.getAttribute('data-theme');
    setTheme(current === 'dark' ? 'light' : 'dark');
    setTimeout(function () { root.classList.remove('theme-transitioning'); }, 300);
  });
})();
