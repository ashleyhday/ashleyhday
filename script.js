// ---------- Page transitions ----------
(function () {
  var body = document.body;
  if (!body || !body.classList.contains('page-transition')) return;

  // Build ordered list of elements to animate in
  var targets = [];

  var header = document.querySelector('.site-header');
  if (header) targets.push(header);

  var mainEl = document.querySelector('main');
  if (mainEl) {
    Array.from(mainEl.children).forEach(function (child) {
      var cards = child.querySelectorAll(':scope > .project-card');
      if (cards.length) {
        Array.from(cards).forEach(function (c) { targets.push(c); });
      } else {
        targets.push(child);
      }
    });
  }

  var footer = document.querySelector('.site-footer');
  if (footer) targets.push(footer);

  // Assign stagger index and hide all immediately
  targets.forEach(function (el, i) {
    el.dataset.animIndex = i;
    el.style.opacity = '0';
    el.style.transform = 'translateY(12px)';
  });

  var loadTime = Date.now();

  function animateIn(el) {
    var elapsed = Date.now() - loadTime;
    var delay = elapsed < 800 ? parseInt(el.dataset.animIndex || 0) * 75 : 0;
    setTimeout(function () {
      el.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, delay);
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      animateIn(entry.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(function (el) { observer.observe(el); });

  // Fade out whole page on departure
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href]');
    if (!link) return;
    var href = link.getAttribute('href');
    if (!href || href.charAt(0) === '#' || href.indexOf('mailto:') === 0 || link.target === '_blank') return;
    e.preventDefault();
    body.classList.add('page-leaving');
    var dest = link.href;
    setTimeout(function () { window.location.href = dest; }, 160);
  });
})();


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


// ---------- Prototype carousel pause/grid toggle ----------
(function () {
  var scroll = document.getElementById('proto-scroll');
  var btn = document.getElementById('proto-scroll-btn');
  if (!scroll || !btn) return;

  btn.addEventListener('click', function () {
    var paused = scroll.classList.toggle('proto-scroll--paused');
    btn.textContent = paused ? 'Resume motion' : 'Pause motion';
  });
})();


// ---------- Smart header (hide on scroll down, show on scroll up) ----------
(function () {
  var header = document.querySelector('.site-header');
  if (!header) return;
  var lastY = window.scrollY;
  var upAccum = 0;
  var THRESHOLD = 60;

  window.addEventListener('scroll', function () {
    var y = window.scrollY;
    if (y < lastY) {
      upAccum += lastY - y;
      if (upAccum >= THRESHOLD || y < 80) {
        header.classList.remove('nav-hidden');
      }
    } else {
      upAccum = 0;
      if (y > 80) {
        header.classList.add('nav-hidden');
      }
    }
    lastY = y;
  }, { passive: true });
})();


// ---------- Hamburger menu ----------
(function () {
  var btn = document.querySelector('.hamburger');
  var links = document.querySelector('.nav-links');
  if (!btn || !links) return;

  btn.addEventListener('click', function () {
    var open = links.classList.toggle('open');
    btn.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  // Close menu when a link is clicked
  links.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
      links.classList.remove('open');
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    }
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
