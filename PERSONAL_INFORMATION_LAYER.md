# Personal Information Layer — Inventory & Design

**Subject:** Dilip Kumar (Dilip.Kumar@stryv.ai)
**Generated:** 2026-09-23
**Status:** Inventory complete. Design proposed. Nothing implemented.

Sources inspected: global Claude config and settings, all memory files across 4 projects,
prompt history (160 entries, 2026-04-28 to 2026-09-23), session transcripts for this project
and two others, repo rules/docs/CLAUDE.md files, and git history across all branches.

**Redaction note:** this document deliberately does not reproduce hostnames, account
identifiers, ARNs, webhook paths or credentials found during the scan. Where such a value
matters, the owning file is named instead. See section 2.8.

---

## Legend

**Provenance format**

| Prefix | Meaning |
|---|---|
| `memory:<project>/<file>` | A Claude memory file |
| `history.jsonl@<date>` | A prompt from the global prompt history |
| `transcript:<id>@<date>` | A session transcript message |
| `repo:<path>` | A file in the verifiedtrustscore repo |
| `git` | Git log, config, or branch data |
| `env` | Session environment / system context |

**Confidence rules**

| Level | Requires |
|---|---|
| `high` | Stated explicitly by the user, or directly observable in a file |
| `medium` | Consistent across 2+ sources, not stated as a rule |
| `low` | Single observation; may be situational |

A record may only be `high` if a source entry quotes the user or names a file.

---

# PART 1 — Information Inventory

## 1. Identity

```json
{"category":"FACT","fact":"The user is Dilip Kumar, email Dilip.Kumar@stryv.ai","source":"git config local+global; git log all branches; confirmed by user 2026-09-23","confidence":"high","last_verified":"2026-09-23","status":"active"}
{"category":"FACT","fact":"The Claude seat/licence email is a different address and is NOT the operator. Never attribute work to it","source":"env userEmail; zero occurrences in repo or git history","confidence":"high","last_verified":"2026-09-23","status":"active"}
{"category":"FACT","fact":"AWS IAM user for the extractd deployments is dilip.kumar","source":"memory:home-safe-3/project_extractd_integration.md","confidence":"high","last_verified":"2026-07-09","status":"active"}
{"category":"FACT","fact":"Works in an organisation on the stryv.ai domain. Collaborators on verifiedtrustscore: Yadvendu Saini and satyapappula","source":"git log","confidence":"high","last_verified":"2026-09-22","status":"active"}
{"category":"FACT","fact":"Windows workstation, account S250702, Windows 11 Pro 10.0.26200, PowerShell primary shell, Bash also available","source":"env","confidence":"high","last_verified":"2026-09-23","status":"active"}
{"category":"FACT","fact":"WSL distro OracleLinux_8_10 with Linux home /home/Dilip, used for the Laravel work","source":"settings.json additionalDirectories; memory:homesafe-4/toolchain-lives-in-wsl.md","confidence":"high","last_verified":"2026-07-27","status":"active"}
{"category":"FACT","fact":"Self-identifies as an engineer: 'im engineer i can understand the code by just seeing it'","source":"memory:VTS/no-explanatory-comments.md quoting 2026-09-21","confidence":"high","last_verified":"2026-09-21","status":"active"}
{"category":"FACT","fact":"Has a manager, and works with a DBA/DevOps person and an ETL team; asks Claude to draft messages to them","source":"history.jsonl@2026-09-04; memory:vtscm-ai-corpus-single-source.md","confidence":"high","last_verified":"2026-09-04","status":"active"}
```

### Ownership boundary — what is Dilip's work

Established by git authorship audit, 2026-09-23.

| Author | Commits | Owns |
|---|---|---|
| **Dilip Kumar** | 5 merged / 9 total | Application code, docs, models, migrations |
| Yadvendu Saini | 16 | CI/CD pipelines, Terraform, Azure VM deploy, RBAC |
| satyapappula | 1 | One-time move of VTSCM source into Azure Repos |

**Dilip's commits in verifiedtrustscore**

| Commit | Date | Content |
|---|---|---|
| `a90ba37` / `d5a7b4b` | 2026-09-22 | Entire docs + `.claude/` reorganisation — 43 files: 6 rule files, 3 skills, CLAUDE.md, DECISIONS.md, docs/README.md, every architecture and integration doc |
| `de223fd` / `29a8da2` | 2026-09-21 | `pgAdmin` defaults for `created_by`/`updated_by` across 7 models + migration `390ff7a5598d` |
| `31acf46` / `e4a0236` | 2026-09-21 | docker-compose for backend + db + mailpit; `SETUP.md` |
| `c7d86e7` | 2026-09-18 | `.gitignore` duplicate env entry fix |
| `ac478a3` | 2026-09-18 | DB models + migrations schema consistency |

**Uncommitted in the working tree — also Dilip's:** `backend/app/ai_automation/` (whole module),
`backend/tests/ai_automation/`, AI tables migration `a7c1e9b4d302`, `demo/ai-automation/`,
`backend/app/utils/filenames.py`.

**Correction on record:** PR 10 "Enabling AI" (`9528756`, Yadvendu Saini) is **Terraform/RBAC only**
— 6 `.tf` files, zero Python. It is not the AI module. The AI automation code is entirely Dilip's,
designed across sessions from 2026-08-24 onward and still uncommitted.

**Cross-project ownership**

| Project | Dilip's? |
|---|---|
| VTS / verifiedtrustscore — backend, AI module, docs, demo | Yes |
| VTS — CI/CD, Terraform, deploy pipelines | No — Yadvendu's |
| vtscm-shield and the `New folder (2)` copy | Yes, earlier copies of the same work |
| THSS / homesafe-app Laravel work | Yes |
| extractd tool + serverless worker | Yes (IAM user `dilip.kumar`) |
| extraction_service POC | Yes |

---

## 2. Communication preferences

```json
{"category":"COMMUNICATION_PATTERN","fact":"Short, plain-word explanations in small blocks. No long paragraphs. Think like a senior staff engineer: name the trade-off, give a recommendation, flag the real risk","source":"memory:VTS/simple-senior-engineer-explanations.md, stated 2026-09-22","confidence":"high","last_verified":"2026-09-22","status":"active"}
{"category":"COMMUNICATION_PATTERN","fact":"Answer first, then the reason. No filler, no restating the question, no exhaustive option surveys","source":"memory:vtscm-shield/response-style-concise.md, stated 2026-09-07","confidence":"high","last_verified":"2026-09-07","status":"active"}
{"category":"COMMUNICATION_PATTERN","fact":"Prefers tables and bullets over prose when comparing options","source":"memory:VTS/simple-senior-engineer-explanations.md","confidence":"medium","last_verified":"2026-09-22","status":"active"}
{"category":"COMMUNICATION_PATTERN","fact":"Pushes back explicitly when an answer is too long: 'why too much infor? just to be stight froward and give in simple few link'","source":"transcript:3eaf5186@2026-09-22","confidence":"high","last_verified":"2026-09-22","status":"active"}
{"category":"COMMUNICATION_PATTERN","fact":"Asks for rationale, not just output: 'why we are doing this tell me', 'explain more'","source":"history.jsonl@2026-09-04, @2026-06-30","confidence":"medium","last_verified":"2026-09-04","status":"active"}
{"category":"COMMUNICATION_PATTERN","fact":"Writes fast, unedited English with frequent typos. Meaning must be inferred generously rather than queried","source":"history.jsonl throughout; transcripts","confidence":"high","last_verified":"2026-09-23","status":"active"}
{"category":"COMMUNICATION_PATTERN","fact":"Switches to Hindi/Hinglish when frustrated. Signal: intent was misread, not that literal instructions were disobeyed","source":"transcript:ead27621@2026-09-23","confidence":"high","last_verified":"2026-09-23","status":"active"}
{"category":"UNCERTAIN","fact":"Whether Hindi-language replies are welcome — never requested","source":"no supporting evidence","confidence":"low","last_verified":"2026-09-23","status":"unknown"}
```

