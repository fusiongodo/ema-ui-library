"""Compare sheet of the protocol-kind tiles: out/protocol-kinds-sheet.png.
Row 1: the tiles at 132 px. Row 2: the same at 44 px on the white card (#F5F3F0), as in "All protocols".
Run: python3 kinds_sheet.py  (after the ./render.sh runs of the tiles in IDS)
"""
import os

from PIL import Image, ImageDraw

from composite import HERE, SHEET_BG, font

IDS = ("protocol-pill", "protocol-supplement-tab", "protocol-injection", "protocol-capsule", "protocol-softgel",
       "protocol-group-c3", "protocol-group-c4")
BIG, SMALL, CARD = 132, 44, "#F5F3F0"


def main():
    pad, gap, label_h = 32, 40, 30
    col = BIG + gap
    w = pad * 2 + len(IDS) * BIG + (len(IDS) - 1) * gap
    h = pad * 2 + label_h + BIG + 28 + SMALL + 40
    img = Image.new("RGBA", (w, h), SHEET_BG)
    d = ImageDraw.Draw(img)
    f = font(15)
    card_y = pad + label_h + BIG + 28
    d.rounded_rectangle((pad - 12, card_y - 12, w - pad + 12, card_y + SMALL + 12), radius=16, fill=CARD)
    for i, icon in enumerate(IDS):
        tile = Image.open(os.path.join(HERE, "out", icon, f"{icon}-on-tile.png")).convert("RGBA")
        x = pad + i * col
        tw = d.textlength(icon, font=f)
        d.text((x + (BIG - tw) / 2, pad), icon, fill="#444444", font=f)
        img.alpha_composite(tile.resize((BIG, BIG), Image.LANCZOS), (x, pad + label_h))
        img.alpha_composite(tile.resize((SMALL, SMALL), Image.LANCZOS), (x + (BIG - SMALL) // 2, card_y))
    p = os.path.join(HERE, "out", "protocol-kinds-sheet.png")
    img.convert("RGB").save(p)
    print("wrote", p)


if __name__ == "__main__":
    main()
