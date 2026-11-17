/* Concept "Garden bed": a bed seen in cross-section. A hand sets one seed, a first sprout appears, more hands bring more seeds,
   and slowly many small plants grow, each with its own leaves. Under the surface their roots find each other.
   No sky: the ground above the soil is one calm cream surface. Growth stays small and slow on purpose; nothing has to bloom. */
import { W, H, f, rad, PAL, rng, frame, wordmark } from "../kit.mjs";

const ID = "garden";
const WALL = PAL.cream;
const SOIL = ["#A06C48", "#93613F", "#855539"];          // top layer, deeper, deepest
const STEM = "#4F8F7B";
const C = { mint: "#8ACDA7", mintD: "#6FBE93", mintL: "#BDE5CC", teal: "#63A29B", tealD: "#3F8785", peri: "#98A2EE", periL: "#C5CBF7",
  rose: "#DC9DCA", roseL: "#EDC8E2", apricot: "#FFAF57", apricotL: "#FFD49B", root: "#EBCFAA" };
const r1 = v => +(+v).toFixed(1);

/* ---------- soil ---------- */
/* the surface: a slow wave; holes dip in (depth > 0), little mounds rise (depth < 0) */
function surfaceY(x, y0, marks = []){
  let y = y0 + 2.5 * Math.sin(x / 41 + .6) + 1.5 * Math.sin(x / 17);
  for(const m of marks) y += m.depth * Math.exp(-(((x - m.x) / m.w) ** 2));
  return y;
}
const PEBBLES = (() => { const R = rng(77), out = [];
  for(let i = 0; i < 15; i++) out.push({ x: 14 + R() * (W - 28), d: 34 + R() * 230, rx: 4 + R() * 7, ry: 3 + R() * 4, rot: (R() - .5) * 50, c: ["#C39A74", "#B88962", "#D2AE88"][i % 3] });
  return out; })();
function soil(y0, marks = [], under = ""){
  let d = `M -10 ${H + 10} L -10 ${r1(surfaceY(-10, y0, marks))}`;
  for(let x = -6; x <= W + 10; x += 4) d += ` L ${x} ${r1(surfaceY(x, y0, marks))}`;
  d += ` L ${W + 10} ${H + 10} Z`;
  const band = (dy, amp, ph) => { let p = `M -10 ${H + 10} L -10 ${y0 + dy}`; for(let x = 0; x <= W + 10; x += 10) p += ` L ${x} ${r1(y0 + dy + amp * Math.sin(x / 58 + ph))}`; return p + ` L ${W + 10} ${H + 10} Z`; };
  return `<path d="${d}" fill="${SOIL[0]}"/><path d="${band(150, 7, 1)}" fill="${SOIL[1]}"/><path d="${band(232, 6, 3)}" fill="${SOIL[2]}"/>`
    + under
    + PEBBLES.filter(p => y0 + p.d < H + 6).map(p => `<ellipse cx="${r1(p.x)}" cy="${r1(y0 + p.d)}" rx="${r1(p.rx)}" ry="${r1(p.ry)}" fill="${p.c}" transform="rotate(${r1(p.rot)} ${r1(p.x)} ${r1(y0 + p.d)})"/>`).join("");
}

