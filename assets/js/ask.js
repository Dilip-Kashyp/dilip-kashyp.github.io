/* "Interview my resume": a small hybrid retriever over hand-written facts.
   BM25 keyword relevance is blended with character-trigram similarity, typos
   are corrected against the vocabulary, and anything below a confidence
   threshold is refused. There is no LLM: answers are retrieved, never written
   on the fly. Exposes window.DK.chat for the command palette. */
(() => {
  "use strict";

  // ---------- Knowledge base: t = title, k = extra search terms, a = answer ----------
  const KB = [
    {
      id: "intro", t: "Who I am",
      k: "who are you introduce yourself about summary overview profile background tell me about yourself name",
      a: "I'm **Dilip Kumar**, a backend & AI engineer in Hyderabad, India. I have 2 years of production experience building APIs, auth, payments and retrieval-augmented AI features with Python, FastAPI, Go and Node.js. I'm currently a Full-Stack Engineer at Stryv.ai.",
    },
    {
      id: "hire", t: "Why hire me",
      k: "why should we hire you strengths strength best fit value bring stand out pitch good candidate unique choose",
      a: "I've already owned the hard parts at small startups: JWT auth with OTP recovery, Razorpay subscriptions, and a RAG pipeline that has to quote its source verbatim before a human approves it. I ship end to end, I can explain my trade-offs, and I'm actively levelling up on system design and DSA.",
    },
    {
      id: "stryv", t: "Current role at Stryv.ai",
      k: "current job role company stryv present now today working employer position responsibilities doing",
      a: "At **Stryv.ai** (since Jul 2025) I build backend and AI features for a vendor-compliance platform: the AI automation module (hybrid retrieval, reranking, quote validation, human approval), JWT auth with OTP password recovery, assessment workflows with trust-score calculation, and part of an AWS document-verification pipeline. [See the case study](#case-rag).",
    },
    {
      id: "nexgen", t: "Previous role at NexGen Elit",
      k: "previous job past company nexgen elit first job before earlier last employer",
      a: "At **NexGen Elit** (Jun 2024 to Jul 2025, remote) I built a job-portal backend with skill-based assessments and a dual-sided subscription model, integrated Razorpay, and built the Node.js/Express backend for a virtual fitness platform with Google Meet sessions.",
    },
    {
      id: "years", t: "Years of experience",
      k: "how many years experience total yoe long since when started career professional senior junior level fresher",
      a: "**2 years** of professional experience, since June 2024, across two startups: NexGen Elit (remote) and Stryv.ai (Hyderabad).",
    },
    {
      id: "roles", t: "What I'm looking for",
      k: "looking for target roles position job type open opportunities opportunity interested seeking next kind full time product company change switch move",
      a: "Full-time **Backend Engineer**, **AI Engineer** or **Full-Stack Engineer** roles. I'm especially interested in product companies with a strong engineering culture, where I can go deeper on backend systems and production AI.",
    },
    {
      id: "companies", t: "Startups and bigger companies",
      k: "google microsoft amazon meta apple faang maang big tech mnc mncs corporate enterprise startup startups companies size",
      a: "So far I've worked at two early-stage startups, NexGen Elit and Stryv.ai, where I owned features end to end. Next, I'm open to product companies, larger startups and MNCs alike.",
    },
    {
      id: "location", t: "Location and relocation",
      k: "location where based live city hyderabad relocate relocation move bengaluru bangalore onsite hybrid office home willing visa abroad country",
      a: "I'm based in **Hyderabad**. I'm open to Bengaluru, remote roles, or relocating anywhere in India. For roles outside India I'd need visa sponsorship.",
    },
    {
      id: "comp", t: "Notice period and compensation",
      k: "notice period join joining start date when available availability salary ctc compensation expected current package pay lpa",
      a: "Happy to discuss notice period and compensation directly. Email me at [info@dilipkashyap.in](mailto:info@dilipkashyap.in) and I'll reply within a day.",
    },
    {
      id: "contact", t: "How to reach me",
      k: "contact email mail reach talk connect linkedin phone call message touch number",
      a: "Email is fastest: [info@dilipkashyap.in](mailto:info@dilipkashyap.in). I usually reply within 24 hours. I'm also on [LinkedIn](https://www.linkedin.com/in/dilip-kashyap/) and [GitHub](https://github.com/Dilip-Kashyp).",
    },
    {
      id: "resume", t: "Resume",
      k: "resume cv pdf download document copy send",
      a: "Email me at [info@dilipkashyap.in](mailto:info@dilipkashyap.in) and I'll send my latest resume. The same details are on [LinkedIn](https://www.linkedin.com/in/dilip-kashyap/).",
    },
    {
      id: "python", t: "Python",
      k: "python django flask pydantic sqlalchemy alembic scripting",
      a: "Python is my main backend language (**2 years**). I use FastAPI, SQLAlchemy and Alembic. At Stryv.ai, Python/FastAPI powers the AI automation module, and [Atlas](#case-atlas) runs on async SQLAlchemy with Alembic migrations.",
    },
    {
      id: "go", t: "Go",
      k: "go golang gin gorm goroutines concurrency",
      a: "**1 year** of Go. I built the backends of [Jugaad Link](#case-jugaad) and [ContriHub](#case-contrihub) in Go with Gin, GORM, PostgreSQL and Redis.",
    },
    {
      id: "node", t: "Node.js",
      k: "node nodejs express javascript npm",
      a: "**2 years** of Node.js. At NexGen Elit I built the Node.js/Express backend for a virtual fitness platform, alongside the job-portal backend and the Razorpay integration.",
    },
    {
      id: "fastapi", t: "FastAPI",
      k: "fastapi api async pydantic endpoints openapi swagger",
      a: "FastAPI is my go-to for Python services (**1.5 years**): the AI automation module at Stryv.ai, and [Atlas](#case-atlas)'s multi-tenant backend with async SQLAlchemy, Alembic migrations and OAuth 2.0.",
    },
    {
      id: "databases", t: "Databases",
      k: "database databases sql postgresql postgres mysql mongodb nosql schema design indexes data modeling qdrant",
      a: "**PostgreSQL** is my default (2 years), including **pgvector** for embeddings. I use **Redis** for caching and rate limiting, and I've also worked with MongoDB and Qdrant.",
    },
    {
      id: "redis", t: "Redis",
      k: "redis cache caching rate limiting limiter throttling ttl in memory",
      a: "Redis shows up in most of my projects. [Jugaad Link](#case-jugaad) caches hot redirects, but only plain links: password, expiry and click-limit rules have to run on every visit. [ContriHub](#case-contrihub) uses it for IP + token rate limiting and to cache GitHub API responses.",
    },
    {
      id: "rag", t: "RAG and retrieval",
      k: "rag retrieval augmented generation genai embeddings vector database search semantic hybrid reranking reranker cross encoder pgvector pipeline explain walk through",
      a: "At Stryv.ai I'm building a retrieval pipeline for compliance automation: hybrid vector + keyword search on PostgreSQL/pgvector, cross-encoder reranking, verbatim-quote validation, and async processing with human-in-the-loop approval. [Walk through it](#case-rag).",
    },
    {
      id: "grounding", t: "Preventing hallucinations",
      k: "hallucination hallucinations grounded grounding accuracy trust reliable verify verification citations quote verbatim evaluation wrong answers stop ai llm model",
      a: "Make the model prove it. In my pipeline an answer has to carry a quote that appears **verbatim** in the source document. If the quote isn't there, the answer is flagged instead of accepted. Reranking puts the best evidence first, and a human approves results before they take effect.",
    },
    {
      id: "llms", t: "LLMs and AI providers",
      k: "llm llms models openai azure gpt gemini groq bedrock claude anthropic provider genai function calling agents agent tools",
      a: "I've shipped with **Gemini** (function calling and tool dispatch in [Atlas](#case-atlas)), **Groq** (repo explanations and roadmaps in [ContriHub](#case-contrihub)) and **AWS Bedrock** (structured extraction), and I've also used Azure OpenAI. About 1.5 years with LLMs in total.",
    },
    {
      id: "aws", t: "AWS and cloud",
      k: "aws cloud azure lambda s3 serverless textract bedrock cloudformation gcp deploy deployment infrastructure",
      a: "**1.5 years** with AWS. I contributed to a document-verification pipeline that processed **160K documents in a month** at ~90% accuracy, and I prototyped serverless OCR + LLM extraction with Textract and Bedrock. I've also used Azure (Azure OpenAI, Document Intelligence) and CloudFormation.",
    },
    {
      id: "devops", t: "Docker and DevOps",
      k: "docker devops ci cd cicd github actions kubernetes k8s nginx linux containers compose pipeline",
      a: "Docker for **1.5 years**: multi-stage builds and Compose stacks (API + PostgreSQL + Redis) in Jugaad Link and Atlas. I also work with Nginx, Linux and GitHub Actions for CI/CD. I haven't run Kubernetes in production yet.",
    },
    {
      id: "frontend", t: "Frontend",
      k: "frontend react nextjs next redux tailwind css ui web javascript typescript",
      a: "I'm backend-first, but I ship my own frontends: **React/Next.js** for 2 years, plus Redux and Tailwind CSS. Jugaad Link, Atlas and ContriHub all have Next.js frontends I built.",
    },
    {
      id: "auth", t: "Auth and security",
      k: "auth authentication authorization jwt oauth oauth2 login session sessions otp password security bcrypt token tokens refresh encryption",
      a: "I built JWT auth with OTP password recovery at Stryv.ai (hashed, expiring OTPs with resend and attempt limits), bcrypt-protected links in Jugaad Link, and OAuth 2.0 with rotating refresh tokens in HTTP-only cookies plus Fernet-encrypted provider tokens in Atlas.",
    },
    {
      id: "payments", t: "Payments",
      k: "payment payments razorpay stripe subscription subscriptions billing checkout",
      a: "At NexGen Elit I integrated **Razorpay** for student test payments and recruiter job-posting subscriptions, a dual-sided subscription model.",
    },
    {
      id: "design", t: "System design",
      k: "system design architecture scalability scale scaling distributed microservices monolith hld lld patterns tradeoffs",
      a: "I think in trade-offs: cache only what's safe to cache, rate-limit anything that costs money, move slow work off the request path, and keep a modular monolith until there's a reason to split it. I'm going deeper on HLD and LLD as I move to larger systems.",
    },
    {
      id: "dsa", t: "DSA practice",
      k: "dsa data structures algorithms leetcode neetcode competitive coding problems cpp interview prep",
      a: "I practice DSA regularly on NeetCode and LeetCode, in C++. My submissions are public on [GitHub](https://github.com/Dilip-Kashyp/neetcode-submissions).",
    },
    {
      id: "testing", t: "Testing",
      k: "testing tests test write writing pytest unit integration quality tdd seed",
      a: "Atlas's backend has a pytest suite that runs inside Docker Compose, and Jugaad Link ships a seed command that generates 200 realistic links with click history for local testing.",
    },
    {
      id: "jugaad", t: "Jugaad Link",
      k: "jugaad jugaadlink url shortener short link links qr analytics redirect chrome extension",
      a: "**Jugaad Link** is a URL shortener with a Go (Gin, GORM) backend, PostgreSQL, Redis and a Next.js frontend: custom slugs, password-protected and expiring links, QR codes and per-link analytics. [Live](https://jugaadlink.vercel.app) · [Code](https://github.com/Dilip-Kashyp/jugaadlink-be) · [Case study](#case-jugaad)",
    },
    {
      id: "atlas", t: "Atlas",
      k: "atlas slack bot github assistant conversation intelligence gemini agent tool calling function calling multi tenant webhooks",
      a: "**Atlas** turns Slack and GitHub conversations into structured work: a multi-tenant FastAPI backend with OAuth 2.0 (Google, GitHub, Slack), per-workspace webhook ingestion, and a Gemini orchestrator that uses function calling to run tools. [Code](https://github.com/Dilip-Kashyp/Atles) · [Case study](#case-atlas)",
    },
    {
      id: "contrihub", t: "ContriHub",
      k: "contrihub open source opensource beginner friendly github projects good first issue contributions groq roadmap",
      a: "**ContriHub** helps developers find beginner-friendly open-source projects: a Go (Gin, GORM) + PostgreSQL + Redis backend with GitHub OAuth, Groq-powered repo explanations and learning roadmaps, and Redis rate limiting. [Live](https://contri-hub.vercel.app) · [Code](https://github.com/Dilip-Kashyp/ContriHub) · [Case study](#case-contrihub)",
    },
    {
      id: "projects", t: "Projects overview",
      k: "projects project side portfolio built build personal showcase best",
      a: "My main side projects: [Jugaad Link](#case-jugaad) (Go URL shortener with Redis-cached redirects), [Atlas](#case-atlas) (FastAPI + Gemini Slack/GitHub assistant) and [ContriHub](#case-contrihub) (Go + Groq open-source discovery). Each one has an interactive request-flow diagram on this page.",
    },
    {
      id: "extraction", t: "Document extraction prototype",
      k: "document extraction ocr textract bedrock serverless pdf parsing invoice idp prototype",
      a: "I prototyped a serverless document-extraction pipeline on AWS: Textract for OCR and Bedrock LLMs for structured fields. It's a prototype. The worker never went to production.",
    },
    {
      id: "docverify", t: "160K-document pipeline",
      k: "160k documents verification pipeline accuracy 90 percent volume throughput biggest impact achievement",
      a: "I contributed to an AWS document-verification pipeline at Stryv.ai that processed **160K documents in a month** with about **90% verification accuracy**.",
    },
    {
      id: "crm", t: "CRM for 100K+ users",
      k: "crm sales leads customers 100k users client large team",
      a: "I developed a CRM for a client covering sales, leads and customer interactions, supporting **100K+ users**, as part of a 20+ person team of developers, designers and testers.",
    },
    {
      id: "otp", t: "OTP password recovery",
      k: "otp password recovery reset forgot one time brute force attempts",
      a: "I built password recovery with hashed, expiring OTPs, resend limits and protection against repeated attempts, on top of JWT sessions and protected routes.",
    },
    {
      id: "assessments", t: "Assessments and trust score",
      k: "assessment assessments workflow workflows trust score vendor compliance questionnaire scoring progress",
      a: "I own the backend for assessment workflows on a vendor-compliance platform: response management, category progress tracking and trust-score calculation.",
    },
    {
      id: "jobportal", t: "Job portal at NexGen Elit",
      k: "job portal recruiters students assessments hiring platform marketplace",
      a: "At NexGen Elit I built a job-portal backend where recruiters post roles and students apply through skill-based assessments, monetised with a dual-sided subscription model on Razorpay.",
    },
    {
      id: "fitness", t: "Virtual fitness platform",
      k: "fitness platform virtual classes meet courses dashboard video sessions",
      a: "I built the Node.js/Express backend for a virtual fitness platform: course browsing, an interactive dashboard and integrated Google Meet sessions.",
    },
    {
      id: "education", t: "Education",
      k: "education degree college university bca study studied graduate graduation qualification kurukshetra academic",
      a: "**BCA** (Bachelor of Computer Applications) from Kurukshetra University, at Govt. College Chhachhrauli, Yamunanagar, Haryana (2022 to 2025). I joined my first engineering team in June 2024, before graduating.",
    },
    {
      id: "certs", t: "Certifications",
      k: "certification certifications certificate certified course courses simplilearn altos training",
      a: "Web Software Development (Altos FITECH 101 University) and Node.js (Simplilearn).",
    },
    {
      id: "awards", t: "Awards",
      k: "awards award achievements recognition prize won competition exhibition honour honor",
      a: "2nd place at a state-level exhibition against 150+ colleges, and a place on my college's Roll of Honour.",
    },
    {
      id: "learning", t: "What I'm learning",
      k: "learning learn now currently next goals improving growth future plans career goal",
      a: "I'm going deeper on backend systems (system design, HLD and LLD) and on production AI engineering, with regular DSA practice alongside.",
    },
    {
      id: "team", t: "Teamwork",
      k: "team teamwork collaboration communication cross functional work style culture remote remotely ownership",
      a: "I've worked in a 20+ person cross-functional team (developers, designers, testers) on a CRM, and fully remote for a year at NexGen Elit. I like owning features end to end and explaining the trade-offs behind them.",
    },
    {
      id: "api", t: "API design",
      k: "api apis design rest restful endpoints versioning http status codes webhooks integration integrations third party",
      a: "I design REST APIs to be boring to integrate with: versioned routes (`/api/v1`), consistent response wrappers and proper status codes. Atlas also ingests Slack and GitHub webhooks per tenant.",
    },
    {
      id: "async", t: "Async and background work",
      k: "async asynchronous background jobs job queue worker workers pipeline concurrency",
      a: "Slow work stays off the request path. The Stryv.ai retrieval pipeline runs asynchronously with human approval steps, and Jugaad Link records click analytics asynchronously so redirects stay fast.",
    },
    {
      id: "tenancy", t: "Multi-tenancy",
      k: "multi tenant multitenancy tenants saas workspace workspaces organization isolation",
      a: "Atlas is multi-tenant: organizations and workspaces scope every integration, and each incoming webhook resolves its tenant (by Slack team ID) and decrypts only that tenant's token.",
    },
    {
      id: "languages", t: "Programming languages",
      k: "languages language programming code coding stack tech technologies skills tools",
      a: "Python and Go for backends, TypeScript and JavaScript for Node.js and Next.js, SQL everywhere, and C++ for DSA practice.",
    },
    {
      id: "github", t: "GitHub",
      k: "github repos repositories repository open source code profile",
      a: "Everything public is on [github.com/Dilip-Kashyp](https://github.com/Dilip-Kashyp): the project backends, my DSA submissions and this site's source.",
    },
    {
      id: "bot", t: "How this chat works",
      k: "how does this chat work bot chatbot built llm gpt real retrieval bm25 engine algorithm search made works",
      a: "No LLM here. Your question is tokenized, typo-corrected and scored against facts I wrote, using **BM25** (keyword relevance) blended with **trigram similarity** (fuzzy matching). If the best score is under a confidence threshold, it says it doesn't know instead of guessing. Open the trace under any answer to see the scores.",
    },
    {
      id: "site", t: "How this site is built",
      k: "website site portfolio built made stack framework design source html css vanilla",
      a: "Hand-written HTML, CSS and vanilla JavaScript: no framework, no build step, no trackers, hosted on GitHub Pages. The console at the top fetches real JSON from [/api/me.json](api/me.json). [Source](https://github.com/Dilip-Kashyp/dilip-kashyp.github.io)",
    },
    {
      id: "hello", t: "Hello",
      k: "hi hello hey hola namaste greetings morning evening yo sup",
      a: "Hi! Ask me about my experience, projects, stack or availability, or tap one of the suggestions.",
    },
    {
      id: "thanks", t: "Thanks",
      k: "thanks thank great awesome cool nice helpful bye goodbye",
      a: "Anytime! If you'd like to talk, I'm at [info@dilipkashyap.in](mailto:info@dilipkashyap.in).",
    },
  ];

  const REFUSAL =
    "I don't have a grounded answer for that, which usually means it isn't something I've done in production yet. Try asking about my experience, projects or stack, or email me at [info@dilipkashyap.in](mailto:info@dilipkashyap.in).";

  // ---------- Text processing ----------
  const STOP = new Set((
    "a an the is are am was were be been being do does did doing have has had having i me my mine you your yours u ur " +
    "he she it its we us our they them their what which who whom whose this that these those there here how why when " +
    "where can could would should will shall may might must of in on at by for with about against between into through " +
    "during above below to from up down out off over under again then once and or but if so than too very just also " +
    "any some such no nor not only own same both each few more most other ok okay please tell know let like want get " +
    "got give show say said much many really ever done dilip kumar kashyap ve ll re d s t m whats hows wheres whos " +
    "thats theres youre youve youll youd im ive dont doesnt didnt cant wont isnt arent wasnt havent hasnt"
  ).split(" "));

  // Filler in "AWS experience" or "worked with Redis": dropped when the
  // question has other terms, kept when it is the whole question.
  const SOFT = new Set(
    "experience experienced work worked working use used using skill skills knowledge familiar expertise proficient hands comfortable good great strong app apps application favourite favorite production prod professionally professional real world commercial"
      .split(" ")
      .map((w) => stem(w)),
  );

  const SYNONYMS = {
    ai: "llm genai", ml: "ai llm", llm: "ai", llms: "llm ai", genai: "llm ai", chatgpt: "llm", gpt: "llm",
    golang: "go", js: "javascript", ts: "typescript", py: "python", postgres: "postgresql", pg: "postgresql",
    k8s: "kubernetes", hallucinate: "hallucination", hallucinating: "hallucination", cv: "resume",
    salary: "compensation", ctc: "compensation", bangalore: "bengaluru", wfh: "remote",
  };

  function normalize(text) {
    return text
      .toLowerCase()
      .replace(/node\.?js/g, "nodejs")
      .replace(/next\.?js/g, "nextjs")
      .replace(/c\+\+/g, "cpp")
      .replace(/ci\s*\/\s*cd/g, "cicd")
      .replace(/['’]/g, "")
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
  }

  // A deliberately tiny stemmer: it only has to be consistent between the
  // knowledge base and the query, not linguistically correct.
  function stem(word) {
    let w = word;
    if (w.length > 4 && w.endsWith("ies")) return w.slice(0, -3) + "y";
    if (w.length > 3 && w.endsWith("s") && !/(ss|us|is)$/.test(w)) w = w.slice(0, -1);
    if (w.length > 5 && w.endsWith("ing")) w = w.slice(0, -3);
    if (w.length > 4 && w.endsWith("ed")) w = w.slice(0, -2);
    if (w.length > 5 && w.endsWith("er")) w = w.slice(0, -2);
    if (w.length > 3 && w.endsWith("e")) w = w.slice(0, -1);
    return w;
  }

  function tokenize(text) {
    const out = [];
    for (const raw of normalize(text).split(" ")) {
      if (raw && !STOP.has(raw)) out.push(stem(raw));
    }
    return out;
  }

  // Query terms as groups: the typed word first, then its synonyms.
  function queryGroups(text) {
    const groups = [];
    for (const raw of normalize(text).split(" ")) {
      if (!raw || STOP.has(raw)) continue;
      const fix = correct(stem(raw));
      const group = [fix ? fix.to : stem(raw)];
      if (fix) group.fix = fix;
      if (SYNONYMS[raw]) for (const syn of SYNONYMS[raw].split(" ")) group.push(stem(syn));
      groups.push(group);
    }
    const strong = groups.filter((g) => !SOFT.has(g[0]));
    return strong.length ? strong : groups;
  }

  function trigrams(text) {
    const grams = new Set();
    for (const word of normalize(text).split(" ")) {
      if (!word) continue;
      const padded = ` ${word} `;
      for (let i = 0; i < padded.length - 2; i++) grams.add(padded.slice(i, i + 3));
    }
    return grams;
  }

  // Optimal string alignment distance (Levenshtein + adjacent transpositions).
  function editDistance(a, b, max) {
    if (Math.abs(a.length - b.length) > max) return max + 1;
    const d = Array.from({ length: a.length + 1 }, (_, i) => [i]);
    for (let j = 1; j <= b.length; j++) d[0][j] = j;
    for (let i = 1; i <= a.length; i++) {
      let rowMin = Infinity;
      for (let j = 1; j <= b.length; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
        if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
        rowMin = Math.min(rowMin, d[i][j]);
      }
      if (rowMin > max) return max + 1;
    }
    return d[a.length][b.length];
  }

  // ---------- Index ----------
  const K1 = 1.2;
  const B = 0.75;
  const df = new Map();
  const docs = KB.map((doc) => {
    // Titles and keywords count twice: they are the curated signal.
    const terms = tokenize(`${doc.t} ${doc.t} ${doc.k} ${doc.k} ${doc.a.replace(/\]\([^)]*\)/g, "]")}`);
    const tf = new Map();
    for (const term of terms) tf.set(term, (tf.get(term) || 0) + 1);
    for (const term of tf.keys()) df.set(term, (df.get(term) || 0) + 1);
    return { doc, tf, len: terms.length, grams: trigrams(`${doc.t} ${doc.k}`) };
  });
  const avgLen = docs.reduce((sum, d) => sum + d.len, 0) / docs.length;
  const vocab = [...df.keys()];
  const idf = (term) => {
    const n = df.get(term) || 0;
    return Math.log(1 + (docs.length - n + 0.5) / (n + 0.5));
  };

  function bm25(query, d) {
    let score = 0;
    for (const term of query) {
      const f = d.tf.get(term);
      if (!f) continue;
      score += (idf(term) * f * (K1 + 1)) / (f + K1 * (1 - B + (B * d.len) / avgLen));
    }
    return score;
  }

  function correct(term) {
    if (df.has(term) || term.length < 5) return null;
    const max = term.length >= 8 ? 2 : 1;
    let best = null;
    let bestDist = max + 1;
    for (const word of vocab) {
      const dist = editDistance(term, word, max);
      if (dist < bestDist || (dist === bestDist && best && df.get(word) > df.get(best))) {
        best = word;
        bestDist = dist;
      }
    }
    return bestDist <= max ? { from: term, to: best } : null;
  }

  const THRESHOLD = 0.3;

  function search(text) {
    const started = performance.now();
    const groups = queryGroups(text);
    const query = groups.flat();
    const fixes = groups.filter((g) => g.fix).map((g) => [g.fix.from, g.fix.to]);
    const qGrams = trigrams(query.join(" "));

    const ranked = docs
      .map((d) => {
        const keyword = bm25(query, d);
        let shared = 0;
        for (const g of qGrams) if (d.grams.has(g)) shared++;
        const fuzzy = qGrams.size ? shared / qGrams.size : 0;
        // Share of the question's terms this fact covers (a synonym counts).
        const covered = groups.filter((g) => g.some((term) => d.tf.has(term))).length;
        const coverage = groups.length ? covered / groups.length : 0;
        // BM25 is unbounded, so squash it into 0..1 before blending.
        const blended = keyword > 0 ? 0.75 * (keyword / (keyword + 4)) + 0.25 * fuzzy : 0;
        const score = blended * Math.pow(coverage, 0.8);
        return { doc: d.doc, keyword, fuzzy, coverage, score };
      })
      .sort((a, b) => b.score - a.score);

    let top = ranked[0];
    // Questions made only of stopwords ("who are you?") get the introduction.
    if (!query.length && /\b(who|you|yourself|dilip)\b/i.test(text)) {
      top = { doc: KB[0], keyword: 0, fuzzy: 0, score: 1 };
    }
    const answered = top.score >= THRESHOLD;
    return { query, fixes, ranked: ranked.slice(0, 3), top, answered, ms: performance.now() - started };
  }

  // ---------- Chat UI ----------
  window.DK = window.DK || {};
  window.DK.ask = { search, size: KB.length };

  document.querySelectorAll("[data-kb-count]").forEach((el) => {
    el.textContent = KB.length;
  });

  const log = document.getElementById("chat-log");
  const form = document.getElementById("chat-form");
  const input = document.getElementById("chat-input");
  const suggest = document.getElementById("chat-suggest");
  if (!log || !form || !input) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const escape = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

  // Answers are trusted, hand-written strings with a little markdown.
  function markdown(text) {
    return escape(text)
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/`(.+?)`/g, "<code>$1</code>")
      .replace(/\[(.+?)\]\((.+?)\)/g, (_, label, href) => {
        const external = /^https?:/.test(href);
        return `<a href="${href}"${external ? ' target="_blank" rel="noopener"' : ""}>${label}</a>`;
      });
  }

  function scrollLog() {
    log.scrollTop = log.scrollHeight;
  }

  function addUser(text) {
    const msg = document.createElement("div");
    msg.className = "msg msg-user";
    msg.textContent = text;
    log.append(msg);
    scrollLog();
  }

  function addTyping() {
    const msg = document.createElement("div");
    msg.className = "msg msg-bot msg-typing";
    msg.setAttribute("aria-label", "Searching");
    msg.innerHTML = "<i></i><i></i><i></i>";
    log.append(msg);
    scrollLog();
    return msg;
  }

  function traceHtml(result) {
    const best = result.ranked[0] ? result.ranked[0].score || 1 : 1;
    const hits = result.ranked.filter((r) => r.score > 0);
    const rows = hits
      .map((r) => `
        <div class="trace-row">
          <span class="t-title">${escape(r.doc.t)}</span>
          <span class="t-score">${r.score.toFixed(2)}</span>
          <span class="t-bar"><i style="--w:${Math.max(0.02, r.score / Math.max(best, THRESHOLD)).toFixed(3)}"></i></span>
          <span class="t-parts">bm25 ${r.keyword.toFixed(2)} · trigram ${r.fuzzy.toFixed(2)} · coverage ${Math.round(r.coverage * 100)}%</span>
        </div>`)
      .join("");
    const fixes = result.fixes.length
      ? `<p class="trace-q"><b>typo fix</b> ${result.fixes.map(([a, b]) => `${escape(a)} → ${escape(b)}`).join(", ")}</p>`
      : "";
    const verdict = result.answered
      ? `<p class="trace-verdict ok">score ${result.top.score.toFixed(2)} ≥ ${THRESHOLD} → answered from “${escape(result.top.doc.t)}”</p>`
      : `<p class="trace-verdict no">best ${result.top.score.toFixed(2)} &lt; ${THRESHOLD} → refused instead of guessing</p>`;
    return `
      <details class="trace">
        <summary>retrieval trace · ${result.ms.toFixed(1)} ms</summary>
        <p class="trace-q"><b>terms</b> ${escape(result.query.join(" ") || "(none)")}</p>
        ${fixes}
        ${hits.length ? `<div class="trace-rows">${rows}</div>` : '<p class="trace-q">no fact contains these terms</p>'}
        ${verdict}
      </details>`;
  }

  function addBot(result) {
    const msg = document.createElement("div");
    msg.className = "msg msg-bot";
    msg.innerHTML = `<p>${markdown(result.answered ? result.top.doc.a : REFUSAL)}</p>${traceHtml(result)}`;
    log.append(msg);
    scrollLog();
  }

  let busy = false;
  async function ask(text) {
    const question = String(text || "").trim().slice(0, 200);
    if (!question || busy) return;
    busy = true;
    addUser(question);
    const typing = addTyping();
    const result = search(question);
    await wait(reducedMotion.matches ? 0 : 380 + Math.random() * 260);
    typing.remove();
    addBot(result);
    busy = false;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    ask(input.value);
    input.value = "";
  });

  if (suggest) {
    suggest.addEventListener("click", (event) => {
      const button = event.target.closest("button");
      if (!button || busy) return;
      ask(button.textContent);
      button.remove();
    });
  }

  window.DK.chat = {
    ask(text) {
      document.getElementById("ask").scrollIntoView({ behavior: reducedMotion.matches ? "auto" : "smooth" });
      ask(text);
    },
  };
})();
