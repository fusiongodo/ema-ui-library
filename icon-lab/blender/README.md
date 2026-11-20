# Clay icons in Blender

Headless Blender (5.3, Cycles on Metal) renders soft clay-style 3D icons.
The machine has 16 GB unified RAM: keep the memory rules below.

| Path | What |
|---|---|
| `clay_theme.py` | Shared look: `clay(name, hex)` material, world fill, key/rim lights, ortho camera with auto framing, render settings, cast-shadow parameters, `render(path)`. |
| `icons/<name>.py` | Geometry for one icon; imports `clay_theme`. |
| `composite.py` | Puts the transparent renders on rounded tiles with a soft tinted cast shadow and builds `<icon>-sheet.png` (system Python + Pillow). |
| `render.sh` | `./render.sh checkin_chat` renders and composites one icon. |
| `out/<icon>/` | Transparent renders, tile composites, comparison sheet, `.blend`. |
| `briefs/` | Design briefs from the orchestrator. |

## Render

```sh
./render.sh checkin_chat                         # final: Cycles, max 128 samples, 1024 px
CLAY_SAMPLES=32 CLAY_RES=512 ./render.sh checkin_chat   # quick test
```

The first Cycles run after a Blender update compiles Metal kernels (several minutes, once).

## Memory and engine (round 4)

- Mesh: coarse voxel remesh (`CLAY_VOXEL`, default 0.016) projected onto the implicit surface, then subdivision viewport 1 / render 2. About 176k render faces per bubble (round 3: 0.0065 voxel, 265k). The script prints `POLYS` per object.
- Engine: **Cycles**, GPU Metal, max 128 samples, adaptive sampling, OIDN denoise, persistent data off. EEVEE was tested (`CLAY_ENGINE=EEVEE`, see `out/checkin-chat/engine-compare.png`): 5x faster and far less memory, but its contact darkening between the bubbles is harder and darker, and the soft subsurface/shadow-side gradient is flatter and greyer. Cycles kept for the clay look.
- Peak memory, one variant: Cycles max RSS 1.9 GB (round 3 settings: 2.9 GB); macOS "peak memory footprint" stays about 8 GB with Cycles Metal (GPU buffers in unified memory), EEVEE 2.4 GB. Do not run two Blender renders in parallel.
- No image textures; `.blend` saved via `clay_theme.save_blend()` (recursive orphan purge, no `.blend1`).
- Blender user prefs: undo steps set to 10 and saved (one-off script run without `--factory-startup`).
- Colour helpers: `CLAY_KEY`, `CLAY_WORLD`, `CLAY_SSS_R`; `CLAY_FRONT_MASK=1` renders only the front bubble (mask for colour measurement).

## Palette

`clay_theme.AREAS` (tiles) and `clay_theme.ACCENTS` (second object of an icon), dusty, lightness/chroma from the reference board, our own hues: today `#E1C29E`/`#CABDAE`, checkins `#A9D4B9`/`#B2C4B9`, protocols `#BFC4EF`/`#BBBED0`, insights `#E2B9D5`/`#CBB9C5`, voice `#9CD5CD`/`#AEC5C1`.

## Add the next icon

1. Copy `icons/checkin_chat.py` to `icons/<name>.py` and replace the geometry part
   (`sdf()` describes the shape; `build_bubble()` turns it into a clean mesh).
2. Keep the tail of `main()`: assign `clay_theme.clay(...)` materials, call
   `clay_theme.setup_scene(objects)` and `clay_theme.render(...)` per variant.
3. Put the reference at `../refs/<name-with-dashes>.png`, run `./render.sh <name>`.

## Look notes