/* ---------- small parts ---------- */
/* a leaf from its base, pointing along deg (0 = right, -90 = up) */
function leaf(x, y, deg, len, wid, fill, vein){
  return `<g transform="translate(${r1(x)} ${r1(y)}) rotate(${r1(deg)})"><path d="M 0 0 C ${r1(len * .3)} ${r1(-wid)} ${r1(len * .78)} ${r1(-wid * .85)} ${r1(len)} 0 C ${r1(len * .78)} ${r1(wid * .85)} ${r1(len * .3)} ${r1(wid)} 0 0 Z" fill="${fill}"/>`
    + (vein ? `<path d="M ${r1(len * .14)} 0 L ${r1(len * .8)} 0" stroke="${vein}" stroke-width="1.3" stroke-linecap="round"/>` : "") + `</g>`;
}
const qpt = (a, c, b, t) => [(1 - t) ** 2 * a[0] + 2 * (1 - t) * t * c[0] + t * t * b[0], (1 - t) ** 2 * a[1] + 2 * (1 - t) * t * c[1] + t * t * b[1]];
const qdeg = (a, c, b, t) => Math.atan2(2 * (1 - t) * (c[1] - a[1]) + 2 * t * (b[1] - c[1]), 2 * (1 - t) * (c[0] - a[0]) + 2 * t * (b[0] - c[0])) * 180 / Math.PI;
const stem = (a, c, b, w = 3) => `<path d="M ${r1(a[0])} ${r1(a[1])} Q ${r1(c[0])} ${r1(c[1])} ${r1(b[0])} ${r1(b[1])}" fill="none" stroke="${STEM}" stroke-width="${w}" stroke-linecap="round"/>`;

