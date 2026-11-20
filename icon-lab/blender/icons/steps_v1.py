"""Icon #10 steps: a chunky soft clay sneaker (cream upper, tan rocker sole).

Geometry only; the look comes from clay_theme (theme untouched, icon-level overrides
only). Run: Blender -b --factory-startup --python icons/steps.py -- <out_dir>

Construction (as log_scores): every part is a convex-ish implicit surface; rough cube
start mesh, Newton projection, voxel remesh, project, remesh, project. No subdivision.
Parts are separate objects so all visible concave transitions (lace gaps, upper on
the sole) are contact creases, not projected concavities. Upper = loaf (superellipse
cross-section, smooth heel->toe height curve). The collar is only a subtle dip: a
vertex displacement of the upper's top (as protocol_pill's groove), slightly darkened.
(Round 1's collar roll helpers collar_curve/_torus_start are unused.)
Units: shoe length heel->toe = 1.0. Object space: X heel(0) -> toe(1), Y width, Z up.
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

VOXEL = float(os.environ.get("CLAY_STEPS_VOXEL", "0.005"))

# ------------------------------------------------------------ shape params (round 4: slim, light sole)
SOLE_HW = 0.165           # half width at heel and ball (plus side bulge)
SOLE_WAIST = 0.02         # half width lost at mid-foot (gentle waist)
SOLE_TOE_NARROW = 0.06    # half width lost toward the toe
SOLE_R2D = 0.13           # top-view corner radius
SOLE_EDGE = 0.05          # edge rounding
SOLE_BULGE = 0.015        # softly convex side wall
BUMPER = 0.035
# sole thickness heel -> toe (top edge lower at mid-foot: gentle wave)
SOLE_T_PTS = ((0.0, 0.13), (0.20, 0.125), (0.45, 0.11), (0.70, 0.10), (1.0, 0.08))
# upper height above the sole top: puffy heel, collar dip, instep, long sweep to a low toe
UP_H_PTS = ((0.0, 0.29), (0.12, 0.30), (0.22, 0.285), (0.35, 0.28), (0.50, 0.225),
            (0.70, 0.14), (0.90, 0.065), (1.0, 0.035))
UP_HW = 0.149             # max half width (0.28 at the sole line)
UP_HW_TOE = 0.096         # half width at x = 0.9 (0.18 at the sole line)
UP_WAIST = 0.008
UP_EXP = 2.6              # superellipse exponent of the loaf cross-section
UP_CAP_EXP = 2.0          # heel/toe caps
UP_BULGE_AT = 0.30        # widest at this share of the height
UP_HEEL = (0.19, 0.16)    # heel cap: starts at x, radius (back at 0.03; large = puffy round heel)
HEEL_LEAN_DEG = 10.0      # heel back leans forward
UP_TOE = (0.82, 0.17)     # toe cap: starts at x, radius (tip at 0.99)
COLLAR_C = (0.17, 0.0)    # subtle dip at the back top
COLLAR_AB = (0.10, 0.06)
COLLAR_DEPTH = 0.025
HOLLOW_TINT = 0.35          # barely darker inside the dip
LACE_X = (0.33, 0.41, 0.49)
LACE_ANGLE = 15.0
LACE_HALF_LEN = 0.075
LACE_RZ, LACE_RX = 0.0225, 0.03   # thickness/2, width along the shoe/2

YAW_DEG = 15.0            # toe toward the viewer
VIEW_ELEVATION_DEG = 16.0
ROLL_DEG = 8.0            # image-plane tilt, toe lower

REF = ct.REFERENCE["steps"]
CREAM_HEX = os.environ.get("CLAY_STEPS_CREAM", "#E4E2DB")
HOLLOW_HEX = os.environ.get("CLAY_STEPS_HOLLOW", "#B5AA9E")
TAN_HEX = os.environ.get("CLAY_STEPS_TAN", "#AF8653")
TAN_LIGHT_HEX = os.environ.get("CLAY_STEPS_TAN_LIGHT", "#D0AE97")
TAN_DARK_HEX = os.environ.get("CLAY_STEPS_TAN_DARK", "#A0722F")
TAN_DIR = (-0.5, -0.2, 0.85)    # world normal that gets the full light tint (up, upper left)
CREAM_EDGE_LIFT = 1.0
CREAM_SHEEN = 0.0
CREAM_SPECULAR = 0.12
ST_FILL = os.environ.get("CLAY_ST_FILL", "18")
ST_KEY = os.environ.get("CLAY_ST_KEY", "40")
ST_WORLD = os.environ.get("CLAY_ST_WORLD")
KEY2_ENERGY = float(os.environ.get("CLAY_ST_KEY2", "4.4"))
KEY2_AZ_EL = (-55.0, 45.0)
ST_LOW = os.environ.get("CLAY_ST_LOW", "#B49C7E")    # warm ground: beige undersides


# ------------------------------------------------------------ profiles
def sstep(e0, e1, x):
    t = np.clip((x - e0) / (e1 - e0), 0, 1)
    return t * t * (3 - 2 * t)


def z_bottom(x):
    toe = np.clip((x - 0.50) / 0.50, 0, 1)
    heel = np.clip((0.25 - x) / 0.25, 0, 1)
    return 0.10 * toe ** 2 + 0.04 * heel ** 2


def z_sole_top0(x):
    return z_bottom(x) + _pchip([p[0] for p in SOLE_T_PTS], [p[1] for p in SOLE_T_PTS], x)


def z_sole_top(x):
    return z_sole_top0(x) + BUMPER * sstep(0.80, 0.97, x)


def _pchip(xs, ys, x):
    """Monotone cubic (Fritsch-Carlson) through the control points."""
    xs, ys = np.array(xs), np.array(ys)
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


def h_upper(x):
    return _pchip([p[0] for p in UP_H_PTS], [p[1] for p in UP_H_PTS], x)


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
    hw = (SOLE_HW - SOLE_WAIST * np.exp(-((x - 0.45) / 0.13) ** 2)
          - SOLE_TOE_NARROW * sstep(0.68, 1.0, x))
    d2 = rrect2(x, y, 0.5, 0.5, hw, SOLE_R2D) - SOLE_BULGE * 4 * zr * (1 - zr)
    return rinter([d2, zb - z, z - zt], SOLE_EDGE)


def upper_sdf(P):
    """Loaf: superellipse cross-section (widest at UP_BULGE_AT of the height,
    narrowing to a rounded top), superellipsoid caps at heel and toe."""
    x, y, z = P[:, 0], P[:, 1], P[:, 2]
    xh, rh = UP_HEEL
    xt, rt = UP_TOE
    xc = np.clip(x, xh, xt)
    H = h_upper(np.minimum(xc, 0.9))
    W = (UP_HW - UP_WAIST * np.exp(-((xc - 0.45) / 0.13) ** 2)
         - (UP_HW - UP_HW_TOE) * sstep(0.55, 0.9, xc))
    zs = z_sole_top0(xc)
    c = UP_BULGE_AT * H
    zp = z - zs
    t = np.where(zp > c, (zp - c) / (H - c), (c - zp) / (c / 0.48))
    lean = math.tan(math.radians(HEEL_LEAN_DEG)) * np.maximum(zp, 0)   # heel back leans forward
    xe = np.maximum(xh + lean - x, 0) / rh + np.maximum(x - xt, 0) / rt
    n = UP_EXP
    g = (np.abs(y) / W) ** n + np.abs(t) ** n + xe ** UP_CAP_EXP   # rounder heel/toe in side view
    d = (g ** (1 / n) - 1) * 0.12
    return np.maximum(d, z_bottom(x) + 0.03 - z)   # hard bottom, hidden inside the sole


def surface_z(sdf, x, y, zlo=0.0, zhi=0.8):
    """Highest z of the surface above (x, y) by bisection (vectorised)."""
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


def tube_sdf_factory(C, N, rz, rx):
    """Tube around polyline C (n,3) with surface normals N: elliptic cross section,
    rz along N, rx across."""
    seg_a, seg_b = C[:-1], C[1:]
    na, nb = N[:-1], N[1:]

    def sdf(P):
        best = np.full(len(P), 1e9)
        out = np.zeros(len(P))
        for a, b, n0, n1 in zip(seg_a, seg_b, na, nb):
            ab = b - a
            t = np.clip(((P - a) @ ab) / (ab @ ab), 0, 1)
            c = a + t[:, None] * ab
            d = P - c
            n = n0 + t[:, None] * (n1 - n0)
            n /= np.linalg.norm(n, axis=1, keepdims=True)
            dn = np.einsum("ij,ij->i", d, n)
            dt = d - dn[:, None] * n
            iso = np.linalg.norm(d, axis=1)
            val = (np.sqrt((dn / rz) ** 2 + np.einsum("ij,ij->i", dt, dt) / rx ** 2) - 1) * min(rz, rx)
            m = iso < best
            best = np.where(m, iso, best)
            out = np.where(m, val, out)
        return out
    return sdf


def lace_curve(xc):
    y = np.linspace(-LACE_HALF_LEN, LACE_HALF_LEN, 25)
    x = xc + math.tan(math.radians(LACE_ANGLE)) * y
    z = surface_z(upper_sdf, x, y)
    S = np.stack([x, y, z], 1)
    N = _normals(upper_sdf, S)
    return S + N * (LACE_RZ * 0.75), N


def collar_curve():
    th = np.linspace(0, 2 * math.pi, 73)
    x = COLLAR_C[0] + COLLAR_AB[0] * np.cos(th)
    y = COLLAR_C[1] + COLLAR_AB[1] * np.sin(th)
    z = surface_z(upper_sdf, x, y)
    S = np.stack([x, y, z], 1)
    N = _normals(upper_sdf, S)
    return S + N * (COLLAR_ROLL * 0.35), N


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


def _torus_start(name, C):
    """Ring start mesh for the collar roll (a cube start would close the opening)."""
    bm = bmesh.new()
    nu, nv = len(C) - 1, 16
    rows = []
    for i in range(nu):
        a, b = C[i], C[(i + 1) % nu]
        t = (b - a) / np.linalg.norm(b - a)
        n = np.array([0, 0, 1.0])
        s = np.cross(t, n)
        rows.append([bm.verts.new(tuple(a + 0.06 * (math.cos(2 * math.pi * j / nv) * n
                                                    + math.sin(2 * math.pi * j / nv) * s)))
                     for j in range(nv)])
    for i in range(nu):
        for j in range(nv):
            bm.faces.new((rows[i][j], rows[(i + 1) % nu][j], rows[(i + 1) % nu][(j + 1) % nv],
                          rows[i][(j + 1) % nv]))
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    obj = bpy.data.objects.new(name, me)
    bpy.context.scene.collection.objects.link(obj)
    _remesh(obj, 0.008)
    return obj


def build(name, sdf, lo, hi, voxel, coarse, obj=None):
    obj = obj or _cube_mesh(name, lo, hi)
    _set_co(obj.data, project(_get_co(obj.data), sdf, iters=40))
    _remesh(obj, coarse)
    _set_co(obj.data, project(_get_co(obj.data), sdf))
    _remesh(obj, voxel)
    _set_co(obj.data, project(_get_co(obj.data), sdf))
    obj.data.shade_smooth()
    return obj


def collar_hollow(upper):
    """Shallow bowl inside the collar ellipse: displace the upper's top vertices down.
    Stores the bowl factor as attribute 'hollow' (material darkening)."""
    me = upper.data
    P = _get_co(me)
    nrm = np.empty(len(P) * 3)
    me.vertices.foreach_get("normal", nrm)
    n = nrm.reshape(-1, 3)
    rho = np.hypot((P[:, 0] - COLLAR_C[0]) / COLLAR_AB[0], (P[:, 1] - COLLAR_C[1]) / COLLAR_AB[1])
    f = (1 - sstep(0.35, 1.0, rho)) * sstep(0.2, 0.6, n[:, 2])   # softly rounded edge
    P[:, 2] -= COLLAR_DEPTH * f
    _set_co(me, P)
    me.shade_smooth()
    a = me.attributes.new("hollow", "FLOAT", "POINT")
    a.data.foreach_set("value", HOLLOW_TINT * f)


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


def _cream(name, hollow=False):
    mat = ct.clay(name, CREAM_HEX)
    nt = mat.node_tree
    nt.nodes["EdgeMix"].inputs["B"].default_value = ct.srgb_hex_to_linear(
        ct._lighter_hex(CREAM_HEX, CREAM_EDGE_LIFT))
    bsdf = nt.nodes["Principled BSDF"]
    bsdf.inputs["Sheen Weight"].default_value = CREAM_SHEEN
    bsdf.inputs["Specular IOR Level"].default_value = CREAM_SPECULAR   # no clipped glints (>250)
    if hollow:
        src = bsdf.inputs["Base Color"].links[0].from_socket
        at = nt.nodes.new("ShaderNodeAttribute")
        at.attribute_name = "hollow"
        mix = nt.nodes.new("ShaderNodeMix")
        mix.data_type = "RGBA"
        mix.inputs["B"].default_value = ct.srgb_hex_to_linear(HOLLOW_HEX)
        nt.links.new(at.outputs["Fac"], mix.inputs["Factor"])
        nt.links.new(src, mix.inputs["A"])
        nt.links.new(mix.outputs["Result"], bsdf.inputs["Base Color"])
    return mat


def _tan():
    return _gradient(ct.clay("ClayTan", TAN_HEX),
                     ((0.2, 0.95, TAN_LIGHT_HEX, 1.0), (0.0, -0.55, TAN_DARK_HEX, 1.0)), TAN_DIR)


def _mask(objs):
    cols = {"Sole": (1, 0, 0, 1)}
    for o in objs:
        mat = bpy.data.materials.new("Mask" + o.name)
        mat.use_nodes = True
        nt = mat.node_tree
        nt.nodes.clear()
        out = nt.nodes.new("ShaderNodeOutputMaterial")
        em = nt.nodes.new("ShaderNodeEmission")
        em.inputs["Color"].default_value = cols.get(o.name, (0, 1, 0, 1))
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
    upper = build("Upper", upper_sdf, (UP_HEEL[0] - UP_HEEL[1] - m, -UP_HW - m, 0.0), (UP_TOE[0] + UP_TOE[1] + m, UP_HW + m, 0.55),
                  VOXEL, 0.02)
    collar_hollow(upper)
    laces = []
    for i, xc in enumerate(LACE_X):
        Cl, Nl = lace_curve(xc)
        lo = Cl.min(0) - 0.06
        hi = Cl.max(0) + 0.06
        laces.append(build(f"Lace{i}", tube_sdf_factory(Cl, Nl, LACE_RZ, LACE_RX), lo, hi, VOXEL, 0.008))
    objs = [sole, upper] + laces

    # pose: yaw (toe toward viewer), extra view elevation, image-plane roll (toe lower)
    fwd = -np.array(ct._dir_from_angles(ct.CAM_YAW_DEG, ct.CAM_ELEVATION_DEG))
    M = (Matrix.Rotation(math.radians(ROLL_DEG), 4, Vector(fwd))
         @ Matrix.Rotation(math.radians(VIEW_ELEVATION_DEG - ct.CAM_ELEVATION_DEG), 4, "X")
         @ Matrix.Rotation(math.radians(-YAW_DEG), 4, "Z")
         @ Matrix.Translation((-0.5, 0, -0.25)))
    for o in objs:
        o.matrix_world = M
    bpy.context.view_layer.update()

    for o in objs:
        o.data.materials.clear()
    sole.data.materials.append(_tan())
    upper.data.materials.append(_cream("ClayUpper", hollow=True))
    cmat = _cream("ClayCream")
    for o in laces:
        o.data.materials.append(cmat)

    ct.setup_scene(objs)
    wnt = bpy.context.scene.world.node_tree
    # icon-level: small second key from the upper left lifts the lit side (heel, laces' tops)
    if KEY2_ENERGY > 0:
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
    ct.print_poly_counts(objs)
    print("POLYS total", sum(len(o.data.polygons) for o in objs))

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
