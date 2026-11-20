"""Icon #6 protocol-injection: a clay syringe (cream body, lilac plunger).

Geometry only; the look comes from clay_theme (theme untouched, icon-level light
overrides only). Run: Blender -b --factory-startup --python icons/protocol_injection.py -- <out_dir>

Both parts are solids of revolution. Each profile is a 2D implicit shape in the
(axis x, radius r) plane: smooth union of rounded boxes / tapered capsules, the
nose groove a smooth subtraction. The profile curve is traced exactly (column scan,
then Newton projection onto the zero set and arc-length resampling, repeated) and
revolved: clean quads, no voxel remesh, no facets. Graduation marks: barrel
vertices displaced inward along the radius by a smooth cosine bump (inward only, so
no lips); the same bump is stored as a colour attribute that darkens the marks.
Units: total length 1.0, needle tip at x = 0, axis = object X.
"""
import math
import os
import sys

import bpy
import numpy as np
from mathutils import Matrix

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))
import clay_theme as ct  # noqa: E402

# ---------------------------------------------------------------- pose
SCREEN_ANGLE_DEG = float(os.environ.get("CLAY_INJ_ANGLE", "44"))   # axis above horizontal on screen
TOWARD_CAM_DEG = float(os.environ.get("CLAY_INJ_TILT", "20"))      # plunger end toward the camera
MARK_ROLL_DEG = float(os.environ.get("CLAY_INJ_MARK_ROLL", "40"))  # marks: from camera-facing toward upper left

# ---------------------------------------------------------------- mesh
N_PROFILE = int(os.environ.get("CLAY_INJ_N", "760"))   # points along each profile
N_SEG = int(os.environ.get("CLAY_INJ_SEG", "176"))     # segments around the axis

# ---------------------------------------------------------------- marks / nose groove
MARK_X = (0.460, 0.520, 0.580, 0.640)   # 4 marks, spacing 0.06
MARK_LEN = 0.08                          # arc length across the axis
MARK_W = 0.0095                          # half width of the soft bump
MARK_D = 0.0050                          # depth (shallow)
GROOVE_X, GROOVE_R, GROOVE_DEPTH = 0.358, 0.011, 0.011
# diameters scaled to the reference silhouette (brief table x ~1.15, needle/rod more)
NOSE_R, BARREL_R = 0.102, 0.116

# ---------------------------------------------------------------- colours
REF = ct.REFERENCE["protocol-injection"]
CREAM_HEX = os.environ.get("CLAY_INJ_CREAM", "#E2DBCC")
LILAC_HEX = os.environ.get("CLAY_INJ_LILAC", "#78698E")
# icon-level shading gradients (normal . GRAD_DIR): (from, to, colour, weight), as in sleep.py
GRAD_DIR = (-0.6, -0.45, 0.65)    # world normal that gets the full light tint (upper left, front)
CREAM_SHADE_HEX = os.environ.get("CLAY_INJ_CREAM_SHADE", "#B0A38C")
CREAM_LIGHT_HEX = os.environ.get("CLAY_INJ_CREAM_LIGHT", "#F2F6F0")
CREAM_LIGHT = float(os.environ.get("CLAY_INJ_CREAM_LIGHT_W", "0.75"))
CREAM_SHADE = float(os.environ.get("CLAY_INJ_CREAM_SHADE_W", "0.12"))
LILAC_LIGHT_HEX = os.environ.get("CLAY_INJ_LILAC_LIGHT", "#CDBCDC")
LILAC_DARK_HEX = os.environ.get("CLAY_INJ_LILAC_DARK", "#5A4570")
LILAC_GRAD = float(os.environ.get("CLAY_INJ_LILAC_GRAD", "0.8"))
MARK_HEX = os.environ.get("CLAY_INJ_MARK_HEX", "#B4A897")   # base colour at the floor of the marks
MARK_W8 = float(os.environ.get("CLAY_INJ_MARK_W", "1.0"))
EDGE_LIFT = float(os.environ.get("CLAY_INJ_EDGE_LIFT", "1.00"))  # cream would clip with x1.08
CREAM_SHEEN = float(os.environ.get("CLAY_INJ_SHEEN", "0.15"))
INJ_FILL = os.environ.get("CLAY_INJ_FILL")
INJ_KEY = os.environ.get("CLAY_INJ_KEY")
INJ_WORLD = os.environ.get("CLAY_INJ_WORLD")
INJ_LOW = os.environ.get("CLAY_INJ_LOW", "#A0968A")   # warmer, lighter ground: beige undersides
INJ_RIM = os.environ.get("CLAY_INJ_RIM")


