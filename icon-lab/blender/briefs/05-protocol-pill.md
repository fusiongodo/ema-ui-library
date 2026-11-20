# Blender brief · #5 protocol-pill (Protocol item)

Written by the orchestrator. The builder executes; it does not change the design.

## Goal

A clay tablet on a periwinkle tile. Model: the reference `icon-lab/refs/protocol-pill.png` only. Alex's decision (20 Nov 2026): the colours of the reference are taken exactly, like #7. Look, light, material, render settings and cast shadow come unchanged from `clay_theme.py` (the state reached for #7); only geometry, camera tilt and colours are new.

## Geometry (units: tablet diameter = 1.0)

- Round tablet, diameter 1.0, total thickness 0.34.
- Edge: fully rounded all around (rim radius ≈ 0.12), so the side reads as a soft band, never a sharp cylinder edge.
- Top and bottom faces gently domed, dome height 0.05 above the rim plane.
- Score line: one groove straight across the top through the centre. Width 0.035, depth 0.022, rounded (U-shaped) profile, softly fading out where it meets the rounded rim. No hard edges.
- Mesh rules as in the README (coarse voxel + projection, subdivision render ≤ 2, < 200k faces).

## Pose and camera

- Tablet lies tilted toward the camera so we see the top face as a wide ellipse and a band of the side below it: effective view elevation ≈ 38° onto the top face.
- In the image the score line runs from lower left to upper right at ≈ 25° above horizontal.
- Orthographic, same framing logic as #7. Tablet width ≈ 64 % of the tile width, pair centre = tile centre (cast shadow excluded).

## Colours (sRGB, measured on the reference; render must match within about ±6)

| Where | Hex |
|---|---|
| Tile | `#AFB5E5` |
| Top face, lit (upper left) | `#F7F2EC` |
| Top face, middle | `#E8E5E0` |
| Side band, shadow side (right/lower right) | `#BBB2AB` |
| Score line | slightly darker than the face around it, soft (≈ `#E0DBD5` at its deepest) |

Add `REFERENCE["protocol-pill"]` to `clay_theme.py` with these values.

## Output (`out/protocol-pill/`)

- `protocol-pill.png` (transparent), `protocol-pill-on-tile.png` (on `#AFB5E5`, cast shadow as in theme).
- `protocol-pill-sheet.png`: reference and ours side by side at 260 px, both at 60 px below. Second row: the clay pill references from `refs/clay-board/` (fluent-pill, icons8-3dfluency-pill, tuki-clay-pharmacy) at 200 px.
- `protocol-pill.blend`.
- `./render.sh protocol_pill` regenerates everything.

## Done means

No seams, facets, hard edges or clipping (max channel ≤ 250). The score line reads at 60 px. Colours within about ±6 of the table. Report measured values vs targets, render time, remaining visible differences. Do not commit.
