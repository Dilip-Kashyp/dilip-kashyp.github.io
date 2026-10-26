# dilipkashyap.in

Personal portfolio of Dilip Kumar, backend & AI engineer. Plain HTML, CSS and JavaScript: no framework and no build
step, served by GitHub Pages from the repository root.

The page opens with a short intro: the headline, one line about my work and links. There is no nav bar, header or
footer, so the cards get the full height of the screen; `Ctrl K` (or `/`) opens the command palette for search,
sections and the light/dark theme.

After the hero, six cards (About, Experience, Projects, Skills, Ask, Contact) slide up from below as you scroll and
stack in 3D: the arriving card is tilted back and flattens as it lands, and the cards under it shrink, lift and darken.
Experience and Projects are sliders inside a single card. The stack works on every screen, phones included, and
nothing ever scrolls inside a card: a card that fits the window is exactly one screen tall (`stack.js` shrinks it with
CSS `zoom` when it is a little too tall, never below 78%, or 92% on phones). A card taller than that keeps its natural
height: it scrolls through like a normal section, then stays put while the next card slides over it.

## Run locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

Open it through a server rather than as a file: the API console in the Contact card fetches `api/*.json`, which browsers block on `file://`.

## What lives where

| Part | File | Notes |
| :--- | :--- | :--- |
| Page content (hero and the six cards) | `index.html` | Static HTML, readable without JavaScript |
| Theme, layout, components | `assets/css/style.css` | Colour tokens at the top; light theme overrides follow |
| API console (Contact card) | `api/*.json` | Real files: `curl https://dilipkashyap.in/api/me.json` works |
| Card stack, sliders, project tabs, deep links | `assets/js/stack.js` | Links to a slide (`#case-atlas`) open the right card and slide |
| Request-flow diagrams | `assets/js/flows.js` | `FLOWS` holds nodes, layouts and scenario steps per project |
| "Interview my resume" chat | `assets/js/ask.js` | `KB` holds the facts it can answer from |
| Skill evidence, command palette, theme, console | `assets/js/main.js` | `SKILLS` maps each skill chip to where it was used |
| Social preview image | `assets/images/og-card.jpg` | 1200×630, referenced by the Open Graph tags |

`404.html` is served by GitHub Pages for any missing path, so it uses absolute asset paths.

## Updating content

Facts appear in more than one place. When something changes (a new job, a new project), update:

1. `index.html`: the card (a new project is a new `.slide` plus a tab in the Projects card's `.slider-tabs`)
2. `api/me.json` and the other `api/*.json` files
3. `assets/js/ask.js`: the matching `KB` entries, so the chat stays accurate
4. `assets/js/main.js`: `SKILLS`, if a skill gained new evidence

## How the resume chat works

`ask.js` scores the question against each fact with BM25, blends in character-trigram similarity, corrects typos
against the vocabulary (edit distance), and penalises facts that cover only part of the question. Answers below a
0.3 confidence threshold are refused instead of guessed. There is no LLM, and nothing typed leaves the page.

## Keyboard

- `Ctrl K` / `⌘K` or `/`: command palette (sections, links, actions; unknown text goes to the chat)
- Arrow keys switch endpoints in the API console, slides in a focused slider, and tabs inside a project
