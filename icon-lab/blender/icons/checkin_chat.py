"""Icon #7 checkin-chat: two puffy speech bubbles (cream front, pastel back).

Geometry only; the look comes from clay_theme.
Run: Blender -b --factory-startup --python icons/checkin_chat.py -- <out_dir>

Construction: an implicit surface (superellipsoid body smooth-unioned with a
round-cone tail). A rough union of primitives is voxel-remeshed and every vertex
is then projected exactly onto the implicit surface (Newton steps), remeshed and
projected again. That gives an even mesh with a seamless filleted tail.
"""
import math
import os
import sys

import bmesh
import bpy
import numpy as np
from mathutils import Matrix, Vector

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))
import clay_theme as ct  # noqa: E402

# ------------------------------------------------------------ shape params
W, H, D = 1.0, 0.86, 0.55          # body width, height, depth
N_SIL = 2.15                        # superellipse exponent of the silhouette
M_PROF = 1.8                        # exponent of the side profile (pillow dome)
TAIL_LEN = 0.12                     # from body edge to tail tip
TAIL_BASE_R = 0.12                  # base width 0.24
TAIL_TIP_R = 0.045
TAIL_FROM_LEFT = 0.22               # 22 % in from the outer edge
TAIL_ANGLE_DEG = 35.0               # down and slightly left (round 3)
TAIL_BURY = 0.06                    # wide end of the tail cone sits this deep in the body
TAIL_DEPTH_SCALE = 1.0              # tail cross-section depth / width
FILLET_K = 0.06                     # smooth-union radius

# Colours: clay_theme.REFERENCE["checkin-chat"] (Alex, final) gives the target
# render colours; these material base colours are tuned so the render hits them.
REF = ct.REFERENCE["checkin-chat"]
FRONT_HEX = os.environ.get("CLAY_FRONT_HEX", "#F0EAE1")
BACK_HEX = os.environ.get("CLAY_BACK_HEX", "#C8C0D2")

# Mesh resolution (memory): coarse voxel remesh, then subdivision does the smoothing.
# Old round-3 values: VOXEL 0.0065, subsurf 1/1 (~240k render polys per bubble).
VOXEL = float(os.environ.get("CLAY_VOXEL", "0.016"))
SUBSURF_VIEW = int(os.environ.get("CLAY_SUB_VIEW", "1"))
SUBSURF_RENDER = int(os.environ.get("CLAY_SUB_RENDER", "2"))


def _superellipsoid_dist(P):
    a, b, c = W / 2, D / 2, H / 2
    x, y, z = np.abs(P[:, 0]) / a, np.abs(P[:, 1]) / b, np.abs(P[:, 2]) / c
    r = (x ** N_SIL + z ** N_SIL) ** (1.0 / N_SIL)
    F = (r ** M_PROF + y ** M_PROF) ** (1.0 / M_PROF)  # 1-homogeneous
    L = np.linalg.norm(P, axis=1)
    return (F - 1.0) * L / np.maximum(F, 1e-9)  # radial distance to surface


def _tail_frame():
    a, c = W / 2, H / 2
    ex = -a + TAIL_FROM_LEFT * W
    ez = -c * (1.0 - abs(ex / a) ** N_SIL) ** (1.0 / N_SIL)
    E = np.array([ex, 0.0, ez])
    t = math.radians(TAIL_ANGLE_DEG)
    d = np.array([-math.sin(t), 0.0, -math.cos(t)])   # pointing direction
    n = np.array([math.cos(t), 0.0, -math.sin(t)])    # across the tail
    return E, d, n


def _tail_points():
    """Seed segment for the rough start mesh (base inside body, tip outside)."""
    E, d, _ = _tail_frame()
    return E - d * TAIL_BURY, E + d * (TAIL_LEN - TAIL_TIP_R)


def _round_cone(P, a, b, r1, r2):
    """Signed distance to a round cone (iq): spheres r1 at a and r2 at b, hulled."""
    ba = b - a
    l2 = ba @ ba
    rr = r1 - r2
    a2 = l2 - rr * rr
    il2 = 1.0 / l2
    pa = P - a
    y = pa @ ba
    z = y - l2
    q = pa * l2 - np.outer(y, ba)
    x2 = np.einsum("ij,ij->i", q, q)
    y2 = y * y * l2
    z2 = z * z * l2
    k = np.sign(rr) * rr * rr * x2
    d3 = (np.sqrt(np.maximum(x2 * a2 * il2, 0)) + y * rr) * il2 - r1
    d1 = np.sqrt(x2 + z2) * il2 - r2
    d2 = np.sqrt(x2 + y2) * il2 - r1
    return np.where(np.sign(z) * a2 * z2 > k, d1, np.where(np.sign(y) * a2 * y2 < k, d2, d3))


def _tail_dist(P):
    """Short, stubby tail: a round cone whose wide end (radius TAIL_BASE_R) sits
    buried in the body so it does not bulge; it tapers to the tip radius
    TAIL_TIP_R, TAIL_LEN beyond the body edge. The fillet does the rest."""
    A, B = _tail_points()
    Q = P.copy()
    Q[:, 1] /= TAIL_DEPTH_SCALE
    return _round_cone(Q, A, B, TAIL_BASE_R, TAIL_TIP_R)


