# Clay board: analysis

`board-chat.png` holds 13 chat references, `board-others.png` 17 other motifs (sources and licences in `SOURCES.md`). Numbers come from `make_boards.py`, measured on the main object (luminance Rec.709, 0–255).

There are two families:
- **Clay** (matte, pastel or near-white): our first reference, Fluent Emoji 3D, 3dicons clay, tuki0918, IconScout Design Squad. **This is the target.**
- **Glossy colour 3D:** 3dicons colour, Icons8, most IconScout items. Counter-example only.

## Common to the clay family
- One soft key light from above; the lit-to-shadow gradient spans 40–50 % of the body height. No hard shadow edges.
- Highlight is a broad gradient, no specular dot.
- Shadow side ≈ 0.78–0.88 of the lit side (median 0.84). Shadows drift cooler, toward lavender or blue-grey, even on warm whites.
- 1–2 body colours plus the tile; saturation 0.00–0.08.
- Matte (roughness ≈ 0.6–0.75), faint rim sheen, little to moderate subsurface.
- Fully rounded pillow edges (edge radius ≈ 50 % of thickness). Width:height 1.25–1.45:1, depth 30–40 % of width.
- Speech-bubble tail lower left, pointing down-left 35–50° below horizontal, length 12–15 % and base 18–25 % of body width, blunt rounded tip.
- Two bubbles: back bubble up-right of the front one, offset 35–45 % of the front width, scale 0.8–0.9.
- Camera frontal, elevation 10–15°, yaw 0–10°.
- Cast shadow: none baked into transparent sets; on tiles a short contact shadow straight below, falloff 5–8 % of tile height, tinted with the tile colour.
- Fill: object 59–65 % of tile width (81–86 % of canvas without a tile).

## How a set stays consistent across motifs
One light setup, one material, one camera and size for the whole set. Only the colours change between motifs.

## Median clay recipe
| Trait | Value |
|---|---|
| Key light | from above (≈ 80–100°), large area light, angular size 40–50° |
| Shadow side | ≈ 0.80 of lit side, shifted slightly toward lavender |
| Highlight | broad gradient, no specular dot |
| Main colours (lit / mid / shadow) | #EEEBEC / #E2DDE2 / #C6BFC4 |
| Second colour | one pastel, saturation 0.10–0.15 |
| Material | roughness 0.65, specular 0.3, sheen 0.2, subsurface 0.08 warm |
| Shape | edge radius 50 % of thickness, 1.3:1, depth ≈ 33 % |
| Tail | lower left, 40° below horizontal, length 13 %, base 20 %, rounded tip |
| Back bubble | scale 0.85, up-right, offset ≈ 40 % of front width |
| Camera | frontal, elevation 12°, yaw 5°, long lens |
| Cast shadow | contact shadow straight below, falloff 6 % of tile, opacity ≈ 25 %, tile-tinted |
| Fill | 62 % of tile width |