All look parameters are constants at the top of `clay_theme.py` (the brief's "Light and render" and "Tile compositing" sections document them).

- View transform **Standard**, not AgX (AgX turned the cream grey). One weak warm key light (area, size 8, 5200 K, 25 W, from above slightly left: azimuth -25, elevation 65), a strong near-neutral world fill (gradient: `#ECEBEE` from above and the sides, `#8E8A86` from below, strength 1.1) so the clay reads flat and soft, a frontal fill (area, size 6, 6500 K, 50 W, azimuth 0, elevation 10) that keeps the front cream down to the bottom, a facing-angle edge glow in `clay()` (Layer Weight Facing, smoothstep from 0.55, base colour mixed toward value x1.08 at grazing angles), sheen 0.40 / sheen roughness 0.40, and a weak cool rim (10 W). Env overrides: `CLAY_KEY`, `CLAY_KELVIN`, `CLAY_WORLD`, `CLAY_WORLD_HEX`, `CLAY_WORLD_LOW_HEX`, `CLAY_RIM`, `CLAY_FILL`, `CLAY_FILL_EL`, `CLAY_EDGE_LIFT`, `CLAY_EDGE_FROM`, `CLAY_SHEEN`, `CLAY_SHEEN_R`, `CLAY_FRONT_HEX`, `CLAY_BACK_HEX`.
- checkin-chat colours: fixed by Alex to the reference (`clay_theme.REFERENCE`): tile `#E6BFA2`, front base `#F0EAE1`, back base `#C8C0D2`; body height 0.86, silhouette exponent 2.15; composite centres the pair's alpha bounding box on the tile. One variant: `checkin-chat.png`, `checkin-chat-on-tile.png`.
- No shadow catcher. Blender renders only the objects on transparent film; contact darkening between objects comes from Cycles.
- `composite.py` makes the cast shadow from the render's alpha: `SHADOW_OFFSET`, `SHADOW_BLUR`, `SHADOW_OPACITY`, `SHADOW_TINT` (tile colour × 0.70; blur 2 %, opacity 0.22). Tile colour from `clay_theme.REFERENCE[icon]["tile"]`.
- Size: objects fill `FRAME_FILL` (70 %) of the render and `TILE_ICON_WIDTH` (66 %) of the tile.

## protocol-pill (#5)

- `icons/protocol_pill.py`: rounded cylinder (rim radius 0.09, thickness 0.36, dome 0.015, straight side band), voxel 0.004, no subdivision (~182k faces). Score line: planar V-groove (60 deg opening, depth 0.05 at the centre, straight horizontal floor, floor rounding 0.003, convex shoulder bevel 0.004, no lips) applied as a height clamp of the top vertices; the voxel grid is aligned with the groove so walls fall on clean vertex rows. It exits through both rim corners as a notch. Groove darkened in the material by local AO (`GROOVE_AO` 0.25).
- Pose: view onto the top 32 deg, score line 25 deg up on screen. Tablet width on tile 0.55 via `REFERENCE["protocol-pill"]["tile_icon_width"]`.
- Icon-level overrides only (theme untouched, #7 renders as before): fill 0 W; key 90 W at 6000 K moved to 2.5 from the tablet; small second key (area 1, 22 W, upper left az -55 el 50, distance 1.6); world strength 0.7, warm low `#7A7068`; base `#EFECE8`; chalky noise bump (scale 350, strength 0.25).
- The AO node triggers a one-time Metal kernel compile (~3 min) on the first render after a Blender update.
- `CLAY_PART_MASK=1` renders a top/side/score part mask for colour measurement.

## guide (#13)

- `icons/guide.py`: light bulb, two solids of revolution traced from 2D implicit profiles as in `protocol_injection.py` (glass: sphere with axis-compressed lower half, smooth-unioned into a 0.54 neck; base: two pillowy rings, lower one a touch narrower as in the reference, plus an elliptic dome cap). 124k faces, no remesh. View elevation 8 deg.
- Flat peach ring drawn in `composite.py` (opt-in `REFERENCE[icon]["ring"]`: colour, centre-line radius 0.37, stroke 0.036; supersampled, under the cast shadow). `compose()` also takes an opt-in `tile_icon_offset_y` (default 0). Other icons render unchanged.
- Icon-level overrides only: normal-direction colour gradients on both parts, sheen 0.15, edge lift 1.0, warmer/lighter ground `#B4AA9E`.
