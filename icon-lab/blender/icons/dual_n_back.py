"""Icon #17 dual-n-back: a cream clay plate with a 3 x 3 grid of soft pillow pads;
two pads are lit (top right lilac, middle left coral) and rise higher.

Geometry only; look from clay_theme (theme untouched, icon-level light tweaks as
calendar / scores). Run: Blender -b --factory-startup --python icons/dual_n_back.py -- <out_dir>

Construction as calendar: SDF -> rough start mesh -> voxel remesh -> Newton
projection, per part. Plate: rounded slab. Pads: separate rounded extrusions with
a slight dome, embedded 0.03 into the plate (clean contact crease, colour per pad;
a smooth union gave a fringed colour border at the fillet). Colours per vertex.
Units: plate width = 1.0. X right, Z up, front at -Y.
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
W, H, T = 1.0, 1.0, 0.12
CORNER = 0.18
EDGE = 0.05
FRONT = -T / 2
PAD, PAD_R = 0.25, 0.07      # pad size, front-view corner radius
PITCH = 0.30
RISE, RISE_LIT = 0.045, 0.07
PAD_EMBED = 0.03             # pad body reaches this far into the plate (separate object: contact crease)
PAD_EDGE = (0.040, 0.055)    # pad edge rounding (unlit, lit): round shoulders
PAD_DOME = (0.008, 0.010)    # extra dome at the pad centre (unlit, lit)
LILAC_RC, CORAL_RC = (0, 2), (1, 0)   # (row, column), 0-based, row 0 = top

VIEW_ELEVATION_DEG = 8.0

CREAM_HEX = os.environ.get("CLAY_DN_CREAM", "#EEEAE2")
PAD_HEX = os.environ.get("CLAY_DN_PAD", "#E4DED4")
LILAC_HEX = os.environ.get("CLAY_DN_LILAC", "#B3A3C8")
CORAL_HEX = os.environ.get("CLAY_DN_CORAL", "#F28C77")
# normal-direction stops per pad colour: (light hex, weight up), (dark hex, weight down)
GRADS = {
    "pad": (("#FAF6F0", 0.75), ("#A89E90", 0.55)),
    "lilac": (("#E2D3EE", 0.55), ("#6656A4", 0.60)),
    "coral": (("#F8AC98", 0.50), ("#FCA48A", 0.0)),
}
FACE_GRAD = (1.05, 0.97)     # cream x this at the top / bottom of the face
BODY_RIM, SIDE_RIM, TOP_RIM = 0.70, 0.88, 0.92
RIM_WARM = (0.0, 0.10, 0.35)
DN_FILL = os.environ.get("CLAY_DN_FILL", "30")
DN_KEY = os.environ.get("CLAY_DN_KEY")
DN_WORLD = os.environ.get("CLAY_DN_WORLD")
DN_RIM = float(os.environ.get("CLAY_DN_RIM", "4"))
DN_LOW = os.environ.get("CLAY_DN_LOW", "#9A8E84")
SHEEN = float(os.environ.get("CLAY_DN_SHEEN", "0.15"))
SSS_SCALE = float(os.environ.get("CLAY_DN_SSS", "0.008"))
VOXEL = float(os.environ.get("CLAY_VOXEL", "0.0042"))
VOXEL_PAD = float(os.environ.get("CLAY_VOXEL_PAD", "0.003"))


def _ss(e0, e1, x):
    t = np.clip((x - e0) / (e1 - e0), 0.0, 1.0)
    return t * t * (3 - 2 * t)


def _rrect(px, pz, hx, hz, r):
    qx, qz = np.abs(px) - hx + r, np.abs(pz) - hz + r
    return np.hypot(np.maximum(qx, 0), np.maximum(qz, 0)) + np.minimum(np.maximum(qx, qz), 0) - r


def _extrude(s, y, yc, half, r):
    wx = s + r
    wy = np.abs(y - yc) - half + r
    return (np.minimum(np.maximum(wx, wy), 0)
            + np.hypot(np.maximum(wx, 0), np.maximum(wy, 0)) - r)


def _smin(a, b, k):
    h = np.clip(0.5 + 0.5 * (b - a) / k, 0.0, 1.0)
    return b * (1 - h) + a * h - k * h * (1 - h)


def _pads():
    for r in range(3):
        for c in range(3):
            lit = (r, c) in (LILAC_RC, CORAL_RC)
            yield r, c, (c - 1) * PITCH, (1 - r) * PITCH, lit


def _pads_sdf2(x, z):
    """2D SDF of the pads, and the nearest pad's index (r * 3 + c)."""
    best = np.full(x.shape, 1e9)
    idx = np.full(x.shape, -1)
    for r, c, cx, cz, _ in _pads():
        s = _rrect(x - cx, z - cz, PAD / 2, PAD / 2, PAD_R)
        m = s < best
        best = np.where(m, s, best)
        idx = np.where(m, r * 3 + c, idx)
    return best, idx


def plate_sdf(P):
    x, y, z = P[:, 0], P[:, 1], P[:, 2]
    return _extrude(_rrect(x, z, W / 2, H / 2, CORNER), y, 0.0, T / 2, EDGE)


