(function () {
  /* ── Hamburger nav toggle ── */
  var toggle = document.getElementById('navToggle');
  var nav    = document.getElementById('siteNav');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
    });

    // Mobile: sub-menu toggles
    nav.querySelectorAll('.site-nav__toggle-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var item   = btn.closest('.site-nav__item');
        var isOpen = item.classList.toggle('is-dropdown-open');
        btn.setAttribute('aria-expanded', String(isOpen));
      });
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (!toggle.contains(e.target) && !nav.contains(e.target)) {
        nav.classList.remove('is-open');
        toggle.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Close on resize to desktop
    window.addEventListener('resize', function () {
      if (window.innerWidth >= 900) {
        nav.classList.remove('is-open');
        toggle.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ── FAQ accordion ── */
  document.querySelectorAll('.faq__question').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item   = btn.closest('.faq__item');
      var isOpen = item.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', String(isOpen));
    });
  });
})();
