"""Put transparent icon renders on rounded tiles and build a comparison sheet.

Run outside Blender (system Python + Pillow):
    python3 composite.py checkin-chat
Reads out/<icon>/<icon>.png, writes <icon>-on-tile.png (tile colour from
clay_theme.REFERENCE) and <icon>-sheet.png next to it. The reference is icon-lab/refs/<icon>.png.
"""
import os
import sys

from PIL import Image, ImageChops, ImageColor, ImageDraw, ImageFilter, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import clay_theme as ct  # noqa: E402  (no bpy needed for the constants)

TILE_SIZE = 1024
TILE_RADIUS = round(TILE_SIZE * ct.TILE_RADIUS_FRAC)
ICON_SCALE = ct.ICON_ON_TILE
SHEET_BG = "#F3F2EF"
BIG, SMALL = 260, 60
# Second sheet row: clay-family references from refs/clay-board/
CLAY_REFS = {
    "checkin-chat": [
        ("fluent-speech-balloon", "fluent-speech-balloon.png"),
        ("3dicons-clay-chat-bubble", "3dicons-clay-chat-bubble.png"),
        ("tuki-clay-messaging", "tuki-clay-messaging.png"),
        ("iconscout-designsquad-chat", "iconscout-designsquad-chat.png"),
    ],
    "protocol-pill": [
        ("fluent-pill", "fluent-pill.png"),
        ("icons8-3dfluency-pill", "icons8-3dfluency-pill.png"),
        ("tuki-clay-pharmacy", "tuki-clay-pharmacy.png"),
    ],
    "log-scores": [
        ("tuki-clay-spreadsheet", "tuki-clay-spreadsheet.png"),
        ("3dicons-clay-chart", "3dicons-clay-chart.png"),
    ],
    "wellbeing": [
        ("tuki-clay-meditation", "tuki-clay-meditation.png"),
        ("3dicons-clay-heart", "3dicons-clay-heart.png"),
        ("fluent-smiling-face", "fluent-smiling-face-with-smiling-eyes.png"),
    ],
    "steps": [
        ("fluent-running-shoe", "fluent-running-shoe.png"),
        ("tuki-clay-running", "tuki-clay-running.png"),
    ],
    "sleep": [
        ("3dicons-clay-moon", "3dicons-clay-moon.png"),
        ("3dicons-color-moon", "3dicons-color-moon.png"),
        ("fluent-crescent-moon", "fluent-crescent-moon.png"),
        ("icons8-3dfluency-sleep", "icons8-3dfluency-sleep.png"),
    ],
}
ROW2_SIZE = 200  # clay references in the second sheet row
SET_COMPARE = ("log-scores", "wellbeing", "calendar")  # finished tiles beside icons without a reference


def tile(fill):
    ss = 4  # supersampled mask for a clean rounded edge
    mask = Image.new("L", (TILE_SIZE * ss, TILE_SIZE * ss), 0)
    ImageDraw.Draw(mask).rounded_rectangle(
        (0, 0, TILE_SIZE * ss - 1, TILE_SIZE * ss - 1), radius=TILE_RADIUS * ss, fill=255)
    mask = mask.resize((TILE_SIZE, TILE_SIZE), Image.LANCZOS)
    img = Image.new("RGBA", (TILE_SIZE, TILE_SIZE), fill)
    img.putalpha(mask)
    return img


def draw_ring(base, ring):
    """Flat anti-aliased ring centred on the tile (opt-in per icon, REFERENCE[icon]["ring"]):
    centre-line radius and stroke width as fractions of the tile width."""
    ss = 4
    n = TILE_SIZE * ss
    c = n / 2
    ro = (ring["radius"] + ring["width"] / 2) * n
    ri = (ring["radius"] - ring["width"] / 2) * n
    mask = Image.new("L", (n, n), 0)
    d = ImageDraw.Draw(mask)
    d.ellipse((c - ro, c - ro, c + ro, c + ro), fill=255)
    d.ellipse((c - ri, c - ri, c + ri, c + ri), fill=0)
    mask = mask.resize((TILE_SIZE, TILE_SIZE), Image.LANCZOS)
    layer = Image.new("RGBA", base.size, ring["color"])
    layer.putalpha(ImageChops.multiply(mask, base.getchannel("A")))
    return Image.alpha_composite(base, layer)


