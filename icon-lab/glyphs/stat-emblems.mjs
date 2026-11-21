// Statistical emblems for the Insights pattern cards (briefs: icon-lab/briefs/stat-emblems-01.md; restyle 21 Nov 2026).
// Source of truth for the composition and the look: icon-lab/glyphs/stat-emblems-sketch.svg (approved, drawn large):
// thin technical grey lines, solid dark = measured · dashed grey = usual / expected · hatching = spread · dots = single days ·
// one pink accent = the finding itself.
//
// Each emblem exists in three styles, as three self-contained SVGs (64 grid, explicit colours, no ids, no <rect>):
//   a  default: on a small white tile (lib/studio.css), drawn at 46 px; hatching plus one accent (#D4537E) on the finding
//   b  no tile, drawn at 54 px; grey only: the accent becomes the main ink
//   c  on the white tile, grey only: the finding is a solid dark fill instead of hatching plus accent, the rest turns grey
// Strokes use vector-effect="non-scaling-stroke", so widths and dashes are screen pixels at every size (1.6 main, 1.4 grey,
// 2 accent, 1 baseline, dashes 3/3). Hatching is computed lines (45°, about 4 px apart at 46 px), clipped to the shape by
// geometry, so the same emblem can appear many times on a page without pattern ids.

const f = (n) => +n.toFixed(2);
const INK = '#2E2C34', GREY = '#8A8590', BASE = '#B4B0B8', PINK = '#D4537E';
const NS = 'vector-effect="non-scaling-stroke"';
const DASH = 'stroke-dasharray="3 3"';

// style -> palette and switches
const STYLE = {
  a: { acc: PINK, solid: false },
  b: { acc: INK, solid: false },
  c: { acc: INK, solid: true },
};

const svg = (v, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" data-v="${v}">${body}</svg>`;
const line = (d, color, w) =>
  `<path d="${d}" stroke="${color}" stroke-width="${w}" ${NS} stroke-linecap="round" stroke-linejoin="round"/>`;
const dashed = (d, color = GREY, w = 1.4) =>
  `<path d="${d}" stroke="${color}" stroke-width="${w}" ${NS} ${DASH}/>`;
const dot = (x, y, r, fill) => `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="${fill}"/>`;
const sq = (cx, cy, s, fill) => `<path d="M${f(cx - s / 2)},${f(cy - s / 2)}h${f(s)}v${f(s)}h${f(-s)}Z" fill="${fill}"/>`;
// spread without hatching (style c): a quiet grey body
const veil = (d) => `<path d="${d}" fill="${BASE}" opacity=".32"/>`;

// ---------- geometry for hatching ----------
const cubic = (p0, p1, p2, p3, n = 32) => Array.from({ length: n + 1 }, (_, i) => {
  const t = i / n, u = 1 - t;
  return [u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0],
          u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1]];
});
const circlePoly = (cx, cy, r, n = 96) => Array.from({ length: n }, (_, i) => [cx + r * Math.cos(2 * Math.PI * i / n), cy + r * Math.sin(2 * Math.PI * i / n)]);
const polyD = (poly) => 'M' + poly.map((p) => `${f(p[0])},${f(p[1])}`).join('L') + 'Z';
// fine 45° hatching: lines x + y = c ("/"), Δc = 7.8 (5.5 units apart = about 4 px at 46 px), kept where inside (even-odd)
const HATCH = `stroke="${GREY}" stroke-width=".8" ${NS} opacity=".7"`;
function hatch(poly, step = 7.8) {
  const sums = poly.map((p) => p[0] + p[1]);
  const lo = Math.min(...sums), hi = Math.max(...sums);
  let d = '';
  for (let c = (Math.floor(lo / step) + 0.5) * step; c < hi; c += step) {
    if (c <= lo) continue;
    const ys = [];
    for (let i = 0; i < poly.length; i++) {
      const a = poly[i], b = poly[(i + 1) % poly.length];
      const va = a[0] + a[1] - c, vb = b[0] + b[1] - c;
      if ((va < 0) !== (vb < 0)) { const t = va / (va - vb); ys.push(a[1] + t * (b[1] - a[1])); }
    }
    ys.sort((p, q) => p - q);
    for (let i = 0; i + 1 < ys.length; i += 2) {
      if (ys[i + 1] - ys[i] < 0.4) continue;
      d += `M${f(c - ys[i])},${f(ys[i])}L${f(c - ys[i + 1])},${f(ys[i + 1])}`;
    }
  }
  return d ? `<path d="${d}" ${HATCH}/>` : '';
}

// ---------- 1 stat-before-after · earlier (dashed) vs. now (solid, hatched), the mean of now marked ----------
const beforeAfter = (v, s) => {
  const now = 'M6 50 C16 50 19 14 24 14 C29 14 32 50 42 50 Z';
  const poly = [...cubic([6, 50], [16, 50], [19, 14], [24, 14]), ...cubic([24, 14], [29, 14], [32, 50], [42, 50]).slice(1)];
  return svg(v,
    line('M4 50H60', BASE, 1) +
    dashed('M22 50 C32 50 35 21 40 21 C45 21 48 50 58 50') +
    (s.solid ? `<path d="${now}" fill="${INK}"/>` : hatch(poly)) +
    line(now, INK, 1.6) +
    line('M24 14V50', s.solid ? '#fff' : s.acc, s.solid ? 1.6 : 2),
  );
};

