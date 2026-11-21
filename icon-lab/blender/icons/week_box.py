"""Icon #31 week-box: an open weekly pill organiser (illustration on the Studio setup card).

No tile: rendered alone on transparency; composite.py (opt-in REFERENCE "no_tile") adds the
soft cast shadow (week-box.png) and the #E9E9FB card composite.
Geometry only; look from clay_theme (theme untouched). Pose: elevation 22 deg, yaw -18 deg
(the objects are turned instead of the camera, as k.tilt does for elevation).
Run: Blender -b --factory-startup --python icons/week_box.py -- <out_dir>
     (writes week-box-render.png; then python3 composite.py week-box)
Method: sdf_kit (base: boolean-cut start mesh, so no membrane over the wells). Separate objects (contact creases): base with 3 soft wells (cells 3-5),
4 closed lid caps, 3 open lids (70 deg, leaning back), pills, day marks.
Units: base 1.0 long. X right, Z up (top of the base at z = 0), front at -Y.
"""
import math
import os
import sys

import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))
import clay_theme as ct  # noqa: E402
import sdf_kit as k  # noqa: E402

BAR_L, BAR_D, BAR_H, BAR_R = 1.0, 0.24, 0.16, 0.03   # brief r 0.05: with 0.18-deep cells in a 0.24 bar
                                                     # it cut notches into the front and back edges
PITCH, CELL_W, CELL_D, WELL = 0.14, 0.12, 0.18, 0.10
CELLS = [(i - 3) * PITCH for i in range(7)]
OPEN = (2, 3, 4)                                 # cells 3, 4, 5
CAP_H = 0.02
LID_T, LID_DEG = 0.025, 70.0
CAPS_LEN, CAPS_D = 0.09, 0.045
TAB_D, TAB_T = 0.06, 0.025
MARK_D, MARK_UP = 0.025, 0.008
DAY_MARKS = os.environ.get("CLAY_WB_MARKS", "0") == "1"   # off: speckle at 110 px (brief allows)

VIEW_ELEVATION_DEG, VIEW_YAW_DEG = 22.0, -18.0
CREAM_HEX = "#EEEAE1"
CREAM_GRAD = (("#F6F2EC", 0.20), ("#B4A99B", 0.25))
CORAL = ("#EF8D7A", ("#F8A894", 0.50), ("#D88270", 0.30))
LILAC = ("#A896BE", ("#D8C8E6", 0.55), ("#76668F", 0.55))
MINT = ("#76BC92", ("#A6DCBC", 0.50), ("#558F6E", 0.50))
GREY_HEX = "#BDB4A8"
SHEEN = 0.15


def _smax(a, b, kk):
    return -k.smin(-a, -b, kk)


def _rbox(px, py, pz, hx, hy, hz, r):
    qx, qy, qz = np.abs(px) - hx + r, np.abs(py) - hy + r, np.abs(pz) - hz + r
    return (np.sqrt(np.maximum(qx, 0) ** 2 + np.maximum(qy, 0) ** 2 + np.maximum(qz, 0) ** 2)
            + np.minimum(np.maximum(qx, np.maximum(qy, qz)), 0) - r)


def base_sdf(P):
    x, y, z = P[:, 0], P[:, 1], P[:, 2]
    bar = _rbox(x, y, z + BAR_H / 2, BAR_L / 2, BAR_D / 2, BAR_H / 2, BAR_R)
    wells = None
    for i in OPEN:
        w = _rbox(x - CELLS[i], y, z, CELL_W / 2, CELL_D / 2, WELL, 0.04)
        wells = w if wells is None else np.minimum(wells, w)
    return _smax(bar, -wells, 0.015)             # soft rims, soft walls between the cells


def cap_sdf(P, cx):
    x, y, z = P[:, 0] - cx, P[:, 1], P[:, 2] - CAP_H / 2 + 0.004
    return _rbox(x, y, z, CELL_W / 2 + 0.004, CELL_D / 2 + 0.004, CAP_H / 2 + 0.004, 0.012)


def lid_sdf(P, cx):
    a = math.radians(LID_DEG)
    dy, dz = math.cos(a), math.sin(a)            # along the lid: up and back
    ny, nz = -math.sin(a), math.cos(a)           # lid normal (front-up)
    hy, hz = CELL_D / 2 + 0.006, LID_T / 2 - 0.012     # hinge on the back rim, slightly embedded
    x = P[:, 0] - cx
    ry, rz = P[:, 1] - hy, P[:, 2] - hz
    u = ry * dy + rz * dz
    v = ry * ny + rz * nz
    return _rbox(x, u - CELL_D / 2, v, CELL_W / 2, CELL_D / 2, LID_T / 2, 0.011)


def capsule_sdf(P, c, deg):
    ux, uy = math.cos(math.radians(deg)), math.sin(math.radians(deg))
    h = CAPS_LEN / 2 - CAPS_D / 2
    x, y, z = P[:, 0] - c[0], P[:, 1] - c[1], P[:, 2] - c[2]
    t = np.clip(x * ux + y * uy, -h, h)
    return np.sqrt((x - t * ux) ** 2 + (y - t * uy) ** 2 + z ** 2) - CAPS_D / 2


def tablet_sdf(P, c, tilt):
    x, y, z = P[:, 0] - c[0], P[:, 1] - c[1], P[:, 2] - c[2]
    ct_, st = math.cos(math.radians(tilt)), math.sin(math.radians(tilt))
    y2, z2 = y * ct_ + z * st, -y * st + z * ct_
    return k.extrude(np.hypot(x, y2) - TAB_D / 2, z2, 0.0, TAB_T / 2, 0.010)


