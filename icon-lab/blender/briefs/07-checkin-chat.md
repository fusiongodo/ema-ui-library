# Blender brief · #7 checkin-chat (Check-in by chat)

Written by the orchestrator. The builder executes; it does not change the design. If something in here does not work technically, say so in the report instead of quietly deciding otherwise.

## Goal

A clay-style 3D icon, rendered in Blender, that reads as "a check-in held as a conversation". The **only** model is the reference `icon-lab/refs/checkin-chat.png`: two soft, puffy speech bubbles, a cream one in front and a pastel one behind, on a pastel tile. We build our own version of this idea; same feeling (soft, matte, friendly, clay/marshmallow), our own proportions and colors. Do not look at or reuse the SVG variants in `icon-lab/icons/` or `icon-lab/svg/`.

This is the first of six icons (#7, #5, #8, #9, #10, #11). Everything that defines the look (material, light, camera, render settings, tile compositing) goes into one shared module so the other five icons get exactly the same look. Only the geometry is per icon.

## Files (all under `ema-ui-library/icon-lab/blender/`)

| Path | What |
|---|---|
| `clay_theme.py` | Shared look: material factory `clay(name, hex)`, lights, world, camera, render settings, cast-shadow parameters, `render(name)`. |
| `icons/checkin_chat.py` | Geometry for this icon only; imports `clay_theme`. |
| `composite.py` | Puts a transparent render onto a rounded tile and builds the comparison sheet (Python + Pillow, run outside Blender). |
| `render.sh` | One command that renders one icon and runs the compositing: `./render.sh checkin_chat`. |
| `out/checkin-chat/` | Renders and composites (see Output). |
| `out/checkin-chat/checkin-chat.blend` | The saved scene, so Alex can open and orbit it in Blender. |
| `README.md` | Short: what is where, how to render, how to add the next icon. |

Run Blender headless: `/Applications/Blender.app/Contents/MacOS/Blender -b --factory-startup --python <script>` (Blender 5.3, Apple M4, Metal GPU available). If Pillow is not available in system Python, use a venv inside `icon-lab/blender/.venv` (add to `.gitignore`).

## Geometry

Units: the front bubble body is 1.0 wide.

**Front bubble (cream)**
- Body: a soft, inflated rounded shape seen from the front: wider than tall, width 1.0, height 0.80, depth (thickness toward camera) 0.45. Silhouette is a rounded rectangle-ellipse hybrid (superellipse, exponent about 2.6), not a perfect ellipse and not a box.
- Profile: like a pillow or marshmallow: fully rounded edges all around, front face gently domed, no flat facets, no sharp edge anywhere.
- Tail: at the lower left, starting about 25% in from the left edge, pointing down and slightly left, length 0.20, base width 0.22, tip rounded (tip radius about 0.04). It must grow out of the body with a smooth fillet (no visible seam, no crease), the way the reference tail flows out of its bubble.
- Placement: left and in front. Center at x −0.12, y 0, z +0.05. Rotated −5° around the view axis (top tilts slightly left).

**Back bubble (pastel accent)**
- Same construction, scaled to 0.72 of the front bubble.
- Mirrored: tail at the lower right, pointing down and slightly right.
- Placement: right, slightly lower, and behind: center offset +0.42 in x, −0.10 in z (lower), −0.30 in depth (behind). Rotated +6°.
- Overlap: the front bubble covers about one third of the back bubble. The back bubble's tail and right half stay fully visible.

**Construction method (suggested, appearance above is binding):** metaballs (one ellipsoid for the body plus a small capsule for the tail, so they fuse smoothly) converted to mesh, then voxel remesh (fine) + smooth + subdivision surface, shade smooth. Any method is fine if the result has no seams, facets, or pinching at 1024 px.

## Material (clay, matte)

Principled BSDF, one factory function, only the color differs:
- Roughness 0.55, specular IOR level 0.35, coat 0, metallic 0.
- Subsurface weight 0.12, radius small (about 0.05 of the bubble width), subsurface color = base color. This gives the soft, slightly translucent clay edge.
- Sheen weight 0.15, sheen tint white (velvety edge falloff).
- Colors (sRGB hex, converted correctly to linear in the script):
  - Front bubble: warm cream `#F6F1EA`.
  - Back bubble, variant **L**: `#BBBED0` (round 4; was `#CFC8EE`).
  - Back bubble, variant **M**: `#B2C4B9` (round 4; was `#9ED6B4`).

## Light and render

(Updated in round 4; these are the defaults in `clay_theme.py`, inherited by all icons.)

- Engine Cycles, GPU (Metal), max 128 samples, adaptive sampling, denoise on (OpenImageDenoise), indirect clamp 3, persistent data off. Film transparent, 1024 x 1024 at 100 %. **No shadow catcher**: only the objects are rendered. EEVEE was compared (`out/checkin-chat/engine-compare.png`) and rejected: harder, darker contact shadow and flatter, greyer shading.
- Memory: each mesh under ~200k render faces (voxel 0.016 + subdivision 2, about 176k); no image textures; orphans purged before saving.
- Color management: view transform **Standard**, look None, exposure 0.
- Material: roughness 0.65, specular IOR level 0.30, sheen 0.20 (white tint), subsurface 0.08 (back bubble 0.06).
- Key light: one area light, size 8, distance 6, 6200 K, 170 W, from above and slightly left (azimuth -25, elevation 65), casts shadows.
- Fill: world slightly cool lavender `#E9E6F2`, strength 0.78, so the shadow side drifts toward cool lavender-grey.
- Rim: small (0.8), weak (40 W), cool area light from behind-right (azimuth 140, elevation 25).

## Colour

- Dusty area palette in `clay_theme.AREAS` (tiles) and `clay_theme.ACCENTS` (second object): today `#E1C29E`/`#CABDAE`, checkins `#A9D4B9`/`#B2C4B9`, protocols `#BFC4EF`/`#BBBED0`, insights `#E2B9D5`/`#CBB9C5`, voice `#9CD5CD`/`#AEC5C1`.
- Front bubble cream `#F8F5F0`. Back bubble L = `#BBBED0`, M = `#B2C4B9`.
- Targets on the front bubble: lit ~ `#F8F5F1`, mid ~ `#ECE8E8`, shadow ~ `#D2CCD3`; shadow side ~ 0.80 of lit luminance; max channel <= 252, no flat clipped patch.
- Tiles: Check-ins `#A9D4B9` ("mint"), comparison "apricot" `#E1C29E`.

## Camera

- Orthographic. Elevation 15°, azimuth 0.
- Framing: bubbles + tails occupy **70 %** of the render frame width (`FRAME_FILL`), centred on their bounding box.
- Resolution 1024 × 1024.

## Tile compositing

- Bubbles + tails fill **66 %** of the tile width (`TILE_ICON_WIDTH`); the render frame is scaled to 0.66 / 0.70 ≈ 94 % of the tile, centred.
- Cast shadow is made in `composite.py` from the render's alpha (theme parameters in `clay_theme.py`): offset `SHADOW_OFFSET` (+2.0 % x, +3.5 % y of the tile, down-right), Gaussian blur `SHADOW_BLUR` 3 % of the tile, opacity `SHADOW_OPACITY` 0.20, colour = tile colour × `SHADOW_TINT` 0.75 (tinted, not grey), clipped to the tile. The tile is a clean flat colour everywhere else.

## Output (`out/checkin-chat/`)

1. `checkin-chat-L.png`, `checkin-chat-M.png`: transparent renders, both back-bubble variants.
2. Composites on a rounded tile (corner radius 22/96 of the side, flat fill, no gradient, 1024 px):
   - `checkin-chat-L-on-mint.png`, `checkin-chat-M-on-mint.png` on our Check-ins tile `#A9D4B9`.
   - `checkin-chat-L-on-apricot.png`, `checkin-chat-M-on-apricot.png` on `#E1C29E` (dusty, close to the reference tile, for direct comparison).
   - Bubbles + tails fill about 66% of the tile width, centered (see Tile compositing).
3. `checkin-chat-sheet.png`: one comparison sheet on a light background `#F3F2EF`: row 1: reference, then the four composites, each labeled (Reference · L on mint · M on mint · L on apricot · M on apricot); row 2: clay references from `refs/clay-board/` (fluent-speech-balloon, 3dicons-clay-chat-bubble, tuki-clay-messaging, iconscout-designsquad-chat). Each shown large (about 200 px) and again small at 60 px directly beneath, because the icon must still read at list size.
4. `checkin-chat.blend`: the scene with variant L applied.

## Done means

- `./render.sh checkin_chat` regenerates everything from scratch.
- No seams, facets, pinching, noise, fireflies, black areas, or hard shadows at 1024 px.
- At 60 px the two bubbles still read as two speech bubbles.
- Report back: paths, render time per image, the exact settings that differ from this brief (if any) and why, and anything you would change in the brief. Do not commit.
