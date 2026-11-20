"""Icon #8 log-scores: a blank clay clipboard with a dusty-rose clip.

Geometry only; the look comes from clay_theme (theme untouched, icon-level light
overrides as in protocol_pill). Run: Blender -b --factory-startup --python icons/log_scores.py -- <out_dir>

Construction: two convex rounded-extrusion SDFs (board; clip = base block + tab
disc with a round through-hole), rough start mesh, voxel remesh, Newton
projection onto the surface, remesh, project again. No subdivision.
Units: board width = 1.0. Object space: X right, Z up, Y depth (front face at -Y).
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
BOARD_W, BOARD_H, BOARD_T = 1.0, 1.18, 0.20
BOARD_CORNER = 0.14          # front-view corner radius
BOARD_EDGE = 0.06            # rounding of all edges
TOP = BOARD_H / 2
FRONT = -BOARD_T / 2         # front face plane (y)

CLIP_EDGE = 0.025
BASE_W, BASE_H, BASE_D = 0.58, 0.18, 0.10
BASE_ZC = TOP - 0.04
BASE_CORNER = 0.05           # front-view corner radius of the base block
BASE_EMBED = 0.02            # base reaches this far into the board (contact crease)
TAB_R, TAB_D = 0.20, 0.08
TAB_ZC = BASE_ZC + BASE_H / 2  # disc centre on the base's top edge -> half-disc above
# Hole centre 0.13 above the board top: its bottom (+0.055) clears the base top (+0.05).
HOLE_R = 0.075
HOLE_ZC = TOP + float(os.environ.get("CLAY_HOLE_DZ", "0.13"))
UNION_K = 0.006              # tiny smooth union tab/base (anti-aliasing of the crease)

VIEW_ELEVATION_DEG = 12.0    # board face seen from 12 deg above
VIEW_YAW_DEG = 6.0           # camera slightly from the right: right/bottom thickness shows

# Paper sheet lying on the board (round 2): thin convex rounded slab
SHEET_INSET = (0.08, 0.08, 0.08, 0.12)   # left, right, bottom, top (top tucked under the clip base)
SHEET_T = 0.035
SHEET_CORNER = 0.08
SHEET_EDGE = 0.015
SHEET_EMBED = 0.01

REF = ct.REFERENCE["log-scores"]
BOARD_HEX = os.environ.get("CLAY_BOARD_HEX", "#E3E1DC")
SHEET_HEX = os.environ.get("CLAY_SHEET_HEX", "#EFF0EC")   # tuned: sheet mid #E7E6E2
CLIP_HEX = os.environ.get("CLAY_CLIP_HEX", "#C08A86")
LS_FILL = os.environ.get("CLAY_LS_FILL")      # icon-level light overrides (None = theme)
LS_KEY = os.environ.get("CLAY_LS_KEY")
LS_WORLD = os.environ.get("CLAY_LS_WORLD")
LS_HIGH = os.environ.get("CLAY_LS_HIGH")
LS_LOW = os.environ.get("CLAY_LS_LOW", "#9A8A76")   # warm low world: beige shadow bands
KEY2_ENERGY = float(os.environ.get("CLAY_KEY2", "3.5"))
KEY2_SIZE = 1.5
KEY2_AZ_EL = tuple(float(v) for v in os.environ.get("CLAY_KEY2_AZEL", "-70,40").split(","))
KEY2_DISTANCE = 2.5
RIM_ENERGY = float(os.environ.get("CLAY_LS_RIM", "0"))
BOARD_SHEEN = float(os.environ.get("CLAY_BOARD_SHEEN", "0.25"))
BOARD_EDGE_LIFT = float(os.environ.get("CLAY_BOARD_EDGE_LIFT", "1.0"))
RIM_COLOR = tuple(float(v) for v in os.environ.get("CLAY_LS_RIM_COLOR", "1.0,0.93,0.82").split(","))

VOXEL_BOARD = float(os.environ.get("CLAY_VOXEL", "0.006"))
VOXEL_CLIP = float(os.environ.get("CLAY_VOXEL_CLIP", "0.0035"))


def _rrect(px, pz, hx, hz, r):
    qx, qz = np.abs(px) - hx + r, np.abs(pz) - hz + r
    return np.hypot(np.maximum(qx, 0), np.maximum(qz, 0)) + np.minimum(np.maximum(qx, qz), 0) - r


def _extrude(s, y, yc, half, r):
    """Rounded extrusion of a 2D SDF s along Y: all edges rounded by r (convex)."""
    wx = s + r
    wy = np.abs(y - yc) - half + r
    return (np.minimum(np.maximum(wx, wy), 0)
            + np.hypot(np.maximum(wx, 0), np.maximum(wy, 0)) - r)


def board_sdf(P):
    x, y, z = P[:, 0], P[:, 1], P[:, 2]
    s = _rrect(x, z, BOARD_W / 2, BOARD_H / 2, BOARD_CORNER)
    return _extrude(s, y, 0.0, BOARD_T / 2, BOARD_EDGE)


def _sheet_box():
    l, r, b, t = SHEET_INSET
    x0, x1 = -BOARD_W / 2 + l, BOARD_W / 2 - r
    z0, z1 = -BOARD_H / 2 + b, BOARD_H / 2 - t
    y0, y1 = FRONT - SHEET_T, FRONT + SHEET_EMBED
    return x0, x1, y0, y1, z0, z1


def sheet_sdf(P):
    x, y, z = P[:, 0], P[:, 1], P[:, 2]
    x0, x1, y0, y1, z0, z1 = _sheet_box()
    s = _rrect(x - (x0 + x1) / 2, z - (z0 + z1) / 2, (x1 - x0) / 2, (z1 - z0) / 2, SHEET_CORNER)
    return _extrude(s, y, (y0 + y1) / 2, (y1 - y0) / 2, SHEET_EDGE)


def clip_sdf(P):
    x, y, z = P[:, 0], P[:, 1], P[:, 2]
    yb0, yb1 = FRONT - BASE_D, FRONT + BASE_EMBED
    sb = _rrect(x, z - BASE_ZC, BASE_W / 2, BASE_H / 2, BASE_CORNER)
    db = _extrude(sb, y, (yb0 + yb1) / 2, (yb1 - yb0) / 2, CLIP_EDGE)
    st = np.maximum(np.hypot(x, z - TAB_ZC) - TAB_R, HOLE_R - np.hypot(x, z - HOLE_ZC))
    st = np.maximum(st, BASE_ZC - z)   # half-disc: the lower half must not poke out below the base
    yt0, yt1 = FRONT - TAB_D, FRONT + BASE_EMBED
    dt = _extrude(st, y, (yt0 + yt1) / 2, (yt1 - yt0) / 2, CLIP_EDGE)
    h = np.clip(0.5 + 0.5 * (dt - db) / UNION_K, 0.0, 1.0)
    return dt * (1 - h) + db * h - UNION_K * h * (1 - h)


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


def _clip_start(name):
    """Start mesh with the hole already open (a closed cube start would leave a
    membrane across the hole after projection): base box + tab cylinder - hole."""
    m = 0.01
    obj = _cube_mesh(name, (-BASE_W / 2 - m, FRONT - BASE_D - m, BASE_ZC - BASE_H / 2 - m),
                     (BASE_W / 2 + m, FRONT + BASE_EMBED + m, BASE_ZC + BASE_H / 2 + m))
    yc = FRONT + (BASE_EMBED - TAB_D) / 2
    for nm, r, op, ext in (("TabStart", TAB_R + m, "UNION", m), ("HoleStart", HOLE_R - 0.015, "DIFFERENCE", 0.2)):
        bm = bmesh.new()
        bmesh.ops.create_cone(bm, cap_ends=True, segments=96, radius1=r, radius2=r,
                              depth=TAB_D + BASE_EMBED + 2 * ext,
                              matrix=Matrix.Translation((0, yc, TAB_ZC if nm == "TabStart" else HOLE_ZC))
                              @ Matrix.Rotation(math.radians(90), 4, "X"))
        me = bpy.data.meshes.new(nm)
        bm.to_mesh(me)
        bm.free()
        cut = bpy.data.objects.new(nm, me)
        bpy.context.scene.collection.objects.link(cut)
        mod = obj.modifiers.new(nm, "BOOLEAN")
        mod.operation = op
        mod.solver = "EXACT"
        mod.object = cut
        dg = bpy.context.evaluated_depsgraph_get()
        new = bpy.data.meshes.new_from_object(obj.evaluated_get(dg))
        old = obj.data
        obj.modifiers.remove(mod)
        obj.data = new
        bpy.data.meshes.remove(old)
        bpy.data.objects.remove(cut)
        bpy.data.meshes.remove(me)
    _remesh(obj, 0.006)
    return obj


def build(name, sdf, lo, hi, voxel, coarse, start=None):
    obj = start(name) if start else _cube_mesh(name, lo, hi)
    _set_co(obj.data, project(_get_co(obj.data), sdf, iters=40))
    _remesh(obj, coarse)
    _set_co(obj.data, project(_get_co(obj.data), sdf))
    _remesh(obj, voxel)
    _set_co(obj.data, project(_get_co(obj.data), sdf))
    obj.data.shade_smooth()
    return obj


def _part_mask(objs):
    """Measurement helper. Board: R = front face, G = rim (normal up/left: B=0;
    right: B=0.5; bottom: B=1). Clip: R=G=B=1 front, 0.5 grey rim."""
    for o in objs:
        mat = bpy.data.materials.new("Mask" + o.name)
        mat.use_nodes = True
        nt = mat.node_tree
        nt.nodes.clear()
        out = nt.nodes.new("ShaderNodeOutputMaterial")
        em = nt.nodes.new("ShaderNodeEmission")
        attr = nt.nodes.new("ShaderNodeAttribute")
        attr.attribute_name = "part"
        nt.links.new(attr.outputs["Color"], em.inputs["Color"])
        nt.links.new(em.outputs["Emission"], out.inputs["Surface"])
        me = o.data
        nrm = np.empty(len(me.vertices) * 3)
        me.vertices.foreach_get("normal", nrm)
        n = nrm.reshape(-1, 3)
        col = np.zeros((len(n), 4), dtype=np.float32)
        col[:, 3] = 1
        front = n[:, 1] < -0.97
        if o.name == "Sheet":
            col[:, 0] = 1
            col[:, 2] = 1
        elif o.name == "Board":
            col[front, 0] = 1
            rim = ~front & (n[:, 1] < 0.3)
            col[rim, 1] = 1
            col[rim & (n[:, 0] > 0.5), 2] = 0.5
            col[rim & (n[:, 2] < -0.5), 2] = 1.0
        else:
            col[front, :3] = 1
            col[~front, :3] = 0.25
        a = me.color_attributes.new("part", "FLOAT_COLOR", "POINT")
        a.data.foreach_set("color", col.ravel())
        me.materials.clear()
        me.materials.append(mat)


def main():
    argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    out_dir = argv[0] if argv else os.path.join(os.path.dirname(HERE), "out", "log-scores")
    os.makedirs(out_dir, exist_ok=True)
    ct.reset_scene()

    m = 0.03
    board = build("Board", board_sdf,
                  (-BOARD_W / 2 - m, -BOARD_T / 2 - m, -BOARD_H / 2 - m),
                  (BOARD_W / 2 + m, BOARD_T / 2 + m, BOARD_H / 2 + m), VOXEL_BOARD, 0.02)
    x0, x1, y0, y1, z0, z1 = _sheet_box()
    sheet = build("Sheet", sheet_sdf, (x0 - m, y0 - m, z0 - m), (x1 + m, y1 + m, z1 + m),
                  VOXEL_BOARD, 0.008)
    clip = build("Clip", clip_sdf,
                 (-BASE_W / 2 - m, FRONT - BASE_D - m, BASE_ZC - BASE_H / 2 - m),
                 (BASE_W / 2 + m, FRONT + BASE_EMBED + m, TAB_ZC + TAB_R + m), VOXEL_CLIP, 0.008,
                 start=_clip_start)
    # pose: face normal tipped up so the face is seen at VIEW_ELEVATION_DEG
    tilt = VIEW_ELEVATION_DEG - ct.CAM_ELEVATION_DEG
    M = (Matrix.Rotation(math.radians(tilt), 4, "X")
         @ Matrix.Rotation(math.radians(-VIEW_YAW_DEG), 4, "Z"))
    objs = [board, sheet, clip]
    for o in objs:
        o.matrix_world = M
    bpy.context.view_layer.update()

    for o in objs:
        o.data.materials.clear()
    bmat = ct.clay("ClayBoard", BOARD_HEX)
    # icon-level: the theme's x1.08 grazing lift would clip this near-white base (>250)
    bmat.node_tree.nodes["EdgeMix"].inputs["B"].default_value = ct.srgb_hex_to_linear(
        ct._lighter_hex(BOARD_HEX, BOARD_EDGE_LIFT))
    # icon-level: less sheen on the near-white board, else the top rim clips at grazing angles
    bmat.node_tree.nodes["Principled BSDF"].inputs["Sheen Weight"].default_value = BOARD_SHEEN
    board.data.materials.append(bmat)
    smat = ct.clay("ClaySheet", SHEET_HEX)
    smat.node_tree.nodes["EdgeMix"].inputs["B"].default_value = ct.srgb_hex_to_linear(
        ct._lighter_hex(SHEET_HEX, BOARD_EDGE_LIFT))
    smat.node_tree.nodes["Principled BSDF"].inputs["Sheen Weight"].default_value = BOARD_SHEEN
    sheet.data.materials.append(smat)
    clip.data.materials.append(ct.clay("ClayClip", CLIP_HEX))
    ct.setup_scene(objs)
    # icon-level light overrides (theme untouched)
    # second small key from the upper left: lights the top/left rim, not the right/bottom
    tgt = Vector((0.0, 0.0, 0.05))
    k2d = bpy.data.lights.new("Key2", "AREA")
    k2d.size = KEY2_SIZE
    k2d.energy = KEY2_ENERGY
    k2d.use_temperature = True
    k2d.temperature = 6000
    k2 = bpy.data.objects.new("Key2", k2d)
    bpy.context.scene.collection.objects.link(k2)
    k2.location = tgt + ct._dir_from_angles(*KEY2_AZ_EL) * KEY2_DISTANCE
    ct._point_at(k2, tgt)
    # icon-level: neutral-warm rim light so the right rim band stays beige, not blue-grey
    bpy.data.objects["Rim"].data.color = RIM_COLOR
    bpy.data.objects["Rim"].data.energy = RIM_ENERGY
    if LS_FILL is not None and bpy.data.objects.get("Fill"):
        bpy.data.objects["Fill"].data.energy = float(LS_FILL)
    if LS_KEY is not None:
        bpy.data.objects["Key"].data.energy = float(LS_KEY)
    wnt = bpy.context.scene.world.node_tree
    if LS_WORLD is not None:
        wnt.nodes["Background"].inputs["Strength"].default_value = float(LS_WORLD)
    if LS_HIGH is not None:
        ramp = next(n for n in wnt.nodes if n.type == "VALTORGB")
        ramp.color_ramp.elements[1].color = ct.srgb_hex_to_linear(LS_HIGH)
    if LS_LOW is not None:
        ramp = next(n for n in wnt.nodes if n.type == "VALTORGB")
        ramp.color_ramp.elements[0].color = ct.srgb_hex_to_linear(LS_LOW)
    ct.print_poly_counts(objs)
    print("POLYS total", sum(len(o.data.polygons) for o in objs))

    if os.environ.get("CLAY_PART_MASK"):
        _part_mask(objs)
        bpy.context.scene.cycles.samples = 1
        bpy.context.scene.cycles.use_denoising = False
        ct.render(os.path.join(out_dir, "part-mask.png"))
        return
    t = ct.render(os.path.join(out_dir, "log-scores.png"))
    if not os.environ.get("CLAY_NO_BLEND"):
        ct.save_blend(os.path.join(out_dir, "log-scores.blend"))
    print("TIMES", {"log-scores": round(t, 1)})


main()
