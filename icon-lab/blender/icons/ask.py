"""Icon #19 ask: a clay magnifying glass whose lens shows three small bars
("Ask about your data" on Insights).

Geometry only; look from clay_theme (theme untouched, icon-level light tweaks as
calendar / scores). Run: Blender -b --factory-startup --python icons/ask.py -- <out_dir>
Method: sdf_kit (SDF -> start mesh -> voxel remesh -> Newton projection).
Separate objects, embedded for contact creases: cream ring (torus start mesh, no
membrane) + collar, opaque clay lens (barely domed, set back, painted highlight
crescent), three plump bars, terracotta handle.
Units: ring outer diameter 1.0; X right, Z up, front at -Y. Handle 45 deg to the lower right.
"""
import math
import os
import sys

import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))
import clay_theme as ct  # noqa: E402
import sdf_kit as k  # noqa: E402

RING_R, TUBE_R = 0.425, 0.075            # torus: outer diameter 1.0, tube 0.15
LENS_R, LENS_DOME, LENS_BACK = 0.40, 0.02, 0.03   # lens radius (under the tube), dome, set back
LENS_IN = RING_R - TUBE_R                # visible lens radius
LENS_FRONT = -TUBE_R + LENS_BACK         # lens front at the centre (y)
BAR_W, BAR_UP, BAR_PITCH = 0.11, 0.035, 0.17
BAR_H = (0.20, 0.36, 0.28)
BAR_BASE = -0.20                         # baseline below the lens centre
COLLAR_D, COLLAR_L = 0.22, 0.07
HANDLE_D, HANDLE_L = 0.19, 0.50
U = (math.cos(math.radians(-45)), math.sin(math.radians(-45)))   # handle direction in XZ
COLLAR_A = RING_R + TUBE_R - 0.01        # collar starts here along U (slightly into the tube)
HANDLE_A = COLLAR_A + COLLAR_L - 0.015   # handle starts inside the collar

VIEW_ELEVATION_DEG = 8.0
CREAM_HEX = os.environ.get("CLAY_AK_CREAM", "#EEEAE2")
LENS_HEX = os.environ.get("CLAY_AK_LENS", "#F8F5F6")
BAR_HEX = os.environ.get("CLAY_AK_BAR", "#CF92BC")
TERRA_HEX = os.environ.get("CLAY_AK_TERRA", "#BE9073")
CREAM_GRAD = (("#FBF8F3", 0.0), ("#B4A99B", 0.35))
LENS_GRAD = (("#FFFDFE", 0.75), ("#D4C8D0", 0.25))
BAR_GRAD = (("#F8C6E8", 0.85), ("#6E3C60", 0.80))
TERRA_GRAD = (("#F4DECE", 0.65), ("#8A4A26", 0.50))
BAR_FOOT = 0.78                          # bar colour x this at the foot (linear)
LENS_VGRAD = (0.97, 1.05)                # lens colour x this at the bottom / top (linear)
HIGHLIGHT = 0.30                         # painted white crescent opacity
FACE_GRAD = (1.0, 0.97)
RIM = os.environ.get("CLAY_AK_RIM", "1")
SHEEN = 0.15


def _axial(x, z):
    a = x * U[0] + z * U[1]
    p = -x * U[1] + z * U[0]
    return a, p


def ring_sdf(P):
    x, y, z = P[:, 0], P[:, 1], P[:, 2]
    return np.hypot(np.hypot(x, z) - RING_R, y) - TUBE_R


def collar_sdf(P):
    x, y, z = P[:, 0], P[:, 1], P[:, 2]
    a, p = _axial(x, z)
    return k.extrude(np.hypot(p, y) - COLLAR_D / 2, a, COLLAR_A + COLLAR_L / 2, COLLAR_L / 2, 0.025)


def handle_sdf(P):
    x, y, z = P[:, 0], P[:, 1], P[:, 2]
    a, p = _axial(x, z)
    r = HANDLE_D / 2
    t = np.clip(a, HANDLE_A + r, HANDLE_A + HANDLE_L - r)
    return np.hypot(np.hypot(a - t, p), y) - r


def _dome(x, z):
    """Lens front offset toward the camera (negative y) for the barely domed lens."""
    return -LENS_DOME * np.clip(1 - (np.hypot(x, z) / LENS_IN) ** 2, 0, 1)


def lens_sdf(P):
    x, y, z = P[:, 0], P[:, 1], P[:, 2]
    yf = LENS_FRONT + LENS_DOME           # edge front; centre is LENS_DOME further forward
    back = 0.03
    return k.extrude(np.hypot(x, z) - LENS_R, y - _dome(x, z), (yf + back) / 2, (back - yf) / 2, 0.01)