def pad_sdf(P, cx, cz, lit):
    x, y, z = P[:, 0], P[:, 1], P[:, 2]
    rise, edge, dome = (RISE_LIT, PAD_EDGE[1], PAD_DOME[1]) if lit else (RISE, PAD_EDGE[0], PAD_DOME[0])
    s = _rrect(x - cx, z - cz, PAD / 2, PAD / 2, PAD_R)
    y0, y1 = FRONT + PAD_EMBED, FRONT - rise + dome      # dome added below
    p = _extrude(s, y, (y0 + y1) / 2, (y0 - y1) / 2, edge)
    # dome: the front face bulges by `dome` toward the centre (smooth, monotonic)
    # dome weight from a smooth L4 norm (a max-norm / rrect interior gave X-shaped creases)
    e = (((x - cx) / (PAD / 2)) ** 4 + ((z - cz) / (PAD / 2)) ** 4) ** 0.25
    return p - dome * _ss(0.95, 0.15, e) * _ss(FRONT - rise * 0.3, FRONT - rise, y)


# ------------------------------------------------------------ mesh build (as calendar)
def project(P, f_sdf, iters=16):
    e = 1e-4
    for _ in range(iters):
        f = f_sdf(P)
        g = np.stack([
            (f_sdf(P + [e, 0, 0]) - f_sdf(P - [e, 0, 0])),
            (f_sdf(P + [0, e, 0]) - f_sdf(P - [0, e, 0])),
            (f_sdf(P + [0, 0, e]) - f_sdf(P - [0, 0, e])),
        ], axis=1) / (2 * e)
        g2 = np.maximum(np.einsum("ij,ij->i", g, g), 1e-12)
        step = (f / g2)[:, None] * g
        n = np.linalg.norm(step, axis=1, keepdims=True)
        step = np.where(n > 0.03, step * 0.03 / np.maximum(n, 1e-12), step)
        P = P - step
    return P


def _get_co(me):
    co = np.empty(len(me.vertices) * 3)
    me.vertices.foreach_get("co", co)
    return co.reshape(-1, 3)


def _set_co(me, P):
    me.vertices.foreach_set("co", P.astype(np.float32).ravel())
    me.update()


def _normals(me):
    n = np.empty(len(me.vertices) * 3)
    me.vertex_normals.foreach_get("vector", n)
    return n.reshape(-1, 3)


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


def _cube_mesh(name, lo, hi):
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0)
    bmesh.ops.subdivide_edges(bm, edges=bm.edges[:], cuts=24, use_grid_fill=True)
    lo, hi = np.array(lo), np.array(hi)
    for v in bm.verts:
        v.co = Vector((np.array(v.co) + 0.5) * (hi - lo) + lo)
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    obj = bpy.data.objects.new(name, me)
    bpy.context.scene.collection.objects.link(obj)
    return obj


def build(name, f_sdf, lo, hi, voxel, coarse):
    obj = _cube_mesh(name, lo, hi)
    _set_co(obj.data, project(_get_co(obj.data), f_sdf, iters=40))
    _remesh(obj, coarse)
    _set_co(obj.data, project(_get_co(obj.data), f_sdf))
    _remesh(obj, voxel)
    _set_co(obj.data, project(_get_co(obj.data), f_sdf))
    obj.data.shade_smooth()
    return obj


# ------------------------------------------------------------ colour
def _lin(h):
    return np.array(ct.srgb_hex_to_linear(h)[:3])


def _graded(base_hex, key, nz):
    (lh, lw), (dh, dw) = GRADS[key]
    wl = (lw * _ss(0.0, 0.9, nz))[:, None]
    wd = (dw * _ss(-0.1, -0.9, nz))[:, None]
    return _lin(base_hex) * (1 - wl - wd) + _lin(lh) * wl + _lin(dh) * wd


def _set_attr(me, name, col):
    a = me.color_attributes.new(name, "FLOAT_COLOR", "POINT")
    a.data.foreach_set("color", col.astype(np.float32).ravel())


def _plate_colors(obj):
    me = obj.data
    P = _get_co(me)
    x, z = P[:, 0], P[:, 2]
    tz = np.clip((z + H / 2) / H, 0, 1)
    g = FACE_GRAD[1] + (FACE_GRAD[0] - FACE_GRAD[1]) * tz
    rim = ((1 - (1 - SIDE_RIM) * _ss(W / 2 - 0.06, W / 2, x))
           * (1 - (1 - BODY_RIM) * _ss(-H / 2 + 0.12, -H / 2, z)))
    g = g * rim * (1 - (1 - TOP_RIM) * _ss(H / 2 - 0.05, H / 2, z))
    warm = 1 - (1 - rim)[:, None] * np.array(RIM_WARM)
    col = np.ones((len(P), 4))
    col[:, :3] = np.clip(_lin(CREAM_HEX)[None, :] * g[:, None] * warm, 0, 1)
    _set_attr(me, "zone", col)
    m = np.zeros((len(P), 4))
    m[:, 3] = 1
    _set_attr(me, "part", m)


