"""protocol-supplement-tab: a plain supplement tablet (no score line) on the protocol-pill tile.

Spec (Alex, 21 Nov 2026): also just a cylinder, gently domed on top, smaller diameter than the
medication tablet (protocol-pill) and a bit taller, no score line; white with a very faint beige
shift, so it differs only slightly from the medication.
Geometry relative to protocol-pill (diameter 1.0): diameter 0.72, total height 0.42, dome 0.05,
rim radius 0.08 (straight side band between). Pose, light, material (chalky grain) and the cast
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
RIM_R = 0.08                 # edge round-over
THICK = 0.42                 # total height incl. both domes (protocol-pill: 0.36)
DOME = 0.05                  # dome height above the rim plane (top and bottom)
HALF_FLAT = THICK / 2 - DOME - RIM_R   # 0.08: half-height of the straight side band
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

VOXEL = float(os.environ.get("CLAY_VOXEL", "0.004"))


def _top_z(r):
    t = np.clip(1.0 - (r / CORE) ** 2, 0.0, 1.0)
    return DOME * t * t


def sdf(P):
    x, y, z = P[:, 0], P[:, 1], P[:, 2]
    r = np.hypot(x, y)
    qx = r - CORE
    qy = np.abs(z) - _top_z(r) - HALF_FLAT
    out = np.hypot(np.maximum(qx, 0), np.maximum(qy, 0))
    return out + np.minimum(np.maximum(qx, qy), 0) - RIM_R


def build_tablet(name):
    bm = bmesh.new()
    bmesh.ops.create_uvsphere(bm, u_segments=64, v_segments=32, radius=1.0,
                              matrix=Matrix.Diagonal((RADIUS * 1.02, RADIUS * 1.02, THICK / 2 * 1.05, 1)))
    obj = k._link(name, bm)
    k._remesh(obj, 0.02)
    k.set_co(obj.data, k.project(k.get_co(obj.data), sdf))
    k._remesh(obj, VOXEL)
    k.set_co(obj.data, k.project(k.get_co(obj.data), sdf))
    obj.data.shade_smooth()
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
