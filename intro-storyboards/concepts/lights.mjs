/* Concept "Lights": one light, then a few that spell ME, then many that travel to their places and spell "jority".
   The ground brightens from deep teal to mint; the letters appear behind the lights and the lights settle into them.
   No sky, no horizon, no sun: one flat colour per still. */
import { W, H, f, PAL, rng, frame, wordmark, WORDMARK_SIZE } from "../kit.mjs";

const ID = "lights";
const S = WORDMARK_SIZE, BASE = 432;             // font size and baseline of the wordmark; the lights sit on the same letters

/* Centre lines of the eight letters in em, traced from SF Pro Rounded (ME bold, jority medium); x from the glyph origin, y up = negative.
   Each stroke is a list of pieces; a dot sits on every piece end, further dots are spread evenly along each piece. */
const GLYPHS = [
  { ch: "M", adv: .8674, bold: 1, strokes: [[["M", .125, -.062], ["L", .125, -.645], ["L", .432, -.075], ["L", .74, -.645], ["L", .74, -.062]]] },
  { ch: "E", adv: .5774, bold: 1, strokes: [[["M", .47, -.645], ["L", .125, -.645], ["L", .125, -.354], ["L", .125, -.062], ["L", .47, -.062]], [["M", .125, -.354], ["L", .455, -.354]]] },
  { ch: "j", adv: .2203, strokes: [[["M", .108, -.47], ["L", .108, .03], ["Q", .108, .138, .0, .138]]], dots: [[.108, -.652]] },
  { ch: "o", adv: .5491, ring: [.27, -.258, .193, .222] },
  { ch: "r", adv: .3310, strokes: [[["M", .093, -.47], ["L", .093, -.045]], [["M", .093, -.31], ["Q", .115, -.47, .262, -.475]]] },
  { ch: "i", adv: .2203, strokes: [[["M", .108, -.47], ["L", .108, -.045]]], dots: [[.108, -.652]] },
  { ch: "t", adv: .3236, strokes: [[["M", .13, -.60], ["L", .13, -.472], ["L", .13, -.13], ["Q", .13, -.045, .25, -.045]], [["M", .05, -.472], ["L", .24, -.472]]] },
  { ch: "y", adv: .5093, strokes: [[["M", .426, -.47], ["L", .222, .045], ["Q", .185, .14, .086, .14]], [["M", .056, -.47], ["L", .24, -.02]]] },
];
const X0 = W / 2 - GLYPHS.reduce((s, g) => s + g.adv, 0) * S / 2;
const STEP = { bold: .15, thin: .088 };            // distance between two lights along a stroke, in em
const LINE = { bold: .135, thin: .1 };           // stroke width of the letters, in em
const DOTR = { bold: .06, thin: .037 };          // radius of a light, in em

