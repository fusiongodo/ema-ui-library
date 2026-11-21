# Blender briefs #16 to #19 · scores, dual-n-back, reaction, ask

Written by the orchestrator. The builder executes; it does not change the design.

## Common rules (all four)

- **No reference image exists:** these are our own designs. They must sit seamlessly in the finished clay set; compare with `out/log-scores`, `out/wellbeing`, `out/calendar` and `out/guide`.
- **Look:**
  - Theme look from `clay_theme.py`; light tweaks only as icon-level overrides.
  - Earlier icons must keep rendering identically.
  - Mesh rules as in the README (< 200k faces). Cycles memory rules apply: never two renders at once.
- **Perspective:** frontal, view elevation ≈ 8° from above, yaw 0, upright, as in calendar and guide.
- **Form:** all edges soft clay. No facets, seams, clipping (max channel ≤ 250), lips, saddles or pinches.
- **Grooves and insets:** shallow and soft.
- **Colours:** within about ±6 of the table, measured with part masks as before.
- **Code:**
  - Add `REFERENCE["<id>"]` to `clay_theme.py` and change no other entry or default.
  - Without a reference, `composite.py` must still build the sheet. Its row 1 shows ours at 260 px next to the finished `log-scores`, `wellbeing` and `calendar` tiles at 260 px, for set comparison; below that, ours at 60 px next to the same three at 60 px.
- **Output** (`out/<id>/`): `<id>.png`, `<id>-on-tile.png`, `<id>-sheet.png`, `<id>.blend`. `./render.sh <script_name>` regenerates everything.
- **Report per icon:**
  - a measured-vs-target colour table;
  - render time, faces, max RSS;
  - remaining differences.
- Do not commit.

Shared colour sets (sRGB, lit / middle / shadow):

| Name | Lit | Middle | Shadow |
|---|---|---|---|
| Cream (bodies) | `#F3EEE8` | `#E3DED8` | `#C2BAB1` |
| Coral (accent) | `#F09A88` | `#E98A78` | `#DB8270` |
| Lilac (accent) | `#C2AFCF` | `#9389A1` | `#736481` |
| Mint (line) | `#9ED6B4` | `#7CC39A` | `#5E9F7B` |
| Terracotta | `#DFC0AE` | `#BA8E73` | `#9B6E57` |
| Warm grey (marks) | | `#BDB4A8` | |

---

## #16 scores · "Scores · 7 days" on Today

A cream clay tablet with a raised mint score curve that ends in a coral dot ("today"), on a mint tile.

- **Tile:** `#A9D4B9`. Tablet width on the tile 0.58, optically centred.

**Tablet**
- Width 1.0, height 0.78, thickness 0.12.
- Front-view corner radius 0.16; edges soft, radius 0.05.
- Front face flat or barely domed.

**Curve**
- A swept round tube on the front face, diameter 0.075, sunk halfway into the face, so it stands out by about 0.04.
- It runs as one smooth spline through these points, given as x from the tablet's left edge and y from its bottom edge, in tablet units:

| Point | x | y |
|---|---|---|
| 1 | 0.14 | 0.30 |
| 2 | 0.32 | 0.44 |
| 3 | 0.50 | 0.34 |
| 4 | 0.68 | 0.54 |
| 5 | 0.82 | 0.60 |

- The start has a rounded cap. The join with the face has a soft fillet, no lip.

**Dot**
- A coral sphere, diameter 0.15, centred on point 5, sitting on the face.

**Usual line**
- A very shallow engraved dashed line at y 0.42, from x 0.10 to 0.90: 6 dashes of length 0.08 with round ends, depth 0.008, colour warm grey.
- If it cannot be made clean, leave it out and say so.

**Colours**
- Tablet in cream.
- Curve in mint.
- Dot in coral.

---

## #17 dual-n-back · game tile under Play

A cream clay plate with a 3 × 3 grid of soft pads; two pads are lit, one lilac and one coral. On a lavender tile.

- **Tile:** `#CFC8EC`. Plate width on the tile 0.56, optically centred.

**Plate**
- Width 1.0, height 1.0, thickness 0.12.
- Front-view corner radius 0.18; edges soft, radius 0.05.

**Pads**
- 9 soft pillow pads, each 0.25 × 0.25, corner radius 0.07, rising 0.045 above the plate with a fully rounded top.
- Pitch 0.30, grid centred on the plate.
- Colour: lit `#EDE7E0`, middle `#DCD5CC`, shadow `#BDB4A8`.

**Lit pads**
- Row 1, column 3 (top right) is lilac.
- Row 2, column 1 (middle left) is coral.
- Both rise 0.07 instead of 0.045, so they read as switched on.

---

## #18 reaction · game tile under Play

A plump cream clay stopwatch with a coral hand and a coral push button, on an apricot tile.

- **Tile:** `#F2CDB0`. Watch body width on the tile 0.54, optically centred (crown included in the height).

**Body**
- A thick puck, diameter 1.0, depth 0.30.
- Its rim is fully rounded (round cross-section at the edge, radius 0.12), with no flat side band.
- Cream.

**Dial**
- A shallow soft inset on the front, diameter 0.74, depth 0.015, in a slightly lighter cream (lit `#F7F3EE`).
- The inset edge is a soft slope with no lip.

**Ticks**
- 4 small soft nubs at 12, 3, 6 and 9 o'clock on radius 0.29.
- Each is 0.05 in diameter and raised 0.015.
- Warm grey.

**Hand**
- A plump capsule from the centre toward about 1 o'clock (30° right of vertical), length 0.28, width 0.065, raised 0.03.
- A centre cap sphere, diameter 0.10.
- Both coral.

**Crown**
- At 12 o'clock on top of the body: a cream stem, diameter 0.12, height 0.07.
- On the stem, a coral button: a rounded cylinder, diameter 0.20, height 0.09, with a domed top.

**Side button**
- At 1:30, on the rim along the radius at 45°: a small cream capsule nub, diameter 0.09, length 0.09.

---

## #19 ask · "Ask about your data" on Insights

A clay magnifying glass whose lens shows three small bars, on a rosé tile.

- **Tile:** `#E2B9D5`. The whole magnifier's width on the tile is 0.60, optically centred.

**Pose**
- The lens sits upper left and faces the camera.
- The handle points to the lower right at 45° below horizontal.

**Ring**
- A cream torus, outer diameter 1.0, round tube cross-section 0.15.

**Lens**
- A disc filling the ring, barely domed (0.02), set back 0.03 from the ring's front.
- Opaque clay, not glass: lit `#F8F4F6`, middle `#ECE4E9`.
- A soft painted white highlight crescent on the upper-left inner edge of the lens, at about 30 % opacity.

**Bars**
- Three plump vertical bars with round tops, standing on an imaginary baseline 0.20 below the lens centre.
- Each is 0.11 wide and raised 0.035 from the lens.
- Left to right their heights are 0.20, 0.36 and 0.28, with a pitch of 0.17, centred.
- Colour: lit `#E3A9CF`, middle `#C98DB6`, shadow `#A86E95`.

**Collar**
- Between ring and handle: a cream cylinder, diameter 0.22, length 0.07, all edges rounded.

**Handle**
- A terracotta capsule, length 0.50, diameter 0.19.