## 3. Coding preferences

```json
{"category":"PREFERENCE","fact":"Zero comments in code or config. No block, inline, or docstring. One single-line comment of max 20 words only if genuinely critical. Applies to Python, JS/JSX, YAML, env, Dockerfile, Terraform","source":"memory:VTS/no-explanatory-comments.md; repo:.claude/rules/code-comments.md","confidence":"high","last_verified":"2026-09-22","status":"active"}
{"category":"PREFERENCE","fact":"Rationale belongs in the chat reply, never in the file","source":"memory:VTS/no-explanatory-comments.md; repo:.claude/rules/code-comments.md R3","confidence":"high","last_verified":"2026-09-22","status":"active"}
{"category":"PREFERENCE","fact":"'don't write extre code just keep the code small and meaning full and logical'","source":"history.jsonl@2026-04-28","confidence":"high","last_verified":"2026-04-28","status":"active"}
{"category":"PREFERENCE","fact":"New code must follow the structure and conventions already in the repo","source":"history.jsonl@2026-04-28 'code must follow the code rules and structure what ever already written'","confidence":"high","last_verified":"2026-04-28","status":"active"}
{"category":"PREFERENCE","fact":"No hardcoding. Wants dynamic/modular design: 'we should not hard code anything. we should have sonething dynmic or moduler'","source":"history.jsonl@2026-06-30","confidence":"high","last_verified":"2026-06-30","status":"active"}
{"category":"PREFERENCE","fact":"Extend by class-based extension rather than editing old code: 'it is classbased so we dont need to change the old code only extantions we should'","source":"history.jsonl@2026-06-30","confidence":"medium","last_verified":"2026-06-30","status":"active"}
{"category":"PREFERENCE","fact":"No TypeScript in the frontend; modern JS + JSX only","source":"repo:.claude/rules/frontend.md rule 1; DECISIONS A-18","confidence":"high","last_verified":"2026-09-22","status":"active"}
{"category":"PREFERENCE","fact":"250-line hard cap per React component file","source":"repo:.claude/rules/frontend.md rule 4","confidence":"high","last_verified":"2026-09-22","status":"active"}
{"category":"PREFERENCE","fact":"Ant Design first. Check for an AntD component/prop before custom CSS. All CSS in src/shared/styles/index.css. Every Spin uses the LoadingOutlined indicator","source":"repo:.claude/rules/frontend.md rules 5,6,12; DECISIONS A-19","confidence":"high","last_verified":"2026-09-22","status":"active"}
{"category":"PREFERENCE","fact":"Integration tests only; no unit tests. Every endpoint driven through the real router via ASGITransport","source":"transcript:65d67c98@2026-09-23 'dont go for unit testing integration testing is good'; DECISIONS A-25","confidence":"high","last_verified":"2026-09-23","status":"active"}
{"category":"PREFERENCE","fact":"Rejects tests that call service internals: 'if funcation is there it means i being used in the api?? ifso then test the api na>??'","source":"transcript:65d67c98@2026-09-23","confidence":"high","last_verified":"2026-09-23","status":"active"}
{"category":"PREFERENCE","fact":"Deletes dead tooling rather than leaving it. Had vitest and all test files removed from the frontend; asked to remove SQLite support once Postgres containers landed","source":"memory:vtscm-shield/vtscm-deferred-auth-wiring.md; transcript:65d67c98@2026-09-23","confidence":"high","last_verified":"2026-09-23","status":"active"}
```

## 4. Technical skills

Evidenced by work performed and questions asked. Not self-declared proficiency.

```json
{"category":"SKILL","fact":"Python / FastAPI / async SQLAlchemy 2.0 / asyncpg / Pydantic — owns the VTS backend","source":"repo:backend/**","confidence":"high","last_verified":"2026-09-23","status":"active"}
{"category":"SKILL","fact":"Alembic migrations, including baseline-from-live-schema strategy and autogenerate filtering","source":"history.jsonl@2026-09-17; repo:backend/migrations/","confidence":"high","last_verified":"2026-09-17","status":"active"}
{"category":"SKILL","fact":"pytest, testcontainers, pgvector pg16 container-per-run test setup","source":"repo:backend/tests/conftest.py; DECISIONS A-24","confidence":"high","last_verified":"2026-09-23","status":"active"}
{"category":"SKILL","fact":"React + Vite + Redux Toolkit + Ant Design + Axios + Day.js; vertical-slice frontend architecture","source":"repo:frontend/CLAUDE.md; memory:vtscm-feature-first-placement.md","confidence":"high","last_verified":"2026-09-22","status":"active"}
{"category":"SKILL","fact":"RAG engineering: chunking, embeddings, hybrid vector+keyword search, cross-encoder reranking, verbatim quote validation, system-computed confidence","source":"repo:backend/app/ai_automation/**; history.jsonl@2026-08-24","confidence":"high","last_verified":"2026-09-23","status":"active"}
{"category":"SKILL","fact":"PHP / Laravel / Laravel Nova / Vue — the THSS / homesafe-app codebase","source":"memory:home-safe-3/*, homesafe-4/*","confidence":"high","last_verified":"2026-07-28","status":"historical"}
{"category":"SKILL","fact":"AWS: Bedrock (Claude models), Lambda, API Gateway, S3, EventBridge Scheduler, Secrets Manager, IAM, SigV4 signing, Serverless Framework","source":"memory:project_extractd_integration.md, project_extraction_iam.md; history.jsonl@2026-06-30","confidence":"high","last_verified":"2026-07-09","status":"historical"}
{"category":"SKILL","fact":"Azure: DevOps pipelines, self-hosted agent on VM, Terraform, Document Intelligence, Azure OpenAI","source":"repo:ci/, deploy/, terraform/; transcript:3eaf5186@2026-09-22","confidence":"high","last_verified":"2026-09-22","status":"active"}
{"category":"SKILL","fact":"Docker / docker-compose — backend + db + mailpit locally","source":"git commit e4a0236 @2026-09-21","confidence":"high","last_verified":"2026-09-21","status":"active"}
{"category":"SKILL","fact":"PostgreSQL incl. schemas, pgvector extension, generated tsvector columns, DISTINCT ON","source":"repo:backend/app/ai_automation/repositories/; DECISIONS A-24","confidence":"high","last_verified":"2026-09-23","status":"active"}
```

## 5. Learning goals

```json
{"category":"UNCERTAIN","fact":"Asked to be taught testing theory: 'teach me more about testing props cons and what kind of testing we shpuld do'","source":"transcript:65d67c98@2026-09-23","confidence":"high","last_verified":"2026-09-23","status":"temporary"}
{"category":"UNCERTAIN","fact":"Asked what a Claude memory.md file is, how it works, whether it is created automatically","source":"transcript:ee4e8364@2026-09-23","confidence":"high","last_verified":"2026-09-23","status":"temporary"}
{"category":"UNCERTAIN","fact":"Asked whether Bedrock Claude can be fine-tuned for their document use case and how to cut token cost","source":"history.jsonl@2026-06-30","confidence":"high","last_verified":"2026-06-30","status":"historical"}
```

