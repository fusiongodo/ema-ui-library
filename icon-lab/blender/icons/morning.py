"""Icon #22 morning: an apricot sun rising behind a cream horizon slab, three rays.

Geometry only; look from clay_theme (theme untouched). The three times-of-day icons
(#22 morning, #23 noon, #24 evening) share the same light: icon-level tweaks as the
game tiles (fill 30 W, rim 2 W, warm low world, sheen 0.15).
Run: Blender -b --factory-startup --python icons/morning.py -- <out_dir>
Method: sdf_kit. Separate objects (contact creases): slab, sun (a puffy disc cut
inside the slab, so nothing shows below it), three ray capsules (own start meshes).
Units: slab width 1.0; slab top edge at z = 0 = sun centre. X right, Z up, front at -Y.
"""
import math
import os
import sys

import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))
import clay_theme as ct  # noqa: E402
import sdf_kit as k  # noqa: E402

SLAB_W, SLAB_H, SLAB_D = 1.0, 0.20, 0.30
SUN_D, SUN_DEPTH = 0.56, 0.26
SUN_Y = 0.06                     # sun centre behind the slab centre (slab overlaps it)
RAY_L, RAY_W, RAY_GAP = 0.15, 0.08, 0.07
RAY_DEG = (-40, 0, 40)           # from vertical

VIEW_ELEVATION_DEG = 8.0
CREAM_HEX = "#EEEAE1"
CREAM_GRAD = (("#E2DDD4", 0.12), ("#B4A99B", 0.20))   # up-facing top toned down: no clipping
SUN_HEX = os.environ.get("CLAY_MO_SUN", "#F8B26E")
HI_COMP = 0.14                   # highlight compression on the most up-facing normals (linear)
SUN_GRAD = (("#F4D8AE", 0.70), ("#B85A14", 0.60))   # light stop low in R: highlights stay <= 250
SUN_LOW_HEX, SUN_LOW = "#BC6420", 0.70   # sun mixed toward this deep apricot near the horizon
RIM, SHEEN = "2", 0.08               # lower sheen than the game tiles: saturated suns clipped


def slab_sdf(P):
    x, y, z = P[:, 0], P[:, 1], P[:, 2]
    s = k.rrect(x, z + SLAB_H / 2, SLAB_W / 2, SLAB_H / 2, SLAB_H / 2)
    return k.extrude(s, y, 0.0, SLAB_D / 2, 0.09)


def sun_sdf(P):
    x, y, z = P[:, 0], P[:, 1], P[:, 2]
    s = np.hypot(x, z) - SUN_D / 2
    s = np.maximum(s, -(z + SLAB_H * 0.6))          # cut inside the slab: half-disc above its bottom
    return k.extrude(s, y, SUN_Y, SUN_DEPTH / 2, 0.11)


def ray_sdf(P, deg):
    x, y, z = P[:, 0], P[:, 1], P[:, 2]
    ux, uz = math.sin(math.radians(deg)), math.cos(math.radians(deg))
    r0 = SUN_D / 2 + RAY_GAP + RAY_W / 2
    r1 = SUN_D / 2 + RAY_GAP + RAY_L - RAY_W / 2
    return np.hypot(k.seg2(x, z, r0 * ux, r0 * uz, r1 * ux, r1 * uz), (y - SUN_Y) * 0.9) - RAY_W / 2


def main():
    argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    out_dir = argv[0] if argv else os.path.join(os.path.dirname(HERE), "out", "morning")
    os.makedirs(out_dir, exist_ok=True)
    ct.reset_scene()
    slab = k.build("Slab", slab_sdf, (-0.53, -0.18, -0.23), (0.53, 0.18, 0.03), 0.004, 0.012)
    k.set_colors(slab, k.graded(CREAM_HEX, *CREAM_GRAD, k.normals(slab.data)[:, 2]), (0, 0, 0))
    sun = k.build("Sun", sun_sdf, (-0.31, SUN_Y - 0.16, -0.15), (0.31, SUN_Y + 0.16, 0.31), 0.0035, 0.012)
    rays = []
    for d in RAY_DEG:
        ux, uz = math.sin(math.radians(d)), math.cos(math.radians(d))
        cx, cz = 0.425 * ux, 0.425 * uz
        rays.append(k.build("Ray%d" % d, lambda Q, d=d: ray_sdf(Q, d), (cx - 0.11, SUN_Y - 0.07, cz - 0.11),
                            (cx + 0.11, SUN_Y + 0.07, cz + 0.11), 0.0025, 0.008))
    for o in [sun] + rays:
        z = k.get_co(o.data)[:, 2]
        w = (SUN_LOW * k.ss(0.12, -0.04, z))[:, None]
        nz = k.normals(o.data)[:, 2]
        c = k.graded(SUN_HEX, *SUN_GRAD, nz) * (1 - HI_COMP * k.ss(0.55, 1.0, nz))[:, None]   # key-facing tops: no clip
        k.set_colors(o, c * (1 - w) + k.lin(SUN_LOW_HEX) * w, (1, 0, 0))
    objs = [slab, sun, k.join("Rays", rays)]
    k.tilt(objs, VIEW_ELEVATION_DEG)
    mat = k.zone_material("ClayMorning", SHEEN)
    for o in objs:
        o.data.materials.clear()
        o.data.materials.append(mat)
    ct.setup_scene(objs)
    k.light_overrides(rim=RIM)
    k.finish(objs, out_dir, "morning")


main()
