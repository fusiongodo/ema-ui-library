"""Icon #21 arithmetic: a cream clay plate with four raised operator signs in a
2 x 2 grid (plus coral, minus lilac, times mint, equals terracotta).

Geometry only; look from clay_theme (theme untouched, icon-level light tweaks as
dual_n_back). Run: Blender -b --factory-startup --python icons/arithmetic.py -- <out_dir>
Method: sdf_kit. Plate as dual_n_back. Signs: plump capsule bars (2D capsule
distances, soft 2D smooth union at the crossings), rounded extrusion, embedded into
the plate as separate objects (contact crease, clean colour borders).
Units: plate width 1.0; X right, Z up, front at -Y.
"""
import math
import os
import sys

import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))
import clay_theme as ct  # noqa: E402
import sdf_kit as k  # noqa: E402

W, H, T = 1.0, 1.0, 0.12
CORNER, EDGE = 0.18, 0.05
FRONT = -T / 2
BAR_W, BAR_UP, SPAN = 0.075, 0.05, 0.26
BAR_EDGE = 0.032                 # rounding of the bar edges (bar half width 0.0375): plump
BAR_EMBED = 0.02
JOIN_K = 0.02                    # soft 2D join where bars cross
EQ_GAP = 0.10 + 0.075            # equals: 0.10 clear gap between the bars (centre lines 0.175 apart;
                                 # 0.10 centre to centre left a 0.025 slit that merged at 60 px)
Q = 0.24                         # quadrant centre offset

VIEW_ELEVATION_DEG = 8.0
CREAM_HEX = "#EFECE6"
FACE_GRAD = (1.07, 0.93)
BODY_RIM, SIDE_RIM, TOP_RIM = 0.60, 0.86, 0.86
RIM_WARM = (0.0, 0.10, 0.35)
LEFT_RIM = 0.95                  # key-lit left edge stays below 250
# sign colours: base, (light hex, weight up), (dark hex, weight down) -- as the earlier icons
SIGNS = {
    "plus": ((-Q, Q), 0, "#F28C77", ("#F8AC98", 0.50), ("#FCA48A", 0.0), (1, 0, 0)),
    "minus": ((Q, Q), None, "#B3A3C8", ("#E2D3EE", 0.55), ("#6656A4", 0.50), (0, 1, 0)),
    "times": ((-Q, -Q), 45, "#7DC99C", ("#B8E6C9", 0.70), ("#2A9262", 0.60), (0, 0, 1)),
    "equals": ((Q, -Q), "eq", "#BE8E73", ("#F4DECE", 0.65), ("#8A4A26", 0.40), (1, 1, 0)),
}
RIM = os.environ.get("CLAY_AR_RIM", "4")
SHEEN = 0.15


def plate_sdf(P):
    x, y, z = P[:, 0], P[:, 1], P[:, 2]
    return k.extrude(k.rrect(x, z, W / 2, H / 2, CORNER), y, 0.0, T / 2, EDGE)


def _sign2(x, z, kind):
    """2D SDF of a sign centred at the origin."""
    h = SPAN / 2 - BAR_W / 2
    r = BAR_W / 2
    if kind is None:                                     # minus
        return k.seg2(x, z, -h, 0, h, 0) - r
    if kind in ("eq+", "eq-"):                          # one bar of the equals sign
        g = EQ_GAP / 2 * (1 if kind == "eq+" else -1)
        return k.seg2(x, z, -h, g, h, g) - r
    c, s = math.cos(math.radians(kind)), math.sin(math.radians(kind))
    a = k.seg2(x, z, -h * c, -h * s, h * c, h * s) - r
    b = k.seg2(x, z, h * s, -h * c, -h * s, h * c) - r
    return k.smin(a, b, JOIN_K)


def sign_sdf(P, name, kind):
    cx, cz = SIGNS[name][0]
    x, y, z = P[:, 0], P[:, 1], P[:, 2]
    s = _sign2(x - cx, z - cz, kind)
    top, back = FRONT - BAR_UP, FRONT + BAR_EMBED
    return k.extrude(s, y, (top + back) / 2, (back - top) / 2, BAR_EDGE)


def _plate_colors(o):
    P = k.get_co(o.data)
    x, z = P[:, 0], P[:, 2]
    g = FACE_GRAD[1] + (FACE_GRAD[0] - FACE_GRAD[1]) * np.clip((z + H / 2) / H, 0, 1)
    rim = ((1 - (1 - SIDE_RIM) * k.ss(W / 2 - 0.06, W / 2, x)) * (1 - (1 - LEFT_RIM) * k.ss(-W / 2 + 0.06, -W / 2, x))
           * (1 - (1 - BODY_RIM) * k.ss(-H / 2 + 0.12, -H / 2, z)))
    g = g * rim * (1 - (1 - TOP_RIM) * k.ss(H / 2 - 0.05, H / 2, z))
    warm = 1 - (1 - rim)[:, None] * np.array(RIM_WARM)
    k.set_colors(o, k.lin(CREAM_HEX)[None, :] * g[:, None] * warm, (0, 0, 0))


def main():
    argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    out_dir = argv[0] if argv else os.path.join(os.path.dirname(HERE), "out", "arithmetic")
    os.makedirs(out_dir, exist_ok=True)
    ct.reset_scene()
    m = 0.03
    plate = k.build("Plate", plate_sdf, (-W / 2 - m, -T / 2 - m, -H / 2 - m), (W / 2 + m, T / 2 + m, H / 2 + m),
                    0.0042, 0.02)
    _plate_colors(plate)
    signs = []
    for name, ((cx, cz), kind, base, light, dark, part) in SIGNS.items():
        e = SPAN / 2 + 0.04
        # one start mesh per bar component (a shared start box leaves a membrane between the equals bars)
        for kd in (("eq+", "eq-") if kind == "eq" else (kind,)):
            o = k.build("Sign_" + name, lambda Q_, n=name, kd=kd: sign_sdf(Q_, n, kd),
                        (cx - e, FRONT - BAR_UP - 0.02, cz - e), (cx + e, FRONT + BAR_EMBED + 0.01, cz + e), 0.003, 0.01)
            k.set_colors(o, k.graded(base, light, dark, k.normals(o.data)[:, 2]), part)
            signs.append(o)
    signs = k.join("Signs", signs)
    objs = [plate, signs]
    k.tilt(objs, VIEW_ELEVATION_DEG)
    mat = k.zone_material("ClayArithmetic", SHEEN)
    for o in objs:
        o.data.materials.clear()
        o.data.materials.append(mat)
    ct.setup_scene(objs)
    k.light_overrides(rim=RIM)
    k.finish(objs, out_dir, "arithmetic")


main()
