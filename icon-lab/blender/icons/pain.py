"""Icon #12 pain: a featureless cream clay head (bust) with the pain painted into its
surface (one soft radial coral glow at the temple) and three flat coral throb strokes.

Geometry only; the look comes from clay_theme (theme untouched, icon-level light
overrides only). Run: Blender -b --factory-startup --python icons/pain.py -- <out_dir>

Head: implicit body of revolution (radius profile = smooth max of egg head, neck and
domed foot -> soft fillets) smooth-unioned with two ellipsoid ears. Mesh: each vertex
lies on a ray from the vertical axis (fan from below in the foot, horizontal in the
middle, fan from above for the crown) and is placed on the surface by bisection on the
implicit's sign (exact, also in the concave fillets). Rows are spaced by arc length;
columns are denser toward the ears.
Pain mark: no object, only the head's base colour (before the clay shading gradient):
one radial glow with a Gaussian-like falloff (object-space distance). No displacement,
no emission.
Strokes: round-ended capsules flattened along the view, matte, normals bent toward the
camera so they shade almost flat.
Units: head width (no ears) = 1.0, chin at z = 0, crown at z = 1.10.
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

VIEW_ELEVATION_DEG = 8.0
ROWS = int(os.environ.get("CLAY_PN_ROWS", "260"))
COLS = int(os.environ.get("CLAY_PN_COLS", "144"))

# ---------------------------------------------------------------- head and bust
HEAD_H = 1.15
HEAD_ZC = HEAD_H / 2
HEAD_P = float(os.environ.get("CLAY_PN_HEAD_P", "2.3"))    # superellipse exponent, cranium
HEAD_P_LO = float(os.environ.get("CLAY_PN_HEAD_P_LO", "2.5"))  # cheeks -> jaw -> chin: round taper
HEAD_K = float(os.environ.get("CLAY_PN_HEAD_K", "0.12"))   # egg asymmetry: widest above the middle
DEPTH = 0.95                  # head depth / width
NECK_R = 0.21                 # neck width 0.42
NECK_VIS = 0.12               # visible neck below the chin
FILLET_NECK = 0.08
SH_R = 0.775                  # shoulders: total width 1.55
SH_DEPTH = 0.42               # shoulder depth / width
SH_TOP = -0.05                # dome top on the axis (the neck fillet hides it)
SH_WIDE = -0.36               # widest at the shoulder tips
Z_BOT = -NECK_VIS - 0.30      # flat horizontal cut
SH_EDGE = 0.08                # rounding of the bottom edge
SH_P = float(os.environ.get("CLAY_PN_SH_P", "1.7"))                   # dome exponent: gently sloping, rounded shoulders
FILLET_SH = 0.07
# ears: flattened oval in a local frame (flared 30 deg outward-forward, tilted back 10 deg)
EAR_ZC = 0.48 * HEAD_H
EAR_HALF = (0.034, 0.068, 0.13)       # thickness, width, height (half extents)
EAR_FLARE, EAR_TILT = 38.0, 10.0
EAR_OUT = 0.028                       # centre beyond the head side
EAR_K = 0.03                          # fillet into the head
EAR_TOP_WIDER = 0.15
EAR_DENT = (0.030, 0.046, 0.092)      # concha hollow (rim ridge left along back and top)
EAR_DENT_SHIFT = (0.050, -0.012, 0.004)   # dent centre: n (outward), t (back), z
EAR_DENT_K = 0.012


def _egg_unit(u):
    """Radius factor along u in [-1, 1] (chin .. crown); max normalised to 1."""
    p = np.where(u < 0, HEAD_P_LO, HEAD_P)
    w = np.clip(1 - np.abs(u) ** p, 0, 1) ** (1 / p) * (1 + HEAD_K * u)
    return w


_uu = np.linspace(-1, 1, 4001)
EGG_MAX = _egg_unit(_uu).max()
EGG_WIDEST = (_uu[_egg_unit(_uu).argmax()] + 1) / 2


def _smax(a, b, k):
    h = np.clip(0.5 + 0.5 * (a - b) / k, 0, 1)
    return b * (1 - h) + a * h + k * h * (1 - h)


def _smin(a, b, k):
    h = np.clip(0.5 + 0.5 * (b - a) / k, 0, 1)
    return b * (1 - h) + a * h - k * h * (1 - h)


def r_head(z):
    u = (z - HEAD_ZC) / HEAD_ZC
    return np.where(np.abs(u) <= 1, 0.5 * _egg_unit(np.clip(u, -1, 1)) / EGG_MAX, -0.3)


def r_headneck(z):
    r_neck = np.where((z > Z_BOT) & (z < 0.25), NECK_R, -0.3)
    return _smax(r_head(z), r_neck, FILLET_NECK)


def r_shoulders(z):
    up = SH_R * np.clip(1 - np.clip((z - SH_WIDE) / (SH_TOP - SH_WIDE), 0, 1) ** SH_P, 0, 1) ** (1 / SH_P)
    zc = Z_BOT + SH_EDGE
    low = SH_R - SH_EDGE + np.sqrt(np.clip(SH_EDGE ** 2 - (zc - z) ** 2, 0, None))
    r = np.where(z > SH_WIDE, up, np.where(z > zc, SH_R, low))
    return np.where((z < Z_BOT) | (z > SH_TOP), -0.3, r)


def _ear_frames():
    out = []
    for sx in (-1, 1):
        fl, tl = math.radians(EAR_FLARE), math.radians(EAR_TILT)
        n = np.array([sx * math.cos(fl), -math.sin(fl), 0.0])
        zt = np.array([0.0, math.sin(tl), math.cos(tl)])      # tilted back
        zt -= zt @ n * n
        zt /= np.linalg.norm(zt)
        t = np.cross(zt, n)
        if t[1] < 0:
            t = -t                                            # t points back
        rs = float(r_head(np.array([EAR_ZC])))
        c = np.array([sx * (rs + EAR_OUT), 0.04, EAR_ZC])
        out.append((c, n, t, zt))
    return out


EAR_FRAMES = _ear_frames()


def ear_f(P):
    d = None
    for c, n, t, zt in EAR_FRAMES:
        q = P - c
        a, b, h = q @ n, q @ t, q @ zt
        wt = EAR_HALF[1] * (1 + EAR_TOP_WIDER * np.clip(h / EAR_HALF[2], -1, 1))
        e = (np.sqrt((a / EAR_HALF[0]) ** 2 + (b / wt) ** 2 + (h / EAR_HALF[2]) ** 2) - 1) * EAR_HALF[0]
        a2, b2, h2 = a - EAR_DENT_SHIFT[0], b - EAR_DENT_SHIFT[1], h - EAR_DENT_SHIFT[2]
        dent = (np.sqrt((a2 / EAR_DENT[0]) ** 2 + (b2 / EAR_DENT[1]) ** 2 + (h2 / EAR_DENT[2]) ** 2) - 1) * EAR_DENT[0]
        e = _smax(e, -dent, EAR_DENT_K)
        d = e if d is None else np.minimum(d, e)
    return d


def head_f(P):
    """Signed implicit (approx. distance near the sides): < 0 inside."""
    x, y, z = P[..., 0], P[..., 1], P[..., 2]
    d = np.sqrt(x * x + (y / DEPTH) ** 2) - r_headneck(z)
    ds = np.sqrt(x * x + (y / SH_DEPTH) ** 2) - r_shoulders(z)
    d = _smin(d, ds, FILLET_SH)
    d = np.where(z < Z_BOT, np.maximum(d, Z_BOT - z), d)
    return _smin(d, ear_f(P), EAR_K)


Z_FAN_LO = Z_BOT + 0.06
Z_FAN_HI = 0.84


def _ray(t, th):
    """Path parameter t in [0, 3]: 0..1 bottom fan, 1..2 axis, 2..3 top fan.
    Returns origin (n, 3) and direction (n, 3) for angles th."""
    t = np.asarray(t, float)
    th = np.asarray(th, float)
    c, s = np.cos(th), np.sin(th)
    O = np.zeros(t.shape + (3,))
    D = np.zeros(t.shape + (3,))
    b = t < 1
    m = (t >= 1) & (t <= 2)
    a = t > 2
    phi = np.where(b, t * math.pi / 2, np.where(a, (t - 2) * math.pi / 2, 0.0))
    O[..., 2] = np.where(b, Z_FAN_LO, np.where(a, Z_FAN_HI, Z_FAN_LO + (t - 1) * (Z_FAN_HI - Z_FAN_LO)))
    horiz = np.where(b, np.sin(phi), np.where(a, np.cos(phi), 1.0))
    vert = np.where(b, -np.cos(phi), np.where(a, np.sin(phi), 0.0))
    D[..., 0] = horiz * c
    D[..., 1] = horiz * s
    D[..., 2] = vert
    return O, D


def _bisect(f, O, D, hi, n=46):
    lo = np.zeros(O.shape[:-1])
    hi = np.full(O.shape[:-1], hi)
    for _ in range(n):
        mid = (lo + hi) / 2
        ins = f(O + D * mid[..., None]) < 0
        lo = np.where(ins, mid, lo)
        hi = np.where(ins, hi, mid)
    return O + D * ((lo + hi) / 2)[..., None]


def make_head():
    # rows by arc length along the ear-free profile (theta = 90 deg)
    td = np.linspace(0, 3, 3001)
    seg = 0
    for th in (0.0, math.pi / 2):          # x profile (ears, shoulders) + y profile
        O, D = _ray(td, np.full_like(td, th))
        Pd = _bisect(head_f, O, D, 1.2)
        seg = seg + np.linalg.norm(np.diff(Pd, axis=0), axis=1)
    L = np.concatenate([[0], np.cumsum(seg)])
    T = np.interp(np.linspace(0, L[-1], ROWS + 1), L, td)[1:-1]   # poles separate
    ph = np.linspace(0, 2 * math.pi, COLS, endpoint=False)
    TH = ph - 0.55 * np.sin(2 * ph) / 2          # denser toward +-x (ears)
    TT, HH = np.meshgrid(T, TH, indexing="ij")
    O, D = _ray(TT, HH)
    V = _bisect(head_f, O, D, 1.2)
    pb = _bisect(head_f, np.array([[0, 0, Z_FAN_LO]]), np.array([[0, 0, -1.0]]), 1.0)[0]
    pt = _bisect(head_f, np.array([[0, 0, Z_FAN_HI]]), np.array([[0, 0, 1.0]]), 1.0)[0]
    bm = bmesh.new()
    rows = [[bm.verts.new(tuple(V[i, j])) for j in range(COLS)] for i in range(len(T))]
    for i in range(len(rows) - 1):
        ra, rb = rows[i], rows[i + 1]
        for j in range(COLS):
            bm.faces.new((ra[j], ra[(j + 1) % COLS], rb[(j + 1) % COLS], rb[j]))
    vb, vt = bm.verts.new(tuple(pb)), bm.verts.new(tuple(pt))
    for j in range(COLS):
        bm.faces.new((vb, rows[0][(j + 1) % COLS], rows[0][j]))
        bm.faces.new((vt, rows[-1][j], rows[-1][(j + 1) % COLS]))
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces[:])
    return _obj("Head", bm, 1)


def _obj(name, bm, subd):
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    me.shade_smooth()
    obj = bpy.data.objects.new(name, me)
    bpy.context.scene.collection.objects.link(obj)
    if subd:
        mod = obj.modifiers.new("Subd", "SUBSURF")
        mod.levels = 1
        mod.render_levels = subd
    return obj


# ---------------------------------------------------------------- painted pain mark
# No object: glow and a soft 7-point star are painted into the head material.
MARK_XZ = (0.36, HEAD_ZC + 0.30)
GLOW_R = 0.32                  # fully cream here
GLOW_HALF = 0.16               # half strength (Gaussian-like falloff)
MARK_FACE_CAM = 2.5            # projection plane turned toward the camera (star reads frontal)
VIEW_DIR = np.array([0.0, -math.cos(math.radians(VIEW_ELEVATION_DEG)), math.sin(math.radians(VIEW_ELEVATION_DEG))])
SCREEN_UP = np.array([0.0, math.sin(math.radians(VIEW_ELEVATION_DEG)), math.cos(math.radians(VIEW_ELEVATION_DEG))])


def _grad(f, P, e=1e-4):
    g = np.zeros_like(P)
    for i in range(3):
        d = np.zeros(3)
        d[i] = e
        g[..., i] = (f(P + d) - f(P - d)) / (2 * e)
    return g / np.linalg.norm(g, axis=-1, keepdims=True)


def mark_frame():
    """Surface point C at MARK_XZ, projection normal ns, in-plane axes e1 (right), e2 (up)."""
    x, z = MARK_XZ
    C = _bisect(head_f, np.array([[x, 0.0, z]]), np.array([[0, -1.0, 0]]), 1.0)[0]
    n = _grad(head_f, C[None])[0]
    ns = n + MARK_FACE_CAM * VIEW_DIR
    ns /= np.linalg.norm(ns)
    e2 = SCREEN_UP - SCREEN_UP @ ns * ns
    e2 /= np.linalg.norm(e2)
    e1 = np.cross(e2, ns)
    return C, ns, e1, e2


# ---------------------------------------------------------------- rays
RAY_ANGLES = (20.0, 45.0, 70.0)
RAY_LENGTHS = (0.13, 0.13, 0.13)      # end to end
RAY_R1, RAY_R2 = 0.0275, 0.0275       # thickness 0.055, round ends
RAY_GAP = 0.08                        # beyond the star's tips
RAY_FLAT = float(os.environ.get("CLAY_PN_RAY_FLAT", "0.30"))   # depth / width: flat strokes


def _round_cone(P, a, b, r1, r2):
    ba = b - a
    l2 = ba @ ba
    rr = r1 - r2
    a2 = l2 - rr * rr
    il2 = 1.0 / l2
    pa = P - a
    y = pa @ ba
    z = y - l2
    xv = pa * l2 - ba[None, :] * y[:, None]
    x2 = (xv * xv).sum(1)
    y2 = y * y * l2
    z2 = z * z * l2
    k = np.sign(rr) * rr * rr * x2
    d1 = np.sqrt(x2 + z2) * il2 - r2
    d2 = np.sqrt(x2 + y2) * il2 - r1
    d3 = (np.sqrt(x2 * a2 * il2) + y * rr) * il2 - r1
    return np.where(np.sign(z) * a2 * z2 > k, d1, np.where(np.sign(y) * a2 * y2 < k, d2, d3))


def make_rays(centre):
    right = np.array([1.0, 0.0, 0.0])
    objs = []
    for i, (ang, L) in enumerate(zip(RAY_ANGLES, RAY_LENGTHS)):
        d = math.cos(math.radians(ang)) * right + math.sin(math.radians(ang)) * SCREEN_UP
        s0 = 0.17 + RAY_GAP   # unchanged stroke positions (former core radius)
        a = centre + d * (s0 + RAY_R1)
        b = centre + d * (s0 + L - RAY_R2)
        m = (a + b) / 2
        bm = bmesh.new()
        bmesh.ops.create_cube(bm, size=2.0)
        bmesh.ops.subdivide_edges(bm, edges=bm.edges[:], cuts=12, use_grid_fill=True)
        Dl = np.array([v.co for v in bm.verts])
        Dl /= np.linalg.norm(Dl, axis=1)[:, None]
        # local frame: x along the ray axis
        ax = d
        ay = VIEW_DIR
        az = np.cross(ax, ay)
        Dw = Dl[:, :1] * ax * 1.0 + Dl[:, 1:2] * ay + Dl[:, 2:3] * az
        Dw /= np.linalg.norm(Dw, axis=1)[:, None]
        P = _bisect(lambda X: _round_cone(X.reshape(-1, 3), a, b, RAY_R1, RAY_R2).reshape(X.shape[:-1]),
                    np.tile(m, (len(Dw), 1)), Dw, 0.2)
        # flatten along the view: a drawn stroke, not a capsule
        P = P - (1 - RAY_FLAT) * ((P - m) @ VIEW_DIR)[:, None] * VIEW_DIR
        for v, co in zip(bm.verts, P):
            v.co = co
        objs.append(_obj(f"Ray{i + 1}", bm, 1))
    return objs


# ---------------------------------------------------------------- colours
REF = ct.REFERENCE["pain"]
HEAD_HEX = os.environ.get("CLAY_PN_HEAD", "#F1EDE7")
RAY_HEX = os.environ.get("CLAY_PN_RAY", "#F4927F")
RAY_FLAT_SHADE = float(os.environ.get("CLAY_PN_RAY_FLATSHADE", "0.85"))   # normal bent toward the camera
GLOW_HEX = os.environ.get("CLAY_PN_GLOW", "#FA7F66")   # hot centre
EDGE_LIFT = float(os.environ.get("CLAY_PN_EDGE_LIFT", "1.00"))
HEAD_SHEEN = float(os.environ.get("CLAY_PN_SHEEN", "0.10"))
GRAD_DIR = (-0.6, -0.45, 0.65)
HEAD_SHADE_HEX = os.environ.get("CLAY_PN_SHADE", "#A99C91")
HEAD_SHADE = float(os.environ.get("CLAY_PN_SHADE_W", "0.55"))
PN_FILL = os.environ.get("CLAY_PN_FILL", "25")
PN_KEY = os.environ.get("CLAY_PN_KEY")
PN_LOW = os.environ.get("CLAY_PN_LOW", "#9C948E")


def _cream(name, hex_color):
    mat = ct.clay(name, hex_color)
    nt = mat.node_tree
    nt.nodes["EdgeMix"].inputs["B"].default_value = ct.srgb_hex_to_linear(ct._lighter_hex(hex_color, EDGE_LIFT))
    nt.nodes["Principled BSDF"].inputs["Sheen Weight"].default_value = HEAD_SHEEN
    return mat


def _node(nt, kind, op=None, **inputs):
    n = nt.nodes.new(kind)
    if op:
        n.operation = op
    for k, v in inputs.items():
        n.inputs[int(k[1:])].default_value = v
    return n


def _paint(mat, C, e1, e2):
    """One soft radial coral glow painted into the base colour (before the shading
    gradient): Gaussian falloff, half strength at GLOW_HALF, shifted to 0 at GLOW_R."""
    nt = mat.node_tree
    bsdf = nt.nodes["Principled BSDF"]
    L = nt.links
    src = bsdf.inputs["Base Color"].links[0].from_socket
    tc = nt.nodes.new("ShaderNodeTexCoord")
    dist = _node(nt, "ShaderNodeVectorMath", "DISTANCE", i1=tuple(C))
    L.new(tc.outputs["Object"], dist.inputs[0])
    sigma = GLOW_HALF / math.sqrt(math.log(2))
    g0 = math.exp(-(GLOW_R / sigma) ** 2)
    q = _node(nt, "ShaderNodeMath", "DIVIDE", i1=sigma)
    L.new(dist.outputs["Value"], q.inputs[0])
    sq = _node(nt, "ShaderNodeMath", "MULTIPLY")
    L.new(q.outputs["Value"], sq.inputs[0])
    L.new(q.outputs["Value"], sq.inputs[1])
    neg = _node(nt, "ShaderNodeMath", "MULTIPLY", i1=-1.0)
    L.new(sq.outputs["Value"], neg.inputs[0])
    ex = _node(nt, "ShaderNodeMath", "EXPONENT")
    L.new(neg.outputs["Value"], ex.inputs[0])
    fac = _node(nt, "ShaderNodeMath", "MULTIPLY_ADD", i1=1 / (1 - g0), i2=-g0 / (1 - g0))
    fac.use_clamp = True
    L.new(ex.outputs["Value"], fac.inputs[0])
    mix = nt.nodes.new("ShaderNodeMix")
    mix.data_type = "RGBA"
    mix.inputs["B"].default_value = ct.srgb_hex_to_linear(GLOW_HEX)
    L.new(fac.outputs["Value"], mix.inputs["Factor"])
    L.new(src, mix.inputs["A"])
    L.new(mix.outputs["Result"], bsdf.inputs["Base Color"])
    return mat


def _stroke(name, hex_color):
    """Coral for the throb strokes: matte, no specular/sheen, normal bent toward the camera."""
    mat = ct.clay(name, hex_color, sss_weight=0.0)
    nt = mat.node_tree
    b = nt.nodes["Principled BSDF"]
    b.inputs["Specular IOR Level"].default_value = 0.0
    b.inputs["Sheen Weight"].default_value = 0.0
    b.inputs["Roughness"].default_value = 1.0
    nt.nodes["EdgeMix"].inputs["B"].default_value = ct.srgb_hex_to_linear(hex_color)
    geo = nt.nodes.new("ShaderNodeNewGeometry")
    mix = _node(nt, "ShaderNodeMix")
    mix.data_type = "VECTOR"
    mix.inputs["Factor"].default_value = RAY_FLAT_SHADE
    # camera direction in world space (group is tilted to the theme camera)
    el = math.radians(ct.CAM_ELEVATION_DEG)
    mix.inputs[5].default_value = (0.0, -math.cos(el), math.sin(el))
    L = nt.links
    L.new(geo.outputs["Normal"], mix.inputs[4])
    nrm = _node(nt, "ShaderNodeVectorMath", "NORMALIZE")
    L.new(mix.outputs[1], nrm.inputs[0])
    L.new(nrm.outputs["Vector"], b.inputs["Normal"])
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
    for o in objs:
        col = (1, 0, 0, 1) if o.name == "Head" else (0, 0, 1, 1)
        mat = bpy.data.materials.new("Mask" + o.name)
        mat.use_nodes = True
        nt = mat.node_tree
        nt.nodes.clear()
        out = nt.nodes.new("ShaderNodeOutputMaterial")
        em = nt.nodes.new("ShaderNodeEmission")
        em.inputs["Color"].default_value = col
        nt.links.new(em.outputs["Emission"], out.inputs["Surface"])
        o.data.materials.clear()
        o.data.materials.append(mat)


def main():
    argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    out_dir = argv[0] if argv else os.path.join(os.path.dirname(HERE), "out", "pain")
    os.makedirs(out_dir, exist_ok=True)
    ct.reset_scene()
    print(f"HEAD widest at {EGG_WIDEST:.2f} of the height")

    head = make_head()
    C, ns, e1, e2 = mark_frame()
    print("MARK centre", C.round(3), "normal", ns.round(3))
    rays = make_rays(C)
    objs = [head] + rays
    tilt = Matrix.Rotation(math.radians(VIEW_ELEVATION_DEG - ct.CAM_ELEVATION_DEG), 4, "X")
    for o in objs:
        o.matrix_world = tilt
    bpy.context.view_layer.update()

    head.data.materials.append(_gradient(_paint(_cream("ClayHead", HEAD_HEX), C, e1, e2),
                                         ((0.55, -0.7, HEAD_SHADE_HEX, HEAD_SHADE),)))
    coral = _stroke("ClayStroke", RAY_HEX)
    for o in rays:
        o.data.materials.append(coral)

    ct.setup_scene(objs)
    wnt = bpy.context.scene.world.node_tree
    if PN_FILL is not None and bpy.data.objects.get("Fill"):
        bpy.data.objects["Fill"].data.energy = float(PN_FILL)
    if PN_KEY is not None:
        bpy.data.objects["Key"].data.energy = float(PN_KEY)
    if PN_LOW is not None:
        ramp = next(n for n in wnt.nodes if n.type == "VALTORGB")
        ramp.color_ramp.elements[0].color = ct.srgb_hex_to_linear(PN_LOW)
    ct.print_poly_counts(objs)
    print("POLYS total", sum(len(o.data.polygons) * (4 if o.modifiers else 1) for o in objs))

    if os.environ.get("CLAY_PART_MASK"):
        _mask(objs)
        bpy.context.scene.cycles.samples = 1
        bpy.context.scene.cycles.use_denoising = False
        ct.render(os.path.join(out_dir, "part-mask.png"))
        return
    t = ct.render(os.path.join(out_dir, "pain.png"))
    if not os.environ.get("CLAY_NO_BLEND"):
        ct.save_blend(os.path.join(out_dir, "pain.blend"))
    print("TIMES", {"pain": round(t, 1)})


main()
