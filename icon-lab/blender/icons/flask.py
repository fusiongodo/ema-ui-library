"""Icon #30 flask: a cream Erlenmeyer flask with lilac liquid and two bubbles
(Insights Trials, "Find out if something really helps").

Geometry only; look from clay_theme (theme untouched).
Run: Blender -b --factory-startup --python icons/flask.py -- <out_dir>
Method: sdf_kit. Body + neck as one surface of revolution (rounded trapezoid smooth-unioned
with the neck: soft shoulder); lip ring and two bubbles as separate objects (creases).
Liquid: lilac colour zone on the lower 40 % of the body, soft step 0.01 at the level line.
Lilac = the approved lighter lilac of #17 dual-n-back.
Units: body bottom width 1.0, height 0.78. X right, Z up, front at -Y.
"""
import os
import sys

import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))
import clay_theme as ct  # noqa: E402
import sdf_kit as k  # noqa: E402

BODY_W, BODY_H, BASE_R = 1.0, 0.78, 0.12
NECK_R, NECK_H = 0.15, 0.26
LIP_R, LIP_H = 0.19, 0.06
Z0 = -0.55                                       # base
ZN = Z0 + BODY_H                                 # shoulder / neck start
ZL = ZN + NECK_H                                 # lip ring centre band
LIQ = Z0 + 0.40 * BODY_H                         # level line
BUBBLES = ((0.05, ZL + LIP_H / 2 + 0.16, 0.065), (-0.07, ZL + LIP_H / 2 + 0.36, 0.045))   # 0.13 and 0.09

VIEW_ELEVATION_DEG = 8.0
CREAM_HEX = "#E9E4DC"
CREAM_GRAD = (("#F6F2EC", 0.20), ("#B4A99B", 0.25))
LILAC_HEX = "#A694BD"
LILAC_GRAD = (("#DCCDEA", 0.65), ("#76668F", 0.55))
SIDE_DARK = 0.75                                 # silhouette roll-off: the cone reads round
SHEEN = 0.15


def _trapezoid(px, pz, r1, r2, he):
    """iq trapezoid: bottom half-width r1, top half-width r2, half-height he (centred)."""
    px = np.abs(px)
    k1x, k1z = r2, he
    k2x, k2z = r2 - r1, 2 * he
    cax = px - np.minimum(px, np.where(pz < 0, r1, r2))
    caz = np.abs(pz) - he
    t = np.clip(((k1x - px) * k2x + (k1z - pz) * k2z) / (k2x * k2x + k2z * k2z), 0, 1)
    cbx, cbz = px - k1x + k2x * t, pz - k1z + k2z * t
    sgn = np.where((cbx < 0) & (caz < 0), -1.0, 1.0)
    return sgn * np.sqrt(np.minimum(cax * cax + caz * caz, cbx * cbx + cbz * cbz))


def body_sdf(P):
    x, y, z = P[:, 0], P[:, 1], P[:, 2]
    rho = np.hypot(x, y)
    zc = Z0 + BODY_H / 2
    cone = _trapezoid(rho, z - zc, BODY_W / 2 - BASE_R, NECK_R + 0.02 - 0.03, BODY_H / 2 - 0.03) - 0.03
    cone = np.maximum(cone, k.rrect(rho, z - zc, BODY_W / 2, BODY_H / 2, BASE_R))   # broad rounded base
    neck = k.rrect(rho, z - (ZN + ZL) / 2, NECK_R, (ZL - ZN) / 2, 0.03)   # top hidden inside the lip ring
    return k.smin(cone, neck, 0.06)


def lip_sdf(P):
    x, y, z = P[:, 0], P[:, 1], P[:, 2]
    return k.rrect(np.hypot(x, y), z - ZL, LIP_R, LIP_H / 2, 0.028)


def main():
    argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    out_dir = argv[0] if argv else os.path.join(os.path.dirname(HERE), "out", "flask")
    os.makedirs(out_dir, exist_ok=True)
    ct.reset_scene()
    body = k.build("Body", body_sdf, (-0.53, -0.53, Z0 - 0.03), (0.53, 0.53, ZL + 0.06), 0.0045, 0.014)
    P, nz = k.get_co(body.data), k.normals(body.data)[:, 2]
    w = k.ss(LIQ + 0.005, LIQ - 0.005, P[:, 2])[:, None]          # soft step 0.01 at the level line
    c = k.graded(CREAM_HEX, *CREAM_GRAD, nz) * (1 - w) + k.graded(LILAC_HEX, *LILAC_GRAD, nz) * w
    sd = (SIDE_DARK * k.ss(0.75, 0.0, -k.normals(body.data)[:, 1]))[:, None]
    c = c * (1 - sd) + (k.lin(CREAM_GRAD[1][0]) * (1 - w) + k.lin(LILAC_GRAD[1][0]) * w) * sd
    k.set_colors(body, c, np.hstack([w, 0 * w, 0 * w]))
    lip = k.build("Lip", lip_sdf, (-0.22, -0.22, ZL - 0.06), (0.22, 0.22, ZL + 0.06), 0.003, 0.010)
    k.set_colors(lip, k.graded(CREAM_HEX, *CREAM_GRAD, k.normals(lip.data)[:, 2]), (0, 1, 0))
    bubs = []
    for i, (bx, bz, br) in enumerate(BUBBLES):
        o = k.build("Bubble%d" % i, lambda Q, bx=bx, bz=bz, br=br: np.sqrt((Q[:, 0] - bx) ** 2 + Q[:, 1] ** 2
                                                                           + (Q[:, 2] - bz) ** 2) - br,
                    (bx - br - 0.03, -br - 0.03, bz - br - 0.03), (bx + br + 0.03, br + 0.03, bz + br + 0.03),
                    0.002, 0.006)
        k.set_colors(o, k.graded(LILAC_HEX, *LILAC_GRAD, k.normals(o.data)[:, 2]), (1, 0, 0))
        bubs.append(o)
    objs = [body, lip, k.join("Bubbles", bubs)]
    k.tilt(objs, VIEW_ELEVATION_DEG)
    mat = k.zone_material("ClayFlask", SHEEN)
    for o in objs:
        o.data.materials.clear()
        o.data.materials.append(mat)
    ct.setup_scene(objs)
    k.light_overrides()
    k.finish(objs, out_dir, "flask")


main()
