/* Concept "Quilt": one patch of fabric lies on a warm table. More patches come in from all sides, each with its own pattern,
   they lie down next to each other and fine stitches join them. The finished patchwork is a blanket, and somebody rests under it.
   On a calm cream field of that blanket the name is stitched. Seen from above throughout; no sky, no horizon.

   The whole quilt is generated once in "quilt units" (u): a rectangle cut again and again by slightly slanted lines, so no patch
   is a perfect rectangle and no two seams are parallel. Every still looks at this one quilt with its own scale and offset. */
import { W, H, f, PAL, rng, frame, wordmark, WORDMARK_SIZE } from "../kit.mjs";

const ID = "quilt";
const TABLE = PAL.apricot;                        // the ground of stills 1 to 3
const THREAD = PAL.teal;                          // one thread for every stitch, and for the name
const SHADOW = "#8A4B1F";

/* ---------- geometry helpers (convex polygons as lists of [x, y]) ---------- */
const r1 = v => +(+v).toFixed(1);
const centre = p => { let x = 0, y = 0; for(const q of p){ x += q[0]; y += q[1]; } return [x / p.length, y / p.length]; };
const bbox = p => { const xs = p.map(q => q[0]), ys = p.map(q => q[1]); return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)]; };
const area = p => { let a = 0; for(let i = 0; i < p.length; i++){ const [x1, y1] = p[i], [x2, y2] = p[(i + 1) % p.length]; a += x1 * y2 - x2 * y1; } return a / 2; };
/* cut a convex polygon by the line through o with direction d; returns [left part, right part] (either may be null) */
function cut(poly, o, d){
  const side = q => (q[0] - o[0]) * d[1] - (q[1] - o[1]) * d[0], A = [], B = [];
  for(let i = 0; i < poly.length; i++){
    const p = poly[i], q = poly[(i + 1) % poly.length], sp = side(p), sq = side(q);
    if(sp >= 0) A.push(p); if(sp <= 0) B.push(p);
    if((sp > 0 && sq < 0) || (sp < 0 && sq > 0)){ const t = sp / (sp - sq), x = [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t]; A.push(x); B.push(x); }
  }
  return [A.length > 2 ? A : null, B.length > 2 ? B : null];
}
const inside = (poly, x, y) => { for(let i = 0; i < poly.length; i++){ const [x1, y1] = poly[i], [x2, y2] = poly[(i + 1) % poly.length];
  if((x2 - x1) * (y - y1) - (y2 - y1) * (x - x1) < 0) return false; } return true; };   // polygons run clockwise on screen (y down)
/* move every edge of a convex polygon inwards by d */
function inset(poly, d){
  const n = poly.length, lines = [];
  for(let i = 0; i < n; i++){ const [x1, y1] = poly[i], [x2, y2] = poly[(i + 1) % n], l = Math.hypot(x2 - x1, y2 - y1) || 1, nx = -(y2 - y1) / l, ny = (x2 - x1) / l;
    lines.push({ px: x1 + nx * d, py: y1 + ny * d, dx: (x2 - x1) / l, dy: (y2 - y1) / l }); }
  return lines.map((b, i) => { const a = lines[(i + n - 1) % n], den = a.dx * b.dy - a.dy * b.dx;
    if(Math.abs(den) < 1e-6) return [b.px, b.py];
    const t = ((b.px - a.px) * b.dy - (b.py - a.py) * b.dx) / den; return [a.px + a.dx * t, a.py + a.dy * t]; });
}

