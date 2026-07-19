# Contributing to HistoryScapes

Thank you! This project only becomes a "single source of truth for visual history" if
historians, teachers, developers and storytellers all pitch in. Here's how.

## Ground rules

1. **Three voices, always.** Every fact must be written for all three personas:
   - `explorer` — a curious 10-year-old. Fun, concrete, zero jargon.
   - `moviebuff` — connects the history to films, shows and pop culture.
   - `historian` — evidence-first: digs, documents, dates, scholarly debate.
2. **Myth and history stay labelled.** We tell legends with love, but we never present
   them as fact. Archaeology goes in "The Dig Says" / historian facts; legend goes in
   the story text. When scholars disagree, say so ("some scholars read this as…").
3. **Cite in the PR.** Story text doesn't carry footnotes, but your PR description
   should say where a new historian-fact comes from (book, paper, museum, excavation report).
4. **Zero dependencies.** No frameworks, no build step, no CDN scripts. Plain HTML/CSS/JS
   and the in-repo 3D engine. If you can't open `index.html` from disk and see it work,
   it doesn't merge.
5. **Be kind in reviews.** Kids use this site; write and behave accordingly.

## Easy first PRs

### Fix or improve a fact
All story content lives in `sagas/<saga>/data.js`. Edit the text, keep all three
personas, cite your source in the PR. Done.

### Improve a persona voice
Explorer facts should make a kid grin. Movie-buff facts should name actual films.
Historian facts should teach something checkable. If one falls flat, punch it up.

## Adding a whole saga

A saga is a folder under `sagas/` with three files:

```
sagas/rome/
├── data.js      # ROME_DATA = { title, intro, chapters/stops, ... }
├── rome.js      # renderer: reads ROME_DATA, builds the DOM/SVG/3D scenes
└── index.html   # page shell: header, hero, sections, script tags
```

Steps:

1. **Open an issue first** titled `Saga proposal: <era>` with a one-paragraph pitch and
   your planned visual centrepiece (a map? a battle diagram? a 3D monument?).
2. Copy `sagas/troy/` as a starting skeleton.
3. Write the data file first — story beats and all-three-voices facts.
4. Build the visuals. The shared engine gives you:
   - `E3D.createScene(canvas, {mesh, ...})` — 3D scenes (`js/engine3d.js` has temple,
     horse and ship meshes to learn from; `addBox`/`addPrism`/`addQuad` build anything)
   - `HS.renderFacts()` + `data-facts` attributes — persona-aware fact cards
   - `css/main.css` — the full design system (use it; don't invent new palettes)
5. Add your saga card to the landing page `index.html`.

### What makes a good saga
- A **journey or arc** (a war, a voyage, a rise-and-fall) beats a loose topic
- 6–14 beats — enough to feel epic, few enough to finish
- At least one **interactive centrepiece** (map, relationship web, 3D scene)
- A **myth-vs-evidence** section whenever legend and archaeology both exist

## 3D scenes

The engine (`js/engine3d.js`) renders low-poly meshes with flat shading on canvas 2D —
no WebGL, no libraries. A mesh is `{verts: [[x,y,z]…], faces: [{idx: […], color: [r,g,b]}]}`.
Build with the helpers, keep meshes under ~800 faces, and reuse the palette in `E3D.C`.
Test drag-orbit on mobile (touch is supported by the engine).

## Local development

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

No lint step, no tests to run — but please check your pages at 375px and 1440px wide,
and click through all three personas before opening the PR.
