# Blender brief · #9 wellbeing (Wellbeing)

Written by the orchestrator. The builder executes; it does not change the design.

## Goal

Three stacked clay pebbles (a balanced cairn) on a soft teal tile: calm, grounded. Only model: `icon-lab/refs/wellbeing.png`. Reference colours are taken exactly (Alex, 20 Nov 2026). Theme look from `clay_theme.py`; light tweaks only as icon-level overrides. Earlier icons (#7, #5, #8) must keep rendering identically.

## Geometry (units: bottom pebble width = 1.0)

All three are smooth, slightly irregular oblate pebbles (flattened ellipsoids with a soft superellipse silhouette, exponent ≈ 2.2), convex everywhere, no facets.

| Pebble | Width | Height | Depth | Colour | Notes |
|---|---|---|---|---|---|
| Bottom | 1.00 | 0.30 | 0.70 | cream | widest, flattest; very slightly fuller on the left |
| Middle | 0.84 | 0.26 | 0.60 | cream | sits on the bottom one, shifted 0.03 left |
| Top | 0.56 | 0.32 | 0.45 | tan | rounder, like an egg on its side; shifted 0.04 left, tilted ≈ 6° (right side lower) |

- Each pebble rests on the one below with a small, believable contact (they touch, they do not intersect visibly). The contact gives a soft dark crease, as in the reference.
- Irregularity: a very low-frequency deformation (≈ 2 % of size), so they read as natural stones, not perfect ellipsoids. No bumps, no texture.
- Mesh rules as in the README (< 200k faces total).

## Pose and camera

- Frontal, view elevation ≈ 10° from above, yaw 0, so the tops of the pebbles barely show.
- Stack height ≈ 47 % of the tile, stack width ≈ 50 % of the tile, optically centred (cast shadow excluded).

## Colours (sRGB, measured on the reference, render within about ±6)

| Where | Lit (upper left) | Middle | Shadow (lower right) |
|---|---|---|---|
| Tile | `#97CACB` | | |
| Top pebble (tan) | `#E3CDB8` | `#CAA98A` | `#957441` |
| Middle pebble (cream) | `#F2EDE9` | `#E2DFDA` | `#C3BDB1` |
| Bottom pebble (cream) | `#EDE8E2` | `#DEDBD6` | `#BEB6AB` |
| Contact crease between pebbles | | | ≈ `#978F82` |

The tan pebble has a strong warm gradient: a light sandy top-left and a deep warm brown lower right. Add `REFERENCE["wellbeing"]` to `clay_theme.py` with these values (do not change existing entries or defaults).

## Output (`out/wellbeing/`)

- `wellbeing.png` (transparent), `wellbeing-on-tile.png` (on `#97CACB`, cast shadow as in theme).
- `wellbeing-sheet.png`: reference and ours side by side at 260 px, both at 60 px below. Second row: `tuki-clay-meditation`, `3dicons-clay-heart`, `fluent-smiling-face-with-smiling-eyes` from `refs/clay-board/` at 200 px.
- `wellbeing.blend`; `./render.sh wellbeing` regenerates everything.

## Done means

No facets, seams, clipping (max channel ≤ 250) or saddle shapes; reads as three balanced stones at 60 px. Report a measured-vs-target table, render time, face count, max RSS of one render, remaining visible differences. Do not commit.