/* ---------- the quilt ---------- */
const FIELD = { w: 322, h: 158 };                 // the calm field for the name, around the origin
const Q = [[-380, -480], [380, -480], [380, 690], [-380, 690]];
const PATCHES = [];                               // { poly, c, fab, field?, first? }
{
  const R = rng(23), slant = (deg, spread = 3.4) => { const a = (deg + (R() - .5) * 2 * spread) * Math.PI / 180; return [Math.cos(a), Math.sin(a)]; };
  /* cut a region into patches: always across its longer side, somewhere around the middle, never quite straight */
  const split = (poly, depth = 0) => {
    const [x1, y1, x2, y2] = bbox(poly), w = x2 - x1, h = y2 - y1;
    const must = w > 172 || h > 166, may = w * h > 11500 && Math.max(w, h) > 128 && R() < .55;
    if(!(must || may) || depth > 8){ PATCHES.push({ poly }); return; }
    const across = w / h > 1 + (R() - .5) * .3, at = .36 + R() * .28;
    const o = across ? [x1 + w * at, (y1 + y2) / 2] : [(x1 + x2) / 2, y1 + h * at];
    const [a, b] = cut(poly, o, across ? slant(90) : slant(0));
    if(!a || !b){ PATCHES.push({ poly }); return; }
    split(a, depth + 1); split(b, depth + 1);
  };
  /* the field first: a band across the quilt, then the field out of its middle */
  const [above, bandAndBelow] = cut(Q, [0, -FIELD.h / 2], slant(1.2, 0));
  const [band, below] = cut(bandAndBelow, [0, FIELD.h / 2], slant(-1.1, 0));
  const [fieldAndRight, left] = cut(band, [-FIELD.w / 2, 0], slant(91.6, 0));
  const [right, field] = cut(fieldAndRight, [FIELD.w / 2, 0], slant(88.2, 0));
  PATCHES.push({ poly: field, field: true });
  [above, below, left, right].forEach(p => split(p));
  for(const p of PATCHES){ if(area(p.poly) < 0) p.poly.reverse(); p.c = centre(p.poly); }
}
const FIELD_P = PATCHES[0];
/* the first patch: two rows above the field, a little left of the middle */
const FIRST = PATCHES.filter(p => !p.field).reduce((best, p) => Math.hypot(p.c[0] + 62, p.c[1] + 236) < Math.hypot(best.c[0] + 62, best.c[1] + 236) ? p : best);
FIRST.first = true;

/* seams: where two patches meet, and a stitch across the seam every few units */
const STITCHES = [];                              // { a, b, x1, y1, x2, y2 } in u, a < b = indices of the two patches
{
  const R = rng(61), boxes = PATCHES.map(p => bbox(p.poly));
  PATCHES.forEach(p => { p.next = new Set(); });
  PATCHES.forEach((p, i) => {
    const n = p.poly.length;
    for(let k = 0; k < n; k++){
      const [x1, y1] = p.poly[k], [x2, y2] = p.poly[(k + 1) % n], len = Math.hypot(x2 - x1, y2 - y1); if(len < 16) continue;
      const ux = (x2 - x1) / len, uy = (y2 - y1) / len, nx = uy, ny = -ux;                 // outward normal of a clockwise polygon
      const count = Math.max(1, Math.round((len - 10) / 12.5));
      for(let s = 0; s < count; s++){
        const d = 5 + (len - 10) * (s + .5) / count, x = x1 + ux * d, y = y1 + uy * d, ox = x + nx * 3, oy = y + ny * 3;
        const j = PATCHES.findIndex((q, m) => m !== i && ox >= boxes[m][0] && ox <= boxes[m][2] && oy >= boxes[m][1] && oy <= boxes[m][3] && inside(q.poly, ox, oy));
        if(j < 0) continue;
        p.next.add(j);
        if(i < j){ const t = .5 + (R() - .5) * .3, c = Math.cos(t), sn = Math.sin(t), vx = (nx * c - ny * sn) * 4.1, vy = (nx * sn + ny * c) * 4.1;   // slanted, like whip stitches
          STITCHES.push({ a: i, b: j, x1: x - vx, y1: y - vy, x2: x + vx, y2: y + vy }); }
      }
    }
  });
}