def mark_sdf(P, cx):
    x, y, z = P[:, 0] - cx, P[:, 1] + BAR_D / 2, P[:, 2] + BAR_H / 2
    return k.extrude(np.hypot(x, z) - MARK_D / 2, y, 0.0, MARK_UP, MARK_UP * 0.9)


def _base_start(name):
    """Bar with the 3 wells already cut (exact boolean) as the start mesh: a plain box start
    projected a membrane over the wells."""
    import bpy
    import bmesh
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0)
    bmesh.ops.scale(bm, vec=(BAR_L - 0.01, BAR_D - 0.01, BAR_H - 0.01), verts=bm.verts)
    bmesh.ops.translate(bm, vec=(0, 0, -BAR_H / 2), verts=bm.verts)
    obj = k._link(name, bm)
    for i in OPEN:
        cb = bmesh.new()
        bmesh.ops.create_cube(cb, size=1.0)
        bmesh.ops.scale(cb, vec=(CELL_W - 0.01, CELL_D - 0.01, 2 * WELL - 0.01), verts=cb.verts)
        bmesh.ops.translate(cb, vec=(CELLS[i], 0, 0), verts=cb.verts)
        cut = k._link("Cut%d" % i, cb)
        m = obj.modifiers.new("Cut%d" % i, "BOOLEAN")
        m.operation, m.object, m.solver = "DIFFERENCE", cut, "EXACT"
        bpy.context.view_layer.objects.active = obj
        bpy.ops.object.modifier_apply(modifier=m.name)
        bpy.data.objects.remove(cut, do_unlink=True)
    return obj


def _color(o, spec, part):
    base, light, dark = spec
    k.set_colors(o, k.graded(base, light, dark, k.normals(o.data)[:, 2]), part)


def _cream(o, part=(0, 0, 0)):
    _color(o, (CREAM_HEX,) + CREAM_GRAD, part)


def main():
    argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    out_dir = argv[0] if argv else os.path.join(os.path.dirname(HERE), "out", "week-box")
    os.makedirs(out_dir, exist_ok=True)
    ct.reset_scene()
    base = k.build("Base", base_sdf, voxel=0.003, coarse=0.008, start=_base_start)
    _cream(base)
    caps = []
    for i in (0, 1, 5, 6):
        cx = CELLS[i]
        o = k.build("Cap%d" % i, lambda Q, cx=cx: cap_sdf(Q, cx), (cx - 0.08, -0.11, -0.02), (cx + 0.08, 0.11, 0.04),
                    0.0025, 0.008)
        _cream(o, (0, 1, 0))
        caps.append(o)
    lids = []
    for i in OPEN:
        cx = CELLS[i]
        o = k.build("Lid%d" % i, lambda Q, cx=cx: lid_sdf(Q, cx), (cx - 0.08, 0.04, -0.03), (cx + 0.08, 0.20, 0.22),
                    0.0025, 0.008)
        _cream(o, (0, 1, 0))
        lids.append(o)
    zc = -0.045                                   # pills sit high in the wells (the floor is never in view)
    pills = []
    c3 = (CELLS[2], 0.025, zc)
    o = k.build("Coral", lambda Q: capsule_sdf(Q, c3, 0.0), (c3[0] - 0.07, c3[1] - 0.05, zc - 0.05),
                (c3[0] + 0.07, c3[1] + 0.05, zc + 0.05), 0.0018, 0.006)
    _color(o, CORAL, (1, 0, 0))
    pills.append(o)
    for j, (dx, dy, dz, tl) in enumerate(((-0.017, 0.035, -0.004, 0.0), (0.018, 0.010, 0.006, 14.0))):
        c = (CELLS[3] + dx, dy, zc + dz)
        o = k.build("Tab%d" % j, lambda Q, c=c, tl=tl: tablet_sdf(Q, c, tl), (c[0] - 0.05, c[1] - 0.05, c[2] - 0.04),
                    (c[0] + 0.05, c[1] + 0.05, c[2] + 0.04), 0.0018, 0.006)
        _color(o, LILAC, (1, 0, 1))
        pills.append(o)
    c5 = (CELLS[4], 0.025, zc)
    o = k.build("Mint", lambda Q: capsule_sdf(Q, c5, 25.0), (c5[0] - 0.07, c5[1] - 0.06, zc - 0.05),
                (c5[0] + 0.07, c5[1] + 0.06, zc + 0.05), 0.0018, 0.006)
    _color(o, MINT, (0, 1, 1))
    pills.append(o)
    objs = [base, k.join("Caps", caps), k.join("Lids", lids), k.join("Pills", pills)]
    if DAY_MARKS:
        marks = []
        for i, cx in enumerate(CELLS):
            o = k.build("Mark%d" % i, lambda Q, cx=cx: mark_sdf(Q, cx), (cx - 0.03, -0.14, -0.11), (cx + 0.03, -0.11, -0.05),
                        0.0012, 0.004)
            k.set_colors(o, np.broadcast_to(k.lin(GREY_HEX), (len(o.data.vertices), 3)), (0, 0, 1))
            marks.append(o)
        objs.append(k.join("Marks", marks))
    from mathutils import Matrix
    M = (Matrix.Rotation(math.radians(VIEW_ELEVATION_DEG - ct.CAM_ELEVATION_DEG), 4, "X")
         @ Matrix.Rotation(math.radians(-VIEW_YAW_DEG), 4, "Z"))   # camera yaw -18 = objects turned +18
    for o in objs:
        o.matrix_world = M
    import bpy
    bpy.context.view_layer.update()
    mat = k.zone_material("ClayWeekBox", SHEEN)
    for o in objs:
        o.data.materials.clear()
        o.data.materials.append(mat)
    ct.setup_scene(objs)
    k.light_overrides()
    k.finish(objs, out_dir, "week-box-render")


if __name__ == "__main__":   # importable by week_box_closed.py (#33)
    main()
