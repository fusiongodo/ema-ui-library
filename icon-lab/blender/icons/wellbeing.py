"""Icon #9 wellbeing: three stacked clay pebbles (a balanced cairn).

Geometry only; the look comes from clay_theme (theme untouched, icon-level light
overrides only). Run: Blender -b --factory-startup --python icons/wellbeing.py -- <out_dir>

Each pebble is a star-shaped implicit surface: a superellipsoid (exponent PEB_EXP)
whose radius is scaled by a smooth, very low-frequency factor g(direction)
(~2 % irregularity). The mesh is a quad sphere (no poles) mapped radially onto
that surface, so it is exact and convex without remesh or projection.
Stacking: each pebble is lowered onto the one below until it just touches
(bisection on the lower pebble's implicit function).
Units: bottom pebble width = 1.0. X right, Z up, Y depth (camera at -Y).
"""
import math
import os
import sys

import bmesh
import bpy
import numpy as np
from mathutils import Matrix

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))
import clay_theme as ct  # noqa: E402

PEB_EXP = 2.0
IRREG = 0.02
CUTS = int(os.environ.get("CLAY_CUTS", "88"))     # quad-sphere subdivisions per cube edge
CONTACT = 0.06            # implicit overlap at the contact (hidden, avoids a visible gap)
VIEW_ELEVATION_DEG = 10.0

# name, width, height, depth, x shift, tilt deg (right side lower), left fullness, phase
PEBBLES = [
    ("Bottom", 1.00, 0.38, 0.75, 0.00, 0.0, 0.03, 0.3),
    ("Middle", 0.86, 0.34, 0.66, -0.03, 0.0, 0.0, 1.7),
    ("Top", 0.74, 0.40, 0.55, -0.04, 6.0, 0.0, 3.1),
]

REF = ct.REFERENCE["wellbeing"]
CREAM_BOTTOM_HEX = os.environ.get("CLAY_BOTTOM_HEX", "#E5E3DD")
CREAM_MIDDLE_HEX = os.environ.get("CLAY_MIDDLE_HEX", "#E9E8E4")
TAN_HEX = os.environ.get("CLAY_TAN_HEX", "#C4A47A")
TAN_LIGHT_HEX = os.environ.get("CLAY_TAN_LIGHT", "#E2CBB2")
TAN_DARK_HEX = os.environ.get("CLAY_TAN_DARK", "#84601C")
TAN_GRAD = float(os.environ.get("CLAY_TAN_GRAD", "1.0"))
TAN_DIR = (-0.85, -0.2, 0.45)      # world normal that gets the full light tint (upper left, front)
CREAM_SHADE_HEX = "#9E978B"
CREAM_SHADE = {"Bottom": float(os.environ.get("CLAY_WB_SHADE_BOTTOM", "0.45")), "Middle": 0.0}
BOUNCE_ENERGY = float(os.environ.get("CLAY_WB_BOUNCE", "0"))
BOUNCE_AZ_EL = (10.0, -65.0)   # from below: reaches only the undersides/creases
WB_FILL = os.environ.get("CLAY_WB_FILL")
WB_KEY = os.environ.get("CLAY_WB_KEY")
WB_WORLD = os.environ.get("CLAY_WB_WORLD")
WB_LOW = os.environ.get("CLAY_WB_LOW", "#BAAE9E")   # warm, lighter ground: beige shadows
WB_RIM = os.environ.get("CLAY_WB_RIM")
EDGE_LIFT = float(os.environ.get("CLAY_WB_EDGE_LIFT", "1.03"))   # cream would clip with x1.08
CREAM_SHEEN = float(os.environ.get("CLAY_WB_SHEEN", "0.30"))


def _g(D, left_full, phase):
    """Smooth radius factor on unit directions D: low-frequency irregularity."""
    dx, dy, dz = D[:, 0], D[:, 1], D[:, 2]
    w = (0.5 * np.sin(2.1 * dx + 1.3 * dz + phase)
         + 0.3 * np.cos(1.7 * dy - 1.1 * dx + 2 * phase)
         + 0.2 * np.sin(1.4 * dz + 0.9 * dy - phase))
    return (1.0 + IRREG * w) * (1.0 - left_full * dx)


def _f1(P, a, b, c):
    """Homogeneous (degree 1) superellipsoid gauge: 1 on the surface."""
    p = PEB_EXP
    return (np.abs(P[:, 0] / a) ** p + np.abs(P[:, 1] / b) ** p + np.abs(P[:, 2] / c) ** p) ** (1 / p)