def sdf(P):
    d1 = _superellipsoid_dist(P)
    d2 = _tail_dist(P)
    h = np.maximum(FILLET_K - np.abs(d1 - d2), 0.0) / FILLET_K
    return np.minimum(d1, d2) - h * h * FILLET_K * 0.25


def project(P, iters=14):
    e = 1e-4
    for _ in range(iters):
        f = sdf(P)
        g = np.stack([
            (sdf(P + [e, 0, 0]) - sdf(P - [e, 0, 0])),
            (sdf(P + [0, e, 0]) - sdf(P - [0, e, 0])),
            (sdf(P + [0, 0, e]) - sdf(P - [0, 0, e])),
        ], axis=1) / (2 * e)
        g2 = np.maximum(np.einsum("ij,ij->i", g, g), 1e-12)
        step = (f / g2)[:, None] * g
        n = np.linalg.norm(step, axis=1, keepdims=True)
        step = np.where(n > 0.05, step * 0.05 / np.maximum(n, 1e-12), step)
        P = P - step
    return P


def _get_co(me):
    co = np.empty(len(me.vertices) * 3)
    me.vertices.foreach_get("co", co)
    return co.reshape(-1, 3)


def _set_co(me, P):
    me.vertices.foreach_set("co", P.astype(np.float32).ravel())
    me.update()


def _remesh(obj, voxel):
    mod = obj.modifiers.new("Remesh", "REMESH")
    mod.mode = "VOXEL"
    mod.voxel_size = voxel
    mod.adaptivity = 0.0
    dg = bpy.context.evaluated_depsgraph_get()
    new = bpy.data.meshes.new_from_object(obj.evaluated_get(dg))
    old = obj.data
    obj.modifiers.remove(mod)
    obj.data = new
    bpy.data.meshes.remove(old)


def build_bubble(name, mirror=False):
    bm = bmesh.new()
    bmesh.ops.create_uvsphere(bm, u_segments=64, v_segments=32, radius=1.0,
                              matrix=Matrix.Diagonal((W / 2 * 1.02, D / 2 * 1.02, H / 2 * 1.02, 1)))
    A, B = _tail_points()
    A, B = Vector(A), Vector(B)
    axis = (B - A)
    rot = axis.to_track_quat("Z", "Y").to_matrix().to_4x4()
    m = Matrix.Translation((A + B) / 2) @ rot
    bmesh.ops.create_cone(bm, cap_ends=True, segments=32, radius1=TAIL_BASE_R,
                          radius2=TAIL_TIP_R, depth=axis.length, matrix=m)
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    obj = bpy.data.objects.new(name, me)
    bpy.context.scene.collection.objects.link(obj)

    _remesh(obj, max(0.012, VOXEL))
    _set_co(obj.data, project(_get_co(obj.data)))
    _remesh(obj, VOXEL)
    _set_co(obj.data, project(_get_co(obj.data)))

    if mirror:  # mirror in data (keeps normals correct)
        P = _get_co(obj.data)
        P[:, 0] *= -1
        _set_co(obj.data, P)
        obj.data.flip_normals()
    obj.data.shade_smooth()
    sub = obj.modifiers.new("Subsurf", "SUBSURF")
    sub.levels = SUBSURF_VIEW
    sub.render_levels = SUBSURF_RENDER
    return obj


def main():
    argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    out_dir = argv[0] if argv else os.path.join(os.path.dirname(HERE), "out", "checkin-chat")
    os.makedirs(out_dir, exist_ok=True)
    ct.reset_scene()

    front = build_bubble("FrontBubble")
    front.location = (-0.12, 0.0, 0.05)
    front.rotation_euler = (0, math.radians(-5), 0)

    back = build_bubble("BackBubble", mirror=True)
    back.scale = (0.72, 0.72, 0.72)
    back.location = (0.43, 0.30, -0.09)  # right, lower, behind (+Y = behind); round 3
    back.rotation_euler = (0, math.radians(6), 0)
    bpy.context.view_layer.update()

    front.data.materials.append(ct.clay("ClayFront", FRONT_HEX))
    back_mat = ct.clay("ClayBack", BACK_HEX, sss_weight=0.06)
    back.data.materials.append(back_mat)

    ct.setup_scene([front, back])
    ct.print_poly_counts([front, back])
    if os.environ.get("CLAY_FRONT_MASK"):  # helper for colour measurement: front only
        back.hide_render = True
        ct.render(os.path.join(out_dir, "front-mask.png"))
        return

    t = ct.render(os.path.join(out_dir, "checkin-chat.png"))
    if not os.environ.get("CLAY_NO_BLEND"):
        ct.save_blend(os.path.join(out_dir, "checkin-chat.blend"))
    print("TIMES", {"checkin-chat": round(t, 1)})


main()