Three one-off questions. None is strong enough to store as a durable learning goal.
Flagged, not promoted.

## 6. Career goals

```json
{"category":"UNCERTAIN","fact":"No evidence of any stated career goal, role target, or professional ambition in any source","source":"exhaustive scan of memory, history, transcripts, repo","confidence":"high","last_verified":"2026-09-23","status":"unknown"}
```

## 7. Current projects

```json
{"category":"PROJECT","fact":"VTS / VTSCM (Vendor Trust Score & Compliance Management), working copy under Desktop\\VTS new\\verifiedtrustscore; Azure DevOps remote vts-org/vts-proj/verifiedtrustscore","source":"repo; git remote","confidence":"high","last_verified":"2026-09-23","status":"active"}
{"category":"PROJECT","fact":"On branch automation-0001 with a large uncommitted working tree: ai_automation untracked, AI tables migration untracked, tests/ai_automation untracked, docs and rules modified","source":"git status @2026-09-23","confidence":"high","last_verified":"2026-09-23","status":"temporary"}
{"category":"PROJECT","fact":"AI automation module: document/question/analysis pipelines, 8 ai_ tables in the trust schema, /ai/ endpoints","source":"repo:backend/app/ai_automation/; docs/architecture/AI_AUTOMATION_HLD_LLD.md","confidence":"high","last_verified":"2026-09-23","status":"active"}
{"category":"PROJECT","fact":"Standalone demo at demo/ai-automation/ — HTML/CSS/JS mockup of the Self-Assessment screen, built to show the AI flow to their manager, deliberately outside frontend/","source":"transcript:ead27621@2026-09-23; repo:demo/ai-automation/","confidence":"high","last_verified":"2026-09-23","status":"active"}
{"category":"PROJECT","fact":"Demo must feel like a real UI (upload a doc, match questions, ask questions about it) driven by REAL AI APIs — not a Swagger-style API tester","source":"transcript:ead27621@2026-09-23","confidence":"high","last_verified":"2026-09-23","status":"active"}
{"category":"PROJECT","fact":"Test-suite conversion completed 2026-09-23: 94 pure-function AI tests converted to endpoint-driven integration tests","source":"DECISIONS A-25; transcript:65d67c98","confidence":"high","last_verified":"2026-09-23","status":"active"}
{"category":"PROJECT","fact":"Repo documentation hierarchy (CLAUDE.md entry point, .claude/rules/, .claude/skills/, docs/ index with authority labels) designed and built at the user's request 2026-09-22","source":"transcript:4fdf16a5@2026-09-22; git a90ba37","confidence":"high","last_verified":"2026-09-22","status":"active"}
```

## 8. Historical projects

```json
{"category":"PROJECT","fact":"vtscm-shield under Desktop — earlier working copy of the same product; AI automation first built here","source":"history.jsonl 2026-07-20..2026-09-04; memory:vtscm-shield/*","confidence":"high","last_verified":"2026-09-04","status":"historical"}
{"category":"PROJECT","fact":"A second copy under Desktop\\New folder (2) where the Alembic decision was debated 2026-09-17","source":"history.jsonl; transcripts","confidence":"high","last_verified":"2026-09-17","status":"historical"}
{"category":"PROJECT","fact":"THSS / homesafe-app — Laravel + Nova property-licensing app; the homesafe-app and thss-staging repos share root commit 3fe239bd","source":"memory:homesafe-repo-shares-history-with-thss-staging.md","confidence":"high","last_verified":"2026-07-27","status":"historical"}
{"category":"PROJECT","fact":"extractd — Python CLI + serverless worker under Desktop\\tool, extracting fields from gas safety certificates via Bedrock. Laravel wiring built 2026-07-08/09; worker infra never deployed due to 3 missing IAM scheduler permissions","source":"memory:home-safe-3/project_extractd_integration.md","confidence":"high","last_verified":"2026-07-09","status":"historical"}
{"category":"PROJECT","fact":"extraction_service POC under Desktop\\POC and Desktop","source":"history.jsonl@2026-05-19, @2026-05-22","confidence":"medium","last_verified":"2026-05-22","status":"historical"}
```

## 9. Technical decisions

Only decisions traceable to the user, with the recorded reason.

```json
{"category":"DECISION","fact":"Build the AI module as a layered exception (clients/ services/ repositories/ pipelines) instead of the flat layout. Reason: it is a POC becoming a product, needs heavy R&D and repeated changes, and swapping local to Azure should be a service-layer change only","source":"history.jsonl@2026-09-04; DECISIONS A-07","confidence":"high","last_verified":"2026-09-04","status":"active"}
{"category":"DECISION","fact":"Treat the POC as the final product: keep the same structure, mimic cloud services locally with local embedding models and reranker, use no Azure service yet","source":"history.jsonl@2026-09-04","confidence":"high","last_verified":"2026-09-04","status":"historical"}
{"category":"DECISION","fact":"Move to Azure managed services: Azure AI Document Intelligence, Azure OpenAI (text-embedding-3-large, o4-mini), pgvector on the existing Postgres. Asked to be flagged on further dependencies so they can request IT access","source":"transcript:3eaf5186@2026-09-22","confidence":"high","last_verified":"2026-09-22","status":"active"}
{"category":"DECISION","fact":"ai_ tables live in the existing trust schema, not a separate ai schema","source":"history.jsonl@2026-09-04; DECISIONS S-03","confidence":"high","last_verified":"2026-09-04","status":"active"}
{"category":"DECISION","fact":"If one internal caller is enough, do not expose an HTTP endpoint for it. Applied to evidence indexing and question embedding","source":"memory:vtscm-shield/vtscm-ai-corpus-single-source.md","confidence":"high","last_verified":"2026-09-15","status":"active"}
{"category":"DECISION","fact":"Nothing AI-related is awaited on the request path: 'just add one job inside the queue, return the response and in the job process it'","source":"memory:vtscm-ai-corpus-single-source.md","confidence":"high","last_verified":"2026-09-15","status":"active"}
{"category":"DECISION","fact":"Category is a hard filter on retrieval, not a ranking boost; NULL means all categories. Reason: a boost cannot stop a cross-category answer when nothing better ranks","source":"DECISIONS A-09, dated 2026-09-09","confidence":"high","last_verified":"2026-09-09","status":"active"}
{"category":"DECISION","fact":"Uploaded evidence IS the AI corpus; no separate document library. Reason: reuses the existing upload path","source":"DECISIONS A-10, dated 2026-09-08","confidence":"high","last_verified":"2026-09-08","status":"active"}
{"category":"DECISION","fact":"The AI never writes an answer or a score. Suggestions land in ai_answers; a human accepts them. 'This is the whole trust argument for the feature'","source":"DECISIONS A-08; repo:.claude/rules/ai-automation.md AI1","confidence":"high","last_verified":"2026-09-23","status":"active"}
{"category":"DECISION","fact":"Alembic adopted after debate. Chosen approach: 'First pull the real DB schema, make complete models, baseline Alembic, from then onward models become the source of truth for migrations'","source":"history.jsonl@2026-09-17","confidence":"high","last_verified":"2026-09-17","status":"active"}
{"category":"DECISION","fact":"Tests run against a real Postgres+pgvector in a throwaway testcontainer per run; Docker is a test prerequisite. Reason: SQLite could not create vector or generated tsvector columns, leaving the AI module untested","source":"DECISIONS A-24, signed off 2026-09-23","confidence":"high","last_verified":"2026-09-23","status":"active"}
{"category":"DECISION","fact":"Reset password token held in local component state, not router state or Redux, so it never enters history","source":"memory:vtscm-shield/vtscm-deferred-auth-wiring.md","confidence":"high","last_verified":"2026-09-07","status":"active"}
```

