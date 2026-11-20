"""Icon #15 calendar: a clay wall calendar (coral header, two grey rings,
5 x 4 soft inset day cells, today in coral).

Geometry only; look from clay_theme (theme untouched, icon-level light tweaks).
Run: Blender -b --factory-startup --python icons/calendar.py -- <out_dir>

Construction as log_scores: SDF -> rough start mesh -> voxel remesh -> Newton
projection (twice). The day-cell insets and the header step are smooth height
profiles inside the slab SDF (monotonic smoothstep, so no lips or saddles).
Colour zones (body, header, cells, today, ring holes) are a per-vertex colour
attribute with soft 2D masks, so zone borders follow the analytic shapes.
Units: calendar width = 1.0. Object space: X right, Z up, Y depth (front at -Y).
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
W, H, T = 1.0, 0.98, 0.10
CORNER = 0.07                # front-view corner radius
EDGE = 0.035                 # soft clay edges
TOP, BOT = H / 2, -H / 2
FRONT = -T / 2
STEP = 0.01                  # header layer: grows the slab by this above the boundary
HEAD_H = 0.22
HEAD_Z = TOP - HEAD_H        # header / body boundary
HEAD_SOFT = 0.006            # half width of the soft step

RING_D, RING_L = 0.09, 0.20
RING_X = (0.19 - 0.5, 0.81 - 0.5)
RING_OUT = 0.10              # above the top edge
RING_Y = FRONT - STEP - 0.002  # ring axis just in front of the header face: full width, enters the hole
HOLE_R = 0.062               # dark soft hole where the ring enters the header
HOLE_DEPTH = 0.012
HOLE_Z = TOP + RING_OUT - RING_L + 0.004

CELL, CELL_R = 0.12, 0.03
PITCH_X, PITCH_Z = 0.168, 0.153
CELL_X0, CELL_Z0 = 0.10, 0.31   # first cell left edge from left, first row top below top
COLS, ROWS = 5, 4
TODAY = (2, 1)               # row 3, column 2 (0-based)
INSET = 0.008
INSET_SOFT = 0.006           # half width of the soft cell wall

VIEW_ELEVATION_DEG = 8.0

REF = ct.REFERENCE["calendar"]
BODY_HEX = os.environ.get("CLAY_BODY_HEX", "#F6F3F1")
HEAD_HEX = os.environ.get("CLAY_HEAD_HEX", "#F39388")
CELL_HEX = os.environ.get("CLAY_CELL_HEX", "#CFCBC8")
TODAY_HEX = os.environ.get("CLAY_TODAY_HEX", "#F19080")
HOLE_HEX = os.environ.get("CLAY_HOLE_HEX", "#B86A62")
RING_HEX = os.environ.get("CLAY_RING_HEX", "#DCD2D0")
CAL_FILL = os.environ.get("CLAY_CAL_FILL", "30")
CAL_KEY = os.environ.get("CLAY_CAL_KEY")
CAL_WORLD = os.environ.get("CLAY_CAL_WORLD")
CAL_RIM = float(os.environ.get("CLAY_CAL_RIM", "4"))
CAL_LOW = os.environ.get("CLAY_CAL_LOW", "#9A8E84")   # warm low world
SHEEN = float(os.environ.get("CLAY_CAL_SHEEN", "0.15"))  # 0.25 clipped the header corner
HEAD_GRAD = (0.99, 0.89)     # header colour x this at its top / bottom (lit top, darker lower band)
BODY_RIM = 0.88              # body colour x this along the bottom rim

SSS_SCALE = float(os.environ.get("CLAY_CAL_SSS", "0.008"))
VOXEL = float(os.environ.get("CLAY_VOXEL", "0.0042"))
VOXEL_RING = float(os.environ.get("CLAY_VOXEL_RING", "0.003"))


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


def _cells_sdf2(x, z):
    """2D SDF of the union of all day cells; also the index of the nearest cell."""
    best = np.full(x.shape, 1e9)
    idx = np.full(x.shape, -1)
    for r in range(ROWS):
        for c in range(COLS):
            cx = -W / 2 + CELL_X0 + CELL / 2 + c * PITCH_X
            cz = TOP - CELL_Z0 - CELL / 2 - r * PITCH_Z
            s = _rrect(x - cx, z - cz, CELL / 2, CELL / 2, CELL_R)
            m = s < best
            best = np.where(m, s, best)
            idx = np.where(m, r * COLS + c, idx)
    return best, idx


def _holes_sdf2(x, z):
    return np.minimum(*(np.hypot(x - rx, z - HOLE_Z) - HOLE_R for rx in RING_X))


def slab_sdf(P):
    x, y, z = P[:, 0], P[:, 1], P[:, 2]
    # body slightly lower at the top so the grown header ends at TOP
    s = _rrect(x, z + STEP / 2, W / 2 - 0.007, H / 2 - STEP / 2, CORNER)
    d = _extrude(s, y, 0.0, T / 2, EDGE)
    d = d - STEP * _ss(HEAD_Z - HEAD_SOFT, HEAD_Z + HEAD_SOFT, z)   # header layer
    front = _ss(0.0, -0.02, y)                                      # profiles only on the front
    sc, _ = _cells_sdf2(x, z)
    d = d + INSET * _ss(INSET_SOFT, -INSET_SOFT, sc) * front
    sh = _holes_sdf2(x, z)
    d = d + HOLE_DEPTH * _ss(0.0, -HOLE_R, sh) ** 0.7 * front     # soft round dimple
    return d


def ring_sdf(P):
    x, y, z = P[:, 0], P[:, 1], P[:, 2]
    r = RING_D / 2
    z0, z1 = TOP + RING_OUT - RING_L + r, TOP + RING_OUT - r
    zc = np.clip(z, z0, z1)
    return np.minimum(*(np.sqrt((x - rx) ** 2 + (y - RING_Y) ** 2 + (z - zc) ** 2) - r for rx in RING_X))


def project(P, sdf, iters=16):
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


def build(name, sdf, lo, hi, voxel, coarse):
    obj = _cube_mesh(name, lo, hi)
    _set_co(obj.data, project(_get_co(obj.data), sdf, iters=40))
    _remesh(obj, coarse)
    _set_co(obj.data, project(_get_co(obj.data), sdf))
    _remesh(obj, voxel)
    _set_co(obj.data, project(_get_co(obj.data), sdf))
    obj.data.shade_smooth()
    return obj


def _zones(P):
    """Soft per-vertex zone weights: header, cells, today, hole (body = rest)."""
    x, y, z = P[:, 0], P[:, 1], P[:, 2]
    head = _ss(HEAD_Z - 0.003, HEAD_Z + 0.003, z)
    sc, idx = _cells_sdf2(x, z)
    front = _ss(-0.02, -0.035, y)            # cells only on the front face (inset floor at -0.042)
    cell = _ss(0.002, -0.002, sc) * front
    today = cell * (idx == TODAY[0] * COLS + TODAY[1])
    cell = cell - today
    hole = _ss(0.004, -0.022, _holes_sdf2(x, z)) * _ss(0.0, -0.03, y) * head
    return head, cell, today, hole


def _vertex_colors(obj):
    me = obj.data
    P = _get_co(me)
    head, cell, today, hole = _zones(P)
    L = {k: np.array(ct.srgb_hex_to_linear(h)[:3]) for k, h in
         (("body", BODY_HEX), ("head", HEAD_HEX), ("cell", CELL_HEX), ("today", TODAY_HEX), ("hole", HOLE_HEX))}
    x, z = P[:, 0], P[:, 2]
    tz = np.clip((z - HEAD_Z) / HEAD_H, 0, 1)
    hg = HEAD_GRAD[1] + (HEAD_GRAD[0] - HEAD_GRAD[1]) * tz          # icon-level header gradient
    bg = 1 - (1 - BODY_RIM) * _ss(BOT + 0.05, BOT, z)               # darker bottom rim
    c = (L["body"] * bg[:, None]) * (1 - head)[:, None] + (L["head"] * hg[:, None]) * head[:, None]
    c = c * (1 - cell - today)[:, None] + L["cell"] * cell[:, None] + L["today"] * today[:, None]
    c = c * (1 - hole)[:, None] + L["hole"] * hole[:, None]
    col = np.ones((len(P), 4), dtype=np.float32)
    col[:, :3] = c
    a = me.color_attributes.new("zone", "FLOAT_COLOR", "POINT")
    a.data.foreach_set("color", col.ravel())
    # measurement mask: R header, G cells, B today (hard, for colour measurement)
    m = np.zeros((len(P), 4), dtype=np.float32)
    m[:, 3] = 1
    m[:, 0] = head > 0.5
    m[:, 1] = cell > 0.5
    m[:, 2] = today > 0.5
    m[hole > 0.2, :3] = 0.5
    a = me.color_attributes.new("part", "FLOAT_COLOR", "POINT")
    a.data.foreach_set("color", m.ravel())


def _zone_material():
    # small SSS scale: the theme 0.05 bleeds white body into the 0.12 cells
    mat = ct.clay("ClayCalendar", BODY_HEX, sss_scale=SSS_SCALE)
    nt = mat.node_tree
    attr = nt.nodes.new("ShaderNodeAttribute")
    attr.attribute_name = "zone"
    mix = nt.nodes["EdgeMix"]
    nt.links.new(attr.outputs["Color"], mix.inputs["A"])
    nt.links.new(attr.outputs["Color"], mix.inputs["B"])   # no grazing lift: near-white would clip
    nt.nodes["Principled BSDF"].inputs["Sheen Weight"].default_value = SHEEN
    return mat


def _part_mask(objs):
    for o in objs:
        mat = bpy.data.materials.new("Mask" + o.name)
        mat.use_nodes = True
        nt = mat.node_tree
        nt.nodes.clear()
        out = nt.nodes.new("ShaderNodeOutputMaterial")
        em = nt.nodes.new("ShaderNodeEmission")
        if o.name == "Slab":
            attr = nt.nodes.new("ShaderNodeAttribute")
            attr.attribute_name = "part"
            nt.links.new(attr.outputs["Color"], em.inputs["Color"])
        else:
            em.inputs["Color"].default_value = (1, 1, 1, 1)
        nt.links.new(em.outputs["Emission"], out.inputs["Surface"])
        o.data.materials.clear()
        o.data.materials.append(mat)


def main():
    argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    out_dir = argv[0] if argv else os.path.join(os.path.dirname(HERE), "out", "calendar")
    os.makedirs(out_dir, exist_ok=True)
    ct.reset_scene()

    m = 0.03
    slab = build("Slab", slab_sdf, (-W / 2 - m, -T / 2 - m, BOT - m), (W / 2 + m, T / 2 + m, TOP + m),
                 VOXEL, 0.02)
    _vertex_colors(slab)
    r = RING_D / 2
    # one start mesh per ring (a shared start box would leave a membrane between them)
    parts = [build("Ring%d" % i, ring_sdf, (rx - r - m, RING_Y - r - m, TOP + RING_OUT - RING_L - m),
                   (rx + r + m, RING_Y + r + m, TOP + RING_OUT + m), VOXEL_RING, 0.01)
             for i, rx in enumerate(RING_X)]
    bm = bmesh.new()
    for p in parts:
        bm.from_mesh(p.data)
    me = bpy.data.meshes.new("Rings")
    bm.to_mesh(me)
    bm.free()
    me.shade_smooth()
    for p in parts:
        old = p.data
        bpy.data.objects.remove(p)
        bpy.data.meshes.remove(old)
    rings = bpy.data.objects.new("Rings", me)
    bpy.context.scene.collection.objects.link(rings)
    objs = [slab, rings]
    tilt = VIEW_ELEVATION_DEG - ct.CAM_ELEVATION_DEG
    M = Matrix.Rotation(math.radians(tilt), 4, "X")
    for o in objs:
        o.matrix_world = M
    bpy.context.view_layer.update()

    for o in objs:
        o.data.materials.clear()
    slab.data.materials.append(_zone_material())
    rmat = ct.clay("ClayRings", RING_HEX)
    rmat.node_tree.nodes["Principled BSDF"].inputs["Sheen Weight"].default_value = SHEEN
    rings.data.materials.append(rmat)
    ct.setup_scene(objs)
    # icon-level light tweaks (theme untouched)
    if CAL_FILL is not None and bpy.data.objects.get("Fill"):
        bpy.data.objects["Fill"].data.energy = float(CAL_FILL)
    if CAL_KEY is not None:
        bpy.data.objects["Key"].data.energy = float(CAL_KEY)
    # icon-level: weaker cool rim, at 10 W it clipped the header's top-right corner (R > 250)
    bpy.data.objects["Rim"].data.energy = CAL_RIM
    wnt = bpy.context.scene.world.node_tree
    if CAL_WORLD is not None:
        wnt.nodes["Background"].inputs["Strength"].default_value = float(CAL_WORLD)
    if CAL_LOW:
        ramp = next(n for n in wnt.nodes if n.type == "VALTORGB")
        ramp.color_ramp.elements[0].color = ct.srgb_hex_to_linear(CAL_LOW)
    ct.print_poly_counts(objs)
    print("POLYS total", sum(len(o.data.polygons) for o in objs))

    if os.environ.get("CLAY_PART_MASK"):
        _part_mask(objs)
        bpy.context.scene.cycles.samples = 1
        bpy.context.scene.cycles.use_denoising = False
        ct.render(os.path.join(out_dir, "part-mask.png"))
        return
    t = ct.render(os.path.join(out_dir, "calendar.png"))
    if not os.environ.get("CLAY_NO_BLEND"):
        ct.save_blend(os.path.join(out_dir, "calendar.blend"))
    print("TIMES", {"calendar": round(t, 1)})


main()