/* ---------- fabrics ---------- */
const FABRICS = [
  { key: "mint-leaf", fam: "mint", base: "#BDE5CC", edge: "#93CFAC", kind: "leaves", ink: "#93CFAC", rot: 0 },
  { key: "mint-dot", fam: "mint", base: "#A5DABB", edge: "#7FC49C", kind: "dots", ink: "#E4F5EA", rot: 14 },
  { key: "peri-dot", fam: "peri", base: "#C5CBF7", edge: "#9CA6EC", kind: "dots", ink: "#F3F4FF", rot: 0 },
  { key: "peri-stripe", fam: "peri", base: "#B2BAF3", edge: "#8F9AE6", kind: "stripes", ink: "#CDD2FA", rot: 90 },
  { key: "rose-check", fam: "rose", base: "#EDC8E2", edge: "#D9A3CA", kind: "check", ink: "#D9A3CA", rot: 0 },
  { key: "rose-cross", fam: "rose", base: "#E5B4D6", edge: "#CF93BE", kind: "crosses", ink: "#F8E4F1", rot: 45 },
  { key: "cream-stripe", fam: "cream", base: "#FFF2DF", edge: "#EFD2A8", kind: "stripes", ink: "#FFD49B", rot: 0 },
  { key: "cream-leaf", fam: "cream", base: "#FFF6E8", edge: "#EFD2A8", kind: "leaves", ink: "#F6C98C", rot: 30 },
  { key: "orange-check", fam: "orange", base: "#FFBC72", edge: "#F39F49", kind: "check", ink: "#FFE3BE", rot: 0 },
  { key: "teal-dot", fam: "teal", base: "#86BDB6", edge: "#63A29B", kind: "dots", ink: "#D7ECE8", rot: -20 },
  { key: "orange-stripe", fam: "orange", base: "#FFC98A", edge: "#F3A654", kind: "stripes", ink: "#FFE6C4", rot: 45 },
  { key: "peri-check", fam: "peri", base: "#D3D8FA", edge: "#A9B2F0", kind: "check", ink: "#A9B2F0", rot: 45 },
];
const FIELD_FAB = { key: "field", fam: "cream", base: "#FFF6E8", edge: "#EFD2A8", kind: "plain" };
{
  const R = rng(137);
  FIELD_P.fab = FIELD_FAB; FIRST.fab = FABRICS[2];
  /* nobody lies next to a fabric of the same colour family; the first patch stays the only dotted periwinkle near it */
  const order = PATCHES.map((p, i) => i).filter(i => !PATCHES[i].fab).sort((a, b) => Math.hypot(...PATCHES[a].c.map((v, k) => v - FIRST.c[k])) - Math.hypot(...PATCHES[b].c.map((v, k) => v - FIRST.c[k])));
  const used = Object.fromEntries(FABRICS.map(fb => [fb.key, 0]));
  for(const i of order){
    const p = PATCHES[i], near = [...p.next].map(j => PATCHES[j].fab).filter(Boolean), fams = new Set(near.map(fb => fb.fam));
    const far = [...p.next].flatMap(j => [...PATCHES[j].next]).map(j => PATCHES[j].fab).filter(Boolean).map(fb => fb.key);
    let pool = FABRICS.filter(fb => !fams.has(fb.fam) && fb.key !== "peri-dot");
    if(!pool.length) pool = FABRICS.filter(fb => !near.includes(fb) && fb.key !== "peri-dot");
    const score = fb => used[fb.key] * 1.0 + (far.includes(fb.key) ? 2.5 : 0) + (fb.fam === "teal" ? 1.6 : 0) + R() * 1.4;
    p.fab = pool.reduce((best, fb) => { const s = score(fb); return s < best.s ? { fb, s } : best; }, { s: Infinity }).fb;
    used[p.fab.key]++;
  }
}
/* the patterns are quiet: one ink close to the base colour */
function pattern(n, fb){
  const id = `${ID}-${n}-${fb.key}`, open = (w, h = w) => `<pattern id="${id}" width="${w}" height="${h}" patternUnits="userSpaceOnUse"${fb.rot ? ` patternTransform="rotate(${fb.rot})"` : ""}><rect width="${w}" height="${h}" fill="${fb.base}"/>`;
  switch(fb.kind){
    case "dots": return open(18) + `<g fill="${fb.ink}"><circle cx="4.5" cy="4.5" r="2.3"/><circle cx="13.5" cy="13.5" r="2.3"/></g></pattern>`;
    case "stripes": return open(13) + `<rect width="3.4" height="13" fill="${fb.ink}"/></pattern>`;
    case "check": return open(24) + `<g fill="${fb.ink}" opacity=".34"><rect width="12" height="24"/><rect width="24" height="12"/></g></pattern>`;
    case "leaves": return open(30) + `<g fill="${fb.ink}"><path d="M4 10 Q10 2 17 8 Q11 15 4 10 Z"/><path d="M19 26 Q20 17 28 17 Q28 26 19 26 Z"/></g></pattern>`;
    case "crosses": return open(19) + `<path d="M3 5.5 H8 M5.5 3 V8 M12.5 15 H17.5 M15 12.5 V17.5" stroke="${fb.ink}" stroke-width="1.7" stroke-linecap="round"/></pattern>`;
    default: return open(8) + `</pattern>`;
  }
}
const defs = (n, list, more = "") => `<defs>${[...new Set(list.map(p => p.fab))].map(fb => pattern(n, fb)).join("")}${more}</defs>`;

