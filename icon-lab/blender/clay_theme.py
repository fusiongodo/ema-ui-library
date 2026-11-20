"""Shared clay look for all EMA icons rendered in Blender.

Everything that defines the look lives here: material, lights, world, camera,
render settings, cast-shadow parameters, render(). Icon scripts (icons/*.py) only build
geometry and then call `setup_scene(objects)` and `render(path)`.

Conventions (Blender world space):
  X = right, Z = up, Y = depth (camera looks along +Y, so "behind" = +Y).
"""
import math
import os
import time

try:  # composite.py imports this module outside Blender for the tile constants
    import bpy
    import numpy as np
    from mathutils import Vector
except ImportError:
    bpy = None

# ---------------------------------------------------------------- tunables
# Engine: Cycles (see README "Engine" for the EEVEE comparison). CLAY_ENGINE=EEVEE for tests.
ENGINE = os.environ.get("CLAY_ENGINE", "CYCLES").upper()
SAMPLES = int(os.environ.get("CLAY_SAMPLES", "128"))   # max samples; adaptive sampling stops earlier
RESOLUTION = int(os.environ.get("CLAY_RES", "1024"))
# Standard, not AgX: AgX turned the cream grey and dulled the pastels.
VIEW_TRANSFORM = os.environ.get("CLAY_VIEW", "Standard")

CAM_ELEVATION_DEG = 15.0
CAM_YAW_DEG = 0.0
FRAME_FILL = 0.70        # object group width (bubbles + tails) / render frame width
# Tile compositing (used by composite.py)
TILE_ICON_WIDTH = 0.66   # object group width / tile width (shadow excluded)
ICON_ON_TILE = TILE_ICON_WIDTH / FRAME_FILL  # render frame size / tile size
TILE_RADIUS_FRAC = 22 / 96
# Cast shadow, made in composite.py from the render's alpha (no shadow catcher):
SHADOW_OFFSET = (0.020, 0.035)  # x, y as share of the tile (down-right)
SHADOW_BLUR = 0.020             # Gaussian blur radius as share of the tile
SHADOW_OPACITY = 0.22
SHADOW_TINT = 0.70              # shadow colour = tile colour x this

# Key from above, slightly left: on screen the light comes from ~100 deg
# (90 = straight up, 180 = left). Large so the lit-to-shadow gradient is broad.
KEY_AZIMUTH_DEG = float(os.environ.get("CLAY_KEY_AZ", "-25"))  # negative = camera left
KEY_ELEVATION_DEG = float(os.environ.get("CLAY_KEY_EL", "65"))
KEY_SIZE = float(os.environ.get("CLAY_KEY_SIZE", "8"))
KEY_DISTANCE = 6.0
KEY_ENERGY = float(os.environ.get("CLAY_KEY", "25"))
KEY_KELVIN = float(os.environ.get("CLAY_KELVIN", "5200"))

# World fill: near-neutral, only very slightly cool. Vertical gradient: WORLD_HEX
# from above, WORLD_LOW_HEX from below (a soft "ground" so undersides darken).
WORLD_HEX = os.environ.get("CLAY_WORLD_HEX", "#ECEBEE")
WORLD_LOW_HEX = os.environ.get("CLAY_WORLD_LOW_HEX", "#8E8A86")
WORLD_STRENGTH = float(os.environ.get("CLAY_WORLD", "1.1"))
ROUGHNESS = 0.65
SPECULAR = 0.30
SHEEN = float(os.environ.get("CLAY_SHEEN", "0.40"))            # soft luminous edge (fresnel glow)
SHEEN_ROUGHNESS = float(os.environ.get("CLAY_SHEEN_R", "0.40"))
# Facing-angle rim: base colour mixed toward a lighter version (value x EDGE_LIFT)
# only at grazing angles -> soft luminous edge, never a hard outline.
EDGE_LIFT = float(os.environ.get("CLAY_EDGE_LIFT", "1.08"))
EDGE_FROM = float(os.environ.get("CLAY_EDGE_FROM", "0.55"))  # Layer Weight "Facing" where the lift starts
SSS_WEIGHT = 0.08
SSS_RADIUS = tuple(float(v) for v in os.environ.get("CLAY_SSS_R", "1.0,0.75,0.55").split(","))  # warm scatter

