"""Icon #38 protocol-group-c4: five pills floating as one tight round cluster, no container
(Coral/Cream, Mint/Cream and Lilac/Cream capsules, an amber softgel, a cream scored tablet).
Group kind, idea C4 (after refs/group/14). Items are #35 / #36 / protocol-pill scaled down.
Look: clay_theme + pill_kit.pill_light. View elevation 10 deg. One shared cast shadow (composite).
Run: ./render.sh protocol_group_c4
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))
import clay_theme as ct  # noqa: E402
import pill_kit as pk  # noqa: E402

S = 0.50                   # item scale against the single tiles
VIEW_ELEVATION_DEG = 10.0
# name, centre (x, depth y, z), rotation (roll, screen angle, yaw) in deg
CAPSULES = (
    ("Coral", (-0.13, 0.07, 0.20), (0, 24, 15), pk.CORAL, (1, 0, 0)),
    ("Mint", (0.25, 0.08, 0.06), (0, 98, -12), pk.MINT, (0, 1, 1)),
    ("Lilac", (0.00, 0.07, -0.21), (0, -8, -18), pk.LILAC, (1, 0, 1)),
)
GEL = ((0.04, -0.12, -0.01), (0, 35, 0))          # in front, in the middle: overlaps all three
TABLET = ((-0.30, -0.02, -0.07), (62, -15, 0))   # axis tipped toward the camera: face + band


def main():
    argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    out_dir = argv[0] if argv else os.path.join(os.path.dirname(HERE), "out", "protocol-group-c4")
    os.makedirs(out_dir, exist_ok=True)
    ct.reset_scene()
    objs, items = [], []
    for name, c, (ro, an, ya), spec, part in CAPSULES:
        R = pk.rot(ro, an, ya)
        cap, body = pk.build_capsule(name, c, R, S, spec, pk.CREAM, part, (0, 1, 0), voxel=0.003)
        objs += [cap, body]
        items.append((name, cap, lambda Q, c=c, R=R: pk.capsule_cap(Q, c, R, S)))
        items.append((name + "B", body, lambda Q, c=c, R=R: pk.capsule_body(Q, c, R, S)))
    c, (ro, an, ya) = GEL
    R = pk.rot(ro, an, ya)
    gel = pk.build_softgel("Softgel", c, R, S, (1, 1, 0), voxel=0.003)
    objs.append(gel)
    items.append(("Gel", gel, lambda Q, c=c, R=R: pk.softgel(Q, c, R, S)))
    c, (ro, an, ya) = TABLET
    R = pk.rot(ro, an, ya)
    S_TAB = 0.36           # tablet diameter 0.36 against capsule length 0.50
    tab = pk.build_tablet("Tablet", c, R, S_TAB, (0, 0, 1), voxel=0.002, groove=False)   # no score line at this size
    objs.append(tab)
    items.append(("Tab", tab, lambda Q, c=c, R=R: pk.tablet(Q, c, R, S_TAB, groove=False)))
    pk.check_gaps([it for it in items if not it[0].endswith("B")] )
    pk.finish(objs, out_dir, "protocol-group-c4", VIEW_ELEVATION_DEG)


if __name__ == "__main__":
    main()
