# Blender briefs #33 and #34 · week-box-closed, protocols-folder

Written by the orchestrator. The builder executes; it does not change the design.

Common rules and colour sets are as in `16-19-new-tiles.md`, and `sdf_kit.py` is used. Render the two one after the other, never two Blender processes at once.

## Why

Alex: the Protocols setup card ("Set up your protocols") looks lovely. That comes from its warm cream clay pill box and its white chips on the soft lavender. Once a protocol exists, the card "Today · all as planned" loses that composition: a cold, saturated blue check tile and a blue bar.

The card gets the same composition as the setup card: the same pill box, now closed (#33). The quiet "All protocols" card at the end of the tab gets a clay tile instead of its flat folder glyph (#34).

## #33 week-box-closed · illustration on "Today · all as planned"

- **Base:** `icons/week_box.py` (#31), as an option or a sibling script. `./render.sh week_box` must still render #31 identically.
- **Change:** all seven lids are closed, flush caps as on cells 1, 2, 6 and 7 of #31. There are no standing lids and no pills.
- **Kept from #31:** pose, light, colours, size, the day dots and the soft shadow.
- **Done mark:** one small mint check on the lid of cell 4, a raised soft swept tube, as the mint line in the colour table.
  - It is about 0.10 wide and 0.012 high.
  - It must read at 132 px. If it muddies, leave it out and say so.
- **Output** (`out/week-box-closed/`):
  - `week-box-closed.png`: no tile, the same crop and margin as `week-box.png`, so both sit identically in the card;
  - `week-box-closed-on-card.png` on `#EDEFFE`;
  - a sheet with #31 and #33 side by side at 132 px on `#EDEFFE`.

## #34 protocols-folder · tile for "All protocols"

- **Meaning:** the whole collection of protocols.
- **Object:** a soft lilac clay folder, front view, as in calendar and guide (elevation about 8°, yaw 0). From its top edge, three cream cards peek out, slightly fanned:
  - the front card shows a tiny coral capsule;
  - the middle card shows a tiny mint dot;
  - the back card is plain.
- **Folder:** the Lilac set, the body about 0.80 wide and 0.62 high, with a soft tab on the back panel. Keep it plump and soft, not paper-thin.
- **Tile:** the same tile colour as `protocol-pill` (read it in `clay_theme.py` / `REFERENCE["protocol-pill"]`), so it reads as Protocols.
- **Output:** the standard set (`protocols-folder.png`, `-on-tile.png`, `-sheet.png`, `.blend`). Add `REFERENCE["protocols-folder"]`.
- **Sheet row:** next to `protocol-pill`, `calendar` and `flask` at 60 px.

## Report

Colours measured against the table, render time, faces, max RSS, the remaining differences, and the paths of the sheets. Do not commit and do not touch anything outside `icon-lab/blender/`. At most 30 min.
