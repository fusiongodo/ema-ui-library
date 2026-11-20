"""Icon #5 protocol-pill: a round clay tablet with one score line.

Geometry only; the look comes from clay_theme (unchanged from #7).
Run: Blender -b --factory-startup --python icons/protocol_pill.py -- <out_dir>

Construction as in checkin_chat: implicit surface (domed disc swept by the rim
radius, minus a soft U-groove that fades out toward the rim), rough start mesh,
voxel remesh, Newton projection onto the surface, remesh, project again.
Units: tablet diameter = 1.0. Object space: Z = tablet axis, groove along X.
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
RADIUS = 0.5                 # diameter 1.0
RIM_R = 0.09                 # rim radius: rounded corners, nearly straight side band between
THICK = 0.36                 # total thickness incl. both domes
DOME = 0.015                 # dome height above the rim plane (top and bottom)
HALF_FLAT = THICK / 2 - DOME - RIM_R   # 0.05: half-height of the straight side band
CORE = RADIUS - RIM_R
GROOVE_D = 0.050             # V-groove depth below the face at the centre
GROOVE_ANGLE_DEG = 60.0      # opening angle of the V (two flat walls)
GROOVE_W = 2 * GROOVE_D * math.tan(math.radians(GROOVE_ANGLE_DEG / 2))  # ~0.069 at the top
GROOVE_FLOOR_R = 0.003       # tiny rounding at the floor (anti-aliasing only)
GROOVE_BEVEL = 0.004         # tiny convex bevel at the shoulders
GROOVE_AO = float(os.environ.get("CLAY_GROOVE_AO", "0.25"))  # cavity darkening of the groove floor
GROOVE_K = 0.015             # smooth-subtraction radius (soft groove edge, soft rim notch)

# Pose: tilt toward the camera so the top face is seen at VIEW_ELEVATION_DEG (camera
# sits at ct.CAM_ELEVATION_DEG), spin so the score line runs ~25 deg up on screen.
VIEW_ELEVATION_DEG = 32.0
SCREEN_ANGLE_DEG = 25.0

# Colours: target render colours in clay_theme.REFERENCE["protocol-pill"];
# this base colour and the icon-level light override are tuned to hit them.
REF = ct.REFERENCE["protocol-pill"]
PILL_HEX = os.environ.get("CLAY_PILL_HEX", "#EFECE8")
PILL_FILL_ENERGY = float(os.environ.get("CLAY_PILL_FILL", "0"))
PILL_KEY_ENERGY = float(os.environ.get("CLAY_PILL_KEY", "90"))
PILL_KEY_KELVIN = float(os.environ.get("CLAY_PILL_KELVIN", "6000"))
PILL_KEY_DISTANCE = float(os.environ.get("CLAY_PILL_KEY_DIST", "2.5"))
PILL_WORLD = float(os.environ.get("CLAY_PILL_WORLD", "0.7"))
PILL_WORLD_LOW_HEX = os.environ.get("CLAY_PILL_LOW", "#7A7068")  # warm: beige-grey side band
# small second key from the upper left: gradient across the top face
KEY2_ENERGY = float(os.environ.get("CLAY_KEY2", "22"))
KEY2_SIZE = 1.0
KEY2_AZ_EL = (-55.0, 50.0)
KEY2_DISTANCE = 1.6
# chalky grain (icon-level): fine procedural noise bump, barely visible at 260 px
GRAIN_SCALE = float(os.environ.get("CLAY_GRAIN_SCALE", "350"))
GRAIN_STRENGTH = float(os.environ.get("CLAY_GRAIN", "0.25"))

VOXEL = float(os.environ.get("CLAY_VOXEL", "0.004"))  # fine enough for the groove
SUBSURF_VIEW = 0
SUBSURF_RENDER = int(os.environ.get("CLAY_SUB_RENDER", "0"))  # dense mesh already on the surface


def _top_z(r):
    """Dome over the flat core; zero height and zero slope at the core edge."""
    t = np.clip(1.0 - (r / CORE) ** 2, 0.0, 1.0)
    return DOME * t * t


def _tablet_dist(P):
    x, y, z = P[:, 0], P[:, 1], P[:, 2]
    r = np.hypot(x, y)
    qx = r - CORE
    qy = np.abs(z) - _top_z(r) - HALF_FLAT
    out = np.hypot(np.maximum(qx, 0), np.maximum(qy, 0))
    return out + np.minimum(np.maximum(qx, qy), 0) - RIM_R


def _groove_dist(P):
    """Long capsule across the full diameter (along X) on the top face. Its axis
    follows the dome and stays level beyond the core, so it exits through the
    rounded rim corner and leaves a small soft notch on both edges."""
    x, y, z = P[:, 0], P[:, 1], P[:, 2]
    gr = GROOVE_W / 2
    surf = HALF_FLAT + RIM_R + _top_z(np.abs(x))
    zc = surf - GROOVE_D + gr
    return np.hypot(y, z - zc) - gr


def sdf(P):
    d1 = _tablet_dist(P)
    d2 = _groove_dist(P)
    # smooth subtraction: max(d1, -d2) with a soft blend
    h = np.clip(0.5 - 0.5 * (d1 + d2) / GROOVE_K, 0.0, 1.0)
    return d1 * (1 - h) + (-d2) * h + GROOVE_K * h * (1 - h)


def carve_groove(P):
    """Score line: planar V-groove across the full diameter (along X).
    The floor is a straight horizontal line at z = face centre - GROOVE_D, so it
    reads perfectly straight and exits through the rim corners as a notch.
    Two flat walls at +-GROOVE_ANGLE/2 from vertical; tiny floor rounding and a
    tiny convex shoulder bevel (smooth min), no lips, nothing concave-curved.
    Applied as a height clamp of the top vertices (the voxel grid is aligned with
    the groove, so walls and creases fall on clean vertex rows)."""
    y, z = P[:, 1], P[:, 2]
    floor = HALF_FLAT + RIM_R + DOME - GROOVE_D
    slope = 1.0 / math.tan(math.radians(GROOVE_ANGLE_DEG / 2))
    v = floor + slope * (np.sqrt(y * y + GROOVE_FLOOR_R ** 2) - GROOVE_FLOOR_R)
    k = GROOVE_BEVEL
    h = np.clip(0.5 + 0.5 * (v - z) / k, 0.0, 1.0)
    zn = v * (1 - h) + z * h - k * h * (1 - h)            # smooth min(z, v): convex bevel
    Q = P.copy()
    top = z > 0
    Q[top, 2] = np.minimum(z[top], zn[top])
    return Q


def project(P, iters=16, sdf=sdf):
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


def build_tablet(name):
    bm = bmesh.new()
    bmesh.ops.create_uvsphere(bm, u_segments=64, v_segments=32, radius=1.0,
                              matrix=Matrix.Diagonal((RADIUS * 1.02, RADIUS * 1.02, THICK / 2 * 1.05, 1)))
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    obj = bpy.data.objects.new(name, me)
    bpy.context.scene.collection.objects.link(obj)
    # first pass without the groove: a coarse pass would bridge the thin groove
    # and the fine remesh would keep those bridges as walls
    _remesh(obj, 0.02)
    _set_co(obj.data, project(_get_co(obj.data), sdf=_tablet_dist))
    _remesh(obj, VOXEL)
    _set_co(obj.data, project(_get_co(obj.data), sdf=_tablet_dist))
    _set_co(obj.data, carve_groove(_get_co(obj.data)))
    obj.data.shade_smooth()
    sub = obj.modifiers.new("Subsurf", "SUBSURF")
    sub.levels = SUBSURF_VIEW
    sub.render_levels = SUBSURF_RENDER
    return obj


def _pose():
    tilt = VIEW_ELEVATION_DEG - ct.CAM_ELEVATION_DEG   # top normal tilts toward the camera (-Y)
    # in-plane angle whose projection at the view elevation is SCREEN_ANGLE_DEG
    spin = math.degrees(math.atan(math.tan(math.radians(SCREEN_ANGLE_DEG))
                                  / math.sin(math.radians(VIEW_ELEVATION_DEG))))
    return (Matrix.Rotation(math.radians(tilt), 4, "X")
            @ Matrix.Rotation(math.radians(spin), 4, "Z"))


def _add_grain(mat):
    """Chalky grain: fine noise bump on the clay normal (icon-level only)."""
    nt = mat.node_tree
    bsdf = nt.nodes["Principled BSDF"]
    tc = nt.nodes.new("ShaderNodeTexCoord")
    noise = nt.nodes.new("ShaderNodeTexNoise")
    noise.inputs["Scale"].default_value = GRAIN_SCALE
    noise.inputs["Detail"].default_value = 4.0
    bump = nt.nodes.new("ShaderNodeBump")
    bump.inputs["Strength"].default_value = GRAIN_STRENGTH
    bump.inputs["Distance"].default_value = 0.002
    nt.links.new(tc.outputs["Object"], noise.inputs["Vector"])
    nt.links.new(noise.outputs["Fac"], bump.inputs["Height"])
    nt.links.new(bump.outputs["Normal"], bsdf.inputs["Normal"])


def _add_groove_ao(mat):
    """Cavity darkening: base colour x (1 - GROOVE_AO * (1 - AO)), local AO only."""
    nt = mat.node_tree
    bsdf = nt.nodes["Principled BSDF"]
    src = bsdf.inputs["Base Color"].links[0].from_socket
    ao = nt.nodes.new("ShaderNodeAmbientOcclusion")
    ao.only_local = True
    ao.samples = 16
    ao.inputs["Distance"].default_value = 0.05
    inv = nt.nodes.new("ShaderNodeMath")
    inv.operation = "SUBTRACT"
    inv.inputs[0].default_value = 1.0
    mul = nt.nodes.new("ShaderNodeMix")
    mul.data_type = "RGBA"
    mul.blend_type = "MULTIPLY"
    mul.inputs["B"].default_value = (0.80, 0.78, 0.76, 1.0)
    fac = nt.nodes.new("ShaderNodeMath")
    fac.operation = "MULTIPLY"
    fac.inputs[1].default_value = GROOVE_AO / 0.2
    nt.links.new(ao.outputs["AO"], inv.inputs[1])
    nt.links.new(inv.outputs["Value"], fac.inputs[0])
    nt.links.new(fac.outputs["Value"], mul.inputs["Factor"])
    nt.links.new(src, mul.inputs["A"])
    nt.links.new(mul.outputs["Result"], bsdf.inputs["Base Color"])


def _part_mask_material(obj):
    """Measurement helper: emission R = top face, G = side band, B = score line."""
    mat = bpy.data.materials.new("PartMask")
    mat.use_nodes = True
    nt = mat.node_tree
    nt.nodes.clear()
    out = nt.nodes.new("ShaderNodeOutputMaterial")
    em = nt.nodes.new("ShaderNodeEmission")
    attr = nt.nodes.new("ShaderNodeAttribute")
    attr.attribute_name = "part"
    nt.links.new(attr.outputs["Color"], em.inputs["Color"])
    nt.links.new(em.outputs["Emission"], out.inputs["Surface"])
    me = obj.data
    P = _get_co(me)
    nrm = np.empty(len(me.vertices) * 3)
    me.vertices.foreach_get("normal", nrm)
    nrm = nrm.reshape(-1, 3)
    groove = (np.abs(P[:, 1]) < GROOVE_W * 0.5) & (np.abs(P[:, 0]) < CORE * 0.8) & (P[:, 2] > 0)
    print("GROOVE_VERTS", int(groove.sum()))
    top = (nrm[:, 2] > 0.8) & ~groove
    col = np.zeros((len(P), 4), dtype=np.float32)
    col[:, 3] = 1
    col[top, 0] = 1
    col[~top & ~groove, 1] = 1
    col[groove, 2] = 1
    a = me.color_attributes.new("part", "FLOAT_COLOR", "POINT")
    a.data.foreach_set("color", col.ravel())
    obj.data.materials.clear()
    obj.data.materials.append(mat)
    obj.modifiers["Subsurf"].render_levels = 0
    bpy.context.scene.view_settings.view_transform = "Standard"


def main():
    argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    out_dir = argv[0] if argv else os.path.join(os.path.dirname(HERE), "out", "protocol-pill")
    os.makedirs(out_dir, exist_ok=True)
    ct.reset_scene()

    pill = build_tablet("Tablet")
    pill.matrix_world = _pose()
    bpy.context.view_layer.update()
    mat = ct.clay("ClayPill", PILL_HEX)
    _add_grain(mat)
    _add_groove_ao(mat)
    pill.data.materials.append(mat)

    ct.setup_scene([pill])
    # icon-level light override (theme untouched): the theme's low frontal fill
    # would light the side band flat; the reference keeps it in shadow.
    fill = bpy.data.objects.get("Fill")
    if fill is not None:
        fill.data.energy = PILL_FILL_ENERGY
    key = bpy.data.objects["Key"]
    key.data.energy = PILL_KEY_ENERGY
    key.data.temperature = PILL_KEY_KELVIN
    # closer key (same direction): falloff gives the top face its upper-left gradient
    tgt = key.location + (key.matrix_world.to_3x3() @ Vector((0, 0, -1))) * ct.KEY_DISTANCE
    key.location = tgt + (key.matrix_world.to_3x3() @ Vector((0, 0, 1))) * PILL_KEY_DISTANCE
    k2d = bpy.data.lights.new("Key2", "AREA")
    k2d.size = KEY2_SIZE
    k2d.energy = KEY2_ENERGY
    k2d.use_temperature = True
    k2d.temperature = PILL_KEY_KELVIN
    k2 = bpy.data.objects.new("Key2", k2d)
    bpy.context.scene.collection.objects.link(k2)
    k2.location = Vector(tgt) + ct._dir_from_angles(*KEY2_AZ_EL) * KEY2_DISTANCE
    ct._point_at(k2, tgt)
    ramp = next(n for n in bpy.context.scene.world.node_tree.nodes if n.type == "VALTORGB")
    ramp.color_ramp.elements[0].color = ct.srgb_hex_to_linear(PILL_WORLD_LOW_HEX)
    bpy.context.scene.world.node_tree.nodes["Background"].inputs["Strength"].default_value = PILL_WORLD
    ct.print_poly_counts([pill])
    if os.environ.get("CLAY_PART_MASK"):  # helper for colour measurement
        _part_mask_material(pill)
        bpy.context.scene.cycles.samples = 1
        bpy.context.scene.cycles.use_denoising = False
        ct.render(os.path.join(out_dir, "part-mask.png"))
        return

    t = ct.render(os.path.join(out_dir, "protocol-pill.png"))
    if not os.environ.get("CLAY_NO_BLEND"):
        ct.save_blend(os.path.join(out_dir, "protocol-pill.blend"))
    print("TIMES", {"protocol-pill": round(t, 1)})


main()