/* ---------- the plants: each kind draws itself at (x, y) with growth g from 0 to 1 ---------- */
const KINDS = {
  /* a straight stalk with leaves left and right; as a seedling it is just two leaves */
  stalk(x, y, g){
    const h = 16 + 172 * g, top = [x - 3 * g, y - h], a = [x, y], c = [x + 7 * g, y - h * .5];
    let s = stem(a, c, top, 3.4);
    const n = Math.max(1, Math.round(h / 27));
    for(let k = 1; k <= n; k++){ const t = k / n, [px, py] = qpt(a, c, top, t), L = (12 + 14 * g) * (k === n ? .85 : 1 - .25 * t);
      const sides = k === n ? [-1, 1] : [k % 2 ? -1 : 1];
      for(const sd of sides) s += leaf(px, py, -90 + sd * (k === n ? 42 : 60), L, L * .4, k % 2 ? C.mint : C.mintD, "#4F9B77"); }
    return s;
  },
  /* thin stems with round leaves */
  round(x, y, g){
    const n = 2 + Math.round(3 * g); let s = "";
    for(let k = 0; k < n; k++){
      const ang = (k - (n - 1) / 2) * (30 - 4 * g) + (k % 2 ? 4 : -3), len = (22 + 78 * g) * [1, .78, .92, .64, .84][k], r = 5 + 8.5 * g - k * .5;
      const e = [x + Math.sin(rad(ang)) * len, y - Math.cos(rad(ang)) * len];
      s += stem([x, y], [x + Math.sin(rad(ang)) * len * .2, y - len * .7], e, 2.2)
        + `<circle cx="${r1(e[0])}" cy="${r1(e[1])}" r="${r1(r)}" fill="${k % 2 ? C.periL : C.peri}"/><circle cx="${r1(e[0])}" cy="${r1(e[1] + r * .12)}" r="${r1(Math.max(1.2, r * .16))}" fill="${k % 2 ? C.peri : "#E3E6FC"}"/>`;
    }
    return s;
  },
  /* arching fronds with small leaflets */
  fern(x, y, g, { lean = 1 } = {}){
    const fronds = g > .45 ? [[-34, 1], [38, .86], [6, .7]] : [[-16, 1], [20, .8]]; let s = "";
    for(const [dx0, k] of fronds){
      const dx = dx0 * lean * (.5 + .7 * g), h = (24 + 96 * g) * k, a = [x, y], c = [x + dx * .1, y - h], b = [x + dx, y - h * .7];
      s += stem(a, c, b, 2.2);
      const n = Math.max(2, Math.round(h / 13));
      for(let i = 1; i <= n; i++){ const t = .16 + .84 * i / n, [px, py] = qpt(a, c, b, t), dg = qdeg(a, c, b, t), L = (7 + 9 * g) * (1.05 - .6 * t);
        if(i === n) s += leaf(px, py, dg, L * 1.1, L * .36, C.teal);
        else s += leaf(px, py, dg - 64, L, L * .36, C.teal) + leaf(px, py, dg + 64, L, L * .36, i % 2 ? C.teal : "#7DB5AD"); }
    }
    return s;
  },
  /* one winding stem with heart-shaped leaves */
  heart(x, y, g){
    const h = 22 + 96 * g, a = [x, y], c = [x + 12, y - h * .5], b = [x - 5, y - h]; let s = stem(a, c, b, 2.8);
    const heartAt = (px, py, deg, L, fill) => `<g transform="translate(${r1(px)} ${r1(py)}) rotate(${r1(deg)}) scale(${r1(L)})"><path d="M 0 0 C -.1 -.38 -.72 -.3 -.6 .22 C -.5 .58 -.12 .8 0 1 C .12 .8 .5 .58 .6 .22 C .72 -.3 .1 -.38 0 0 Z" fill="${fill}"/><path d="M 0 .14 L 0 .7" stroke="#C57DB0" stroke-width=".07" stroke-linecap="round"/></g>`;
    const n = Math.max(1, Math.round(h / 24));
    for(let k = 1; k <= n; k++){ const t = k / n, [px, py] = qpt(a, c, b, t), sd = k % 2 ? 1 : -1, L = (9 + 9 * g) * (k === n ? .9 : 1.05 - .2 * t);
      if(k === n){ s += heartAt(px, py + 1, 180, L, C.rose); continue; }
      const ex = px + sd * 7, ey = py - 3;
      s += `<path d="M ${r1(px)} ${r1(py)} L ${r1(ex)} ${r1(ey)}" stroke="${STEM}" stroke-width="2" stroke-linecap="round"/>` + heartAt(ex, ey, 180 + sd * 62, L, k % 2 ? C.roseL : C.rose); }
    return s;
  },
  /* a tuft of blades */
  grass(x, y, g, { lean = 0 } = {}){
    const n = 4 + Math.round(3 * g); let s = "";
    for(let k = 0; k < n; k++){
      const u = (k - (n - 1) / 2) / n, len = (20 + 66 * g) * [.8, 1, .7, .92, .6, .86, .74][k], dx = u * (30 + 40 * g) + lean * 10, bx = x + u * 10;
      const tip = [bx + dx, y - len], c = [bx + dx * .15, y - len * .75];
      s += `<path d="M ${r1(bx - 2.6)} ${r1(y)} Q ${r1(c[0] - 2)} ${r1(c[1])} ${r1(tip[0])} ${r1(tip[1])} Q ${r1(c[0] + 3)} ${r1(c[1] + 3)} ${r1(bx + 2.6)} ${r1(y)} Z" fill="${[C.mint, C.mintD, C.teal][k % 3]}"/>`;
    }
    return s;
  },
  /* a few broad leaves straight from the ground */
  broad(x, y, g){
    const L = 24 + 84 * g, set = g > .4 ? [[-40, .78], [34, .7], [-13, 1], [12, .9]] : [[-22, .9], [18, 1]]; let s = "";
    set.forEach(([dg, k], i) => { s += leaf(x + dg * .08, y + 2, -90 + dg, L * k, L * k * .2, i % 2 ? C.apricotL : C.apricot, i % 2 ? "#F3B86E" : "#FFD49B"); });
    return s;
  },
  /* clover: thin stems, three round leaflets each */
  clover(x, y, g){
    const n = 2 + Math.round(2 * g); let s = "";
    for(let k = 0; k < n; k++){
      const ang = (k - (n - 1) / 2) * 34 + (k % 2 ? 5 : -4), len = (16 + 46 * g) * [1, .7, .86, .58][k], e = [x + Math.sin(rad(ang)) * len, y - Math.cos(rad(ang)) * len], r = 3.4 + 3.2 * g;
      s += stem([x, y], [x + Math.sin(rad(ang)) * len * .15, y - len * .7], e, 2);
      for(let j = 0; j < 3; j++){ const a2 = rad(ang - 90 + (j - 1) * 118); s += `<circle cx="${r1(e[0] + Math.cos(a2) * r * .85)}" cy="${r1(e[1] + Math.sin(a2) * r * .85)}" r="${r1(r)}" fill="${k % 2 ? C.mint : C.mintD}"/>`; }
    }
    return s;
  },
  /* a low rosette of thick leaves */
  rosette(x, y, g){
    const n = 5 + 2 * Math.round(g), L = 12 + 24 * g; let s = "";
    const order = Array.from({ length: n }, (_, k) => k).sort((p, q) => Math.abs(q - (n - 1) / 2) - Math.abs(p - (n - 1) / 2));   // outer leaves first
    for(const k of order){ const u = (k - (n - 1) / 2) / ((n - 1) / 2), len = L * (1 - .28 * Math.abs(u));
      s += leaf(x + u * 3, y + 1, -90 + u * 74, len, len * .3, k % 2 ? C.roseL : C.rose, k % 2 ? null : "#E9B9DB"); }
    return s;
  },
};
/* roots: a tap root with a few side roots; depth in px */
function roots(x, y, depth, seed){
  const R = rng(seed), bend = (R() - .5) * 14;
  let d = `M ${r1(x)} ${r1(y)} Q ${r1(x + bend)} ${r1(y + depth * .55)} ${r1(x + bend * .3)} ${r1(y + depth)}`;
  const n = Math.max(1, Math.round(depth / 30));
  for(let k = 1; k <= n; k++){ const t = k / (n + .6), sd = (k + (seed % 2)) % 2 ? 1 : -1, px = x + bend * t, py = y + depth * t, len = depth * (.34 - .12 * t) + 5;
    d += ` M ${r1(px)} ${r1(py)} q ${r1(sd * len * .6)} ${r1(len * .1)} ${r1(sd * len)} ${r1(len * .62)}`; }
  return `<path d="${d}" fill="none" stroke="${C.root}" stroke-width="1.7" stroke-linecap="round" opacity=".9"/>`;
}
/* where two neighbours' roots meet: two arcs and a small knot */
function meet(x1, x2, y, d1, d2){
  const mx = (x1 + x2) / 2 + (d1 - d2) * .1, my = y + (d1 + d2) / 2 + 12;
  return `<path d="M ${r1(x1)} ${r1(y + d1)} Q ${r1((x1 + mx) / 2)} ${r1(my + 6)} ${r1(mx)} ${r1(my)} M ${r1(x2)} ${r1(y + d2)} Q ${r1((x2 + mx) / 2)} ${r1(my + 6)} ${r1(mx)} ${r1(my)}" fill="none" stroke="${C.root}" stroke-width="1.7" stroke-linecap="round" opacity=".9"/>`
    + `<circle cx="${r1(mx)}" cy="${r1(my)}" r="2.7" fill="#FFF2DF"/>`;
}
/* seeds: every one a little different */
function seed(x, y, kind, deg = 0){
  const body = [
    `<path d="M 0 -7 C 5 -4 6 3 0 7 C -6 3 -5 -4 0 -7 Z" fill="#C4854A"/><path d="M -1.6 -3 q -1.6 3 0 6" stroke="#E2AE78" stroke-width="1.4" fill="none" stroke-linecap="round"/>`,
    `<ellipse rx="4.6" ry="7" fill="#F7E6C6"/><path d="M -1.6 -4.5 V 4.5 M 1.6 -4.5 V 4.5" stroke="#8B6A4E" stroke-width="1.2" stroke-linecap="round"/>`,
    `<circle r="5" fill="#6E4A35"/><circle cx="-1.5" cy="-1.6" r="1.3" fill="#93684C"/>`,
    `<path d="M -6 -1 C -6 -6 5 -7 6 -1 C 7 4 2 6 0 3 C -2 6 -6 4 -6 -1 Z" fill="#D69AAE"/>`,
    `<ellipse rx="3.6" ry="5.4" fill="#E9C27A"/>`,
  ][kind % 5];
  return `<g transform="translate(${r1(x)} ${r1(y)}) rotate(${deg})">${body}</g>`;
}
/* a small label on a stake */
function sign(x, y, h, mark){
  const tag = { heart: `<path d="M 0 3.6 C -6 -1 -3 -5 0 -2 C 3 -5 6 -1 0 3.6 Z" fill="${C.rose}"/>`,
    leaf: `<path d="M -4.5 3 C -4 -3 2 -4.5 5 -4 C 5 1 1 4 -4.5 3 Z" fill="${C.mint}"/>`,
    dots: `<circle cx="-4" cy="0" r="1.9" fill="${C.apricot}"/><circle cx="1" cy="-2" r="1.9" fill="${C.peri}"/><circle cx="4.5" cy="2" r="1.9" fill="${C.mint}"/>`,
    lines: `<path d="M -5 -2 H 5 M -5 2 H 2" stroke="${C.tealD}" stroke-width="1.6" stroke-linecap="round"/>` }[mark];
  return `<rect x="${r1(x - 1.8)}" y="${r1(y - h)}" width="3.6" height="${r1(h + 10)}" rx="1.8" fill="#BE8A5C"/>`
    + `<g transform="translate(${r1(x)} ${r1(y - h)}) rotate(${mark === "heart" ? -5 : mark === "leaf" ? 4 : -2})"><rect x="-11.5" y="-9" width="23" height="18" rx="5" fill="#FFFBF3" stroke="#D9B58C" stroke-width="1.4"/>${tag}</g>`;
}
/* the snail: it is in no hurry */
function snail(x, y){
  return `<g transform="translate(${r1(x)} ${r1(y)})"><path d="M -15 0 C -15 -5 -9 -6 -4 -6 L 9 -6 C 13 -6 13 -13 17 -13 C 21 -13 22 -8 21 -4 C 20 -1 17 0 13 0 Z" fill="#F4D7B8"/>`
    + `<path d="M 16 -12 l -2 -7 M 20 -12 l 2.5 -6.5" stroke="#F4D7B8" stroke-width="1.8" stroke-linecap="round"/><circle cx="14" cy="-19.5" r="1.6" fill="#6B4A36"/><circle cx="22.6" cy="-19" r="1.6" fill="#6B4A36"/>`
    + `<circle cx="-1" cy="-12" r="10.5" fill="${C.apricot}"/><path d="M -1 -12 m 0 -6.5 a 6.5 6.5 0 1 1 -6.4 5.4 a 3.6 3.6 0 1 1 5 3.3" fill="none" stroke="#E98F33" stroke-width="1.8" stroke-linecap="round"/></g>`;
}
/* a hand reaching down from above (the mitten of the "Hands" concept, seen the same way): wrist at (x, y), fingers pointing down */
const FX = [-29, -14.5, 0, 14.5, 29], TIP = [-90, -99, -95, -83], FR = 7.25;
const MITTEN = (() => { let d = `M -21 12 C -25 -12 -29 -26 -29 -50 L -29 ${TIP[0] + FR}`;
  for(let i = 0; i < 4; i++){ d += ` A ${FR} ${FR} 0 0 1 ${FX[i + 1]} ${TIP[i] + FR}`; if(i < 3) d += ` L ${FX[i + 1]} ${TIP[i + 1] + FR}`; }
  return d + " L 29 -50 C 29 -26 25 -12 21 12 Z"; })();
