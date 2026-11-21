# Blender briefs #20 and #21 · word-game, arithmetic

Written by the orchestrator. The builder executes; it does not change the design.

The common rules, colour sets, perspective, output and report are the same as in `16-19-new-tiles.md`, including the set-comparison sheet when there is no reference. Use `sdf_kit.py`.

These two tiles complete the 2 × 2 game grid on Check-ins next to dual-n-back and reaction, so compare with those two as well.

---

## #20 word-game · game tile "Word game"

Three cream clay letter tiles in a gentle row, with raised terracotta letters, on a butter-yellow tile.

- **Tile:** `#F1E2B3`. Group width on the tile 0.60, optically centred.

**Letter tiles**
- 3 rounded cubes: front face 0.30 × 0.30 (units: group width = 1.0), depth 0.14, front-view corner radius 0.07, all edges soft (radius 0.03).
- Horizontal gap 0.05, so the three span 1.0.
- Vertical offsets: left tile at 0, middle tile raised by 0.08, right tile at 0.03. The middle tile is rotated +6° in the image plane, the right tile −4°.
- Cream.

**Letters**
- "A", "B" and "C", one per tile, left to right.
- Raised 0.025 from the front face, with soft rounded edges. Make them with Blender's default font as extruded text, then bevel and fillet them so they look moulded, not cut.
- Letter height 0.17, centred on each tile.
- Terracotta.

**Score dots**
- Each tile has one tiny raised warm-grey dot in its lower right corner (diameter 0.03), like a letter score.
- If the dots muddy the tiles at 60 px, leave them out and say so.

---

## #21 arithmetic · game tile "Arithmetic"

A cream clay plate with four raised operator signs in a 2 × 2 grid, on a soft blue tile.

- **Tile:** `#A9C6E8`. Plate width on the tile 0.56, optically centred.

**Plate**
- 1.0 × 1.0, thickness 0.12.
- Front-view corner radius 0.18; edges soft (0.05).
- Cream.

**Signs**
- Each sign is built from plump capsule bars: bar width 0.075, raised 0.05, round ends, soft joins, no lips.
- Each sign sits in its own quadrant, centred at (±0.24, ±0.24) from the plate centre, and spans 0.26.

| Position | Sign | Shape | Colour |
|---|---|---|---|
| Top left | plus | two crossing bars | coral |
| Top right | minus | one horizontal bar | lilac (the lighter lilac of dual-n-back: `#CDBBDD` / `#AE9DC2` / `#8C7DA3`) |
| Bottom left | times | the plus rotated 45° | mint |
| Bottom right | equals | two horizontal bars, 0.10 apart | terracotta |
