"""Icon #26 thirst: a cream tumbler with water and one floating drop (trend tile "Thirst").

Geometry only; look from clay_theme (theme untouched). Pose exception: elevation 18 deg.
Run: Blender -b --factory-startup --python icons/thirst.py -- <out_dir>
Method: sdf_kit. The glass is solid clay up to the water level and a hollow wall above it
(opaque: only the water top shows). Separate objects (contact creases): glass (lathe start
mesh, so no membrane over the opening), water disc with meniscus, drop (round cone).
Units: glass height 0.80; drop 0.32 high, 0.10 right of the rim. X right, Z up, front at -Y.
"""
import math
import os
import sys

import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))
import clay_theme as ct  # noqa: E402
import sdf_kit as k  # noqa: E402

TOP_R, BOT_R, HGT, WALL = 0.31, 0.26, 0.80, 0.06
Z0 = -HGT / 2                                   # base at z = -0.40
WATER_FILL = 0.90                               # brief 70 %: at 18 deg the near rim hides a surface
ZW = Z0 + WATER_FILL * HGT                      # that is 0.24 down in a 0.42-wide glass; 90 % shows it
TAPER = (TOP_R - BOT_R) / HGT
BASE_R = 0.08                                   # soft base corner
DROP_H, DROP_R1, DROP_R2 = 0.32, 0.12, 0.026
DROP_X = TOP_R + 0.10 + DROP_R1                  # gap 0.10 from the rim (orchestrator, after review)
DROP_Z = Z0 + HGT + 0.04                        # bottom-sphere centre: drop slightly above rim height

VIEW_ELEVATION_DEG = 18.0
CREAM_HEX = "#EEEAE1"
CREAM_GRAD = (("#F8F4EE", 0.25), ("#A89C8C", 0.45))
WATER_HEX = "#7CB8E0"
WATER_GRAD = (("#A8D6F0", 0.25), ("#4A86B4", 0.60))
SHEEN = 0.15


def _rho_sheared(x, y, z):
    return np.hypot(x, y) - TAPER * (z - Z0)       # straight cylinder in (rho', z)


def glass_sdf(P):
    x, y, z = P[:, 0], P[:, 1], P[:, 2]
    r = _rho_sheared(x, y, z)
    zf = ZW - 0.035                                # glass floor under the water (no z-fight)
    lower = k.rrect(r, z - (Z0 + zf) / 2, BOT_R, (zf - Z0) / 2, BASE_R)
    wall = k.seg2(r, z, BOT_R - WALL / 2, ZW - 0.15, BOT_R - WALL / 2, Z0 + HGT - WALL / 2) - WALL / 2
    return np.minimum(lower, wall)


def water_sdf(P):
    x, y, z = P[:, 0], P[:, 1], P[:, 2]
    r = _rho_sheared(x, y, z)
    inner = BOT_R - WALL
    h = ZW + 0.025 * k.ss(inner - 0.08, inner, r)  # soft meniscus at the wall
    return np.maximum.reduce([r - (inner + 0.012), z - h, (ZW - 0.05) - z])


def drop_sdf(P):
    x, y, z = P[:, 0] - DROP_X, P[:, 1], P[:, 2] - DROP_Z
    h = DROP_H - DROP_R1 - DROP_R2
    q = np.hypot(x, y)
    b = (DROP_R1 - DROP_R2) / h
    a = math.sqrt(1 - b * b)
    kk = -b * q + a * z
    return np.where(kk < 0, np.hypot(q, z) - DROP_R1,
                    np.where(kk > a * h, np.hypot(q, z - h) - DROP_R2, a * q + b * z - DROP_R1))


def _lathe_start(name, steps=96):
    """Glass cross-section spun around Z (a cube start would span the opening)."""
    import bmesh
    from mathutils import Matrix
    zt = Z0 + HGT
    prof = [(0.001, Z0), (BOT_R - 0.05, Z0), (BOT_R, Z0 + 0.05), (TOP_R, zt - 0.03), (TOP_R - 0.03, zt),
            (TOP_R - WALL, zt - 0.03), (BOT_R - WALL + TAPER * (ZW - Z0), ZW - 0.035), (0.001, ZW - 0.035)]
    bm = bmesh.new()
    rings = []
    for i in range(steps):
        M = Matrix.Rotation(2 * math.pi * i / steps, 3, "Z")
        rings.append([bm.verts.new(M @ __import__("mathutils").Vector((r, 0, z))) for r, z in prof])
    n = len(prof)
    for i in range(steps):
        A, B = rings[i], rings[(i + 1) % steps]
        for j in range(n - 1):
            bm.faces.new((A[j], A[j + 1], B[j + 1], B[j]))
    bm.faces.new([r[0] for r in rings][::-1])
    bm.faces.new([r[-1] for r in rings])
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces[:])
    bmesh.ops.triangulate(bm, faces=bm.faces[:])
    return k._link(name, bm)


def main():
    argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    out_dir = argv[0] if argv else os.path.join(os.path.dirname(HERE), "out", "thirst")
    os.makedirs(out_dir, exist_ok=True)
    ct.reset_scene()
    glass = k.build("Glass", glass_sdf, voxel=0.0045, coarse=0.012, start=_lathe_start)
    k.set_colors(glass, k.graded(CREAM_HEX, *CREAM_GRAD, k.normals(glass.data)[:, 2]), (0, 0, 0))
    inner = BOT_R - WALL + TAPER * (ZW - Z0) + 0.02
    water = k.build("Water", water_sdf, (-inner, -inner, ZW - 0.07), (inner, inner, ZW + 0.04), 0.004, 0.010)
    drop = k.build("Drop", drop_sdf, (DROP_X - 0.15, -0.15, DROP_Z - 0.15), (DROP_X + 0.15, 0.15, DROP_Z + 0.25),
                   0.0025, 0.008)
    for o in (water, drop):
        k.set_colors(o, k.graded(WATER_HEX, *WATER_GRAD, k.normals(o.data)[:, 2]), (0, 0, 1))
    objs = [glass, water, drop]
    k.tilt(objs, VIEW_ELEVATION_DEG)
    mat = k.zone_material("ClayThirst", SHEEN)
    for o in objs:
        o.data.materials.clear()
        o.data.materials.append(mat)
    ct.setup_scene(objs)
    k.light_overrides()
    k.finish(objs, out_dir, "thirst")


main()