function hand(x, y, tilt, a, k = .86){
  return `<g transform="translate(${x} ${y}) rotate(${180 + tilt}) scale(${k})"><rect x="-31" y="2" width="62" height="900" fill="${a.sleeve}"/>`
    + `<g fill="${a.skin}"><ellipse cx="-31" cy="-27" rx="9.5" ry="21" transform="rotate(-30 -31 -27)"/><path d="${MITTEN}"/></g>`
    + `<g stroke="${a.line}" stroke-width="2.4" stroke-linecap="round" fill="none">${[1, 2, 3].map(i => `<line x1="${FX[i]}" y1="${Math.max(TIP[i - 1], TIP[i]) + FR + .5}" x2="${FX[i]}" y2="-58"/>`).join("")}</g>`
    + `<rect x="-36" y="-7" width="72" height="26" rx="11" fill="${a.cuff}"/><g stroke="${a.rib}" stroke-width="2" stroke-linecap="round" opacity=".55">${[-22, -11, 0, 11, 22].map(v => `<line x1="${v}" y1="0" x2="${v}" y2="12"/>`).join("")}</g></g>`;
}
const ARM = {
  rose: { skin: "#E2AB7C", line: "#C1875A", sleeve: "#DC9DCA", cuff: "#F1CFE7", rib: "#C67DB1" },
  mint: { skin: "#8E5B3C", line: "#6C4027", sleeve: "#8ACDA7", cuff: "#C8ECD6", rib: "#67B58A" },
  peri: { skin: "#F3CFAE", line: "#DBA683", sleeve: "#98A2EE", cuff: "#CDD2FA", rib: "#7985DE" },
};