RIM_ENERGY = float(os.environ.get("CLAY_RIM", "10"))
RIM_COLOR = (0.80, 0.88, 1.0)
# Frontal-top soft fill: lifts the top third of the front faces toward cream.
FILL_ENERGY = float(os.environ.get("CLAY_FILL", "50"))
FILL_KELVIN = 6500.0
FILL_SIZE = 6.0
FILL_AZ_EL = (0.0, float(os.environ.get("CLAY_FILL_EL", "10")))



# Dusty area palette (lightness/chroma from the reference board, our own area hues).
# AREAS: tile colours. ACCENTS: the second object of an icon (e.g. the back bubble).
AREAS = {
    "today": "#E1C29E",
    "checkins": "#A9D4B9",
    "protocols": "#BFC4EF",
    "insights": "#E2B9D5",
    "voice": "#9CD5CD",
}
ACCENTS = {
    "today": "#CABDAE",
    "checkins": "#B2C4B9",
    "protocols": "#BBBED0",
    "insights": "#CBB9C5",
    "voice": "#AEC5C1",
}


# Fixed reference colours (sRGB) measured from refs/<icon>.png. Decision by Alex:
# icon #7 checkin-chat uses exactly these, not the AREAS/ACCENTS palette.
# front/back are the target RENDER colours (lit / mid / deepest shadow);
# the material base colours that produce them live in the icon script.
REFERENCE = {
    "checkin-chat": {
        "tile": "#E6BFA2",                       # dusty apricot
        "front": {"lit": "#EAE6E3", "mid": "#DDD8D2", "shadow": "#A69EA9"},
        "back": {"lit": "#C4BBCC", "shadow": "#BCB5C5"},
    },
    "protocol-pill": {
        "tile": "#AFB5E5",                       # periwinkle
        "top": {"lit": "#F7F2EC", "mid": "#E8E5E0"},
        "side_shadow": "#BBB2AB",                # side band, right/lower right
        "score": "#E0DBD5",                      # score line at its deepest
        "tile_icon_width": 0.55,                 # tablet width / tile width
    },
    "log-scores": {
        "tile": "#9EC2E4",                       # soft sky blue
        "face_mid": "#E7E6E2",                   # paper sheet, middle
        "rim": {"lit": "#F0EFEB", "right": "#D9D5CC", "bottom": "#CCC8BF"},
        "border": {"left": "#E0DDD8", "right": "#D9D5CC", "bottom": "#CCC8BF"},  # exposed board
        "clip": {"lit": "#CA968B", "mid": "#C28D89", "shadow": "#B07C75"},
        # the camera frames the larger extent (here the height): object height / tile
        "tile_icon_width": 0.56,
    },
    "wellbeing": {
        "tile": "#97CACB",                       # soft teal
        "top": {"lit": "#E3CDB8", "mid": "#CAA98A", "shadow": "#957441"},     # tan pebble
        "middle": {"lit": "#F2EDE9", "mid": "#E2DFDA", "shadow": "#C3BDB1"},
        "bottom": {"lit": "#EDE8E2", "mid": "#DEDBD6", "shadow": "#BEB6AB"},
        "crease": "#978F82",                     # contact crease between pebbles
        "tile_icon_width": 0.50,                 # stack width / tile width
    },
    "steps": {
        "tile": "#E1CABC",                       # dusty blush
        "cream": {"lit": "#F5EFE8", "mid": "#E5E0DA", "shadow": "#D9D2C8"},  # upper, toe cap, tongue
        "light": {"mid": "#F8F3EE"},             # collar roll, lining, laces
        "heel": {"mid": "#E3CDB8"},              # heel counter patch, light sand
        "crease": "#C1B7AD",                     # between parts
        "sole": {"lit": "#D8B69B", "mid": "#BD9770", "shadow": "#98754D"},   # midsole
        "lugs": {"mid": "#9A7550"},              # outsole lugs
        "tile_icon_width": 0.60,                 # shoe width / tile width
        "model": ("tuki model", "clay-board/tuki-clay-running.png"),  # shape model (CC0), sheet row 1
    },
    "sleep": {
        "tile": "#D3CEE5",                       # pale lavender
        "cloud": {"lit": "#F5F1F0", "mid": "#E3DFDC", "shadow": "#BFB7B4"},   # warm white
        "moon": {"lit": "#BDB2D0", "mid": "#9A8CAD", "shadow": "#7E7393"},    # lilac
        "tile_icon_width": 0.60,                 # cloud + moon width / tile width
    },
    "pain": {
        "tile": "#B9D6C8",                       # soft sage mint
        "head": {"lit": "#F3EEE8", "mid": "#E3DED8", "shadow": "#C2BAB1"},    # warm cream
        "coral": {"lit": "#F6AE9E", "mid": "#EE8E7C", "shadow": "#D46E5E"},   # burst + rays
        "glow": "#F0B7A8",                       # blush on the head at its peak
        # the camera frames the larger extent (here the height): group height / tile
        "tile_icon_width": 0.58,
    },
    "protocol-injection": {
        "tile": "#9BBC9D",                       # sage green
        "cream": {"lit": "#F1F2EC", "mid": "#DBD4CA", "shadow": "#C5BCAE"},  # barrel, flange, hub, needle
        "marks": "#BDB3A6",                      # graduation marks, soft
        "lilac": {"lit": "#C2AFCF", "mid": "#9389A1", "shadow": "#736481"},  # plunger rod, thumb cap
        "tile_icon_width": 0.63,                 # syringe bbox width / tile width
    },
    "calendar": {
        "tile": "#F4DBD6",                       # pale pink
        "body": {"lit": "#F4F3F1", "mid": "#EEE9E8", "shadow": "#D1CEC9"},    # warm white slab
        "header": {"lit": "#F2A396", "mid": "#EC8E84", "shadow": "#D27B71"},  # coral
        "cells": {"lit": "#CECAC7", "mid": "#C8C4C1", "shadow": "#BFBBB8"},   # warm grey day cells
        "today": {"lit": "#F09A88", "mid": "#E98A78", "shadow": "#DB8270"},   # coral today cell
        "rings": {"lit": "#E6DADA", "mid": "#D3C9C7", "shadow": "#B5B0AC"},
        # the camera frames the larger extent (here the height incl. rings): height / tile
        "tile_icon_width": 0.595,
    },
    "guide": {
        "tile": "#A0C1E0",                       # soft blue
        "glass": {"lit": "#F5F0EA", "mid": "#DFDED9", "shadow": "#CDC9BE"},  # warm white clay, opaque
        "base": {"lit": "#DFC0AE", "mid": "#BA8E73", "shadow": "#9B6E57"},   # terracotta rings + cap
        # flat ring drawn in composite.py (opt-in): centre-line radius, stroke width (tile fractions)
        "ring": {"color": "#E6C7AB", "radius": 0.37, "width": 0.036},
        # the camera frames the larger extent (here the height): bulb height / tile
        "tile_icon_width": 0.48,
    },
}


