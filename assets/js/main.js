/* Page behaviour: theme, reveal, the API console, skill evidence,
   the command palette and small helpers. Flow diagrams live in flows.js and
   the resume chat in ask.js. */
(() => {
  "use strict";

  // Tell the inline <head> script that reveal animations are handled.
  window.__revealReady = true;

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const root = document.documentElement;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const escape = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  // ---------- Theme ----------
  const themeMeta = $('meta[name="theme-color"]');

  function currentTheme() {
    if (root.dataset.theme) return root.dataset.theme;
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  }

  function syncThemeColor() {
    if (themeMeta) themeMeta.content = currentTheme() === "light" ? "#f6f1e7" : "#0e0d0b";
  }

  function toggleTheme(origin) {
    const next = currentTheme() === "dark" ? "light" : "dark";
    const apply = () => {
      root.dataset.theme = next;
      try {
        localStorage.setItem("theme", next);
      } catch (e) {
        // Storage can be unavailable (private mode); the toggle still works.
      }
      syncThemeColor();
    };
    if (!document.startViewTransition || reducedMotion.matches) return apply();
    const box = origin && origin.getBoundingClientRect();
    root.style.setProperty("--vt-x", box ? `${box.left + box.width / 2}px` : "50%");
    root.style.setProperty("--vt-y", box ? `${box.top + box.height / 2}px` : "0px");
    document.startViewTransition(apply);
  }

  const themeButton = $("#theme-toggle");
  if (themeButton) themeButton.addEventListener("click", () => toggleTheme(themeButton));
  syncThemeColor();

  // ---------- Toast + copy ----------
  let toastTimer = 0;
  function toast(message) {
    const el = $("#toast");
    if (!el) return;
    el.textContent = message;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 2200);
  }

  async function copy(text) {
    try {
      await navigator.clipboard.writeText(text);
    } catch (e) {
      const area = document.createElement("textarea");
      area.value = text;
      area.style.cssText = "position:fixed;opacity:0";
      document.body.append(area);
      area.select();
      try {
        document.execCommand("copy");
      } catch (err) {
        // Nothing else to try; the toast below still shows the text.
      }
      area.remove();
    }
    toast(`Copied: ${text}`);
  }

  $$("[data-copy]").forEach((button) => button.addEventListener("click", () => copy(button.dataset.copy)));

  // ---------- Scroll progress bar ----------
  const progress = $(".progress");
  let ticking = false;

  function onScroll() {
    ticking = false;
    const max = root.scrollHeight - window.innerHeight;
    if (progress) progress.style.setProperty("--p", max > 0 ? (window.scrollY / max).toFixed(4) : "0");
  }

  window.addEventListener("scroll", () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(onScroll);
    }
  }, { passive: true });
  onScroll();

  function scrollToTarget(selector) {
    // stack.js can reach ids inside cards and sliders.
    if (window.DK && window.DK.stack && window.DK.stack.goTo(selector.slice(1))) return;
    const target = $(selector);
    if (!target) return;
    target.scrollIntoView({ behavior: reducedMotion.matches ? "auto" : "smooth", block: "start" });
    history.replaceState(null, "", selector);
  }

  // ---------- Reveal on scroll + number count-up ----------
  function countUp(el) {
    const num = $("[data-count]", el);
    if (!num || reducedMotion.matches) return;
    const end = Number(num.dataset.count);
    const prefix = num.dataset.prefix || "";
    const suffix = num.dataset.suffix || "";
    const start = performance.now();
    const frame = (now) => {
      const t = Math.min(1, (now - start) / 1200);
      num.textContent = `${prefix}${Math.round(end * (1 - Math.pow(1 - t, 3)))}${suffix}`;
      if (t < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }

  const revealables = $$(".reveal");
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("in");
        revealObserver.unobserve(entry.target);
        countUp(entry.target);
      }
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    revealables.forEach((el) => revealObserver.observe(el));
  } else {
    revealables.forEach((el) => el.classList.add("in"));
  }

  // ---------- Pointer effect: card spotlight ----------
  if (finePointer.matches) {
    let lastCard = null;
    document.addEventListener("pointermove", (event) => {
      const card = event.target.closest && event.target.closest(".card");
      if (lastCard && lastCard !== card) {
        lastCard.style.removeProperty("--mx");
        lastCard.style.removeProperty("--my");
      }
      lastCard = card;
      if (!card) return;
      const box = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${event.clientX - box.left}px`);
      card.style.setProperty("--my", `${event.clientY - box.top}px`);
    }, { passive: true });
  }

  // ---------- API console ----------
  // Pretty-prints JSON, keeping short arrays of primitives on one line.
  function format(value, indent = "") {
    const next = `${indent}  `;
    if (Array.isArray(value)) {
      const inline = `[${value.map((v) => JSON.stringify(v)).join(", ")}]`;
      if (value.every((v) => v === null || typeof v !== "object") && inline.length + indent.length < 58) return inline;
      return `[\n${value.map((v) => next + format(v, next)).join(",\n")}\n${indent}]`;
    }
    if (value && typeof value === "object") {
      const lines = Object.keys(value).map((key) => `${next}${JSON.stringify(key)}: ${format(value[key], next)}`);
      return `{\n${lines.join(",\n")}\n${indent}}`;
    }
    return JSON.stringify(value);
  }

  function highlight(json) {
    return escape(json).replace(
      /("(?:\\.|[^"\\])*")(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g,
      (match, str, colon, literal) => {
        if (str) return colon ? `<span class="j-key">${str}</span>${colon}` : `<span class="j-str">${str}</span>`;
        if (literal) return `<span class="j-lit">${match}</span>`;
        return `<span class="j-num">${match}</span>`;
      },
    );
  }

  function initConsole() {
    const box = $("#console");
    if (!box) return;
    const tabs = $$('[role="tab"]', box);
    const cmd = $("[data-console-cmd]", box);
    const status = $("[data-console-status]", box);
    const code = $("[data-console-json]", box);
    let current = "me";
    let token = 0;

    code.innerHTML = highlight(code.textContent);

    async function typeCommand(text, my) {
      if (reducedMotion.matches) {
        cmd.textContent = text;
        return;
      }
      code.textContent = "";
      status.textContent = "";
      const caret = document.createElement("span");
      caret.className = "caret";
      for (let i = 1; i <= text.length; i++) {
        if (my !== token) return;
        cmd.textContent = text.slice(0, i);
        cmd.append(caret);
        await wait(13);
      }
      caret.remove();
    }

    async function printLines(html, my) {
      if (reducedMotion.matches) {
        code.innerHTML = html;
        return;
      }
      code.innerHTML = "";
      const lines = html.split("\n");
      for (let i = 0; i < lines.length; i++) {
        if (my !== token) return;
        code.insertAdjacentHTML("beforeend", lines[i] + (i < lines.length - 1 ? "\n" : ""));
        await wait(16);
      }
    }

    async function load(name) {
      const my = ++token;
      current = name;
      const path = `api/${name}.json`;
      await typeCommand(`curl -s dilipkashyap.in/${path}`, my);
      if (my !== token) return;
      status.innerHTML = '<span class="c-warn">…</span> requesting';

      const url = new URL(path, location.href).href;
      let response;
      let body;
      let elapsed;
      try {
        const started = performance.now();
        response = await fetch(url);
        body = await response.text();
        elapsed = performance.now() - started;
      } catch (err) {
        if (my !== token) return;
        status.innerHTML = '<span class="c-err">network error</span> · open the site over http(s) to fetch';
        return;
      }
      if (my !== token) return;

      let data;
      try {
        data = JSON.parse(body);
      } catch (err) {
        status.innerHTML = `<span class="c-err">${response.status}</span> · response was not JSON`;
        return;
      }

      // Resource Timing reports transferSize 0 when the browser cache served it.
      await new Promise(requestAnimationFrame);
      const entry = performance.getEntriesByName(url).pop();
      let cache = "";
      if (entry && typeof entry.transferSize === "number" && entry.decodedBodySize > 0) {
        cache = entry.transferSize === 0 ? ' · browser cache <span class="c-ok">HIT</span>' : " · browser cache MISS";
      }
      const ok = response.ok ? "c-ok" : "c-err";
      status.innerHTML = `<span class="${ok}">${response.status} ${response.ok ? "OK" : escape(response.statusText)}</span> · ${Math.max(1, Math.round(elapsed))} ms${cache}`;
      await printLines(highlight(format(data)), my);
    }

    function select(name, focus) {
      tabs.forEach((tab) => {
        const on = tab.dataset.endpoint === name;
        tab.setAttribute("aria-selected", String(on));
        tab.tabIndex = on ? 0 : -1;
        if (on && focus) tab.focus();
      });
      load(name);
    }

    tabs.forEach((tab) => tab.addEventListener("click", () => select(tab.dataset.endpoint)));
    $('[role="tablist"]', box).addEventListener("keydown", (event) => {
      const i = tabs.findIndex((tab) => tab.getAttribute("aria-selected") === "true");
      const keys = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 };
      if (!(event.key in keys)) return;
      event.preventDefault();
      select(tabs[(keys[event.key] + tabs.length) % tabs.length].dataset.endpoint, true);
    });
    $("[data-copy-curl]", box).addEventListener("click", () => copy(`curl -s https://dilipkashyap.in/api/${current}.json`));

    // Run the first request when the console scrolls into view.
    if ("IntersectionObserver" in window) {
      const seen = new IntersectionObserver((entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        seen.disconnect();
        load("me");
      }, { threshold: 0.5 });
      seen.observe(box);
    } else {
      load("me");
    }
  }

  initConsole();

  // ---------- Skills: where each one was used ----------
  const SKILLS = {
    python: { name: "Python", years: "2 yrs", uses: [["Stryv.ai", "#case-rag", "AI automation module in FastAPI"], ["Atlas", "#case-atlas", "multi-tenant FastAPI backend"], ["Document extraction prototype", "#also", "Textract + Bedrock"]] },
    go: { name: "Go", years: "1 yr", uses: [["Jugaad Link", "#case-jugaad", "Gin + GORM API with Redis caching"], ["ContriHub", "#case-contrihub", "Gin backend with Redis rate limiting"]] },
    typescript: { name: "TypeScript", uses: [["Jugaad Link", "#case-jugaad", "Next.js + React Query dashboard"], ["Atlas", "#case-atlas", "Next.js 15 dashboard with a token-refreshing API client"]] },
    javascript: { name: "JavaScript", uses: [["NexGen Elit", "#exp-nexgen", "Node.js/Express backends"], ["ContriHub", "#case-contrihub", "Next.js frontend"]] },
    sql: { name: "SQL", uses: [["Stryv.ai", "#exp-stryv", "PostgreSQL with pgvector"], ["Jugaad Link, Atlas, ContriHub", "#work", "PostgreSQL in every project"]] },
    cpp: { name: "C++", uses: [["DSA practice", "https://github.com/Dilip-Kashyp/neetcode-submissions", "NeetCode and LeetCode submissions"]] },
    fastapi: { name: "FastAPI", years: "1.5 yrs", uses: [["Stryv.ai", "#case-rag", "AI automation module"], ["Atlas", "#case-atlas", "OAuth 2.0, webhooks, async SQLAlchemy"]] },
    nodejs: { name: "Node.js", years: "2 yrs", uses: [["NexGen Elit", "#exp-nexgen", "virtual fitness platform backend"]] },
    express: { name: "Express", uses: [["NexGen Elit", "#exp-nexgen", "REST APIs for a virtual fitness platform"]] },
    gin: { name: "Gin", uses: [["Jugaad Link", "#case-jugaad", "redirect and analytics API"], ["ContriHub", "#case-contrihub", "versioned /api/v1 with AI endpoints"]] },
    gorm: { name: "GORM", uses: [["Jugaad Link", "#case-jugaad", "URL, Click, User and GuestSession models"], ["ContriHub", "#case-contrihub", "auto-migrations on PostgreSQL"]] },
    sqlalchemy: { name: "SQLAlchemy", uses: [["Atlas", "#case-atlas", "async engine with Alembic migrations"]] },
    rest: { name: "REST APIs", uses: [["Jugaad Link", "#case-jugaad", "versioned /api/v1 routes"], ["ContriHub", "#case-contrihub", "rate-limited AI endpoints"], ["Atlas", "#case-atlas", "v1 auth, integrations and webhooks"]] },
    rag: { name: "RAG", years: "1.5 yrs with LLMs", uses: [["Stryv.ai", "#case-rag", "grounded retrieval for compliance"], ["This site", "#ask", "client-side retrieval over my resume"]] },
    hybrid: { name: "Hybrid search", uses: [["Stryv.ai", "#case-rag", "vector + keyword retrieval"], ["This site", "#ask", "BM25 + trigram fusion"]] },
    rerank: { name: "Reranking", uses: [["Stryv.ai", "#case-rag", "cross-encoder reranking before generation"]] },
    pgvector: { name: "pgvector", uses: [["Stryv.ai", "#case-rag", "vector search inside PostgreSQL"]] },
    gemini: { name: "Gemini", uses: [["Atlas", "#case-atlas", "function calling + tool dispatch"]] },
    groq: { name: "Groq", uses: [["ContriHub", "#case-contrihub", "repo explanations, roadmaps, project matching"]] },
    bedrock: { name: "AWS Bedrock", uses: [["Document extraction prototype", "#also", "LLM field extraction"]] },
    textract: { name: "AWS Textract", uses: [["Document extraction prototype", "#also", "OCR"]] },
    postgresql: { name: "PostgreSQL", years: "2 yrs", uses: [["Stryv.ai", "#case-rag", "pgvector for retrieval"], ["Jugaad Link", "#case-jugaad", "links and click analytics"], ["Atlas", "#case-atlas", "tenants and encrypted tokens"], ["ContriHub", "#case-contrihub", "AI chat history"]] },
    redis: { name: "Redis", uses: [["Jugaad Link", "#case-jugaad", "caches hot redirects"], ["ContriHub", "#case-contrihub", "rate limiting + GitHub API cache"], ["Atlas", "#case-atlas", "part of the Compose stack"]] },
    aws: { name: "AWS", years: "1.5 yrs", uses: [["Stryv.ai", "#exp-stryv", "document-verification pipeline, 160K docs a month"], ["Document extraction prototype", "#also", "serverless Textract + Bedrock"]] },
    docker: { name: "Docker", years: "1.5 yrs", uses: [["Jugaad Link", "#case-jugaad", "multi-stage build + Compose (API, PostgreSQL, Redis)"], ["Atlas", "#case-atlas", "Compose for API, dashboard, PostgreSQL and Redis"]] },
    caching: { name: "Caching", uses: [["Jugaad Link", "#case-jugaad", "only plain links are cached"], ["ContriHub", "#case-contrihub", "GitHub responses cached in Redis"]] },
    ratelimit: { name: "Rate limiting", uses: [["ContriHub", "#case-contrihub", "Redis limits by IP and token"], ["Stryv.ai", "#exp-stryv", "OTP resend and attempt limits"]] },
    auth: { name: "Auth", uses: [["Stryv.ai", "#exp-stryv", "JWT sessions + OTP recovery"], ["Jugaad Link", "#case-jugaad", "JWT + bcrypt-protected links"], ["Atlas", "#case-atlas", "OAuth 2.0 + rotating refresh tokens"]] },
    tenancy: { name: "Multi-tenancy", uses: [["Atlas", "#case-atlas", "per-tenant webhooks and encrypted tokens"]] },
    async: { name: "Async pipelines", uses: [["Stryv.ai", "#case-rag", "async processing with human approval"], ["Jugaad Link", "#case-jugaad", "clicks recorded off the redirect path"]] },
    payments: { name: "Payments", uses: [["NexGen Elit", "#exp-nexgen", "Razorpay payments and subscriptions"]] },
    nextjs: { name: "React / Next.js", years: "2 yrs", uses: [["Jugaad Link", "#case-jugaad", "dashboard with analytics"], ["Atlas", "#case-atlas", "Next.js 15 dashboard"], ["ContriHub", "#case-contrihub", "discovery UI"]] },
    tailwind: { name: "Tailwind CSS", uses: [["ContriHub", "#case-contrihub", "frontend styling"]] },
  };

  function renderSkill(skill) {
    const items = skill.uses
      .map(([label, href, note]) => {
        const external = /^https?:/.test(href) ? ' target="_blank" rel="noopener"' : "";
        return `<li><a href="${href}"${external}>${escape(label)}</a>: ${escape(note)}</li>`;
      })
      .join("");
    const years = skill.years ? `<span>${escape(skill.years)}</span>` : "";
    return `<p class="skill-detail-title">${escape(skill.name)}${years}</p><ul>${items}</ul>`;
  }

  const chips = $$(".chip[data-skill]");
  const skillDetail = $("#skill-detail");
  const skillPanel = $(".skill-panel");
  const panelHome = skillPanel && skillPanel.parentElement;
  const phone = window.matchMedia("(max-width: 720px)");
  chips.forEach((chip) => chip.setAttribute("aria-controls", "skill-detail"));

  // On phones the groups stack in one column, so show the panel right under
  // the tapped group instead of at the bottom of the list.
  function placePanel(chip) {
    if (!skillPanel) return;
    if (phone.matches) chip.closest(".skill-group").after(skillPanel);
    else if (skillPanel.parentElement !== panelHome) panelHome.append(skillPanel);
  }

  phone.addEventListener("change", () => {
    const current = chips.find((c) => c.getAttribute("aria-pressed") === "true");
    if (current) placePanel(current);
  });

  function showSkill(chip) {
    const skill = SKILLS[chip.dataset.skill];
    if (!skill || !skillDetail) return;
    placePanel(chip);
    chips.forEach((c) => c.setAttribute("aria-pressed", String(c === chip)));
    skillDetail.innerHTML = renderSkill(skill);
    // Replay the fade-in for each newly picked skill.
    skillDetail.style.animation = "none";
    void skillDetail.offsetWidth;
    skillDetail.style.animation = "";
  }

  chips.forEach((chip) => chip.addEventListener("click", () => showSkill(chip)));
  if (chips[0]) showSkill(chips[0]);

  // ---------- Command palette ----------
  function initPalette() {
    const dialog = $("#palette");
    if (!dialog || typeof dialog.showModal !== "function") {
      $$("[data-open-palette]").forEach((b) => b.addEventListener("click", () => scrollToTarget("#experience")));
      return;
    }
    const box = $(".palette-box", dialog);
    const input = $("#palette-input");
    const list = $("#palette-list");
    const go = (selector) => () => scrollToTarget(selector);
    const open = (url) => () => window.open(url, "_blank", "noopener");

    const COMMANDS = [
      { group: "Jump to", icon: "01", label: "Experience", run: go("#experience") },
      { group: "Jump to", icon: "02", label: "Selected work", keys: "projects case studies", run: go("#work") },
      { group: "Jump to", icon: "03", label: "Skills", keys: "stack tech", run: go("#skills") },
      { group: "Jump to", icon: "04", label: "Interview my resume", keys: "ask chat bot questions", run: go("#ask") },
      { group: "Jump to", icon: "05", label: "About", keys: "education awards certifications", run: go("#about") },
      { group: "Jump to", icon: "06", label: "Contact", keys: "email hire", run: go("#contact") },
      { group: "Case studies", icon: "→", label: "Grounded retrieval at Stryv.ai", keys: "rag ai pipeline", run: go("#case-rag") },
      { group: "Case studies", icon: "→", label: "Jugaad Link", keys: "url shortener go redis", run: go("#case-jugaad") },
      { group: "Case studies", icon: "→", label: "Atlas", keys: "slack github gemini fastapi", run: go("#case-atlas") },
      { group: "Case studies", icon: "→", label: "ContriHub", keys: "open source groq go", run: go("#case-contrihub") },
      { group: "Actions", icon: "⧉", label: "Copy email address", hint: "info@dilipkashyap.in", run: () => copy("info@dilipkashyap.in") },
      { group: "Actions", icon: "@", label: "Write me an email", keys: "mail contact", run: () => { window.location.href = "mailto:info@dilipkashyap.in"; } },
      { group: "Actions", icon: "◐", label: "Toggle light / dark theme", keys: "dark mode light mode", run: () => toggleTheme(themeButton) },
      { group: "Links", icon: "↗", label: "GitHub", hint: "Dilip-Kashyp", run: open("https://github.com/Dilip-Kashyp") },
      { group: "Links", icon: "↗", label: "LinkedIn", hint: "in/dilip-kashyap", run: open("https://www.linkedin.com/in/dilip-kashyap/") },
      { group: "Links", icon: "↗", label: "Jugaad Link (live)", hint: "jugaadlink.vercel.app", run: open("https://jugaadlink.vercel.app") },
      { group: "Links", icon: "↗", label: "ContriHub (live)", hint: "contri-hub.vercel.app", run: open("https://contri-hub.vercel.app") },
    ];

    let results = [];
    let active = 0;

    function rank(command, query) {
      const label = command.label.toLowerCase();
      const haystack = `${label} ${command.keys || ""} ${command.group}`.toLowerCase();
      if (label.startsWith(query)) return 4;
      if (label.split(/[\s/]+/).some((word) => word.startsWith(query))) return 3;
      if (haystack.includes(query)) return 2;
      const words = query.split(/\s+/);
      if (words.length > 1 && words.every((w) => haystack.includes(w))) return 1.5;
      let i = 0;
      for (const ch of label) if (ch === query[i]) i++;
      return i === query.length ? 1 : 0;
    }

    function render() {
      const query = input.value.trim().toLowerCase();
      if (!query) {
        results = COMMANDS.slice();
      } else {
        results = COMMANDS.map((c) => [c, rank(c, query)])
          .filter(([, score]) => score > 0)
          .sort((a, b) => b[1] - a[1])
          .map(([c]) => c);
        const ask = {
          group: "Ask",
          icon: "✦",
          label: `Ask my resume: “${input.value.trim()}”`,
          run: () => window.DK && window.DK.chat && window.DK.chat.ask(input.value.trim()),
        };
        results.push(ask);
      }
      active = 0;
      let html = "";
      let lastGroup = "";
      results.forEach((c, i) => {
        if (!query && c.group !== lastGroup) {
          html += `<li class="palette-group" role="presentation">${escape(c.group)}</li>`;
          lastGroup = c.group;
        }
        const hint = c.hint ? `<span class="p-hint">${escape(c.hint)}</span>` : "";
        html += `<li class="palette-item" role="option" id="palette-opt-${i}" data-index="${i}" aria-selected="${i === 0}"><span class="p-icon" aria-hidden="true">${escape(c.icon)}</span><span class="p-label">${escape(c.label)}</span>${hint}</li>`;
      });
      list.innerHTML = html;
      input.setAttribute("aria-activedescendant", results.length ? "palette-opt-0" : "");
    }

    function setActive(i) {
      if (!results.length) return;
      active = (i + results.length) % results.length;
      $$(".palette-item", list).forEach((item) => {
        item.setAttribute("aria-selected", String(Number(item.dataset.index) === active));
      });
      const item = $(`#palette-opt-${active}`);
      input.setAttribute("aria-activedescendant", item.id);
      item.scrollIntoView({ block: "nearest" });
    }

    function runActive() {
      const command = results[active];
      if (!command) return;
      dialog.close();
      command.run();
    }

    function openPalette() {
      input.value = "";
      render();
      // Skip the on-screen keyboard on touch devices; they mostly tap items.
      box.toggleAttribute("autofocus", !finePointer.matches);
      input.toggleAttribute("autofocus", finePointer.matches);
      dialog.showModal();
    }

    input.addEventListener("input", render);
    // Listen on the dialog, not the input: on touch devices focus starts on
    // the box, and a hardware keyboard should still work there.
    dialog.addEventListener("keydown", (event) => {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setActive(active + 1);
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        setActive(active - 1);
      } else if (event.key === "Enter") {
        event.preventDefault();
        runActive();
      } else if (event.key.length === 1 && !event.metaKey && !event.ctrlKey && !event.altKey && document.activeElement !== input) {
        input.focus();
      }
    });
    list.addEventListener("mousemove", (event) => {
      const item = event.target.closest(".palette-item");
      if (item && Number(item.dataset.index) !== active) setActive(Number(item.dataset.index));
    });
    list.addEventListener("click", (event) => {
      const item = event.target.closest(".palette-item");
      if (!item) return;
      active = Number(item.dataset.index);
      runActive();
    });
    // Clicks on the backdrop land on the <dialog> itself.
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) dialog.close();
    });

    $$("[data-open-palette]").forEach((button) => button.addEventListener("click", openPalette));
    document.addEventListener("keydown", (event) => {
      const typing = event.target.closest && event.target.closest("input, textarea, [contenteditable='true']");
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (dialog.open) dialog.close();
        else openPalette();
      } else if (event.key === "/" && !typing && !dialog.open) {
        event.preventDefault();
        openPalette();
      }
    });
  }

  initPalette();

  // ---------- Small details ----------
  const isMac = /Mac|iPhone|iPad|iPod/.test(navigator.platform || navigator.userAgent);
  $$("[data-mod-key]").forEach((el) => {
    el.textContent = isMac ? "⌘K" : "Ctrl K";
  });

  $$("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  const clock = $("[data-clock]");
  if (clock) {
    const time = new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", hour: "numeric", minute: "2-digit", hour12: true });
    const tick = () => {
      clock.textContent = `${time.format(new Date()).toUpperCase()} IST`;
    };
    tick();
    setInterval(tick, 30000);
  }
})();
