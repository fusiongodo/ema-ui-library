# Blender brief · #8 log-scores (Log scores)

Written by the orchestrator. The builder executes; it does not change the design.

## Goal

A blank clay clipboard with a dusty-rose clip on a soft sky-blue tile. Only model: `icon-lab/refs/log-scores.png`. Alex's rule (20 Nov 2026): reference colours are taken exactly. Light, material, render settings and cast shadow come from `clay_theme.py`; per-icon light tweaks only as icon-level overrides (as in `icons/protocol_pill.py`). #7 and #5 must keep rendering identically.

## Geometry (units: board width = 1.0)

**Board**
- Rounded slab, portrait: width 1.0, height 1.18, thickness 0.16.
- Corners in the front view rounded, radius 0.14.
- All edges softly rounded (radius 0.06), so the rim catches light as a lighter border on the top/left and a soft shadow band on the right/bottom, like the reference.
- Front face flat (at most 0.01 dome). No paper sheet, no lines, no text: the board is blank.

**Clip** (centred on the top edge, sitting on the front face)
- Base: rounded block, width 0.46, height 0.20, depth 0.10 in front of the board face, its centre 0.04 below the board's top edge.
- Tab: a half-disc rising from the base, radius 0.17, depth 0.08, with one round through-hole of radius 0.06, centre 0.08 above the board's top edge. You must be able to see the tile through the hole.
- Every edge of the clip rounded (≈ 0.025). Surfaces flat or convex; no saddle shapes, no lips (Alex dislikes them; see #5).

**Mesh:** follow the README memory rules (< 200k faces total, subdivision render ≤ 2). Pick whatever method gives clean flat faces and soft rounded edges (rounded-box SDF projection worked for #5; a beveled mesh is fine too).

## Pose and camera

- Almost frontal: the board faces the camera, view elevation ≈ 8° from above, yaw 0. The front face fills the view; the thickness shows only as the rounded rim.
- Object (board + clip) height ≈ 48 % of the tile, optically centred on the tile (cast shadow excluded).

## Colours (sRGB, measured on the reference, render within about ±6)

| Where | Hex |
|---|---|
| Tile | `#9EC2E4` |
| Board face, middle | `#E7E6E2` |
| Board rim, lit (top/left) | `#F0EFEB` |
| Board rim, right side | `#D9D5CC` |
| Board rim, bottom edge | `#CCC8BF` |
| Clip, lit | `#CA968B` |
| Clip, middle | `#C28D89` |
| Clip, shadow side | ≈ `#B07C75` |

Add `REFERENCE["log-scores"]` to `clay_theme.py` with these values (do not change existing entries or defaults).

## Output (`out/log-scores/`)

- `log-scores.png` (transparent), `log-scores-on-tile.png` (on `#9EC2E4`, cast shadow as in theme).
- `log-scores-sheet.png`: reference and ours side by side at 260 px, both at 60 px below. Second row: clay references from `refs/clay-board/` that show a flat object, if any fit (e.g. `tuki-clay-spreadsheet`, `3dicons-clay-chart`), at 200 px.
- `log-scores.blend`; `./render.sh log_scores` regenerates everything.

## Done means

No facets, seams, clipping (max channel ≤ 250) or saddle shapes; the clip hole is open; at 60 px it reads as a clipboard. Report a measured-vs-target table, render time, face count, peak memory of one render, remaining visible differences. Do not commit.
