"""Icon #13 guide: a clay light bulb (warm white glass, terracotta base).

The flat peach ring around it is drawn in composite.py (REFERENCE["guide"]["ring"]).
Geometry only; the look comes from clay_theme (theme untouched, icon-level light
overrides only). Run: Blender -b --factory-startup --python icons/guide.py -- <out_dir>

Both parts are solids of revolution, built like icons/protocol_injection.py: a 2D
implicit profile in the (axis x, radius r) plane is traced exactly and revolved into
clean quads (no voxel remesh, no facets). Units: glass width 1.0, glass top at x = 0,
x grows downward to the cap tip (~1.41). Axis = world -Z, then tilted so the view
elevation is VIEW_ELEVATION_DEG.
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

VIEW_ELEVATION_DEG = 8.0
N_PROFILE = int(os.environ.get("CLAY_GD_N", "520"))
N_SEG = int(os.environ.get("CLAY_GD_SEG", "160"))

# ---------------------------------------------------------------- profile (glass width = 1)
SPHERE_C = 0.49        # sphere centre below the glass top (radius 0.5)
LOWER_SX = 0.84        # lower half of the sphere compressed along the axis: pear
NECK_R = 0.27          # neck 0.54 wide
NECK_K = 0.14          # smooth union sphere -> neck (concave flare, no saddle)
GLASS_END = 1.07       # glass ends inside the first ring
RING_R, RING_RR = 0.285, 0.05           # rings ~0.57 wide, soft pillowy rounding
RING2_R = 0.276                         # lower ring a touch narrower (reference)
RING1, RING2 = (1.020, 1.140), (1.140, 1.260)
RING_K = 0.012                           # shallow soft groove between the rings
CAP_C, CAP_A, CAP_B = 1.255, 0.155, 0.205  # dome: centre, half height, half width

# ---------------------------------------------------------------- colours
REF = ct.REFERENCE["guide"]
GLASS_HEX = os.environ.get("CLAY_GD_GLASS", "#D9DAD5")
GLASS_LIGHT_HEX = os.environ.get("CLAY_GD_GLASS_LIGHT", "#F8F5EF")
GLASS_LIGHT = float(os.environ.get("CLAY_GD_GLASS_LIGHT_W", "0.6"))
GLASS_SHADE_HEX = os.environ.get("CLAY_GD_GLASS_SHADE", "#C2BFB2")
GLASS_SHADE = float(os.environ.get("CLAY_GD_GLASS_SHADE_W", "0.0"))
TERRA_HEX = os.environ.get("CLAY_GD_TERRA", "#AE7447")
TERRA_LIGHT_HEX = os.environ.get("CLAY_GD_TERRA_LIGHT", "#EED0BE")
TERRA_LIGHT = float(os.environ.get("CLAY_GD_TERRA_LIGHT_W", "0.8"))
TERRA_DARK_HEX = os.environ.get("CLAY_GD_TERRA_DARK", "#875C56")
TERRA_DARK = float(os.environ.get("CLAY_GD_TERRA_DARK_W", "0.35"))
GRAD_DIR = (-0.55, -0.6, 0.6)   # world normal that gets the full light tint (upper left, front)
EDGE_LIFT = float(os.environ.get("CLAY_GD_EDGE_LIFT", "1.00"))
SHEEN = float(os.environ.get("CLAY_GD_SHEEN", "0.15"))
GD_FILL = os.environ.get("CLAY_GD_FILL")
GD_KEY = os.environ.get("CLAY_GD_KEY")
GD_WORLD = os.environ.get("CLAY_GD_WORLD")
GD_LOW = os.environ.get("CLAY_GD_LOW", "#B4AA9E")
GD_RIM = os.environ.get("CLAY_GD_RIM")


# ---------------------------------------------------------------- helpers (from protocol_injection.py)
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
    rr = np.linspace(0, 0.6, 3001)
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



def glass_sdf(x, r):
    sx = np.where(x > SPHERE_C, LOWER_SX, 1.0)
    s = np.hypot((x - SPHERE_C) / sx, r) - 0.5
    neck = _rbox(x, r, 0.70, GLASS_END + 0.2, NECK_R, 0.0)
    d = _smin(s, neck, NECK_K)
    return _smax(d, x - GLASS_END, 0.004)


def base_sdf(x, r):
    r1 = _rbox(x, r, *RING1, RING_R, RING_RR)
    r2 = _rbox(x, r, *RING2, RING2_R, RING_RR)
    cap = (np.hypot((x - CAP_C) / CAP_A, r / CAP_B) - 1.0) * min(CAP_A, CAP_B)
    d = _smin(r1, r2, RING_K)
    return _smin(d, cap, 0.02)


def _material(name, hex_color):
    mat = ct.clay(name, hex_color)
    nt = mat.node_tree
    nt.nodes["EdgeMix"].inputs["B"].default_value = ct.srgb_hex_to_linear(ct._lighter_hex(hex_color, EDGE_LIFT))
    nt.nodes["Principled BSDF"].inputs["Sheen Weight"].default_value = SHEEN
    return mat


def _gradient(mat, stops):
    """Mix the base colour toward stop colours by the normal's dot with GRAD_DIR."""
    nt = mat.node_tree
    bsdf = nt.nodes["Principled BSDF"]
    prev = bsdf.inputs["Base Color"].links[0].from_socket
    geo = nt.nodes.new("ShaderNodeNewGeometry")
    dot = nt.nodes.new("ShaderNodeVectorMath")
    dot.operation = "DOT_PRODUCT"
    v = np.array(GRAD_DIR)
    dot.inputs[1].default_value = tuple(v / np.linalg.norm(v))
    nt.links.new(geo.outputs["Normal"], dot.inputs[0])
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
    cols = {"Glass": (1, 0, 0, 1), "Base": (0, 0, 1, 1)}
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
    out_dir = argv[0] if argv else os.path.join(os.path.dirname(HERE), "out", "guide")
    os.makedirs(out_dir, exist_ok=True)
    ct.reset_scene()

    glass = revolve("Glass", trace_profile(glass_sdf, 0.0, GLASS_END, N_PROFILE), N_SEG)
    base = revolve("Base", trace_profile(base_sdf, RING1[0], CAP_C + CAP_A, N_PROFILE // 2), N_SEG)
    objs = [glass, base]
    # profile axis +X (downward) -> world -Z; then tilt for the view elevation
    M = (Matrix.Rotation(math.radians(VIEW_ELEVATION_DEG - ct.CAM_ELEVATION_DEG), 4, "X")
         @ Matrix.Rotation(math.radians(90), 4, "Y"))
    for o in objs:
        o.data.shade_smooth()
        o.matrix_world = M
    bpy.context.view_layer.update()

    glass.data.materials.append(_gradient(_material("ClayGlass", GLASS_HEX),
                                          ((0.1, 0.9, GLASS_LIGHT_HEX, GLASS_LIGHT),
                                           (0.45, -0.7, GLASS_SHADE_HEX, GLASS_SHADE))))
    base.data.materials.append(_gradient(_material("ClayTerracotta", TERRA_HEX),
                                         ((0.1, 0.9, TERRA_LIGHT_HEX, TERRA_LIGHT),
                                          (0.3, -0.6, TERRA_DARK_HEX, TERRA_DARK))))

    ct.setup_scene(objs)
    wnt = bpy.context.scene.world.node_tree
    if GD_FILL is not None and bpy.data.objects.get("Fill"):
        bpy.data.objects["Fill"].data.energy = float(GD_FILL)
    if GD_KEY is not None:
        bpy.data.objects["Key"].data.energy = float(GD_KEY)
    if GD_RIM is not None:
        bpy.data.objects["Rim"].data.energy = float(GD_RIM)
    if GD_WORLD is not None:
        wnt.nodes["Background"].inputs["Strength"].default_value = float(GD_WORLD)
    if GD_LOW is not None:
        ramp = next(n for n in wnt.nodes if n.type == "VALTORGB")
        ramp.color_ramp.elements[0].color = ct.srgb_hex_to_linear(GD_LOW)
    ct.print_poly_counts(objs)
    print("POLYS total", sum(len(o.data.polygons) for o in objs))

    if os.environ.get("CLAY_PART_MASK"):
        _mask(objs)
        bpy.context.scene.cycles.samples = 1
        bpy.context.scene.cycles.use_denoising = False
        ct.render(os.path.join(out_dir, "part-mask.png"))
        return
    t = ct.render(os.path.join(out_dir, "guide.png"))
    if not os.environ.get("CLAY_NO_BLEND"):
        ct.save_blend(os.path.join(out_dir, "guide.blend"))
    print("TIMES", {"guide": round(t, 1)})


main()
