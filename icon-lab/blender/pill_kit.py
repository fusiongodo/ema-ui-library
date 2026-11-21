"""Shared pill shapes and the protocol-pill light for the protocol-kind tiles
#35 protocol-capsule, #36 protocol-softgel, #37 protocol-group-c3, #38 protocol-group-c4.

Shapes are SDFs in a local frame (capsule / softgel: long axis = local X; tablet: axis = local Z),
placed by centre c, a 3x3 rotation R (local -> world) and a scale s. Meshing, colours and
masks via sdf_kit. The light copies the icon-level overrides of protocol_pill.py (theme untouched).
"""
import math
import os

import bpy
import numpy as np
from mathutils import Matrix, Vector

import clay_theme as ct
import sdf_kit as k

# Colour sets (base, (light hex, weight), (dark hex, weight)) -> vertex colours (sdf_kit.graded).
# Tuned under the pill light to the brief's lit / middle / shadow targets.
CREAM = ("#E3E0DB", ("#E8E6E1", 0.30), ("#FFFAF2", 0.70))
CORAL = ("#E48676", ("#EDA08E", 0.35), ("#FFB49A", 0.90))
MINT = ("#82C8A0", ("#A6E0BE", 0.50), ("#A6E6BE", 0.80))
LILAC = ("#A296B0", ("#D2C2DF", 0.60), ("#B4A6C4", 0.80))
AMBER = ("#E6B464", ("#F2CC88", 0.45), ("#FFD07A", 0.80))
ROSE = ("#DDB9CF", ("#ECD2E1", 0.50), ("#F5D5E8", 0.70))

# Capsule (#35, unit length): length 1.0, diameter 0.38; cap overlaps the body with a 0.01 step.
CAPS_L, CAPS_R = 1.0, 0.19
CAPS_STEP = 0.010
CAPS_SEAM_X = -0.05          # cap open end (local x), cap a bit longer than the visible body half
CAPS_SEAM_E = 0.006          # soft rounding of the cap's open edge
# Softgel (#36): 1.0 x 0.62 x 0.42 -> semi-axes along local x (length), z (height), y (depth).
GEL_AX = (0.50, 0.21, 0.31)
GEL_RIDGE_H, GEL_RIDGE_W = 0.006, 0.014   # very faint seam ridge on the equator (local y = 0)
# Tablet (as protocol-pill): diameter 1.0, thickness 0.34, rim radius 0.12, dome 0.05.
TAB_R, TAB_T, TAB_RIM, TAB_DOME = 0.5, 0.34, 0.12, 0.05
TAB_GROOVE_W, TAB_GROOVE_D = 0.06, 0.035  # a touch wider than #5: it reads at the smaller size


def rot(yz_deg=0.0, xz_deg=0.0, xy_deg=0.0):
    """Local -> world rotation: about X (roll, deg), then Y (screen angle: +x end up), then Z (yaw)."""
    M = (Matrix.Rotation(math.radians(xy_deg), 3, "Z")
         @ Matrix.Rotation(math.radians(-xz_deg), 3, "Y")
         @ Matrix.Rotation(math.radians(yz_deg), 3, "X"))
    return np.array(M)


def local(P, c, R, s):
    return ((P - np.asarray(c)) @ R) / s


def _rint(a, b, e):
    """Rounded intersection of two SDFs (edge radius e)."""
    wx, wy = a + e, b + e
    return np.minimum(np.maximum(wx, wy), 0) + np.hypot(np.maximum(wx, 0), np.maximum(wy, 0)) - e


def _capsule(L, r):
    h = CAPS_L / 2 - CAPS_R
    x = np.clip(L[:, 0], -h, h)
    return np.sqrt((L[:, 0] - x) ** 2 + L[:, 1] ** 2 + L[:, 2] ** 2) - r


def capsule_cap(P, c, R, s):
    """Cap half (+x end): radius + step, open edge at CAPS_SEAM_X, softly rounded."""
    L = local(P, c, R, s)
    return s * _rint(_capsule(L, CAPS_R + CAPS_STEP / 2), CAPS_SEAM_X - L[:, 0], CAPS_SEAM_E)


def capsule_body(P, c, R, s):
    """Body half (-x end): runs on under the cap (hidden)."""
    L = local(P, c, R, s)
    return s * _rint(_capsule(L, CAPS_R - CAPS_STEP / 2), L[:, 0] - (CAPS_SEAM_X + 0.16), 0.03)


def softgel(P, c, R, s):
    L = local(P, c, R, s)
    r = np.array(GEL_AX)
    k0 = np.linalg.norm(L / r, axis=1)
    k1 = np.maximum(np.linalg.norm(L / (r * r), axis=1), 1e-9)
    d = k0 * (k0 - 1) / k1
    d = d - GEL_RIDGE_H * np.exp(-(L[:, 1] / GEL_RIDGE_W) ** 2)
    return s * d


def _tab_top(r):
    core = TAB_R - TAB_RIM
    t = np.clip(1.0 - (r / core) ** 2, 0.0, 1.0)
    return TAB_DOME * t * t