def implicit(P, peb):
    _, w, h, d, _, _, lf, ph = peb
    r = np.linalg.norm(P, axis=1)
    D = P / np.maximum(r, 1e-9)[:, None]
    return _f1(P, w / 2, d / 2, h / 2) / _g(D, lf, ph) - 1.0


def pebble_verts(peb, bm):
    _, w, h, d, _, _, lf, ph = peb
    D = np.array([v.co for v in bm.verts])
    D /= np.linalg.norm(D, axis=1)[:, None]
    s = _g(D, lf, ph) / _f1(D, w / 2, d / 2, h / 2)
    return D * s[:, None]


def make_pebble(peb):
    name = peb[0]
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=2.0)
    bmesh.ops.subdivide_edges(bm, edges=bm.edges[:], cuts=CUTS, use_grid_fill=True)
    P = pebble_verts(peb, bm)
    for v, co in zip(bm.verts, P):
        v.co = co
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    me.shade_smooth()
    obj = bpy.data.objects.new(name, me)
    bpy.context.scene.collection.objects.link(obj)
    return obj, P


def stack():
    """Local vertex arrays -> world placement (translation + tilt), resting contact."""
    placed = []  # (peb, R (3x3), t (3,))
    objs = []
    for i, peb in enumerate(PEBBLES):
        obj, P = make_pebble(peb)
        R = np.array(Matrix.Rotation(math.radians(peb[5]), 3, "Y"))
        x = peb[4]
        if i == 0:
            t = np.array([x, 0.0, peb[2] / 2])
        else:
            lower, Rl, tl = placed[-1]
            Q = P @ R.T

            def pen(z):
                W = Q + [x, 0.0, z]
                return implicit((W - tl) @ Rl, lower).min()  # inverse of the lower's placement
            lo, hi = tl[2], tl[2] + 1.0       # lo: overlapping, hi: clear
            for _ in range(50):
                mid = (lo + hi) / 2
                if pen(mid) < -CONTACT:
                    lo = mid
                else:
                    hi = mid
            t = np.array([x, 0.0, hi])
        placed.append((peb, R, t))
        M = Matrix.Translation(tuple(t)) @ Matrix(R.tolist()).to_4x4()
        obj.matrix_world = M
        objs.append(obj)
    return objs


def _cream(name, hex_color):
    mat = ct.clay(name, hex_color)
    nt = mat.node_tree
    nt.nodes["EdgeMix"].inputs["B"].default_value = ct.srgb_hex_to_linear(ct._lighter_hex(hex_color, EDGE_LIFT))
    nt.nodes["Principled BSDF"].inputs["Sheen Weight"].default_value = CREAM_SHEEN
    return mat


def _tan(hex_color):
    """Tan clay with an icon-level warm gradient: base colour mixed toward a lighter
    sand on normals facing upper-left and toward deep brown on normals facing
    lower-right (the reference's strong warm top-left -> brown lower-right)."""
    return _gradient(ct.clay("ClayTan", hex_color),
                     ((0.3, 1.0, TAN_LIGHT_HEX, TAN_GRAD), (-0.1, -0.65, TAN_DARK_HEX, TAN_GRAD)))


def _gradient(mat, stops):
    """Mix the base colour toward stop colours by the normal's dot with TAN_DIR."""
    nt = mat.node_tree
    bsdf = nt.nodes["Principled BSDF"]
    src = bsdf.inputs["Base Color"].links[0].from_socket      # theme edge-glow mix
    geo = nt.nodes.new("ShaderNodeNewGeometry")
    dot = nt.nodes.new("ShaderNodeVectorMath")
    dot.operation = "DOT_PRODUCT"
    v = np.array(TAN_DIR)
    dot.inputs[1].default_value = tuple(v / np.linalg.norm(v))
    nt.links.new(geo.outputs["Normal"], dot.inputs[0])
    prev = src
    for lo, hi, hexc, grad in stops:
        rng = nt.nodes.new("ShaderNodeMapRange")
        rng.interpolation_type = "SMOOTHSTEP"
        rng.inputs["From Min"].default_value = lo
        rng.inputs["From Max"].default_value = hi
        nt.links.new(dot.outputs["Value"], rng.inputs["Value"])
        mix = nt.nodes.new("ShaderNodeMix")
        mix.data_type = "RGBA"
        mix.inputs["B"].default_value = ct.srgb_hex_to_linear(hexc)
        fac = nt.nodes.new("ShaderNodeMath")
        fac.operation = "MULTIPLY"
        fac.inputs[1].default_value = grad
        nt.links.new(rng.outputs["Result"], fac.inputs[0])
        nt.links.new(fac.outputs["Value"], mix.inputs["Factor"])
        nt.links.new(prev, mix.inputs["A"])
        prev = mix.outputs["Result"]
    nt.links.new(prev, bsdf.inputs["Base Color"])
    return mat


