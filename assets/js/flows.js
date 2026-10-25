/* Request-flow diagrams for the case studies.
   Each flow is an SVG of nodes and edges. A scenario sends packets along the
   edges step by step while a log narrates what happens. Layout switches to a
   vertical arrangement on narrow screens so labels stay readable. */
(() => {
  "use strict";

  const NS = "http://www.w3.org/2000/svg";
  const NODE_H = 50;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  // Positions are [x as a fraction of the width, y in px].
  const FLOWS = {
    rag: {
      label: "Grounded retrieval pipeline",
      minWide: 820,
      nodes: {
        q: { label: "Question", sub: "from a reviewer", short: "question" },
        kw: { label: "Keyword search", sub: "exact terms", short: "keyword" },
        vec: { label: "Vector search", sub: "pgvector", short: "vector" },
        rerank: { label: "Reranker", sub: "cross-encoder", short: "rerank" },
        llm: { label: "LLM", sub: "answer + quote", short: "llm" },
        check: { label: "Quote check", sub: "verbatim match", short: "check" },
        human: { label: "Human approval", sub: "async queue", short: "review" },
        flag: { label: "Flagged", sub: "not accepted", short: "flagged" },
      },
      edges: [
        ["q", "kw"], ["q", "vec"], ["kw", "rerank"], ["vec", "rerank"],
        ["rerank", "llm"], ["llm", "check"], ["check", "human"], ["check", "flag"],
      ],
      layout: {
        wide: {
          h: 250,
          pos: { q: [0, 125], kw: [0.2, 65], vec: [0.2, 185], rerank: [0.4, 125], llm: [0.6, 125], check: [0.8, 125], human: [1, 65], flag: [1, 185] },
        },
        narrow: {
          h: 530,
          pos: { q: [0.5, 40], kw: [0.25, 130], vec: [0.75, 130], rerank: [0.5, 220], llm: [0.5, 310], check: [0.5, 400], human: [0.25, 490], flag: [0.75, 490] },
        },
      },
      scenarios: [
        {
          id: "grounded",
          label: "Grounded answer",
          steps: [
            { from: "q", to: "kw", msg: "“Is customer data encrypted at rest?”" },
            { from: "q", to: "vec", msg: "same question, embedded", with: true },
            { from: "kw", to: "rerank", msg: "passages with the exact policy terms" },
            { from: "vec", to: "rerank", msg: "passages that paraphrase them", with: true },
            { at: "rerank", msg: "cross-encoder scores each (question, passage) pair", mark: "best first" },
            { from: "rerank", to: "llm", msg: "top passages as context" },
            { from: "llm", to: "check", msg: "answer + supporting quote" },
            { at: "check", tone: "ok", msg: "quote appears verbatim in the source ✓", mark: "verbatim ✓" },
            { from: "check", to: "human", tone: "ok", msg: "queued for reviewer approval, with citation", mark: "awaiting review" },
          ],
        },
        {
          id: "unsupported",
          label: "Unsupported claim",
          steps: [
            { from: "q", to: "kw", msg: "“Do they run annual penetration tests?”" },
            { from: "q", to: "vec", msg: "same question, embedded", with: true },
            { from: "kw", to: "rerank", msg: "no passage mentions pen tests" },
            { from: "vec", to: "rerank", msg: "loosely related security passages", with: true },
            { at: "rerank", msg: "ranks what it has: nothing on topic" },
            { from: "rerank", to: "llm", msg: "top passages as context" },
            { from: "llm", to: "check", msg: "a confident answer with a paraphrased “quote”" },
            { at: "check", tone: "err", msg: "quote not found in the source ✗", mark: "no match ✗" },
            { from: "check", to: "flag", tone: "err", msg: "flagged instead of accepted", mark: "needs evidence" },
          ],
        },
      ],
    },

    jugaad: {
      label: "Jugaad Link redirect path",
      minWide: 560,
      maxWidth: 840,
      nodes: {
        user: { label: "Browser", sub: "opens short link", short: "browser" },
        api: { label: "Gin API", sub: "GET /:code", short: "api" },
        redis: { label: "Redis", sub: "hot links", short: "redis" },
        pg: { label: "PostgreSQL", sub: "links · clicks", short: "postgres" },
      },
      edges: [["user", "api"], ["api", "redis"], ["api", "pg"]],
      layout: {
        wide: { h: 230, pos: { user: [0, 115], api: [0.46, 115], redis: [1, 55], pg: [1, 175] } },
        narrow: { h: 320, pos: { user: [0.5, 40], api: [0.5, 150], redis: [0.25, 270], pg: [0.75, 270] } },
      },
      scenarios: [
        {
          id: "miss",
          label: "First visit",
          steps: [
            { from: "user", to: "api", msg: "GET /dk-gh" },
            { from: "api", to: "redis", msg: "look up dk-gh" },
            { from: "redis", to: "api", tone: "warn", msg: "cache miss", mark: ["redis", "MISS"] },
            { from: "api", to: "pg", msg: "load the link by short code" },
            { from: "pg", to: "api", msg: "active · no password · no expiry · no click limit" },
            { from: "api", to: "user", tone: "ok", msg: "302 → github.com/Dilip-Kashyp", mark: ["user", "302 Found"] },
            { from: "api", to: "redis", msg: "plain link, safe to cache: SET", with: true },
            { from: "api", to: "pg", tone: "muted", msg: "record click async (device, browser, country)", with: true },
          ],
        },
        {
          id: "hit",
          label: "Cached visit",
          steps: [
            { from: "user", to: "api", msg: "GET /dk-gh" },
            { from: "api", to: "redis", msg: "look up dk-gh" },
            { from: "redis", to: "api", tone: "ok", msg: "cache hit: no database round-trip", mark: ["redis", "HIT"] },
            { from: "api", to: "user", tone: "ok", msg: "302 → github.com/Dilip-Kashyp", mark: ["user", "302 Found"] },
            { from: "api", to: "pg", tone: "muted", msg: "record click async", with: true },
          ],
        },
        {
          id: "password",
          label: "Password link",
          steps: [
            { from: "user", to: "api", msg: "GET /team-docs" },
            { from: "api", to: "redis", msg: "look up team-docs" },
            { from: "redis", to: "api", tone: "warn", msg: "miss: protected links are never cached", mark: ["redis", "MISS"] },
            { from: "api", to: "pg", msg: "load the link by short code" },
            { from: "pg", to: "api", msg: "password set (bcrypt hash)" },
            { from: "api", to: "user", tone: "warn", msg: "redirect → /password/team-docs", mark: ["user", "unlock page"] },
          ],
        },
        {
          id: "expired",
          label: "Expired link",
          steps: [
            { from: "user", to: "api", msg: "GET /sale-24" },
            { from: "api", to: "redis", msg: "look up sale-24" },
            { from: "redis", to: "api", tone: "warn", msg: "miss: links with an expiry are never cached", mark: ["redis", "MISS"] },
            { from: "api", to: "pg", msg: "load the link by short code" },
            { from: "pg", to: "api", tone: "err", msg: "expires_at is in the past" },
            { from: "api", to: "user", tone: "err", msg: "redirect → /link-disabled?reason=expired", mark: ["user", "link expired"] },
          ],
        },
      ],
    },

    atlas: {
      label: "Atlas event and auth flows",
      minWide: 640,
      maxWidth: 940,
      nodes: {
        slack: { label: "Slack", sub: "@atlas mention", short: "slack" },
        web: { label: "Dashboard", sub: "Next.js 15", short: "dashboard" },
        api: { label: "FastAPI", sub: "modular monolith", short: "api" },
        llm: { label: "Gemini", sub: "function calling", short: "gemini" },
        pg: { label: "PostgreSQL", sub: "tenants · tokens", short: "postgres" },
        gh: { label: "GitHub tool", sub: "tool dispatcher", short: "github" },
      },
      edges: [["slack", "api"], ["web", "api"], ["api", "pg"], ["api", "llm"], ["llm", "gh"]],
      layout: {
        wide: { h: 250, pos: { slack: [0, 65], web: [0, 185], api: [0.36, 125], llm: [0.68, 65], pg: [0.68, 185], gh: [1, 65] } },
        narrow: { h: 420, pos: { slack: [0.25, 40], web: [0.75, 40], api: [0.5, 150], llm: [0.25, 265], pg: [0.75, 265], gh: [0.25, 380] } },
      },
      scenarios: [
        {
          id: "mention",
          label: "Slack mention",
          steps: [
            { from: "slack", to: "api", msg: "app_mention event → /slack/events" },
            { from: "api", to: "pg", msg: "resolve the workspace by Slack team ID" },
            { from: "pg", to: "api", msg: "tenant's encrypted bot token, decrypted in memory", mark: ["pg", "tenant found"] },
            { from: "api", to: "llm", msg: "message + conversation context" },
            { at: "llm", msg: "model decides it needs a GitHub tool call", mark: "tool_call" },
            { from: "llm", to: "gh", msg: "dispatch the tool call" },
            { from: "gh", to: "llm", tone: "ok", msg: "tool result" },
            { from: "llm", to: "api", msg: "final answer" },
            { from: "api", to: "slack", tone: "ok", msg: "reply posted in the thread", mark: ["slack", "replied"] },
          ],
        },
        {
          id: "refresh",
          label: "Token refresh",
          steps: [
            { from: "web", to: "api", msg: "API call with an expired access token" },
            { from: "api", to: "web", tone: "warn", msg: "401 Unauthorized", mark: ["web", "401"] },
            { from: "web", to: "api", msg: "POST /api/v1/auth/refresh (HTTP-only cookie)" },
            { from: "api", to: "pg", msg: "verify the refresh-token hash" },
            { from: "pg", to: "api", msg: "valid: revoke the old token, store the rotated one", mark: ["pg", "rotated"] },
            { from: "api", to: "web", tone: "ok", msg: "new access token + rotated refresh cookie" },
            { from: "web", to: "api", msg: "retry the original request" },
            { from: "api", to: "web", tone: "ok", msg: "200 OK", mark: ["web", "200 OK"] },
          ],
        },
      ],
    },

    contrihub: {
      label: "ContriHub AI request path",
      minWide: 600,
      maxWidth: 900,
      nodes: {
        user: { label: "Next.js app", sub: "Explain repo", short: "client" },
        api: { label: "Go API", sub: "Gin · /api/v1/ai", short: "api" },
        redis: { label: "Redis", sub: "limits · cache", short: "redis" },
        gh: { label: "GitHub API", sub: "repo data", short: "github" },
        llm: { label: "Groq LLM", sub: "explanation", short: "groq" },
      },
      edges: [["user", "api"], ["api", "redis"], ["api", "gh"], ["api", "llm"]],
      layout: {
        wide: { h: 260, pos: { user: [0, 130], api: [0.42, 130], redis: [1, 45], gh: [1, 130], llm: [1, 215] } },
        narrow: { h: 410, pos: { user: [0.5, 40], api: [0.5, 150], redis: [0.25, 260], gh: [0.75, 260], llm: [0.5, 370] } },
      },
      scenarios: [
        {
          id: "cold",
          label: "Explain a repo",
          steps: [
            { from: "user", to: "api", msg: "POST /api/v1/ai/explain" },
            { from: "api", to: "redis", msg: "rate-limit check (IP + token)" },
            { from: "redis", to: "api", tone: "ok", msg: "under the limit", mark: ["redis", "allowed"] },
            { from: "api", to: "redis", msg: "repo data cached?" },
            { from: "redis", to: "api", tone: "warn", msg: "cache miss", mark: ["redis", "MISS"] },
            { from: "api", to: "gh", msg: "fetch repo data" },
            { from: "gh", to: "api", msg: "repo data" },
            { from: "api", to: "redis", tone: "muted", msg: "cache it for the next request" },
            { from: "api", to: "llm", msg: "prompt with repo context" },
            { from: "llm", to: "api", msg: "plain-English explanation" },
            { from: "api", to: "user", tone: "ok", msg: "200 OK", mark: ["user", "200 OK"] },
          ],
        },
        {
          id: "warm",
          label: "Cached repo",
          steps: [
            { from: "user", to: "api", msg: "POST /api/v1/ai/explain" },
            { from: "api", to: "redis", msg: "rate-limit check (IP + token)" },
            { from: "redis", to: "api", tone: "ok", msg: "under the limit" },
            { from: "api", to: "redis", msg: "repo data cached?" },
            { from: "redis", to: "api", tone: "ok", msg: "cache hit: no GitHub API call", mark: ["redis", "HIT"] },
            { from: "api", to: "llm", msg: "prompt with repo context" },
            { from: "llm", to: "api", msg: "plain-English explanation" },
            { from: "api", to: "user", tone: "ok", msg: "200 OK", mark: ["user", "200 OK"] },
          ],
        },
        {
          id: "burst",
          label: "Request burst",
          steps: [
            { from: "user", to: "api", msg: "POST /api/v1/ai/explain (again, and again…)" },
            { from: "api", to: "redis", msg: "rate-limit check (IP + token)" },
            { from: "redis", to: "api", tone: "err", msg: "limit exceeded", mark: ["redis", "limited"] },
            { from: "api", to: "user", tone: "err", msg: "429 Too Many Requests: LLM spend and GitHub quota protected", mark: ["user", "429"] },
          ],
        },
      ],
    },
  };

  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  function svg(tag, attrs) {
    const el = document.createElementNS(NS, tag);
    for (const key in attrs) el.setAttribute(key, attrs[key]);
    return el;
  }

  // Bezier from the border of node a to the border of node b.
  function edgePath(a, b, w, mode) {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const horizontal = mode === "wide" ? Math.abs(dx) > 1 : Math.abs(dy) < 1;
    if (horizontal) {
      const sx = a.x + (Math.sign(dx) * w) / 2;
      const ex = b.x - (Math.sign(dx) * w) / 2;
      const mx = (sx + ex) / 2;
      return `M${sx} ${a.y} C${mx} ${a.y} ${mx} ${b.y} ${ex} ${b.y}`;
    }
    const sy = a.y + (Math.sign(dy) * NODE_H) / 2;
    const ey = b.y - (Math.sign(dy) * NODE_H) / 2;
    const my = (sy + ey) / 2;
    return `M${a.x} ${sy} C${a.x} ${my} ${b.x} ${my} ${b.x} ${ey}`;
  }

  function createFlow(root, def) {
    const stage = root.querySelector(".flow-stage");
    const log = root.querySelector(".flow-log");
    const bar = root.querySelector(".flow-scenarios");
    let width = 0;
    let runToken = 0;
    let nodes = {};
    let edges = {};
    let packets = null;
    let played = false;

    const buttons = def.scenarios.map((scenario) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "pill";
      button.setAttribute("aria-pressed", "false");
      button.innerHTML = '<svg class="i" aria-hidden="true"><use href="#i-play" /></svg>';
      button.append(scenario.label);
      button.addEventListener("click", () => play(scenario.id));
      bar.append(button);
      return button;
    });

    function render() {
      const W = Math.round(stage.clientWidth) || 600;
      width = W;
      const mode = W >= def.minWide ? "wide" : "narrow";
      const layout = def.layout[mode];
      const nodeW = mode === "wide" ? 124 : Math.min(140, (W - 36) / 2);
      const pad = nodeW / 2 + 12;
      const span = Math.min(W, def.maxWidth || W);
      const left = (W - span) / 2;

      const pos = {};
      for (const id in layout.pos) {
        const [fx, y] = layout.pos[id];
        const x = mode === "wide" ? left + pad + fx * (span - 2 * pad) : clamp(fx * W, pad, W - pad);
        pos[id] = { x, y };
      }

      const root = svg("svg", { viewBox: `0 0 ${W} ${layout.h}`, width: W, height: layout.h, role: "img", "aria-label": `${def.label} diagram` });
      const gEdges = svg("g", {});
      const gNodes = svg("g", {});
      packets = svg("g", {});

      edges = {};
      for (const [a, b] of def.edges) {
        const path = svg("path", { class: "flow-edge", d: edgePath(pos[a], pos[b], nodeW, mode) });
        edges[`${a}>${b}`] = path;
        gEdges.append(path);
      }

      nodes = {};
      for (const id in def.nodes) {
        const node = def.nodes[id];
        const p = pos[id];
        const g = svg("g", { class: "flow-node", transform: `translate(${p.x - nodeW / 2} ${p.y - NODE_H / 2})` });
        const label = svg("text", { x: nodeW / 2, y: 21, "text-anchor": "middle", class: "n-label" });
        label.textContent = node.label;
        const sub = svg("text", { x: nodeW / 2, y: 37, "text-anchor": "middle", class: "n-sub" });
        sub.textContent = node.sub;
        g.append(svg("rect", { width: nodeW, height: NODE_H, rx: 12 }), label, sub);
        nodes[id] = { g, sub, base: node.sub };
        gNodes.append(g);
      }

      root.append(gEdges, gNodes, packets);
      stage.replaceChildren(root);
    }

    function resetNodes() {
      for (const id in nodes) {
        nodes[id].sub.textContent = nodes[id].base;
        nodes[id].g.setAttribute("class", "flow-node");
      }
    }

    function activate(id) {
      for (const key in nodes) nodes[key].g.classList.remove("is-active");
      if (nodes[id]) nodes[id].g.classList.add("is-active");
    }

    function mark(id, text, tone) {
      const node = nodes[id];
      if (!node) return;
      node.sub.textContent = text;
      node.g.classList.remove("tone-ok", "tone-warn", "tone-err");
      node.g.classList.add("is-marked");
      if (tone && tone !== "muted") node.g.classList.add(`tone-${tone}`);
    }

    function writeLog(n, route, msg, tone) {
      const li = document.createElement("li");
      if (tone) li.className = `tone-${tone}`;
      const num = document.createElement("span");
      num.className = "log-n";
      num.textContent = String(n).padStart(2, "0");
      const where = document.createElement("span");
      where.className = "log-route";
      where.textContent = route;
      const what = document.createElement("span");
      what.className = "log-msg";
      what.textContent = msg;
      li.append(num, where, what);
      log.append(li);
      log.scrollTop = log.scrollHeight;
    }

    function emptyLog() {
      log.innerHTML = '<li class="is-empty">Pick a scenario to replay the request.</li>';
    }

    function travel(from, to, tone, token) {
      let path = edges[`${from}>${to}`];
      let reverse = false;
      if (!path) {
        path = edges[`${to}>${from}`];
        reverse = true;
      }
      if (!path) return Promise.resolve();

      const length = path.getTotalLength();
      const duration = clamp(length * 2.6, 420, 950);
      const toneClass = tone === "ok" || tone === "err" ? ` tone-${tone}` : "";
      const halo = svg("circle", { r: 9, class: `flow-packet halo${toneClass}` });
      const dot = svg("circle", { r: 4.5, class: `flow-packet${toneClass}` });
      packets.append(halo, dot);
      path.classList.add("is-active");

      return new Promise((resolve) => {
        const start = performance.now();
        const done = () => {
          halo.remove();
          dot.remove();
          path.classList.remove("is-active");
          resolve();
        };
        const frame = (now) => {
          if (token !== runToken || !dot.isConnected) return done();
          const t = Math.min(1, (now - start) / duration);
          const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
          const point = path.getPointAtLength((reverse ? 1 - eased : eased) * length);
          for (const c of [halo, dot]) {
            c.setAttribute("cx", point.x);
            c.setAttribute("cy", point.y);
          }
          if (t < 1) requestAnimationFrame(frame);
          else done();
        };
        requestAnimationFrame(frame);
      });
    }

    async function runStep(step, n, token) {
      if (token !== runToken) return;
      const still = reducedMotion.matches;
      if (step.at) {
        writeLog(n, def.nodes[step.at].short, step.msg, step.tone);
        activate(step.at);
        if (step.mark) mark(step.at, step.mark, step.tone);
        await wait(still ? 0 : 650);
        return;
      }
      writeLog(n, `${def.nodes[step.from].short} → ${def.nodes[step.to].short}`, step.msg, step.tone);
      activate(step.from);
      if (!still) await travel(step.from, step.to, step.tone, token);
      if (token !== runToken) return;
      activate(step.to);
      if (step.mark) {
        const [id, text] = Array.isArray(step.mark) ? step.mark : [step.to, step.mark];
        mark(id, text, step.tone);
      }
    }

    async function play(id) {
      const scenario = def.scenarios.find((s) => s.id === id);
      if (!scenario) return;
      played = true;
      const token = ++runToken;
      buttons.forEach((button, i) => button.setAttribute("aria-pressed", String(def.scenarios[i].id === id)));
      resetNodes();
      log.replaceChildren();

      // Steps flagged `with` run in parallel with the step before them.
      const batches = [];
      for (const step of scenario.steps) {
        if (step.with && batches.length) batches[batches.length - 1].push(step);
        else batches.push([step]);
      }

      let n = 0;
      for (const batch of batches) {
        await Promise.all(batch.map((step) => runStep(step, ++n, token)));
        if (token !== runToken) return;
        await wait(reducedMotion.matches ? 0 : 130);
      }
      activate(null);
    }

    emptyLog();
    render();

    new ResizeObserver(() => {
      if (Math.abs(Math.round(stage.clientWidth) - width) < 2) return;
      runToken++;
      render();
    }).observe(stage);

    // Replay the first scenario once, the first time the diagram is on screen.
    if (!reducedMotion.matches && "IntersectionObserver" in window) {
      const io = new IntersectionObserver((entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        if (!played) play(def.scenarios[0].id);
      }, { threshold: 0.6 });
      io.observe(stage);
    }
  }

  document.querySelectorAll(".flow[data-flow]").forEach((root) => {
    const def = FLOWS[root.dataset.flow];
    if (def) createFlow(root, def);
  });
})();
