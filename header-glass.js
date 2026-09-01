/* Chrome du site Tex He Yit : bascule "solid" au scroll + Liquid Glass.
   Recopie du code reellement servi par texheyit.com
   (scrollcraft.js, module Liquid Glass + bascule solid des pages). */
(function () {
  'use strict';
  var bar = document.querySelector('.site-bar');
  if (!bar) return;
  var solidOn = false;
  function sync() {
    var want = scrollY > 12;
    if (want !== solidOn) { solidOn = want; bar.classList.toggle('solid', want); }
  }
  addEventListener('scroll', sync, { passive: true });
  sync();
})();

/* ==========================================================================
   Liquid Glass du chrome : indépendant de React, mais reprend les trois
   mécanismes utiles du prototype étudié — reflet de bord, teinte contextuelle
   et micro-réaction à la souris. Les filtres SVG de réfraction sont exclus :
   Safari iOS ne les rend pas de façon fiable.
   ========================================================================== */
(function () {
  function mountLiquidChrome() {
    var bar = document.querySelector('.site-bar');
    var pill = bar && bar.querySelector('.site-bar__pill');
    if (!bar || !pill) return;

    var fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
    var ticking = false;

    function hasRichBackdrop() {
      var rect = pill.getBoundingClientRect();
      var x = Math.round(innerWidth * 0.5);
      var y = Math.round(Math.min(innerHeight - 1, Math.max(rect.bottom + 8, 1)));
      var stack = document.elementsFromPoint(x, y);
      for (var i = 0; i < stack.length; i++) {
        var node = stack[i];
        if (bar.contains(node)) continue;
        if (node.matches && node.matches('img, video, canvas')) return true;
        if (node.closest && node.closest('.sc-stage, [data-sc-stage], .hero-live-stage, .contact-hero__photo')) return true;
      }
      return false;
    }

    function syncTone() {
      ticking = false;
      var solid = bar.classList.contains('solid');
      bar.classList.toggle('glass-over-light', solid && hasRichBackdrop());
    }

    function requestTone() {
      if (!ticking) { ticking = true; requestAnimationFrame(syncTone); }
    }

    addEventListener('scroll', requestTone, { passive: true });
    addEventListener('resize', requestTone, { passive: true });
    requestTone();

    if (!fine) return;
    addEventListener('pointermove', function (event) {
      if (event.pointerType && event.pointerType !== 'mouse') return;
      var r = pill.getBoundingClientRect();
      var nearX = Math.max(r.left - 190, Math.min(event.clientX, r.right + 190));
      var nearY = Math.max(r.top - 150, Math.min(event.clientY, r.bottom + 150));
      var dx = event.clientX - nearX;
      var dy = event.clientY - nearY;
      var near = Math.hypot(dx, dy) < 190;
      bar.classList.toggle('glass-hover', near && bar.classList.contains('solid'));
      if (!near) {
        pill.style.setProperty('--glass-light-x', '50%');
        pill.style.setProperty('--glass-light-y', '-30%');
        pill.style.setProperty('--glass-angle', '0deg');
        pill.style.setProperty('--glass-shift-x', '0px');
        pill.style.setProperty('--glass-shift-y', '0px');
        return;
      }
      var px = Math.max(0, Math.min(1, (event.clientX - r.left) / r.width));
      var py = Math.max(0, Math.min(1, (event.clientY - r.top) / r.height));
      pill.style.setProperty('--glass-light-x', (px * 100).toFixed(1) + '%');
      pill.style.setProperty('--glass-light-y', (py * 100 - 34).toFixed(1) + '%');
      pill.style.setProperty('--glass-angle', ((px - 0.5) * 18).toFixed(1) + 'deg');
      pill.style.setProperty('--glass-shift-x', ((px - 0.5) * 3.6).toFixed(2) + 'px');
      pill.style.setProperty('--glass-shift-y', ((py - 0.5) * 1.8).toFixed(2) + 'px');
    }, { passive: true });

    pill.addEventListener('pointerdown', function () { bar.classList.add('glass-pressed'); });
    addEventListener('pointerup', function () { bar.classList.remove('glass-pressed'); }, { passive: true });
    addEventListener('blur', function () { bar.classList.remove('glass-pressed', 'glass-hover'); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mountLiquidChrome, { once: true });
  else mountLiquidChrome();
})();