# Blender brief · calendar (Calendar)

Written by the orchestrator. The builder executes; it does not change the design.

## Goal

A wall calendar in clay on a pale pink tile. Model: `icon-lab/refs/calendar.png` (177 px, upscale it to look). Alex (20 Nov 2026): build it after this model design, in our clay style, even though the model itself is not clay. So copy the layout, proportions and colours closely, and make the material and forms soft clay like #5–#12. Theme look from `clay_theme.py`; light tweaks only as icon-level overrides. Earlier icons must keep rendering identically. Do not look at `icon-lab/svg/`.

## Tile

Our set uses rounded-square tiles, so use the normal tile shape, not the reference's circle. Tile colour as in the reference: `#F4DBD6`.

## Pose

Frontal, view elevation ≈ 8° from above, yaw 0. The calendar is ≈ 56 % of the tile width, optically centred (cast shadow excluded).

## Geometry (units: calendar width = 1.0)

**Slab**
- Width 1.0, height 0.98, thickness 0.10.
- Corners rounded in the front view (radius 0.07); all edges soft clay (radius ≈ 0.035).
- The front face is flat or barely domed.

**Header**
- The top 0.22 of the front, in coral.
- It is a separate soft layer, or a colour zone with a gentle step of ≈ 0.01, whichever looks cleaner; the boundary to the body is a straight soft line.

**Rings**
- Two vertical capsules: diameter 0.09, length 0.20, centred at x = 0.19 and 0.81 from the left edge.
- They stick out 0.10 above the slab's top edge and dip into the header, ending in small soft holes (a darker round shading where they enter).

**Day grid**
- 5 columns × 4 rows of soft rounded squares:
  - cell 0.12 × 0.12, corner radius 0.03;
  - column pitch 0.168, row pitch 0.153;
  - the first cell's left edge at x 0.10, the first row's top edge at 0.31 below the slab top.
- In the reference the cells look very slightly pressed in. Copy that as a shallow soft inset (depth ≈ 0.008), with no lips or saddle shapes (Alex dislikes them; see #5). If the inset cannot be made clean, use very low raised soft pads instead.
- **Today:** the cell in row 3, column 4 is coral.

Mesh rules as in the README (< 200k faces).

## Colours (sRGB, measured on the reference, render within about ±6)

| Part | Lit | Middle | Shadow |
|---|---|---|---|
| Tile | `#F4DBD6` | | |
| Slab body (warm white) | `#F4F3F1` | `#EEE9E8` | `#D1CEC9` |
| Header (coral) | `#F2A396` | `#EC8E84` | `#D27B71` |
| Day cells (warm grey) | `#CECAC7` | `#C8C4C1` | `#BFBBB8` |
| Today cell (coral) | `#F09A88` | `#E98A78` | `#DB8270` |
| Rings (grey) | `#E6DADA` | `#D3C9C7` | `#B5B0AC` |

Add `REFERENCE["calendar"]` to `clay_theme.py`; change no other entry or default.

## Output (`out/calendar/`)

- `calendar.png`, `calendar-on-tile.png`, `calendar-sheet.png` (reference and ours at 260 px, both at 60 px; row 2: calendar references in `refs/clay-board/`, if present).
- `calendar.blend`; `./render.sh calendar` regenerates everything.

## Done means

No facets, seams, clipping (≤ 250) or lips; it reads as a calendar with today marked at 60 px. Report a measured-vs-target table, render time, faces, max RSS and remaining differences. Do not commit.