const quad = (p0, c, p1, t) => [(1 - t) ** 2 * p0[0] + 2 * (1 - t) * t * c[0] + t * t * p1[0], (1 - t) ** 2 * p0[1] + 2 * (1 - t) * t * c[1] + t * t * p1[1]];
/* evenly spaced points on one piece (line, quadratic curve or closed ellipse), both ends included */
function spread(at, step, closed){
  const N = 60, pts = Array.from({ length: N + 1 }, (_, i) => at(i / N)), acc = [0];
  for(let i = 1; i <= N; i++) acc.push(acc[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const n = Math.max(1, Math.round(acc[N] / step)), out = [];
  for(let k = 0; k <= n - (closed ? 1 : 0); k++){
    const d = acc[N] * k / n; let i = 1; while(i < N && acc[i] < d) i++;
    const u = acc[i] === acc[i - 1] ? 0 : (d - acc[i - 1]) / (acc[i] - acc[i - 1]);
    out.push([pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * u, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * u]);
  }
  return out;
}

/* build the places (one per light) and the letter outlines, in screen pixels */
const PLACES = [], OUTLINES = [];
{
  let x = X0;
  for(const g of GLYPHS){
    const w = g.bold ? "bold" : "thin", step = STEP[w], mine = [];
    const px = ([ex, ey]) => [x + ex * S, BASE + ey * S];
    const add = p => { if(!mine.some(q => Math.hypot(q[0] - p[0], q[1] - p[1]) < step * .55)) mine.push(p); };
    if(g.ring){ const [cx, cy, rx, ry] = g.ring;
      spread(t => [cx + rx * Math.sin(t * 2 * Math.PI), cy - ry * Math.cos(t * 2 * Math.PI)], step, true).forEach(add);
      const [X, Y] = px([cx, cy]);
      OUTLINES.push({ w, el: `<ellipse cx="${f(X)}" cy="${f(Y)}" rx="${f(rx * S)}" ry="${f(ry * S)}"/>` });
    }
    for(const st of g.strokes || []){
      let cur = null, d = "";
      for(const [op, ...v] of st){
        if(op === "M"){ cur = [v[0], v[1]]; d += `M ${px(cur).map(f).join(" ")}`; add(cur); }
        else if(op === "L"){ const a = cur, b = [v[0], v[1]]; spread(t => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t], step).forEach(add); cur = b; d += ` L ${px(b).map(f).join(" ")}`; }
        else { const a = cur, c = [v[0], v[1]], b = [v[2], v[3]]; spread(t => quad(a, c, b, t), step).forEach(add); cur = b; d += ` Q ${px(c).map(f).join(" ")} ${px(b).map(f).join(" ")}`; }
      }
      OUTLINES.push({ w, el: `<path d="${d}"/>` });
    }
    for(const p of g.dots || []){ add(p); const [X, Y] = px(p); OUTLINES.push({ w, dot: 1, el: `<circle cx="${f(X)}" cy="${f(Y)}" r="${f(.062 * S)}"/>` }); }
    for(const p of mine){ const [X, Y] = px(p); PLACES.push({ x: X, y: Y, ch: g.ch, bold: !!g.bold, r: DOTR[w] * S }); }
    x += g.adv * S;
  }
}
const ME = PLACES.filter(p => p.bold), MANY = PLACES.filter(p => !p.bold);

/* light colours: warm, with a little variety (every light is a person) */
const LCOL = ["#FFE7BC", "#FFD49B", "#FFC27D", "#F8D2E6", "#FFF0D2"];
{
  const R = rng(7);
  ME.forEach(p => { p.c = [0, 1, 1, 0, 2][Math.floor(R() * 5)]; });
  MANY.forEach(p => { p.c = [0, 1, 2, 3, 4, 0, 1, 4][Math.floor(R() * 8)]; p.late = R(); });
}
const FIRST = ME.reduce((best, p) => p.ch === "E" && Math.abs(p.y - (BASE - .354 * S)) < 1 && p.x > best.x ? p : best, { x: -1 });   // tip of the E's middle arm, close to the centre of the screen
FIRST.c = 1;

/* where the many come from: spread over the whole screen, not too close to each other or to the word */
{
  const R = rng(29), starts = [];
  let guard = 0;
  while(starts.length < MANY.length && guard++ < 20000){
    const x = 20 + R() * (W - 40), y = 64 + R() * (H - 150);
    if(x > 44 && x < W - 44 && y > BASE - 96 && y < BASE + 50) continue;
    if(starts.some(s => Math.hypot(s.x - x, s.y - y) < 33)) continue;
    starts.push({ x, y });
  }
  /* The word is written from left to right by whoever is closest: the nearest lights go to the j, the farthest to the y.
     Inside a letter two lights swap places whenever that shortens their ways, which also keeps the ways from crossing. */
  const mid = { x: (Math.min(...MANY.map(p => p.x)) + Math.max(...MANY.map(p => p.x))) / 2, y: BASE - .26 * S };
  const dist = (p, s) => Math.hypot(p.x - s.x, p.y - s.y);
  starts.sort((a, b) => dist(mid, a) - dist(mid, b));
  MANY.forEach((p, i) => { p.from = starts[i]; });          // MANY is in letter order already
  for(let pass = 0, moved = true; moved && pass < 60; pass++){
    moved = false;
    for(let i = 0; i < MANY.length; i++) for(let j = i + 1; j < MANY.length; j++){
      const a = MANY[i], b = MANY[j];
      if(a.ch === b.ch && dist(a, b.from) + dist(b, a.from) < dist(a, a.from) + dist(b, b.from) - .01){ [a.from, b.from] = [b.from, a.from]; moved = true; }
    }
  }
}
const way = p => Math.hypot(p.x - p.from.x, p.y - p.from.y);

/* ---------- drawing ---------- */
const defs = n => `<defs>${LCOL.map((c, k) => `<radialGradient id="${ID}-f${n}-g${k}"><stop offset="0" stop-color="${c}" stop-opacity=".55"/><stop offset=".4" stop-color="${c}" stop-opacity=".2"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient>`).join("")}</defs>`;
function light(n, x, y, r, c, { op = 1, glow = 4.2 } = {}){
  return `<g${op < 1 ? ` opacity="${f(op)}"` : ""}>${glow ? `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r * glow)}" fill="url(#${ID}-f${n}-g${c})"/>` : ""}`
    + `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="${LCOL[c]}"/></g>`;
}
/* Out in the open a light is a soft lantern; on its way it shrinks to the size of its place in the letter. */
const FAR = 2.1;
/* Every light moves at the same calm pace on a straight line: after `gone` px the near ones have arrived,
   the far ones are still on their way. The short tail points back to where a light came from. */