# ---------------------------------------------------------------- helpers
def srgb_hex_to_linear(hex_str):
    hex_str = hex_str.lstrip("#")
    out = []
    for i in (0, 2, 4):
        c = int(hex_str[i:i + 2], 16) / 255.0
        out.append(c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4)
    return (*out, 1.0)


def clay(name, hex_color, sss_scale=0.05, sss_weight=None):
    """Matte clay material. Only the colour differs between icons."""
    mat = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    col = srgb_hex_to_linear(hex_color)
    bsdf.inputs["Base Color"].default_value = col
    bsdf.inputs["Metallic"].default_value = 0.0
    bsdf.inputs["Roughness"].default_value = ROUGHNESS
    bsdf.inputs["Specular IOR Level"].default_value = SPECULAR
    bsdf.inputs["Coat Weight"].default_value = 0.0
    bsdf.inputs["Subsurface Weight"].default_value = SSS_WEIGHT if sss_weight is None else sss_weight
    # Subsurface colour = base colour (Principled v2 uses Base Color for SSS);
    # equal radius per channel so the scatter does not tint the edge.
    bsdf.inputs["Subsurface Radius"].default_value = SSS_RADIUS
    bsdf.inputs["Subsurface Scale"].default_value = sss_scale
    bsdf.inputs["Sheen Weight"].default_value = SHEEN
    bsdf.inputs["Sheen Tint"].default_value = (1.0, 1.0, 1.0, 1.0)
    bsdf.inputs["Sheen Roughness"].default_value = SHEEN_ROUGHNESS
    _edge_glow(mat, hex_color)
    mat.diffuse_color = col
    return mat