def compose(icon_png, fill, icon_scale=ICON_SCALE, ring=None, offset_y=0.0):
    """Tile (+ optional flat ring) + soft tinted cast shadow (from the render's alpha) + icon.
    offset_y: icon bbox centre below the tile centre, as a share of the tile (default 0)."""
    base = tile(fill)
    if ring:
        base = draw_ring(base, ring)
    icon = Image.open(icon_png).convert("RGBA")
    s = round(TILE_SIZE * icon_scale)
    icon = icon.resize((s, s), Image.LANCZOS)
    layer = Image.new("RGBA", base.size, (0, 0, 0, 0))
    # centre the pair's alpha bounding box (shadow excluded) on the tile
    l, t, r, b = icon.getchannel("A").point(lambda v: 255 if v > 8 else 0).getbbox()
    ox = round(TILE_SIZE / 2 - (l + r) / 2)
    oy = round(TILE_SIZE / 2 + TILE_SIZE * offset_y - (t + b) / 2)
    layer.alpha_composite(icon, (ox, oy))

    # cast shadow: offset, blurred alpha, tile colour x SHADOW_TINT
    sx, sy = (round(TILE_SIZE * v) for v in ct.SHADOW_OFFSET)
    a = layer.getchannel("A")
    sh_a = Image.new("L", base.size, 0)
    sh_a.paste(a, (sx, sy))
    sh_a = sh_a.filter(ImageFilter.GaussianBlur(TILE_SIZE * ct.SHADOW_BLUR))
    sh_a = sh_a.point(lambda v: round(v * ct.SHADOW_OPACITY))
    sh_a = ImageChops.multiply(sh_a, base.getchannel("A"))  # stay inside the tile
    rgb = ImageColor.getrgb(fill)
    shadow = Image.new("RGBA", base.size, tuple(round(c * ct.SHADOW_TINT) for c in rgb) + (0,))
    shadow.putalpha(sh_a)
    out = Image.alpha_composite(base, shadow)
    return Image.alpha_composite(out, layer)


def font(size):
    for f in ("/System/Library/Fonts/Helvetica.ttc", "/System/Library/Fonts/SFNS.ttf"):
        try:
            return ImageFont.truetype(f, size)
        except OSError:
            pass
    return ImageFont.load_default(size=size)


def sheet(rows, out_path):
    """rows: list of rows, each a list of (label, image). Each image is shown
    at BIG px with a SMALL (list-size) copy directly beneath."""
    pad, gap, label_h, row_gap = 40, 36, 34, 40
    cols = max(len(r) for r in rows)
    row_h = label_h + BIG + 24 + SMALL
    w = pad * 2 + cols * BIG + (cols - 1) * gap
    h = pad * 2 + len(rows) * row_h + (len(rows) - 1) * row_gap
    img = Image.new("RGBA", (w, h), SHEET_BG)
    d = ImageDraw.Draw(img)
    f = font(20)
    for r, items in enumerate(rows):
        y0 = pad + r * (row_h + row_gap)
        for i, (label, im) in enumerate(items):
            x = pad + i * (BIG + gap)
            tw = d.textlength(label, font=f)
            d.text((x + (BIG - tw) / 2, y0), label, fill="#444444", font=f)
            sz = BIG if r == 0 else ROW2_SIZE  # row 1: reference vs ours; later rows smaller
            big = im.convert("RGBA").resize((sz, sz), Image.LANCZOS)
            img.alpha_composite(big, (x + (BIG - sz) // 2, y0 + label_h + (BIG - sz) // 2))
            small = im.convert("RGBA").resize((SMALL, SMALL), Image.LANCZOS)
            img.alpha_composite(small, (x + (BIG - SMALL) // 2, y0 + label_h + BIG + 24))
    img.convert("RGB").save(out_path)


def main(icon):
    out = os.path.join(HERE, "out", icon)
    ref = os.path.join(HERE, "..", "refs", f"{icon}.png")
    tile_hex = ct.REFERENCE[icon]["tile"]  # fixed reference colours (Alex, final)
    # per-icon tablet/pair width on the tile (default: clay_theme.TILE_ICON_WIDTH)
    scale = ct.REFERENCE[icon].get("tile_icon_width", ct.TILE_ICON_WIDTH) / ct.FRAME_FILL
    c = compose(os.path.join(out, f"{icon}.png"), tile_hex, scale,
                ring=ct.REFERENCE[icon].get("ring"), offset_y=ct.REFERENCE[icon].get("tile_icon_offset_y", 0.0))
    p = os.path.join(out, f"{icon}-on-tile.png")
    c.save(p)
    print("wrote", p)
    if not os.path.exists(ref):
        # own design without a reference: set comparison with finished tiles (each 260 px, 60 px below)
        row = [("Ours", c)]
        for other in SET_COMPARE:
            p = os.path.join(HERE, "out", other, f"{other}-on-tile.png")
            if os.path.exists(p):
                row.append((other, Image.open(p)))
        sp = os.path.join(out, f"{icon}-sheet.png")
        sheet([row], sp)
        print("wrote", sp)
        return
    row1 = [("Reference", Image.open(ref))]
    model = ct.REFERENCE[icon].get("model")  # optional shape model between reference and ours
    if model:
        row1.append((model[0], Image.open(os.path.join(HERE, "..", "refs", model[1]))))
    rows = [row1 + [("Ours", c)]]
    board = os.path.join(HERE, "..", "refs", "clay-board")
    refs = [(lbl, os.path.join(board, f)) for lbl, f in CLAY_REFS.get(icon, [])]
    if refs:
        rows.append([(lbl, Image.open(p)) for lbl, p in refs if os.path.exists(p)])
    sp = os.path.join(out, f"{icon}-sheet.png")
    sheet(rows, sp)
    print("wrote", sp)


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "checkin-chat")
