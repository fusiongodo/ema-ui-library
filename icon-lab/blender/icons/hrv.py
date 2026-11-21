"""Icon #28 hrv: the #27 heart in cream, carrying a raised coral pulse line.

Geometry only; look from clay_theme (theme untouched).
Run: Blender -b --factory-startup --python icons/hrv.py -- <out_dir>
Method: sdf_kit. Heart from resting_heart.py. Pulse line: a swept tube (diameter 0.06)
whose centre lies on the heart's front surface (embedded halfway), smooth-unioned with the
heart (soft fillets); coral where the tube is nearer than the heart (vertex colour).
Trace: flat, small peak, deep dip, tall peak, flat; spans 0.80 of the heart width.
"""
import os
import sys

import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))
sys.path.insert(0, HERE)
import clay_theme as ct  # noqa: E402
import sdf_kit as k  # noqa: E402
import resting_heart as rh  # noqa: E402

TUBE_R, FILLET = 0.03, 0.015
BASE_Z = 0.03                                    # mid-height of the heart's broad part
TRACE = [(-0.40, 0.0), (-0.23, 0.0), (-0.17, 0.08), (-0.06, -0.16),
         (0.05, 0.25), (0.13, 0.0), (0.40, 0.0)]
JOIN_K = 0.025                                   # rounded joins (soft-solid glyph)

VIEW_ELEVATION_DEG = 8.0
CREAM_HEX = "#EEEAE1"
CREAM_GRAD = (("#F4F0EA", 0.15), ("#A89C8C", 0.30))
CORAL_HEX = "#EF8D7A"
CORAL_GRAD = (("#F2A08E", 0.40), ("#E08A78", 0.40))
SHEEN = 0.10                                    # 0.15 clipped the lobe tops


def trace2(x, z):
    d = None
    for (ax, az), (bx, bz) in zip(TRACE[:-1], TRACE[1:]):
        s = k.seg2(x, z, ax, az + BASE_Z, bx, bz + BASE_Z)
        d = s if d is None else k.smin(d, s, JOIN_K)
    return d


def tube_sdf(P):
    x, y, z = P[:, 0], P[:, 1], P[:, 2]
    return np.hypot(trace2(x, z), y - rh.front_y(x, z)) - TUBE_R


def hrv_sdf(P):
    return k.smin(rh.heart_sdf(P), tube_sdf(P), FILLET)


def main():
    argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    out_dir = argv[0] if argv else os.path.join(os.path.dirname(HERE), "out", "hrv")
    os.makedirs(out_dir, exist_ok=True)
    ct.reset_scene()
    heart = k.build("Heart", hrv_sdf, *rh.HEART_BOX, 0.004, 0.012)
    P, nz = k.get_co(heart.data), k.normals(heart.data)[:, 2]
    w = k.ss(0.004, -0.004, tube_sdf(P) - rh.heart_sdf(P))[:, None]
    c = k.graded(CREAM_HEX, *CREAM_GRAD, nz) * (1 - w) + k.graded(CORAL_HEX, *CORAL_GRAD, nz) * w
    k.set_colors(heart, c, np.hstack([w, np.zeros_like(w), np.zeros_like(w)]))
    objs = [heart]
    k.tilt(objs, VIEW_ELEVATION_DEG)
    mat = k.zone_material("ClayHrv", SHEEN)
    heart.data.materials.clear()
    heart.data.materials.append(mat)
    ct.setup_scene(objs)
    k.light_overrides()
    k.finish(objs, out_dir, "hrv")


main()
