"""Icon #18 reaction: a plump cream clay stopwatch with a coral hand and a coral
push button (game tile under Play).

Geometry only; look from clay_theme (theme untouched, icon-level light tweaks as
calendar / scores). Run: Blender -b --factory-startup --python icons/reaction.py -- <out_dir>
Method: sdf_kit (SDF -> start mesh -> voxel remesh -> Newton projection).
Body (cream, one SDF): puck with an elliptic fully rounded rim (no flat side band),
soft dial inset, 4 tick nubs, crown stem and side nub, smooth-unioned. Coral parts
(hand + centre cap, push button) are separate objects, embedded for a contact crease.
The push button is an analytic surface of revolution (symmetric, tangent-continuous bevel).
Units: body diameter 1.0; X right, Z up, front at -Y.
"""
import math
import os
import sys

import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))
import clay_theme as ct  # noqa: E402
import sdf_kit as k  # noqa: E402

R, DEPTH, RIM_R = 0.5, 0.30, 0.12
FRONT = -DEPTH / 2
DIAL_R, DIAL_D, DIAL_SOFT = 0.37, 0.015, 0.02
FLOOR = FRONT + DIAL_D                     # dial floor (y)
TICK_R, TICK_D, TICK_H = 0.29, 0.05, 0.015
HAND_L, HAND_W, HAND_H = 0.28, 0.065, 0.03
HAND_DEG = 30.0                            # right of vertical (about 1 o'clock)
CAP_D = 0.10
STEM_D, STEM_H = 0.12, 0.07
BTN_D, BTN_H, BTN_DOME = 0.20, 0.09, 0.02
BTN_BEVEL = 0.03                           # edge bevel of the analytic push button
SIDE_D, SIDE_L, SIDE_DEG = 0.09, 0.09, 45.0

VIEW_ELEVATION_DEG = 8.0
CREAM_HEX = os.environ.get("CLAY_RX_CREAM", "#EEEAE2")
DIAL_HEX = os.environ.get("CLAY_RX_DIAL", "#FDFBF5")
TICK_HEX = os.environ.get("CLAY_RX_TICK", "#C1BAAC")
CORAL_HEX = os.environ.get("CLAY_RX_CORAL", "#EF8A76")
CREAM_GRAD = (("#FBF8F3", 0.10), ("#B4A99B", 0.35))
CORAL_GRAD = (("#EC8E7C", 0.25), ("#D97A68", 0.30))   # lit top / darker underside: shape stays readable
FACE_GRAD = (1.0, 0.965)                   # cream x this at the top / bottom
RIM = os.environ.get("CLAY_RX_RIM", "2")
VOXEL = float(os.environ.get("CLAY_VOXEL", "0.0042"))
VOXEL_SMALL = 0.003
SHEEN = 0.15


def body_sdf(P):
    x, y, z = P[:, 0], P[:, 1], P[:, 2]
    r = np.hypot(x, z)
    # elliptic rim: y scaled so the half depth 0.15 maps onto the rim radius 0.12
    d = k.extrude(r - R, y * (RIM_R / (DEPTH / 2)), 0.0, RIM_R, RIM_R)
    front = k.ss(-0.08, -0.12, y)
    d = d + DIAL_D * k.ss(DIAL_SOFT, -DIAL_SOFT, r - DIAL_R) * front
    for a in (0, 90, 180, 270):
        cx, cz = TICK_R * math.sin(math.radians(a)), TICK_R * math.cos(math.radians(a))
        q = np.stack([(x - cx) / (TICK_D / 2), (y - FLOOR - 0.007) / 0.022, (z - cz) / (TICK_D / 2)], 1)
        nub = (np.linalg.norm(q, axis=1) - 1) * (TICK_D / 2)
        d = k.smin(d, nub, 0.006)
    stem = k.extrude(np.hypot(x, y) - STEM_D / 2, z, R + STEM_H / 2 - 0.03, STEM_H / 2 + 0.03, 0.02)
    d = k.smin(d, stem, 0.02)
    ux, uz = math.sin(math.radians(SIDE_DEG)), math.cos(math.radians(SIDE_DEG))
    a0, a1 = R - 0.06, R - 0.06 + SIDE_L
    side = np.hypot(k.seg2(x, z, a0 * ux, a0 * uz, a1 * ux, a1 * uz), y) - SIDE_D / 2
    return k.smin(d, side, 0.015)


def hand_sdf(P):
    x, y, z = P[:, 0], P[:, 1], P[:, 2]
    vx, vz = math.sin(math.radians(HAND_DEG)), math.cos(math.radians(HAND_DEG))
    L = HAND_L - HAND_W / 2
    s = k.seg2(x, z, 0, 0, L * vx, L * vz) - HAND_W / 2
    top, bot = FLOOR - HAND_H, FLOOR + 0.01
    hand = k.extrude(s, y, (top + bot) / 2, (bot - top) / 2, 0.018)
    cap = np.linalg.norm(P - [0, FLOOR - CAP_D / 2 + 0.02, 0], axis=1) - CAP_D / 2
    return k.smin(hand, cap, 0.01)


