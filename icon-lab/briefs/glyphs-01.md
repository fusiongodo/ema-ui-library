# Glyph brief 01 · Soft-solid glyph family (#1–#4, Evaluation)

Written by the orchestrator. The builder executes; it does not change the design. If something in this brief does not work visually, say so in the report and do not make up a fix.

## Goal

Five small UI glyphs in one family, called "Soft solid". They are meant for the developer prototype only and will not be published.

| # | id | Meaning | Reference |
|---|---|---|---|
| 1 | `tab-today` | Home tab | `icon-lab/refs/tab-today.png` |
| 2 | `tab-checkins` | Symptoms tab | `icon-lab/refs/tab-checkins.png` |
| 3 | `tab-protocols` | Medication tab | `icon-lab/refs/tab-protocols.png` |
| 4 | `tab-insights` | "View all trends" button, also the Insights tab | `icon-lab/refs/tab-insights.png` |
| 5 | `evaluation` | Evaluation button | `icon-lab/refs/evaluation.png` |

Copy the references' motifs and proportions closely; copyright does not matter for the prototype. The family's own style is:
- one stroke weight;
- round caps and joins;
- softly rounded corners;
- objects drawn solid with cut-outs.

This style is meant to sit next to the soft pastel clay tiles of the same app. Do not look at `icon-lab/svg/` or `icon-lab/icons/*.mjs`, which hold an older, rejected round.

## Grid and style rules (all glyphs)

- `viewBox="0 0 48 48"`; the live area is 4–44. Drawn with `currentColor`, with no background.
- **Stroke weight:** 4.5 for every stroked part. Caps and joins are always round.
- **Solids:** every outer corner is rounded with a radius of at least 2.5. Cut-outs (door, score line, text lines, capsule gap) use the background, i.e. `fill-rule="evenodd"` or a mask, so they stay transparent.
- **Gap width:** 2.4 for every cut-out gap and for the space between separate parts.
- **Optical size:** every glyph must look equally large. The house, pills and document fill about 38 × 38; the pulse and bars use their full width. Check this by eye in the comparison sheet and adjust only the overall scale, never the shape.

## The five glyphs (coordinates on the 48 grid)

Round 2 (orchestrator, after review): the first round misread three references; corrected below. The builder's round-1 decisions stay unless replaced here: the document's L-shaped notch around the flap is accepted (raise its small radii from 1 to 1.5), the capsule-gap corners stay sharp. Every glyph's ink box must be centred on (24,24) within ±0.5 and stay inside the live area 4–44 including round caps.

### 1 `tab-today` · house

As the reference: a stroked roof chevron that floats above a separate solid body with a clear gap between them, a chimney on the right slope, and a large door with only a thin strip below it.
- **Roof:** stroked chevron (6,22) → (24,7) → (42,22), weight 4.5, round caps and joins.
- **Body:** a solid pentagon whose pitched top runs parallel to the roof, 2.4 below the roof stroke's lower edge (body apex at about y 13.5); walls x 11–37; bottom y 41; bottom corners radius 3; top corners where wall meets slope radius 1.5.
- **Chimney:** solid rect x 31–35.5, top y 9, running down into the roof stroke (it touches the roof, not the body), corner radius 1.2.
- **Door:** cut out x 19.5–28.5, y 27–37.5, radius 1.5 (strip of 3.5 below it).
- Then scale the whole glyph about its own centre so its ink box is ≈ 38 wide and centred on (24,24).

### 2 `tab-checkins` · pulse

As the reference: flat, a TALL peak, a deep dip, a SMALL peak, flat. Polyline weight 4.5, round joins:

(6,26) → (15,26) → (19.5,9) → (25.5,39) → (31,15) → (35,26) → (42,26).

### 3 `tab-protocols` · capsule and tablet

