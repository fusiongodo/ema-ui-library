"""protocol-supplement-tab: a plain supplement tablet (no score line) on the protocol-pill tile.

Spec (Alex, 21 Nov 2026): also just a cylinder, gently domed on top, smaller diameter than the
medication tablet (protocol-pill) and a bit taller, no score line; white with a very faint beige
shift, so it differs only slightly from the medication.
Geometry relative to protocol-pill (diameter 1.0): diameter 0.72, total height 0.42, dome 0.035,
rim radius 0.018 (straight side band between).
Rev. 21 Nov 2026 (Alex): pressed tablet with sharp edges, unlike the medication tablet's soft rim:
rim round-over 0.08 -> 0.018 (just a thin highlight line). Built as an analytic lathe of the
profile (offset of the domed core) instead of a voxel remesh, so the tight rim stays clean. Pose, light, material (chalky grain) and the cast
shadow as protocol_pill.py (icon-level overrides copied, theme untouched).
Run: ./render.sh protocol_supplement_tab
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
import sdf_kit as k  # noqa: E402

# ------------------------------------------------------------ shape params
RADIUS = 0.36                # diameter 0.72 (protocol-pill: 1.0)
RIM_R = 0.018                # edge round-over: pressed-tablet edge, thin highlight only
THICK = 0.42                 # total height incl. both domes (protocol-pill: 0.36)
DOME = 0.035                 # dome height above the rim plane (top and bottom)
HALF_FLAT = THICK / 2 - DOME - RIM_R   # 0.157: half-height of the straight side band
CORE = RADIUS - RIM_R

VIEW_ELEVATION_DEG = 32.0    # as protocol-pill (top face seen at 32 deg)

# Colours: protocol-pill's base with a faint warm beige shift (targets in REFERENCE).
TAB_HEX = os.environ.get("CLAY_TAB_HEX", "#EFE8DC")
# protocol-pill's icon-level light (copied from protocol_pill.py)
FILL_ENERGY = 0.0
KEY_ENERGY = 90.0
KEY_KELVIN = 6000.0
KEY_DISTANCE = 2.5
WORLD = 0.7
WORLD_LOW_HEX = os.environ.get("CLAY_TAB_LOW", "#7A7068")
KEY2_ENERGY, KEY2_SIZE, KEY2_AZ_EL, KEY2_DISTANCE = 22.0, 1.0, (-55.0, 50.0), 1.6
GRAIN_SCALE, GRAIN_STRENGTH = 350.0, 0.25

N_RADIAL = int(os.environ.get("CLAY_TAB_SEG", "320"))   # lathe segments around the axis


def _profile():
    """Upper-half (r, z) profile from the axis to the equator: the domed top of the core offset by
    RIM_R along its normal, the quarter-circle rim, then the straight side down to z = 0."""
    u = np.linspace(0.0, 1.0, 121)[1:-1]
    u = 1.0 - (1.0 - u) ** 1.6                        # denser towards the rim
    r = u * CORE
    t = 1.0 - u * u
    z = HALF_FLAT + DOME * t * t
    dz = -4.0 * DOME * u * t / CORE                   # dz/dr of the dome
    nl = np.hypot(dz, 1.0)
    top = np.stack([r - RIM_R * dz / nl, z + RIM_R / nl], 1)
    a = np.linspace(math.pi / 2, 0.0, 41)             # rim arc (dome slope is 0 at r = CORE)
    arc = np.stack([CORE + RIM_R * np.cos(a), HALF_FLAT + RIM_R * np.sin(a)], 1)
    zs = np.linspace(HALF_FLAT, 0.0, 25)[1:]
    side = np.stack([np.full_like(zs, RADIUS), zs], 1)
    return np.concatenate([top, arc, side])


def build_tablet(name):
    up = _profile()
    prof = np.concatenate([up, up[-2::-1] * [1, -1]])   # mirror to the bottom half
    n, m = len(prof), N_RADIAL
    phi = np.arange(m) * 2 * math.pi / m
    verts = [(0.0, 0.0, THICK / 2), (0.0, 0.0, -THICK / 2)]
    for r, z in prof:
        verts += [(r * math.cos(p), r * math.sin(p), z) for p in phi]
    vi = lambda i, j: 2 + i * m + (j % m)
    faces = [(0, vi(0, j), vi(0, j + 1)) for j in range(m)]
    faces += [(vi(i, j), vi(i + 1, j), vi(i + 1, j + 1), vi(i, j + 1)) for i in range(n - 1) for j in range(m)]
    faces += [(1, vi(n - 1, j + 1), vi(n - 1, j)) for j in range(m)]
    me = bpy.data.meshes.new(name)
    me.from_pydata(verts, [], faces)
    me.validate()
    obj = bpy.data.objects.new(name, me)
    bpy.context.scene.collection.objects.link(obj)
    bm = bmesh.new()
    bm.from_mesh(me)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bm.to_mesh(me)
    bm.free()
    me.shade_smooth()
    return obj


def _add_grain(mat):
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


def _pill_light():
    fill = bpy.data.objects.get("Fill")
    if fill is not None:
        fill.data.energy = FILL_ENERGY
    key = bpy.data.objects["Key"]
    key.data.energy = KEY_ENERGY
    key.data.temperature = KEY_KELVIN
    tgt = key.location + (key.matrix_world.to_3x3() @ Vector((0, 0, -1))) * ct.KEY_DISTANCE
    key.location = tgt + (key.matrix_world.to_3x3() @ Vector((0, 0, 1))) * KEY_DISTANCE
    k2d = bpy.data.lights.new("Key2", "AREA")
    k2d.size = KEY2_SIZE
    k2d.energy = KEY2_ENERGY
    k2d.use_temperature = True
    k2d.temperature = KEY_KELVIN
    k2 = bpy.data.objects.new("Key2", k2d)
    bpy.context.scene.collection.objects.link(k2)
    k2.location = Vector(tgt) + ct._dir_from_angles(*KEY2_AZ_EL) * KEY2_DISTANCE
    ct._point_at(k2, tgt)
    wnt = bpy.context.scene.world.node_tree
    ramp = next(n for n in wnt.nodes if n.type == "VALTORGB")
    ramp.color_ramp.elements[0].color = ct.srgb_hex_to_linear(WORLD_LOW_HEX)
    wnt.nodes["Background"].inputs["Strength"].default_value = WORLD


def _set_part(obj):
    """Mask helper: R = top face (normal z > 0.8), G = rest (side band, rims, bottom)."""
    nz = k.normals(obj.data)[:, 2]
    part = np.zeros((len(nz), 3), dtype=np.float32)
    part[nz > 0.8, 0] = 1
    part[nz <= 0.8, 1] = 1
    k.set_colors(obj, np.ones((len(nz), 3)), part)


def main():
    argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    out_dir = argv[0] if argv else os.path.join(os.path.dirname(HERE), "out", "protocol-supplement-tab")
    os.makedirs(out_dir, exist_ok=True)
    ct.reset_scene()

    tab = build_tablet("SupplementTablet")
    tab.matrix_world = Matrix.Rotation(math.radians(VIEW_ELEVATION_DEG - ct.CAM_ELEVATION_DEG), 4, "X")
    bpy.context.view_layer.update()
    _set_part(tab)
    mat = ct.clay("ClaySupplement", TAB_HEX)
    _add_grain(mat)
    tab.data.materials.append(mat)

    ct.setup_scene([tab])
    _pill_light()
    k.finish([tab], out_dir, "protocol-supplement-tab")


main()
