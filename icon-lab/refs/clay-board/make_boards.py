"""Build board-chat.png / board-others.png and print measured traits per reference.

Run: ../../blender/.venv/bin/python -I make_boards.py   (from refs/clay-board)
Internal comparison only; images are third-party references, never shipped.
"""
import colorsys
import os
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
BG = (0xF3, 0xF2, 0xEF)
CELL = 200

# file, label, tile-bg sample point (relative) or None for transparent PNGs
CHAT = [
    ("../checkin-chat.png", "OURS (current ref)", (0.22, 0.30)),
    ("fluent-speech-balloon.png", "Fluent Emoji 3D", None),
    ("fluent-left-speech-bubble.png", "Fluent Emoji 3D", None),
    ("fluent-thought-balloon.png", "Fluent Emoji 3D", None),
    ("3dicons-clay-chat-bubble.png", "3dicons clay", None),
    ("3dicons-clay-chat-front.png", "3dicons clay front", None),
    ("3dicons-color-chat-bubble.png", "3dicons color", None),
    ("tuki-clay-messaging.png", "tuki0918 clay-icons", (0.18, 0.30)),
    ("icons8-3dfluency-chat.png", "Icons8 3D Fluency", None),
    ("iconscout-designsquad-chat.png", "IconScout/Design Squad", None),
    ("iconscout-alfarizi-chat.png", "IconScout/L. Alfarizi", None),
    ("iconscout-iqonic-chat.png", "IconScout/iqonic", None),
    ("iconscout-hathai-chat.png", "IconScout/P. Hathai", None),
]
OTHERS = [
    ("fluent-pill.png", "Fluent pill", None),
    ("fluent-crescent-moon.png", "Fluent moon", None),
    ("fluent-running-shoe.png", "Fluent shoe", None),
    ("fluent-bar-chart.png", "Fluent bar chart", None),
    ("fluent-smiling-face-with-smiling-eyes.png", "Fluent smile", None),
    ("3dicons-clay-moon.png", "3dicons clay moon", None),
    ("3dicons-clay-chart.png", "3dicons clay chart", None),
    ("3dicons-clay-heart.png", "3dicons clay heart", None),
    ("3dicons-color-moon.png", "3dicons color moon", None),
    ("3dicons-color-heart.png", "3dicons color heart", None),
    ("tuki-clay-pharmacy.png", "tuki pharmacy", (0.18, 0.30)),
    ("tuki-clay-running.png", "tuki running", (0.18, 0.30)),
    ("tuki-clay-meditation.png", "tuki meditation", (0.18, 0.30)),
    ("tuki-clay-spreadsheet.png", "tuki spreadsheet", (0.18, 0.30)),
    ("icons8-3dfluency-pill.png", "Icons8 pill", None),
    ("icons8-3dfluency-sleep.png", "Icons8 sleep", None),
    ("icons8-3dfluency-chart.png", "Icons8 chart", None),
]


def font(size):
    for f in ("/System/Library/Fonts/Supplemental/Arial.ttf", "/System/Library/Fonts/Helvetica.ttc"):
        try:
            return ImageFont.truetype(f, size)
        except OSError:
            pass
    return ImageFont.load_default()


