"""Icon #37 protocol-group-c3: an open soft pebble compact (Cream, rosé interior, lid hinged at the
back and open ~100 deg) with a mixed handful inside (Coral/Cream capsule, amber softgel, cream tablet,
Mint/Cream capsule) and two items spilled in front (Mint/Cream capsule, cream tablet).
Group kind, idea C3 (after refs/group/07). Look: clay_theme + pill_kit.pill_light. View elevation 12 deg.
Case: approximate-ellipse SDF slab with very soft edges minus a soft cavity; boolean start mesh
(unused: the cube start projects cleanly, a bowl is genus 0). Lid: same oval, a separate object, hinge hidden behind the back rim.
Run: ./render.sh protocol_group_c3
"""
import math
import os
import sys

import bmesh
import bpy
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))
import clay_theme as ct  # noqa: E402
import pill_kit as pk  # noqa: E402
import sdf_kit as k  # noqa: E402

A, B, H = 0.50, 0.31, 0.27         # case: 1.0 wide, 0.62 deep, ~0.26 high at the rim
EDGE = 0.10                        # very soft outer edges
WALL, FLOOR, CAV_R = 0.05, 0.08, 0.06
LID_T, LID_R, LID_DEG = 0.07, 0.032, 100.0
HINGE = (0.28, 0.25)               # hinge axis (y, z), along x
VIEW_ELEVATION_DEG = 12.0
S = 0.42                           # item scale inside and in front
# name, centre, rotation (roll, screen angle, yaw), spec
INSIDE_CAPS = (("Coral", (-0.25, 0.00, 0.27), (0, 35, 0), pk.CORAL, (1, 0, 0)),
               ("Mint", (0.05, -0.14, 0.24), (0, -8, -6), pk.MINT, (0, 1, 1)))
INSIDE_GEL = ((0.02, 0.14, 0.30), (0, -20, 0))
INSIDE_TAB = ((0.30, 0.02, 0.27), (70, 10, -10))
FRONT_CAP = ("MintF", (-0.27, -0.50, 0.08 * S / 0.42), (0, 0, 22), pk.MINT, (0, 1, 1))
FRONT_TAB = ((0.29, -0.49, 0.06), (18, 0, 0))
S_TAB = 0.30


def ell(x, y, a, b):
    k0 = np.sqrt((x / a) ** 2 + (y / b) ** 2)
    k1 = np.maximum(np.sqrt((x / a ** 2) ** 2 + (y / b ** 2) ** 2), 1e-9)
    return k0 * (k0 - 1) / k1


def outer_sdf(P):
    return k.extrude(ell(P[:, 0], P[:, 1], A, B), P[:, 2], H / 2, H / 2, EDGE)


def cavity_sdf(P):
    return k.extrude(ell(P[:, 0], P[:, 1], A, B) + WALL, P[:, 2], FLOOR + 0.3, 0.3, CAV_R)


def case_sdf(P):
    return pk._rint(outer_sdf(P), -cavity_sdf(P), 0.022)    # rounded intersection: soft rim, no saddle


def lid_sdf(P):
    a = math.radians(LID_DEG)                 # open: undo the rotation about the hinge axis
    y, z = P[:, 1] - HINGE[0], P[:, 2] - HINGE[1]
    yc = y * math.cos(a) - z * math.sin(a)
    zc = y * math.sin(a) + z * math.cos(a)
    Q = np.stack([P[:, 0], yc + HINGE[0] - 0.0, zc + HINGE[1]], axis=1)
    base = H + 0.004
    return k.extrude(ell(Q[:, 0], Q[:, 1], A, B), Q[:, 2], base + LID_T / 2, LID_T / 2, LID_R)


