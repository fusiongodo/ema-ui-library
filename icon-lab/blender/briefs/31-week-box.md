# Blender brief #31 · week-box (illustration on the Studio setup card)

Written by the orchestrator. The builder executes; it does not change the design.

Common rules, colour sets, output and report are as in `16-19-new-tiles.md`; use `sdf_kit.py`.

## Purpose and output

- The illustration replaces the sleeping person on the Studio card "Set up your protocols". That card is a soft lavender blue, `#E9E9FB`.
- **No tile:** the object is rendered alone on transparency (`week-box.png`) with its soft cast shadow.
- For the sheet, also composite it once on a `#E9E9FB` rounded card (`week-box-on-card.png`), with the object 0.42 of the card height.
- Display size about 110 × 80 px, so it must read at that size.

## Pose

- View from the front and slightly above: elevation 22°, yaw −18°, so the open compartments show.

## Object: a weekly pill organiser, open

**Base**
- A cream rounded bar, 1.0 long, 0.24 deep, 0.16 high.
- Soft edges, radius 0.05.

**Compartments**
- 7 cells in a row, pitch 0.14, each 0.12 × 0.18.
- Each cell is a soft rounded well, depth 0.10, with soft walls between the cells and no hard edges.

**Lids**
- Lids of cells 1, 2, 6 and 7 are closed: a slightly raised cream cap, 0.02, flush on top.
- Cells 3, 4 and 5 are open: their lids stand up behind them, hinged at the back edge and tilted back 70°. Each is a thin cream plate 0.12 × 0.18 × 0.025 with soft edges.

**Pills in the open cells**
- **Cell 3:** one coral capsule, 0.09 × 0.045, lying across.
- **Cell 4:** two lilac round tablets, diameter 0.06, thickness 0.025, slightly overlapping.
- **Cell 5:** one mint capsule, 0.09 × 0.045, at a slight angle.

The lilac is the lighter one, `#CDBBDD` / `#AE9DC2` / `#8C7DA3`.

**Day marks**
- 7 tiny warm-grey dots on the front face of the base, one under each cell (diameter 0.025, raised 0.008).
- If they muddy the object at 110 px, leave them out.

## Report

- Colours measured against the targets.
- Render time, faces and max RSS.
- The remaining differences.
- A 110 px preview inside `week-box-sheet.png`, next to the clay pill tile at the same height.

Do not commit.
