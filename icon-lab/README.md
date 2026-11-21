# Icon Lab

Where our own icons are developed. For each icon there is a reference (someone else's design, kept as inspiration) and three to five variants of our own. Alex approves one variant per icon or rejects all; approved icons go into the Studio theme and the other themes once the whole set is approved.

## What is where

| Path | What |
|---|---|
| `refs/<id>.png` | The reference for one icon, cut out of a screenshot |
| `refs/screens/*.jpg` | The nine full screenshots the references come from |
| `icons/<id>.mjs` | **Source of truth** for our variants: one module per icon with its variants A to E as SVG strings |
| `svg/<id>/<id>-<key>-<name>.svg` | Every variant as a single SVG file, for opening in a design tool |
| `generators/*.mjs` | The scripts that wrote the modules; change a style family here and re-run to retune it across all icons |
| `previews/round-1-*.png` | Contact sheets: all variants next to their reference |
| `decisions/round-<n>.md` | What Alex decided in each round |
| `build.mjs` | Builds the review page `index.html` (not committed) from `icons/` and `refs/` |

## The references are not ours

`refs/` holds another app's artwork. It is here so we can see what inspired a variant and check that ours is different. It must never ship in the app, a theme or a presentation, and it should be removed before this repository is made public.

## Style families

The letters mean the same on every icon. Tiles: A Clay, B Soft flat, C Duotone, D Line, E another motif. Tab glyphs: A Plump, B Cut-out, C Two weights, D Line, E another motif.

## Illustrations · companion (buddy)

| | |
|---|---|
| What | The companion: a small person in four states. `sleep` (head on a pillow under a round blanket, two small z), `awake` (big jumper, both hands round a mug with steam), `listening` (head and shoulders, eyes closed, a slight nod), `speaking` (eyes open, the mouth moves a few times, then rests) |
| Code | `lib/buddy.js`: `buddy(state)` returns the markup; `BUDDY_ART` takes one finished image per state later, with no other file changing |
| Used in | Studio (on Cozy's decorator; Cozy itself is archived): the empty states (a tinted card with nothing in it yet, except "Set up your protocols", where Studio shows the clay week-box; always `sleep`) and Today, next to the greeting (`awake` by day, `sleep` at night). Also the voice screens (`listening`, `speaking`) |
| Style | Soft flat SVG placeholder built from simple shapes (circles, ellipses, rounded paths), no outlines except the face lines. Not clay |
| Palette | Skin `#EDBF9C`, hair `#5B3D33`, face lines `#3B2B27`, blush `#F09C8A` at 50 %, jumper `#F5E7CF` and `#EAD6B6`, pillow `#FFFFFF`. Themed through variables, with these fallbacks: blanket `#FFF4E2`, blanket hem and dots `#F6D9B0`, z `#7A3B0E`, mug `#D9876A` |
| Status | Placeholder until the real companion illustration exists. Kept unchanged. In Studio the Protocols setup card shows the clay weekly pill box (`blender/out/week-box/`) instead of it |

## Statistical emblems · styles A, B, C

The six emblems on the Insights pattern cards (`glyphs/stat-emblems.mjs`, after the approved sketch `glyphs/stat-emblems-sketch.svg`) come in three styles, all thin technical grey lines: **A** a small white tile with fine hatching and one pink accent on the finding; **B** no tile, a larger drawing on the card, grey only; **C** the white tile, grey only, the finding filled solid dark. **A is the default** (the orchestrator's pick; Alex leans to A). In Play, Studio's "Emblems" switch in the Play bar changes the style live (stored as `wf-emblem`). All six in all three styles: `glyphs/stat-emblems-abc.html`. After a change run `node icon-lab/integrate/build-clay-module.mjs`.

## Working on a variant

- Edit the SVG string in `icons/<id>.mjs` (or the generator, for a change across a family), then run `node icon-lab/build.mjs` to see it on the review page.
- The files in `svg/` are an export of the modules, not a second source. An edit made in a design tool has to be carried back into the module.
- When variants change, raise `ROUND` in `build.mjs`; otherwise old decisions apply to new drawings.