def board(items, out, cols):
    pad, lab = 16, 34
    rows = (len(items) + cols - 1) // cols
    W = Image.new("RGB", (cols * (CELL + pad) + pad, rows * (CELL + lab + pad) + pad), BG)
    d = ImageDraw.Draw(W)
    f1, f2 = font(13), font(10)
    for i, (fn, label, _) in enumerate(items):
        im = Image.open(os.path.join(HERE, fn)).convert("RGBA")
        im = im.resize((CELL, CELL), Image.LANCZOS) if im.width == im.height else im
        im.thumbnail((CELL, CELL), Image.LANCZOS)
        x = pad + (i % cols) * (CELL + pad)
        y = pad + (i // cols) * (CELL + lab + pad)
        W.paste(im, (x + (CELL - im.width) // 2, y + (CELL - im.height) // 2), im)
        d.text((x, y + CELL + 3), label, fill=(40, 40, 40), font=f1)
        d.text((x, y + CELL + 19), os.path.basename(fn), fill=(120, 120, 120), font=f2)
    W.save(os.path.join(HERE, out))


def hexc(c):
    return "#%02X%02X%02X" % tuple(int(v) for v in c)


def measure(fn, tile):
    a = np.asarray(Image.open(os.path.join(HERE, fn)).convert("RGBA")).astype(float)
    h, w = a.shape[:2]
    rgb, al = a[..., :3], a[..., 3] / 255
    if tile:
        ty, tx = int(tile[1] * h), int(tile[0] * w)
        bgc = np.median(rgb[ty - 3:ty + 3, tx - 3:tx + 3].reshape(-1, 3), axis=0)
        mask = (np.linalg.norm(rgb - bgc, axis=2) > 28) & (al > 0.95)
        # keep only the central area (exclude tile edges/corners)
        yy, xx = np.mgrid[0:h, 0:w]
        mask &= (yy > 0.17 * h) & (yy < 0.83 * h) & (xx > 0.17 * w) & (xx < 0.83 * w)
        shadow_frac = None
    else:
        mask = al > 0.9
        soft = (al > 0.03) & (al <= 0.6)
        shadow_frac = soft.sum() / max(mask.sum(), 1)
    ys, xs = np.nonzero(mask)
    fill = (xs.max() - xs.min() + 1) * (ys.max() - ys.min() + 1) / (w * h)
    width_frac = (xs.max() - xs.min() + 1) / w
    px = rgb[mask]
    L = px @ np.array([0.2126, 0.7152, 0.0722])
    p = {q: np.percentile(L, q) for q in (5, 10, 50, 90, 99, 99.8)}

    def near(q):
        sel = np.abs(L - p[q]) < 3
        return np.median(px[sel], axis=0) if sel.sum() else px[np.argmin(np.abs(L - p[q]))]

    lit, mid, sh = near(90), near(50), near(10)
    # light direction: centroid of top-10% luminance vs. object centroid (image y down)
    top = L >= p[90]
    cx, cy = xs.mean(), ys.mean()
    lx, ly = xs[top].mean() - cx, ys[top].mean() - cy
    n = (lx ** 2 + ly ** 2) ** 0.5 or 1
    ang = np.degrees(np.arctan2(-ly, lx))  # 90 = from top, 180 = from left
    sat = np.median([colorsys.rgb_to_hsv(*(c / 255))[1] for c in px[:: max(1, len(px) // 4000)]])
    # number of distinct hue clusters (>=8% of pixels, sat>0.12)
    hsv = np.array([colorsys.rgb_to_hsv(*(c / 255)) for c in px[:: max(1, len(px) // 4000)]])
    hues = hsv[hsv[:, 1] > 0.12, 0]
    hist, _ = np.histogram(hues, bins=12, range=(0, 1))
    ncol = int((hist > 0.08 * len(hsv)).sum()) + (1 if (hsv[:, 1] <= 0.12).mean() > 0.08 else 0)
    return dict(
        fill=fill, width=width_frac, lit=hexc(lit), mid=hexc(mid), shadow=hexc(sh),
        shadow_ratio=p[10] / p[90], spot=p[99.8] - p[90], light_angle=ang, light_offset=n / ((xs.max() - xs.min()) / 2),
        sat=sat, ncol=ncol, cast=shadow_frac,
    )


if __name__ == "__main__":
    board(CHAT, "board-chat.png", 7)
    board(OTHERS, "board-others.png", 6)
    print("file | fill(bbox/tile) | width | lit | mid | shadow | L10/L90 | spot(L99.8-L90) | light deg | sat | hues | soft-alpha/obj")
    for fn, _, tile in CHAT + OTHERS:
        m = measure(fn, tile)
        cast = "-" if m["cast"] is None else "%.2f" % m["cast"]
        print(f"{os.path.basename(fn)} | {m['fill']:.2f} | {m['width']:.2f} | {m['lit']} | {m['mid']} | {m['shadow']} | "
              f"{m['shadow_ratio']:.2f} | {m['spot']:.0f} | {m['light_angle']:.0f} ({m['light_offset']:.2f}) | {m['sat']:.2f} | {m['ncol']} | {cast}")
    sys.stdout.flush()
