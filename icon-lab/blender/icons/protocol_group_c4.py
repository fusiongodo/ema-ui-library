"""Icon #38 protocol-group-c4: three pills as one tight round trio, no container.
Round 3 (Alex, 21 Nov): five items were unreadable at list size (~48 px); now three, each larger:
a Coral/Cream two-part capsule (= #35), a plump glossy amber softgel (= #36 round 2: its own
geometry and gelatine material, its reflection-only highlight light) in front, and a plain cream
round tablet (no score line at this size) behind. Overlapping on screen, never intersecting
(check_gaps). Group kind, idea C4 (after refs/group/14).
Look: clay_theme + pill_kit.pill_light, as #35. The softgel gets #36's light treatment via light
linking: the rig lights the clay pills unchanged; copies of the rig with glossy hidden plus the
GelSpec softbox light only the softgel (as in #36, one clear highlight upper left).
Size: the trio fills TRIO_ON_TILE of the tile width (REFERENCE keeps 0.64; the camera is framed
tighter here so composite.py needs no change).
Run: ./render.sh protocol_group_c4
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))
sys.path.insert(0, HERE)
import clay_theme as ct  # noqa: E402
import pill_kit as pk  # noqa: E402
import sdf_kit as k  # noqa: E402
import protocol_softgel as sg  # noqa: E402

VIEW_ELEVATION_DEG = 10.0
TRIO_ON_TILE = 0.70        # trio width / tile width

# centre (x, depth y: - = toward camera, z), rotation (roll, screen angle, yaw) in deg, scale
CAPSULE = ((-0.10, 0.02, 0.13), (0, 40, 12), 0.68)    # upper left, steep diagonal
GEL = ((0.02, -0.22, -0.18), (0, -14, 0), 0.56)        # in front, lower middle
TABLET = ((0.25, 0.18, 0.03), (24, -10, 0), 0.48)      # behind right; top seen at ~34 deg as #5


def _env_override():
    """Optional layout tweaks for test renders: C4_CAP / C4_GEL / C4_TAB = 'x,y,z,roll,ang,yaw,s'."""
    for name in ("CAPSULE", "GEL", "TABLET"):
        v = os.environ.get("C4_" + name[:3])
        if v:
            f = [float(t) for t in v.split(",")]
            globals()[name] = (tuple(f[0:3]), tuple(f[3:6]), f[6])


def _link_lights(clay_objs, gel):
    """Rig lights the clay pills only; glossy-hidden copies (+ GelSpec) light the softgel only."""
    import bpy
    scene = bpy.context.scene

    def coll(name, objs):
        c = bpy.data.collections.new(name)    # not linked to the scene: only a link set
        for o in objs:
            c.objects.link(o)
        return c

    clay_set = coll("LitClay", clay_objs)
    gel_set = coll("LitGel", [gel])
    for n in sg.HIDE_GLOSSY:
        o = bpy.data.objects.get(n)
        if o is None:
            continue
        cp = o.copy()
        cp.data = o.data.copy()
        cp.name = n + "Gel"
        scene.collection.objects.link(cp)
        cp.visible_glossy = False
        cp.light_linking.receiver_collection = gel_set
        o.light_linking.receiver_collection = clay_set
    sg.spec_light()
    bpy.data.objects["GelSpec"].light_linking.receiver_collection = gel_set


def main():
    _env_override()
    argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    out_dir = argv[0] if argv else os.path.join(os.path.dirname(HERE), "out", "protocol-group-c4")
    os.makedirs(out_dir, exist_ok=True)
    ct.reset_scene()

    c, (ro, an, ya), s = CAPSULE
    R = pk.rot(ro, an, ya)
    cap, body = pk.build_capsule("Capsule", c, R, s, pk.CORAL, pk.CREAM, (1, 0, 0), (0, 1, 0), voxel=0.003)
    items = [("Cap", cap, lambda Q, c=c, R=R, s=s: pk.capsule_cap(Q, c, R, s)),
             ("CapB", body, lambda Q, c=c, R=R, s=s: pk.capsule_body(Q, c, R, s))]

    c, (ro, an, ya), s = GEL
    R = pk.rot(ro, an, ya)
    lo, hi = pk.box_around(c, s)
    gel = k.build("Softgel", lambda Q, c=c, R=R, s=s: sg.softgel(Q, c, R, s), lo, hi, 0.003, 0.009)
    pk.color(gel, sg.GEL_COL, (1, 1, 0))
    items.append(("Gel", gel, lambda Q, c=c, R=R, s=s: sg.softgel(Q, c, R, s)))

    c, (ro, an, ya), s = TABLET
    R = pk.rot(ro, an, ya)
    tab = pk.build_tablet("Tablet", c, R, s, (0, 0, 1), voxel=0.002, groove=False)
    items.append(("Tab", tab, lambda Q, c=c, R=R, s=s: pk.tablet(Q, c, R, s, groove=False)))
    # cap/body pairs of one capsule touch by design; every other pair must stay > 0
    pk.check_gaps(items)

    objs = [cap, body, gel, tab]
    k.tilt(objs, VIEW_ELEVATION_DEG)
    clay = k.zone_material("ClayPills", 0.15)
    for o in (cap, body, tab):
        o.data.materials.clear()
        o.data.materials.append(clay)
    gel.data.materials.clear()
    gm = sg.gel_material()
    # scatter distance in object units: scale with the softgel so it reads as dense as #36
    gm.node_tree.nodes["Principled BSDF"].inputs["Subsurface Scale"].default_value = sg.SSS_SCALE * GEL[2]
    gel.data.materials.append(gm)
    cam = ct.setup_scene(objs)
    cam.data.ortho_scale *= ct.REFERENCE["protocol-group-c4"]["tile_icon_width"] / TRIO_ON_TILE
    pk.pill_light()
    _link_lights([cap, body, tab], gel)
    if os.environ.get("C4_GAPS_ONLY"):
        ct.print_poly_counts(objs)
        return
    k.finish(objs, out_dir, "protocol-group-c4")


if __name__ == "__main__":
    main()