def bar_sdf(P, i):
    x, y, z = P[:, 0], P[:, 1], P[:, 2]
    cx = (i - 1) * BAR_PITCH
    r = BAR_W / 2
    top = BAR_BASE + BAR_H[i]
    cap = k.seg2(x, z, cx, BAR_BASE + r, cx, top - r) - r                     # round top
    foot = k.rrect(x - cx, z - (BAR_BASE + r), r, r, 0.02)                      # flat foot on the baseline
    s = np.minimum(cap, foot)
    yf = LENS_FRONT + LENS_DOME - BAR_UP
    back = LENS_FRONT + LENS_DOME + 0.02
    return k.extrude(s, y - _dome(x, z), (yf + back) / 2, (back - yf) / 2, 0.03)


def _graded_obj(o, base, grad, part, extra=None):
    nz = k.normals(o.data)[:, 2]
    c = k.graded(base, *grad, nz)
    if extra is not None:
        c = extra(k.get_co(o.data), c)
    k.set_colors(o, c, part)


def _cream_face(P, c):
    g = FACE_GRAD[1] + (FACE_GRAD[0] - FACE_GRAD[1]) * np.clip((P[:, 2] + 0.5) / 1.0, 0, 1)
    return c * g[:, None]


def _bar_foot(P, c):
    """Bars darker toward the foot (they face the camera, so the normal gradient alone is flat)."""
    return c * (BAR_FOOT + (1 - BAR_FOOT) * k.ss(BAR_BASE, BAR_BASE + 0.14, P[:, 2]))[:, None]


def _highlight(P, c):
    x, z = P[:, 0], P[:, 2]
    r = np.hypot(x, z)
    ang = np.degrees(np.arctan2(z, x))                     # 135 = upper left
    band = k.ss(0.20, 0.27, r) * k.ss(LENS_IN + 0.005, LENS_IN - 0.03, r)
    arc = k.ss(45, 15, np.abs(ang - 135))
    w = (HIGHLIGHT * band * arc)[:, None]
    c = c * (LENS_VGRAD[0] + (LENS_VGRAD[1] - LENS_VGRAD[0]) * k.ss(-LENS_IN, LENS_IN, z))[:, None]   # lit upper lens
    return c * (1 - w) + w


def main():
    argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    out_dir = argv[0] if argv else os.path.join(os.path.dirname(HERE), "out", "ask")
    os.makedirs(out_dir, exist_ok=True)
    ct.reset_scene()
    ring = k.build("Ring", ring_sdf, voxel=0.0036, coarse=0.012,
                   start=lambda nm: k.torus_start(nm, RING_R, TUBE_R + 0.01))
    c0 = COLLAR_A + COLLAR_L / 2
    m = 0.16
    collar = k.build("Collar", collar_sdf, (c0 * U[0] - m, -0.14, c0 * U[1] - m), (c0 * U[0] + m, 0.14, c0 * U[1] + m),
                     0.0036, 0.01)
    for o in (ring, collar):
        _graded_obj(o, CREAM_HEX, CREAM_GRAD, (0, 0, 0), _cream_face)
    cream = k.join("Cream", [ring, collar])
    lens = k.build("Lens", lens_sdf, (-0.43, -0.09, -0.43), (0.43, 0.06, 0.43), 0.004, 0.015)
    _graded_obj(lens, LENS_HEX, LENS_GRAD, (1, 0, 0), _highlight)
    bars = []
    for i in range(3):
        cx = (i - 1) * BAR_PITCH
        b = k.build("Bar%d" % i, lambda Q, i=i: bar_sdf(Q, i), (cx - 0.09, -0.12, BAR_BASE - 0.04),
                    (cx + 0.09, 0.02, BAR_BASE + BAR_H[i] + 0.04), 0.003, 0.01)
        _graded_obj(b, BAR_HEX, BAR_GRAD, (0, 1, 0), _bar_foot)
        bars.append(b)
    bars = k.join("Bars", bars)
    h0, h1 = HANDLE_A - 0.12, HANDLE_A + HANDLE_L + 0.12
    xs, zs = (h0 * U[0], h1 * U[0]), (h0 * U[1], h1 * U[1])
    handle = k.build("Handle", handle_sdf, (min(xs) - 0.05, -0.13, min(zs) - 0.05), (max(xs) + 0.05, 0.13, max(zs) + 0.05),
                     0.004, 0.012)
    _graded_obj(handle, TERRA_HEX, TERRA_GRAD, (0, 0, 1))
    objs = [cream, lens, bars, handle]
    k.tilt(objs, VIEW_ELEVATION_DEG)
    mat = k.zone_material("ClayAsk", SHEEN)
    for o in objs:
        o.data.materials.clear()
        o.data.materials.append(mat)
    ct.setup_scene(objs)
    k.light_overrides(rim=RIM)
    k.finish(objs, out_dir, "ask")


main()
