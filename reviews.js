(function () {
  var section = document.getElementById('opinie');
  var track = document.getElementById('grTrack');
  var dotsContainer = document.getElementById('grDots');
  var carousel = document.getElementById('grCarousel');
  var prevBtn = document.getElementById('grPrev');
  var nextBtn = document.getElementById('grNext');
  var starsEl = document.getElementById('grStars');
  var metaEl = document.getElementById('grMeta');
  var badgeEl = document.getElementById('grBadge');

  if (!section || !track || !carousel) return;

  var AUTOPLAY_DELAY = 5000;
  var SWIPE_THRESHOLD = 40;

  var reviews = [];
  var currentIndex = 0;
  var autoplayTimer = null;

  var AVATAR_COLORS = ['#0071e3', '#34c759', '#ff9500', '#ff375f', '#af52de', '#5ac8fa', '#ff3b30', '#5856d6'];

  var MONTHS_PL = [
    'stycznia', 'lutego', 'marca', 'kwietnia', 'maja', 'czerwca',
    'lipca', 'sierpnia', 'września', 'października', 'listopada', 'grudnia'
  ];

  function getInitials(name) {
    var trimmed = (name || '').trim();
    if (!trimmed) return '?';
    var parts = trimmed.split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }

  function getAvatarColor(name) {
    var hash = 0;
    for (var i = 0; i < name.length; i++) {
      hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
    }
    return AVATAR_COLORS[hash % AVATAR_COLORS.length];
  }

  function renderStars(rating) {
    var full = Math.max(0, Math.min(5, Math.round(Number(rating) || 0)));
    return '★'.repeat(full) + '☆'.repeat(5 - full);
  }

  function formatDate(dateStr) {
    var parts = (dateStr || '').split('-');
    if (parts.length !== 3) return dateStr || '';
    var year = parseInt(parts[0], 10);
    var month = parseInt(parts[1], 10);
    var day = parseInt(parts[2], 10);
    if (!month || month < 1 || month > 12 || !day) return dateStr;
    return day + ' ' + MONTHS_PL[month - 1] + ' ' + year;
  }

  function pluralForm(n) {
    if (n === 1) return 'opinia';
    var lastTwo = n % 100;
    var last = n % 10;
    if (last >= 2 && last <= 4 && !(lastTwo >= 12 && lastTwo <= 14)) return 'opinie';
    return 'opinii';
  }

  function createCard(review) {
    var li = document.createElement('li');
    li.className = 'gr-card';
    li.setAttribute('role', 'group');
    li.setAttribute('aria-roledescription', 'opinia klienta');

    var quote = document.createElement('span');
    quote.className = 'gr-card__quote';
    quote.setAttribute('aria-hidden', 'true');
    quote.textContent = '“';
    li.appendChild(quote);

    var stars = document.createElement('div');
    stars.className = 'gr-card__stars';
    stars.setAttribute('aria-label', 'Ocena: ' + review.rating + ' z 5');
    stars.textContent = renderStars(review.rating);
    li.appendChild(stars);

    var text = document.createElement('p');
    text.className = 'gr-card__text';
    text.textContent = review.text || '';
    li.appendChild(text);

    var author = document.createElement('div');
    author.className = 'gr-card__author';

    var avatar = document.createElement('div');
    avatar.className = 'gr-card__avatar';
    if (review.avatar) {
      var img = document.createElement('img');
      img.src = review.avatar;
      img.alt = '';
      img.loading = 'lazy';
      avatar.appendChild(img);
    } else {
      avatar.style.background = getAvatarColor(review.author || '');
      avatar.textContent = getInitials(review.author);
    }
    author.appendChild(avatar);

    var meta = document.createElement('div');
    meta.className = 'gr-card__meta';

    var name = document.createElement('span');
    name.className = 'gr-card__name';
    name.textContent = review.author || '';
    meta.appendChild(name);

    var date = document.createElement('span');
    date.className = 'gr-card__date';
    date.textContent = formatDate(review.date);
    meta.appendChild(date);

    author.appendChild(meta);
    li.appendChild(author);

    return li;
  }

  function update() {
    track.style.transform = 'translateX(-' + (currentIndex * 100) + '%)';
    var dots = dotsContainer.querySelectorAll('.gr-dot');
    for (var i = 0; i < dots.length; i++) {
      var isActive = i === currentIndex;
      dots[i].classList.toggle('is-active', isActive);
      dots[i].setAttribute('aria-current', isActive ? 'true' : 'false');
    }
  }

  function goTo(index) {
    var len = reviews.length;
    if (!len) return;
    currentIndex = ((index % len) + len) % len;
    update();
  }

  function next() { goTo(currentIndex + 1); }
  function prev() { goTo(currentIndex - 1); }

  function startAutoplay() {
    if (reviews.length <= 1) return;
    stopAutoplay();
    autoplayTimer = setInterval(next, AUTOPLAY_DELAY);
  }

  function stopAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  function restartAutoplay() {
    stopAutoplay();
    startAutoplay();
  }

  // Pause autoplay on hover
  carousel.addEventListener('mouseenter', stopAutoplay);
  carousel.addEventListener('mouseleave', startAutoplay);

  // Arrow navigation
  prevBtn.addEventListener('click', function () {
    prev();
    restartAutoplay();
  });
  nextBtn.addEventListener('click', function () {
    next();
    restartAutoplay();
  });

  // Swipe navigation (mobile)
  var touchStartX = 0;
  carousel.addEventListener('touchstart', function (e) {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });

  carousel.addEventListener('touchend', function (e) {
    var touchEndX = e.changedTouches[0].clientX;
    var delta = touchStartX - touchEndX;
    if (Math.abs(delta) > SWIPE_THRESHOLD) {
      if (delta > 0) {
        next();
      } else {
        prev();
      }
      restartAutoplay();
    }
  }, { passive: true });

  function showEmpty() {
    carousel.hidden = true;
    dotsContainer.hidden = true;
    if (badgeEl) badgeEl.hidden = true;

    var empty = document.createElement('p');
    empty.className = 'gr-empty';
    empty.textContent = 'Nie mamy jeszcze opinii, ale chętnie poznamy Twoją! Po każdej imprezie zbieramy opinie klientów i na bieżąco publikujemy je w tym miejscu.';
    section.appendChild(empty);
  }

  function init(data) {
    reviews = (data && data.reviews) || [];

    if (!reviews.length) {
      showEmpty();
      return;
    }

    reviews.forEach(function (review) {
      track.appendChild(createCard(review));
    });

    reviews.forEach(function (_, i) {
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'gr-dot';
      dot.setAttribute('aria-label', 'Przejdź do opinii ' + (i + 1));
      dot.addEventListener('click', function () {
        goTo(i);
        restartAutoplay();
      });
      dotsContainer.appendChild(dot);
    });

    if (reviews.length <= 1) {
      prevBtn.hidden = true;
      nextBtn.hidden = true;
      dotsContainer.hidden = true;
    }

    update();
    startAutoplay();

    var avg = reviews.reduce(function (sum, r) {
      return sum + (Number(r.rating) || 0);
    }, 0) / reviews.length;

    if (starsEl) starsEl.textContent = renderStars(avg);
    if (metaEl) metaEl.textContent = avg.toFixed(1) + ' · ' + reviews.length + ' ' + pluralForm(reviews.length);
  }

  fetch('./data/reviews.json')
    .then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    })
    .then(init)
    .catch(function (err) {
      console.error('Nie udało się wczytać opinii klientów:', err);
      showEmpty();
    });
})();