def _lighter_hex(hex_color, lift):
    import colorsys
    h = hex_color.lstrip("#")
    r, g, b = (int(h[i:i + 2], 16) / 255 for i in (0, 2, 4))
    hh, ss, vv = colorsys.rgb_to_hsv(r, g, b)
    r, g, b = colorsys.hsv_to_rgb(hh, ss, min(1.0, vv * lift))
    return "#%02X%02X%02X" % tuple(round(c * 255) for c in (r, g, b))


def _edge_glow(mat, hex_color):
    nt = mat.node_tree
    bsdf = nt.nodes["Principled BSDF"]
    lw = nt.nodes.new("ShaderNodeLayerWeight")
    lw.inputs["Blend"].default_value = 0.5
    rng = nt.nodes.new("ShaderNodeMapRange")
    rng.interpolation_type = "SMOOTHSTEP"
    rng.inputs["From Min"].default_value = EDGE_FROM
    rng.inputs["From Max"].default_value = 1.0
    mix = nt.nodes.new("ShaderNodeMix")
    mix.name = "EdgeMix"
    mix.data_type = "RGBA"
    mix.inputs["A"].default_value = srgb_hex_to_linear(hex_color)
    mix.inputs["B"].default_value = srgb_hex_to_linear(_lighter_hex(hex_color, EDGE_LIFT))
    nt.links.new(lw.outputs["Facing"], rng.inputs["Value"])
    nt.links.new(rng.outputs["Result"], mix.inputs["Factor"])
    nt.links.new(mix.outputs["Result"], bsdf.inputs["Base Color"])


def set_clay_color(mat, hex_color):
    col = srgb_hex_to_linear(hex_color)
    mat.node_tree.nodes["Principled BSDF"].inputs["Base Color"].default_value = col
    mat.diffuse_color = col


def reset_scene():
    bpy.ops.wm.read_factory_settings(use_empty=True)


def _dir_from_angles(az_deg, el_deg):
    """Unit vector from target toward a light/camera. az 0 = camera side (-Y)."""
    az, el = math.radians(az_deg), math.radians(el_deg)
    return Vector((math.sin(az) * math.cos(el), -math.cos(az) * math.cos(el), math.sin(el)))


def _point_at(obj, target):
    d = (Vector(target) - obj.location)
    obj.rotation_euler = d.to_track_quat("-Z", "Y").to_euler()


def _world_verts(objs):
    pts = []
    for o in objs:
        me = o.data
        co = np.empty(len(me.vertices) * 3, dtype=np.float64)
        me.vertices.foreach_get("co", co)
        co = co.reshape(-1, 3)
        M = np.array(o.matrix_world)
        pts.append(co @ M[:3, :3].T + M[:3, 3])
    return np.vstack(pts)


