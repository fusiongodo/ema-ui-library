# Blender brief · #10 steps (Steps) — version 2

Written by the orchestrator. The builder executes; it does not change the design.

## Why version 2

Version 1 (rounds 1–4) produced a pointed, slipper-like shoe that Alex finds masculine. Alex (20 Nov 2026): build closely after the blue running shoe `icon-lab/refs/clay-board/tuki-clay-running.png` (CC0), but in the colours of our reference `icon-lab/refs/steps.png`. This is a prototype for developers; staying close to the model is wanted.

## Shape: copy the tuki shoe closely

Look at `tuki-clay-running.png` and rebuild its shoe as faithfully as possible, in pure side view, toe to the right:
- **Toe:** full, round and blunt, with a soft toe cap that is a separate rounded layer over the front.
- **Upper:** plump, rising from the toe to a high padded heel; the top line dips at the ankle.
- **Collar:** a thick rolled padding around the ankle opening, high at the back, dipping at the side; the inside of the opening shows a lighter lining.
- **Tongue:** a rounded tongue rising above the laces at the instep.
- **Laces:** four plump rounded bars across the instep, stepping down toward the toe, like the model.
- **Heel counter:** a rounded patch over the heel in a lighter accent colour.
- **Midsole:** thick, soft, wavy midsole running the full length: higher at the heel, a gentle wave under the arch, rising at the toe (rocker).
- **Outsole:** a row of separate rounded lugs under the midsole (≈ 6–7 pads with small gaps), as in the model.

Proportions as in the model (length : height ≈ 2.1 : 1 including the sole). Everything soft and clay-like; flat or convex surfaces wherever possible.

## Colours: from our reference (sRGB)

| Part | Colour (lit / middle / shadow) |
|---|---|
| Tile | `#E1CABC` |
| Upper, toe cap, tongue | `#F5EFE8` / `#E5E0DA` / `#D9D2C8` (cream) |
| Collar roll and lining, laces | slightly lighter cream than the upper, ≈ `#F8F3EE` middle |
| Heel counter patch | light sand `#E3CDB8` middle |
| Midsole | tan `#D8B69B` / `#BD9770` / `#98754D` |
| Outsole lugs | deeper brown ≈ `#9A7550` middle |
| Creases between parts | ≈ `#C1B7AD` |

Replace `REFERENCE["steps"]` values in `clay_theme.py` accordingly (only this entry).

## Pose and camera

- Pure side view: yaw ≈ 5°, view elevation ≈ 8° (just enough to see into the collar opening), no image tilt.
- Shoe width ≈ 60 % of the tile, optically centred (cast shadow excluded).

## Output, done means

As before (`out/steps/`: transparent, on-tile, sheet with reference + tuki model in row 1 at 260 px plus 60 px, `.blend`; `./render.sh steps`). No facets, seams, clipping (≤ 250); reads as a friendly, rounded sneaker at 60 px. Keep the version-1 script as `icons/steps_v1.py` for reference. Report table, render time, faces, max RSS, remaining differences. Do not commit.