/* ---------- drawing ---------- */
/* the cloth is never quite flat: a slow wobble over the whole quilt (amp in u) */
const wobble = amp => ([x, y]) => [x + amp * (Math.sin(y / 83 + 1.3) + .6 * Math.sin((x + y) / 137)), y + amp * (Math.sin(x / 101 + .5) + .6 * Math.sin((x - y) / 151 + 2))];
/* a polygon outline as a path through densely sampled, warped points */
function outline(poly, warp, step = 14){
  const pts = [];
  for(let i = 0; i < poly.length; i++){ const [x1, y1] = poly[i], [x2, y2] = poly[(i + 1) % poly.length], n = Math.max(1, Math.round(Math.hypot(x2 - x1, y2 - y1) / step));
    for(let k = 0; k < n; k++) pts.push(warp([x1 + (x2 - x1) * k / n, y1 + (y2 - y1) * k / n])); }
  return "M " + pts.map(q => `${r1(q[0])} ${r1(q[1])}`).join(" L ") + " Z";
}
/* one patch: cloth with its pattern, a soft edge, and the hem as a dashed line in a darker tone of the cloth */
function patch(n, p, warp, { hem = true } = {}){
  const d = outline(p.poly, warp);
  return `<path d="${d}" fill="url(#${ID}-${n}-${p.fab.key})" stroke="${p.fab.edge}" stroke-width="1.6" stroke-linejoin="round"/>`
    + (p.field ? `<path d="${outline(inset(p.poly, 11), warp)}" fill="none" stroke="${THREAD}" stroke-width="1.7" stroke-dasharray="6.5 5.5" stroke-linecap="round" stroke-linejoin="round"/>`
      : hem ? `<path d="${outline(inset(p.poly, 7), warp)}" fill="none" stroke="${p.fab.edge}" stroke-width="1.5" stroke-dasharray="5.5 4.5" stroke-linecap="round" stroke-linejoin="round" opacity=".9"/>` : "");
}
const shape = (p, warp) => `<path d="${outline(p.poly, warp)}"/>`;
/* the stitches between patches that are joined (set = indices) */
function stitches(set, warp, width = 1.5){
  let d = "";
  for(const s of STITCHES) if(set.has(s.a) && set.has(s.b)){ const a = warp([s.x1, s.y1]), b = warp([s.x2, s.y2]); d += `M${r1(a[0])} ${r1(a[1])}L${r1(b[0])} ${r1(b[1])}`; }
  return d ? `<path d="${d}" fill="none" stroke="${THREAD}" stroke-width="${width}" stroke-linecap="round"/>` : "";
}