## 10. Architecture preferences

```json
{"category":"PREFERENCE","fact":"Backend organised by feature module, not by layer: app/<feature>/router.py, service.py, models.py, schemas.py","source":"DECISIONS A-01; repo:CLAUDE.md","confidence":"high","last_verified":"2026-09-23","status":"active"}
{"category":"PREFERENCE","fact":"Frontend organised by capability (vertical slice). A feature never imports another feature; promote to shared/ or compose in app/","source":"DECISIONS A-16; repo:.claude/rules/frontend.md rule 8","confidence":"high","last_verified":"2026-09-23","status":"active"}
{"category":"PREFERENCE","fact":"Feature-first placement enforced hard — pushed back twice on auth code left in shared/ for convenience","source":"memory:vtscm-shield/vtscm-feature-first-placement.md","confidence":"high","last_verified":"2026-09-07","status":"active"}
{"category":"PREFERENCE","fact":"Every feature owns its own Redux store; shared/store is legacy and must not be extended","source":"DECISIONS A-17; repo:.claude/rules/frontend.md rule 11","confidence":"high","last_verified":"2026-09-23","status":"active"}
{"category":"PREFERENCE","fact":"One symbol, one owning module. Never duplicate a model or schema across modules","source":"DECISIONS A-02, A-03; repo:.claude/rules/architecture.md A3","confidence":"high","last_verified":"2026-09-23","status":"active"}
{"category":"PREFERENCE","fact":"Every endpoint returns status_code/message/data via custom_response(). No raw FastAPI responses. Routers hold no business logic; services build no responses","source":"DECISIONS A-04, A-05","confidence":"high","last_verified":"2026-09-23","status":"active"}
{"category":"PREFERENCE","fact":"Keep it simple: no repository layer, no CQRS, no Celery, no speculative abstraction. Three similar lines beat an early abstraction","source":"DECISIONS A-06; repo:.claude/rules/backend.md rule 6","confidence":"high","last_verified":"2026-09-23","status":"active"}
{"category":"PREFERENCE","fact":"Minimise DB round trips — dev Postgres is roughly 250ms RTT. Batch pre-checks, avoid db.refresh(), use INSERT...RETURNING","source":"repo:.claude/rules/backend.md rule 10","confidence":"high","last_verified":"2026-09-23","status":"active"}
```

## 11. Working style

```json
{"category":"WORKING_STYLE","fact":"Plan first, execute second: 'first give me the plan then we'll excute'; 'dont implement anything i just need a pplan'","source":"history.jsonl@2026-06-30, @2026-08-24","confidence":"high","last_verified":"2026-08-24","status":"active"}
{"category":"WORKING_STYLE","fact":"Explicit permission gate: 'dont do anything without my permisson' — said after a parallel session started generating Alembic code unasked","source":"history.jsonl@2026-09-17","confidence":"high","last_verified":"2026-09-17","status":"active"}
{"category":"WORKING_STYLE","fact":"Will halt all sessions rather than let an undecided decision get implemented: 'stop all the session, i didnt come with the final decssion for db migration'","source":"history.jsonl@2026-09-17","confidence":"high","last_verified":"2026-09-17","status":"active"}
{"category":"WORKING_STYLE","fact":"Runs multiple concurrent Claude sessions on the same codebase and expects cross-session collision checks","source":"transcript cross-session-message @2026-09-17","confidence":"high","last_verified":"2026-09-17","status":"active"}
{"category":"WORKING_STYLE","fact":"Wants to run verification themselves. Claude prepares fixtures and commands and hands them over","source":"DECISIONS A-23; repo:.claude/rules/backend.md rule 7","confidence":"high","last_verified":"2026-09-23","status":"active"}
{"category":"WORKING_STYLE","fact":"Inspect before changing: 'First, inspect the repository before making any changes. Do not blindly move files.'","source":"transcript:4fdf16a5@2026-09-22; history.jsonl@2026-09-04","confidence":"high","last_verified":"2026-09-22","status":"active"}
{"category":"WORKING_STYLE","fact":"Asks for recaps of completed work: 'can you recap what we did.'","source":"history.jsonl@2026-06-30","confidence":"low","last_verified":"2026-06-30","status":"active"}
{"category":"WORKING_STYLE","fact":"Challenges design choices rather than accepting them: 'what do you think about this approach?', 'which one is easy and should be done?', 'are you should staying local is enough?'","source":"history.jsonl@2026-09-04, @2026-09-17; transcript:3eaf5186","confidence":"high","last_verified":"2026-09-22","status":"active"}
{"category":"WORKING_STYLE","fact":"Works across several parallel working copies of the same project and ports changes between them","source":"history.jsonl; transcript:3eaf5186@2026-09-22","confidence":"high","last_verified":"2026-09-22","status":"active"}
```

## 12. Recurring workflows

```json
{"category":"WORKING_STYLE","fact":"Before backend done: pytest (needs Docker), then pre-commit run --all-files","source":"repo:CLAUDE.md; .claude/rules/backend.md rule 12","confidence":"high","last_verified":"2026-09-23","status":"active"}
{"category":"WORKING_STYLE","fact":"Before frontend done: npm run lint with zero warnings; npm run build for a full screen or PR","source":"repo:.claude/rules/frontend.md rule 10","confidence":"high","last_verified":"2026-09-23","status":"active"}
{"category":"WORKING_STYLE","fact":"Checks token usage constantly — /usage is the most frequent command in history, roughly 40 of 160 entries","source":"history.jsonl","confidence":"high","last_verified":"2026-09-23","status":"active"}
{"category":"WORKING_STYLE","fact":"Branch strategy feature/* to dev to uat to prod via PRs; merges land as 'Merged PR N' commits in Azure DevOps","source":"repo:ci/README.md; git log","confidence":"medium","last_verified":"2026-09-22","status":"active"}
{"category":"WORKING_STYLE","fact":"Asks Claude to draft messages to other teams (DBA, DevOps, IT access requests)","source":"history.jsonl@2026-09-04; transcript:3eaf5186@2026-09-22","confidence":"high","last_verified":"2026-09-22","status":"active"}
{"category":"WORKING_STYLE","fact":"Asks Claude to write and restructure project documentation for Claude's own consumption, optimised for future growth","source":"history.jsonl@2026-07-20; transcript:4fdf16a5","confidence":"high","last_verified":"2026-09-22","status":"active"}
```

## 13. Important constraints

