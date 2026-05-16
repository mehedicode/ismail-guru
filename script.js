/* ══════════════════════════════════════════════════════
   ISMAIL GURU — script.js
   All 6 fixes included. Beginner-friendly comments.
   No libraries, no frameworks. Pure vanilla JS.
   ══════════════════════════════════════════════════════ */


/* ─────────────────────────────────────────
   1. LOADING SCREEN
   Fades out after page fully loads
───────────────────────────────────────── */
window.addEventListener('load', function () {
  var loader = document.getElementById('loading-screen');
  if (!loader) return;

  setTimeout(function () {
    loader.classList.add('hidden');
    setTimeout(function () { loader.style.display = 'none'; }, 900);
  }, 2200);
});


/* ─────────────────────────────────────────
   2. NAVBAR — scroll darkening
───────────────────────────────────────── */
var navbar = document.getElementById('navbar');

window.addEventListener('scroll', function () {
  if (!navbar) return;
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });


/* ─────────────────────────────────────────
   ✅ FIX 1 — HAMBURGER MENU
   Toggles the mobile dropdown when tapped
───────────────────────────────────────── */

document.addEventListener('click', function (e) {
  if (!navbar) return;
  if (!navbar.contains(e.target)) {
    closeMobileMenu();
  }
});

var hamburger    = document.getElementById('nav-hamburger');
var mobileMenu   = document.getElementById('nav-mobile-menu');
var mobReviews   = document.getElementById('mob-reviews');
var mobContact   = document.getElementById('mob-contact');
var mobAbout     = document.getElementById('mob-about');

function closeMobileMenu() {
  if (!hamburger || !mobileMenu) return;
  hamburger.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  mobileMenu.classList.remove('open');
}

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', function () {
    var isOpen = mobileMenu.classList.contains('open');
    if (isOpen) {
      closeMobileMenu();
    } else {
      hamburger.classList.add('open');
      hamburger.setAttribute('aria-expanded', 'true');
      mobileMenu.classList.add('open');
    }
  });
}

/* Close mobile menu when a link is tapped */
if (mobReviews) mobReviews.addEventListener('click', closeMobileMenu);
if (mobContact) mobContact.addEventListener('click', closeMobileMenu);

/* Mobile About Us button also opens the modal */
if (mobAbout) {
  mobAbout.addEventListener('click', function () {
    closeMobileMenu();
    openAboutModal();
  });
}

/* Close menu when tapping outside */
document.addEventListener('click', function (e) {
  if (!navbar) return;
  if (!navbar.contains(e.target)) {
    closeMobileMenu();
  }
});


/* ─────────────────────────────────────────
   3. SMOOTH SCROLL for anchor links
───────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(function (link) {
  link.addEventListener('click', function (e) {
    var href = this.getAttribute('href');
    if (href && href.length > 1) {
      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        // Offset for fixed navbar height
        var navH = navbar ? navbar.offsetHeight : 54;
        var top  = target.getBoundingClientRect().top + window.scrollY - navH;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    }
  });
});


/* ─────────────────────────────────────────
   4. ABOUT US MODAL
───────────────────────────────────────── */
var aboutModal    = document.getElementById('about-modal');
var openAboutBtn  = document.getElementById('open-about');
var closeAboutBtn = document.getElementById('close-about');
var footerAboutBtn = document.getElementById('footer-about-btn');

