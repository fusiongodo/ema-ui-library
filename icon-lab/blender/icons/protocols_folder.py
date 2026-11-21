"""Icon #34 protocols-folder: a soft lilac clay folder with three cream cards peeking out, slightly
fanned (front card: tiny coral capsule, middle card: tiny mint dot, back card plain).
Tile for "All protocols" (protocol-pill tile colour).
Geometry only; look from clay_theme (theme untouched). View elevation 8 deg, yaw 0 (as calendar, guide).
Run: Blender -b --factory-startup --python icons/protocols_folder.py -- <out_dir>
Method: sdf_kit. Separate objects (contact creases): back panel with a soft tab, front panel,
three cards, capsule + dot.
Units: folder body 0.80 wide, 0.62 high (back panel + tab). X right, Z up (bottom z = 0), front at -Y.
"""
import math
import os
import sys

import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))
import clay_theme as ct  # noqa: E402
import sdf_kit as k  # noqa: E402

W = 0.80
BACK_H, BACK_Y, BACK_T = 0.55, 0.085, 0.07       # back panel (+ tab to 0.62)
TAB_X0, TAB_X1, TAB_TOP = -0.40, -0.13, 0.62   # tab flush with the left edge
FRONT_H, FRONT_Y, FRONT_T = 0.44, -0.086, 0.095  # front panel: plump
CORNER, EDGE = 0.085, 0.040
PILLOW = 0.018                                   # front panel dome at its centre
CARD_W, CARD_T = 0.36, 0.024
# cards: centre x, centre y, top z, fan angle (deg, + = top leans left), bottom hidden at z 0.20
CARDS = (("back", 0.03, 0.032, 0.67, 5.0),
         ("middle", 0.13, 0.004, 0.655, -8.0),
         ("front", 0.07, -0.022, 0.575, -1.5))
PIVOT_Z = 0.20
CAPS_LEN, CAPS_D = 0.12, 0.048                   # coral capsule on the front card (lying across)
DOT_D = 0.055                                    # mint dot on the middle card

VIEW_ELEVATION_DEG = 8.0
LILAC = ("#978BA6", ("#DCCAEA", 0.70), ("#4E3F60", 0.75))
CREAM = ("#EDE8E1", ("#F6F2EC", 0.28), ("#B4A99B", 0.30))
CORAL = ("#EF8D7A", ("#F8A894", 0.50), ("#E08A78", 0.15))
MINT = ("#80C69C", ("#B0E2C4", 0.60), ("#558F6E", 0.40))
LOW_DARK = 0.36                                  # lilac toward the dark tone at the bottom
SHEEN = 0.15


def panel_sdf(P, h, yc, t, tab=False, pillow=0.0):
    x, y, z = P[:, 0], P[:, 1], P[:, 2]
    s = k.rrect(x, z - h / 2, W / 2, h / 2, CORNER)
    if tab:
        tc = (TAB_X0 + TAB_X1) / 2
        st = k.rrect(x - tc, z - (TAB_TOP - 0.15), (TAB_X1 - TAB_X0) / 2, 0.15, CORNER)
        s = k.smin(s, st, 0.035)                  # soft shoulder into the panel top
    half = t / 2
    if pillow:                                    # soft dome on the faces: plump, not a flat slab
        bx = np.maximum(1 - (x / (W / 2)) ** 2, 0)
        bz = np.maximum(1 - ((z - h / 2) / (h / 2)) ** 2, 0)
        half = half + pillow * bx * bz
    return k.extrude(s, y, yc, half, EDGE if t > 0.08 else 0.032)


def _card_frame(P, cx, top, deg):
    a = math.radians(deg)
    c, s = math.cos(a), math.sin(a)
    dx, dz = P[:, 0] - cx, P[:, 2] - PIVOT_Z
    return c * dx + s * dz, -s * dx + c * dz      # u along the card width, v up the card


def card_sdf(P, cx, cy, top, deg):
    u, v = _card_frame(P, cx, top, deg)
    hh = (top - 0.02 - PIVOT_Z) / 2 + 0.01
    vc = top - PIVOT_Z - hh
    return k.extrude(k.rrect(u, v - vc, CARD_W / 2, hh, 0.04), P[:, 1], cy, CARD_T / 2, 0.010)