def _button_profile(n_arc=40, n_line=30):
    """(r, z) outline of the push button: an inner shape (flat bottom, side at r 0.07,
    spherical top cap with 0.02 rise) offset by the edge bevel BTN_BEVEL, so every join
    is tangent-continuous. Runs from the bottom pole to the top pole."""
    b = BTN_BEVEL
    z0 = R + STEM_H - 0.015
    ri = BTN_D / 2 - b
    zb, zt = z0 + b, z0 + BTN_H - b                      # inner bottom, inner top (centre)
    Rd = (ri ** 2 + BTN_DOME ** 2) / (2 * BTN_DOME)      # cap sphere radius
    zc = zt - Rd
    ze = zc + math.sqrt(Rd ** 2 - ri ** 2)               # inner top at the edge (zt - dome)
    pts = [(r, z0) for r in np.linspace(0, ri, n_line, endpoint=False)]
    pts += [(ri + b * math.sin(t), zb - b * math.cos(t)) for t in np.linspace(0, math.pi / 2, n_arc, endpoint=False)]
    pts += [(ri + b, z) for z in np.linspace(zb, ze, n_line, endpoint=False)]
    a_e = math.atan2(ri, ze - zc)                        # cap normal angle at the edge (from +z)
    pts += [(ri + b * math.sin(t), ze + b * math.cos(t)) for t in np.linspace(math.pi / 2, a_e, n_arc, endpoint=False)]
    pts += [((Rd + b) * math.sin(t), zc + (Rd + b) * math.cos(t)) for t in np.linspace(a_e, 0, n_arc * 2)]
    return np.array(pts)


def _button_mesh(name, n_seg=160):
    """Analytic surface of revolution around the Z axis (symmetric, no remesh)."""
    import bmesh
    prof = _button_profile()
    bm = bmesh.new()
    bot = bm.verts.new((0, 0, prof[0, 1]))
    top = bm.verts.new((0, 0, prof[-1, 1]))
    rings = []
    for r, z in prof[1:-1]:
        rings.append([bm.verts.new((r * math.cos(a), r * math.sin(a), z))
                      for a in np.linspace(0, 2 * math.pi, n_seg, endpoint=False)])
    for j in range(n_seg):
        jn = (j + 1) % n_seg
        bm.faces.new((bot, rings[0][jn], rings[0][j]))
        bm.faces.new((top, rings[-1][j], rings[-1][jn]))
        for i in range(len(rings) - 1):
            A, B = rings[i], rings[i + 1]
            bm.faces.new((A[j], A[jn], B[jn], B[j]))
    obj = k._link(name, bm)
    obj.data.shade_smooth()
    return obj


def _body_colors(o):
    P = k.get_co(o.data)
    x, y, z = P[:, 0], P[:, 1], P[:, 2]
    nz = k.normals(o.data)[:, 2]
    r = np.hypot(x, z)
    g = FACE_GRAD[1] + (FACE_GRAD[0] - FACE_GRAD[1]) * np.clip((z + R) / (2 * R), 0, 1)
    c = k.graded(CREAM_HEX, *CREAM_GRAD, nz) * g[:, None]
    front = k.ss(-0.125, -0.13, y)
    dial = k.ss(DIAL_R + 0.002, DIAL_R - 0.006, r) * front
    tick = np.zeros(len(P))
    for a in (0, 90, 180, 270):
        cx, cz = TICK_R * math.sin(math.radians(a)), TICK_R * math.cos(math.radians(a))
        tick = np.maximum(tick, k.ss(TICK_D / 2 + 0.004, TICK_D / 2 - 0.002, np.hypot(x - cx, z - cz)))
    tick = tick * k.ss(FLOOR - 0.001, FLOOR - 0.004, y)
    dial = dial * (1 - tick)
    c = c * (1 - dial - tick)[:, None] + k.lin(DIAL_HEX) * (g * (1 - 0.07 * k.ss(0.2, 0.8, nz)))[:, None] * dial[:, None] + k.lin(TICK_HEX) * tick[:, None]
    m = np.zeros((len(P), 3))
    m[:, 0] = dial > 0.5
    m[:, 1] = tick > 0.5
    k.set_colors(o, c, m)


def _coral_colors(o):
    nz = k.normals(o.data)[:, 2]
    k.set_colors(o, k.graded(CORAL_HEX, *CORAL_GRAD, nz), (0, 0, 1))


def main():
    argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    out_dir = argv[0] if argv else os.path.join(os.path.dirname(HERE), "out", "reaction")
    os.makedirs(out_dir, exist_ok=True)
    ct.reset_scene()
    body = k.build("Body", body_sdf, (-0.62, -0.2, -0.62), (0.62, 0.2, 0.62), VOXEL, 0.02)
    _body_colors(body)
    hand = k.build("Hand", hand_sdf, (-0.08, FLOOR - 0.13, -0.08), (0.2, FLOOR + 0.03, 0.3), VOXEL_SMALL, 0.01)
    btn = _button_mesh("Button")
    for o in (hand, btn):
        _coral_colors(o)
    coral = k.join("Coral", [hand, btn])
    objs = [body, coral]
    k.tilt(objs, VIEW_ELEVATION_DEG)
    mat = k.zone_material("ClayReaction", SHEEN)
    for o in objs:
        o.data.materials.clear()
        o.data.materials.append(mat)
    ct.setup_scene(objs)
    k.light_overrides(rim=RIM)
    k.finish(objs, out_dir, "reaction")


main()
