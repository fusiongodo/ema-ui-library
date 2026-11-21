"""Icon #16 scores: a cream clay tablet with a raised mint score curve ending in a
coral dot ("today"). The dashed "usual" line of the brief was removed by the
orchestrator (USUAL_LINE = False): the curve crosses it, only 3 of 6 dashes stayed clean.

Geometry only; look from clay_theme (theme untouched, icon-level light tweaks).
Run: Blender -b --factory-startup --python icons/scores.py -- <out_dir>

Construction as calendar: SDF -> rough start mesh -> voxel remesh -> Newton
projection. The curve is a round tube (centre line in the face plane, so it is
sunk halfway) smooth-unioned into the slab (soft fillet, no lip). Its 2D distance
is precomputed on a fine grid (bilinear lookup). The dashes are a smooth height
profile inside the slab SDF. Colour zones are a per-vertex colour attribute.
The dot is a separate sphere. Units: tablet width = 1.0. X right, Z up, front at -Y.
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
W, H, T = 1.0, 0.78, 0.12
CORNER = 0.16                # front-view corner radius
EDGE = 0.05                  # soft clay edges
FRONT = -T / 2
X0, Z0 = -W / 2, -H / 2      # tablet left / bottom edge

PTS = [(0.14, 0.30), (0.32, 0.44), (0.50, 0.34), (0.68, 0.54), (0.82, 0.60)]
TUBE_R = 0.075 / 2
FILLET = 0.016               # smooth-union radius tube/face
DOT_R = 0.15 / 2
DOT_SINK = 0.012             # dot slightly sunk into the face (contact)

USUAL_LINE = bool(int(os.environ.get("CLAY_SC_USUAL", "0")))   # off: orchestrator decision
DASH_Y = 0.42
DASH_X = (0.10, 0.90)
DASH_N, DASH_L = 6, 0.08
DASH_W = 0.024               # dash width (round ends)
DASH_D = 0.008
DASH_SOFT = 0.006            # half width of the soft dash wall
DASH_CLEAR = float(os.environ.get("CLAY_SC_DASH_CLEAR", "0.020"))          # dashes stop this far from the tube surface
DASH_MIN = 0.035             # shorter dash pieces are dropped (no slivers)

VIEW_ELEVATION_DEG = 8.0

CREAM_HEX = os.environ.get("CLAY_SC_CREAM", "#EEEAE2")
MINT_HEX = os.environ.get("CLAY_SC_MINT", "#7DC99C")
MINT_LIGHT_HEX, MINT_DARK_HEX = "#B8E6C9", "#2A9262"   # normal-direction stops (up / down)
MINT_GRAD = (0.50, 0.60)                               # weights of the light / dark stop
DASH_HEX = os.environ.get("CLAY_SC_DASH", "#BBB4A4")
CORAL_HEX = os.environ.get("CLAY_SC_CORAL", "#F28C77")
CORAL_LOW_HEX, CORAL_LOW = "#FCA48A", 0.70            # lighter, warmer underside (shadow side)
FACE_GRAD = (1.05, 0.97)     # cream x this at the top / bottom of the face (lit top)
BODY_RIM = 0.60              # cream x this along the bottom rim
SIDE_RIM = 0.86              # cream x this along the right rim
RIM_WARM = (0.0, 0.10, 0.35)  # per-channel extra darkening share in the rims (linear)
TOP_RIM = 0.94               # cream x this along the top rim (key-lit edge stays below 250)
SC_FILL = os.environ.get("CLAY_SC_FILL", "30")
SC_KEY = os.environ.get("CLAY_SC_KEY")
SC_WORLD = os.environ.get("CLAY_SC_WORLD")
SC_RIM = float(os.environ.get("CLAY_SC_RIM", "2"))
SC_LOW = os.environ.get("CLAY_SC_LOW", "#9A8E84")   # warm low world (as calendar)
SHEEN = float(os.environ.get("CLAY_SC_SHEEN", "0.15"))
SSS_SCALE = float(os.environ.get("CLAY_SC_SSS", "0.008"))
VOXEL = float(os.environ.get("CLAY_VOXEL", "0.0036"))


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


def _smax(a, b, k):
    h = np.clip(0.5 - 0.5 * (b - a) / k, 0.0, 1.0)
    return b * (1 - h) + a * h + k * h * (1 - h)


def _smin(a, b, k):
    h = np.clip(0.5 + 0.5 * (b - a) / k, 0.0, 1.0)
    return b * (1 - h) + a * h - k * h * (1 - h)


# ------------------------------------------------------------ curve
def _spline(n_per=80):
    """Catmull-Rom through PTS (object coords), phantom end points by reflection."""
    P = np.array([(X0 + x, Z0 + z) for x, z in PTS])
    P = np.vstack([2 * P[0] - P[1], P, 2 * P[-1] - P[-2]])
    out = []
    for i in range(1, len(P) - 2):
        p0, p1, p2, p3 = P[i - 1], P[i], P[i + 1], P[i + 2]
        for t in np.linspace(0, 1, n_per, endpoint=False):
            t2, t3 = t * t, t * t * t
            out.append(0.5 * ((2 * p1) + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2
                              + (-p0 + 3 * p1 - 3 * p2 + p3) * t3))
    out.append(P[-2])
    return np.array(out)


GRID_STEP = 0.001
GX = np.arange(X0 - 0.06, -X0 + 0.06 + GRID_STEP, GRID_STEP)
GZ = np.arange(Z0 - 0.06, -Z0 + 0.06 + GRID_STEP, GRID_STEP)


def _curve_grid():
    C = _spline()
    xx, zz = np.meshgrid(GX, GZ, indexing="ij")
    px, pz = xx.ravel(), zz.ravel()
    best = np.full(px.shape, 1e9)
    for a, b in zip(C[:-1], C[1:]):
        d = b - a
        L2 = d @ d
        t = np.clip(((px - a[0]) * d[0] + (pz - a[1]) * d[1]) / L2, 0, 1)
        best = np.minimum(best, np.hypot(px - a[0] - t * d[0], pz - a[1] - t * d[1]))
    return best.reshape(xx.shape)


CURVE = _curve_grid()


def curve_d2(x, z):
    """Bilinear lookup of the 2D distance to the curve centre line."""
    fx = np.clip((x - GX[0]) / GRID_STEP, 0, len(GX) - 1.001)
    fz = np.clip((z - GZ[0]) / GRID_STEP, 0, len(GZ) - 1.001)
    i, k = fx.astype(int), fz.astype(int)
    u, v = fx - i, fz - k
    return ((CURVE[i, k] * (1 - u) + CURVE[i + 1, k] * u) * (1 - v)
            + (CURVE[i, k + 1] * (1 - u) + CURVE[i + 1, k + 1] * u) * v)


def _dash_pieces():
    """Dash centre segments (x0, x1). Each dash is cut where it would run within
    DASH_CLEAR of the tube; the remaining pieces keep round ends, pieces shorter than
    DASH_MIN are dropped (no slivers beside the curve)."""
    zc = Z0 + DASH_Y
    gap = (DASH_X[1] - DASH_X[0] - DASH_N * DASH_L) / (DASH_N - 1)
    r = DASH_W / 2
    out = []
    for i in range(DASH_N):
        a = X0 + DASH_X[0] + i * (DASH_L + gap)
        xs = np.linspace(a + r, a + DASH_L - r, 400)
        ok = curve_d2(xs, np.full(xs.shape, zc)) > TUBE_R + DASH_CLEAR + r
        j = 0
        while j < len(xs):
            if not ok[j]:
                j += 1
                continue
            k = j
            while k + 1 < len(xs) and ok[k + 1]:
                k += 1
            if xs[k] - xs[j] + 2 * r >= DASH_MIN:
                out.append((xs[j], xs[k]))
            j = k + 1
    return out


def _dash_sdf2(x, z):
    zc = Z0 + DASH_Y
    best = np.full(x.shape, 1e9)
    for x0, x1 in DASHES:
        t = np.clip(x, x0, x1)
        best = np.minimum(best, np.hypot(x - t, z - zc) - DASH_W / 2)
    return best


DASHES = _dash_pieces() if USUAL_LINE else []
print("DASH pieces", [(round(a - X0, 3), round(b - X0, 3)) for a, b in DASHES])


def slab_sdf(P):
    x, y, z = P[:, 0], P[:, 1], P[:, 2]
    s = _rrect(x, z, W / 2, H / 2, CORNER)
    d = _extrude(s, y, 0.0, T / 2, EDGE)
    front = _ss(0.0, -0.02, y)
    d = d + DASH_D * _ss(DASH_SOFT, -DASH_SOFT, _dash_sdf2(x, z)) * front
    tube = np.hypot(curve_d2(x, z), y - FRONT) - TUBE_R
    return _smin(d, tube, FILLET)


# ------------------------------------------------------------ mesh build (as calendar)
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


def _dot():
    x, z = X0 + PTS[-1][0], Z0 + PTS[-1][1]
    bm = bmesh.new()
    bmesh.ops.create_uvsphere(bm, u_segments=128, v_segments=64, radius=DOT_R)
    me = bpy.data.meshes.new("Dot")
    bm.to_mesh(me)
    bm.free()
    me.shade_smooth()
    obj = bpy.data.objects.new("Dot", me)
    bpy.context.scene.collection.objects.link(obj)
    obj.data.transform(Matrix.Translation((x, FRONT - DOT_R + DOT_SINK, z)))
    return obj


# ------------------------------------------------------------ colour
def _zones(P):
    x, y, z = P[:, 0], P[:, 1], P[:, 2]
    front = _ss(-0.045, -0.055, y)
    mint = _ss(TUBE_R + 0.004, TUBE_R - 0.002, curve_d2(x, z)) * _ss(FRONT + 0.004, FRONT - 0.002, y)
    dash = _ss(0.001, -0.003, _dash_sdf2(x, z)) * front * (1 - mint)
    return mint, dash


def _normals(me):
    n = np.empty(len(me.vertices) * 3)
    me.vertex_normals.foreach_get("vector", n)
    return n.reshape(-1, 3)


def _dot_colors(obj):
    me = obj.data
    nz = _normals(me)[:, 2]
    base, low = (np.array(ct.srgb_hex_to_linear(h)[:3]) for h in (CORAL_HEX, CORAL_LOW_HEX))
    w = (CORAL_LOW * _ss(-0.1, -0.9, nz))[:, None]
    col = np.ones((len(nz), 4), dtype=np.float32)
    col[:, :3] = base * (1 - w) + low * w
    a = me.color_attributes.new("zone", "FLOAT_COLOR", "POINT")
    a.data.foreach_set("color", col.ravel())


def _vertex_colors(obj):
    me = obj.data
    P = _get_co(me)
    mint, dash = _zones(P)
    L = {k: np.array(ct.srgb_hex_to_linear(h)[:3]) for k, h in
         (("cream", CREAM_HEX), ("mint", MINT_HEX), ("dash", DASH_HEX))}
    z = P[:, 2]
    tz = np.clip((z - Z0) / H, 0, 1)
    g = FACE_GRAD[1] + (FACE_GRAD[0] - FACE_GRAD[1]) * tz
    rim = ((1 - (1 - SIDE_RIM) * _ss(-X0 - 0.06, -X0, P[:, 0]))      # shadow-side (right) rim
           * (1 - (1 - BODY_RIM) * _ss(Z0 + 0.12, Z0, z)))
    g = g * rim * (1 - (1 - TOP_RIM) * _ss(-Z0 - 0.05, -Z0, z))
    warm = 1 - (1 - rim)[:, None] * np.array(RIM_WARM)              # rims warmer (less blue)
    c = L["cream"][None, :] * g[:, None] * warm
    N = _normals(me)
    nz = N[:, 2]
    lm, dm = (np.array(ct.srgb_hex_to_linear(h)[:3]) for h in (MINT_LIGHT_HEX, MINT_DARK_HEX))
    wl = (MINT_GRAD[0] * _ss(0.0, 0.9, nz))[:, None]
    wd = (MINT_GRAD[1] * _ss(-0.1, -0.9, nz))[:, None]
    mc = L["mint"] * (1 - wl - wd) + lm * wl + dm * wd
    c = c * (1 - mint - dash)[:, None] + mc * mint[:, None] + L["dash"] * dash[:, None]
    col = np.ones((len(P), 4), dtype=np.float32)
    col[:, :3] = np.clip(c, 0, 1)
    a = me.color_attributes.new("zone", "FLOAT_COLOR", "POINT")
    a.data.foreach_set("color", col.ravel())
    m = np.zeros((len(P), 4), dtype=np.float32)
    m[:, 3] = 1
    m[:, 0] = mint > 0.5
    m[:, 1] = dash > 0.5
    a = me.color_attributes.new("part", "FLOAT_COLOR", "POINT")
    a.data.foreach_set("color", m.ravel())


def _zone_material(name="ClayScores", hex_color=CREAM_HEX, sss_scale=SSS_SCALE):
    mat = ct.clay(name, hex_color, sss_scale=sss_scale)
    nt = mat.node_tree
    attr = nt.nodes.new("ShaderNodeAttribute")
    attr.attribute_name = "zone"
    mix = nt.nodes["EdgeMix"]
    nt.links.new(attr.outputs["Color"], mix.inputs["A"])
    nt.links.new(attr.outputs["Color"], mix.inputs["B"])   # no grazing lift: cream would clip
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
            em.inputs["Color"].default_value = (0, 0, 1, 1)
        nt.links.new(em.outputs["Emission"], out.inputs["Surface"])
        o.data.materials.clear()
        o.data.materials.append(mat)


def main():
    argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    out_dir = argv[0] if argv else os.path.join(os.path.dirname(HERE), "out", "scores")
    os.makedirs(out_dir, exist_ok=True)
    ct.reset_scene()

    m = 0.03
    slab = build("Slab", slab_sdf, (-W / 2 - m, FRONT - 0.06, -H / 2 - m), (W / 2 + m, T / 2 + m, H / 2 + m),
                 VOXEL, 0.02)
    _vertex_colors(slab)
    dot = _dot()
    objs = [slab, dot]
    M = Matrix.Rotation(math.radians(VIEW_ELEVATION_DEG - ct.CAM_ELEVATION_DEG), 4, "X")
    for o in objs:
        o.matrix_world = M
    bpy.context.view_layer.update()

    for o in objs:
        o.data.materials.clear()
    slab.data.materials.append(_zone_material())
    _dot_colors(dot)
    dot.data.materials.append(_zone_material("ClayCoral", CORAL_HEX, 0.05))
    ct.setup_scene(objs)
    # icon-level light tweaks (theme untouched), as calendar
    if SC_FILL is not None and bpy.data.objects.get("Fill"):
        bpy.data.objects["Fill"].data.energy = float(SC_FILL)
    if SC_KEY is not None:
        bpy.data.objects["Key"].data.energy = float(SC_KEY)
    bpy.data.objects["Rim"].data.energy = SC_RIM
    wnt = bpy.context.scene.world.node_tree
    if SC_WORLD is not None:
        wnt.nodes["Background"].inputs["Strength"].default_value = float(SC_WORLD)
    if SC_LOW:
        ramp = next(n for n in wnt.nodes if n.type == "VALTORGB")
        ramp.color_ramp.elements[0].color = ct.srgb_hex_to_linear(SC_LOW)
    ct.print_poly_counts(objs)
    print("POLYS total", sum(len(o.data.polygons) for o in objs))

    if os.environ.get("CLAY_PART_MASK"):
        _part_mask(objs)
        bpy.context.scene.cycles.samples = 1
        bpy.context.scene.cycles.use_denoising = False
        ct.render(os.path.join(out_dir, "part-mask.png"))
        return
    t = ct.render(os.path.join(out_dir, "scores.png"))
    if not os.environ.get("CLAY_NO_BLEND"):
        ct.save_blend(os.path.join(out_dir, "scores.blend"))
    print("TIMES", {"scores": round(t, 1)})


main()