def tablet(P, c, R, s, groove=True):
    L = local(P, c, R, s)
    x, y, z = L[:, 0], L[:, 1], L[:, 2]
    r = np.hypot(x, y)
    half_flat = TAB_T / 2 - TAB_DOME - TAB_RIM
    qx = r - (TAB_R - TAB_RIM)
    qy = np.abs(z) - _tab_top(r) - half_flat
    d1 = np.hypot(np.maximum(qx, 0), np.maximum(qy, 0)) + np.minimum(np.maximum(qx, qy), 0) - TAB_RIM
    if not groove:
        return s * d1
    gr = TAB_GROOVE_W / 2
    zc = half_flat + TAB_RIM + _tab_top(np.abs(x)) - TAB_GROOVE_D + gr
    d2 = np.hypot(y, z - zc) - gr
    kk = 0.02
    h = np.clip(0.5 - 0.5 * (d1 + d2) / kk, 0.0, 1.0)
    return s * (d1 * (1 - h) + (-d2) * h + kk * h * (1 - h))


def box_around(c, s, ext=0.62):
    e = ext * s
    return (c[0] - e, c[1] - e, c[2] - e), (c[0] + e, c[1] + e, c[2] + e)


def color(o, spec, part, rgb=None):
    base, light, dark = spec
    k.set_colors(o, k.graded(base, light, dark, k.normals(o.data)[:, 2]) if rgb is None else rgb, part)


def build_capsule(name, c, R, s, spec_cap, spec_body, part_cap, part_body, voxel=0.004):
    """Two-part capsule -> one object (cap + body meshes joined, contact crease from Cycles)."""
    lo, hi = box_around(c, s)
    cap = k.build(name + "Cap", lambda Q: capsule_cap(Q, c, R, s), lo, hi, voxel, voxel * 3)
    color(cap, spec_cap, part_cap)
    body = k.build(name + "Body", lambda Q: capsule_body(Q, c, R, s), lo, hi, voxel, voxel * 3)
    color(body, spec_body, part_body)
    return [cap, body]


def build_softgel(name, c, R, s, part, voxel=0.004):
    lo, hi = box_around(c, s)
    o = k.build(name, lambda Q: softgel(Q, c, R, s), lo, hi, voxel, voxel * 3)
    color(o, AMBER, part)
    return o


def build_tablet(name, c, R, s, part, voxel=0.004, groove=True):
    """groove=False: a plain tablet (the score line shreds at small scale, e.g. inside the group cluster)."""
    lo, hi = box_around(c, s)
    # coarse pass without the groove (it would bridge the thin groove), then carve on the fine mesh
    o = k.build(name, lambda Q: tablet(Q, c, R, s, groove=False), lo, hi, voxel, voxel * 3)
    f = lambda Q: tablet(Q, c, R, s, groove=groove)
    k.set_co(o.data, k.project(k.get_co(o.data), f))
    k._remesh(o, voxel)                       # even vertex spacing inside the groove
    k.set_co(o.data, k.project(k.get_co(o.data), f))
    o.data.shade_smooth()
    color(o, CREAM, part)
    return o


def check_gaps(items):
    """items: list of (name, object, sdf). Prints the min distance of each mesh to every other
    item's surface (negative = interpenetration = hard seam)."""
    for i, (na, oa, _) in enumerate(items):
        P = k.get_co(oa.data)
        for j, (nb, _, fb) in enumerate(items):
            if i < j:
                print("GAP %s-%s %.4f" % (na, nb, float(fb(P).min())))


FILL_W = float(os.environ.get("CLAY_PK_FILL", "40"))
KEY_W = float(os.environ.get("CLAY_PK_KEY", "75"))
LOW_HEX = os.environ.get("CLAY_PK_LOW", "#A0948A")
WORLD_W = float(os.environ.get("CLAY_PK_WORLD", "0.8"))


def pill_light():
    """protocol-pill's icon-level light (closer stronger key, small upper-left key, warm low world).
    Differences (icon-level, measured): frontal fill FILL_W (pill 0), key KEY_W (pill 90), world
    WORLD_W with a lighter low colour LOW_HEX (pill 0.7, #7A7068). The pill's lit side is its top
    face; these objects face the camera, and with the pill light their lower halves fell far below
    the shadow targets (cream #958D87 for #C2BAB1)."""
    fill = bpy.data.objects.get("Fill")
    if fill is not None:
        fill.data.energy = FILL_W
    key = bpy.data.objects["Key"]
    key.data.energy = KEY_W
    key.data.temperature = 6000.0
    tgt = key.location + (key.matrix_world.to_3x3() @ Vector((0, 0, -1))) * ct.KEY_DISTANCE
    key.location = tgt + (key.matrix_world.to_3x3() @ Vector((0, 0, 1))) * 2.5
    k2d = bpy.data.lights.new("Key2", "AREA")
    k2d.size = 1.0
    k2d.energy = 22.0
    k2d.use_temperature = True
    k2d.temperature = 6000.0
    k2 = bpy.data.objects.new("Key2", k2d)
    bpy.context.scene.collection.objects.link(k2)
    k2.location = Vector(tgt) + ct._dir_from_angles(-55.0, 50.0) * 1.6
    ct._point_at(k2, tgt)
    wnt = bpy.context.scene.world.node_tree
    ramp = next(n for n in wnt.nodes if n.type == "VALTORGB")
    ramp.color_ramp.elements[0].color = ct.srgb_hex_to_linear(LOW_HEX)
    wnt.nodes["Background"].inputs["Strength"].default_value = WORLD_W


def finish(objs, out_dir, slug, elevation):
    k.tilt(objs, elevation)
    mat = k.zone_material("ClayPills", 0.15)
    for o in objs:
        o.data.materials.clear()
        o.data.materials.append(mat)
    ct.setup_scene(objs)
    pill_light()
    k.finish(objs, out_dir, slug)