# ---------------------------------------------------------------- 2D profile shapes
def _smin(a, b, k):
    h = np.clip(0.5 + 0.5 * (b - a) / k, 0, 1)
    return b * (1 - h) + a * h - k * h * (1 - h)


def _smax(a, b, k):
    return -_smin(-a, -b, k)


def _rbox(x, r, x0, x1, rad, rr):
    """Rounded box from x0 to x1, radius rad, corner rounding rr (r mirrored)."""
    qx = np.abs(x - (x0 + x1) / 2) - ((x1 - x0) / 2 - rr)
    qr = np.abs(r) - (rad - rr)
    return np.hypot(np.maximum(qx, 0), np.maximum(qr, 0)) + np.minimum(np.maximum(qx, qr), 0) - rr


def _tcap(x, r, x0, r0, x1, r1):
    """Tapered capsule along the axis (radius r0 at x0 to r1 at x1, round ends)."""
    t = np.clip((x - x0) / (x1 - x0), 0, 1)
    rad = r0 + (r1 - r0) * t
    return np.hypot(x - (x0 + (x1 - x0) * t), r) - rad


def cream_sdf(x, r):
    needle = _tcap(x, r, 0.014, 0.0145, 0.250, 0.0195)
    hub = _tcap(x, r, 0.238, 0.030, 0.305, 0.062)
    hub = _smax(hub, x - 0.333, 0.01)
    nose = _rbox(x, r, 0.324, 0.392, NOSE_R, 0.017)
    groove = np.hypot(x - GROOVE_X, np.abs(r) - (NOSE_R - GROOVE_DEPTH + GROOVE_R)) - GROOVE_R
    nose = _smax(nose, -groove, 0.006)
    barrel = _rbox(x, r, 0.381, 0.732, BARREL_R, 0.022)
    flange = _rbox(x, r, 0.725, 0.792, 0.170, 0.030)
    d = _smin(needle, hub, 0.012)
    d = _smin(d, nose, 0.014)
    d = _smin(d, barrel, 0.006)
    return _smin(d, flange, 0.010)


def lilac_sdf(x, r):
    rod = _rbox(x, r, 0.765, 0.945, 0.072, 0.012)
    cap = _rbox(x, r, 0.922, 1.000, 0.135, 0.040)
    return _smin(rod, cap, 0.016)


# ---------------------------------------------------------------- profile tracing
def _grad(f, x, r, e=1e-5):
    return ((f(x + e, r) - f(x - e, r)) / (2 * e), (f(x, r + e) - f(x, r - e)) / (2 * e))


def _end(f, lo, hi):
    """Axis end point: f(x, 0) changes sign between lo and hi (bisection)."""
    slo = f(np.array([lo]), np.array([0.0]))[0] < 0
    for _ in range(60):
        m = (lo + hi) / 2
        if (f(np.array([m]), np.array([0.0]))[0] < 0) == slo:
            lo = m
        else:
            hi = m
    return (lo + hi) / 2


