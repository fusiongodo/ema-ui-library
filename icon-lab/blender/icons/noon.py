"""Icon #23 noon: a puffy yellow sun disc with 8 plump rays.

Geometry only; look from clay_theme (theme untouched); same light as #22 morning
(fill 30 W, rim 2 W, warm low world, sheen 0.08).
Run: Blender -b --factory-startup --python icons/noon.py -- <out_dir>
Method: sdf_kit. Disc and 8 ray capsules are separate meshes (own start meshes).
Units: as the brief (disc 0.52, rays 0.14 starting 0.07 beyond the disc edge);
X right, Z up, front at -Y.
"""
import math
import os
import sys

import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))
import clay_theme as ct  # noqa: E402
import sdf_kit as k  # noqa: E402

DISC_D, DISC_DEPTH = 0.52, 0.28
RAY_L, RAY_W, RAY_GAP = 0.14, 0.08, 0.07
N_RAYS = 8

VIEW_ELEVATION_DEG = 8.0
SUN_HEX = os.environ.get("CLAY_NO_SUN", "#F8D05A")
SUN_GRAD = (("#EEE2B6", 0.65), ("#C8961E", 0.40))
LOW_HEX, LOW = "#DCA62A", 0.30      # mixed in toward the bottom of the sun
HI_HEX, HI_COMP = "#E4BA46", 0.75    # up-facing tops mixed toward a saturated yellow (no clip, no grey rim)
RIM, SHEEN = "2", 0.08


def disc_sdf(P):
    x, y, z = P[:, 0], P[:, 1], P[:, 2]
    return k.extrude(np.hypot(x, z) - DISC_D / 2, y, 0.0, DISC_DEPTH / 2, 0.12)


def ray_sdf(P, deg):
    x, y, z = P[:, 0], P[:, 1], P[:, 2]
    ux, uz = math.sin(math.radians(deg)), math.cos(math.radians(deg))
    r0 = DISC_D / 2 + RAY_GAP + RAY_W / 2
    r1 = DISC_D / 2 + RAY_GAP + RAY_L - RAY_W / 2
    return np.hypot(k.seg2(x, z, r0 * ux, r0 * uz, r1 * ux, r1 * uz), y * 0.9) - RAY_W / 2


def _colors(o):
    nz = k.normals(o.data)[:, 2]
    z = k.get_co(o.data)[:, 2]
    h = (HI_COMP * k.ss(0.55, 1.0, nz))[:, None]
    c = k.graded(SUN_HEX, *SUN_GRAD, nz) * (1 - h) + k.lin(HI_HEX) * h   # key-facing tops: saturated, no clip
    w = (LOW * k.ss(-0.05, -0.30, z))[:, None]
    k.set_colors(o, c * (1 - w) + k.lin(LOW_HEX) * w, (1, 0, 0))


def main():
    argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    out_dir = argv[0] if argv else os.path.join(os.path.dirname(HERE), "out", "noon")
    os.makedirs(out_dir, exist_ok=True)
    ct.reset_scene()
    disc = k.build("Disc", disc_sdf, (-0.29, -0.17, -0.29), (0.29, 0.17, 0.29), 0.0035, 0.012)
    rays = []
    for i in range(N_RAYS):
        d = i * 360.0 / N_RAYS
        ux, uz = math.sin(math.radians(d)), math.cos(math.radians(d))
        rc = DISC_D / 2 + RAY_GAP + RAY_L / 2
        cx, cz = rc * ux, rc * uz
        rays.append(k.build("Ray%d" % i, lambda Q, d=d: ray_sdf(Q, d), (cx - 0.11, -0.07, cz - 0.11),
                            (cx + 0.11, 0.07, cz + 0.11), 0.0025, 0.008))
    for o in [disc] + rays:
        _colors(o)
    objs = [disc, k.join("Rays", rays)]
    k.tilt(objs, VIEW_ELEVATION_DEG)
    mat = k.zone_material("ClayNoon", SHEEN)
    for o in objs:
        o.data.materials.clear()
        o.data.materials.append(mat)
    ct.setup_scene(objs)
    k.light_overrides(rim=RIM)
    k.finish(objs, out_dir, "noon")


main()