/* ---------- the bed ---------- */
/* x, kind, how deep its roots go, options; "g" per still is given where the plant is drawn */
const BED = [
  { x: 195, kind: "stalk", depth: 118 },          // 0: the first one
  { x: 100, kind: "heart", depth: 84 },           // 1
  { x: 300, kind: "fern", depth: 92 },            // 2
  { x: 54, kind: "grass", depth: 52 },            // 3
  { x: 248, kind: "round", depth: 76 },           // 4
  { x: 346, kind: "rosette", depth: 44 },         // 5
  { x: 148, kind: "broad", depth: 100 },          // 6
  { x: 20, kind: "fern", depth: 70, opt: { lean: -1 } },   // 7
  { x: 76, kind: "clover", depth: 46 },           // 8
  { x: 222, kind: "clover", depth: 50 },          // 9
  { x: 324, kind: "grass", depth: 56, opt: { lean: -.4 } },  // 10
  { x: 374, kind: "round", depth: 64 },           // 11
  { x: 172, kind: "grass", depth: 40, opt: { lean: .3 } },   // 12
  { x: 274, kind: "heart", depth: 66 },           // 13
];
const plant = (i, y, g) => KINDS[BED[i].kind](BED[i].x, y + 1, g, BED[i].opt || {});
const rootsOf = (i, y, k = 1) => roots(BED[i].x, y + 2, BED[i].depth * k, 11 + i * 7);
/* all plants of a still: grown = [[index, g], …]; taller ones stand behind */
function bed(y, grown, { link = false } = {}){
  const order = [...grown].sort((a, b) => b[1] * (BED[b[0]].kind === "stalk" ? 2 : 1) - a[1] * (BED[a[0]].kind === "stalk" ? 2 : 1));
  const under = grown.map(([i, g]) => rootsOf(i, y, .35 + .65 * g)).join("")
    + (link ? [...grown].sort((a, b) => BED[a[0]].x - BED[b[0]].x).map(([i, g], k, list) => { if(!k) return ""; const [j, gj] = list[k - 1];
        return meet(BED[j].x, BED[i].x, y, BED[j].depth * (.35 + .65 * gj) * .62, BED[i].depth * (.35 + .65 * g) * .62); }).join("") : "");
  return { under, over: order.map(([i, g]) => plant(i, y, g)).join("") };
}
const wall = `<rect width="${W}" height="${H}" fill="${WALL}"/>`;
const still = (n, label, inner) => frame(label, wall + inner);
const Y = 566;                                    // the surface of the bed in scene coordinates
/* The camera starts close to the one seed and slowly pulls back as the bed fills: scale s, the surface at screen height ys. */
const view = (s, ys, inner, px = W / 2) => `<g transform="translate(${r1(W / 2 - px * s)} ${r1(ys - Y * s)}) scale(${s})">${inner}</g>`;