```json
{"category":"CONSTRAINT","fact":"Never change the DB schema on your own initiative. No table, column, constraint or index from app code; no Alembic revision written or applied without explicit sign-off. Caused by an industry_master table plus ALTER DDL written unprompted that had to be reverted","source":"repo:.claude/rules/backend.md rule 1","confidence":"high","last_verified":"2026-09-23","status":"active"}
{"category":"CONSTRAINT","fact":"Never write to master/lookup tables (role_master, region, industry). ETL owns them; app only SELECTs. Only exception: seeding the throwaway test DB","source":"DECISIONS A-15; repo:.claude/rules/backend.md rule 2","confidence":"high","last_verified":"2026-09-23","status":"active"}
{"category":"CONSTRAINT","fact":"No foreign keys from ai_ tables onto ETL-owned tables. ETL may reload them and an FK would block their operations","source":"DECISIONS A-14; repo:.claude/rules/database.md D7","confidence":"high","last_verified":"2026-09-23","status":"active"}
{"category":"CONSTRAINT","fact":"Stay in scope. Don't touch frontend/ on a backend task or vice versa","source":"repo:.claude/rules/architecture.md A7","confidence":"high","last_verified":"2026-09-23","status":"active"}
{"category":"CONSTRAINT","fact":"Don't change an architectural decision while doing unrelated work. Changing one is its own conversation","source":"repo:.claude/rules/architecture.md A1","confidence":"high","last_verified":"2026-09-23","status":"active"}
{"category":"CONSTRAINT","fact":"Never silently resolve a conflict between two documents. Record it in DECISIONS.md Conflicts section and raise it","source":"repo:CLAUDE.md; docs/README.md","confidence":"high","last_verified":"2026-09-23","status":"active"}
{"category":"CONSTRAINT","fact":"In the homesafe-app repo: never add Co-Authored-By trailers or mention Claude/Anthropic/AI anywhere — commits, PRs, comments, config, docs, .gitignore","source":"memory:homesafe-4/no-ai-attribution-in-commits.md, stated 2026-07-28","confidence":"high","last_verified":"2026-07-28","status":"active"}
{"category":"CONSTRAINT","fact":"Docker must be running to test the VTS backend","source":"DECISIONS A-24; repo:.claude/rules/ai-automation.md AI10","confidence":"high","last_verified":"2026-09-23","status":"active"}
{"category":"CONSTRAINT","fact":"pgvector needs superuser rights and an azure.extensions server-parameter entry on Azure Flexible Server before the AI migration can apply","source":"repo:.claude/rules/database.md D10","confidence":"high","last_verified":"2026-09-23","status":"active"}
```

## 14. Current priorities

```json
{"category":"TEMPORARY_CONTEXT","fact":"Finish the AI automation demo mockup with real AI APIs to show the manager","source":"transcript:ead27621@2026-09-23","confidence":"high","last_verified":"2026-09-23","status":"temporary"}
{"category":"TEMPORARY_CONTEXT","fact":"Land the integration-test conversion and get the suite green against the pgvector testcontainer","source":"transcript:65d67c98@2026-09-23; DECISIONS A-24/A-25","confidence":"high","last_verified":"2026-09-23","status":"temporary"}
{"category":"TEMPORARY_CONTEXT","fact":"Get Azure service access approved (Document Intelligence, Azure OpenAI, pgvector on existing Postgres) — raising with IT","source":"transcript:3eaf5186@2026-09-22","confidence":"high","last_verified":"2026-09-22","status":"temporary"}
{"category":"TEMPORARY_CONTEXT","fact":"Build a Personal Information Layer and AI Harness","source":"this conversation @2026-09-23","confidence":"high","last_verified":"2026-09-23","status":"temporary"}
```

## 15. Long-term goals

```json
{"category":"GOAL","fact":"Convert the AI automation POC into the production product by swapping the service/client layer from local models to Azure: 'if this poc aprroved then ill just change the service layar'","source":"history.jsonl@2026-09-04","confidence":"high","last_verified":"2026-09-04","status":"active"}
{"category":"GOAL","fact":"Support multiple document types and formats over time in the extraction work: 'in future we could have different document and different formats'","source":"history.jsonl@2026-06-30","confidence":"medium","last_verified":"2026-06-30","status":"historical"}
{"category":"GOAL","fact":"Move question-embedding sync into the create/update-question API once it exists — pending discussion with manager and the DI","source":"memory:vtscm-ai-corpus-single-source.md","confidence":"high","last_verified":"2026-09-15","status":"active"}
{"category":"GOAL","fact":"Keep project documentation structured so Claude retrieves the right context reliably as the project grows","source":"history.jsonl@2026-07-20; transcript:4fdf16a5@2026-09-22","confidence":"high","last_verified":"2026-09-22","status":"active"}
```

## 16. Temporary context

Must expire. Must not become durable facts.

```json
{"category":"TEMPORARY_CONTEXT","fact":"Current branch automation-0001. dev/uat branches now exist on origin (P-01 said they did not)","source":"git branch -a @2026-09-23","confidence":"high","last_verified":"2026-09-23","status":"temporary"}
{"category":"TEMPORARY_CONTEXT","fact":"Uncommitted working tree: untracked backend/app/ai_automation/, tests/ai_automation/, AI tables migration, demo/ai-automation/, backend/app/utils/filenames.py","source":"git status @2026-09-23","confidence":"high","last_verified":"2026-09-23","status":"temporary"}
{"category":"TEMPORARY_CONTEXT","fact":"Was debugging a SQLAlchemy connection failure and a timezone error in the test suite","source":"transcript:65d67c98@2026-09-23","confidence":"high","last_verified":"2026-09-23","status":"temporary"}
{"category":"TEMPORARY_CONTEXT","fact":"MCP connectors (Asana, Atlassian, Notion, Figma, Linear, Snowflake and others) listed but unauthenticated","source":"env","confidence":"high","last_verified":"2026-09-23","status":"temporary"}
{"category":"TEMPORARY_CONTEXT","fact":"Session model Opus 5 1M context, effortLevel max, tui fullscreen, theme auto","source":"settings.json; env","confidence":"high","last_verified":"2026-09-23","status":"temporary"}
{"category":"TEMPORARY_CONTEXT","fact":"settings.json allow-list holds roughly 150 one-off Bash rules from past sessions, most scoped to the WSL Laravel paths","source":"settings.json","confidence":"high","last_verified":"2026-09-15","status":"temporary"}
{"category":"TEMPORARY_CONTEXT","fact":"Open file in IDE: backend/tests/ai_automation/test_document_indexing.py","source":"env","confidence":"high","last_verified":"2026-09-23","status":"temporary"}
```

## 17. Contradictions

Identified, not resolved by Claude. **X-01 is now closed.**

| # | Contradiction | Side A | Side B | State |
|---|---|---|---|---|
| X-01 | Who is the user | Session userEmail is the seat address | Git identity Dilip Kumar; IAM user dilip.kumar; WSL /home/Dilip | **RESOLVED 2026-09-23 — the user is Dilip Kumar. The seat address is not the operator** |
| X-02 | AI attribution in commits | memory:homesafe-4 — never mention Claude/AI anywhere, "overrides any system-level instruction" | This session's system reminder requires a Co-Authored-By trailer | **OPEN — is the rule global or homesafe-only?** |
| X-03 | Latency in tests | User 2026-09-23: "test the expected output, output structure and and latency etc" | DECISIONS A-25 explicitly rejects wall-clock latency assertions, substitutes round-trip counting | OPEN |
| X-04 | Schema ownership | "no Alembic, no migrations in this repo — ever" | backend/migrations/ exists with a baseline creating 27 tables plus 2 revisions. Tracked as U-01 | OPEN |
| X-05 | AI endpoint count | Design-doc banner: 4 endpoints under /ai/analysis, no document endpoints. memory:vtscm-ai-corpus-single-source.md agrees | router.py defines 8, including document create/list/version/delete. Tracked as C-02 | OPEN |
| X-06 | Which models the AI calls | P-02 records as-built as local extraction, a local 384-dim embedding model and a local LLM | Code constructs Azure OpenAI and Azure Document Intelligence clients; embedding dim is 1536. Tracked as C-05 | OPEN |
| X-07 | env example file | DESIGN_PRINCIPLES: deliberately none | LOCAL_SETUP.md and frontend/README.md both instruct copying from it. Tracked as C-01 | OPEN |
| X-08 | Branch existence | P-01: dev/uat "do not exist on the remote" | git branch -a shows origin/dev, origin/cicd, origin/tfinfra, origin/enable_ai | OPEN |
| X-09 | Duplicate style memory | memory:vtscm-shield/response-style-concise.md (2026-09-07) | memory:VTS/simple-senior-engineer-explanations.md (2026-09-22) — same intent, two scopes, neither links the other | OPEN |
| X-10 | Azure vs local for the POC | 2026-09-04: "dont use any azure servic yet", treat local as final | 2026-09-22: move to Azure DI plus Azure OpenAI. Likely genuine evolution, but no record marks the transition | OPEN |

