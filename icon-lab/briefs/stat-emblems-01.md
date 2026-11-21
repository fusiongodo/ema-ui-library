# Brief stat-emblems-01 · statistical emblems for Insights pattern cards

Written by the orchestrator. The builder executes; Alex has approved the sketch.

## Source of truth

`icon-lab/glyphs/stat-emblems-sketch.svg` holds six emblems, drawn large. Alex loved them ("these are all so good"). Keep their composition and visual language:

- **solid dark outline:** what was measured;
- **dashed grey:** your usual / expected;
- **hatching:** uncertainty / spread;
- **dots:** single days;
- **one pink accent:** the finding itself.

They replace the clay sparkle ("finding") on the Insights pattern cards.

| id | Meaning | Use for |
|---|---|---|
| `stat-before-after` | two distributions, earlier (dashed) vs. now (solid, hatched), means marked | a dose change or a start/stop: "Since you increased …" |
| `stat-earlier-later` | an event dot, a dashed arc, the later effect (pink circle, hatched) | a skip or an intake followed by an effect: "After a skipped …" |
| `stat-goes-together` | scatter with regression line and hatched band | two measures that move together |
| `stat-outside-usual` | a dashed usual band and a line whose last point (pink) leaves it | a day or week outside the usual range |
| `stat-how-sure` | forest plot: estimates with whiskers against a dashed zero line | a summary of how sure several findings are |
| `stat-show-up-together` | two overlapping sets, shared days in pink | symptoms that occur on the same days |

## Build

1. **Glyph source:** add the six to the glyph source, in `icon-lab/glyphs/glyphs.mjs` or a sibling module if that is cleaner. Redraw each for small sizes:
   - **Grid:** 48 grid, drawn at 30–32 px inside the 44 px Studio tile.
   - **Strokes:** thick enough to read at that size (about 2.5–3 on the 48 grid).
   - **Detail:** at most 6 dots.
   - **Hatching:** 3–4 diagonal lines clipped to the shape, not a fine pattern. It must stay visible at 30 px.
   - **Dashes:** about 3 on / 3 off.
2. **Colours:**
   - Main strokes and dots use `currentColor` (the tile's ink).
   - Grey parts use currentColor at about 45 % opacity.
   - The accent uses `var(--st-accent, #D4537E)`, so Studio can set it per area. On the Insights tile use the Insights fill (`--st-fill`, #BF639D) or the pink from the sketch, whichever reads better on the tile. Say which.
3. **Module:** generate them into `lib/clay-icons.js` (the `glyph` map) via `icon-lab/integrate/build-clay-module.mjs`, as already happens for the soft-solid glyphs.
4. **Studio pass (`lib/cozy.js`):**
   - Each Insights pattern card gets the emblem that fits its sentence. Map it by a field on the pattern in the screen data if one exists. Otherwise add a small field (for example `em:"stat-earlier-later"`) to each pattern in `screens/insights/*.js`, and to the copy on `protocols/item-naltrexon`.
   - Use the table above:
     - skip → `stat-earlier-later`;
     - dose change → `stat-before-after`;
     - otherwise pick the best fit, and list your choices.
   - The emblem sits in the pattern's existing Studio tile, on the tile colour, replacing the finding clay. The evaluation card keeps its document glyph.
   - The pinned trial-result card on `insights/home-trial-pinned` gets `stat-before-after`.
5. **Preview sheet:** build an HTML or PNG sheet with all six at 30 px in the Insights tile and at 96 px. Put it in `/private/tmp/stat-emblems/`, so the orchestrator can show Alex.

## Rules

- Studio only. Wire and the archived themes stay pixel-identical.
- Do not touch `lib/themes.css`, `lib/cozy.css`, the root `README.md`, or `icon-lab/blender/`.
- Do not commit or publish. At most 30 min.
- Run `./bundle.sh`. Check `insights/home`, `home-trial-pinned`, `pattern-skip` and `protocols/item-naltrexon` in Studio with headless Chrome.
  - Use a small file:// page that sets `localStorage wf-theme=studio`, then redirects to `.dist/ema-wireframes.html#play/-/<id>`.
  - Use `--virtual-time-budget=30000` and `--allow-file-access-from-files`.
  - Save the shots to `/private/tmp/stat-emblems/`.
- Pixel-diff Wire `insights/home` against a HEAD bundle.

## Report

In under 300 words:
- the mapping table (card → emblem);
- the files and lines changed;
- the accent colour used;
- the paths of the sheet and the shots.
