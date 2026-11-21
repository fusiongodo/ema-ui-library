# Brief integrate-02 · Put the round-3 clay tiles into Studio

Written by the orchestrator. The builder executes. Same rules as `integrate-01.md` (Studio only, one mapping table, every other theme pixel-identical); read it and `lib/cozy.js` (studio pass, `CLAY`, `MEASURE_CLAY`, `HEAD_CLAY`) first.

## New tiles (all approved by Alex)

Renders are in `icon-lab/blender/out/<id>/`.

| Clay id | File to use | Stands for | Expected places (find each) |
|---|---|---|---|
| morning | `morning-on-tile-b.png` (**variant B**) | the morning intake slot | the Morning fold/section on Protocols (today's plan, all protocols), wherever its icon tile is drawn |
| noon | `noon-on-tile-b.png` (**B**) | the noon slot | the Noon fold/section, same places |
| evening | `evening-on-tile-b.png` (**B**) | the evening slot | the Evening fold/section, same places |
| fatigue | `fatigue-on-tile.png` | the fatigue / energy score | trend tiles and score rows for fatigue or energy |
| thirst | `thirst-on-tile.png` | the thirst score | trend tiles and score rows for thirst |
| resting-heart | `resting-heart-on-tile.png` | resting heart rate from Apple Health | the Health tile / row and its detail head |
| hrv | `hrv-on-tile.png` | heart rate variability from Apple Health | the Health tile / row and its detail head |
| finding | `finding-on-tile.png` | a found pattern | the pattern cards on Insights (not the evaluation card, which keeps its glyph) |
| flask | `flask-on-tile.png` | Trials, "find out if something really helps" | the Trials entry on Insights and the head of the trial flow start, if it has an icon tile |

## Rules

1. **Module:** `icon-lab/integrate/build-clay-module.mjs` gets an optional per-id file name, so the three time-of-day ids read the `-b` file. Add the nine ids with their display sizes, then regenerate `lib/clay-icons.js`.
2. **Mapping:**
   - Extend the one `CLAY` table, plus `MEASURE_CLAY` and `HEAD_CLAY` where the id is a measure or a detail head.
   - Keep the existing guards: no clay on the game results, and a mixed grid keeps its icons.
   - A slot fold (Morning/Noon/Evening) gets its clay only where it already shows a pastel icon tile in Studio. Do not invent a new tile.
3. **No match:** if a place in the table does not exist in the prototype, skip it and say so. Do not invent a screen or an element.
4. **Size:** the bundle must stay under 3 MB; report its size.
5. **Files not to touch:** do not touch `lib/themes.css`, `lib/cozy.css`, `README.md` or anything in `icon-lab/blender/`; another session works there.
6. **Build and check:**
   - Run `./bundle.sh`.
   - Check every changed screen in Studio with headless Chrome at 402 px width, 2×.
   - Pixel-diff one Cozy screen and one Wire screen against a bundle built from HEAD (`git archive`) to prove nothing changed there.
   - Put the screenshots in `/private/tmp/integrate-02-shots/`.
7. **Git:** do not commit and do not publish.

## Report

- A table: place, screen id or flow step, old icon, new clay.
- Places skipped, with the reason.
- Bundle size.
- The paths of the screenshots.