def trace_profile(f, xa, xb, n):
    """Upper boundary of the 2D shape from axis point xa to axis point xb."""
    x0, x1 = _end(f, xa - 0.05, xa + 0.05), _end(f, xb - 0.05, xb + 0.05)
    xs = np.linspace(x0, x1, 4000)[1:-1]
    rr = np.linspace(0, 0.25, 5001)
    inside = f(xs[:, None], rr[None, :]) < 0
    rtop = np.array([rr[np.where(row)[0].max()] if row.any() else 0.0 for row in inside])
    P = np.column_stack([np.r_[x0, xs, x1], np.r_[0, rtop, 0]])
    for _ in range(12):
        seg = np.linalg.norm(np.diff(P, axis=0), axis=1)
        s = np.r_[0, np.cumsum(seg)]
        t = np.linspace(0, s[-1], n)
        P = np.column_stack([np.interp(t, s, P[:, 0]), np.interp(t, s, P[:, 1])])
        for _ in range(8):
            gx, gr = _grad(f, P[1:-1, 0], P[1:-1, 1])
            v = f(P[1:-1, 0], P[1:-1, 1]) / np.maximum(gx * gx + gr * gr, 1e-12)
            P[1:-1, 0] -= v * gx
            P[1:-1, 1] -= v * gr
        P[1:-1, 1] = np.maximum(P[1:-1, 1], 1e-5)
        P[0], P[-1] = (x0, 0), (x1, 0)
    return P


def revolve(name, prof, nseg):
    """Lathe mesh around X: poles at both profile ends, quads elsewhere."""
    inner = prof[1:-1]
    th = np.linspace(0, 2 * np.pi, nseg, endpoint=False)
    X = np.repeat(inner[:, 0], nseg)
    Y = (inner[:, 1][:, None] * np.sin(th)[None, :]).ravel()
    Z = (inner[:, 1][:, None] * np.cos(th)[None, :]).ravel()   # theta 0 = +Z (mark side)
    verts = np.column_stack([X, Y, Z])
    verts = np.vstack([verts, [prof[0, 0], 0, 0], [prof[-1, 0], 0, 0]])
    nr = len(inner)
    pa, pb = nr * nseg, nr * nseg + 1
    faces = []
    j = np.arange(nseg)
    jn = (j + 1) % nseg
    for i in range(nr - 1):
        a, b = i * nseg, (i + 1) * nseg
        faces += [(a + jj, a + kk, b + kk, b + jj) for jj, kk in zip(j, jn)]
    faces += [(pa, jj, kk) for jj, kk in zip(jn, j)]
    last = (nr - 1) * nseg
    faces += [(pb, last + jj, last + kk) for jj, kk in zip(j, jn)]
    me = bpy.data.meshes.new(name)
    me.from_pydata(verts.tolist(), [], faces)
    me.validate()
    obj = bpy.data.objects.new(name, me)
    bpy.context.scene.collection.objects.link(obj)
    return obj


def _co(me):
    co = np.empty(len(me.vertices) * 3)
    me.vertices.foreach_get("co", co)
    return co.reshape(-1, 3)


def carve_marks(obj):
    """Graduation marks: inward cosine bump on the +Z side of the barrel."""
    me = obj.data
    P = _co(me)
    x, y, z = P[:, 0], P[:, 1], P[:, 2]
    r = np.hypot(y, z)
    theta = np.arctan2(y, z)
    on_barrel = (x > 0.415) & (x < 0.685) & (r > BARREL_R - 0.006)
    s = theta * BARREL_R                      # arc length on the barrel
    depth = np.zeros(len(P))
    for mx in MARK_X:
        ds = np.maximum(np.abs(s) - (MARK_LEN / 2 - MARK_W), 0)   # round ends
        dist = np.hypot(x - mx, ds)
        b = 0.5 * (1 + np.cos(np.pi * np.minimum(dist / MARK_W, 1)))
        depth = np.maximum(depth, b)
    depth *= on_barrel
    scale = np.where(r > 0, (r - MARK_D * depth) / np.maximum(r, 1e-9), 1)
    P[:, 1] *= scale
    P[:, 2] *= scale
    # nose groove shade (profile groove): bump around GROOVE_X on the nose
    g = 0.5 * (1 + np.cos(np.pi * np.minimum(np.abs(x - GROOVE_X) / 0.010, 1))) * (r > 0.08) * (x > 0.315) * (x < 0.385)
    shade = np.maximum(depth, 0.6 * g)
    me.vertices.foreach_set("co", P.astype(np.float32).ravel())
    me.update()
    col = np.zeros((len(P), 4), np.float32)
    col[:, 0] = shade
    col[:, 3] = 1
    a = me.color_attributes.new("mark", "FLOAT_COLOR", "POINT")
    a.data.foreach_set("color", col.ravel())