def _pad_colors(obj, key):
    me = obj.data
    nz = _normals(me)[:, 2]
    base = {"pad": PAD_HEX, "lilac": LILAC_HEX, "coral": CORAL_HEX}[key]
    col = np.ones((len(nz), 4))
    col[:, :3] = np.clip(_graded(base, key, nz), 0, 1)
    _set_attr(me, "zone", col)
    m = np.zeros((len(nz), 4))
    m[:, 3] = 1
    m[:, {"pad": 0, "lilac": 1, "coral": 2}[key]] = 1
    _set_attr(me, "part", m)


def _zone_material():
    mat = ct.clay("ClayDualNBack", CREAM_HEX, sss_scale=SSS_SCALE)
    nt = mat.node_tree
    attr = nt.nodes.new("ShaderNodeAttribute")
    attr.attribute_name = "zone"
    mix = nt.nodes["EdgeMix"]
    nt.links.new(attr.outputs["Color"], mix.inputs["A"])
    nt.links.new(attr.outputs["Color"], mix.inputs["B"])   # no grazing lift: cream would clip
    nt.nodes["Principled BSDF"].inputs["Sheen Weight"].default_value = SHEEN
    return mat


def _part_mask(objs):
    mat = bpy.data.materials.new("MaskPart")
    mat.use_nodes = True
    nt = mat.node_tree
    nt.nodes.clear()
    out = nt.nodes.new("ShaderNodeOutputMaterial")
    em = nt.nodes.new("ShaderNodeEmission")
    attr = nt.nodes.new("ShaderNodeAttribute")
    attr.attribute_name = "part"
    nt.links.new(attr.outputs["Color"], em.inputs["Color"])
    nt.links.new(em.outputs["Emission"], out.inputs["Surface"])
    for o in objs:
        o.data.materials.clear()
        o.data.materials.append(mat)


def main():
    argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    out_dir = argv[0] if argv else os.path.join(os.path.dirname(HERE), "out", "dual-n-back")
    os.makedirs(out_dir, exist_ok=True)
    ct.reset_scene()

    m = 0.03
    plate = build("Plate", plate_sdf, (-W / 2 - m, -T / 2 - m, -H / 2 - m), (W / 2 + m, T / 2 + m, H / 2 + m),
                  VOXEL, 0.02)
    _plate_colors(plate)
    bm = bmesh.new()
    parts = []
    for r, c, cx, cz, lit in _pads():
        key = "lilac" if (r, c) == LILAC_RC else "coral" if (r, c) == CORAL_RC else "pad"
        h = PAD / 2 + 0.02
        p = build("Pad%d%d" % (r, c), lambda Q, cx=cx, cz=cz, lit=lit: pad_sdf(Q, cx, cz, lit),
                  (cx - h, FRONT - RISE_LIT - 0.02, cz - h), (cx + h, FRONT + PAD_EMBED + 0.01, cz + h),
                  VOXEL_PAD, 0.012)
        _pad_colors(p, key)
        parts.append(p)
    for p in parts:
        bm.from_mesh(p.data)
    me = bpy.data.meshes.new("Pads")
    bm.to_mesh(me)
    bm.free()
    me.shade_smooth()
    for p in parts:
        old = p.data
        bpy.data.objects.remove(p)
        bpy.data.meshes.remove(old)
    pads = bpy.data.objects.new("Pads", me)
    bpy.context.scene.collection.objects.link(pads)
    objs = [plate, pads]
    M = Matrix.Rotation(math.radians(VIEW_ELEVATION_DEG - ct.CAM_ELEVATION_DEG), 4, "X")
    for o in objs:
        o.matrix_world = M
    bpy.context.view_layer.update()
    mat = _zone_material()
    for o in objs:
        o.data.materials.clear()
        o.data.materials.append(mat)
    ct.setup_scene(objs)
    # icon-level light tweaks (theme untouched), as calendar / scores
    if DN_FILL is not None and bpy.data.objects.get("Fill"):
        bpy.data.objects["Fill"].data.energy = float(DN_FILL)
    if DN_KEY is not None:
        bpy.data.objects["Key"].data.energy = float(DN_KEY)
    bpy.data.objects["Rim"].data.energy = DN_RIM
    wnt = bpy.context.scene.world.node_tree
    if DN_WORLD is not None:
        wnt.nodes["Background"].inputs["Strength"].default_value = float(DN_WORLD)
    if DN_LOW:
        ramp = next(n for n in wnt.nodes if n.type == "VALTORGB")
        ramp.color_ramp.elements[0].color = ct.srgb_hex_to_linear(DN_LOW)
    ct.print_poly_counts(objs)

    if os.environ.get("CLAY_PART_MASK"):
        _part_mask(objs)
        bpy.context.scene.cycles.samples = 1
        bpy.context.scene.cycles.use_denoising = False
        ct.render(os.path.join(out_dir, "part-mask.png"))
        return
    t = ct.render(os.path.join(out_dir, "dual-n-back.png"))
    if not os.environ.get("CLAY_NO_BLEND"):
        ct.save_blend(os.path.join(out_dir, "dual-n-back.blend"))
    print("TIMES", {"dual-n-back": round(t, 1)})


main()
