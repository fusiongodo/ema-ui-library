"""Icon #35 protocol-capsule: one hard two-part capsule (Coral cap, Cream body), lying diagonally
(lower left to upper right, ~30 deg) on the protocol-pill tile. Supplement kind.
Geometry: pill_kit (cap overlaps the body with a 0.01 step, softly rounded open edge).
Look: clay_theme + protocol-pill's icon-level light (pill_kit.pill_light). View elevation 10 deg.
Run: ./render.sh protocol_capsule
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))
import clay_theme as ct  # noqa: E402
import pill_kit as pk  # noqa: E402

ANGLE_DEG = 30.0          # screen angle of the long axis
ROLL_DEG = 0.0
VIEW_ELEVATION_DEG = 10.0


def main():
    argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    out_dir = argv[0] if argv else os.path.join(os.path.dirname(HERE), "out", "protocol-capsule")
    os.makedirs(out_dir, exist_ok=True)
    ct.reset_scene()
    R = pk.rot(yz_deg=ROLL_DEG, xz_deg=ANGLE_DEG)
    objs = pk.build_capsule("Capsule", (0, 0, 0), R, 1.0, pk.CORAL, pk.CREAM, (1, 0, 0), (0, 1, 0))
    pk.finish(objs, out_dir, "protocol-capsule", VIEW_ELEVATION_DEG)


if __name__ == "__main__":
    main()