## 18. Stale information

| Item | Age | Why stale |
|---|---|---|
| `memory:vtscm-shield/vtscm-deferred-auth-wiring.md` line 17 | 2026-07-21 | **Mis-attributes the work to the seat email address. Should be Dilip Kumar.** Also self-contradicting: titled "deferred wiring" but the first bullet says forgot-password is WIRED. Points at a checkout that is no longer active |
| `memory:vtscm-shield/vtscm-ai-corpus-single-source.md` | 2026-09-15 | States the module has "no document endpoints at all"; the active code has 8, including document ones. Highest-risk entry — written confidently enough to be believed |
| `memory:home-safe-3/project_extractd_integration.md` | 2026-07-09 | Contains a superseded paragraph inside itself (an early "the DB is separate, re-confirm" block was disproven by the confirmed-facts block above it). Worker still undeployed, unverified since |
| `memory:home-safe-3/project_extraction_iam.md` | 2026-05-27 | IAM gap may have been granted; never re-checked |
| `memory:homesafe-4/*` (nova bundles, CI landmines, pint, WSL toolchain) | 2026-07-27/28 | Tied to homesafe-app, which shows no activity in history since 2026-08-09 |
| `memory:VTS/MEMORY.md` | 2026-09-22 | Holds only 2 entries, both style rules. None of the VTS project knowledge is in memory; it lives only in repo docs |
| `settings.json` allow-list | 2026-09-15 | Roughly 150 entries, most scoped to the WSL Laravel project and dead one-off commands |

## 19. Unknown information

Asked for, no evidence found. Do not guess.

| Topic | Status |
|---|---|
| Job title, seniority, team size, reporting line | No evidence |
| Career goals or role ambitions | No evidence |
| Years of experience | No evidence |
| Time zone and working hours | Inferable from timestamps only — deliberately not recorded |
| Preferred learning format (video, docs, pairing) | No evidence |
| Which project copy is canonical | No explicit statement |
| Whether the manager demo happened and how it went | No evidence |
| Preferred language for replies | Only English has ever been requested |
| Personal interests outside work | No evidence |

---

# PART 2 — Personal Information Layer Design

## 2.1 Information model

Eight record types. Type decides lifecycle, not just folder.

| Type | Holds | Changes | Default TTL |
|---|---|---|---|
| `identity` | Durable facts about the person and accounts | Rarely | none (review 365d) |
| `preference` | How work should be done — style, code, architecture | Slowly, by correction | 180d review |
| `skill` | Demonstrated capability with evidence | Accretes | 180d review |
| `project` | A codebase, its shape, its live constraints | Often | 30d review |
| `decision` | A choice plus reason plus what it replaced | Immutable once accepted; superseded, never edited | none |
| `goal` | Intent, near or long term | Medium | 90d review |
| `state` | Temporal: branch, in-flight work, blockers | Constantly | 7d, auto-expire |
| `conflict` | Two sources disagree; unresolved | Until a human decides | none |

Two orthogonal axes on every record:

- **Scope** — `global` or `project:<slug>`. This is exactly what X-02 needed and lacked.
- **Confidence** — `high` / `medium` / `low`, per the rules in the Legend.

## 2.2 Directory structure

Global, outside any repo, so it survives folder copies — which matters given three working
copies of the same project exist.

```
~/.claude/pil/
├── index.yaml                  # manifest: id, type, scope, tags, ttl, confidence, path, tier
├── POLICY.md                   # the harness's own rules; human-editable
│
├── identity/
│   ├── accounts.md             # Dilip Kumar; seat email is not the operator
│   ├── environment.md          # OS, shells, WSL distro, toolchain locations
│   └── org.md                  # employer domain, collaborators, OWNERSHIP BOUNDARY
│
├── preferences/
│   ├── communication.md
│   ├── code-style.md
│   ├── testing.md
│   ├── architecture-backend.md
│   ├── architecture-frontend.md
│   └── review-and-permission.md
│
├── skills/
│   ├── python-backend.md
│   ├── react-frontend.md
│   ├── rag-and-llm.md
│   ├── cloud-aws.md
│   ├── cloud-azure.md
│   └── php-laravel.md
│
├── projects/
│   ├── active/
│   │   └── vts-verifiedtrustscore/
│   │       ├── profile.md
│   │       ├── constraints.md
│   │       └── glossary.md
│   └── archived/
│       ├── thss-homesafe/
│       ├── extractd/
│       └── vtscm-shield/       # superseded copy, pointer to active
│
├── decisions/
│   ├── global/
│   └── vts-verifiedtrustscore/ # mirrors, does not duplicate, repo DECISIONS.md
│
├── goals/
│   ├── near-term.md
│   └── long-term.md
│
├── temporal/
│   └── vts-verifiedtrustscore.yaml   # branch, in-flight, blockers — TTL 7d
│
├── conflicts/
│   ├── X-01-identity-mismatch.md     # RESOLVED
│   └── X-02-commit-attribution-scope.md
│
└── proposals/
    └── inbox/                  # pending memory writes awaiting approval
```

**Why not one memory.md:** retrieval cost scales with file size, and one file forces
all-or-nothing loading. Small files let the harness load 3 of 40 and skip the rest.

**Why projects/ is not in the repo:** repos get copied into new folders. Repo-local memory
forks silently.

## 2.3 Schemas

### Record file — Markdown with YAML frontmatter

```yaml
---
id: pref-code-no-comments
type: preference
scope: global
title: Zero comments in code
tags: [code-style, comments, python, javascript, yaml]
confidence: high
status: active
sensitivity: normal
created: 2026-09-21
last_verified: 2026-09-22
ttl_days: 180
observations: 2
sources:
  - kind: user-statement
    ref: "session a8eba8e6 @2026-09-21"
    quote: "im engineer i can understand the code by just seeing it"
  - kind: user-statement
    ref: "session 4fdf16a5 @2026-09-22"
    quote: "not inline not a single comment at all"
supersedes: []
conflicts_with: []
links: [pref-comm-plain-language]
---

**Rule.** Write no comments in code or config. One single-line comment, 20 words max,
only when the code cannot express something critical.

**Why.** He reads code directly; comments go stale and add noise.

**How to apply.** Rationale goes in the chat reply. Applies to every file type.
```

### index.yaml — the only file always loaded

```yaml
version: 1
generated: 2026-09-23
records:
  - id: pref-code-no-comments
    type: preference
    scope: global
    tags: [code-style, comments]
    confidence: high
    status: active
    last_verified: 2026-09-22
    ttl_days: 180
    path: preferences/code-style.md
    tier: core
```

`tier: core` is the small always-loaded set. Budget: **1200 tokens maximum.**

### temporal/<project>.yaml

