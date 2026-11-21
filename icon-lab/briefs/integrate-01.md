# Brief integrate-01 · Put the finished icons into the prototype (Studio theme)

Written by the orchestrator. The builder executes. **Phase 1 is a plan only. Build nothing until the orchestrator answers.**

## Goal

All icons of the Icon Lab are approved:
- **Clay tiles**, rendered in Blender (`icon-lab/blender/out/<id>/<id>-on-tile.png`, 1024 px, tile included): protocol-pill, protocol-injection, checkin-chat, log-scores, wellbeing, steps, sleep, pain, guide, calendar.
- **Soft-solid glyphs** (`icon-lab/glyphs/glyphs.mjs`, SVG with currentColor): tab-today, tab-checkins, tab-protocols, tab-insights, evaluation.

They now go into the clickable prototype (`wireframes.html` + `lib/` + `screens/` + `flows/`, bundled by `./bundle.sh`).

## Decisions (the orchestrator's; do not change them)

1. **Studio theme only.** Every change applies under `.frame[data-theme="studio"]` (see the header of `lib/studio.css`). Cozy, Sky, Dusk, Meadow, Wire, Library and Flows must look exactly as before.
2. **Tab bar (Studio):**
   - The four tab icons become the soft-solid glyphs: Today/Home → tab-today, Check-ins → tab-checkins, Protocols/Plans → tab-protocols, Insights → tab-insights. Draw them at 26 px.
   - The active tab gets a pill 52 × 32, radius 16, in the area's `--st-tile` behind the glyph. Glyph and label of the active tab are ink `#2E2C34`; inactive glyph and label are ink at 55 % opacity.
   - If Studio already styles the active tab differently, this replaces it.
3. **Clay tiles (Studio):** wherever Studio shows a small pastel icon tile (`.cz-ic`, made by `Cozy.decorate()` in `lib/cozy.js`) for a thing a clay icon stands for, show the clay render instead.
   - The render brings its own tile and colours. Keep them exactly as rendered, even where they differ from the area pastel; Alex wants the reference colours.
   - Mask it to the same size and corner radius as the Studio tile it replaces.
   - No extra border or shadow.
4. **Evaluation glyph:** the evaluation pattern card on Insights (today the `overview` icon) shows the evaluation glyph instead, in its Studio tile.
5. **"View all trends":** if a link or button to all trends exists on Check-ins or Insights, it becomes the chip: a 48 × 48 rounded square (radius 13) in Insights `--st-tile`, with tab-insights at 24 px, then the label. If no such element exists, do not invent one; say so in the plan.
6. **Images:**
   - Add a generator script `icon-lab/integrate/build-clay-module.mjs`. It downsizes each `-on-tile.png` to 3× its largest display size (expect about 120–144 px), as PNG or WebP. It then writes `lib/clay-icons.js`, which holds the images as data URIs and the glyph SVG strings, imported from `glyphs.mjs` as text.
   - Load `lib/clay-icons.js` in `wireframes.html` and in `bundle.sh` before `lib/cozy.js`.
   - The whole bundle must stay under 3 MB.
7. **Code:** follow the style of `lib/cozy.js` and `lib/studio.css`: short comments that say why, and the existing naming. Keep the icon mapping in one table.

## Mapping (what stands for what; you find the places)

| Clay / glyph | Stands for | Expected places (check each) |
|---|---|---|
| protocol-pill | a substance taken as capsule or tablet | protocol rows and cards of oral items (Magnesium, Naltrexon, Rapamycin …), "Take now", the Protocols tile on Today |
| protocol-injection | a substance given by injection | protocol rows of injected items, if any exist in the data; otherwise unused (say so) |
| log-scores | entering today's scores by hand | "Check-in now", "YOUR CHECK-IN", the manual check-in entry |
| checkin-chat | a check-in as a conversation with the agent | the voice / guided check-in entry, if it has a tile |
| wellbeing | the wellbeing or mood score | score rows where wellbeing or mood is listed |
| pain | the pain score | score rows for pain |
| sleep | sleep from Health or a check-in | Health sleep rows; score rows for sleep |
| steps | steps from Apple Health | Health steps rows and the Steps detail head |
| calendar | the intake calendar, a plan over days | the intake-calendar card on protocol detail; "Consistency · 30 days" |
| guide | a short guide or explanation | "Ways to prepare", "How it works" style tiles in the trial flows |
| evaluation (glyph) | an evaluation of one protocol | the evaluation pattern card on Insights |

## Phase 1: plan (report this, then stop)

1. A table of every place you would change: screen id or flow step, the element or selector, the icon it shows now, and the new icon. Include tab bars.
2. Places that match nothing in the mapping keep their Cozy icon; list them briefly.
3. Where the mapping is ambiguous, give your pick and one line on why.
4. The files you would touch and the expected bundle size.

## Phase 2: build (after the orchestrator answers)

Build it, run `./bundle.sh`, and check every changed screen in Studio with headless Chrome screenshots (phone width), plus one screen each in Cozy and Wire to prove nothing changed there.

Put the screenshots in `/private/tmp/integrate-shots/`, not in the repo. Do not commit or publish.
