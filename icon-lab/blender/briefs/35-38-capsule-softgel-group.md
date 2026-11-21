# Blender briefs #35–#38 · protocol-capsule, protocol-softgel, protocol-group C3 and C4

Written by the orchestrator. The builder executes; it does not change the design.

Common rules and colour sets as in `16-19-new-tiles.md`; use `sdf_kit.py`. Render one after the other, never two Blender processes at once.

## Context

A protocol has a kind, and each kind gets its own clay tile:

| Kind | Example | Tile |
|---|---|---|
| Medication | Naltrexon | tablet (`protocol-pill`, exists) |
| Injection | MOTS-C | `protocol-injection` (exists) |
| Supplement | Taurine | capsule (#35) or softgel (#36) |
| Group | "Morning supplements", 6 items taken together | #37 or #38 |

Alex approved rough sketches (21 Nov 2026):
- capsule: a classic two-tone capsule;
- softgel: an amber oval;
- group, idea C3: an open soft compact with pills spilling out, after the 7-care reference `icon-lab/refs/group/07-*.png`;
- group, idea C4: a floating cluster of mixed pills with no container, after `icon-lab/refs/group/14-*.png`.

He will pick one group variant from the renders.

**All four tiles:**
- Tile colour = `protocol-pill`'s (`#AFB5E5`), so the family reads as Protocols.
- Pose and framing as calendar and guide (frontal, elevation about 8–12°, objects centred, about 64 % of the tile width).
- Same light, material and shadow as `protocol-pill`, so the kinds sit side by side.

## #35 protocol-capsule

- One hard two-part capsule, length 1.0 and diameter 0.38, lying diagonally (lower left to upper right, about 30°).
- **Halves:** one half Coral, the other Cream, with a soft seam where the halves meet (the cap overlaps the body slightly, a shallow step of 0.01).
- **Ends:** fully rounded.

## #36 protocol-softgel

- One softgel: a plump oval, 1.0 × 0.62 × 0.42, lying at about −20°.
- **Colour:** warm amber clay (matte, our material, not glassy). Lit `#F6CF8A`, middle `#E8B460`, shadow `#C98F3E`.
- **Seam:** a very faint seam ridge around the long edge.

## #37 protocol-group-c3 · open compact

- **Case:** a soft rounded compact, a pebble-like rounded oval 1.0 wide, 0.62 deep and 0.26 high, all edges very soft.
  - Body Cream, interior a soft rosé (`#F3D9E8` / `#E3BFD5`).
  - Its lid is hinged at the back and stands open about 100°, the same oval shape, Cream.
- **Inside:** a mixed handful, visible above the rim, 3–4 items:
  - a small Coral/Cream capsule;
  - an amber softgel;
  - a cream round tablet;
  - a Mint/Cream capsule.
- **In front:** two more items have spilled onto the ground plane, a Mint/Cream capsule and a cream tablet, with soft contact shadows.
- **Not a lunch box:** no straight walls, no rectangular box. Think soft pebble, as in the reference.

## #38 protocol-group-c4 · cluster

- Five items floating as one tight, slightly overlapping cluster, no container, each touching or nearly touching its neighbours:
  - a Coral/Cream capsule;
  - a Mint/Cream capsule;
  - a Lilac/Cream capsule;
  - an amber softgel (as #36);
  - a cream round tablet with a score line, as `protocol-pill`.
- The items are at varied angles, the cluster's outline roughly round.
- One soft shared cast shadow below.
- The sizes match the single tiles scaled down, so the capsule of #35 is recognisably the same object.

## Output and sheet

**Files:** the standard set per id (`<id>.png`, `<id>-on-tile.png`, `<id>-sheet.png`, `<id>.blend`), plus `REFERENCE["<id>"]` entries. Earlier icons must render identically.

**Compare sheet:** one extra sheet, `out/protocol-kinds-sheet.png`.
- **Row 1:** at 132 px, the tiles `protocol-pill`, `protocol-injection`, #35, #36, #37, #38.
- **Row 2:** the same at 44 px, on a white card background (`#F5F3F0`), as they appear in the All protocols list.

## Report

Per icon:
- colours measured against target;
- render time, faces and max RSS;
- remaining differences.

Also give the path of the compare sheet. Do not commit, and do not touch anything outside `icon-lab/blender/`. At most 30 min; if time runs short, finish #35, #37 and #38 first.