function openAboutModal() {
  if (!aboutModal) return;
  aboutModal.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeAboutModal() {
  if (!aboutModal) return;
  aboutModal.classList.remove('show');
  document.body.style.overflow = '';
}

if (openAboutBtn)    openAboutBtn.addEventListener('click', openAboutModal);
if (footerAboutBtn)  footerAboutBtn.addEventListener('click', openAboutModal);
if (closeAboutBtn)   closeAboutBtn.addEventListener('click', closeAboutModal);

/* Close modal on overlay click */
if (aboutModal) {
  aboutModal.addEventListener('click', function (e) {
    if (e.target === aboutModal) closeAboutModal();
  });
}

/* Close modals with Escape key */
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    closeAboutModal();
    closeCommentPopup();
  }
});

   /* ─────────────────────────────────────────
   LOCAL HTML5 VIDEO PLAYER
   Clicking the play button starts the video.
   Clicking again pauses it.
───────────────────────────────────────── */
document.querySelectorAll('.media-card').forEach(function (card) {
  var video = card.querySelector('.local-video');
  if (!video) return; /* skip photo cards */

  /* Tap/click anywhere on card to play/pause */
  card.addEventListener('click', function () {
    if (video.paused) {
      /* Pause all other videos first */
      document.querySelectorAll('.local-video').forEach(function (v) {
        if (v !== video) {
          v.pause();
          v.closest('.media-card').classList.remove('vid-playing');
          v.removeAttribute('controls');
        }
      });
      video.setAttribute('controls', ''); /* show native controls */
      video.play();
      card.classList.add('vid-playing');
    } else {
      video.pause();
      video.removeAttribute('controls');
      card.classList.remove('vid-playing');
    }
  });

  /* When video ends: reset to poster state */
  video.addEventListener('ended', function () {
    card.classList.remove('vid-playing');
    video.removeAttribute('controls');
    video.load(); /* reset to poster frame */
  });
});


/* ─────────────────────────────────────────
   5. COMMENT FORM TOGGLE
───────────────────────────────────────── */
var openCommentBtn  = document.getElementById('open-comment-form');
var commentFormWrap = document.getElementById('comment-form-wrap');

if (openCommentBtn && commentFormWrap) {
  openCommentBtn.addEventListener('click', function () {
    var isOpen = commentFormWrap.classList.contains('open');
    commentFormWrap.classList.toggle('open');
    openCommentBtn.textContent = isOpen ? '✍ Write a Comment' : '✕  Close Form';
  });
}


/* ─────────────────────────────────────────
   ✅ FIX 5 — STAR RATING
   Clicking a star highlights it + all before it
───────────────────────────────────────── */
var stars        = document.querySelectorAll('.star');
var ratingInput  = document.getElementById('comment-rating');

stars.forEach(function (star) {

  /* Hover: highlight stars up to hovered one */
  star.addEventListener('mouseenter', function () {
    var val = parseInt(this.getAttribute('data-value'));
    stars.forEach(function (s) {
      var sv = parseInt(s.getAttribute('data-value'));
      s.classList.toggle('hovered', sv <= val);
    });
  });

  /* Mouse leave: remove hover highlight */
  star.addEventListener('mouseleave', function () {
    stars.forEach(function (s) { s.classList.remove('hovered'); });
  });

  /* Click: set selected rating */
  star.addEventListener('click', function () {
    var val = parseInt(this.getAttribute('data-value'));
    if (ratingInput) ratingInput.value = val;

    stars.forEach(function (s) {
      var sv = parseInt(s.getAttribute('data-value'));
      s.classList.toggle('selected', sv <= val);
      s.classList.remove('hovered');
    });
  });

  /* Touch support for mobile */
  star.addEventListener('touchstart', function (e) {
    e.preventDefault(); /* prevent ghost click */
    var val = parseInt(this.getAttribute('data-value'));
    if (ratingInput) ratingInput.value = val;

    stars.forEach(function (s) {
      var sv = parseInt(s.getAttribute('data-value'));
      s.classList.toggle('selected', sv <= val);
    });
  }, { passive: false });
});


/* ─────────────────────────────────────────
   6. COMMENT SUBMIT → show popup
───────────────────────────────────────── */
var commentSubmitBtn     = document.getElementById('comment-submit');
var commentPopup         = document.getElementById('comment-popup');
var closeCommentPopupBtn = document.getElementById('close-comment-popup');

function showCommentPopup() {
  if (!commentPopup) return;
  commentPopup.classList.add('show');
}

function closeCommentPopup() {
  if (!commentPopup) return;
  commentPopup.classList.remove('show');
}

if (commentSubmitBtn) {
  commentSubmitBtn.addEventListener('click', function () {
    showCommentPopup();
  });
}

if (closeCommentPopupBtn) {
  closeCommentPopupBtn.addEventListener('click', closeCommentPopup);
}