def _mask(objs):
    cols = {"Bottom": (1, 0, 0, 1), "Middle": (0, 1, 0, 1), "Top": (0, 0, 1, 1)}
    for o in objs:
        mat = bpy.data.materials.new("Mask" + o.name)
        mat.use_nodes = True
        nt = mat.node_tree
        nt.nodes.clear()
        out = nt.nodes.new("ShaderNodeOutputMaterial")
        em = nt.nodes.new("ShaderNodeEmission")
        em.inputs["Color"].default_value = cols[o.name]
        nt.links.new(em.outputs["Emission"], out.inputs["Surface"])
        o.data.materials.clear()
        o.data.materials.append(mat)


def main():
    argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    out_dir = argv[0] if argv else os.path.join(os.path.dirname(HERE), "out", "wellbeing")
    os.makedirs(out_dir, exist_ok=True)
    ct.reset_scene()

    objs = stack()
    # pose: whole stack tipped back so the view onto it is VIEW_ELEVATION_DEG
    tilt = Matrix.Rotation(math.radians(VIEW_ELEVATION_DEG - ct.CAM_ELEVATION_DEG), 4, "X")
    for o in objs:
        o.matrix_world = tilt @ o.matrix_world
    bpy.context.view_layer.update()

    hexes = {"Bottom": CREAM_BOTTOM_HEX, "Middle": CREAM_MIDDLE_HEX}
    for o in objs:
        o.data.materials.clear()
        if o.name in hexes:
            mat = _cream("Clay" + o.name, hexes[o.name])
            if CREAM_SHADE.get(o.name):   # icon-level: deeper beige lower right (reference)
                _gradient(mat, ((-0.1, -0.65, CREAM_SHADE_HEX, CREAM_SHADE[o.name]),))
        else:
            mat = _tan(TAN_HEX)
        o.data.materials.append(mat)

    ct.setup_scene(objs)
    # icon-level light overrides (theme untouched)
    wnt = bpy.context.scene.world.node_tree
    # icon-level: soft warm bounce from front-below lifts the contact creases and undersides
    if BOUNCE_ENERGY > 0:
        from mathutils import Vector
        P = ct._world_verts(objs)
        tgt = Vector(((P[:, 0].min() + P[:, 0].max()) / 2, 0.0, (P[:, 2].min() + P[:, 2].max()) / 2))
        bd = bpy.data.lights.new("Bounce", "AREA")
        bd.size = 4.0
        bd.energy = BOUNCE_ENERGY
        bd.use_temperature = True
        bd.temperature = 4800
        bo = bpy.data.objects.new("Bounce", bd)
        bpy.context.scene.collection.objects.link(bo)
        bo.location = tgt + ct._dir_from_angles(*BOUNCE_AZ_EL) * 4.0
        ct._point_at(bo, tgt)
    if WB_FILL is not None and bpy.data.objects.get("Fill"):
        bpy.data.objects["Fill"].data.energy = float(WB_FILL)
    if WB_KEY is not None:
        bpy.data.objects["Key"].data.energy = float(WB_KEY)
    if WB_RIM is not None:
        bpy.data.objects["Rim"].data.energy = float(WB_RIM)
    if WB_WORLD is not None:
        wnt.nodes["Background"].inputs["Strength"].default_value = float(WB_WORLD)
    if WB_LOW is not None:
        ramp = next(n for n in wnt.nodes if n.type == "VALTORGB")
        ramp.color_ramp.elements[0].color = ct.srgb_hex_to_linear(WB_LOW)
    ct.print_poly_counts(objs)
    print("POLYS total", sum(len(o.data.polygons) for o in objs))

    if os.environ.get("CLAY_PART_MASK"):
        _mask(objs)
        bpy.context.scene.cycles.samples = 1
        bpy.context.scene.cycles.use_denoising = False
        ct.render(os.path.join(out_dir, "part-mask.png"))
        return
    t = ct.render(os.path.join(out_dir, "wellbeing.png"))
    if not os.environ.get("CLAY_NO_BLEND"):
        ct.save_blend(os.path.join(out_dir, "wellbeing.blend"))
    print("TIMES", {"wellbeing": round(t, 1)})


main()