function onTheWay(n, p, gone){
  const len = way(p) || 1;
  if(gone >= len) return light(n, p.x, p.y, p.r, p.c);
  const ux = (p.x - p.from.x) / len, uy = (p.y - p.from.y) / len, x = p.from.x + ux * gone, y = p.from.y + uy * gone;
  const r = p.r * (1 + (FAR - 1) * Math.min(1, (len - gone) / 150)), tail = Math.min(gone, 20), w = r * .8;
  return `<path d="M ${f(x - uy * w)} ${f(y + ux * w)} L ${f(x - ux * tail)} ${f(y - uy * tail)} L ${f(x + uy * w)} ${f(y - ux * w)} Z" fill="${LCOL[p.c]}" opacity=".22"/>`
    + light(n, x, y, r, p.c, { glow: 3.6 });
}
const letters = (colour, opacity = 1) => `<g fill="none" stroke="${colour}" stroke-linecap="round" stroke-linejoin="round"${opacity < 1 ? ` opacity="${opacity}"` : ""}>`
  + ["bold", "thin"].map(w => `<g stroke-width="${f(LINE[w] * S)}">${OUTLINES.filter(o => o.w === w && !o.dot).map(o => o.el).join("")}</g>`).join("")
  + `</g><g fill="${colour}"${opacity < 1 ? ` opacity="${opacity}"` : ""}>${OUTLINES.filter(o => o.dot).map(o => o.el).join("")}</g>`;

const ground = c => `<rect width="${W}" height="${H}" fill="${c}"/>`;
const DEEP = PAL.teal, HALF = "#72A99A", LIGHT = PAL.mint;
const still = (n, inner) => frame(`Lights, Bild ${n}`, inner);

/* still 3: letter by letter the lights set off; j, o and r are complete, the others have come this many px so far */
const GONE = { j: 999, o: 999, r: 999, i: 185, t: 120, y: 70 };

const f1 = still(1, ground(DEEP) + defs(1)
  + light(1, FIRST.x, FIRST.y, FIRST.r * 1.15, FIRST.c, { glow: 9 }));

const f2 = still(2, ground(DEEP) + defs(2)
  + MANY.map(p => light(2, p.from.x, p.from.y, p.r * FAR * (.7 + .3 * p.late), p.c, { op: .5 + .5 * p.late, glow: 3.6 })).join("")
  + ME.map(p => light(2, p.x, p.y, p.r, p.c)).join(""));

const f3 = still(3, ground(DEEP) + defs(3)
  + ME.map(p => light(3, p.x, p.y, p.r, p.c)).join("")
  + MANY.map(p => onTheWay(3, p, GONE[p.ch])).join(""));

const f4 = still(4, ground(HALF) + defs(4) + letters(DEEP)
  + PLACES.map(p => light(4, p.x, p.y, p.r * .62, 4, { glow: 3.2 })).join(""));

const f5 = still(5, ground(LIGHT) + wordmark({ y: BASE, fill: DEEP }));

export default {
  id: ID,
  order: 2,
  title: "Lights become the word",
  idea: "Ein Licht allein ist ein Punkt. Ein paar Lichter ergeben „ME“, viele ergeben „jority“: Jedes Licht ist ein Mensch und findet seinen Platz im Wort. Dabei wird es hell.",
  duration: "ca. 6,5 s",
  frames: [
    { t: "0,0 s", caption: "Tiefes Blaugrün, darin glimmt ein einzelnes kleines Licht auf.", svg: f1 },
    { t: "1,3 s", caption: "Ein paar Lichter stellen sich zu „ME“ auf, während ringsum immer mehr auftauchen.", svg: f2 },
    { t: "2,8 s", caption: "Die vielen ziehen ruhig und geradewegs an ihren Platz, Buchstabe für Buchstabe entsteht „jority“.", svg: f3 },
    { t: "4,4 s", caption: "Alle sind angekommen, der Grund hellt langsam auf, und hinter den Lichtern werden die Buchstaben sichtbar.", svg: f4 },
    { t: "5,8 s", caption: "Die Lichter gehen in den Buchstaben auf, die Wortmarke steht ruhig auf hellem Mint.", svg: f5 },
  ],
};