/* stills 1 to 3 look at the first patch: scale and where its centre sits on the screen */
const S13 = 1.06, AT = [W / 2, 404];
const W13 = wobble(1.6);
const view13 = `translate(${f(AT[0] - FIRST.c[0] * S13)} ${f(AT[1] - FIRST.c[1] * S13)}) scale(${S13})`;
const idx = p => PATCHES.indexOf(p);
/* a loose patch: moved away from its place by (dx, dy) screen px and turned by deg around its own centre; with a soft shadow */
function loose(n, p, dx, dy, deg, lift = 7){
  const [cx, cy] = W13(p.c), sx = AT[0] + (cx - FIRST.c[0]) * S13 + dx, sy = AT[1] + (cy - FIRST.c[1]) * S13 + dy;
  const tf = `translate(${f(sx)} ${f(sy)}) rotate(${f(deg)}) scale(${S13}) translate(${r1(-cx)} ${r1(-cy)})`;
  return `<g transform="translate(0 ${lift})" fill="${SHADOW}" opacity=".16"><g transform="${tf}">${shape(p, W13)}</g></g><g transform="${tf}">${patch(n, p, W13)}</g>`;
}
/* how far a patch is from the first one, in "rings" of neighbours */
const RING = new Map([[FIRST, 0]]);
{ let edge = [FIRST]; for(let r = 1; edge.length; r++){ const nxt = []; for(const p of edge) for(const j of p.next){ const q = PATCHES[j]; if(!RING.has(q)){ RING.set(q, r); nxt.push(q); } } edge = nxt; } }

const ground = `<rect width="${W}" height="${H}" fill="${TABLE}"/>`;
const still = (n, label, inner) => frame(label, inner);

/* a loose end of thread */
const threadEnd = (x, y) => `<path d="M ${x} ${y} c 10 4 16 14 10 22 c -5 7 -15 4 -14 -4 c 1 -9 14 -8 22 0 c 7 7 8 18 2 27" fill="none" stroke="${THREAD}" stroke-width="2" stroke-linecap="round"/>`;

/* ----- still 1: one patch ----- */
const f1 = (() => {
  const [bx1, by1, bx2, by2] = bbox(FIRST.poly), cx = AT[0] + (bx2 - FIRST.c[0]) * S13, cy = AT[1] + (by2 - FIRST.c[1]) * S13;
  return still(1, "Ein einzelnes Stück Stoff mit Punkten liegt auf dem Tisch", ground + defs(1, [FIRST])
    + `<g transform="rotate(-5 ${AT[0]} ${AT[1]})">${loose(1, FIRST, 0, 0, 0)}${threadEnd(f(cx - 9), f(cy - 9))}</g>`);
})();

/* ----- still 2: the others come in from all sides ----- */
const f2 = (() => {
  const R = rng(9), list = PATCHES.filter(p => RING.get(p) >= 1 && RING.get(p) <= 2);
  const parts = list.map(p => {
    const vx = (p.c[0] - FIRST.c[0]) * S13, vy = (p.c[1] - FIRST.c[1]) * S13, ring = RING.get(p);
    const ex = ring === 1 ? .62 : .5, ey = ring === 1 ? .95 : .62;                         // how much further out than its place
    return { p, dx: vx * ex + (R() - .5) * 24, dy: vy * ey + (R() - .5) * 24, deg: (R() - .5) * 44, ring };
  }).filter(o => { const x = AT[0] + (o.p.c[0] - FIRST.c[0]) * S13 + o.dx, y = AT[1] + (o.p.c[1] - FIRST.c[1]) * S13 + o.dy; return x > -70 && x < W + 70 && y > -80 && y < H + 80; });
  parts.sort((a, b) => b.ring - a.ring);
  return still(2, "Von allen Seiten kommen weitere Stoffstücke, jedes mit eigenem Muster", ground + defs(2, [FIRST, ...parts.map(o => o.p)])
    + parts.map(o => loose(2, o.p, o.dx, o.dy, o.deg)).join("")
    + `<g transform="rotate(-5 ${AT[0]} ${AT[1]})">${loose(2, FIRST, 0, 0, 0)}</g>`);
})();

