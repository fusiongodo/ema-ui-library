// Soft-solid glyph family (brief: icon-lab/briefs/glyphs-01.md).
// Source of truth: the five SVG strings plus the colour tokens.
// Geometry is on a 48 grid; helpers below only turn the brief's numbers into paths.

export const TOKENS = {
  ink: '#2E2C34',
  today: '#E1C29E',
  checkins: '#A9D4B9',
  protocols: '#BFC4EF',
  insights: '#E2B9D5',
  card: '#F2F1F4',
  tabBar: '#FFFFFF',
  hairline: '#E4E2E8',
};

export const STROKE = 4.5;
export const GAP = 2.4;

const f = (n) => +n.toFixed(3);

// Closed polygon with a corner radius per vertex (0 = sharp). Works for convex and concave corners.
function roundedPoly(pts, radii) {
  const n = pts.length;
  let d = '';
  for (let i = 0; i < n; i++) {
    const p = pts[i], a = pts[(i - 1 + n) % n], b = pts[(i + 1) % n];
    const r = radii[i] || 0;
    if (!r) { d += (i ? 'L' : 'M') + f(p[0]) + ',' + f(p[1]); continue; }
    const v1 = [a[0] - p[0], a[1] - p[1]], v2 = [b[0] - p[0], b[1] - p[1]];
    const l1 = Math.hypot(...v1), l2 = Math.hypot(...v2);
    const u1 = [v1[0] / l1, v1[1] / l1], u2 = [v2[0] / l2, v2[1] / l2];
    const ang = Math.acos(Math.max(-1, Math.min(1, u1[0] * u2[0] + u1[1] * u2[1])));
    const t = r / Math.tan(ang / 2);
    const s = [p[0] + u1[0] * t, p[1] + u1[1] * t], e = [p[0] + u2[0] * t, p[1] + u2[1] * t];
    // turn direction: cross of incoming direction (p-a) and outgoing (b-p)
    const cross = (p[0] - a[0]) * (b[1] - p[1]) - (p[1] - a[1]) * (b[0] - p[0]);
    const sweep = cross > 0 ? 1 : 0;
    d += (i ? 'L' : 'M') + f(s[0]) + ',' + f(s[1]) + `A${f(r)},${f(r)} 0 0 ${sweep} ${f(e[0])},${f(e[1])}`;
  }
  return d + 'Z';
}

const rrect = (x0, y0, x1, y1, r) =>
  roundedPoly([[x0, y0], [x1, y0], [x1, y1], [x0, y1]], [r, r, r, r]);

// Pill (fully round ends), horizontal.
const pill = (x0, x1, cy, h) => {
  const r = h / 2;
  return `M${f(x0 + r)},${f(cy - r)}H${f(x1 - r)}A${r},${r} 0 0 1 ${f(x1 - r)},${f(cy + r)}H${f(x0 + r)}A${r},${r} 0 0 1 ${f(x0 + r)},${f(cy - r)}Z`;
};

// Scale a glyph by k so that point (cx,cy) of the source lands on the grid centre (24,24).
// Stroke widths and gaps are pre-divided by k in the source, so the drawn values stay 4.5 and 2.4.
const scaled = (k, cx, cy, body) =>
  `<g transform="translate(24 24) scale(${f(k)}) translate(${f(-cx)} ${f(-cy)})">${body}</g>`;
const sw = (w, k) => f(w / k);