def _on_card(card, du, dv):
    """Point on the card's front face: du right of the card centre line, dv below its top."""
    _, cx, cy, top, deg = card
    a = math.radians(deg)
    lu, lv = du, top - PIVOT_Z - dv
    x = cx + math.cos(a) * lu - math.sin(a) * lv
    z = PIVOT_Z + math.sin(a) * lu + math.cos(a) * lv
    return x, cy - CARD_T / 2, z, a


def capsule_sdf(P, c, a):
    ux, uz = math.cos(a), math.sin(a)
    h = CAPS_LEN / 2 - CAPS_D / 2
    x, y, z = P[:, 0] - c[0], P[:, 1] - c[1], P[:, 2] - c[2]
    t = np.clip(x * ux + z * uz, -h, h)
    return np.sqrt((x - t * ux) ** 2 + y ** 2 + (z - t * uz) ** 2) - CAPS_D / 2


def _lilac(o):
    """Lilac set + a soft darkening toward the bottom (shadow side of the plump panels)."""
    base, light, dark = LILAC
    c = k.graded(base, light, dark, k.normals(o.data)[:, 2])
    w = (LOW_DARK * k.ss(0.24, 0.0, k.get_co(o.data)[:, 2]))[:, None]
    k.set_colors(o, c * (1 - w) + k.lin(dark[0]) * w, (1, 0, 1))


def _color(o, spec, part):
    base, light, dark = spec
    k.set_colors(o, k.graded(base, light, dark, k.normals(o.data)[:, 2]), part)


def main():
    argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    out_dir = argv[0] if argv else os.path.join(os.path.dirname(HERE), "out", "protocols-folder")
    os.makedirs(out_dir, exist_ok=True)
    ct.reset_scene()
    back = k.build("Back", lambda Q: panel_sdf(Q, BACK_H, BACK_Y, BACK_T, tab=True),
                   (-0.43, BACK_Y - 0.06, -0.03), (0.43, BACK_Y + 0.06, TAB_TOP + 0.03), 0.004, 0.012)
    _lilac(back)
    front = k.build("Front", lambda Q: panel_sdf(Q, FRONT_H, FRONT_Y, FRONT_T, pillow=PILLOW),
                    (-0.43, FRONT_Y - 0.07, -0.03), (0.43, FRONT_Y + 0.07, FRONT_H + 0.03), 0.004, 0.012)
    _lilac(front)
    cards = []
    for name, cx, cy, top, deg in CARDS:
        o = k.build("Card_" + name, lambda Q, cx=cx, cy=cy, top=top, deg=deg: card_sdf(Q, cx, cy, top, deg),
                    (cx - 0.30, cy - 0.03, PIVOT_Z - 0.05), (cx + 0.30, cy + 0.03, top + 0.06), 0.003, 0.009)
        _color(o, CREAM, (0, 1, 0))
        cards.append(o)
    x, y, z, a = _on_card(CARDS[2], -0.01, 0.075)
    caps = k.build("Capsule", lambda Q: capsule_sdf(Q, (x, y, z), a),
                   (x - 0.08, y - 0.05, z - 0.05), (x + 0.08, y + 0.05, z + 0.05), 0.0018, 0.006)
    _color(caps, CORAL, (1, 0, 0))
    mx, my, mz, _ = _on_card(CARDS[1], 0.105, 0.065)
    my += 0.006                                   # sunk a little: a soft button, not a ball
    dot = k.build("Dot", lambda Q: np.sqrt((Q[:, 0] - mx) ** 2 + (Q[:, 1] - my) ** 2 + (Q[:, 2] - mz) ** 2)
                  - DOT_D / 2, (mx - 0.05, my - 0.05, mz - 0.05), (mx + 0.05, my + 0.05, mz + 0.05), 0.0018, 0.006)
    _color(dot, MINT, (0, 1, 1))
    objs = [back, front, k.join("Cards", cards), k.join("Marks", [caps, dot])]
    k.tilt(objs, VIEW_ELEVATION_DEG)
    mat = k.zone_material("ClayFolder", SHEEN)
    for o in objs:
        o.data.materials.clear()
        o.data.materials.append(mat)
    ct.setup_scene(objs)
    k.light_overrides()
    k.finish(objs, out_dir, "protocols-folder")


if __name__ == "__main__":
    main()