/* ----- still 3: the nearest ones lie in place and are stitched on, the next ones are almost there ----- */
const f3 = (() => {
  const R = rng(31), joined = PATCHES.filter(p => RING.get(p) <= 1), set = new Set(joined.map(idx));
  const coming = PATCHES.filter(p => RING.get(p) === 2 || RING.get(p) === 3).map(p => {
    const vx = (p.c[0] - FIRST.c[0]) * S13, vy = (p.c[1] - FIRST.c[1]) * S13, l = Math.hypot(vx, vy) || 1, ring = RING.get(p), far = ring === 2 ? 26 + R() * 16 : 70 + R() * 40;
    return { p, dx: vx / l * far, dy: vy / l * far, deg: (R() - .5) * (ring === 2 ? 16 : 34), ring };
  }).sort((a, b) => b.ring - a.ring);
  const shadow = `<g transform="translate(0 6)" fill="${SHADOW}" opacity=".16"><g transform="${view13}">${joined.map(p => shape(p, W13)).join("")}</g></g>`;
  /* the needle lies across the next seam, the thread runs back to the last stitch (the lowest one on the right) */
  const last = STITCHES.filter(st => set.has(st.a) && set.has(st.b)).reduce((b, st) => st.x2 * .8 + st.y2 > b.x2 * .8 + b.y2 ? st : b);
  const [lx, ly] = W13([last.x2, last.y2]), sx = AT[0] + (lx - FIRST.c[0]) * S13, sy = AT[1] + (ly - FIRST.c[1]) * S13, ex = sx + 30, ey = sy - 40;
  const NEEDLE = "M -6 0 C -6 -4.6 3 -4.2 12 -3.4 L 74 0 L 12 3.4 C 3 4.2 -6 4.6 -6 0 Z";
  const needle = `<path d="M ${f(sx)} ${f(sy)} C ${f(sx - 4)} ${f(sy + 22)} ${f(sx + 34)} ${f(sy + 6)} ${f(ex)} ${f(ey)} c -3 -9 -14 -10 -15 -2" fill="none" stroke="${THREAD}" stroke-width="1.8" stroke-linecap="round"/>`
    + `<g transform="translate(${f(ex)} ${f(ey)}) rotate(17)"><path d="${NEEDLE}" fill="${SHADOW}" opacity=".22" transform="translate(1.5 5)"/>`
    + `<path d="${NEEDLE}" fill="#FFFEFA" stroke="#7FA39E" stroke-width="1.2" stroke-linejoin="round"/><ellipse cx="3" cy="0" rx="4.2" ry="1.5" fill="#6E9792"/></g>`;
  return still(3, "Die Stücke legen sich aneinander, feine Stiche verbinden sie", ground + defs(3, [...joined, ...coming.map(o => o.p)])
    + coming.map(o => loose(3, o.p, o.dx, o.dy, o.deg, 6)).join("")
    + shadow + `<g transform="${view13}">${joined.map(p => patch(3, p, W13)).join("")}${stitches(set, W13)}</g>` + needle);
})();