/* Close popup on overlay click */
if (commentPopup) {
  commentPopup.addEventListener('click', function (e) {
    if (e.target === commentPopup) closeCommentPopup();
  });
}


/* ─────────────────────────────────────────
   7. HERO FLOATING PARTICLES
   Creates small glowing dots in the background
───────────────────────────────────────── */
var particlesContainer = document.getElementById('particles');

if (particlesContainer) {
  for (var i = 0; i < 28; i++) {
    createParticle();
  }
}

function createParticle() {
  var el   = document.createElement('div');
  var size = Math.random() * 3 + 2;
  var gold = Math.random() > 0.5;
  var alpha = Math.random() * 0.4 + 0.15;
  var color = gold
    ? 'rgba(200,150,12,' + alpha + ')'
    : 'rgba(192,24,40,'  + alpha + ')';
  var dur   = (Math.random() * 8 + 6).toFixed(1);
  var delay = -(Math.random() * 10).toFixed(1);

  el.style.cssText = [
    'position:absolute',
    'border-radius:50%',
    'pointer-events:none',
    'width:'  + size + 'px',
    'height:' + size + 'px',
    'background:' + color,
    'box-shadow:0 0 ' + (size * 3) + 'px ' + color,
    'left:'   + (Math.random() * 100).toFixed(1) + '%',
    'top:'    + (Math.random() * 100).toFixed(1) + '%',
    'animation:particleFloat ' + dur + 's ease-in-out infinite',
    'animation-delay:' + delay + 's',
    'opacity:0'
  ].join(';');

  particlesContainer.appendChild(el);
}

/* Particle keyframe — injected into a <style> tag */
(function () {
  var s = document.createElement('style');
  s.textContent =
    '@keyframes particleFloat{' +
    '0%{opacity:0;transform:translateY(0) scale(1)}' +
    '20%{opacity:1}' +
    '80%{opacity:1}' +
    '100%{opacity:0;transform:translateY(-55px) scale(0.5)}' +
    '}';
  document.head.appendChild(s);
}());


/* ─────────────────────────────────────────
   8. SCROLL REVEAL
   Fade-in sections as user scrolls down
───────────────────────────────────────── */
var revealEls = document.querySelectorAll(
  '#gallery .section-header, #gallery .gallery-grid, ' +
  '#reviews .section-header, #reviews .reviews-scroll-wrap, ' +
  '#contact .section-header, #contact .contact-grid, ' +
  '#footer .footer-inner'
);

revealEls.forEach(function (el) { el.classList.add('reveal'); });

if ('IntersectionObserver' in window) {
  var revealObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealEls.forEach(function (el) { revealObs.observe(el); });
} else {
  /* Fallback for older Android browsers */
  revealEls.forEach(function (el) { el.classList.add('visible'); });
}


/* ─────────────────────────────────────────
   9. ACTIVE NAV LINK HIGHLIGHT
   Highlights nav link matching current section
───────────────────────────────────────── */
var sections    = document.querySelectorAll('section[id]');
var desktopLinks = document.querySelectorAll('.nav-links .nav-link[href^="#"]');

window.addEventListener('scroll', function () {
  var scrollPos = window.scrollY + 80;
  sections.forEach(function (section) {
    var top    = section.offsetTop;
    var bottom = top + section.offsetHeight;
    var id     = section.getAttribute('id');
    desktopLinks.forEach(function (link) {
      if (link.getAttribute('href') === '#' + id && scrollPos >= top && scrollPos < bottom) {
        link.style.color = 'var(--gold-light)';
      } else if (link.style.color === 'var(--gold-light)' && link.getAttribute('href') !== '#' + id) {
        link.style.color = '';
      }
    });
  });
}, { passive: true });


/* ─────────────────────────────────────────
   10. PREVENT DOUBLE-TAP ZOOM (Android)
───────────────────────────────────────── */
var lastTouch = 0;
document.addEventListener('touchend', function (e) {
  var now = Date.now();
  if (now - lastTouch < 300) e.preventDefault();
  lastTouch = now;
}, false);
