# Blender brief #32 · health-watch (illustration on the Studio Insights card "Your tracker already knows more")

Written by the orchestrator. The builder executes; it does not change the design.

Common rules and colour sets as in `16-19-new-tiles.md`; use `sdf_kit.py`.

**Output:** the same as #31 week-box: no tile. Write `health-watch.png` (object plus its soft shadow on transparency, cropped tight with about 4 % margin, 1024 px on the long side), `health-watch-on-card.png` and `health-watch-sheet.png`.

- **Card colour:** take it from the Insights tint (`--st-tint` for Insights in `lib/studio.css`). Ask the orchestrator if it is unclear.
- **Display size:** about 110 px wide.

**Pose**
- Front view, elevation 10°, yaw −15°.
- The watch stands upright as if on a table, the strap curving back on both sides.

**Object: a plump smartwatch**

*Case*
- A cream rounded square: 0.62 wide, 0.70 tall, 0.22 deep.
- Front-view corner radius 0.18; all edges soft.

*Screen*
- A soft shallow inset on the front: 0.50 × 0.58, corner radius 0.13, depth 0.015.
- Colour: the light rosé of the ask bars, lit `#F3D9E8`, mid `#E3BFD5`.

*Heart*
- A small coral-red heart on the screen (Heart coral-red from `22-30-round-3.md`), raised 0.03, width 0.24.
- Centred slightly above the middle, with a puffy round cross-section.

*Pulse line*
- Under the heart, a short coral pulse trace: flat, a small peak, a dip, a tall peak, flat.
- Built as a swept tube, diameter 0.03, span 0.34, raised 0.015.
- If it muddies at 110 px, leave it out and say so.

*Crown*
- On the right side: a small cream cylinder, diameter 0.08, length 0.05, with soft edges.

*Strap*
- Terracotta.
- A soft band, 0.42 wide and 0.08 thick, leaving top and bottom of the case.
- It curves back in a loop behind the case, so from the front only two short visible arcs show, each about 0.22 long, above and below.
- No buckle.

**Report:** as before, plus a 110 px preview in the sheet next to the week-box at the same width. Do not commit.