/* still 1: a hand sets one seed */
const f1 = still(1, "Eine Hand setzt einen einzelnen Samen in die Erde", view(2, 592,
  hand(200, Y - 124, 5, ARM.rose, .62) + seed(195, Y - 31, 0, 12)
  + soil(Y, [{ x: 195, depth: 13, w: 11 }])));

/* still 2: the first sprout; more hands, more seeds */
const f2 = (() => {
  const b = bed(Y, [[0, .1]]);
  return still(2, "Der erste Spross ist da, weitere Hände bringen Samen", view(1.7, 590,
    hand(136, Y - 150, -15, ARM.mint, .68) + hand(262, Y - 164, 14, ARM.peri, .68)
    + seed(148, Y - 44, 1, -14) + seed(248, Y - 58, 3, 20)
    + b.over
    + soil(Y, [{ x: 148, depth: 12, w: 10 }, { x: 248, depth: 12, w: 10 }, { x: 195, depth: -3, w: 14 }, { x: 100, depth: -4, w: 12 }, { x: 300, depth: -4, w: 12 }],
        b.under + seed(100, Y + 14, 4, 30) + seed(300, Y + 15, 2) + seed(195, Y + 12, 0, 12))));
})();

/* still 3: several small plants, each different, each at its own pace; two seeds are only just waking up */
const f3 = (() => {
  const b = bed(Y, [[0, .4], [1, .34], [2, .3], [3, .3], [5, .3], [6, .14], [4, .15]]);
  return still(3, "Viele kleine Pflanzen wachsen langsam, jede mit anderen Blättern", view(1.5, 556,
    b.over
    + soil(Y, [{ x: 222, depth: -4, w: 12 }, { x: 76, depth: -4, w: 12 }], b.under + seed(222, Y + 14, 1, 80) + seed(76, Y + 15, 3, -20)
        + `<path d="M 222 ${Y + 11} q 3 -5 0 -9" stroke="${C.mintL}" stroke-width="2" fill="none" stroke-linecap="round"/>`)
    + snail(270, surfaceY(270, Y) + 1)));
})();

