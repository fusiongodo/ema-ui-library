"""Icon #27 resting-heart: a plump coral-red heart (Health tile "Resting heart rate").

Geometry only; look from clay_theme (theme untouched).
Run: Blender -b --factory-startup --python icons/resting_heart.py -- <out_dir>
Method: sdf_kit. 2D heart = smooth union of two uneven capsules (lobe circle -> soft bottom
point, radius 0.06); sampled on a grid and Gaussian-blurred, so the medial ridges of the
union leave no creases and the cleft has no saddle lips; then a puffy rounded extrusion.
hrv.py imports the heart from here (main() runs only as the Blender script).
Units: heart width 1.0, height 0.90, depth 0.42. X right, Z up, front at -Y.
"""
import math
import os
import sys

import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))
import clay_theme as ct  # noqa: E402
import sdf_kit as k  # noqa: E402

LOBE_X, LOBE_Z, LOBE_R = 0.22, 0.17, 0.28       # width 2 x (0.22 + 0.28) = 1.0; top at 0.45
TIP_Z, TIP_R = -0.39, 0.06                      # soft bottom point at -0.45: height 0.90
CLEFT_K = 0.12                                  # wide smooth union: shallow soft cleft, no ridge below it
HALF, EDGE_R = 0.21, 0.20                       # depth 0.42, puffy rounding
DOME = 0.25                                     # rounding depth in the outline plane: domed front

VIEW_ELEVATION_DEG = 8.0
HEART_HEX = "#EC8174"
HEART_GRAD = (("#F2A89C", 0.36), ("#A8473C", 0.45))
HI_COMP = 0.05
SHEEN = 0.10                                    # 0.15 clipped the lobe tops


def _uneven(px, pz, ax, az, ra, bx, bz, rb):
    """2D hull of two circles (iq uneven capsule), from a (ra) to b (rb)."""
    h = math.hypot(bx - ax, bz - az)
    ux, uz = (bx - ax) / h, (bz - az) / h
    q = (px - ax) * ux + (pz - az) * uz
    p = np.abs((px - ax) * uz - (pz - az) * ux)
    b = (ra - rb) / h
    a = math.sqrt(1 - b * b)
    kk = -b * p + a * q
    return np.where(kk < 0, np.hypot(p, q) - ra,
                    np.where(kk > a * h, np.hypot(p, q - h) - rb, a * p + b * q - ra))


def heart2(x, z):
    l = _uneven(x, z, -LOBE_X, LOBE_Z, LOBE_R, 0.0, TIP_Z, TIP_R)
    r = _uneven(x, z, LOBE_X, LOBE_Z, LOBE_R, 0.0, TIP_Z, TIP_R)
    kk = CLEFT_K * k.ss(TIP_Z + 0.06, TIP_Z + 0.40, z) + 1e-4  # soft cleft on top, plain union at the tip (no knob)
    return k.smin(l, r, kk)


def _grid(step=0.002, sigma=0.022):
    g = np.arange(-0.62, 0.62 + step / 2, step)
    X, Z = np.meshgrid(g, g, indexing="ij")
    F = heart2(X, Z)
    sg = sigma / step
    r = int(3 * sg)
    w = np.exp(-0.5 * (np.arange(-r, r + 1) / sg) ** 2)
    w /= w.sum()
    F = np.pad(F, r, mode="edge")
    F = np.apply_along_axis(lambda v: np.convolve(v, w, mode="valid"), 0, F)
    F = np.apply_along_axis(lambda v: np.convolve(v, w, mode="valid"), 1, F)
    return g, F


HG, HF = _grid()


def heart_lookup(x, z):
    st = HG[1] - HG[0]
    fx = np.clip((x - HG[0]) / st, 0, len(HG) - 1.001)
    fz = np.clip((z - HG[0]) / st, 0, len(HG) - 1.001)
    i, j = fx.astype(int), fz.astype(int)
    u, v = fx - i, fz - j
    return ((HF[i, j] * (1 - u) + HF[i + 1, j] * u) * (1 - v) + (HF[i, j + 1] * (1 - u) + HF[i + 1, j + 1] * u) * v)


def heart_sdf(P):
    return k.extrude(heart_lookup(P[:, 0], P[:, 2]), P[:, 1] * DOME / HALF, 0.0, DOME, EDGE_R)


def front_y(x, z):
    """Front surface y of the heart at (x, z) (analytic from the rounded extrusion)."""
    w = np.maximum(heart_lookup(x, z) + EDGE_R, 0)
    return -(DOME - EDGE_R + np.sqrt(np.maximum(EDGE_R ** 2 - w ** 2, 0))) * HALF / DOME


HEART_BOX = ((-0.53, -0.24, -0.49), (0.53, 0.24, 0.49))


def main():
    argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    out_dir = argv[0] if argv else os.path.join(os.path.dirname(HERE), "out", "resting-heart")
    os.makedirs(out_dir, exist_ok=True)
    ct.reset_scene()
    heart = k.build("Heart", heart_sdf, *HEART_BOX, 0.004, 0.012)
    nz = k.normals(heart.data)[:, 2]
    hi = (1 - HI_COMP * k.ss(0.6, 1.0, nz))[:, None]             # key-facing lobe tops: no clip
    k.set_colors(heart, k.graded(HEART_HEX, *HEART_GRAD, nz) * hi, (1, 0, 0))
    objs = [heart]
    k.tilt(objs, VIEW_ELEVATION_DEG)
    mat = k.zone_material("ClayRestingHeart", SHEEN)
    heart.data.materials.clear()
    heart.data.materials.append(mat)
    ct.setup_scene(objs)
    k.light_overrides()
    k.finish(objs, out_dir, "resting-heart")


if __name__ == "__main__":
    main()
