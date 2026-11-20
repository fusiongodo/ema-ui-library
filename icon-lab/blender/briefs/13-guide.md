# Blender brief · #13 guide (Guide)

Written by the orchestrator. The builder executes; it does not change the design.

## Goal

A clay light bulb inside a thin flat peach ring, on a soft blue tile. Only model: `icon-lab/refs/guide.png` (221 px, upscale it to look). Copy its shape, perspective, layout and colours closely (Alex: reference colours exactly; staying close to the model is wanted). Theme look from `clay_theme.py`; light tweaks only as icon-level overrides. Earlier icons must keep rendering identically. Do not look at `icon-lab/svg/`.

## Layout on the tile (fractions of the tile width)

- **Ring:** a flat 2D graphic on the tile, as in the reference, so draw it in the composite step, not in 3D.
  - Centred on the tile, centre-line radius 0.37, stroke width 0.036, anti-aliased.
  - The bulb's cast shadow falls over it normally.
  - Add this as an optional per-icon ring in `composite.py` (off for all other icons).
- **Bulb:** centred horizontally, its total height (glass top to cap tip) ≈ 0.48 of the tile and the glass width ≈ 0.30. The vertical centre of the bulb's bounding box is ≈ 0.02 below the tile centre.

## Perspective

Frontal, view elevation ≈ 8° from above, yaw 0, upright.

## Geometry (units: glass width = 1.0)

| Part | Shape |
|---|---|
| Glass | a classic bulb, a near-sphere (width 1.0) whose lower part tapers smoothly into a neck 0.56 wide; glass height from top to neck ≈ 1.02. The silhouette is a smooth pear: no corners, no saddle. |
| Base: two rings | stacked soft rounded bands, each 0.58 wide and 0.12 tall, with a shallow soft groove between them and below the neck (no lips) |
| Base: cap | a rounded dome under the rings, width 0.40, height 0.14 |

Total bulb height ≈ 1.42. The base sits directly under the neck, centred. Mesh rules as in the README (< 200k faces).

## Colours (sRGB, measured on the reference, render within about ±6)

| Part | Lit | Middle | Shadow |
|---|---|---|---|
| Tile | `#A0C1E0` | | |
| Ring (flat) | | `#E6C7AB` | |
| Glass (warm white clay, opaque, not transparent) | `#F5F0EA` | `#DFDED9` | `#CDC9BE` |
| Base rings and cap (terracotta) | `#DFC0AE` | `#BA8E73` | `#9B6E57` |

Add `REFERENCE["guide"]` to `clay_theme.py`; change no other entry or default.

## Output (`out/guide/`)

- `guide.png`, `guide-on-tile.png` (with the ring), `guide-sheet.png` (reference and ours at 260 px, both at 60 px; row 2: bulb or idea references in `refs/clay-board/`, if present).
- `guide.blend`; `./render.sh guide` regenerates everything.

## Done means

No facets, seams, clipping (≤ 250) or lips; it reads as a light bulb in a ring at 60 px. Report a measured-vs-target table, render time, faces, max RSS and remaining differences. Do not commit.