As the reference: the capsule runs from lower left to upper right ("/"); the tablet sits to the lower right, below the capsule's upper half and right of its lower half.
- **Capsule:** stadium length 26, width 12, axis at 45° rising to the right ("/"), split across the middle by a 2.4 gap perpendicular to the axis; both halves solid.
- **Tablet:** solid circle radius 9.
- **Score line:** a 2.4-high horizontal cut across the tablet's FULL diameter (it splits the tablet into two halves, as in the reference).
- Position the two so the clearance between capsule and tablet is 2.4, and the whole glyph's ink box is ≈ 38 × 38, centred on (24,24). Start from capsule centre ≈ (18,19), tablet centre ≈ (33,32) and adjust.

### 4 `tab-insights` · three bars

Three vertical stroked lines, weight 4.5, round caps, bottom-aligned:

| Bar | x | Top y | Bottom y |
|---|---|---|---|
| Left | 12 | 27 | 39 |
| Middle | 24 | 9 | 39 |
| Right | 36 | 18 | 39 |

No extra scaling; check the ink box is centred on (24,24).

### 5 `evaluation` · document

Keep round 1 (page x 10–38, y 5–43, radius 3.5, separate flap, L-shaped notch with 2.4 gap), with two changes:
- small notch and flap corner radii 1.5 instead of 1;
- text lines 3.4 high; line 1 right edge at x 26.

Known and accepted: the pulse and bars carry less ink than the solid glyphs. That is a property of the family, not a defect.

## Colours

| Token | Hex | Use |
|---|---|---|
| Ink | `#2E2C34` | All glyphs |
| Today | `#E1C29E` | Area colour (from `blender/clay_theme.py`, AREAS) |
| Check-ins | `#A9D4B9` | Area colour |
| Protocols | `#BFC4EF` | Area colour |
| Insights | `#E2B9D5` | Area colour |
| Card background | `#F2F1F4` | |
| Tab bar | `#FFFFFF` | With a hairline top border `#E4E2E8` |

## Presentations to build

**A · Tab bar**
- 390 pt wide, 4 tabs: Home (1), Symptoms (2), Medication (3), Insights (4).
- Each tab has its glyph at 26 pt and a label below in `-apple-system, system-ui` 11 pt, weight 600, ink.
- **Active tab:** a pill 52 × 32, radius 16, in the tab's area colour behind the glyph. The glyph and label stay ink.
- **Inactive tabs:** the glyph and label in ink at 55 % opacity.
- Show the bar four times, each with a different tab active.

**B · "View all trends" chip**
- As in the reference: a card row on `#F2F1F4` with a 48 × 48 rounded square (radius 13) in Insights pink.
- Glyph 4 at 24 pt inside it.
- Then the text "View all trends" in system-ui 17 pt, weight 600, ink, 14 pt to the right.

**C · Evaluation button**
- A 64 pt circle in Insights pink with glyph 5 at 28 pt, centred, on `#F2F1F4`.

## Files (`icon-lab/glyphs/`, new folder)

| File | What |
|---|---|
| `glyphs.mjs` | Source of truth: the five SVG strings plus the tokens above |
| `build-glyphs.mjs` | Writes everything below from `glyphs.mjs` (`node icon-lab/glyphs/build-glyphs.mjs`) |
| `svg/<id>.svg` | One SVG per glyph |
| `sheet.html` | The comparison sheet (sections below) |
| `sheet.png` | A screenshot of the sheet via headless Chrome at device scale 2 |

The sheet has these sections:

1. **Reference vs ours:** each reference next to our glyph, both at 96 px display height.
2. **Size steps:** each glyph at 60, 26, 20 and 16 px in a row; all five in a line at 26 px, to judge optical size and weight.
3. **Presentations:** A, B and C.

Embed the references as relative image paths (`../refs/…`). They are not copied anywhere else.

## Done means

- The SVGs are valid, use only `currentColor`, have no stray strokes, and their cut-outs are transparent (check by placing them on a coloured background in the sheet).
- At 20 px every glyph is still clear, and the five look like one family.
- Report:
  - a table of each glyph with any coordinate you had to change and why;
  - remaining differences from the reference.
- Do not commit.
