/* =========================================================
   Portfolio interactions
   - Springs (response + damping ratio), interruptible and
     velocity-aware, driven by one requestAnimationFrame loop
   - Segmented filter: press feedback, 1:1 thumb drag,
     rubber-banding, momentum projection, velocity handoff
   - Project filter: FLIP layout animation from the live
     on-screen position, so it can be re-filtered mid-flight
   ========================================================= */
(function () {
  'use strict';

  var root = document.documentElement;
  root.classList.add('js');

  var reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  function reducedMotion() { return reduceMotionQuery.matches; }

  /* ---------------------------------------------------------
     Spring engine
     --------------------------------------------------------- */
  var active = new Set();
  var dirty = new Set();
  var rafId = 0;
  var lastTime = 0;

  function frame(now) {
    var dt = Math.min((now - lastTime) / 1000, 1 / 30);
    lastTime = now;
    active.forEach(function (s) {
      s.step(dt);
      if (s.render) dirty.add(s.render);
    });
    dirty.forEach(function (r) { r(); });
    dirty.clear();
    rafId = active.size ? requestAnimationFrame(frame) : 0;
  }

  function wake() {
    if (!rafId) {
      lastTime = performance.now();
      rafId = requestAnimationFrame(frame);
    }
  }

  /**
   * @param {number} value   starting value
   * @param {object} opts    { response: seconds, damping: ratio }
   * @param {function} render called once per frame after values update
   */
  function Spring(value, opts, render) {
    this.value = value;
    this.target = value;
    this.velocity = 0;
    this.render = render || null;
    this.configure(opts || {});
  }

  Spring.prototype.configure = function (opts) {
    var response = opts.response || 0.35;
    var damping = opts.damping == null ? 1 : opts.damping;
    this.stiffness = Math.pow((2 * Math.PI) / response, 2);
    this.damping = (4 * Math.PI * damping) / response;
    return this;
  };

  /* Re-target from the current value, keeping current velocity unless one is handed off */
  Spring.prototype.to = function (target, velocity) {
    this.target = target;
    if (velocity != null) this.velocity = velocity;
    active.add(this);
    wake();
    return this;
  };

  /* Hard set (no animation) — used for 1:1 tracking during a drag */
  Spring.prototype.set = function (value) {
    this.value = this.target = value;
    this.velocity = 0;
    active.delete(this);
    if (this.render) { dirty.add(this.render); flushSoon(); }
    return this;
  };

  Spring.prototype.step = function (dt) {
    var h = 1 / 240;
    var n = Math.max(1, Math.ceil(dt / h));
    h = dt / n;
    for (var i = 0; i < n; i++) {
      var a = -this.stiffness * (this.value - this.target) - this.damping * this.velocity;
      this.velocity += a * h;
      this.value += this.velocity * h;
    }
    if (Math.abs(this.velocity) < 0.01 && Math.abs(this.value - this.target) < 0.01) {
      this.value = this.target;
      this.velocity = 0;
      active.delete(this);
    }
  };

  var flushQueued = false;
  function flushSoon() {
    if (flushQueued || rafId) return;
    flushQueued = true;
    requestAnimationFrame(function () {
      flushQueued = false;
      dirty.forEach(function (r) { r(); });
      dirty.clear();
    });
  }

  /* Apple's momentum projection (exponential deceleration) */
  function project(velocity, decelerationRate) {
    var d = decelerationRate || 0.998;
    return (velocity / 1000) * d / (1 - d);
  }

  /* Progressive resistance past a boundary */
  function rubberband(overshoot, dimension) {
    var c = 0.55;
    return (overshoot * dimension * c) / (dimension + c * Math.abs(overshoot));
  }

  /* Short position history → release velocity in px/s */
  function VelocityTracker() { this.samples = []; }
  VelocityTracker.prototype.add = function (x, t) {
    this.samples.push({ x: x, t: t });
    while (this.samples.length > 2 && t - this.samples[0].t > 100) this.samples.shift();
  };
  VelocityTracker.prototype.velocity = function () {
    var s = this.samples;
    if (s.length < 2) return 0;
    var a = s[0], b = s[s.length - 1];
    var dt = (b.t - a.t) / 1000;
    return dt > 0 ? (b.x - a.x) / dt : 0;
  };

  /* ---------------------------------------------------------
     Theme
     --------------------------------------------------------- */
  var darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
  function effectiveTheme() {
    var t = root.getAttribute('data-theme');
    return t || (darkQuery.matches ? 'dark' : 'light');
  }
  function syncThemeLabel(btn) {
    btn.setAttribute('aria-label', effectiveTheme() === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  }

  var themeBtn = document.getElementById('themeToggle');
  if (themeBtn) {
    syncThemeLabel(themeBtn);
    themeBtn.addEventListener('click', function () {
      var next = effectiveTheme() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
      syncThemeLabel(themeBtn);
    });
    darkQuery.addEventListener && darkQuery.addEventListener('change', function () { syncThemeLabel(themeBtn); });
  }

  /* ---------------------------------------------------------
     Navigation: scroll edge + active section
     --------------------------------------------------------- */
  var nav = document.getElementById('nav');
  var scrollTicking = false;
  function onScroll() {
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(function () {
      nav.classList.toggle('is-scrolled', window.scrollY > 4);
      scrollTicking = false;
    });
  }
  if (nav) {
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  var navLinks = Array.prototype.slice.call(document.querySelectorAll('[data-nav]'));
  if ('IntersectionObserver' in window && navLinks.length) {
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (a) {
          var on = a.getAttribute('href') === '#' + entry.target.id;
          a.classList.toggle('is-active', on);
          if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    navLinks.forEach(function (a) {
      var target = document.querySelector(a.getAttribute('href'));
      if (target) sectionObserver.observe(target);
    });
  }

  /* ---------------------------------------------------------
     Reveal on scroll (one-shot)
     --------------------------------------------------------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      var i = 0;
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.style.transitionDelay = Math.min(i++, 5) * 60 + 'ms';
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.01 });
    reveals.forEach(function (el) { revealObserver.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------------------------------------------------------
     Project filtering — FLIP with springs
     --------------------------------------------------------- */
  var grid = document.getElementById('projectGrid');
  var cards = grid ? Array.prototype.slice.call(grid.querySelectorAll('.card')) : [];
  var statusEl = document.getElementById('filterStatus');

  var cardMotion = new Map();
  cards.forEach(function (card) {
    var m = {};
    function render() {
      var settled = m.x.value === 0 && m.y.value === 0 && m.s.value === 1 && m.o.value === 1;
      card.style.transform = settled ? '' : 'translate3d(' + m.x.value + 'px,' + m.y.value + 'px,0) scale(' + m.s.value + ')';
      card.style.opacity = m.o.value === 1 ? '' : m.o.value;
    }
    var move = { response: 0.45, damping: 1 };
    m.x = new Spring(0, move, render);
    m.y = new Spring(0, move, render);
    m.s = new Spring(1, { response: 0.4, damping: 1 }, render);
    m.o = new Spring(1, { response: 0.3, damping: 1 }, render);
    cardMotion.set(card, m);
  });

  function applyFilter(category) {
    var reduce = reducedMotion();

    // FIRST: where each card is on screen right now (includes in-flight transforms)
    var first = new Map();
    cards.forEach(function (card) {
      if (!card.hidden) first.set(card, card.getBoundingClientRect());
    });

    var shown = 0;
    cards.forEach(function (card) {
      var cats = (card.getAttribute('data-category') || '').split(/\s+/);
      var visible = category === 'all' || cats.indexOf(category) !== -1;
      card.hidden = !visible;
      if (visible) shown++;
    });

    // LAST: layout positions without our transforms
    cards.forEach(function (card) {
      if (card.hidden) {
        var hm = cardMotion.get(card);
        hm.x.set(0); hm.y.set(0); hm.s.set(1); hm.o.set(1);
        return;
      }
      card.style.transform = '';
      var last = card.getBoundingClientRect();
      var m = cardMotion.get(card);
      var f = first.get(card);

      if (f) {
        if (reduce) { m.x.set(0); m.y.set(0); return; }
        // INVERT from the live position, PLAY to zero — velocity is preserved
        m.x.value = f.left - last.left;
        m.y.value = f.top - last.top;
        m.x.to(0);
        m.y.to(0);
      } else {
        // Entering: materialize in place
        m.x.set(0); m.y.set(0);
        m.o.value = 0; m.o.velocity = 0; m.o.to(1);
        if (!reduce) { m.s.value = 0.94; m.s.velocity = 0; m.s.to(1); }
      }
    });

    if (statusEl) statusEl.textContent = 'Showing ' + shown + (shown === 1 ? ' project' : ' projects');
  }

  /* ---------------------------------------------------------
     Segmented control
     --------------------------------------------------------- */
  var seg = document.getElementById('filters');
  if (seg) {
    var thumb = seg.querySelector('.segmented-thumb');
    var buttons = Array.prototype.slice.call(seg.querySelectorAll('button[data-filter]'));
    var selected = Math.max(0, buttons.findIndex(function (b) { return b.getAttribute('aria-checked') === 'true'; }));

    function renderThumb() {
      thumb.style.width = tw.value + 'px';
      thumb.style.transform = 'translate3d(' + tx.value + 'px,0,0) scale(' + ts.value + ')';
    }
    var tx = new Spring(0, { response: 0.35, damping: 1 }, renderThumb);
    var tw = new Spring(0, { response: 0.35, damping: 1 }, renderThumb);
    var ts = new Spring(1, { response: 0.25, damping: 1 }, renderThumb);

    function geom(i) {
      var b = buttons[i];
      return { x: b.offsetLeft, w: b.offsetWidth, c: b.offsetLeft + b.offsetWidth / 2 };
    }

    function indexAtX(x) {
      var best = 0, bestD = Infinity;
      buttons.forEach(function (b, i) {
        var d = Math.abs(geom(i).c - x);
        if (d < bestD) { bestD = d; best = i; }
      });
      return best;
    }

    function select(i, opts) {
      opts = opts || {};
      var changed = i !== selected;
      selected = i;
      buttons.forEach(function (b, j) {
        b.setAttribute('aria-checked', j === i ? 'true' : 'false');
        b.tabIndex = j === i ? 0 : -1;
      });
      var g = geom(i);
      if (opts.instant || reducedMotion()) {
        tx.set(g.x); tw.set(g.w);
      } else {
        // Hand the finger's velocity to the spring; a little bounce only after a flick
        var flick = opts.velocity != null && Math.abs(opts.velocity) > 300;
        tx.configure({ response: 0.35, damping: flick ? 0.8 : 1 }).to(g.x, opts.velocity);
        tw.to(g.w);
      }
      if (opts.focus) buttons[i].focus();
      if (changed) applyFilter(buttons[i].getAttribute('data-filter'));
    }

    // Initial position — after fonts settle so widths are right
    select(selected, { instant: true });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { select(selected, { instant: true }); });
    window.addEventListener('resize', function () { select(selected, { instant: true }); });

    // ---- Pointer: press feedback on down, drag the thumb 1:1, commit on up
    var drag = null;
    var DRAG_SLOP = 10;

    function buttonFromEvent(e) {
      var el = document.elementFromPoint(e.clientX, e.clientY);
      var b = el && el.closest ? el.closest('button[data-filter]') : null;
      return b && seg.contains(b) ? b : null;
    }
    function localX(e) { return e.clientX - seg.getBoundingClientRect().left + seg.scrollLeft; }
    function clearPressed() { buttons.forEach(function (b) { b.classList.remove('is-pressed'); }); }

    seg.addEventListener('pointerdown', function (e) {
      if (e.button !== 0) return;
      var b = buttonFromEvent(e);
      if (!b) return;
      var i = buttons.indexOf(b);
      seg.setPointerCapture(e.pointerId);
      var onThumb = i === selected;
      drag = {
        id: e.pointerId,
        startX: localX(e),
        thumbStart: tx.value,
        onThumb: onThumb,
        moved: false,
        tracker: new VelocityTracker(),
      };
      drag.tracker.add(e.clientX, e.timeStamp);
      if (onThumb) {
        if (!reducedMotion()) ts.to(0.95); // the thumb "picks up" under the finger
      } else {
        b.classList.add('is-pressed');
      }
    });

    seg.addEventListener('pointermove', function (e) {
      if (!drag || e.pointerId !== drag.id) return;
      drag.tracker.add(e.clientX, e.timeStamp);
      var dx = localX(e) - drag.startX;
      if (!drag.moved && Math.abs(dx) > DRAG_SLOP) drag.moved = true;

      if (drag.onThumb && drag.moved) {
        // 1:1 tracking, respecting where it was grabbed; rubber-band at the ends
        var min = geom(0).x;
        var max = geom(buttons.length - 1).x + geom(buttons.length - 1).w - tw.value;
        var x = drag.thumbStart + dx;
        if (x < min) x = min + rubberband(x - min, seg.clientWidth);
        if (x > max) x = max + rubberband(x - max, seg.clientWidth);
        tx.set(x);
        tw.to(geom(indexAtX(x + tw.value / 2)).w);
      } else if (!drag.onThumb) {
        // Allow cancel-by-dragging-away and back
        var over = buttonFromEvent(e);
        clearPressed();
        if (over && buttons.indexOf(over) !== selected) over.classList.add('is-pressed');
      }
    });

    function endDrag(e, cancelled) {
      if (!drag || e.pointerId !== drag.id) return;
      var d = drag;
      drag = null;
      clearPressed();
      ts.to(1);
      if (cancelled) { select(selected); return; }

      if (d.onThumb && d.moved) {
        var v = d.tracker.velocity();
        var projectedCenter = tx.value + tw.value / 2 + project(v, 0.99);
        select(indexAtX(projectedCenter), { velocity: v });
      } else {
        var b = buttonFromEvent(e);
        if (b) select(buttons.indexOf(b));
      }
    }
    seg.addEventListener('pointerup', function (e) { endDrag(e, false); });
    seg.addEventListener('pointercancel', function (e) { endDrag(e, true); });

    // Keyboard: radiogroup semantics with roving focus
    seg.addEventListener('keydown', function (e) {
      var i = selected;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') i = (selected + 1) % buttons.length;
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') i = (selected - 1 + buttons.length) % buttons.length;
      else if (e.key === 'Home') i = 0;
      else if (e.key === 'End') i = buttons.length - 1;
      else return;
      e.preventDefault();
      select(i, { focus: true });
    });
    seg.addEventListener('click', function (e) {
      // Pointer handled above; this covers keyboard Enter/Space activation (detail === 0)
      if (e.detail !== 0) return;
      var b = e.target.closest('button[data-filter]');
      if (b) select(buttons.indexOf(b));
    });
  }

  /* ---------------------------------------------------------
     Footer year
     --------------------------------------------------------- */
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
