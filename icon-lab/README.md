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

## Working on a variant

- Edit the SVG string in `icons/<id>.mjs` (or the generator, for a change across a family), then run `node icon-lab/build.mjs` to see it on the review page.
- The files in `svg/` are an export of the modules, not a second source. An edit made in a design tool has to be carried back into the module.
- When variants change, raise `ROUND` in `build.mjs`; otherwise old decisions apply to new drawings.
