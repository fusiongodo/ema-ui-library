"""Shared SDF mesh kit for the clay icons #18 reaction and #19 ask (same method as
calendar / scores / dual_n_back, which keep their own copies).

SDF -> rough start mesh -> voxel remesh -> Newton projection; colours as a per-vertex
"zone" attribute (normal-direction gradients), a "part" attribute for colour masks,
icon-level light overrides. Units: icon width ~ 1.0; X right, Z up, front at -Y.
"""
import math
import os

import bmesh
import bpy
import numpy as np
from mathutils import Matrix, Vector

import clay_theme as ct


def ss(e0, e1, x):
    t = np.clip((x - e0) / (e1 - e0), 0.0, 1.0)
    return t * t * (3 - 2 * t)


def rrect(px, pz, hx, hz, r):
    qx, qz = np.abs(px) - hx + r, np.abs(pz) - hz + r
    return np.hypot(np.maximum(qx, 0), np.maximum(qz, 0)) + np.minimum(np.maximum(qx, qz), 0) - r


def extrude(s, y, yc, half, r):
    """Rounded extrusion of a 2D SDF s along y (edge radius r)."""
    wx = s + r
    wy = np.abs(y - yc) - half + r
    return (np.minimum(np.maximum(wx, wy), 0)
            + np.hypot(np.maximum(wx, 0), np.maximum(wy, 0)) - r)


def smin(a, b, k):
    h = np.clip(0.5 + 0.5 * (b - a) / k, 0.0, 1.0)
    return b * (1 - h) + a * h - k * h * (1 - h)


def seg2(px, pz, ax, az, bx, bz):
    """2D distance to the segment a-b."""
    dx, dz = bx - ax, bz - az
    t = np.clip(((px - ax) * dx + (pz - az) * dz) / (dx * dx + dz * dz), 0, 1)
    return np.hypot(px - ax - t * dx, pz - az - t * dz)


def project(P, sdf, iters=16):
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


def get_co(me):
    co = np.empty(len(me.vertices) * 3)
    me.vertices.foreach_get("co", co)
    return co.reshape(-1, 3)


def set_co(me, P):
    me.vertices.foreach_set("co", P.astype(np.float32).ravel())
    me.update()


def normals(me):
    n = np.empty(len(me.vertices) * 3)
    me.vertex_normals.foreach_get("vector", n)
    return n.reshape(-1, 3)


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


def _link(name, bm):
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    obj = bpy.data.objects.new(name, me)
    bpy.context.scene.collection.objects.link(obj)
    return obj


def cube_start(name, lo, hi):
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0)
    bmesh.ops.subdivide_edges(bm, edges=bm.edges[:], cuts=24, use_grid_fill=True)
    lo, hi = np.array(lo), np.array(hi)
    for v in bm.verts:
        v.co = Vector((np.array(v.co) + 0.5) * (hi - lo) + lo)
    return _link(name, bm)


def torus_start(name, R, r, n=160, k=32):
    """Genus-1 start mesh (no membrane in the hole): torus around the Y axis."""
    bm = bmesh.new()
    rings = []
    for i in range(n):
        a = 2 * math.pi * i / n
        rings.append([bm.verts.new(((R + r * math.cos(b)) * math.cos(a), r * math.sin(b),
                                    (R + r * math.cos(b)) * math.sin(a)))
                      for b in np.linspace(0, 2 * math.pi, k, endpoint=False)])
    for i in range(n):
        A, B = rings[i], rings[(i + 1) % n]
        for j in range(k):
            bm.faces.new((A[j], A[(j + 1) % k], B[(j + 1) % k], B[j]))
    return _link(name, bm)


def build(name, sdf, lo=None, hi=None, voxel=0.004, coarse=0.015, start=None):
    obj = start(name) if start else cube_start(name, lo, hi)
    set_co(obj.data, project(get_co(obj.data), sdf, iters=40))
    _remesh(obj, coarse)
    set_co(obj.data, project(get_co(obj.data), sdf))
    _remesh(obj, voxel)
    set_co(obj.data, project(get_co(obj.data), sdf))
    obj.data.shade_smooth()
    return obj


def join(name, objs):
    """Join already coloured meshes into one object (attributes are kept)."""
    bm = bmesh.new()
    for o in objs:
        bm.from_mesh(o.data)
    obj = _link(name, bm)
    obj.data.shade_smooth()
    for o in objs:
        old = o.data
        bpy.data.objects.remove(o)
        bpy.data.meshes.remove(old)
    return obj