def _pose_matrix():
    fwd = -np.array(ct._dir_from_angles(ct.CAM_YAW_DEG, ct.CAM_ELEVATION_DEG))
    right = np.cross(fwd, [0.0, 0.0, 1.0])
    right /= np.linalg.norm(right)
    up = np.cross(right, fwd)
    A, T = math.radians(SCREEN_ANGLE_DEG), math.radians(TOWARD_CAM_DEG)
    d = math.cos(T) * (math.cos(A) * right + math.sin(A) * up) - math.sin(T) * fwd
    c = -fwd - np.dot(-fwd, d) * d
    c /= np.linalg.norm(c)
    e = -math.sin(A) * right + math.cos(A) * up
    e = e - np.dot(e, d) * d - np.dot(e, c) * c
    e /= np.linalg.norm(e)
    phi = math.radians(MARK_ROLL_DEG)
    zc = math.cos(phi) * c + math.sin(phi) * e
    yc = np.cross(zc, d)
    M = Matrix(np.column_stack([d, yc, zc]).tolist()).to_4x4()
    return M @ Matrix.Translation((-0.5, 0, 0))


def _material(name, hex_color, sheen=None):
    mat = ct.clay(name, hex_color)
    nt = mat.node_tree
    bsdf = nt.nodes["Principled BSDF"]
    nt.nodes["EdgeMix"].inputs["B"].default_value = ct.srgb_hex_to_linear(ct._lighter_hex(hex_color, EDGE_LIFT))
    if sheen is not None:
        bsdf.inputs["Sheen Weight"].default_value = sheen
    return mat


def _add_marks(mat):
    """Darken the marks and the nose groove (colour attribute 'mark'), applied last."""
    nt = mat.node_tree
    bsdf = nt.nodes["Principled BSDF"]
    src = bsdf.inputs["Base Color"].links[0].from_socket
    attr = nt.nodes.new("ShaderNodeAttribute")
    attr.attribute_name = "mark"
    sep = nt.nodes.new("ShaderNodeSeparateColor")
    fac = nt.nodes.new("ShaderNodeMath")
    fac.operation = "MULTIPLY"
    fac.inputs[1].default_value = MARK_W8
    mix = nt.nodes.new("ShaderNodeMix")
    mix.data_type = "RGBA"
    mix.inputs["B"].default_value = ct.srgb_hex_to_linear(MARK_HEX)
    nt.links.new(attr.outputs["Color"], sep.inputs["Color"])
    nt.links.new(sep.outputs["Red"], fac.inputs[0])
    nt.links.new(fac.outputs["Value"], mix.inputs["Factor"])
    nt.links.new(src, mix.inputs["A"])
    nt.links.new(mix.outputs["Result"], bsdf.inputs["Base Color"])
    return mat