/* ----- still 4: the finished quilt, and somebody rests under it ----- */
const S4 = .6, AT4 = [W / 2, 478];
const f4 = (() => {
  /* the quilt lies over a body: the seams bend a little away from its axis */
  const axis = y => 14 * Math.sin((y + 140) / 250), wob = wobble(4.2);
  const warp = q => { const [x, y] = wob(q), ax = axis(y), d = x - ax; return [ax + d * (1 + .1 * Math.exp(-((d / 150) ** 2))), y]; };
  const view = `translate(${AT4[0]} ${AT4[1]}) scale(${S4})`;
  const all = new Set(PATCHES.map((p, i) => i));
  /* upper edge of the quilt on the screen: pulled up to the chin in the middle */
  const edge = x => 204 - 20 * Math.exp(-(((x - 195) / 78) ** 2)) + 3.5 * Math.sin(x / 37 + 1);
  const xs = Array.from({ length: 45 }, (_, i) => -20 + i * 10);
  const edgeLine = "M " + xs.map(x => `${x} ${r1(edge(x))}`).join(" L ");
  const clip = `<clipPath id="${ID}-4-under"><path d="${edgeLine} L 420 ${H + 20} L -20 ${H + 20} Z"/></clipPath>`;
  /* bed, pillow, and the one who rests: the figure of the app, eyes closed */
  const bed = `<rect width="${W}" height="${H}" fill="#FFE6C2"/>`
    + `<g transform="rotate(-3 195 112)"><rect x="76" y="50" width="238" height="140" rx="48" fill="${SHADOW}" opacity=".12" transform="translate(0 6)"/>`
    + `<rect x="76" y="50" width="238" height="140" rx="48" fill="#FFF9EE"/>`
    + `<path d="M 104 78 q 14 -10 30 -8 M 258 160 q 18 -2 28 -16" fill="none" stroke="#F1DCC0" stroke-width="3" stroke-linecap="round"/></g>`;
  const hx = 197, hy = 126, hr = 47;
  const person = `<g transform="translate(${hx} ${hy}) rotate(7) scale(${hr})">`
    + `<circle r="1" fill="#F3C7A2"/>`
    + `<path d="M -1.04 -.04 A 1.04 1.04 0 0 1 1.04 -.04 Q .2 -.86 -1.04 -.04 Z" fill="#5B3A29"/>`
    + `<path d="M -.04 -.99 q -.04 -.3 .18 -.3 q .2 0 .14 .19" fill="none" stroke="#5B3A29" stroke-width=".13" stroke-linecap="round"/>`
    + `<g fill="none" stroke="#5A3626" stroke-width=".085" stroke-linecap="round"><path d="M -.56 .14 q .15 .15 .3 0"/><path d="M .26 .14 q .15 .15 .3 0"/><path d="M -.16 .5 q .16 .14 .32 0"/></g>`
    + `<circle cx="-.6" cy=".42" r=".16" fill="#EE9C88" opacity=".6"/><circle cx=".6" cy=".42" r=".16" fill="#EE9C88" opacity=".6"/></g>`;
  /* the body under the quilt: no outline, only the shade the cloth throws where it falls off to both sides, and a few soft folds */
  const lens = (x1, y1, x2, y2, bow, wd) => { const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, l = Math.hypot(x2 - x1, y2 - y1), nx = -(y2 - y1) / l, ny = (x2 - x1) / l;
    return `M ${x1} ${y1} Q ${r1(mx + nx * (bow + wd))} ${r1(my + ny * (bow + wd))} ${x2} ${y2} Q ${r1(mx + nx * (bow - wd))} ${r1(my + ny * (bow - wd))} ${x1} ${y1} Z`; };
  const body = `<g clip-path="url(#${ID}-4-under)">`
    + `<g fill="#FFFFFF" opacity=".13"><path d="M 132 240 C 150 214 244 214 262 242 C 282 290 272 380 276 470 C 280 560 284 650 262 742 C 250 790 190 792 174 748 C 150 680 136 590 136 500 C 136 400 118 300 132 240 Z"/></g>`
    + `<g fill="${SHADOW}" opacity=".085">`
    + `<path d="${lens(292, 236, 300, 770, -26, 13)}"/><path d="${lens(104, 250, 150, 790, 22, 12)}"/>`
    + `<path d="${lens(300, 316, 372, 372, -8, 5)}"/><path d="${lens(306, 560, 380, 596, -9, 5)}"/><path d="${lens(100, 404, 26, 452, -8, 5)}"/><path d="${lens(124, 668, 44, 730, -10, 5)}"/>`
    + `</g></g>`;
  /* the upper hem of the quilt, and two hands that hold it */
  const BIND = "#63A29B";
  const binding = `<path d="${edgeLine}" fill="none" stroke="${BIND}" stroke-width="15" stroke-linecap="round"/>`
    + `<path d="${edgeLine}" fill="none" stroke="#E6F3EF" stroke-width="1.5" stroke-dasharray="5 4.5" stroke-linecap="round" transform="translate(0 3.5)"/>`;
  const hand = (x, flip) => `<g transform="translate(${x} ${r1(edge(x) + 1)}) rotate(${flip * -9}) scale(${flip} 1)">`
    + `<rect x="-17" y="-9" width="34" height="23" rx="11" fill="${SHADOW}" opacity=".16" transform="translate(0 3)"/>`
    + `<rect x="-17" y="-9" width="34" height="23" rx="11" fill="#F3C7A2"/>`
    + `<path d="M -6 3 v 8 M 2 3 v 8 M 10 4 v 6" fill="none" stroke="#D9A27B" stroke-width="2" stroke-linecap="round"/></g>`;
  return still(4, "Die fertige Decke aus vielen Stücken, darunter ruht jemand", bed + defs(4, PATCHES, clip) + person
    + `<path d="${edgeLine} L 420 ${H + 20} L -20 ${H + 20} Z" fill="${SHADOW}" opacity=".14" transform="translate(0 -5)"/>`
    + `<g clip-path="url(#${ID}-4-under)"><g transform="${view}">${PATCHES.map(p => patch(4, p, warp, { hem: false })).join("")}${stitches(all, warp, 1.9)}</g></g>`
    + body + binding + hand(150, 1) + hand(246, -1));
})();