def lin(h):
    return np.array(ct.srgb_hex_to_linear(h)[:3])


def graded(base_hex, light, dark, nz):
    """Base colour mixed toward light (hex, weight) on up-facing and dark on down-facing normals."""
    (lh, lw), (dh, dw) = light, dark
    wl = (lw * ss(0.0, 0.9, nz))[:, None]
    wd = (dw * ss(-0.1, -0.9, nz))[:, None]
    return lin(base_hex) * (1 - wl - wd) + lin(lh) * wl + lin(dh) * wd


def set_colors(obj, rgb_linear, part_rgb):
    """rgb_linear: (n, 3) zone colours; part_rgb: (n, 3) mask colours (or one triple)."""
    me = obj.data
    n = len(me.vertices)
    col = np.ones((n, 4), dtype=np.float32)
    col[:, :3] = np.clip(rgb_linear, 0, 1)
    a = me.color_attributes.new("zone", "FLOAT_COLOR", "POINT")
    a.data.foreach_set("color", col.ravel())
    m = np.ones((n, 4), dtype=np.float32)
    m[:, :3] = np.broadcast_to(np.asarray(part_rgb, dtype=np.float32), (n, 3))
    a = me.color_attributes.new("part", "FLOAT_COLOR", "POINT")
    a.data.foreach_set("color", m.ravel())


def zone_material(name, sheen, sss_scale=0.008):
    mat = ct.clay(name, "#EEEAE2", sss_scale=sss_scale)
    nt = mat.node_tree
    attr = nt.nodes.new("ShaderNodeAttribute")
    attr.attribute_name = "zone"
    mix = nt.nodes["EdgeMix"]
    nt.links.new(attr.outputs["Color"], mix.inputs["A"])
    nt.links.new(attr.outputs["Color"], mix.inputs["B"])   # no grazing lift: cream would clip
    nt.nodes["Principled BSDF"].inputs["Sheen Weight"].default_value = sheen
    return mat


def part_mask(objs):
    mat = bpy.data.materials.new("MaskPart")
    mat.use_nodes = True
    nt = mat.node_tree
    nt.nodes.clear()
    out = nt.nodes.new("ShaderNodeOutputMaterial")
    em = nt.nodes.new("ShaderNodeEmission")
    attr = nt.nodes.new("ShaderNodeAttribute")
    attr.attribute_name = "part"
    nt.links.new(attr.outputs["Color"], em.inputs["Color"])
    nt.links.new(em.outputs["Emission"], out.inputs["Surface"])
    for o in objs:
        o.data.materials.clear()
        o.data.materials.append(mat)


def tilt(objs, elevation_deg):
    M = Matrix.Rotation(math.radians(elevation_deg - ct.CAM_ELEVATION_DEG), 4, "X")
    for o in objs:
        o.matrix_world = M
    bpy.context.view_layer.update()


def light_overrides(fill="30", key=None, world=None, rim=4.0, low="#9A8E84"):
    """Icon-level light tweaks as calendar / scores (theme untouched)."""
    if fill is not None and bpy.data.objects.get("Fill"):
        bpy.data.objects["Fill"].data.energy = float(fill)
    if key is not None:
        bpy.data.objects["Key"].data.energy = float(key)
    bpy.data.objects["Rim"].data.energy = float(rim)
    wnt = bpy.context.scene.world.node_tree
    if world is not None:
        wnt.nodes["Background"].inputs["Strength"].default_value = float(world)
    if low:
        ramp = next(n for n in wnt.nodes if n.type == "VALTORGB")
        ramp.color_ramp.elements[0].color = ct.srgb_hex_to_linear(low)


def finish(objs, out_dir, slug):
    """Poly counts, then part mask (CLAY_PART_MASK=1) or the render + .blend."""
    ct.print_poly_counts(objs)
    print("POLYS total", sum(len(o.data.polygons) for o in objs))
    if os.environ.get("CLAY_PART_MASK"):
        part_mask(objs)
        bpy.context.scene.cycles.samples = 1
        bpy.context.scene.cycles.use_denoising = False
        ct.render(os.path.join(out_dir, "part-mask.png"))
        return
    t = ct.render(os.path.join(out_dir, slug + ".png"))
    if not os.environ.get("CLAY_NO_BLEND"):
        ct.save_blend(os.path.join(out_dir, slug + ".blend"))
    print("TIMES", {slug: round(t, 1)})