const svg = (body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">${body}</svg>`;

// ---------- 1 tab-today · house (round 2) ----------
// Roof (6,22)->(24,7)->(42,22). Whole glyph scaled so the ink box is 38 wide:
// ink width = 36k + 4.5 = 38  ->  k = 0.9306. Vertical pivot chosen so the ink box is centred on y 24.
const house = (() => {
  const k = 33.5 / 36, h = STROKE / 2 / k;          // h: half stroke in source units
  const slope = 15 / 18, cos = Math.cos(Math.atan(slope));
  const roofY = (x) => 7 + slope * Math.abs(x - 24);
  const apex = 7 + (STROKE / 2 + GAP) / k / cos;   // body top runs parallel, 2.4 (drawn) below the roof's lower edge
  const bodyY = (x) => apex + slope * Math.abs(x - 24);
  const body = roundedPoly(
    [[11, bodyY(11)], [24, apex], [37, bodyY(37)], [37, 41], [11, 41]],
    [1.5, 0, 1.5, 3, 3],
  );
  const door = rrect(19.5, 27, 28.5, 37.5, 1.5);
  // chimney (round 3): top y 6, bottom follows the roof centreline, so it ends inside the roof stroke and never meets the body
  const chimney = roundedPoly([[31, 6], [35.5, 6], [35.5, roofY(35.5)], [31, roofY(31)]], [1.2, 1.2, 0, 0]);
  const cy = (7 - h + 41) / 2;                      // ink box: top = apex join (7 - h), bottom = 41
  return svg(scaled(k, 24, cy,
    `<path d="M6,22L24,7L42,22" stroke="currentColor" stroke-width="${sw(STROKE, k)}" stroke-linecap="round" stroke-linejoin="round"/>` +
    `<path d="${chimney}" fill="currentColor"/>` +
    `<path d="${body}${door}" fill="currentColor" fill-rule="evenodd"/>`,
  ));
})();

// ---------- 2 tab-checkins · pulse (round 2) ----------
// The brief's points give an ink width of 40.5 (3.75-44.25 incl. round caps), past the 4-44 live area -> overall scale 0.98.
const PULSE_SCALE = 0.98;
const pulse = svg(scaled(PULSE_SCALE, 24, 24,
  `<path d="M6,26L15,26L19.5,9L25.5,39L31,15L35,26L42,26" stroke="currentColor" stroke-width="${sw(STROKE, PULSE_SCALE)}" stroke-linecap="round" stroke-linejoin="round"/>`,
));

// ---------- 3 tab-protocols · capsule and tablet (round 3) ----------
// Capsule 26 x 12 on the "/" diagonal, tablet r 9, 2.4 clearance, tablet shifted 2.5 per axis (drawn) along (+1,-1)
// toward the capsule's upper half. One overall scale k fits the wider side (x) to 38; gaps stay 2.4 drawn.
// The shift makes the box wider than tall, so it is 38 x ~33 and centred on (24,24).
const pills = (() => {
  const SHIFT = 2.5 * Math.SQRT2;                   // drawn offset along the capsule axis
  const k = (38 - (GAP + SHIFT) / Math.SQRT2) / (7 / Math.SQRT2 + 6 + 15 / Math.SQRT2 + 9);
  const L = 26 * k, W = 12 * k, r = W / 2, tr = 9 * k, g = GAP / 2;
  const reach = (L / 2 - r) / Math.SQRT2 + r;       // capsule half-extent in x and y
  const D = r + GAP + tr;                           // centre distance across the axis (clearance 2.4)
  const dx = (D + SHIFT) / Math.SQRT2, dy = (D - SHIFT) / Math.SQRT2;   // tablet centre relative to capsule centre
  const left = -reach, right = Math.max(reach, dx + tr), top = Math.min(-reach, dy - tr), bot = Math.max(reach, dy + tr);
  const cx = 24 - (left + right) / 2, cy = 24 - (top + bot) / 2;       // capsule centre so the box is centred
  const tx = cx + dx, ty = cy + dy;
  // capsule drawn horizontal around (cx,cy), then rotated -45° so it rises to the right
  const x0 = cx - L / 2, x1 = cx + L / 2, y0 = cy - r, y1 = cy + r;
  const lower = `M${f(cx - g)},${f(y0)}H${f(x0 + r)}A${f(r)},${f(r)} 0 0 0 ${f(x0 + r)},${f(y1)}H${f(cx - g)}Z`;
  const upper = `M${f(cx + g)},${f(y0)}H${f(x1 - r)}A${f(r)},${f(r)} 0 0 1 ${f(x1 - r)},${f(y1)}H${f(cx + g)}Z`;
  // tablet as two circle segments: the 2.4 score cut runs across the full diameter
  const w = Math.sqrt(tr * tr - g * g);
  const tp = `M${f(tx - w)},${f(ty - g)}A${f(tr)},${f(tr)} 0 0 1 ${f(tx + w)},${f(ty - g)}Z`;
  const bt = `M${f(tx + w)},${f(ty + g)}A${f(tr)},${f(tr)} 0 0 1 ${f(tx - w)},${f(ty + g)}Z`;
  return svg(
    `<path d="${lower}${upper}" fill="currentColor" transform="rotate(-45 ${f(cx)} ${f(cy)})"/>` +
    `<path d="${tp}${bt}" fill="currentColor"/>`,
  );
})();

// ---------- 4 tab-insights · three bars (round 2, no scaling) ----------
const bars = svg(
  `<path d="M12,39V27M24,39V9M36,39V18" stroke="currentColor" stroke-width="${STROKE}" stroke-linecap="round"/>`,
);

// ---------- 5 evaluation · document ----------
const doc = (() => {
  // Flap: right triangle (28,5) (28,15) (38,15); the page keeps a 2.4 gap around its two legs.
  const fx = 28, fy = 15, g = GAP;
  const page = roundedPoly(
    [[10, 5], [fx - g, 5], [fx - g, fy + g], [38, fy + g], [38, 43], [10, 43]],
    [3.5, 1.5, 1.5 + g, 1.5, 3.5, 3.5],
  );
  const flap = roundedPoly([[28, 5], [28, 15], [38, 15]], [1.5, 1.5, 1.5]);
  const lines = pill(16, 26, 24, 3.4) + pill(16, 32, 30.5, 3.4) + pill(16, 32, 37, 3.4);
  return svg(
    `<path d="${page}${lines}" fill="currentColor" fill-rule="evenodd"/>` +
    `<path d="${flap}" fill="currentColor"/>`,
  );
})();

export const GLYPHS = [
  { n: 1, id: 'tab-today', label: 'Home', area: 'today', ref: 'tab-today.png', svg: house },
  { n: 2, id: 'tab-checkins', label: 'Symptoms', area: 'checkins', ref: 'tab-checkins.png', svg: pulse },
  { n: 3, id: 'tab-protocols', label: 'Medication', area: 'protocols', ref: 'tab-protocols.png', svg: pills },
  { n: 4, id: 'tab-insights', label: 'Insights', area: 'insights', ref: 'tab-insights.png', svg: bars },
  { n: 5, id: 'evaluation', label: 'Evaluation', area: 'insights', ref: 'evaluation.png', svg: doc },
];
