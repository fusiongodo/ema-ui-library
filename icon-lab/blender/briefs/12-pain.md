# Blender brief · #12 pain (Pain)

Written by the orchestrator. The builder executes; it does not change the design.

## Goal

A clay head with a coral pain burst at the temple. Model: `icon-lab/refs/pain.png` (156 px, upscale it to look). Alex (20 Nov 2026): the earlier SVG variants A–E are rejected and must not be used. Orient closely on the original, but make it better, i.e. a real clay object that fits our set (#7–#11). Do not look at `icon-lab/svg/`.

## What stays from the original

- **Composition and perspective:** a frontal head, slightly from above (≈ 8°), yaw 0.
- **Head:** featureless, egg-shaped and a bit wider at the top. It has small rounded ears on both sides at mid-height, a short neck and a rounded flared base (like a bust foot).
- **Burst:** a star-shaped burst on the upper right of the head, overlapping the head's right silhouette a little.
- **Rays:** three short rays radiating outward from the burst to the upper right.
- **Glow:** a soft coral glow on the head around the burst.

## What gets better (the orchestrator's decisions)

1. **Tile:** a soft sage-mint pastel `#B9D6C8` instead of the grey/white circle, so it belongs to the set. Coral reads strongly against it.
2. **Head colour:** warm cream clay like our other cream parts (lit `#F3EEE8`, middle `#E3DED8`, shadow `#C2BAB1`), not cold grey.
3. **Burst:** a real 3D clay object, not a flat sticker.
   - A puffy star with 7 rounded points (point length ≈ 40 % of its radius, all tips rounded).
   - Thickness ≈ 35 % of its diameter.
   - It sits on the head surface, following its curve.
4. **Rays:** three plump clay capsules with round ends, not lines, slightly tapering toward the outside. They float just off the head, fanning out at about 20°, 45° and 70° from horizontal.
5. **Glow on the head:** a soft coral blush painted into the head material around the burst (radius ≈ 1.6 × the burst radius, fading to cream), so the pain "radiates" into the head. No emission and no bloom.

## Geometry (units: head width without ears = 1.0)

| Part | Size and position |
|---|---|
| Head | width 1.0, height 1.18 (crown to chin), depth 0.95; widest at about 60 % of the height |
| Ears | small rounded tabs, 0.14 wide × 0.24 tall, at mid-height, slightly behind the face plane |
| Neck | width 0.42, height 0.16 |
| Base | flared foot, width 0.66, height 0.12, flat bottom, rounded edges |
| Burst | outer radius 0.20, centre at x +0.30, y +0.30 from the head centre (upper right), on the surface |
| Rays | length 0.13–0.15, thickness 0.05, starting ≈ 0.08 beyond the burst's tips |

Everything convex where possible. Join the neck to the head and base with soft fillets (no pinches). Mesh rules as in the README (< 200k faces).

## Framing

The whole group (head + base + rays) is ≈ 58 % of the tile height, optically centred (cast shadow excluded).

## Colours (sRGB, render within about ±6)

| Part | Lit | Middle | Shadow |
|---|---|---|---|
| Tile | `#B9D6C8` | | |
| Head, ears, neck, base | `#F3EEE8` | `#E3DED8` | `#C2BAB1` |
| Burst and rays (coral) | `#F6AE9E` | `#EE8E7C` | `#D46E5E` |
| Glow on head (peak) | | ≈ `#F0B7A8` | |

Add `REFERENCE["pain"]` to `clay_theme.py`; change no other entry or default.

## Output (`out/pain/`)

- `pain.png` (transparent), `pain-on-tile.png`, `pain-sheet.png` (reference and ours side by side at 260 px, both at 60 px below; row 2: any head or pain references in `refs/clay-board/`, if present).
- `pain.blend`; `./render.sh pain` regenerates everything.

## Done means

No facets, seams, clipping (≤ 250) or pinches; at 60 px it reads as "headache". Report a measured-vs-target table, render time, faces, max RSS and remaining differences. Do not commit.
