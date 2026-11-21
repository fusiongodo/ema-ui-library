# Brief integrate-03 · "Today · all as planned" in the setup card's composition (Studio)

Written by the orchestrator. The builder executes. Same rules as `integrate-02.md`: Studio only, Wire stays pixel-identical. Read `lib/cozy.js` (studio pass: `.st-planned`, the setup card's `.st-art` swap) and `lib/studio.css` first.

## Why

Alex finds the setup card on Protocols (`protocols/today-folds-empty`) lovely. Its parts are:
- a soft lavender card;
- a warm cream clay pill box at the top right;
- dark title and grey line;
- white chips.

The status card after setup (`protocols/today-folds`, "Today · all as planned") breaks that. It has a cold periwinkle check tile at the left and a saturated blue bar. Give it the setup card's composition.

## Target, per card part

| Part | Now (Studio) | New |
|---|---|---|
| Card | lavender `--st-tint` | unchanged |
| Icon at left | blue check tile (`.cz-ic`) | removed; the title starts at the left edge like "Set up your protocols" |
| Illustration | none | clay pill box at the top right, the same slot, size and offset as the setup card's `.st-art`: `ClayIcons.art["week-box-closed"]`, falling back to `art["week-box"]` while the closed render does not exist yet |
| Title | "Today · all as planned" | unchanged text, the setup card's title style |
| Line | "0 deviations · 22 intakes" | unchanged text, the setup card's line style |
| Bar | blue `.bar` at 100 % | hidden in Studio |
| Chips | none | a row of white status chips in the setup card's chip style (white, dark text, same radius and padding), one per slot: "Morning ✓", "Noon ✓", "Evening · next" |

- **Done slots:** the check is a small dark-ink check, not blue.
- **Upcoming slot:** shown quieter: white at about 60 %, grey text.
- **Taps:** the chips are status, not buttons. No tap target unless one already exists.

## Data

- The chip labels come from the screen data, not from text hard-coded in cozy.js.
- Add a small field to the tile in `screens/protocols/today-folds.js` and in `screens/trials/protocols-today-trial.js` (same tile), for example `st:[["Morning",1],["Noon",1],["Evening",0,"next"]]`.
- `lib/render.js` passes it as a data attribute (as `data-em` / `data-stat` already do), and the studio pass in `lib/cozy.js` builds the chips.
- Check that the trial screen's sub line matches its chips. It says "All as planned · all taken", so all three are done there.
- Wire must ignore the field: pixel-identical.

## "All protocols" clay tile

- In the `CLAY` table, "All protocols" maps to a glyph (`folder`).
- Add the clay id `protocols-folder` to `icon-lab/integrate/build-clay-module.mjs`, size 44, and map "All protocols" to it.
- The render is being made in parallel (`icon-lab/blender/out/protocols-folder/`). Make the module builder skip a missing clay render with a note, as ART already does, and have cozy.js keep the glyph while there is no clay. Then it works before and after the render lands.
- Also add `week-box-closed` to `ART`, with the same box as `week-box`.

## Rules

- Do not touch `lib/themes.css`, `lib/cozy.css`, the root `README.md`, `icon-lab/blender/`, or intro-storyboards.
- Do not commit or publish. At most 30 min.
- Run `./bundle.sh`. Check `protocols/today-folds`, `protocols/today-folds-trial` (or whatever the trial screen's id is) and `protocols/today-folds-empty` in Studio with `/private/tmp/insights-data/shoot.sh <bundle> studio a <id> <out.png> [scrollTop]`.
- Save the shots to `/private/tmp/integrate-03/`. Include a side-by-side of the empty and the planned card: the two must read as one family.
- Pixel-diff Wire `protocols/today-folds` against a HEAD bundle built from `git archive`.

## Report

Under 250 words: files and lines, the shot paths, and the Wire diff result.
