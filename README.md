# dilipkashyap.in

Personal portfolio of Dilip Kumar, backend & AI engineer. Plain HTML, CSS and JavaScript: no framework and no build
step, served by GitHub Pages from the repository root.

## Run locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

Open it through a server rather than as a file: the hero console fetches `api/*.json`, which browsers block on `file://`.

## What lives where

| Part | File | Notes |
| :--- | :--- | :--- |
| Page content (experience, case studies, about, contact) | `index.html` | Static HTML, readable without JavaScript |
| Theme, layout, components | `assets/css/style.css` | Colour tokens at the top; light theme overrides follow |
| Hero API console | `api/*.json` | Real files: `curl https://dilipkashyap.in/api/me.json` works |
| Request-flow diagrams | `assets/js/flows.js` | `FLOWS` holds nodes, layouts and scenario steps per project |
| "Interview my resume" chat | `assets/js/ask.js` | `KB` holds the facts it can answer from |
| Skill evidence, command palette, theme, console | `assets/js/main.js` | `SKILLS` maps each skill chip to where it was used |
| Social preview image | `assets/images/og-card.jpg` | 1200×630, referenced by the Open Graph tags |

`404.html` is served by GitHub Pages for any missing path, so it uses absolute asset paths.

## Updating content

Facts appear in more than one place. When something changes (a new job, a new project), update:

1. `index.html`: the visible section
2. `api/me.json` and the other `api/*.json` files
3. `assets/js/ask.js`: the matching `KB` entries, so the chat stays accurate
4. `assets/js/main.js`: `SKILLS`, if a skill gained new evidence

The "Open to Backend & AI roles" badge is the element marked `data-open-to-work` in `index.html`. Delete that line to
hide it.

## How the resume chat works

`ask.js` scores the question against each fact with BM25, blends in character-trigram similarity, corrects typos
against the vocabulary (edit distance), and penalises facts that cover only part of the question. Answers below a
0.3 confidence threshold are refused instead of guessed. There is no LLM, and nothing typed leaves the page.

## Keyboard

- `Ctrl K` / `⌘K` or `/`: command palette (sections, links, actions; unknown text goes to the chat)
- Arrow keys switch endpoints in the hero console
