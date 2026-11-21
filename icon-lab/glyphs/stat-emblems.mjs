// Statistical emblems for the Insights pattern cards (brief: icon-lab/briefs/stat-emblems-01.md).
// Source of truth for the composition: icon-lab/glyphs/stat-emblems-sketch.svg (approved, drawn large).
// Redrawn here on a 48 grid, drawn at 44 px inside the 56 px Studio pattern tile (lib/studio.css).
// Visual language: solid currentColor = measured · dashed currentColor at 55 % = usual / expected · hatching = spread
// (3–5 diagonal lines, clipped to the shape by geometry, no <clipPath> ids) · dots = single days (at most 6) ·
// one accent = the finding, var(--st-accent, #D4537E).
// No <rect> and no fill-opacity attributes: Studio's tile CSS turns those into white bodies (lib/studio.css).

const f = (n) => +n.toFixed(2);
const W = 3.5;                       // main stroke (drawn at 44 px in Studio)
const G = 'stroke-opacity=".55"';       // grey: currentColor at 55 %
const DASH = 'stroke-dasharray="3 3"';
const ACC = 'var(--st-accent, #D4537E)';
const HATCH = 'stroke="currentColor" stroke-width="2" stroke-opacity=".55" stroke-linecap="round"';

const svg = (body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">${body}</svg>`;
const dot = (x, y, r, fill = 'currentColor', extra = '') => `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="${fill}"${extra}/>`;
const sq = (cx, cy, s, fill) => `<path d="M${f(cx - s / 2)},${f(cy - s / 2)}h${f(s)}v${f(s)}h${f(-s)}Z" fill="${fill}"/>`;

// ---------- geometry for hatching ----------
// polygon samples of a shape, then "/" lines (direction (1,-1)) every `gap` units, kept where they are inside (even-odd).
const cubic = (p0, p1, p2, p3, n = 24) => Array.from({ length: n + 1 }, (_, i) => {
  const t = i / n, u = 1 - t;
  return [u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0],
          u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1]];
});
const circlePoly = (cx, cy, r, n = 72) => Array.from({ length: n }, (_, i) => [cx + r * Math.cos(2 * Math.PI * i / n), cy + r * Math.sin(2 * Math.PI * i / n)]);
// lines x + y = c (dir "/"), or x - y = c (dir "\"), for c in cs; inset: shorten each piece at both ends
function hatch(poly, cs, dir = '/', inset = 0.6) {
  const s = dir === '/' ? 1 : -1;       // line: x + s*y = c  ->  param by y
  let d = '';
  for (const c of cs) {
    const ys = [];
    for (let i = 0; i < poly.length; i++) {
      const a = poly[i], b = poly[(i + 1) % poly.length];
      const va = a[0] + s * a[1] - c, vb = b[0] + s * b[1] - c;
      if ((va < 0) !== (vb < 0)) { const t = va / (va - vb); ys.push(a[1] + t * (b[1] - a[1])); }
    }
    ys.sort((p, q) => p - q);
    for (let i = 0; i + 1 < ys.length; i += 2) {
      const len = (ys[i + 1] - ys[i]) * Math.SQRT2;
      if (len < 2 * inset + 1) continue;
      const k = inset / Math.SQRT2;
      const y0 = ys[i] + k, y1 = ys[i + 1] - k;
      d += `M${f(c - s * y0)},${f(y0)}L${f(c - s * y1)},${f(y1)}`;
    }
  }
  return d ? `<path d="${d}" ${HATCH}/>` : '';
}

// ---------- 1 stat-before-after · earlier (dashed) vs. now (solid, hatched), means marked ----------
const beforeAfter = (() => {
  const B = 37;                                          // baseline
  const nowA = [[4, B], [11, B], [13.6, 11], [18.5, 11]], nowB = [[18.5, 11], [23.4, 11], [26, B], [33, B]];
  const now = `M4,${B}C11,${B} 13.6,11 18.5,11C23.4,11 26,${B} 33,${B}Z`;
  const poly = [...cubic(...nowA), ...cubic(...nowB).slice(1)];
  return svg(
    `<path d="M3,${B}H45" stroke="currentColor" stroke-width="2.25" ${G} stroke-linecap="round"/>` +
    `<path d="M15,${B}C22,${B} 24.6,15 29.5,15C34.4,15 37,${B} 44,${B}" stroke="currentColor" stroke-width="3" ${G} ${DASH}/>` +
    `<path d="M29.5,17.5V${B}" stroke="currentColor" stroke-width="2.25" ${G} stroke-dasharray="2.5 2.5"/>` +
    hatch(poly, [40, 47, 54, 61]) +
    `<path d="${now}" stroke="currentColor" stroke-width="${W}" stroke-linejoin="round"/>` +
    `<path d="M18.5,12.6V${B}" stroke="${ACC}" stroke-width="${W}" stroke-linecap="round"/>`,
  );
})();

