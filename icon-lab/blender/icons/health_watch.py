"""Icon #32 health-watch: a plump cream smartwatch with a rose screen, a coral-red heart,
a short pulse trace, a crown and a terracotta strap loop (Studio Insights card illustration).

No tile (REFERENCE "no_tile"): composite.py writes health-watch.png (object + soft shadow,
tight crop), the card composite and the sheet from health-watch-render.png.
Geometry only; look from clay_theme (theme untouched). Pose: elevation 10 deg, yaw -15 deg
(objects turned, camera fixed).
Run: ./render.sh health_watch
Method: sdf_kit. Separate objects (contact creases): case with the screen inset, heart
(2D outline from resting_heart.py, domed), pulse tube, crown, strap loop (torus start mesh,
genus 1, no membrane).
Units: case 0.62 wide, 0.70 tall, 0.22 deep. X right, Z up, front at -Y.
"""
import math
import os
import sys

import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))
sys.path.insert(0, HERE)
import clay_theme as ct  # noqa: E402
import sdf_kit as k  # noqa: E402
import resting_heart as rh  # noqa: E402

CASE_W, CASE_H, CASE_D, CASE_R, CASE_EDGE = 0.62, 0.70, 0.22, 0.18, 0.07
SCR_W, SCR_H, SCR_R, SCR_D = 0.50, 0.58, 0.13, 0.015
FRONT = -CASE_D / 2
FLOOR = FRONT + SCR_D
HEART_W, HEART_Z, HEART_UP = 0.24, 0.07, 0.03
PULSE_SPAN, PULSE_R, PULSE_Z = 0.34, 0.015, -0.17
PULSE_ZS = 0.75                                  # trace heights x 0.75: the tall peak clears the heart tip
TRACE = [(-0.37, 0.0), (-0.23, 0.0), (-0.17, 0.08), (-0.06, -0.16), (0.05, 0.25), (0.13, 0.0), (0.37, 0.0)]
CROWN_D, CROWN_L, CROWN_Z = 0.08, 0.05, 0.06
STRAP_W, STRAP_T = 0.42, 0.08
LOOP_YC, LOOP_AY, LOOP_AZ = 0.20, 0.22, 0.52   # centre-line ellipse in (y, z): 0.17 above / below the case
PULSE = os.environ.get("CLAY_HW_PULSE", "1") == "1"

VIEW_ELEVATION_DEG, VIEW_YAW_DEG = 10.0, -15.0
CREAM_HEX = "#EEEAE1"
CREAM_GRAD = (("#F6F2EC", 0.20), ("#B4A99B", 0.25))
ROSE_HEX = "#EECDE0"
ROSE_GRAD = (("#F8E2EE", 0.55), ("#D2AAC0", 0.30))
HEART = ("#EA857A", ("#F7B6AA", 0.55), ("#B4564B", 0.40))   # small, faces the camera: more lift
CORAL = ("#EF8D7A", ("#F8A894", 0.50), ("#D88270", 0.30))
TERRA = ("#BC8F74", ("#E6C8B6", 0.60), ("#9A6E57", 0.40))
SHEEN = 0.12


def _smax(a, b, kk):
    return -k.smin(-a, -b, kk)


def case_sdf(P):
    x, y, z = P[:, 0], P[:, 1], P[:, 2]
    c = k.extrude(k.rrect(x, z, CASE_W / 2, CASE_H / 2, CASE_R), y, 0.0, CASE_D / 2, CASE_EDGE)
    s = k.rrect(x, z, SCR_W / 2, SCR_H / 2, SCR_R)
    return _smax(c, -np.maximum(s, y - FLOOR), 0.010)


def heart_sdf(P):
    s = HEART_W
    half = 0.05                                   # puffy round body, mostly sunk into the case;
    return k.extrude(rh.heart_lookup(P[:, 0] / s, (P[:, 2] - HEART_Z) / s) * s,    # front 0.03 above the floor
                     P[:, 1], FLOOR - HEART_UP + half, half, half - 0.005)


def pulse_sdf(P):
    f = PULSE_SPAN / 0.74
    x, y, z = P[:, 0] / f, P[:, 1], (P[:, 2] - PULSE_Z) / f
    d = None
    for (ax, az), (bx, bz) in zip(TRACE[:-1], TRACE[1:]):
        sd = k.seg2(x, z, ax, az * PULSE_ZS, bx, bz * PULSE_ZS)
        d = sd if d is None else k.smin(d, sd, 0.008)
    tube = np.hypot(d * f, y - FLOOR) - PULSE_R
    # hidden backing plate behind the screen floor: one solid, so the box start mesh spans no
    # membranes across the narrow V's of the trace
    plate = k.extrude(k.rrect(P[:, 0], P[:, 2] - PULSE_Z - 0.01, PULSE_SPAN / 2, 0.09, 0.02), y, FLOOR + 0.017,
                      0.011, 0.004)
    return np.minimum(tube, plate)


