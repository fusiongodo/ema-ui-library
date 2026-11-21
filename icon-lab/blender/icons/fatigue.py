"""Icon #25 fatigue: a nearly empty cream battery (trend tile "Fatigue / energy").

Geometry only; look from clay_theme (theme untouched).
Run: Blender -b --factory-startup --python icons/fatigue.py -- <out_dir>
Method: sdf_kit. Body + terminal nub as one smooth union (k 0.03) with a shallow front inset (warm grey,
vertex colour blended by depth across the inset slope); the coral charge pill is separate.
Units: body width 1.0. X right, Z up, front at -Y.
"""
import os
import sys

import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))
import clay_theme as ct  # noqa: E402
import sdf_kit as k  # noqa: E402

BODY_W, BODY_H, BODY_D, BODY_R = 1.0, 0.52, 0.30, 0.16
NUB_W, NUB_H = 0.08, 0.22
NUB_K = 0.03
WIN_W, WIN_H, WIN_R, WIN_D = 0.80, 0.34, 0.10, 0.02
PILL_W, PILL_H, PILL_R, PILL_UP = 0.20, 0.24, 0.08, 0.03
PILL_X = -WIN_W / 2 + 0.05 + PILL_W / 2          # left end of the window, 0.05 margin
FRONT = -BODY_D / 2

VIEW_ELEVATION_DEG = 8.0
CREAM_HEX = "#EEEAE1"
CREAM_GRAD = (("#F3EFE9", 0.14), ("#B4A99B", 0.25))
GREY_HEX = "#BFB6AA"                                # warm grey middle tone in the inset
CORAL_HEX = "#EF8D7A"
CORAL_GRAD = (("#F8A894", 0.50), ("#D88270", 0.30))
SHEEN = 0.15


def _smax(a, b, kk):
    return -k.smin(-a, -b, kk)


def body_sdf(P):
    x, y, z = P[:, 0], P[:, 1], P[:, 2]
    b = k.extrude(k.rrect(x, z, BODY_W / 2, BODY_H / 2, BODY_R), y, 0.0, BODY_D / 2, 0.10)
    w = k.rrect(x, z, WIN_W / 2, WIN_H / 2, WIN_R)
    cut = np.maximum(w, y - (FRONT + WIN_D))          # slab in front of the inset floor
    return k.smin(_smax(b, -cut, 0.012), nub_sdf(P), NUB_K)    # nub: smooth union (no hard join)


def nub_sdf(P):
    x, y, z = P[:, 0], P[:, 1], P[:, 2]
    s = k.rrect(x - (BODY_W / 2 + NUB_W / 2 - 0.03), z, NUB_W / 2 + 0.03, NUB_H / 2, 0.05)
    return k.extrude(s, y, 0.0, 0.08, 0.05)


def pill_sdf(P):
    x, y, z = P[:, 0], P[:, 1], P[:, 2]
    s = k.rrect(x - PILL_X, z, PILL_W / 2, PILL_H / 2, PILL_R)
    y0 = FRONT + WIN_D - PILL_UP                      # raised 0.03 above the inset floor
    return k.extrude(s, y, y0 + 0.04, 0.04, 0.025)


def main():
    argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    out_dir = argv[0] if argv else os.path.join(os.path.dirname(HERE), "out", "fatigue")
    os.makedirs(out_dir, exist_ok=True)
    ct.reset_scene()
    body = k.build("Body", body_sdf, (-0.53, -0.18, -0.29), (0.61, 0.18, 0.29), 0.0036, 0.012)
    P, nz = k.get_co(body.data), k.normals(body.data)[:, 2]
    c = k.graded(CREAM_HEX, *CREAM_GRAD, nz)
    w = k.rrect(P[:, 0], P[:, 2], WIN_W / 2, WIN_H / 2, WIN_R)
    g = (k.ss(FRONT + 0.002, FRONT + 0.016, P[:, 1]) * k.ss(0.03, 0.015, w))[:, None]   # by depth: soft across the slope
    k.set_colors(body, c * (1 - g) + k.lin(GREY_HEX) * g, np.hstack([0 * g, 0 * g, g]))   # inset: blue in the mask
    pill = k.build("Pill", pill_sdf, (PILL_X - 0.13, FRONT - 0.06, -0.15), (PILL_X + 0.13, FRONT + 0.10, 0.15),
                   0.0025, 0.008)
    k.set_colors(pill, k.graded(CORAL_HEX, *CORAL_GRAD, k.normals(pill.data)[:, 2]), (1, 0, 0))
    objs = [body, pill]
    k.tilt(objs, VIEW_ELEVATION_DEG)
    mat = k.zone_material("ClayFatigue", SHEEN)
    for o in objs:
        o.data.materials.clear()
        o.data.materials.append(mat)
    ct.setup_scene(objs)
    k.light_overrides()
    k.finish(objs, out_dir, "fatigue")


main()