def _case_start(name):
    bm = bmesh.new()
    bmesh.ops.create_cone(bm, cap_ends=True, segments=96, radius1=1.0, radius2=1.0, depth=1.0)
    bmesh.ops.scale(bm, vec=(A - 0.02, B - 0.02, H - 0.02), verts=bm.verts)
    bmesh.ops.translate(bm, vec=(0, 0, H / 2), verts=bm.verts)
    obj = k._link(name, bm)
    cb = bmesh.new()
    bmesh.ops.create_cone(cb, cap_ends=True, segments=96, radius1=1.0, radius2=1.0, depth=1.0)
    bmesh.ops.scale(cb, vec=(A - WALL - 0.04, B - WALL - 0.04, 0.6), verts=cb.verts)
    bmesh.ops.translate(cb, vec=(0, 0, FLOOR + 0.04 + 0.3), verts=cb.verts)
    cut = k._link("Cut", cb)
    m = obj.modifiers.new("Cut", "BOOLEAN")
    m.operation, m.object, m.solver = "DIFFERENCE", cut, "EXACT"
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.modifier_apply(modifier=m.name)
    bpy.data.objects.remove(cut, do_unlink=True)
    return obj


def main():
    argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    out_dir = argv[0] if argv else os.path.join(os.path.dirname(HERE), "out", "protocol-group-c3")
    os.makedirs(out_dir, exist_ok=True)
    ct.reset_scene()
    case = k.build("Case", case_sdf, (-A - 0.03, -B - 0.03, -0.03), (A + 0.03, B + 0.03, H + 0.03), 0.005, 0.012)
    P = k.get_co(case.data)
    w = k.ss(-0.004, -0.03, outer_sdf(P))[:, None]          # 1 inside the cavity, 0 on the outside + rim
    nz = k.normals(case.data)[:, 2]
    rgb = k.graded(*pk.CREAM, nz) * (1 - w) + k.graded(*pk.ROSE, nz) * w
    k.set_colors(case, rgb, (0, 1, 0) * 1)
    part = np.where(w[:, 0] > 0.5, 1.0, 0.0)
    m = np.ones((len(P), 4), dtype=np.float32)
    m[:, 0], m[:, 1], m[:, 2] = part, 1 - part, part        # mask: rosé = magenta, cream = green
    case.data.color_attributes["part"].data.foreach_set("color", m.ravel())
    lid = k.build("Lid", lid_sdf, (-0.55, 0.15, 0.10), (0.55, 0.50, 0.95), 0.005, 0.012)
    pk.color(lid, pk.CREAM, (0, 1, 0))
    objs = [case, lid]
    items = [("Case", case, case_sdf), ("Lid", lid, lid_sdf)]
    for name, c, (ro, an, ya), spec, part in INSIDE_CAPS + (FRONT_CAP,):
        R = pk.rot(ro, an, ya)
        cap, body = pk.build_capsule(name, c, R, S, spec, pk.CREAM, part, (0, 1, 0), voxel=0.003)
        objs += [cap, body]
        items.append((name, cap, lambda Q, c=c, R=R: np.minimum(pk.capsule_cap(Q, c, R, S),
                                                                  pk.capsule_body(Q, c, R, S))))
    c, (ro, an, ya) = INSIDE_GEL
    R = pk.rot(ro, an, ya)
    gel = pk.build_softgel("Softgel", c, R, S, (1, 1, 0), voxel=0.003)
    objs.append(gel)
    items.append(("Gel", gel, lambda Q, c=c, R=R: pk.softgel(Q, c, R, S)))
    for name, (c, (ro, an, ya)) in (("Tab", INSIDE_TAB), ("TabF", FRONT_TAB)):
        R = pk.rot(ro, an, ya)
        t = pk.build_tablet(name, c, R, S_TAB, (0, 0, 1), voxel=0.0025)
        objs.append(t)
        items.append((name, t, lambda Q, c=c, R=R: pk.tablet(Q, c, R, S_TAB)))
    pk.check_gaps(items)
    pk.finish(objs, out_dir, "protocol-group-c3", VIEW_ELEVATION_DEG)


if __name__ == "__main__":
    main()