/* ----- still 5: the name on the calm field ----- */
const f5 = (() => {
  const AT5 = [W / 2, 426], warp = wobble(1.4), view = `translate(${AT5[0]} ${AT5[1]})`;
  const seen = PATCHES.filter(p => { const [x1, y1, x2, y2] = bbox(p.poly); return x2 > -W / 2 - 12 && x1 < W / 2 + 12 && y2 > -AT5[1] - 12 && y1 < H - AT5[1] + 12; });
  const set = new Set(seen.map(idx));
  const satin = `<pattern id="${ID}-5-satin" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(-58)"><rect width="4" height="1.4" fill="#FFFFFF" opacity=".15"/></pattern>`;
  return still(5, "MEjority, auf ein ruhiges Feld der Decke gestickt", defs(5, seen, satin)
    + `<g transform="${view}">${seen.map(p => patch(5, p, warp)).join("")}${stitches(set, warp)}</g>`
    + wordmark({ y: AT5[1] + WORDMARK_SIZE * .31 + 1.6, fill: "#E9D3B0" })
    + wordmark({ y: AT5[1] + WORDMARK_SIZE * .31, fill: THREAD })
    + wordmark({ y: AT5[1] + WORDMARK_SIZE * .31, fill: `url(#${ID}-5-satin)` }));
})();

export default {
  id: ID,
  order: 4,
  title: "Quilt",
  idea: "Viele kleine Stoffstücke, jedes mit eigenem Muster, werden zu einer Decke zusammengenäht. Sie wärmt, wer darunter ruht, und auf einem ihrer Felder steht der Name.",
  duration: "ca. 7 s",
  frames: [
    { t: "0,0 s", caption: "Ein einzelnes gepunktetes Stoffstück liegt auf der warmen Fläche, ein Faden hängt lose heraus.", svg: f1 },
    { t: "1,4 s", caption: "Von allen Seiten gleiten weitere Stücke herein, jedes anders gemustert.", svg: f2 },
    { t: "3,0 s", caption: "Die ersten liegen aneinander, feine Stiche verbinden sie; die nächsten sind schon fast da.", svg: f3 },
    { t: "4,6 s", caption: "Der Blick weitet sich: Es ist eine ganze Decke geworden, und darunter ruht jemand.", svg: f4 },
    { t: "6,2 s", caption: "Auf einem ruhigen Feld der Decke steht, wie eingestickt, „MEjority“.", svg: f5 },
  ],
};
