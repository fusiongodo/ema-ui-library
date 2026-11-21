"""Icon #29 finding: a plump gold four-pointed sparkle with a small second sparkle
(Insights pattern cards).

Geometry only; look from clay_theme (theme untouched). Gold is lit like #23 noon
(fill 30 W, rim 2 W, sheen 0.08: saturated yellows clip at 0.15).
Run: Blender -b --factory-startup --python icons/finding.py -- <out_dir>
Method: sdf_kit. 2D sparkle = astroid (concave sides), exact distance to a dense sample of
the curve on a grid, Gaussian-blurred (rounds the tips to about 0.04 and removes the
medial creases along the arms); puffy rounded extrusion. Two separate objects.
Units: main sparkle span 0.78. X right, Z up, front at -Y.
"""
import math
import os
import sys

import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))
import clay_theme as ct  # noqa: E402
import sdf_kit as k  # noqa: E402

SPAN, SMALL_SPAN, DEPTH = 0.78, 0.28, 0.22
R_SHARP = SPAN / 2 + 0.025                       # blur pulls the tips in by about this much
MAIN_C = (-0.07, -0.07)                          # slightly lower left
SMALL_C = (0.27, 0.27)                           # upper right, not touching
BLUR = 0.022
DOME = 0.16                                      # rounding depth in the outline plane (plump)

VIEW_ELEVATION_DEG = 8.0
GOLD_HEX = "#F4C24A"
GOLD_GRAD = (("#F6E4A4", 0.75), ("#B07E0E", 0.50))
HI_HEX, HI_COMP = "#ECC048", 0.45                # key-facing tops: saturated gold, no clip
RIM, SHEEN = "2", 0.08


def _grid(step=0.003):
    t = np.linspace(0, 2 * math.pi, 4000, endpoint=False)
    cx, cz = R_SHARP * np.cos(t) ** 3, R_SHARP * np.sin(t) ** 3
    g = np.arange(-0.48, 0.48 + step / 2, step)
    X, Z = np.meshgrid(g, g, indexing="ij")
    px, pz = X.ravel(), Z.ravel()
    d = np.empty(px.size)
    for i in range(0, px.size, 4000):
        d[i:i + 4000] = np.sqrt(((px[i:i + 4000, None] - cx) ** 2 + (pz[i:i + 4000, None] - cz) ** 2).min(1))
    inside = np.abs(px) ** (2 / 3) + np.abs(pz) ** (2 / 3) < R_SHARP ** (2 / 3)
    F = np.where(inside, -d, d).reshape(X.shape)
    sg = BLUR / step
    r = int(3 * sg)
    w = np.exp(-0.5 * (np.arange(-r, r + 1) / sg) ** 2)
    w /= w.sum()
    F = np.pad(F, r, mode="edge")
    F = np.apply_along_axis(lambda v: np.convolve(v, w, mode="valid"), 0, F)
    F = np.apply_along_axis(lambda v: np.convolve(v, w, mode="valid"), 1, F)
    return g, F


SG, SF = _grid()


def _lookup(x, z):
    st = SG[1] - SG[0]
    fx = np.clip((x - SG[0]) / st, 0, len(SG) - 1.001)
    fz = np.clip((z - SG[0]) / st, 0, len(SG) - 1.001)
    i, j = fx.astype(int), fz.astype(int)
    u, v = fx - i, fz - j
    return ((SF[i, j] * (1 - u) + SF[i + 1, j] * u) * (1 - v) + (SF[i, j + 1] * (1 - u) + SF[i + 1, j + 1] * u) * v)


def sparkle_sdf(P, c, span, depth):
    s = span / SPAN
    x, z = (P[:, 0] - c[0]) / s, (P[:, 2] - c[1]) / s
    dome = DOME * s                              # elliptic cross-section: domed, no flat face
    return k.extrude(_lookup(x, z) * s, P[:, 1] * dome / (depth / 2), 0.0, dome, dome - 0.004)


def _colors(o):
    nz = k.normals(o.data)[:, 2]
    h = (HI_COMP * k.ss(0.55, 1.0, nz))[:, None]
    k.set_colors(o, k.graded(GOLD_HEX, *GOLD_GRAD, nz) * (1 - h) + k.lin(HI_HEX) * h, (1, 0, 0))


def main():
    argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    out_dir = argv[0] if argv else os.path.join(os.path.dirname(HERE), "out", "finding")
    os.makedirs(out_dir, exist_ok=True)
    ct.reset_scene()
    mx, mz = MAIN_C
    main_s = k.build("Sparkle", lambda P: sparkle_sdf(P, MAIN_C, SPAN, DEPTH),
                     (mx - 0.43, -0.14, mz - 0.43), (mx + 0.43, 0.14, mz + 0.43), 0.0035, 0.012)
    sx, sz = SMALL_C
    small_d = DEPTH * 0.6
    small = k.build("Small", lambda P: sparkle_sdf(P, SMALL_C, SMALL_SPAN, small_d),
                    (sx - 0.17, -0.10, sz - 0.17), (sx + 0.17, 0.10, sz + 0.17), 0.0025, 0.008)
    for o in (main_s, small):
        _colors(o)
    objs = [main_s, small]
    k.tilt(objs, VIEW_ELEVATION_DEG)
    mat = k.zone_material("ClayFinding", SHEEN)
    for o in objs:
        o.data.materials.clear()
        o.data.materials.append(mat)
    ct.setup_scene(objs)
    k.light_overrides(rim=RIM)
    k.finish(objs, out_dir, "finding")


main()