// ---------- 2 stat-earlier-later · an event, a dashed arc, the later effect (accent circle, hatched) ----------
const earlierLater = (v, s) => {
  const cx = 45, cy = 31, r = 11;
  return svg(v,
    line('M6 52H58', BASE, 1) +
    [12, 23, 34, 45].map((x) => dot(x, 52, 1.7, GREY)).join('') +
    dashed('M17 26 C23 15 31 15 35 21') +
    dot(12, 29, 4, s.solid ? GREY : INK) +
    (s.solid ? dot(cx, cy, r, INK) : hatch(circlePoly(cx, cy, r))) +
    `<circle cx="${cx}" cy="${cy}" r="${r}" stroke="${s.acc}" stroke-width="2" ${NS}/>` +
    dot(cx, cy, 1.8, s.solid ? '#fff' : INK),
  );
};

// ---------- 3 stat-goes-together · scatter, regression line, hatched band; the last point is the finding ----------
const goesTogether = (v, s) => {
  const y = (x) => 46 - (x - 8) * 0.625, h = 7;
  const band = [[8, y(8) + h], [8, y(8) - h], [56, y(56) - h], [56, y(56) + h]];
  const pts = [[13, 42], [20, 40], [27, 33], [34, 31], [41, 24], [48, 23]];
  return svg(v,
    (s.solid ? veil(polyD(band)) : hatch(band)) +
    line(`M8 ${f(y(8))}L56 ${f(y(56))}`, INK, 1.6) +
    pts.map(([x, yy]) => dot(x, yy, 2, s.solid ? GREY : INK)).join('') +
    dot(54, y(54), s.solid ? 3.4 : 3, s.acc),
  );
};

// ---------- 4 stat-outside-usual · dashed usual band, a line whose last point leaves it ----------
const outsideUsual = (v, s) => {
  const pts = [[11, 44], [19, 39], [27, 46], [35, 40], [43, 44]], end = [52, 16];
  const ink = s.solid ? GREY : INK;
  return svg(v,
    dashed('M11 34H53A3 3 0 0 1 56 37V47A3 3 0 0 1 53 50H11A3 3 0 0 1 8 47V37A3 3 0 0 1 11 34Z') +
    line('M' + [...pts, end].map((p) => p.join(' ')).join('L'), ink, 1.6) +
    pts.map(([x, yy]) => dot(x, yy, 2, ink)).join('') +
    dot(end[0], end[1], s.solid ? 3.6 : 3.2, s.acc),
  );
};

// ---------- 5 stat-how-sure · forest plot: estimates with whiskers against a dashed zero line; the top estimate is the finding ----------
const howSure = (v, s) => {
  const band = [[26, 13], [58, 13], [58, 23], [26, 23]];
  const ink = s.solid ? GREY : INK;
  return svg(v,
    dashed('M18 6V58') +
    (s.solid ? veil(polyD(band)) : hatch(band)) +
    line('M26 18H58', s.acc, 2) + sq(42, 18, 7, s.acc) +
    line('M8 34H40', ink, 1.6) + sq(24, 34, 5.5, ink) +
    line('M5 48H29', ink, 1.6) + sq(17, 48, 5.5, ink),
  );
};

// ---------- 6 stat-show-up-together · two overlapping sets, the shared days are the finding ----------
const showUpTogether = (v, s) => {
  const r = 15, a = 24, b = 40, cy = 32, k = f(Math.sqrt(r * r - ((b - a) / 2) ** 2));
  const lens = `M32 ${f(cy - k)}A${r} ${r} 0 0 1 32 ${f(cy + k)}A${r} ${r} 0 0 1 32 ${f(cy - k)}Z`;
  const own = s.solid ? GREY : INK;
  return svg(v,
    (s.solid ? `<path d="${lens}" fill="${INK}"/>` : hatch(circlePoly(a, cy, r))) +
    `<circle cx="${a}" cy="${cy}" r="${r}" stroke="${INK}" stroke-width="1.6" ${NS}/>` +
    `<circle cx="${b}" cy="${cy}" r="${r}" stroke="${GREY}" stroke-width="1.4" ${NS} ${DASH}/>` +
    dot(14, 27, 2, own) + dot(17, 40, 2, own) + dot(50, 25, 2, own) + dot(49, 39, 2, own) +
    [[32, 24.5], [35, 32], [31, 39.5]].map(([x, yy]) => dot(x, yy, s.solid ? 2 : 2.4, s.solid ? '#fff' : s.acc)).join(''),
  );
};

// ---------- 7 stat-evaluation · an evaluation of several measures: a forest plot around a dashed zero line, one estimate per
// measure (the Rapamycin evaluation card). The top estimate, clearly off zero, is the finding; two more stand on either side ----------
const evaluation = (v, s) => {
  const ink = s.solid ? GREY : INK;
  return svg(v,
    line('M6 56H58', BASE, 1) +
    dashed('M34 6V56') +
    line('M10 17H28', s.acc, 2) + sq(19, 17, s.solid ? 8 : 7, s.acc) +
    line('M16 32H33', ink, 1.6) + sq(24, 32, 5.5, ink) +
    line('M38 46H56', ink, 1.6) + sq(47, 46, 5.5, ink),
  );
};

const DRAW = [
  ['stat-before-after', 'Before / after', beforeAfter],
  ['stat-earlier-later', 'Earlier / later', earlierLater],
  ['stat-goes-together', 'Goes together', goesTogether],
  ['stat-outside-usual', 'Outside your usual', outsideUsual],
  ['stat-how-sure', 'How sure', howSure],
  ['stat-show-up-together', 'Show up together', showUpTogether],
  ['stat-evaluation', 'Evaluation', evaluation],
];

// [{ id, label, svg: { a, b, c } }]
export const STAT_EMBLEMS = DRAW.map(([id, label, draw]) => ({
  id, label, svg: Object.fromEntries(Object.keys(STYLE).map((v) => [v, draw(v, STYLE[v])])),
}));
