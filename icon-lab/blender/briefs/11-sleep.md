# Blender brief · #11 sleep (Sleep)

Written by the orchestrator. The builder executes; it does not change the design.

## Goal

A puffy clay cloud in front of a plump lilac crescent moon, on a pale lavender tile. Only model: `icon-lab/refs/sleep.png` (178 px; an upscaled copy helps). Copy its shape, perspective and colours closely (Alex, 20 Nov 2026: reference colours exactly; staying close to the model is wanted). Theme look from `clay_theme.py`; light tweaks only as icon-level overrides. Earlier icons must keep rendering identically.

## Perspective (keep the reference's)

Frontal, view elevation ≈ 12° from above, yaw 0, no image tilt — exactly as the reference. Do not change it.

## Geometry (units: cloud width = 1.0; heights measured from the cloud's bottom)

**Cloud**
- Width 1.0, height 0.58, depth 0.45. Flat-ish bottom with a soft rounded edge (radius ≈ 0.12).
- Three lobes along the top:
  - the left lobe peaks at x 0.14, h 0.42;
  - the large central lobe peaks at x 0.45, h 0.58;
  - the right lobe peaks at x 0.80, h 0.40.
- The valleys between the lobes are soft and shallow, never pinched.
- Pillow-like, rounded in depth too (thickest in the middle).
- The valleys are concave, so do not use SDF projection there (it failed in concave regions before). Use metaballs or a smooth-union voxel remesh plus smoothing, or similar; it must end up free of facets and seams.

**Moon** (behind the cloud, upper right)
- Plump crescent: the outer arc radius is ≈ 0.30, and the crescent is ≈ 0.14 thick at its middle, tapering to rounded tips.
- Cross-section round and puffy, depth ≈ 0.14.
- The bowl opens toward the upper right:
  - the upper tip is at x 0.80, h 0.80 and points up and slightly right;
  - the lower tip is at x 1.04, h 0.39 (just beyond the cloud's right edge) and points right;
  - the body curves through x ≈ 0.52, h ≈ 0.62, mostly hidden behind the central and right lobes.
- It sits behind the cloud, touching or slightly behind it, so the cloud overlaps it.

Mesh rules as in the README (< 200k faces).

## Framing

The group (cloud + moon) is ≈ 60 % of the tile width, optically centred (cast shadow excluded).

## Colours (sRGB, measured on the reference, render within about ±6)

| Part | Lit (upper left) | Middle | Shadow (lower right) |
|---|---|---|---|
| Tile | `#D3CEE5` | | |
| Cloud (warm white) | `#F5F1F0` | `#E3DFDC` | `#BFB7B4` |
| Moon (lilac) | `#BDB2D0` | `#9A8CAD` | `#7E7393` |

- The cloud stays warm white, not bluish.
- The moon's shadow side behind the cloud is the darkest area.

Add `REFERENCE["sleep"]` to `clay_theme.py`; change no other entry or default.

## Output (`out/sleep/`)

- `sleep.png` (transparent), `sleep-on-tile.png` (on `#D3CEE5`, cast shadow as in theme).
- `sleep-sheet.png`: reference and ours side by side at 260 px, both at 60 px below. Second row: any cloud, moon or night references in `refs/clay-board/` at 200 px, if present.
- `sleep.blend`. `./render.sh sleep` regenerates everything.

## Done means

- No facets, seams, clipping (max channel ≤ 250) or pinched valleys.
- It reads as cloud + moon at 60 px.
- Report:
  - a measured-vs-target table (per-part masks);
  - render time, faces, max RSS;
  - remaining differences.

Do not commit.
