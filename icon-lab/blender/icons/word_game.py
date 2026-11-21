"""Icon #20 word-game: three cream clay letter tiles in a gentle row with raised
terracotta letters A, B, C and tiny warm-grey score dots.

Geometry only; look from clay_theme (theme untouched, icon-level light tweaks as
the other game tiles). Run: Blender -b --factory-startup --python icons/word_game.py -- <out_dir>
Method: sdf_kit. Tiles: rounded boxes. Letters: Blender's default font (Bfont) ->
filled outline -> exact 2D signed distance on a 1 mm grid, Gaussian-blurred (rounds
convex and concave corners: moulded, not cut) -> rounded extrusion (soft bevel).
The extruded text mesh is the start mesh, so the counters of A and B stay open.
Tiles, letters and dots are separate objects (contact creases).
Units: group width 1.0; X right, Z up, front at -Y.
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
import sdf_kit as k  # noqa: E402

TS, TD, T_CORNER, T_EDGE = 0.30, 0.14, 0.07, 0.03       # tile face, depth, corner, edge
GAP = 0.05
FRONT = -TD / 2
TILES = [  # letter, centre x, centre z, rotation in the image plane (deg, counter-clockwise)
    ("A", -(TS + GAP), 0.0, 0.0),
    ("B", 0.0, 0.08, 6.0),
    ("C", TS + GAP, 0.03, -4.0),
]
L_H, L_UP, L_EMBED = 0.17, 0.025, 0.012                  # letter height, raise, embed
L_EDGE = 0.009                                           # letter bevel
L_BLUR = 0.003                                           # 2D blur sigma (corner fillet)
L_BOLD = 0.006                                           # outline offset: plumper clay strokes (Bfont is thin)
GRID = 0.001
DOT_D, DOT_UP, DOT_POS = 0.03, 0.008, (0.10, -0.10)      # score dot (lower right corner)

VIEW_ELEVATION_DEG = 8.0
CREAM_HEX = "#EFEBE2"
CREAM_GRAD = (("#E6E1D8", 0.20), ("#B4A99B", 0.35))   # up-facing top edges toned down: no clipping
FACE_GRAD = (1.02, 0.95)
TERRA_HEX = "#BE8E72"
TERRA_GRAD = (("#F4DECE", 0.80), ("#7A3810", 0.80))
DOT_HEX = "#C7C0B2"
DOTS = os.environ.get("CLAY_WG_DOTS", "0") == "1"   # off: beside the letter feet they read as full stops ("A.")
RIM = os.environ.get("CLAY_WG_RIM", "2")
SHEEN = 0.15


def tile_sdf(P):
    x, y, z = P[:, 0], P[:, 1], P[:, 2]
    return k.extrude(k.rrect(x, z, TS / 2, TS / 2, T_CORNER), y, 0.0, TD / 2, T_EDGE)


def dot_sdf(P):
    q = (P - [DOT_POS[0], FRONT - DOT_UP + DOT_D / 2 * 0.8, DOT_POS[1]]) / [DOT_D / 2, DOT_D / 2 * 0.8, DOT_D / 2]
    return (np.linalg.norm(q, axis=1) - 1) * DOT_D / 2 * 0.8


# ------------------------------------------------------------ letters
def _text_obj(ch, extrude=0.0):
    cu = bpy.data.curves.new("Txt" + ch, "FONT")
    cu.body = ch
    cu.resolution_u = 24
    cu.extrude = extrude
    ob = bpy.data.objects.new("Txt" + ch, cu)
    bpy.context.scene.collection.objects.link(ob)
    return ob


def _text_mesh(ch, extrude=0.0):
    ob = _text_obj(ch, extrude)
    dg = bpy.context.evaluated_depsgraph_get()
    me = bpy.data.meshes.new_from_object(ob.evaluated_get(dg))
    cu = ob.data
    bpy.data.objects.remove(ob)
    bpy.data.curves.remove(cu)
    return me


def _letter_field(ch):
    """Blurred 2D signed distance of the letter on a grid (letter centred, height L_H)."""
    me = _text_mesh(ch)
    bm = bmesh.new()
    bm.from_mesh(me)
    bmesh.ops.triangulate(bm, faces=bm.faces[:])
    V = np.array([v.co[:2] for v in bm.verts])
    lo, hi = V.min(0), V.max(0)
    s = (L_H - 2 * L_BOLD) / (hi[1] - lo[1])          # height incl. the bold offset = L_H
    c = (lo + hi) / 2
    tf = lambda p: (np.asarray(p) - c) * s   # noqa: E731
    segs = np.array([[tf(e.verts[0].co[:2]), tf(e.verts[1].co[:2])] for e in bm.edges if e.is_boundary])
    tris = np.array([[tf(v.co[:2]) for v in f.verts] for f in bm.faces])
    bm.free()
    bpy.data.meshes.remove(me)
    g = np.arange(-0.15, 0.15 + GRID / 2, GRID)
    X, Z = np.meshgrid(g, g, indexing="ij")
    px, pz = X.ravel(), Z.ravel()
    d = np.full(px.shape, 1e9)
    for (ax, az), (bx, bz) in segs:
        d = np.minimum(d, k.seg2(px, pz, ax, az, bx, bz))
    inside = np.zeros(px.shape, bool)
    for (x0, z0), (x1, z1), (x2, z2) in tris:
        d0 = (px - x1) * (z0 - z1) - (x0 - x1) * (pz - z1)
        d1 = (px - x2) * (z1 - z2) - (x1 - x2) * (pz - z2)
        d2 = (px - x0) * (z2 - z0) - (x2 - x0) * (pz - z0)
        neg = (d0 < 0) | (d1 < 0) | (d2 < 0)
        pos = (d0 > 0) | (d1 > 0) | (d2 > 0)
        inside |= ~(neg & pos)
    F = np.where(inside, -d, d).reshape(X.shape)
    # separable Gaussian blur: rounds the letter corners (convex and concave)
    sig = L_BLUR / GRID
    r = int(3 * sig)
    w = np.exp(-0.5 * (np.arange(-r, r + 1) / sig) ** 2)
    w /= w.sum()
    Fp = np.pad(F, r, mode="edge")
    Fp = np.apply_along_axis(lambda v: np.convolve(v, w, mode="valid"), 0, Fp)
    F = np.apply_along_axis(lambda v: np.convolve(v, w, mode="valid"), 1, Fp)
    return F - L_BOLD, g, s, c


def _lookup(F, g, x, z):
    fx = np.clip((x - g[0]) / GRID, 0, len(g) - 1.001)
    fz = np.clip((z - g[0]) / GRID, 0, len(g) - 1.001)
    i, j = fx.astype(int), fz.astype(int)
    u, v = fx - i, fz - j
    return ((F[i, j] * (1 - u) + F[i + 1, j] * u) * (1 - v) + (F[i, j + 1] * (1 - u) + F[i + 1, j + 1] * u) * v)


def _letter(ch):
    F, g, s, c = _letter_field(ch)
    top, back = FRONT - L_UP, FRONT + L_EMBED
    yc, half = (top + back) / 2, (back - top) / 2

    def sdf(P):
        return k.extrude(_lookup(F, g, P[:, 0], P[:, 2]), P[:, 1], yc, half, L_EDGE)

    def start(name):
        me = _text_mesh(ch, extrude=half * 0.9 / s)
        M = (Matrix.Translation((0, yc, 0)) @ Matrix.Scale(s, 4) @ Matrix.Rotation(math.radians(90), 4, "X")
             @ Matrix.Translation((-c[0], -c[1], 0)))
        me.transform(M)
        ob = bpy.data.objects.new(name, me)
        bpy.context.scene.collection.objects.link(ob)
        return ob

    return k.build("Letter" + ch, sdf, voxel=0.0015, coarse=0.003, start=start)


def _place(o, cx, cz, deg):
    o.data.transform(Matrix.Translation((cx, 0, cz)) @ Matrix.Rotation(math.radians(-deg), 4, "Y"))
    o.data.update()


def _cream(o):
    P = k.get_co(o.data)
    nz = k.normals(o.data)[:, 2]
    g = FACE_GRAD[1] + (FACE_GRAD[0] - FACE_GRAD[1]) * k.ss(-0.15, 0.23, P[:, 2])
    k.set_colors(o, k.graded(CREAM_HEX, *CREAM_GRAD, nz) * g[:, None], (0, 0, 0))


def main():
    argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    out_dir = argv[0] if argv else os.path.join(os.path.dirname(HERE), "out", "word-game")
    os.makedirs(out_dir, exist_ok=True)
    ct.reset_scene()
    m = 0.03
    tiles, letters, dots = [], [], []
    for ch, cx, cz, deg in TILES:
        t = k.build("Tile" + ch, tile_sdf, (-TS / 2 - m, -TD / 2 - m, -TS / 2 - m), (TS / 2 + m, TD / 2 + m, TS / 2 + m),
                    0.0032, 0.012)
        lt = _letter(ch)
        parts = [t, lt]
        if DOTS:
            dt = k.build("Dot" + ch, dot_sdf, (DOT_POS[0] - 0.03, FRONT - 0.03, DOT_POS[1] - 0.03),
                         (DOT_POS[0] + 0.03, FRONT + 0.02, DOT_POS[1] + 0.03), 0.0015, 0.004)
            parts.append(dt)
            dots.append(dt)
        for o in parts:
            _place(o, cx, cz, deg)
        tiles.append(t)
        letters.append(lt)
    for t in tiles:
        _cream(t)
    for lt in letters:
        k.set_colors(lt, k.graded(TERRA_HEX, *TERRA_GRAD, k.normals(lt.data)[:, 2]), (1, 0, 0))
    for dt in dots:
        k.set_colors(dt, np.tile(k.lin(DOT_HEX), (len(dt.data.vertices), 1)), (0, 1, 0))
    objs = [k.join("Tiles", tiles), k.join("Letters", letters)]
    if dots:
        objs.append(k.join("Dots", dots))
    k.tilt(objs, VIEW_ELEVATION_DEG)
    mat = k.zone_material("ClayWordGame", SHEEN)
    for o in objs:
        o.data.materials.clear()
        o.data.materials.append(mat)
    ct.setup_scene(objs)
    k.light_overrides(rim=RIM)
    k.finish(objs, out_dir, "word-game")


main()
