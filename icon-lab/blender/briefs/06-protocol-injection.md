# Blender brief · #6 protocol-injection (Injection)

Written by the orchestrator. The builder executes; it does not change the design.

## Goal

A clay syringe on a sage-green tile. Only model: `icon-lab/refs/protocol-injection.png` (168 px, upscale it to look). Copy its shape, pose, perspective and colours closely (Alex: reference colours exactly; staying close to the model is wanted). Theme look from `clay_theme.py`; light tweaks only as icon-level overrides. Earlier icons must keep rendering identically. Do not look at `icon-lab/svg/`.

## Pose and perspective (keep the reference's)

- Diagonal: needle to the lower left, plunger to the upper right. In the image, the axis runs at ≈ 43° above horizontal.
- The plunger end is tilted slightly toward the camera (≈ 20°), so the flange and thumb cap show a narrow ellipse of their top faces, as in the reference.
- Width of the whole syringe (bounding box) ≈ 63 % of the tile, optically centred (cast shadow excluded).

## Geometry (along the axis, units: total length = 1.0, from the needle tip)

| Part | Axis range | Diameter | Notes |
|---|---|---|---|
| Needle | 0.00–0.21 | 0.022 | thin, cream like the barrel, slightly tapered tip (not sharp-dangerous; rounded at the very end) |
| Hub | 0.21–0.30 | 0.05 → 0.11 | cone with a rounded joint into the barrel nose |
| Nose rings | 0.30–0.37 | 0.18 | two soft rounded rings with a shallow groove between them |
| Barrel | 0.37–0.70 | 0.20 | cylinder, softly rounded ends |
| Graduation marks | on the barrel, on the side facing the camera | | 4 short engraved lines across the axis (length ≈ 0.07, spacing ≈ 0.06), very shallow and soft, as in the reference |
| Flange | 0.70–0.75 | 0.27 | finger-grip disc, thick, all edges rounded |
| Plunger rod | 0.75–0.92 | 0.10 | lilac |
| Thumb cap | 0.92–1.00 | 0.23 | lilac, mushroom-like disc with rounded rim |

- All edges soft clay; no hard cylinder edges.
- The grooves (nose rings, graduation marks) are shallow and made by displacement or a separate inset, with no saddle lips (Alex dislikes them; see #5).
- Mesh rules as in the README (< 200k faces).

## Colours (sRGB, measured on the reference, render within about ±6)

| Part | Lit | Middle | Shadow |
|---|---|---|---|
| Tile | `#9BBC9D` | | |
| Barrel, flange, hub, needle (cream) | `#F1F2EC` | `#DBD4CA` | `#C5BCAE` |
| Graduation marks | | ≈ `#BDB3A6` (soft, not black) | |
| Plunger rod and thumb cap (lilac) | `#C2AFCF` | `#9389A1` | `#736481` |

Add `REFERENCE["protocol-injection"]` to `clay_theme.py`; change no other entry or default.

## Output (`out/protocol-injection/`)

- `protocol-injection.png`, `protocol-injection-on-tile.png`, `protocol-injection-sheet.png` (reference and ours at 260 px, both at 60 px; row 2: syringe or vaccine references in `refs/clay-board/`, if present).
- `protocol-injection.blend`; `./render.sh protocol_injection` regenerates everything.

## Done means

No facets, seams, clipping (≤ 250) or lips; at 60 px it reads as a syringe. Report a measured-vs-target table, render time, faces, max RSS and remaining differences. Do not commit.