# ---------------------------------------------------------------- scene
def _setup_cycles(scene):
    scene.render.engine = "CYCLES"
    prefs = bpy.context.preferences.addons["cycles"].preferences
    try:
        prefs.compute_device_type = "METAL"
        prefs.refresh_devices()
        for d in prefs.devices:
            d.use = True
        scene.cycles.device = "GPU"
    except Exception as e:  # fall back to CPU
        print("GPU setup failed, using CPU:", e)
        scene.cycles.device = "CPU"
    scene.cycles.samples = SAMPLES
    scene.cycles.use_adaptive_sampling = True
    scene.cycles.use_denoising = True
    scene.cycles.denoiser = "OPENIMAGEDENOISE"
    scene.cycles.max_bounces = 8
    scene.cycles.diffuse_bounces = 4
    scene.cycles.sample_clamp_indirect = 3.0  # no fireflies
    scene.render.use_persistent_data = False  # frees scene data after each render


def _setup_eevee(scene):
    scene.render.engine = "BLENDER_EEVEE"
    ee = scene.eevee
    ee.taa_render_samples = SAMPLES
    for attr, val in (("use_raytracing", True), ("shadow_resolution_scale", 0.5),
                      ("use_shadows", True), ("use_volumetric_shadows", False),
                      ("shadow_ray_count", 2), ("shadow_step_count", 6)):
        if hasattr(ee, attr):
            setattr(ee, attr, val)
    rto = getattr(ee, "ray_tracing_options", None)
    if rto is not None:
        rto.resolution_scale = "2"   # half resolution
        if hasattr(rto, "use_denoise"):
            rto.use_denoise = True
    if hasattr(ee, "fast_gi_method"):
        ee.use_fast_gi = True


def setup_render():
    scene = bpy.context.scene
    if ENGINE.startswith("EEVEE"):
        _setup_eevee(scene)
    else:
        _setup_cycles(scene)
    print("ENGINE", scene.render.engine)
    scene.render.film_transparent = True
    scene.render.resolution_x = RESOLUTION
    scene.render.resolution_y = RESOLUTION
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = "PNG"
    scene.render.image_settings.color_mode = "RGBA"
    scene.render.image_settings.color_depth = "8"
    scene.view_settings.view_transform = VIEW_TRANSFORM
    scene.view_settings.look = "None"
    scene.view_settings.exposure = 0.0
    scene.view_settings.gamma = 1.0


def setup_world():
    world = bpy.data.worlds.new("ClayWorld")
    bpy.context.scene.world = world
    world.use_nodes = True
    nt = world.node_tree
    bg = nt.nodes["Background"]
    bg.inputs["Strength"].default_value = WORLD_STRENGTH
    # vertical gradient: direction z -1..1 -> low..high colour
    tc = nt.nodes.new("ShaderNodeTexCoord")
    sep = nt.nodes.new("ShaderNodeSeparateXYZ")
    rng = nt.nodes.new("ShaderNodeMapRange")
    rng.inputs["From Min"].default_value = -0.9
    rng.inputs["From Max"].default_value = -0.1
    ramp = nt.nodes.new("ShaderNodeValToRGB")
    ramp.color_ramp.interpolation = "EASE"
    ramp.color_ramp.elements[0].color = srgb_hex_to_linear(WORLD_LOW_HEX)
    ramp.color_ramp.elements[1].color = srgb_hex_to_linear(WORLD_HEX)
    nt.links.new(tc.outputs["Generated"], sep.inputs["Vector"])
    nt.links.new(sep.outputs["Z"], rng.inputs["Value"])
    nt.links.new(rng.outputs["Result"], ramp.inputs["Fac"])
    nt.links.new(ramp.outputs["Color"], bg.inputs["Color"])


