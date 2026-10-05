/* =========================================================
   H3RD — site behaviour
   Plain ES5-friendly JavaScript. No build step, no dependencies.
   ---------------------------------------------------------
   1. Helpers          5. E-ink label flip
   2. Footer year      6. Scroll reveal
   3. Workflow steps
   4. Industry tabs
   ========================================================= */
(function () {
  'use strict';

  var root = document.documentElement;

  function $(selector, scope) {
    return (scope || document).querySelector(selector);
  }
  function $$(selector, scope) {
    return Array.prototype.slice.call((scope || document).querySelectorAll(selector));
  }

  /* ---------- 2. Footer year ---------- */
  function initYear() {
    var year = String(new Date().getFullYear());
    $$('[data-year]').forEach(function (el) { el.textContent = year; });
  }

  /* ---------- 3. Workflow steps (tablist) ---------- */
  /* Each step reveals its own detail panel. Keyboard support follows the
     standard tabs pattern: arrows move, Home/End jump to the ends. */
  function wireTablist(buttons, panels, buttonClass) {
    if (!buttons.length || !panels.length) return;

    function activate(index, focus) {
      buttons.forEach(function (button, i) {
        var on = i === index;
        button.classList.toggle('is-active', on);
        button.setAttribute('aria-selected', on ? 'true' : 'false');
        button.tabIndex = on ? 0 : -1;
      });
      panels.forEach(function (panel, i) {
        var on = i === index;
        panel.classList.toggle('is-active', on);
        if (on) {
          panel.removeAttribute('hidden');
        } else {
          panel.setAttribute('hidden', '');
        }
      });
      if (focus && buttons[index]) buttons[index].focus();
    }

    var vertical = buttonClass === '.workflow__step';

    buttons.forEach(function (button, i) {
      button.addEventListener('click', function () { activate(i, false); });
      button.addEventListener('keydown', function (event) {
        var last = buttons.length - 1;
        var next = null;
        var advance = vertical ? 'ArrowDown' : 'ArrowRight';
        var retreat = vertical ? 'ArrowUp' : 'ArrowLeft';
        if (event.key === advance) next = i === last ? 0 : i + 1;
        else if (event.key === retreat) next = i === 0 ? last : i - 1;
        else if (event.key === 'Home') next = 0;
        else if (event.key === 'End') next = last;
        if (next !== null) {
          event.preventDefault();
          activate(next, true);
        }
      });
    });
  }

  function initWorkflow() {
    wireTablist($$('.workflow__step'), $$('.workflow__panel'), '.workflow__step');
  }

  /* ---------- 4. Industry tabs ---------- */
  function initTabs() {
    wireTablist($$('.tab'), $$('.tabpanel'), '.tab');
  }

  /* ---------- 5. E-ink label flip ---------- */
  function initLabelFlip() {
    var label = $('#label-flip');
    if (!label) return;
    label.addEventListener('click', function () {
      var flipped = label.getAttribute('aria-pressed') === 'true';
      label.setAttribute('aria-pressed', flipped ? 'false' : 'true');
    });
  }

  /* ---------- 6. Scroll reveal ---------- */
  /* The head script adds the 'anim' class; here we actually drive it. A timer
     guarantees nothing can stay permanently hidden if the observer
     misbehaves (e.g. element inside a collapsed container). */
  function initReveal() {
    if (!root.classList.contains('anim')) return;

    var items = $$('[data-reveal]');
    if (!items.length) return;

    function show(el) { el.classList.add('is-visible'); }

    if (!('IntersectionObserver' in window)) {
      items.forEach(show);
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          show(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

    items.forEach(function (el, index) {
      el.style.setProperty('--reveal-delay', (index % 6) * 55 + 'ms');
      observer.observe(el);
    });

    // Safety net: reveal anything still hidden after the page has settled.
    window.setTimeout(function () {
      items.forEach(function (el) {
        var box = el.getBoundingClientRect();
        if (box.top < window.innerHeight && box.bottom > 0) show(el);
      });
    }, 1600);
  }

  /* ---------- Boot ---------- */
  function init() {
    initYear();
    initWorkflow();
    initTabs();
    initLabelFlip();
    initReveal();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}());