// ---------- 2 stat-earlier-later · an event, a dashed arc, the later effect (accent circle, hatched) ----------
const earlierLater = (() => {
  const cx = 33.5, cy = 21, r = 9.5, ey = 21, B = 38.5;
  return svg(
    `<path d="M4,${B}H44" stroke="currentColor" stroke-width="2.25" ${G} stroke-linecap="round"/>` +
    [8, 16.5, 25, 33.5].map((x) => dot(x, B, 2.42, 'currentColor', ' opacity=".55"')).join('') +
    `<path d="M11.5,16.5C15,10 20,9 24,13" stroke="currentColor" stroke-width="3" ${G} ${DASH} stroke-linecap="round"/>` +
    dot(8, ey, 4.83) +
    hatch(circlePoly(cx, cy, r), [cx + cy - 9, cx + cy - 3, cx + cy + 3, cx + cy + 9]) +
    `<circle cx="${cx}" cy="${cy}" r="${r}" stroke="${ACC}" stroke-width="${W}"/>` +
    dot(cx, cy, 2.53),
  );
})();

// ---------- 3 stat-goes-together · scatter, regression line, hatched band ----------
const goesTogether = (() => {
  const y = (x) => 37 - (x - 6) * 2 / 3, h = 8;             // line and half-height of the band
  const band = [[5, y(5) + h], [5, y(5) - h], [40, y(40) - h], [40, y(40) + h]];   // as long as the line
  return svg(
    hatch(band, [36, 43, 50, 57]) +   // along the line: ticks across it read as railway track at this size
    `<path d="M5,${f(y(5))}L40,${f(y(40))}" stroke="currentColor" stroke-width="${W}" stroke-linecap="round"/>` +
    [[9.5, 37.6], [15.5, 27.6], [21.5, 30.2], [27.5, 19.8], [33.5, 22]].map(([x, yy]) => dot(x, yy, 3.1)).join('') +
    dot(40, y(40), 4.37, ACC),
  );
})();

// ---------- 4 stat-outside-usual · dashed usual band, a line whose last point leaves it ----------
const outsideUsual = (() => {
  const pts = [[8, 32], [14.5, 27.5], [21, 33], [27.5, 28], [34, 31.5]], end = [40.5, 11];
  return svg(
    `<path d="M7,22.5H41A3,3 0 0 1 44,25.5V36A3,3 0 0 1 41,39H7A3,3 0 0 1 4,36V25.5A3,3 0 0 1 7,22.5Z" stroke="currentColor" stroke-width="3" ${G} ${DASH}/>` +
    `<path d="M${[...pts, end].map((p) => p.join(',')).join('L')}" stroke="currentColor" stroke-width="${W}" stroke-linejoin="round" stroke-linecap="round"/>` +
    pts.map(([x, yy]) => dot(x, yy, 3)).join('') +
    dot(end[0], end[1], 4.37, ACC),
  );
})();

// ---------- 5 stat-how-sure · forest plot: estimates with whiskers against a dashed zero line ----------
const howSure = (() => {
  const band = [[23, 10.5], [44, 10.5], [44, 19.5], [23, 19.5]];
  return svg(
    `<path d="M14,6V42" stroke="currentColor" stroke-width="3" ${G} ${DASH}/>` +
    hatch(band, [35, 40, 45, 50, 55, 60]) +
    `<path d="M23,15H44" stroke="${ACC}" stroke-width="${W}" stroke-linecap="round"/>` + sq(33.5, 15, 7.5, ACC) +
    `<path d="M6,27.5H30" stroke="currentColor" stroke-width="2.75" stroke-linecap="round"/>` + sq(18.5, 27.5, 6.5, 'currentColor') +
    `<path d="M4,38H20" stroke="currentColor" stroke-width="2.75" stroke-linecap="round"/>` + sq(10.5, 38, 6.5, 'currentColor'),
  );
})();

// ---------- 6 stat-show-up-together · two overlapping sets, shared days in the accent ----------
const showUpTogether = (() => {
  const r = 12.5, a = 16.5, b = 31.5, cy = 24;
  return svg(
    hatch(circlePoly(a, cy, r), [31, 37.5, 44, 50.5]) +
    `<circle cx="${a}" cy="${cy}" r="${r}" stroke="currentColor" stroke-width="${W}"/>` +
    `<circle cx="${b}" cy="${cy}" r="${r}" stroke="currentColor" stroke-width="3" ${G} ${DASH}/>` +
    dot(10, 20.5, 2.88) + dot(12.5, 29.5, 2.88) + dot(37.5, 19.5, 2.88) + dot(36.5, 29.5, 2.88) +
    dot(22.8, 19.6, 3.56, ACC) + dot(25.2, 28.6, 3.56, ACC),
  );
})();

export const STAT_EMBLEMS = [
  { id: 'stat-before-after', label: 'Before / after', svg: beforeAfter },
  { id: 'stat-earlier-later', label: 'Earlier / later', svg: earlierLater },
  { id: 'stat-goes-together', label: 'Goes together', svg: goesTogether },
  { id: 'stat-outside-usual', label: 'Outside your usual', svg: outsideUsual },
  { id: 'stat-how-sure', label: 'How sure', svg: howSure },
  { id: 'stat-show-up-together', label: 'Show up together', svg: showUpTogether },
];