def setup_camera_and_lights(objs):
    """Frame `objs` (list of mesh objects), add key and rim lights.
    No shadow catcher: the cast shadow is added in composite.py."""
    scene = bpy.context.scene
    fwd = -np.array(_dir_from_angles(CAM_YAW_DEG, CAM_ELEVATION_DEG))  # view direction
    right = np.cross(fwd, [0.0, 0.0, 1.0])
    right /= np.linalg.norm(right)
    up = np.cross(right, fwd)
    P = _world_verts(objs)
    u, v, w = P @ right, P @ up, P @ fwd
    cu, cv = (u.min() + u.max()) / 2, (v.min() + v.max()) / 2
    width, height = u.max() - u.min(), v.max() - v.min()
    target = cu * right + cv * up + ((w.min() + w.max()) / 2) * fwd
    target = Vector(target)

    cam_data = bpy.data.cameras.new("Camera")
    cam_data.type = "ORTHO"
    cam_data.ortho_scale = max(width, height) / FRAME_FILL
    cam_data.clip_start = 0.01
    cam_data.clip_end = 100
    cam = bpy.data.objects.new("Camera", cam_data)
    scene.collection.objects.link(cam)
    cam.location = target - Vector(fwd) * 10.0
    cam.rotation_euler = (math.radians(90 - CAM_ELEVATION_DEG), 0, math.radians(CAM_YAW_DEG))
    scene.camera = cam

    # key light: big soft warm area light, from above and slightly left
    for kname, share, shadow, az, el in (
            ("Key", 1.0, True, KEY_AZIMUTH_DEG, KEY_ELEVATION_DEG),):
        key_d = bpy.data.lights.new(kname, "AREA")
        key_d.shape = "SQUARE"
        key_d.size = KEY_SIZE
        key_d.energy = KEY_ENERGY * share
        key_d.use_shadow = shadow
        if hasattr(key_d, "use_shadow_jitter"):  # EEVEE: soft area-light shadows
            key_d.use_shadow_jitter = True
        key_d.use_temperature = True
        key_d.temperature = KEY_KELVIN
        key = bpy.data.objects.new(kname, key_d)
        scene.collection.objects.link(key)
        key.location = target + _dir_from_angles(az, el) * KEY_DISTANCE
        _point_at(key, target)

    if FILL_ENERGY > 0:
        fill_d = bpy.data.lights.new("Fill", "AREA")
        fill_d.size = FILL_SIZE
        fill_d.energy = FILL_ENERGY
        fill_d.use_temperature = True
        fill_d.temperature = FILL_KELVIN
        fill = bpy.data.objects.new("Fill", fill_d)
        scene.collection.objects.link(fill)
        fill.location = target + _dir_from_angles(*FILL_AZ_EL) * KEY_DISTANCE
        _point_at(fill, target)

    # rim: small, weak, cool, behind-right
    rim_d = bpy.data.lights.new("Rim", "AREA")
    rim_d.size = 0.8
    rim_d.energy = RIM_ENERGY
    rim_d.color = RIM_COLOR
    rim = bpy.data.objects.new("Rim", rim_d)
    scene.collection.objects.link(rim)
    rim.location = target + _dir_from_angles(140, 25) * 4.0
    _point_at(rim, target)

    return cam


def setup_scene(objs):
    setup_render()
    setup_world()
    return setup_camera_and_lights(objs)


def render(path):
    bpy.context.scene.render.filepath = path
    t = time.time()
    bpy.ops.render.render(write_still=True)
    dt = time.time() - t
    print(f"RENDERED {path} in {dt:.1f}s")
    return dt


def print_poly_counts(objs):
    """Faces per object in the final render (voxel remesh gives quads, so each
    subdivision render level multiplies by 4)."""
    for o in objs:
        base = len(o.data.polygons)
        lvl = max((m.render_levels for m in o.modifiers if m.type == "SUBSURF"), default=0)
        print(f"POLYS {o.name}: base {base}, render (subsurf {lvl}) {base * 4 ** lvl}")


def save_blend(path):
    """Purge unused data, then save without a .blend1 backup."""
    bpy.data.orphans_purge(do_local_ids=True, do_linked_ids=True, do_recursive=True)
    bpy.context.preferences.filepaths.save_version = 0
    bpy.ops.wm.save_as_mainfile(filepath=path)
