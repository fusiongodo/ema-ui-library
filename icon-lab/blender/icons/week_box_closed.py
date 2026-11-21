"""Icon #33 week-box-closed: the #31 weekly pill organiser with all seven lids closed and a small
mint check on the lid of cell 4 (illustration on the Protocols card "Today · all as planned").

Sibling of week_box.py (#31): imports its geometry, pose, colours and material; #31 renders unchanged.
Framing: the three standing lids of #31 are built only to frame the camera and place the lights
exactly as in #31, then removed before the render, so the box sits at the same size and place.
No tile: composite.py (opt-in REFERENCE "crop_like") crops week-box-closed.png like week-box.png.
Run: Blender -b --factory-startup --python icons/week_box_closed.py -- <out_dir>
Units as in week_box.py: base 1.0 long. X right, Z up (top of the base at z = 0), front at -Y.
"""
import math
import os
import sys

import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
sys.path.insert(0, os.path.dirname(HERE))
import clay_theme as ct  # noqa: E402
import sdf_kit as k  # noqa: E402
import week_box as wb  # noqa: E402

CHECK_R = 0.012                                  # tube radius = height above the lid (brief 0.012)
# check in lid-local x/y (top face), about 0.10 wide; y is stretched because the top face is
# foreshortened to ~0.37 at the 22 deg view, so the tick reads as a check from the front
CHECK_PTS = ((-0.044, 0.004), (-0.016, -0.036), (0.050, 0.050))
CAP_TOP = wb.CAP_H                               # flat top of a closed cap


def base_sdf(P):
    """#31 bar without wells."""
    x, y, z = P[:, 0], P[:, 1], P[:, 2]
    return wb._rbox(x, y, z + wb.BAR_H / 2, wb.BAR_L / 2, wb.BAR_D / 2, wb.BAR_H / 2, wb.BAR_R)


def check_sdf(P, cx):
    x, y, z = P[:, 0] - cx, P[:, 1], P[:, 2] - CAP_TOP
    (ax, ay), (bx, by), (qx, qy) = CHECK_PTS
    d = np.minimum(k.seg2(x, y, ax, ay, bx, by), k.seg2(x, y, bx, by, qx, qy))
    return np.hypot(d, z) - CHECK_R              # round tube, centre line on the lid top


def main():
    argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    out_dir = argv[0] if argv else os.path.join(os.path.dirname(HERE), "out", "week-box-closed")
    os.makedirs(out_dir, exist_ok=True)
    ct.reset_scene()
    open_cells = wb.OPEN
    wb.OPEN = ()                                  # start mesh without well cuts
    base = k.build("Base", base_sdf, voxel=0.003, coarse=0.008, start=wb._base_start)
    wb._cream(base)
    caps = []
    for i in range(7):
        cx = wb.CELLS[i]
        o = k.build("Cap%d" % i, lambda Q, cx=cx: wb.cap_sdf(Q, cx), (cx - 0.08, -0.11, -0.02),
                    (cx + 0.08, 0.11, 0.04), 0.0025, 0.008)
        wb._cream(o, (0, 1, 0))
        caps.append(o)
    cx4 = wb.CELLS[3]
    check = k.build("Check", lambda Q: check_sdf(Q, cx4), (cx4 - 0.08, -0.07, CAP_TOP - 0.03),
                    (cx4 + 0.08, 0.08, CAP_TOP + 0.03), 0.0015, 0.005)
    wb._color(check, wb.MINT, (0, 1, 1))
    frame = []                                    # #31 standing lids: framing only
    for i in open_cells:
        cx = wb.CELLS[i]
        frame.append(k.build("Frame%d" % i, lambda Q, cx=cx: wb.lid_sdf(Q, cx), (cx - 0.08, 0.04, -0.03),
                             (cx + 0.08, 0.20, 0.22), 0.0025, 0.008))
    objs = [base, k.join("Caps", caps), check]
    from mathutils import Matrix
    M = (Matrix.Rotation(math.radians(wb.VIEW_ELEVATION_DEG - ct.CAM_ELEVATION_DEG), 4, "X")
         @ Matrix.Rotation(math.radians(-wb.VIEW_YAW_DEG), 4, "Z"))
    for o in objs + frame:
        o.matrix_world = M
    import bpy
    bpy.context.view_layer.update()
    mat = k.zone_material("ClayWeekBox", wb.SHEEN)
    for o in objs:
        o.data.materials.clear()
        o.data.materials.append(mat)
    ct.setup_scene(objs + frame)                  # camera + lights exactly as #31
    for o in frame:
        me = o.data
        bpy.data.objects.remove(o)
        bpy.data.meshes.remove(me)
    k.light_overrides()
    k.finish(objs, out_dir, "week-box-closed-render")


if __name__ == "__main__":
    main()
