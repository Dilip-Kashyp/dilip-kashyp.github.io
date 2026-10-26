/* Card stack: after the hero, each card slides up from below and lands on the
   ones before it, which tilt back into a 3D pile. Also runs the Experience and
   Projects sliders and the tabs inside each project, and sends links that
   point at a slide (#case-atlas) to the right card and slide.
   The stack works on every screen and nothing ever scrolls inside a card: a
   card that fits the window is one screen tall (shrunk a little if needed); a
   taller one scrolls through like a section, then stays while the next covers it.
   Exposes window.DK.stack.goTo for the command palette and other scripts. */
(() => {
  "use strict";

  const $ = (sel, scope = document) => scope.querySelector(sel);
  const $$ = (sel, scope = document) => [...scope.querySelectorAll(sel)];
  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const stack = $("#stack");
  if (!stack) return;
  const cards = $$(".stack-card", stack);
  const inners = cards.map((card) => $(".stack-card__inner", card));
  // Each card's in-flow position, read from the empty anchor before it: the
  // card's own rect includes its tilt, which would feed back into the maths.
  const anchors = cards.map((card) => {
    const prev = card.previousElementSibling;
    return prev && prev.classList.contains("stack-anchor") ? prev : card;
  });

  // ---------- 3D stacking ----------
  // Where each card lands: its sticky top from the CSS. Tall cards stick
  // higher up (see place()) but still land, and finish tilting, here.
  let tops = [];

  function clearTransforms() {
    cards.forEach((card, i) => {
      card.style.transform = "";
      card.style.visibility = "";
      inners[i].style.transform = "";
      inners[i].style.removeProperty("--shade");
    });
  }

  function renderStack() {
    const vh = window.innerHeight;
    // 0 while a card is below the fold, 1 once it has landed.
    const landed = cards.map((card, i) => {
      const top = Math.max(tops[i], anchors[i].getBoundingClientRect().top);
      const rise = clamp((vh - top) / Math.max(1, vh - tops[i]), 0, 1);
      return rise > 0.995 ? 1 : rise;
    });
    // Walk from the last card back, counting how many cards sit on top of each.
    let above = 0;
    for (let i = cards.length - 1; i >= 0; i--) {
      const rise = landed[i];
      const depth = Math.min(above, 3);
      cards[i].style.transform = rise < 1 ? `perspective(1200px) rotateX(${((1 - rise) * 18).toFixed(2)}deg)` : "";
      inners[i].style.transform = depth > 0 ? `translateY(${(-depth * 16).toFixed(1)}px) scale(${(1 - depth * 0.05).toFixed(4)})` : "";
      inners[i].style.setProperty("--shade", depth.toFixed(3));
      // Cards buried deeper than three levels are fully hidden anyway.
      cards[i].style.visibility = above > 3.6 ? "hidden" : "";
      above += rise;
    }
  }

  // ---------- Fitting ----------
  const over = (el) => Math.max(0, el.scrollHeight - el.clientHeight);

  // Below this zoom a card gets hard to read, so it keeps its natural height
  // instead. Phone text is already small, so phones shrink less.
  const minFit = () => (window.innerWidth < 720 ? 0.92 : 0.78);

  // The worst case over the card's slides and the tab panels inside them.
  function overflow(inner) {
    let worst = over($(".card-body", inner));
    for (const slide of $$(".slide", inner)) {
      const panels = $$(".proj-panel", slide);
      if (!panels.length) {
        worst = Math.max(worst, over(slide));
        continue;
      }
      const hidden = panels.map((panel) => panel.hidden);
      for (const panel of panels) {
        panels.forEach((other) => (other.hidden = other !== panel));
        worst = Math.max(worst, over(slide));
      }
      panels.forEach((panel, i) => (panel.hidden = hidden[i]));
    }
    return worst;
  }

  // Makes the card one screen tall (.is-fixed) at the largest zoom (--fit)
  // that still shows all its content. Text rewraps as the zoom changes, so
  // overflow is not linear in it: binary search instead of scaling by the
  // ratio. When even the minimum zoom is not enough, the card stays tall.
  function fitCard(card, inner) {
    const fitsAt = (zoom) => {
      inner.style.setProperty("--fit", zoom.toFixed(3));
      return overflow(inner) < 1;
    };
    card.classList.add("is-fixed");
    inner.style.removeProperty("--fit");
    if (overflow(inner) < 1) return;
    let lo = minFit();
    if (!fitsAt(lo)) {
      inner.style.removeProperty("--fit");
      card.classList.remove("is-fixed");
      return;
    }
    let hi = 1;
    for (let i = 0; i < 6; i++) {
      const mid = (lo + hi) / 2;
      if (fitsAt(mid)) lo = mid;
      else hi = mid;
    }
    fitsAt(lo);
  }

  // A tall card sticks only once its bottom edge is on screen, so all of it
  // can be read before the next card slides over it.
  function place() {
    const vh = document.documentElement.clientHeight;
    tops = cards.map((card) => {
      card.style.top = "";
      const top = parseFloat(getComputedStyle(card).top) || 0;
      if (!card.classList.contains("is-fixed")) card.style.top = `${Math.min(top, vh - card.offsetHeight - 24)}px`;
      return top;
    });
  }

  let frame = 0;
  function onFrame() {
    frame = 0;
    if (!reducedMotion.matches) renderStack();
  }
  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(onFrame);
  };

  let size = "";
  function setMode() {
    size = `${window.innerWidth}x${document.documentElement.clientHeight}`;
    stack.classList.add("is-stacked");
    cards.forEach((card, i) => fitCard(card, inners[i]));
    if (reducedMotion.matches) clearTransforms();
    place();
    schedule();
  }

  window.addEventListener("scroll", schedule, { passive: true });
  let resizeTimer = 0;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      // Phone toolbars sliding away fire resize too, but leave the layout
      // viewport (clientHeight) as it was: nothing to refit then.
      if (`${window.innerWidth}x${document.documentElement.clientHeight}` !== size) setMode();
    }, 120);
  });
  reducedMotion.addEventListener("change", setMode);

  // ---------- Sliders ----------
  const sliders = $$("[data-slider]").map((root) => {
    const track = $(".slider-track", root);
    const slides = $$(":scope > .slide", track);
    const tabs = $$('.slider-tabs [role="tab"]', root);
    const step = () => track.clientWidth + (parseFloat(getComputedStyle(track).columnGap) || 0);
    let index = 0;

    function show(i) {
      index = i;
      tabs.forEach((tab, k) => {
        tab.setAttribute("aria-selected", String(k === i));
        tab.tabIndex = k === i ? 0 : -1;
      });
      slides.forEach((slide, k) => slide.classList.toggle("is-current", k === i));
    }

    function go(i, smooth = true) {
      const target = clamp(i, 0, slides.length - 1);
      track.scrollTo({ left: target * step(), behavior: smooth && !reducedMotion.matches ? "smooth" : "instant" });
      show(target);
    }

    // Swipes and trackpad scrolls move the track directly; follow along.
    let ticking = false;
    track.addEventListener("scroll", () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const i = clamp(Math.round(track.scrollLeft / step()), 0, slides.length - 1);
        if (i !== index) show(i);
      });
    }, { passive: true });

    tabs.forEach((tab, k) => tab.addEventListener("click", () => go(k)));
    const tabList = $(".slider-tabs", root);
    if (tabList) {
      tabList.addEventListener("keydown", (event) => {
        const move = { ArrowRight: 1, ArrowLeft: -1 }[event.key];
        if (!move) return;
        event.preventDefault();
        go(index + move);
        tabs[index].focus();
      });
    }
    track.addEventListener("keydown", (event) => {
      if (event.target !== track) return;
      const move = { ArrowRight: 1, ArrowLeft: -1 }[event.key];
      if (!move) return;
      event.preventDefault();
      go(index + move);
    });
    // Keep the current slide aligned when the card changes size.
    new ResizeObserver(() => track.scrollTo({ left: index * step(), behavior: "instant" })).observe(track);

    show(0);
    return { slides, go };
  });

  // ---------- Tabs inside each project ----------
  $$("[data-tabs]").forEach((list) => {
    const tabs = $$('[role="tab"]', list);
    const panels = tabs.map((tab) => document.getElementById(tab.getAttribute("aria-controls")));

    function select(k, focus) {
      tabs.forEach((tab, j) => {
        const on = j === k;
        tab.setAttribute("aria-selected", String(on));
        tab.tabIndex = on ? 0 : -1;
        if (panels[j]) panels[j].hidden = !on;
        if (on && focus) tab.focus();
      });
    }

    tabs.forEach((tab, k) => tab.addEventListener("click", () => select(k)));
    list.addEventListener("keydown", (event) => {
      const i = tabs.indexOf(document.activeElement);
      const move = { ArrowRight: 1, ArrowLeft: -1 }[event.key];
      if (i < 0 || !move) return;
      event.preventDefault();
      select((i + move + tabs.length) % tabs.length, true);
    });
    select(Math.max(0, tabs.findIndex((tab) => tab.getAttribute("aria-selected") === "true")));
  });

  setMode();
  if (document.fonts) document.fonts.ready.then(setMode);

  // ---------- Deep links ----------
  // Scrolls to any id on the page. Ids inside a slide also switch that slider.
  function goTo(id, { smooth = true } = {}) {
    const el = id ? document.getElementById(id) : null;
    if (!el) return false;
    let target = el;
    const slide = el.closest(".slide");
    if (slide) {
      const slider = sliders.find((s) => s.slides.includes(slide));
      if (slider) slider.go(slider.slides.indexOf(slide), false);
    }
    const card = el.closest(".stack-card");
    if (card) {
      const anchor = card.previousElementSibling;
      target = anchor && anchor.classList.contains("stack-anchor") ? anchor : card;
    }
    target.scrollIntoView({ behavior: smooth && !reducedMotion.matches ? "smooth" : "instant", block: "start" });
    if (location.hash !== `#${id}`) history.replaceState(null, "", `#${id}`);
    return true;
  }

  document.addEventListener("click", (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey) return;
    const link = event.target.closest('a[href^="#"]');
    const id = link && link.getAttribute("href").slice(1);
    if (!id || id === "main") return;
    if (goTo(id)) event.preventDefault();
  });

  window.addEventListener("hashchange", () => goTo(location.hash.slice(1)));
  if (location.hash) requestAnimationFrame(() => goTo(location.hash.slice(1), { smooth: false }));

  window.DK = window.DK || {};
  window.DK.stack = { goTo };
})();