def crown_sdf(P):
    x, y, z = P[:, 0], P[:, 1], P[:, 2]
    return k.extrude(np.hypot(y, z - CROWN_Z) - CROWN_D / 2, x, CASE_W / 2 + CROWN_L / 2 - 0.02,
                     CROWN_L / 2 + 0.02, 0.018)


def strap_sdf(P):
    x, y, z = P[:, 0], P[:, 1] - LOOP_YC, P[:, 2]
    f = np.sqrt((y / LOOP_AY) ** 2 + (z / LOOP_AZ) ** 2)
    gy, gz = y / (LOOP_AY ** 2 * np.maximum(f, 1e-6)), z / (LOOP_AZ ** 2 * np.maximum(f, 1e-6))
    d = (f - 1) / np.maximum(np.hypot(gy, gz), 1e-6)            # first-order distance to the ellipse
    return k.extrude(np.abs(d) - STRAP_T / 2, x, 0.0, STRAP_W / 2, 0.03)


def _strap_start(name):
    o = k.torus_start(name, 0.36, 0.20, n=160, k=32)           # ring in x-z, axis y
    P = k.get_co(o.data)
    x, y, z = P[:, 0], P[:, 1], P[:, 2]
    Q = np.stack([y * 1.0, LOOP_YC + x * LOOP_AY / 0.36, z * LOOP_AZ / 0.36], 1)   # ring in y-z, axis x
    k.set_co(o.data, Q)
    return o


def _color(o, spec, part):
    base, light, dark = spec
    k.set_colors(o, k.graded(base, light, dark, k.normals(o.data)[:, 2]), part)


def main():
    argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    out_dir = argv[0] if argv else os.path.join(os.path.dirname(HERE), "out", "health-watch")
    os.makedirs(out_dir, exist_ok=True)
    ct.reset_scene()
    case = k.build("Case", case_sdf, (-0.34, -0.13, -0.38), (0.34, 0.13, 0.38), 0.0032, 0.010)
    P, nz = k.get_co(case.data), k.normals(case.data)[:, 2]
    s = k.rrect(P[:, 0], P[:, 2], SCR_W / 2, SCR_H / 2, SCR_R)
    g = (k.ss(FRONT + 0.002, FRONT + 0.013, P[:, 1]) * k.ss(0.025, 0.012, s))[:, None]   # rose by depth
    c = k.graded(CREAM_HEX, *CREAM_GRAD, nz) * (1 - g) + k.graded(ROSE_HEX, *ROSE_GRAD, nz) * g
    k.set_colors(case, c, np.hstack([0 * g, 0 * g, g]))
    hw = HEART_W / 2 + 0.03
    heart = k.build("Heart", heart_sdf, (-hw, FLOOR - 0.05, HEART_Z - hw), (hw, FLOOR + 0.08, HEART_Z + hw),
                    0.0018, 0.006)
    _color(heart, HEART, (1, 0, 0))
    crown = k.build("Crown", crown_sdf, (CASE_W / 2 - 0.06, -0.06, CROWN_Z - 0.06),
                    (CASE_W / 2 + 0.08, 0.06, CROWN_Z + 0.06), 0.002, 0.006)
    _color(crown, (CREAM_HEX,) + CREAM_GRAD, (0, 1, 0))
    strap = k.build("Strap", strap_sdf, voxel=0.0045, coarse=0.012, start=_strap_start)
    _color(strap, TERRA, (1, 1, 0))
    objs = [case, heart, crown, strap]
    if PULSE:
        hp = PULSE_SPAN / 2 + 0.03
        pulse = k.build("Pulse", pulse_sdf, (-hp, FLOOR - 0.03, PULSE_Z - 0.12), (hp, FLOOR + 0.04, PULSE_Z + 0.11),
                        0.0015, 0.005)
        _color(pulse, CORAL, (1, 0, 1))
        objs.append(pulse)
    from mathutils import Matrix
    import bpy
    M = (Matrix.Rotation(math.radians(VIEW_ELEVATION_DEG - ct.CAM_ELEVATION_DEG), 4, "X")
         @ Matrix.Rotation(math.radians(-VIEW_YAW_DEG), 4, "Z"))   # camera yaw -15 = objects turned +15
    for o in objs:
        o.matrix_world = M
    bpy.context.view_layer.update()
    mat = k.zone_material("ClayHealthWatch", SHEEN)
    for o in objs:
        o.data.materials.clear()
        o.data.materials.append(mat)
    ct.setup_scene(objs)
    k.light_overrides()
    k.finish(objs, out_dir, "health-watch-render")


main()
