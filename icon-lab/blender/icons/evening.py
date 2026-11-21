"""Icon #24 evening: a plump butter crescent moon with a small four-pointed star in its bowl.

Geometry only; look from clay_theme (theme untouched); same light as #22 morning
(fill 30 W, rim 2 W, warm low world, sheen 0.08).
Run: Blender -b --factory-startup --python icons/evening.py -- <out_dir>
Method: sdf_kit. Moon as the sleep moon: a two-circle crescent (outer circle r 0.42,
inner bowl circle through both tips, 0.20 thick at the middle), the two edge
distances smooth-min'ed (rounded tips), inflated with a round puffy cross-section.
Star: smooth union of two rounded rhombi (concave sides, rounded tips), 2D field blurred
(no medial creases), puffy.
Units: outer moon radius 0.42 around the origin; X right, Z up, front at -Y.
"""
import math
import os
import sys

import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))
import clay_theme as ct  # noqa: E402
import sdf_kit as k  # noqa: E402

RO, THICK, DEPTH = 0.42, 0.20, 0.18
OPEN_DEG = 5.0                       # bowl opening direction (0 = right): tips at ~1 and ~5 o'clock
TIP_HALF_DEG = 57.0                  # tips at OPEN_DEG +- this (62 / -52 deg)
TIP_SMOOTH = 0.10                    # smooth min of the edge distances: rounded tips
STAR_SPAN, STAR_R, STAR_W = 0.18, 0.016, 0.034
STAR_POS = (0.21 * math.cos(math.radians(30)), 0.21 * math.sin(math.radians(30)))   # in the bowl, upper right
STAR_DEPTH = 0.08

VIEW_ELEVATION_DEG = 8.0
MOON_HEX = os.environ.get("CLAY_EV_MOON", "#F2DA96")
MOON_GRAD = (("#FCF2D2", 0.70), ("#A88C30", 0.35))
HI_COMP = 0.22
RIM, SHEEN = "2", 0.08


def _inner_circle():
    d = np.array([math.cos(math.radians(OPEN_DEG)), math.sin(math.radians(OPEN_DEG))])
    cphi = math.cos(math.radians(TIP_HALF_DEG))
    mid = RO - THICK                                     # inner edge at the middle, opposite the opening
    t = (RO ** 2 - mid ** 2) / (2 * RO * cphi + 2 * mid)
    return t * d, t + mid


CI, RI = _inner_circle()


def moon_sdf(P):
    x, y, z = P[:, 0], P[:, 1], P[:, 2]
    a = RO - np.hypot(x, z)                              # inside the outer circle (positive inside)
    b = np.hypot(x - CI[0], z - CI[1]) - RI              # outside the bowl circle
    s2 = -k.smin(a, b, TIP_SMOOTH)                       # 2D SDF of the crescent (negative inside)
    return k.extrude(s2, y, 0.0, DEPTH / 2, DEPTH / 2 - 0.005)


def _rhombus(px, pz, bx, bz):
    px, pz = np.abs(px), np.abs(pz)
    h = np.clip(((bx - 2 * px) * bx - (bz - 2 * pz) * bz) / (bx * bx + bz * bz), -1, 1)
    d = np.hypot(px - 0.5 * bx * (1 - h), pz - 0.5 * bz * (1 + h))
    return d * np.sign(px * bz + pz * bx - bx * bz)


def _star2(x, z):
    L = STAR_SPAN / 2 - STAR_R
    return k.smin(_rhombus(x, z, L, STAR_W), _rhombus(x, z, STAR_W, L), 0.02) - STAR_R


def _star_grid(step=0.001, sigma=0.006):
    """2D star SDF on a grid, Gaussian-blurred: the rhombus medial ridges (creases along
    the arms after inflation) are smoothed away; the outline stays."""
    g = np.arange(-0.13, 0.13 + step / 2, step)
    X, Z = np.meshgrid(g, g, indexing="ij")
    F = _star2(X, Z)
    sg = sigma / step
    r = int(3 * sg)
    w = np.exp(-0.5 * (np.arange(-r, r + 1) / sg) ** 2)
    w /= w.sum()
    F = np.pad(F, r, mode="edge")
    F = np.apply_along_axis(lambda v: np.convolve(v, w, mode="valid"), 0, F)
    F = np.apply_along_axis(lambda v: np.convolve(v, w, mode="valid"), 1, F)
    return g, F