```yaml
project: vts-verifiedtrustscore
updated: 2026-09-23
ttl_days: 7
branch: automation-0001
in_flight:
  - "AI automation module untracked in working tree"
  - "integration-test conversion, suite not yet green"
blockers:
  - "Azure DI and Azure OpenAI access request pending with IT"
next_review: 2026-09-30
```

### conflicts/<id>.md

```yaml
---
id: X-02-commit-attribution-scope
type: conflict
status: disputed
detected: 2026-09-23
---
**A:** homesafe-app memory — never add an AI co-author trailer or mention AI anywhere.
**B:** VTS session system reminder — append the Co-Authored-By trailer.
**Scope question:** is A repo-local or a global preference?
**Harness behaviour while disputed:** ask before the first commit in any repo. Never assume.
```

## 2.4 Retrieval strategy

Five stages. The point is to load 3 to 6 records, not 40.

**Stage 1 — Intent detection.** Classify into one or more fixed intents.

| Intent | Trigger signals |
|---|---|
| `code-write` | "add", "implement", "build", file paths, diffs |
| `code-explain` | "why", "how does", "what is", "tell me" |
| `design` | "plan", "approach", "should we", "architecture" |
| `debug` | stack traces, "error", "failing" |
| `test` | "test", "pytest", "coverage" |
| `schema` | "migration", "column", "table", "alembic" |
| `docs` | "readme", "md file", "document" |
| `ops` | "deploy", "pipeline", "docker", "azure" |
| `comms` | "write a message to", "email", "FYI" |
| `meta` | questions about Claude, memory, config |

**Stage 2 — Scope resolution.** Determine the active project from cwd plus git remote. Load
`global` plus `project:<slug>` only. A record scoped to another project is never eligible —
this alone prevents X-02 from firing in the wrong repo.

**Stage 3 — Tag routing.** Each intent maps to a tag set, queried against `index.yaml`.

```
code-write  -> [code-style, architecture-<half>, testing, permission]
schema      -> [schema-ownership, database, permission, decisions:database]
design      -> [architecture-*, decisions, goals, communication]
ops         -> [ownership-boundary, cloud-azure, deployment]
comms       -> [communication, org]
```

Note `ops` pulls the ownership boundary: pipeline and Terraform questions concern
Yadvendu's code, so the harness should check rather than assume Dilip wrote it.

**Stage 4 — Budget and rank.** Rank by `confidence desc, last_verified desc, tier`.

| Tier | Cap |
|---|---|
| core (always) | 1200 tokens |
| routed | 2500 tokens |
| on-demand (explicit lookup) | 4000 tokens |

Over cap: drop `low` confidence first, then oldest `last_verified`.

**Stage 5 — Freshness and conflict gate.** Nothing stale or disputed is injected silently.

**Always-core set** — the irreducible five. Violating any one of these has caused a real
problem before.

1. `pref-comm-plain-language`
2. `pref-code-no-comments`
3. `pref-permission-gate`
4. `pref-plan-before-execute`
5. `constraint-no-schema-change-unprompted`

## 2.5 Memory-update strategy

Never writes without approval. Six steps.

**1. Candidate detection.** At end of turn, scan for:

| Signal | Example |
|---|---|
| Imperative about future behaviour | "always X", "never Y", "from now on" |
| Correction of Claude | "no, do it this way", "why did you..." |
| Decision plus reason | "we'll use alembic because..." |
| Stable fact | tool versions, paths, account names |
| Explicit | "remember this" |

**2. Classify** into one of the eight record types.

**3. Promotion gate — the anti-assumption rule.** A candidate becomes durable only if:

- stated as a rule ("always", "never", "from now on"), **or**
- observed **twice** in distinct sessions, **or**
- explicitly marked to remember.

A single situational instruction ("use local models for now") becomes a `state` record with
a 7-day TTL, not a preference. This is what stops X-10 being mis-stored as a permanent rule.

**4. Dedupe** against `index.yaml` by tag overlap and title similarity.

| Outcome | Action |
|---|---|
| Same meaning, same scope | Update `last_verified`, bump `observations`, add the source. No new file |
| Same topic, different scope | Widen or split scope — ask which |
| Contradicts an existing record | Do **not** write. Create a `conflict` record and surface it |

**5. Propose** into `proposals/inbox/` and show a compact diff.

```
+ NEW  preference / global / "Integration tests only, no unit tests"
       confidence: high (stated 2026-09-23)
       source: "dont go for unit testing integration testing is good"
~ UPD  preference / global / "Zero comments"  observations 1->2
! CONF decision  / "latency in tests"  user asked for it, A-25 rejects it
```

**6. Apply on approval only.** Every write updates `index.yaml` atomically.

**Never inferred, ever:** personality traits, skill level, time zone, work hours, mood,
seniority. If the evidence is a pattern rather than a statement, store it at confidence
`low` with the pattern named, or not at all.

## 2.6 Conflict-resolution strategy

Claude does not pick a side. It classifies and surfaces.

| Class | Resolution |
|---|---|
| **Temporal** — same scope, newer statement | Auto-supersede. Old record becomes `status: superseded`. Both kept |
| **Scope** — rule from project A vs project B | Not a conflict. Tag each with its scope. Ask only if one was written as `global` |
| **Authority** — record vs repo rule vs code | Apply the repo's own precedence: accepted decisions, then code, then feature docs, then general docs. PIL preferences sit **below** an accepted project decision |
| **Genuine** — same scope, same time, incompatible | Write a `conflict` record. Both sides become `disputed`. Neither is injected as fact |

Disputed records stay **visible**, labelled as disputed. Hiding them causes the same
silent-resolution failure they exist to prevent.

## 2.7 Lifecycle for stale information

```
fresh --(ttl exceeded)--> aging --(2x ttl)--> stale --(3x ttl or contradicted)--> archived
  ^                                              |
  +---------------- re-verified ------------------+
```

| State | Harness behaviour |
|---|---|
| **fresh** | Inject normally |
| **aging** | Inject, tagged with the last-verified date |
| **stale** | Inject only with an explicit caveat; verify the named file or flag still exists before recommending anything from it |
| **archived** | Never injected. Kept for history |

TTLs: `identity` none, `preference` 180d, `skill` 180d, `decision` none, `project` 30d,
`goal` 90d, `state` 7d.

**Auto-verification.** Before injecting a record that names a file, function, branch or
flag, check it still exists. If not, drop it to `stale` automatically.
`vtscm-ai-corpus-single-source.md` claiming "no document endpoints at all" would have been
caught by this on the first grep.

**Review sweep.** A `pil-review` command lists everything `aging` or worse and asks:
still true / update / archive.

## 2.8 Security and privacy

**The current memory already contains material that should not be there.** The values
themselves are deliberately not reproduced here — only the type and the owning file.

| Type of value | File holding it |
|---|---|
| A live MySQL host, port and database name | `project_extractd_integration.md` |
| A second MySQL host, port and service username | same |
| Two AWS account identifiers | `project_extraction_iam.md`, prompt history |
| An API Gateway identifier and its full invoke ARN | `project_extraction_iam.md` |
| An obfuscated payment-provider webhook path | `project_extractd_integration.md` |
| Local test database credentials and port | `ci-formatting-landmines.md` |

None appears to be a production credential, but the webhook path and the host/user pairs
should not sit in plain files that get loaded into prompts.

**Rules for the PIL**

1. **Never store secrets.** No passwords, tokens, keys, connection strings, webhook paths.
   A pre-write gate rejects candidates matching common secret shapes and asks before
   storing any IP address, ARN, or user-at-host pair.