def _gradient(mat, stops):
    """Mix the base colour toward stop colours by the normal's dot with GRAD_DIR."""
    nt = mat.node_tree
    bsdf = nt.nodes["Principled BSDF"]
    src = bsdf.inputs["Base Color"].links[0].from_socket
    geo = nt.nodes.new("ShaderNodeNewGeometry")
    dot = nt.nodes.new("ShaderNodeVectorMath")
    dot.operation = "DOT_PRODUCT"
    v = np.array(GRAD_DIR)
    dot.inputs[1].default_value = tuple(v / np.linalg.norm(v))
    nt.links.new(geo.outputs["Normal"], dot.inputs[0])
    prev = src
    for lo, hi, hexc, w in stops:
        rng = nt.nodes.new("ShaderNodeMapRange")
        rng.interpolation_type = "SMOOTHSTEP"
        rng.inputs["From Min"].default_value = lo
        rng.inputs["From Max"].default_value = hi
        nt.links.new(dot.outputs["Value"], rng.inputs["Value"])
        fac = nt.nodes.new("ShaderNodeMath")
        fac.operation = "MULTIPLY"
        fac.inputs[1].default_value = w
        nt.links.new(rng.outputs["Result"], fac.inputs[0])
        mix = nt.nodes.new("ShaderNodeMix")
        mix.data_type = "RGBA"
        mix.inputs["B"].default_value = ct.srgb_hex_to_linear(hexc)
        nt.links.new(fac.outputs["Value"], mix.inputs["Factor"])
        nt.links.new(prev, mix.inputs["A"])
        prev = mix.outputs["Result"]
    nt.links.new(prev, bsdf.inputs["Base Color"])
    return mat


def _mask(objs):
    cols = {"Body": (1, 0, 0, 1), "Plunger": (0, 0, 1, 1)}
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
    out_dir = argv[0] if argv else os.path.join(os.path.dirname(HERE), "out", "protocol-injection")
    os.makedirs(out_dir, exist_ok=True)
    ct.reset_scene()

    body = revolve("Body", trace_profile(cream_sdf, 0.0, 0.79, N_PROFILE), N_SEG)
    carve_marks(body)
    plunger = revolve("Plunger", trace_profile(lilac_sdf, 0.753, 1.0, N_PROFILE // 3), N_SEG)
    objs = [body, plunger]
    M = _pose_matrix()
    for o in objs:
        o.data.shade_smooth()
        o.matrix_world = M
    bpy.context.view_layer.update()

    body.data.materials.append(_gradient(_material("ClayCream", CREAM_HEX, CREAM_SHEEN),
                                         ((0.1, 0.9, CREAM_LIGHT_HEX, CREAM_LIGHT),
                                          (0.55, -0.7, CREAM_SHADE_HEX, CREAM_SHADE))))
    _add_marks(body.data.materials[0])
    plunger.data.materials.append(_gradient(_material("ClayLilac", LILAC_HEX),
                                            ((0.2, 1.0, LILAC_LIGHT_HEX, LILAC_GRAD),
                                             (0.15, -0.6, LILAC_DARK_HEX, 0.5))))

    ct.setup_scene(objs)
    wnt = bpy.context.scene.world.node_tree
    if INJ_FILL is not None and bpy.data.objects.get("Fill"):
        bpy.data.objects["Fill"].data.energy = float(INJ_FILL)
    if INJ_KEY is not None:
        bpy.data.objects["Key"].data.energy = float(INJ_KEY)
    if INJ_RIM is not None:
        bpy.data.objects["Rim"].data.energy = float(INJ_RIM)
    if INJ_WORLD is not None:
        wnt.nodes["Background"].inputs["Strength"].default_value = float(INJ_WORLD)
    if INJ_LOW is not None:
        ramp = next(n for n in wnt.nodes if n.type == "VALTORGB")
        ramp.color_ramp.elements[0].color = ct.srgb_hex_to_linear(INJ_LOW)
    ct.print_poly_counts(objs)
    print("POLYS total", sum(len(o.data.polygons) for o in objs))

    if os.environ.get("CLAY_PART_MASK"):
        _mask(objs)
        bpy.context.scene.cycles.samples = 1
        bpy.context.scene.cycles.use_denoising = False
        ct.render(os.path.join(out_dir, "part-mask.png"))
        return
    t = ct.render(os.path.join(out_dir, "protocol-injection.png"))
    if not os.environ.get("CLAY_NO_BLEND"):
        ct.save_blend(os.path.join(out_dir, "protocol-injection.blend"))
    print("TIMES", {"protocol-injection": round(t, 1)})


main()