SG, SF = _star_grid()


def _star_lookup(x, z):
    st = SG[1] - SG[0]
    fx = np.clip((x - SG[0]) / st, 0, len(SG) - 1.001)
    fz = np.clip((z - SG[0]) / st, 0, len(SG) - 1.001)
    i, j = fx.astype(int), fz.astype(int)
    u, v = fx - i, fz - j
    return ((SF[i, j] * (1 - u) + SF[i + 1, j] * u) * (1 - v) + (SF[i, j + 1] * (1 - u) + SF[i + 1, j + 1] * u) * v)


def star_sdf(P):
    x, y, z = P[:, 0] - STAR_POS[0], P[:, 1], P[:, 2] - STAR_POS[1]
    return k.extrude(_star_lookup(x, z), y, 0.0, STAR_DEPTH / 2, STAR_DEPTH / 2 - 0.004)


def _moon_start(name, n=120):
    """Crescent prism as the start mesh (a cube start filled the bowl with a membrane)."""
    import bmesh
    t1, t2 = OPEN_DEG + TIP_HALF_DEG, OPEN_DEG - TIP_HALF_DEG + 360
    tip1 = RO * np.array([math.cos(math.radians(t1)), math.sin(math.radians(t1))])
    tip2 = RO * np.array([math.cos(math.radians(t2)), math.sin(math.radians(t2))])
    outer = [RO * np.array([math.cos(a), math.sin(a)]) for a in np.radians(np.linspace(t1, t2, n))]
    b2 = math.atan2(*(tip2 - CI)[::-1])
    b1 = math.atan2(*(tip1 - CI)[::-1])
    inner = [CI + RI * np.array([math.cos(a), math.sin(a)]) for a in np.linspace(b2, b1 - 2 * math.pi, n)[1:-1]]
    bm = bmesh.new()
    vs = [bm.verts.new((p[0], -DEPTH / 2 + 0.01, p[1])) for p in outer + inner]
    f = bm.faces.new(vs)
    r = bmesh.ops.extrude_face_region(bm, geom=[f])
    moved = [e for e in r["geom"] if isinstance(e, bmesh.types.BMVert)]
    bmesh.ops.translate(bm, verts=moved, vec=(0, DEPTH - 0.02, 0))
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces[:])
    bmesh.ops.triangulate(bm, faces=bm.faces[:])
    return k._link(name, bm)


def _colors(o):
    nz = k.normals(o.data)[:, 2]
    c = k.graded(MOON_HEX, *MOON_GRAD, nz) * (1 - HI_COMP * k.ss(0.55, 1.0, nz))[:, None]
    k.set_colors(o, c, (1, 0, 0))


def main():
    argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    out_dir = argv[0] if argv else os.path.join(os.path.dirname(HERE), "out", "evening")
    os.makedirs(out_dir, exist_ok=True)
    ct.reset_scene()
    print("MOON inner centre", CI.round(3), "radius", round(RI, 3))
    moon = k.build("Moon", moon_sdf, voxel=0.0035, coarse=0.012, start=_moon_start)
    sx, sz = STAR_POS
    star = k.build("Star", star_sdf, (sx - 0.11, -0.06, sz - 0.11), (sx + 0.11, 0.06, sz + 0.11), 0.002, 0.006)
    for o in (moon, star):
        _colors(o)
    objs = [moon, star]
    k.tilt(objs, VIEW_ELEVATION_DEG)
    mat = k.zone_material("ClayEvening", SHEEN)
    for o in objs:
        o.data.materials.clear()
        o.data.materials.append(mat)
    ct.setup_scene(objs)
    k.light_overrides(rim=RIM)
    k.finish(objs, out_dir, "evening")


main()