/* stills 4 and 5: the whole bed */
const FULL = [[0, .88], [1, .8], [2, .82], [3, .86], [4, .84], [5, .9], [6, .76], [7, .7], [8, .8], [9, .62], [10, .6], [11, .56], [12, .46]];
const SIGNS = [[124, 44, "leaf"], [234, 38, "heart"], [322, 34, "dots"]];
function full(y, more){
  const b = bed(y, more ? FULL.map(([i, g]) => [i, Math.min(1, g + .06)]) : FULL, { link: true }), sx = more ? 284 : 277;
  return b.over + SIGNS.map(([x, h, m]) => sign(x, surfaceY(x, y), h, m)).join("") + soil(y, [], b.under) + snail(sx, surfaceY(sx, y) + 1);
}
const f4 = still(4, "Ein ganzes Beet, dicht und lebendig, mit kleinen Schildern; unter der Erde berühren sich die Wurzeln", view(1.2, 568, full(Y, false)));
const f5 = still(5, "Das Beet unten, darüber die Wortmarke MEjority", wordmark({ y: 300, fill: PAL.teal }) + view(1.06, 616, full(Y, true)));

export default {
  id: ID,
  order: 7,
  title: "Garden bed",
  idea: "Jede:r setzt etwas Kleines in dasselbe Beet. Es wächst langsam, jede Pflanze anders, und unter der Erde finden die Wurzeln zueinander: Zusammen entsteht, was keine:r allein hätte.",
  duration: "ca. 7 s",
  frames: [
    { t: "0,0 s", caption: "Eine Hand setzt einen einzelnen Samen in die Erde.", svg: f1 },
    { t: "1,5 s", caption: "Ein erster kleiner Spross; zwei weitere Hände bringen ihre Samen dazu.", svg: f2 },
    { t: "3,1 s", caption: "Mehrere Pflänzchen wachsen, jedes mit anderen Blättern und in seinem eigenen Tempo.", svg: f3 },
    { t: "4,7 s", caption: "Das Beet ist dicht geworden, kleine Schilder stecken dazwischen, und unter der Erde berühren sich die Wurzeln.", svg: f4 },
    { t: "6,2 s", caption: "Der Blick hebt sich ein wenig: über dem Beet steht „MEjority“.", svg: f5 },
  ],
};
