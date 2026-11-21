"""Icon #36 protocol-softgel: one plump amber softgel, lying at ~-20 deg. Supplement kind, on the
protocol-pill tile. Round 2 (Alex, 21 Nov): smooth glossy gelatine, not waxy clay; plump with fully
round ends (fish-oil / vitamin D softgel), not an almond.

Geometry (own; pill_kit.softgel stays as is for #37/#38): blunt ellipsoid, 1.0 long x 0.58 wide (on
screen) x 0.50 high (toward the camera). Long-axis superellipse exponent GEL_N > 2 keeps the ends
round instead of pointed. No seam ridge (it muddied the gloss).
Look: protocol-pill light via pill_kit (same rig as #35) plus an icon-level gelatine material:
low roughness, warm amber subsurface, a light coat. Only the small upper-left key (Key2) and the
rim are mirrored on the surface (the big key and the frontal fill are hidden from glossy rays, they
would wash the gel out), so there is one clear highlight upper left.
Run: ./render.sh protocol_softgel
"""
import os
import sys

import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))
import clay_theme as ct  # noqa: E402
import pill_kit as pk  # noqa: E402
import sdf_kit as k  # noqa: E402

ANGLE_DEG = -20.0
ROLL_DEG = 0.0
VIEW_ELEVATION_DEG = 10.0

GEL_A, GEL_W, GEL_H = 0.50, 0.29, 0.25     # semi-axes: length (x), screen width (z), height (y)
GEL_N = float(os.environ.get("GEL_N", "2.3"))   # long-axis exponent (2 = ellipsoid, higher = blunter)

# Zone colours (base, (light, weight), (dark, weight)) on the normal's z.
GEL_COL = (os.environ.get("GEL_BASE", "#EDB65E"),
           (os.environ.get("GEL_LIGHT", "#F6DA9C"), float(os.environ.get("GEL_LW", "0.55"))),
           (os.environ.get("GEL_DARK", "#E8A23C"), float(os.environ.get("GEL_DW", "0.60"))))
ROUGH = float(os.environ.get("GEL_ROUGH", "0.20"))
SPEC = float(os.environ.get("GEL_SPEC", "0.45"))
SSS_W = float(os.environ.get("GEL_SSS", "0.6"))
SSS_SCALE = float(os.environ.get("GEL_SSS_SCALE", "0.12"))
SSS_RADIUS = (1.0, 0.55, 0.20)              # warm amber scatter
COAT = float(os.environ.get("GEL_COAT", "0.15"))
COAT_ROUGH = float(os.environ.get("GEL_COAT_R", "0.20"))
HIDE_GLOSSY = ("Key", "Fill", "Key2", "Rim")
# Glossy-only softbox (no diffuse light, the rig stays as #35): the one highlight upper left.
SPEC_AZ_EL = tuple(float(v) for v in os.environ.get("GEL_SPEC_AZEL", "-35,62").split(","))
SPEC_SIZE = float(os.environ.get("GEL_SPEC_SIZE", "1.0"))
SPEC_W = float(os.environ.get("GEL_SPEC_W", "50"))
SPEC_DIST = 2.2


def softgel(P, c, R, s):
    L = pk.local(P, c, R, s)
    x, y, z = L[:, 0], L[:, 1], L[:, 2]
    q = np.sqrt((y / GEL_H) ** 2 + (z / GEL_W) ** 2)
    F = (np.abs(x) / GEL_A) ** GEL_N + q ** GEL_N
    return s * (F ** (1.0 / GEL_N) - 1.0) * GEL_H


def gel_material():
    import bpy
    mat = bpy.data.materials.new("Gelatine")
    mat.use_nodes = True
    nt = mat.node_tree
    b = nt.nodes["Principled BSDF"]
    attr = nt.nodes.new("ShaderNodeAttribute")
    attr.attribute_name = "zone"
    nt.links.new(attr.outputs["Color"], b.inputs["Base Color"])
    b.inputs["Roughness"].default_value = ROUGH
    b.inputs["Specular IOR Level"].default_value = SPEC
    b.inputs["IOR"].default_value = 1.45
    b.subsurface_method = "RANDOM_WALK"
    b.inputs["Subsurface Weight"].default_value = SSS_W
    b.inputs["Subsurface Radius"].default_value = SSS_RADIUS
    b.inputs["Subsurface Scale"].default_value = SSS_SCALE
    b.inputs["Sheen Weight"].default_value = 0.0
    b.inputs["Coat Weight"].default_value = COAT
    b.inputs["Coat Roughness"].default_value = COAT_ROUGH
    b.inputs["Coat IOR"].default_value = 1.45
    mat.diffuse_color = ct.srgb_hex_to_linear(GEL_COL[0])
    return mat


def spec_light():
    import bpy
    from mathutils import Vector
    key = bpy.data.objects["Key"]
    tgt = key.location + (key.matrix_world.to_3x3() @ Vector((0, 0, -1))) * 2.5
    d = bpy.data.lights.new("GelSpec", "AREA")
    d.shape = "DISK"
    d.size = SPEC_SIZE
    d.energy = SPEC_W
    d.use_temperature = True
    d.temperature = 6000.0
    o = bpy.data.objects.new("GelSpec", d)
    bpy.context.scene.collection.objects.link(o)
    o.location = Vector(tgt) + ct._dir_from_angles(*SPEC_AZ_EL) * SPEC_DIST
    ct._point_at(o, tgt)
    o.visible_diffuse = False
    o.visible_transmission = False
    o.visible_volume_scatter = False
    d.use_shadow = False


def main():
    import bpy
    argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    out_dir = argv[0] if argv else os.path.join(os.path.dirname(HERE), "out", "protocol-softgel")
    os.makedirs(out_dir, exist_ok=True)
    ct.reset_scene()
    R = pk.rot(yz_deg=ROLL_DEG, xz_deg=ANGLE_DEG)
    c = (0, 0, 0)
    lo, hi = pk.box_around(c, 1.0)
    gel = k.build("Softgel", lambda Q: softgel(Q, c, R, 1.0), lo, hi, 0.004, 0.012)
    pk.color(gel, GEL_COL, (1, 0.5, 0))
    objs = [gel]
    k.tilt(objs, VIEW_ELEVATION_DEG)
    gel.data.materials.append(gel_material())
    ct.setup_scene(objs)
    pk.pill_light()
    for n in HIDE_GLOSSY:
        o = bpy.data.objects.get(n)
        if o is not None:
            o.visible_glossy = False
    spec_light()
    k.finish(objs, out_dir, "protocol-softgel")


if __name__ == "__main__":
    main()