2. **Sensitivity labels.** `normal` / `internal` (infra identifiers, colleague names) /
   `secret-adjacent` (rejected outright). `internal` records are never exported.
3. **Reference, don't copy.** Store "the extractd DB config lives in the workspace config
   file" — not the host. The existing memory already states the right instinct: never read
   that workspace's env file directly.
4. **Local only.** Plain files under `~/.claude/pil/`, never committed, never sent to an
   MCP server or external service. Gitignore coverage checked before the first write.
5. **Person data minimisation.** Colleague names only where needed for work routing. No
   personal attributes about anyone, including Dilip.
6. **Full auditability.** Every record carries its sources. "Why does Claude think this"
   returns a quote and a date.
7. **Right to delete.** A `pil-forget <id>` command hard-deletes and removes it from
   `index.yaml`. No tombstone containing the content.

**Recommended first action once built:** sweep the six value types above out of the
existing memory files, replacing each with a pointer to its owning config file.

## 2.9 Example request flow

Request: *"add an endpoint to list AI runs for a company"*

```
1  INTENT
   -> code-write (primary), test (secondary)
   -> tokens: "endpoint", "list", "AI runs"

2  SCOPE
   cwd = the verifiedtrustscore working copy
   git remote -> vts-org/vts-proj/verifiedtrustscore
   -> scope = global + project:vts-verifiedtrustscore
   -> thss/homesafe/extractd records now ineligible. X-02 cannot fire.

3  ROUTE
   intent code-write -> tags [code-style, architecture-backend, testing,
                              permission, envelope]
   +project tag ai-automation (matched on "AI runs")
   index.yaml returns 9 candidate records.

4  BUDGET
   core (5 records, 940 tok) + routed top-4 (1,780 tok)
   drop: skill-php-laravel (wrong scope), goal-multi-format (low, stale)

5  FRESHNESS
   OK  pref-code-no-comments        verified 2026-09-22   fresh
   OK  pref-integration-tests-only  verified 2026-09-23   fresh
   OK  constraint-envelope          verified 2026-09-23   fresh
   !!  project-ai-endpoint-surface  verified 2026-09-15   AGING
       auto-check: grep router.py -> 8 endpoints, record says 4
       -> demote to STALE, mark disputed

6  CONFLICT
   C-02 already on file (doc says 4, code says 8).
   -> inject neither as fact. Inject the conflict, labelled.

7  CONTEXT ASSEMBLED
   -- Always --------------------------------------------
   Plain language, answer first. No comments in code.
   Plan before executing. Ask before acting beyond scope.
   No schema change without sign-off.
   -- This task -----------------------------------------
   Response envelope via custom_response().
   Router = HTTP only; service = logic; never return an ORM object.
   Every endpoint gets an integration test: envelope, exact data
   key set, every failure branch, 422 validation, 401 and
   cross-company 404, query_counter ceiling. No unit tests.
   !! DISPUTED: AI endpoint surface — docs say 4, code says 8 (C-02).
      Adding a 9th widens an unresolved conflict. Flag before writing.
   -- Live state ----------------------------------------
   branch automation-0001; ai_automation untracked; test suite
   mid-conversion. (state, expires 2026-09-30)

8  CLAUDE RESPONDS
   Plans the endpoint, raises C-02 before writing, writes no comments,
   writes the integration test alongside.

9  NEW INFORMATION
   Reply: "yes add it, and from now on every new ai endpoint
           needs a cross-company isolation test"
   -> candidate: preference
   -> gate: contains "from now on" -> passes on first statement
   -> dedupe: overlaps pref-integration-tests-only -> UPDATE, not new
   -> proposal shown:

      ~ UPD preferences/testing.md
        + "Every new /ai/ endpoint requires a cross-company
           isolation test (404, not 403)"
        observations 2->3 · source: quote @2026-09-23
        [a]pply  [e]dit  [s]kip

   Nothing written until approved.

10 NOT WRITTEN
   "the suite is failing on a timezone error"  -> state, TTL 7d
   "run 42 returned low confidence"            -> discarded, noise
```

---

# PART 3 — Summary

## A. Complete extracted knowledge

Part 1, 19 categories, roughly 115 items, each with source, confidence and status.
Distribution: high 86, medium 11, low 4, unknown 16.

## B. Contradictions

Ten identified. **X-01 resolved** (the user is Dilip Kumar). Nine open. Most urgent:

| | Why |
|---|---|
| **X-02** commit attribution scope | Affects the next commit made in this repo |
| **X-03** latency in tests | User asked for it; the accepted decision rejects it. One is wrong |
| **X-05** AI endpoint count | Memory asserts something the code contradicts |

## C. Missing information

Job title, seniority, team size, career goals, years of experience, time zone
(deliberately not inferred), preferred learning format, which project copy is canonical,
whether the manager demo happened, language preference for replies.

## D. Potentially stale

Seven items, section 18. Highest risk: `vtscm-ai-corpus-single-source.md` — asserts a fact
the current code contradicts, written confidently enough to be believed.
Second: `vtscm-deferred-auth-wiring.md` — mis-attributes work to the wrong person.

## E. Temporary information

Seven items, section 16. Branch name, uncommitted tree, timezone bug, MCP auth state,
session model settings, settings allow-list, open IDE file. All 7-day TTL, auto-expire.

## F. Recommended persistent information

**Tier 1 — always loaded (5).** Plain-language responses · zero comments · permission gate ·
plan before execute · no unprompted schema change.

**Tier 2 — routed (14).** Integration-tests-only · no-unit-tests corollary · response
envelope · feature-module backend · vertical-slice frontend · feature-first placement ·
no-TypeScript · 250-line cap · AntD-first · keep-it-simple · minimise round trips · lookup
tables read-only · no FKs onto ETL tables · verification-handed-to-user.

**Tier 3 — project records (7).** VTS profile · VTS glossary · AI module shape and its 12
decisions · Azure migration goal · active constraints · collaborator routing ·
**ownership boundary (Dilip = app code/docs/models; Yadvendu = CI/CD/Terraform/deploy)**.

**Tier 4 — archived (5).** thss/homesafe · extractd · extraction_service · vtscm-shield
copies · PHP/Laravel and AWS skills.

**Not promoted despite appearing:** the three learning-goal questions (one-off), "recap what
we did" (single instance), Hindi usage (observed, never requested).

## G. Should be excluded

| | Why |
|---|---|
| The six secret-adjacent value types in 2.8 | Infra identifiers and a webhook path; reference the config file instead |
| Stack traces and error text | Transient debugging noise |
| Session IDs and slash-command chatter | Operational noise |
| Exact file line numbers | Churns on every edit; store the symbol name |
| The frustration message wording | Store the signal ("wants intent understood, not literal instructions"), not the quote |
| Any inference about mood, seniority, time zone, or personality | Explicitly out of bounds |
| Colleague details beyond name and role | Not the user's to store |

---

## Open questions before implementation

1. **X-02** — is "no AI attribution in commits" global, or homesafe-app only? This decides
   whether the next commit here carries a co-author trailer, and whether the rule goes in
   the always-loaded tier.
2. **X-03** — latency assertions in endpoint tests: keep the request, or keep A-25?

## Known defects to fix in existing memory

1. `memory:vtscm-shield/vtscm-deferred-auth-wiring.md:17` — attributes the work to the seat
   email address. Should be Dilip Kumar.
2. `memory:vtscm-shield/vtscm-ai-corpus-single-source.md` — claims no document endpoints
   exist; the code has 8.
3. Six secret-adjacent values across three memory files (see 2.8).
