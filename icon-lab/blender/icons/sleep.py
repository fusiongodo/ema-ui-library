"""Icon #11 sleep: a puffy clay cloud in front of a plump lilac crescent moon.

Geometry only; the look comes from clay_theme (theme untouched, icon-level light
overrides only). Run: Blender -b --factory-startup --python icons/sleep.py -- <out_dir>

Cloud: implicit surface = smooth union (polynomial smin) of ellipsoids (three lobes
plus a base body), cut flat at the bottom with a smooth max (rounded edge). The
cloud is star-shaped from an inner point, so the mesh is a quad sphere whose
vertices are moved along their rays onto the surface by bisection on the
implicit's sign: exact, also in the concave valleys (no Newton projection).
Moon: two-circle crescent (outer circle through the brief's tips and body point,
inner bowl circle through both tips), inflated in depth with a round rim; sampled
per radial plane by bisection (exact, fold-free).
Units: cloud width = 1.0, cloud bottom at z = 0, x = 0 at the cloud's left edge.
X right, Z up, Y depth (camera at -Y, "behind" = +Y).
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

VIEW_ELEVATION_DEG = 12.0
CUTS = int(os.environ.get("CLAY_CUTS", "96"))   # quad-sphere subdivisions per cube edge

# ---------------------------------------------------------------- cloud shape
# ellipsoids: centre (x, z), radii (rx, ry depth, rz)
LOBES = [
    ((0.215, 0.225), (0.195, 0.190, 0.205)),   # left lobe, peak ~ x 0.14 h 0.42
    ((0.455, 0.300), (0.260, 0.215, 0.280)),   # central lobe, peak ~ x 0.45 h 0.58
    ((0.790, 0.235), (0.170, 0.195, 0.165)),   # right lobe, peak ~ x 0.80 h 0.40
    ((0.555, 0.080), (0.455, 0.225, 0.220)),   # base body
]
SMOOTH_K = float(os.environ.get("CLAY_SL_K", "0.055"))     # valley softness
BOTTOM_K = 0.12                                           # bottom edge rounding
CLOUD_ORIGIN = np.array([0.47, 0.0, 0.24])

# ---------------------------------------------------------------- moon shape
# outer edge: circle through the upper tip, the body point and the lower tip (x, h)
MOON_OUTER_PTS = [(0.80, 0.80), (0.515, 0.605), (1.065, 0.37)]   # -> radius ~0.29, arc ~250 deg
MOON_RI = float(os.environ.get("CLAY_SL_MOON_RI", "0.30"))   # inner (bowl) circle radius through both tips
MOON_HALF_DEPTH = float(os.environ.get("CLAY_SL_MOON_HD", "0.09"))   # depth 0.18 (brief ~0.14, reference plump)
MOON_RIM = float(os.environ.get("CLAY_SL_MOON_RIM", "0.25"))   # inflation width: domed across the band
MOON_SMOOTH = 0.05      # smin of the two edge distances
MOON_Y = float(os.environ.get("CLAY_SL_MOON_Y", "0.22"))  # depth of the moon centre (behind the cloud)
# behind = higher on screen at 12 deg elevation: lower the moon so the tips stay at the brief's points
MOON_Z = -(MOON_Y - 0.10) * math.tan(math.radians(12.0))

# ---------------------------------------------------------------- colours
REF = ct.REFERENCE["sleep"]
CLOUD_HEX = os.environ.get("CLAY_SL_CLOUD", "#F1EEE8")
MOON_HEX = os.environ.get("CLAY_SL_MOON", "#8E80A6")
EDGE_LIFT = float(os.environ.get("CLAY_SL_EDGE_LIFT", "1.00"))   # cream would clip with x1.08
CLOUD_SHEEN = float(os.environ.get("CLAY_SL_SHEEN", "0.10"))
# icon-level shading gradients (normal . GRAD_DIR): (from, to, colour, weight)
GRAD_DIR = (-0.6, -0.45, 0.65)    # world normal that gets the full light tint (upper left, front)
CLOUD_SHADE_HEX = os.environ.get("CLAY_SL_CLOUD_SHADE", "#9C9490")
CLOUD_SHADE = float(os.environ.get("CLAY_SL_CLOUD_SHADE_W", "0.9"))
MOON_LIGHT_HEX = os.environ.get("CLAY_SL_MOON_LIGHT", "#C6BBDA")
MOON_DARK_HEX = os.environ.get("CLAY_SL_MOON_DARK", "#463C5E")
MOON_GRAD = float(os.environ.get("CLAY_SL_MOON_GRAD", "0.8"))
SL_FILL = os.environ.get("CLAY_SL_FILL", "25")    # theme 50 flattens the cream front
SL_KEY = os.environ.get("CLAY_SL_KEY")
SL_WORLD = os.environ.get("CLAY_SL_WORLD")
SL_LOW = os.environ.get("CLAY_SL_LOW", "#9C948E")    # warm lighter ground: beige undersides
SL_RIM = os.environ.get("CLAY_SL_RIM")


def _smin(a, b, k):
    h = np.clip(0.5 + 0.5 * (b - a) / k, 0, 1)
    return b * (1 - h) + a * h - k * h * (1 - h)


def _ellipsoid(P, c, r):
    q = (P - c) / r
    return (np.linalg.norm(q, axis=1) - 1.0) * min(r)


def cloud_sdf(P):
    d = None
    for (cx, cz), r in LOBES:
        e = _ellipsoid(P, np.array([cx, 0.0, cz]), np.array(r))
        d = e if d is None else _smin(d, e, SMOOTH_K)
    # flat bottom at z = 0 with a rounded edge: smooth max(d, -z)
    return -_smin(-d, P[:, 2], BOTTOM_K)


def make_cloud():
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=2.0)
    bmesh.ops.subdivide_edges(bm, edges=bm.edges[:], cuts=CUTS, use_grid_fill=True)
    D = np.array([v.co for v in bm.verts])
    D /= np.linalg.norm(D, axis=1)[:, None]
    lo = np.zeros(len(D))
    hi = np.full(len(D), 1.2)
    for _ in range(48):
        mid = (lo + hi) / 2
        inside = cloud_sdf(CLOUD_ORIGIN + D * mid[:, None]) < 0
        lo = np.where(inside, mid, lo)
        hi = np.where(inside, hi, mid)
    P = CLOUD_ORIGIN + D * ((lo + hi) / 2)[:, None]
    for v, co in zip(bm.verts, P):
        v.co = co
    me = bpy.data.meshes.new("Cloud")
    bm.to_mesh(me)
    bm.free()
    me.shade_smooth()
    obj = bpy.data.objects.new("Cloud", me)
    bpy.context.scene.collection.objects.link(obj)
    return obj


def _circle3(p1, p2, p3):
    (x1, y1), (x2, y2), (x3, y3) = p1, p2, p3
    A = np.array([[x2 - x1, y2 - y1], [x3 - x1, y3 - y1]]) * 2
    b = np.array([x2 ** 2 - x1 ** 2 + y2 ** 2 - y1 ** 2, x3 ** 2 - x1 ** 2 + y3 ** 2 - y1 ** 2])
    c = np.linalg.solve(A, b)
    return c, float(np.hypot(x1 - c[0], y1 - c[1]))


def make_moon(nu=160, nv=64):
    """Crescent = outer disk minus inner (bowl) disk, inflated in depth with a round rim.
    Mesh: one vertex ring per radial plane from the outer centre c; each ring vertex is
    placed on the implicit surface by bisection along its ray from the band middle."""
    c, Ro = _circle3(*MOON_OUTER_PTS)
    a = [math.atan2(y - c[1], x - c[0]) for x, y in MOON_OUTER_PTS]
    a0, a1, a2 = a
    # from the upper tip through the body point to the lower tip (counter-clockwise)
    while a1 < a0:
        a1 += 2 * math.pi
    while a2 < a1:
        a2 += 2 * math.pi
    print(f"MOON outer centre {c.round(3)}, radius {Ro:.3f}, arc {math.degrees(a2 - a0):.0f} deg")
    # inner circle (the bowl): through both tips, centre toward the upper right
    p, q = np.array(MOON_OUTER_PTS[0]), np.array(MOON_OUTER_PTS[2])
    m, ch = (p + q) / 2, q - p
    h = np.linalg.norm(ch) / 2
    n = np.array([-ch[1], ch[0]]) / (2 * h)
    if n[0] < 0:
        n = -n                                   # toward the upper right
    ci = m + n * math.sqrt(MOON_RI ** 2 - h * h)
    # radial frame centre: middle of the tip chord, inside both disks (outside the
    # crescent), so every ray meets the crescent in one interval and the radial planes
    # never cross inside it (no folds)
    cf = m
    b0 = math.atan2(p[1] - m[1], p[0] - m[0])
    body = np.array(MOON_OUTER_PTS[1]) - m
    sgn = 1 if np.cross(p - m, body) > 0 else -1
    t = (1 - np.cos(np.linspace(0, math.pi, nu))) / 2      # dense toward the tips
    ang = b0 + sgn * math.pi * t
    E = np.stack([np.cos(ang), np.sin(ang)], 1)

    def exit_rho(cc, rr):
        w = cf - cc
        bq = E @ w
        return -bq + np.sqrt(np.maximum(bq * bq - (w @ w - rr * rr), 0))
    rho_i, rho_o = exit_rho(ci, MOON_RI), exit_rho(c, Ro)
    band = np.clip(rho_o - rho_i, 0, None)
    Rc = (rho_i + rho_o) / 2
    C = np.stack([cf[0] + Rc * E[:, 0], np.full(nu, MOON_Y), cf[1] + MOON_Z + Rc * E[:, 1]], 1)
    Nn = np.stack([E[:, 0], np.zeros(nu), E[:, 1]], 1)
    print(f"MOON inner centre {ci.round(3)}, Ri {MOON_RI}, max band {band.max():.3f}")

    def inside(Q):
        """Inflated crescent: 2D inside-distance s, half depth D(s) with a round rim."""
        x, y, z = Q[..., 0] - c[0], Q[..., 1] - MOON_Y, Q[..., 2] - c[1] - MOON_Z
        # smooth min of the two edge distances: no ridge on the medial line, rounded tips
        s2 = _smin(Ro - np.hypot(x, z), np.hypot(x + c[0] - ci[0], z + c[1] - ci[1]) - MOON_RI, MOON_SMOOTH)
        u = np.clip(s2 / MOON_RIM, 0, 1)
        return (s2 > 0) & (np.abs(y) < MOON_HALF_DEPTH * np.sqrt(np.clip(1 - (1 - u) ** 2, 0, 1)))
    Y = np.array([0.0, 1.0, 0.0])
    th = 2 * math.pi * np.arange(nv) / nv
    Dir = (np.cos(th)[None, :, None] * Nn[:, None, :]
           + np.sin(th)[None, :, None] * Y[None, None, :])             # (nu, nv, 3)
    lo = np.zeros((nu, nv))
    hi = np.full((nu, nv), 0.4)
    for _ in range(40):
        mid = (lo + hi) / 2
        ins = inside(C[:, None, :] + Dir * mid[..., None])
        lo = np.where(ins, mid, lo)
        hi = np.where(ins, hi, mid)
    V = C[:, None, :] + Dir * ((lo + hi) / 2)[..., None]
    bm = bmesh.new()
    rows = [[bm.verts.new(tuple(V[i, j])) for j in range(nv)] for i in range(1, nu - 1)]
    for i in range(len(rows) - 1):
        ra, rb = rows[i], rows[i + 1]
        for j in range(nv):
            bm.faces.new((ra[j], rb[j], rb[(j + 1) % nv], ra[(j + 1) % nv]))
    p0 = bm.verts.new(tuple(C[0]))
    p1 = bm.verts.new(tuple(C[-1]))
    for j in range(nv):
        bm.faces.new((p0, rows[0][(j + 1) % nv], rows[0][j]))
        bm.faces.new((p1, rows[-1][j], rows[-1][(j + 1) % nv]))
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces[:])
    me = bpy.data.meshes.new("Moon")
    bm.to_mesh(me)
    bm.free()
    obj = bpy.data.objects.new("Moon", me)
    bpy.context.scene.collection.objects.link(obj)
    mod = obj.modifiers.new("Subd", "SUBSURF")
    mod.levels = 1
    mod.render_levels = 1
    me.shade_smooth()
    return obj


def _cream(name, hex_color):
    mat = ct.clay(name, hex_color)
    nt = mat.node_tree
    nt.nodes["EdgeMix"].inputs["B"].default_value = ct.srgb_hex_to_linear(ct._lighter_hex(hex_color, EDGE_LIFT))
    nt.nodes["Principled BSDF"].inputs["Sheen Weight"].default_value = CLOUD_SHEEN
    return mat


def _gradient(mat, stops):
    """Mix the base colour toward stop colours by the normal's dot with GRAD_DIR."""
    nt = mat.node_tree
    bsdf = nt.nodes["Principled BSDF"]
    src = bsdf.inputs["Base Color"].links[0].from_socket      # theme edge-glow mix
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
    cols = {"Cloud": (1, 0, 0, 1), "Moon": (0, 0, 1, 1)}
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
    out_dir = argv[0] if argv else os.path.join(os.path.dirname(HERE), "out", "sleep")
    os.makedirs(out_dir, exist_ok=True)
    ct.reset_scene()

    cloud = make_cloud()
    moon = make_moon()
    objs = [cloud, moon]
    # pose: group tipped back so the view onto it is VIEW_ELEVATION_DEG
    tilt = Matrix.Rotation(math.radians(VIEW_ELEVATION_DEG - ct.CAM_ELEVATION_DEG), 4, "X")
    for o in objs:
        o.matrix_world = tilt
    bpy.context.view_layer.update()

    cloud.data.materials.append(_gradient(_cream("ClayCloud", CLOUD_HEX),
                                          ((0.55, -0.7, CLOUD_SHADE_HEX, CLOUD_SHADE),)))
    moon.data.materials.append(_gradient(ct.clay("ClayMoon", MOON_HEX),
                                         ((0.2, 1.0, MOON_LIGHT_HEX, MOON_GRAD),
                                          (0.15, -0.6, MOON_DARK_HEX, 1.0))))

    ct.setup_scene(objs)
    # icon-level light overrides (theme untouched)
    wnt = bpy.context.scene.world.node_tree
    if SL_FILL is not None and bpy.data.objects.get("Fill"):
        bpy.data.objects["Fill"].data.energy = float(SL_FILL)
    if SL_KEY is not None:
        bpy.data.objects["Key"].data.energy = float(SL_KEY)
    if SL_RIM is not None:
        bpy.data.objects["Rim"].data.energy = float(SL_RIM)
    if SL_WORLD is not None:
        wnt.nodes["Background"].inputs["Strength"].default_value = float(SL_WORLD)
    if SL_LOW is not None:
        ramp = next(n for n in wnt.nodes if n.type == "VALTORGB")
        ramp.color_ramp.elements[0].color = ct.srgb_hex_to_linear(SL_LOW)
    ct.print_poly_counts(objs)
    print("POLYS total", sum(len(o.data.polygons) * (4 if o.modifiers else 1) for o in objs))

    if os.environ.get("CLAY_PART_MASK"):
        _mask(objs)
        bpy.context.scene.cycles.samples = 1
        bpy.context.scene.cycles.use_denoising = False
        ct.render(os.path.join(out_dir, "part-mask.png"))
        return
    t = ct.render(os.path.join(out_dir, "sleep.png"))
    if not os.environ.get("CLAY_NO_BLEND"):
        ct.save_blend(os.path.join(out_dir, "sleep.blend"))
    print("TIMES", {"sleep": round(t, 1)})


main()
