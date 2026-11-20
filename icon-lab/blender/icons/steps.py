"""Icon #10 steps, version 2: a plump clay running shoe after tuki-clay-running.png
(CC0), in the colours of refs/steps.png. Version 1 is kept as icons/steps_v1.py.

Geometry only; the look comes from clay_theme (theme untouched, icon-level overrides
only). Run: Blender -b --factory-startup --python icons/steps.py -- <out_dir>

Construction: every part is a separate convex-ish piece that touches its neighbours
(SDF projection fails in concave regions), so visible concave transitions are contact
creases. Implicit parts (midsole, lugs, upper, toe cap, heel counter, tongue): cube
start mesh, Newton projection, voxel remesh, project, remesh, project. Tube parts
(collar roll, laces): swept elliptic tubes built directly as meshes (no projection).
Units: shoe length heel->toe = 1.0. Object space: X heel(0) -> toe(1), Y width
(-Y faces the camera), Z up.
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

VOXEL = float(os.environ.get("CLAY_STEPS_VOXEL", "0.006"))

# ------------------------------------------------------------ shape params
# Landmarks (correction round): tuki model, length 1.0, height 1/1.76 = 0.568 (pad bottom z 0).
# midsole: bottom (above the pads) and top heel -> toe
SOLE_BOT_PTS = ((0.0, 0.065), (0.15, 0.042), (0.40, 0.046), (0.70, 0.040), (0.90, 0.048), (1.0, 0.075))
SOLE_TOP_PTS = ((0.0, 0.227), (0.12, 0.226), (0.50, 0.170), (0.80, 0.150), (1.0, 0.142))
SOLE_HW = 0.172
SOLE_WAIST = 0.018
SOLE_TOE_NARROW = 0.055
SOLE_R2D = 0.14
SOLE_EDGE = 0.045
SOLE_BULGE = 0.02
# pads: (x centre, half length); thin flat band, open gap under the arch
LUGS = ((0.095, 0.062), (0.25, 0.077), (0.54, 0.057), (0.695, 0.062), (0.84, 0.057))
LUG_H = 0.013          # half height
LUG_EXP = 4.0
# upper: absolute top line heel -> toe; collar dip, rising instep under the tongue, low toe
UP_TOP_PTS = ((0.0, 0.53), (0.12, 0.535), (0.20, 0.49), (0.29, 0.405), (0.38, 0.425), (0.46, 0.45),
              (0.51, 0.44), (0.58, 0.375), (0.63, 0.335), (0.68, 0.30), (0.78, 0.262),
              (0.88, 0.245), (1.0, 0.235))
UP_HW = 0.150
UP_HW_TOE = 0.112
UP_WAIST = 0.008
UP_EXP = 2.6
UP_CAP_EXP = 2.0
UP_BULGE_AT = 0.35
UP_HEEL = (0.215, 0.15)   # heel cap start x, radius (back at 0.065)
HEEL_LEAN_DEG = 4.0
UP_TOE = (0.84, 0.15)     # toe cap start x, radius (tip at 0.99)
# collar opening (ellipse in x-y), lining dip, rolled padding
COLLAR_C = (0.245, 0.0)
COLLAR_AB = (0.13, 0.085)
COLLAR_DEPTH = 0.035
COLLAR_R = (0.026, 0.026)   # roll radius: along surface normal, across
COLLAR_TILT = 0.0
# tongue: wide soft flap (~0.16 wide at the base), leaning back, top = highest point (0.42, 0.568)
TONGUE_C = (0.43, 0.0, 0.475)
TONGUE_ABC = (0.085, 0.075, 0.10)
TONGUE_TILT = 22.0
# laces: four horizontal pills stacked down the instep with gaps between them
LACE_X = (0.52, 0.57, 0.62, 0.672)   # centres
LACE_PILL_DEG = 10.0
LACE_LEN = 0.11
LACE_R = 0.017
LACE_YS = (-0.085, 0.015)            # rear end near side -> front end toward the top centre
# heel counter and toe cap: thin shells over the upper inside a side-view region
HEEL_REGION = (0.24, 0.358, 0.10)    # x max, z max, corner radius
SHELL_T = 0.006
TOE_T = 0.006
TOE_LINE = (0.60, 0.20, 0.45)        # seam: x at z, lean dx/dz (passes 0.57 at z 0.267)

YAW_DEG = 5.0
VIEW_ELEVATION_DEG = 8.0

REF = ct.REFERENCE["steps"]
CREAM_HEX = os.environ.get("CLAY_STEPS_CREAM", "#E4E2DB")
LIGHT_HEX = os.environ.get("CLAY_STEPS_LIGHT", "#E7E4DE")     # collar, laces
LINING_HEX = os.environ.get("CLAY_STEPS_LINING", "#F1ECE5")
SAND_HEX = os.environ.get("CLAY_STEPS_SAND", "#E2CEBA")
LUG_HEX = os.environ.get("CLAY_STEPS_LUG", "#A07B52")
TAN_HEX = os.environ.get("CLAY_STEPS_TAN", "#B58E5D")
TAN_LIGHT_HEX = os.environ.get("CLAY_STEPS_TAN_LIGHT", "#D0AE97")
TAN_DARK_HEX = os.environ.get("CLAY_STEPS_TAN_DARK", "#A87C3C")
TAN_DIR = (-0.5, -0.2, 0.85)
CREAM_EDGE_LIFT = 1.0
CREAM_SHEEN = 0.0
CREAM_SPECULAR = 0.12
ST_FILL = os.environ.get("CLAY_ST_FILL", "18")
ST_KEY = os.environ.get("CLAY_ST_KEY", "40")
ST_WORLD = os.environ.get("CLAY_ST_WORLD")
KEY2_ENERGY = float(os.environ.get("CLAY_ST_KEY2", "4.4"))
KEY2_AZ_EL = (-55.0, 45.0)
ST_LOW = os.environ.get("CLAY_ST_LOW", "#B49C7E")


# ------------------------------------------------------------ profiles
def sstep(e0, e1, x):
    t = np.clip((x - e0) / (e1 - e0), 0, 1)
    return t * t * (3 - 2 * t)


def _pchip(pts, x):
    """Monotone cubic (Fritsch-Carlson) through the control points."""
    xs, ys = np.array([p[0] for p in pts]), np.array([p[1] for p in pts])
    hk = np.diff(xs)
    dk = np.diff(ys) / hk
    m = np.zeros(len(xs))
    for i in range(1, len(xs) - 1):
        if dk[i - 1] * dk[i] > 0:
            w1, w2 = 2 * hk[i] + hk[i - 1], hk[i] + 2 * hk[i - 1]
            m[i] = (w1 + w2) / (w1 / dk[i - 1] + w2 / dk[i])
    m[0], m[-1] = dk[0], dk[-1]
    x = np.clip(x, xs[0], xs[-1])
    i = np.clip(np.searchsorted(xs, x) - 1, 0, len(xs) - 2)
    t = (x - xs[i]) / hk[i]
    h00, h10 = 2 * t ** 3 - 3 * t ** 2 + 1, t ** 3 - 2 * t ** 2 + t
    h01, h11 = -2 * t ** 3 + 3 * t ** 2, t ** 3 - t ** 2
    return h00 * ys[i] + h10 * hk[i] * m[i] + h01 * ys[i + 1] + h11 * hk[i] * m[i + 1]


def z_bottom(x):
    return _pchip(SOLE_BOT_PTS, x)


def z_sole_top(x):
    return _pchip(SOLE_TOP_PTS, x)


def sole_hw(x):
    return (SOLE_HW - SOLE_WAIST * np.exp(-((x - 0.45) / 0.13) ** 2)
            - SOLE_TOE_NARROW * sstep(0.68, 1.0, x))


# ------------------------------------------------------------ SDFs
def rrect2(px, py, cx, hx, hy, r):
    qx = np.abs(px - cx) - hx + r
    qy = np.abs(py) - hy + r
    return np.hypot(np.maximum(qx, 0), np.maximum(qy, 0)) + np.minimum(np.maximum(qx, qy), 0) - r


def rinter(ds, r):
    """Rounded intersection of signed distances (rounding radius r)."""
    q = [d + r for d in ds]
    out = np.sqrt(sum(np.maximum(d, 0) ** 2 for d in q))
    return out + np.minimum(np.maximum.reduce(q), 0) - r


def sole_sdf(P):
    x, y, z = P[:, 0], P[:, 1], P[:, 2]
    zb, zt = z_bottom(x), z_sole_top(x)
    zr = np.clip((z - zb) / (zt - zb), 0, 1)
    d2 = rrect2(x, y, 0.5, 0.5, sole_hw(x), SOLE_R2D) - SOLE_BULGE * 4 * zr * (1 - zr)
    return rinter([d2, zb - z, z - zt], SOLE_EDGE)


def lug_sdf_factory(xc, hl):
    zc = float(z_bottom(np.array([xc]))[0]) - LUG_H * 0.6
    sl = float((z_bottom(np.array([xc + 0.01])) - z_bottom(np.array([xc - 0.01])))[0] / 0.02)
    ang = math.atan(sl)
    ca, sa = math.cos(ang), math.sin(ang)
    hw = float(sole_hw(np.array([xc]))[0]) - 0.022

    def sdf(P):
        dx, y, dz = P[:, 0] - xc, P[:, 1], P[:, 2] - zc
        u = dx * ca + dz * sa
        w = -dx * sa + dz * ca
        n = LUG_EXP
        g = (np.abs(u) / hl) ** n + (np.abs(y) / hw) ** n + (np.abs(w) / LUG_H) ** n
        return (g ** (1 / n) - 1) * LUG_H
    return sdf, (xc - hl - 0.03, -hw - 0.03, zc - LUG_H - 0.04), (xc + hl + 0.03, hw + 0.03, zc + LUG_H + 0.04)


def h_upper(x):
    return _pchip(UP_TOP_PTS, x) - z_sole_top(x)


def upper_sdf(P):
    """Loaf: superellipse cross-section, superellipsoid caps at heel and toe."""
    x, y, z = P[:, 0], P[:, 1], P[:, 2]
    xh, rh = UP_HEEL
    xt, rt = UP_TOE
    xc = np.clip(x, xh, xt)
    H = h_upper(xc) + 0.02
    W = (UP_HW - UP_WAIST * np.exp(-((xc - 0.45) / 0.13) ** 2)
         - (UP_HW - UP_HW_TOE) * sstep(0.55, 0.9, xc))
    zs = z_sole_top(xc) - 0.02
    c = UP_BULGE_AT * H
    zp = z - zs
    t = np.where(zp > c, (zp - c) / (H - c), (c - zp) / (c / 0.48))
    lean = math.tan(math.radians(HEEL_LEAN_DEG)) * np.maximum(zp, 0)
    xe = np.maximum(xh + lean - x, 0) / rh + np.maximum(x - xt, 0) / rt
    n = UP_EXP
    g = (np.abs(y) / W) ** n + np.abs(t) ** n + xe ** UP_CAP_EXP
    d = (g ** (1 / n) - 1) * 0.12
    return np.maximum(d, z_bottom(x) + 0.03 - z)


def heel_sdf(P):
    """Heel counter: the upper inflated by SHELL_T, inside x < xm and z < zm
    (rounded corner r) in side view."""
    x, z = P[:, 0], P[:, 2]
    xm, zm, r = HEEL_REGION
    qx, qz = x - xm + r, z - zm + r
    reg = np.hypot(np.maximum(qx, 0), np.maximum(qz, 0)) + np.minimum(np.maximum(qx, qz), 0) - r
    return rinter([upper_sdf(P) - SHELL_T, reg], 0.005)


def toecap_sdf(P):
    x, z = P[:, 0], P[:, 2]
    x0, z0, lean = TOE_LINE
    reg = ((x0 - lean * (z - z0)) - x) / math.hypot(1, lean)
    return rinter([upper_sdf(P) - TOE_T, reg], 0.005)


def tongue_sdf(P):
    cx, cy, cz = TONGUE_C
    a, b, c = TONGUE_ABC
    th = math.radians(TONGUE_TILT)
    dx, dy, dz = P[:, 0] - cx, P[:, 1] - cy, P[:, 2] - cz
    u = dx * math.cos(th) + dz * math.sin(th)
    w = -dx * math.sin(th) + dz * math.cos(th)
    n = 2.4
    g = (np.abs(u) / a) ** n + (np.abs(dy) / b) ** n + (np.abs(w) / c) ** n
    return (g ** (1 / n) - 1) * a


def surface_z(sdf, x, y, zlo=0.0, zhi=0.8):
    lo = np.full(len(x), zlo)
    hi = np.full(len(x), zhi)
    for _ in range(40):
        mid = (lo + hi) / 2
        inside = sdf(np.stack([x, y, mid], 1)) < 0
        lo = np.where(inside, mid, lo)
        hi = np.where(inside, hi, mid)
    return lo


def _normals(sdf, P, e=1e-4):
    g = np.stack([sdf(P + d) - sdf(P - d) for d in np.eye(3) * e], 1)
    return g / np.linalg.norm(g, axis=1, keepdims=True)


# ------------------------------------------------------------ mesh building
def project(P, sdf, iters=16):
    e = 1e-4
    for _ in range(iters):
        f = sdf(P)
        g = np.stack([(sdf(P + d) - sdf(P - d)) for d in np.eye(3) * e], axis=1) / (2 * e)
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


def _resample(C, n, closed):
    if closed:
        C = np.vstack([C, C[:1]])
    seg = np.linalg.norm(np.diff(C, axis=0), axis=1)
    s = np.concatenate([[0], np.cumsum(seg)])
    t = np.linspace(0, s[-1], n + (1 if closed else 0))
    out = np.stack([np.interp(t, s, C[:, k]) for k in range(3)], 1)
    return (out[:-1] if closed else out), s[-1]


def sweep(name, C, N, rz, rx, closed=False, nu=96, nv=28):
    """Elliptic tube along polyline C (surface normals N): rz along N, rx across.
    Open tubes get rounded caps (radius falls off as a quarter ellipse over rx)."""
    C, _ = _resample(C, nu, closed)
    N, _ = _resample(N, nu, closed)
    if not closed:   # cosine spacing toward the ends for round caps
        idx = (1 - np.cos(np.linspace(0, math.pi, nu))) / 2 * (nu - 1)
        C = np.stack([np.interp(idx, np.arange(nu), C[:, k]) for k in range(3)], 1)
        N = np.stack([np.interp(idx, np.arange(nu), N[:, k]) for k in range(3)], 1)
        T = np.gradient(C, axis=0)
    else:
        T = np.roll(C, -1, 0) - np.roll(C, 1, 0)
    T /= np.linalg.norm(T, axis=1, keepdims=True)
    N = N - np.einsum("ij,ij->i", N, T)[:, None] * T
    N /= np.linalg.norm(N, axis=1, keepdims=True)
    B = np.cross(T, N)
    if closed:
        f = np.ones(nu)
    else:
        s = np.concatenate([[0], np.cumsum(np.linalg.norm(np.diff(C, axis=0), axis=1))])
        d = np.minimum(s, s[-1] - s) / rx
        f = np.sqrt(np.clip(1 - (1 - np.minimum(d, 1)) ** 2, 0, 1))
    bm = bmesh.new()
    rows = []
    rng = range(nu) if closed else range(1, nu - 1)
    for i in rng:
        rows.append([bm.verts.new(tuple(C[i] + f[i] * (rz * math.cos(2 * math.pi * j / nv) * N[i]
                                                         + rx * math.sin(2 * math.pi * j / nv) * B[i])))
                     for j in range(nv)])
    nr = len(rows)
    for i in range(nr if closed else nr - 1):
        a, b = rows[i], rows[(i + 1) % nr]
        for j in range(nv):
            bm.faces.new((a[j], b[j], b[(j + 1) % nv], a[(j + 1) % nv]))
    if not closed:
        p0 = bm.verts.new(tuple(C[0]))
        p1 = bm.verts.new(tuple(C[-1]))
        for j in range(nv):
            bm.faces.new((p0, rows[0][(j + 1) % nv], rows[0][j]))
            bm.faces.new((p1, rows[-1][j], rows[-1][(j + 1) % nv]))
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces[:])
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    obj = bpy.data.objects.new(name, me)
    bpy.context.scene.collection.objects.link(obj)
    mod = obj.modifiers.new("Subd", "SUBSURF")
    mod.levels = 1
    mod.render_levels = 1
    me.shade_smooth()
    return obj


def lace_pill(xc):
    """Straight horizontal pill (side-view tilt -LACE_PILL_DEG, length LACE_LEN incl. caps).
    In depth it runs from the near side (rear end, lower on the round instep) toward
    the top centre (front end), so both ends rest on the surface; the centre sits on
    the instep at y = -0.03."""
    half = LACE_LEN / 2 - LACE_R
    t = math.tan(math.radians(LACE_PILL_DEG))
    zc = float(surface_z(upper_sdf, np.array([xc]), np.array([-0.03]))[0]) + LACE_R * 0.75
    A = np.array([xc - half, LACE_YS[0], zc + t * half])
    B = np.array([xc + half, LACE_YS[1], zc - t * half])
    C = np.linspace(A, B, 24)
    return C, np.tile([0.0, 0.0, 1.0], (24, 1))


def collar_curve():
    th = np.linspace(0, 2 * math.pi, 145)[:-1]
    x = COLLAR_C[0] + COLLAR_AB[0] * np.cos(th)
    y = COLLAR_C[1] + COLLAR_AB[1] * np.sin(th)
    z = surface_z(upper_sdf, x, y)
    k = 21   # smooth the rim height around the ring (no kinks): circular moving average
    z = np.convolve(np.concatenate([z[-k:], z, z[:k]]), np.ones(k) / k, mode="same")[k:-k]
    S = np.stack([x, y, z], 1)
    N = _normals(upper_sdf, S) + np.array([0, 0, 1.0])     # roll sits on the rim, bulging up
    N /= np.linalg.norm(N, axis=1, keepdims=True)
    tilt = COLLAR_TILT * (COLLAR_C[0] - x) / COLLAR_AB[0]   # higher at the back
    return S + N * (COLLAR_R[0] * 0.35) + tilt[:, None] * np.array([0, 0, 1.0]), N


def collar_hollow(upper):
    """Lining dip inside the collar ellipse: displace the upper's top vertices down.
    Stores the dip factor as attribute 'hollow' (lining colour)."""
    me = upper.data
    P = _get_co(me)
    nrm = np.empty(len(P) * 3)
    me.vertices.foreach_get("normal", nrm)
    n = nrm.reshape(-1, 3)
    rho = np.hypot((P[:, 0] - COLLAR_C[0]) / COLLAR_AB[0], (P[:, 1] - COLLAR_C[1]) / COLLAR_AB[1])
    f = (1 - sstep(0.55, 1.0, rho)) * sstep(0.2, 0.6, n[:, 2])
    P[:, 2] -= COLLAR_DEPTH * f
    _set_co(me, P)
    me.shade_smooth()
    a = me.attributes.new("hollow", "FLOAT", "POINT")
    a.data.foreach_set("value", np.clip(f * 1.5, 0, 1))


# ------------------------------------------------------------ materials
def _gradient(mat, stops, direction):
    nt = mat.node_tree
    bsdf = nt.nodes["Principled BSDF"]
    src = bsdf.inputs["Base Color"].links[0].from_socket
    geo = nt.nodes.new("ShaderNodeNewGeometry")
    dot = nt.nodes.new("ShaderNodeVectorMath")
    dot.operation = "DOT_PRODUCT"
    v = np.array(direction)
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


def _cream(name, hexc=CREAM_HEX, hollow=False):
    mat = ct.clay(name, hexc)
    nt = mat.node_tree
    nt.nodes["EdgeMix"].inputs["B"].default_value = ct.srgb_hex_to_linear(
        ct._lighter_hex(hexc, CREAM_EDGE_LIFT))
    bsdf = nt.nodes["Principled BSDF"]
    bsdf.inputs["Sheen Weight"].default_value = CREAM_SHEEN
    bsdf.inputs["Specular IOR Level"].default_value = CREAM_SPECULAR
    if hollow:
        src = bsdf.inputs["Base Color"].links[0].from_socket
        at = nt.nodes.new("ShaderNodeAttribute")
        at.attribute_name = "hollow"
        mix = nt.nodes.new("ShaderNodeMix")
        mix.data_type = "RGBA"
        mix.inputs["B"].default_value = ct.srgb_hex_to_linear(LINING_HEX)
        nt.links.new(at.outputs["Fac"], mix.inputs["Factor"])
        nt.links.new(src, mix.inputs["A"])
        nt.links.new(mix.outputs["Result"], bsdf.inputs["Base Color"])
    return mat


def _tan():
    return _gradient(ct.clay("ClayTan", TAN_HEX),
                     ((0.2, 0.95, TAN_LIGHT_HEX, 1.0), (0.0, -0.55, TAN_DARK_HEX, 1.0)), TAN_DIR)


MASK = {"Sole": (1, 0, 0, 1), "Lug": (1, 0, 1, 1), "Heel": (1, 1, 0, 1),
        "Collar": (0, 0, 1, 1), "Lace": (0, 0, 1, 1)}   # rest (upper, toe cap, tongue): green


def _mask(objs):
    for o in objs:
        key = next((k for k in MASK if o.name.startswith(k)), None)
        mat = bpy.data.materials.new("Mask" + o.name)
        mat.use_nodes = True
        nt = mat.node_tree
        nt.nodes.clear()
        out = nt.nodes.new("ShaderNodeOutputMaterial")
        em = nt.nodes.new("ShaderNodeEmission")
        em.inputs["Color"].default_value = MASK.get(key, (0, 1, 0, 1))
        nt.links.new(em.outputs["Emission"], out.inputs["Surface"])
        o.data.materials.clear()
        o.data.materials.append(mat)


def main():
    argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    out_dir = argv[0] if argv else os.path.join(os.path.dirname(HERE), "out", "steps")
    os.makedirs(out_dir, exist_ok=True)
    ct.reset_scene()

    m = 0.03
    sole = build("Sole", sole_sdf, (-m, -SOLE_HW - m, -m), (1 + m, SOLE_HW + m, 0.25 + m), VOXEL, 0.02)
    lugs = []
    for i, (xc, hl) in enumerate(LUGS):
        sdf, lo, hi = lug_sdf_factory(xc, hl)
        lugs.append(build(f"Lug{i}", sdf, lo, hi, VOXEL, 0.012))
    xlo = UP_HEEL[0] - UP_HEEL[1] - m
    xhi = UP_TOE[0] + UP_TOE[1] + m
    upper = build("Upper", upper_sdf, (xlo, -UP_HW - m, 0.0), (xhi, UP_HW + m, 0.5), VOXEL, 0.02)
    heel = build("Heel", heel_sdf, (xlo - 0.02, -UP_HW - m - 0.02, 0.0),
                 (HEEL_REGION[0] + m, UP_HW + m + 0.02, HEEL_REGION[1] + m), VOXEL, 0.015)
    toe = None and build("ToeCap", toecap_sdf, (TOE_LINE[0] - 0.1, -UP_HW - m - 0.02, 0.0),
                (xhi + 0.02, UP_HW + m + 0.02, 0.4), VOXEL, 0.015)
    tc = np.array(TONGUE_C)
    rr = max(TONGUE_ABC) + m
    tongue = build("Tongue", tongue_sdf, tc - rr, tc + rr, VOXEL, 0.012)
    collar_hollow(upper)
    Cc, Nc = collar_curve()
    collar = sweep("Collar", Cc, Nc, COLLAR_R[0], COLLAR_R[1], closed=True, nu=160, nv=32)
    laces = []
    for i, xc in enumerate(LACE_X):
        Cl, Nl = lace_pill(xc)
        laces.append(sweep(f"Lace{i}", Cl, Nl, LACE_R, LACE_R, nu=48, nv=28))
    objs = [sole] + lugs + [upper, heel, tongue, collar] + laces   # toe cap dropped (round 2)

    # pose: yaw (toe slightly toward the viewer), view elevation, no image tilt
    M = (Matrix.Rotation(math.radians(VIEW_ELEVATION_DEG - ct.CAM_ELEVATION_DEG), 4, "X")
         @ Matrix.Rotation(math.radians(-YAW_DEG), 4, "Z")
         @ Matrix.Translation((-0.5, 0, -0.25)))
    for o in objs:
        o.matrix_world = M
    bpy.context.view_layer.update()

    for o in objs:
        o.data.materials.clear()
    sole.data.materials.append(_tan())
    lugm = ct.clay("ClayLug", LUG_HEX)
    for o in lugs:
        o.data.materials.append(lugm)
    upper.data.materials.append(_cream("ClayUpper", hollow=True))
    cmat = _cream("ClayCream")
    for o in (tongue,):
        o.data.materials.append(cmat)
    lmat = _cream("ClayLight", LIGHT_HEX)
    for o in [collar] + laces:
        o.data.materials.append(lmat)
    heel.data.materials.append(_cream("ClaySand", SAND_HEX))

    ct.setup_scene(objs)
    wnt = bpy.context.scene.world.node_tree
    if KEY2_ENERGY > 0:   # icon-level: small second key from the upper left
        P = ct._world_verts(objs)
        tgt = Vector(((P.min(0) + P.max(0)) / 2).tolist())
        k2d = bpy.data.lights.new("Key2", "AREA")
        k2d.size = 2.0
        k2d.energy = KEY2_ENERGY
        k2d.use_temperature = True
        k2d.temperature = 5600
        k2 = bpy.data.objects.new("Key2", k2d)
        bpy.context.scene.collection.objects.link(k2)
        k2.location = tgt + ct._dir_from_angles(*KEY2_AZ_EL) * 1.8
        ct._point_at(k2, tgt)
    if ST_FILL is not None and bpy.data.objects.get("Fill"):
        bpy.data.objects["Fill"].data.energy = float(ST_FILL)
    if ST_KEY is not None:
        bpy.data.objects["Key"].data.energy = float(ST_KEY)
    if ST_WORLD is not None:
        wnt.nodes["Background"].inputs["Strength"].default_value = float(ST_WORLD)
    if ST_LOW is not None:
        ramp = next(n for n in wnt.nodes if n.type == "VALTORGB")
        ramp.color_ramp.elements[0].color = ct.srgb_hex_to_linear(ST_LOW)
    dg = bpy.context.evaluated_depsgraph_get()
    for o in objs:
        print("POLYS", o.name, len(o.evaluated_get(dg).data.polygons))
    print("POLYS total", sum(len(o.evaluated_get(dg).data.polygons) for o in objs))

    if os.environ.get("CLAY_PART_MASK"):
        _mask(objs)
        bpy.context.scene.cycles.samples = 1
        bpy.context.scene.cycles.use_denoising = False
        ct.render(os.path.join(out_dir, "part-mask.png"))
        return
    t = ct.render(os.path.join(out_dir, "steps.png"))
    if not os.environ.get("CLAY_NO_BLEND"):
        ct.save_blend(os.path.join(out_dir, "steps.blend"))
    print("TIMES", {"steps": round(t, 1)})


main()
