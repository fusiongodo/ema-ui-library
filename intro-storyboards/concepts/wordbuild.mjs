/* Concept "From ME to MEjority": a small "ME" stands alone on a calm periwinkle ground. Little round faces look in from the
   edges, more and more come, and they line up to the right of "ME" as the letters j-o-r-i-t-y. Then they become solid type;
   one of them stays where the dot of the i belongs. No scene, no props: only type and faces.

   A face in a letter is only about 12 px wide, so the letters would not read from faces alone: every face that stands brings
   a round piece of the letter with it (in the colour of the type), and the pieces join where neighbours stand. */
import { W, H, f, FONT, PAL, rng, frame } from "../kit.mjs";

const ID = "wordbuild";
const GROUND = PAL.periwinkle, TYPE = PAL.teal;
const BASE = 446;                                 // baseline of the word in stills 3 to 5
const S = 84;                                     // font size of the word in stills 3 to 5
const R0 = 5.9;                                   // radius of a face standing in a letter
const PIPE = .18, STEP = .157;                    // em: width of a letter made of faces, and the distance from face to face along it

/* advances of SF Pro Rounded in em (ME bold, jority medium), as traced for the "Lights" concept */
const ADV = { M: .8674, E: .5774, j: .2203, o: .5491, r: .3310, i: .2203, t: .3236, y: .5093 };
const ME_W = ADV.M + ADV.E, WORD_W = Object.values(ADV).reduce((s, a) => s + a, 0);

/* The letters j o r i t y while they consist of faces: the centre lines of the type, set a little wider, because a row of faces
   is thicker than a stroke of the type. A stroke is a list of pieces (line, quadratic curve); "ring" is the o; "stub" has no faces. */
const LETTERS = [
  { ch: "j", adv: .29, strokes: [[["M", .108, -.47], ["L", .108, .03], ["Q", .108, .138, 0, .138]]], dot: [.108, -.70] },
  { ch: "o", adv: .62, ring: [.27, -.258, .193, .222] },
  { ch: "r", adv: .40, strokes: [[["M", .093, -.47], ["L", .093, -.045]], [["M", .093, -.47], ["Q", .2, -.5, .275, -.455]]] },
  { ch: "i", adv: .29, strokes: [[["M", .108, -.47], ["L", .108, -.045]]], dot: [.108, -.70], keep: 1 },
  { ch: "t", adv: .46, strokes: [[["M", .13, -.62], ["L", .13, -.13], ["Q", .13, -.045, .26, -.045]], [["M", .13, -.457], ["L", .275, -.457]]], stubs: [[.13, -.457, .035, -.457]] },
  { ch: "y", adv: .51, strokes: [[["M", .44, -.47], ["L", .222, .045], ["Q", .185, .14, .08, .14]], [["M", .04, -.47], ["L", .24, -.02]]] },
];
const HEADS_W = LETTERS.reduce((s, g) => s + g.adv, 0);
const X0 = (W - (ME_W + HEADS_W) * S) / 2;       // left edge of the word made of type and faces
const quad = (a, c, b, t) => [(1 - t) ** 2 * a[0] + 2 * (1 - t) * t * c[0] + t * t * b[0], (1 - t) ** 2 * a[1] + 2 * (1 - t) * t * c[1] + t * t * b[1]];

/* PLACES: one per face. LINKS: the piece of a letter between two neighbouring faces; it appears when both have arrived. */
const PLACES = [], LINKS = [];
{
  let x = X0 + ME_W * S;
  for(const g of LETTERS){
    const px = ([ex, ey]) => [x + ex * S, BASE + ey * S], mine = [];
    /* a face at p, or the one that already stands (almost) there */
    const stand = p => {
      let k = mine.find(i => Math.hypot(PLACES[i].x - p[0], PLACES[i].y - p[1]) < STEP * S * .62);
      if(k == null){ k = PLACES.length; PLACES.push({ x: p[0], y: p[1], ch: g.ch }); mine.push(k); }
      return k;
    };
    /* faces evenly along one piece, and the links between them */
    const run = (at, closed) => {
      const N = 48, pts = Array.from({ length: N + 1 }, (_, i) => px(at(i / N))), acc = [0];
      for(let i = 1; i <= N; i++) acc.push(acc[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
      const n = Math.max(1, Math.round(acc[N] / (STEP * S))), stops = [];
      for(let k = 0; k <= n; k++){ const d = acc[N] * k / n; let i = 0; while(i < N && acc[i] < d - 1e-6) i++; stops.push(i); }
      const who = stops.map((i, k) => closed && k === n ? null : stand(pts[i])); if(closed) who[n] = who[0];
      for(let k = 0; k < n; k++) LINKS.push({ needs: [who[k], who[k + 1]], d: "M " + pts.slice(stops[k], stops[k + 1] + 1).map(q => q.map(f).join(" ")).join(" L ") });
    };
    if(g.ring){ const [cx, cy, rx, ry] = g.ring; run(t => [cx + rx * Math.sin(t * 2 * Math.PI), cy - ry * Math.cos(t * 2 * Math.PI)], true); }
    for(const st of g.strokes || []){
      let cur = null;
      for(const [op, ...v] of st){
        if(op === "M"){ cur = [v[0], v[1]]; continue; }
        const a = cur, b = op === "L" ? [v[0], v[1]] : [v[2], v[3]], c = op === "L" ? null : [v[0], v[1]];
        run(c ? t => quad(a, c, b, t) : t => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
        cur = b;
      }
    }
    for(const [x1, y1, x2, y2] of g.stubs || []) LINKS.push({ needs: [stand(px([x1, y1]))], d: `M ${px([x1, y1]).map(f).join(" ")} L ${px([x2, y2]).map(f).join(" ")}` });
    if(g.dot){ const [X, Y] = px(g.dot); PLACES.push({ x: X, y: Y, ch: g.ch, dot: 1, keep: !!g.keep }); }
    x += g.adv * S;
  }
}
/* the letters as far as they are there: a round "pipe" around every face that stands, joined where neighbours stand */
const pipes = (has = () => true) => `<g fill="none" stroke="${TYPE}" stroke-width="${f(PIPE * S)}" stroke-linecap="round" stroke-linejoin="round">`
  + LINKS.filter(l => l.needs.every(has)).map(l => `<path d="${l.d}"/>`).join("") + `</g>`
  + `<g fill="${TYPE}">${PLACES.map((p, i) => has(i) ? `<circle cx="${f(p.x)}" cy="${f(p.y)}" r="${f(PIPE * S / 2)}"/>` : "").join("")}</g>`;

/* ---------- the people ---------- */
const SKIN = [
  { c: "#F8D9BD", ink: "#5A3626", cheek: "#F0A090" }, { c: "#F0C29A", ink: "#5A3626", cheek: "#EC9C84" },
  { c: "#E2AB7C", ink: "#51301F", cheek: "#DA8B6C" }, { c: "#BF8253", ink: "#3F2416", cheek: "#A9603F" },
  { c: "#8E5B3C", ink: "#2C170D", cheek: "#74412A" }, { c: "#6E432B", ink: "#231108", cheek: "#56301D" },
];
const HAIR = ["#5B3A29", "#2F2622", "#7A4A2B", "#C98B4E", "#E8C078", "#B8B2AC", "#3A2B26"];
const CLOTH = [["#FFAF57", "#FFD49B"], ["#8ACDA7", "#D5F0DF"], ["#DC9DCA", "#F4D6EB"], ["#3F8785", "#84BBB7"], ["#FFF2DF", "#FFD49B"], ["#F3973A", "#FFD49B"]];
const STYLES = ["beanie", "bowl", "scarf", "side", "bun", "curl", "beanie", "afro", "long", "tails", "scarf", "bald", "beanie", "side"];
const PEOPLE = [];
{
  const R = rng(41);
  const pick = a => a[Math.floor(R() * a.length)];
  for(let i = 0; i < PLACES.length; i++){
    const style = STYLES[(i * 5 + Math.floor(R() * 3)) % STYLES.length];
    PEOPLE.push({ skin: pick(SKIN), hair: pick(HAIR), cloth: pick(CLOTH), style, happy: R() < .22 });
  }
}
/* a few are chosen by hand: the ones who look in first (still 2) */
const FIRST = [
  { skin: SKIN[1], hair: HAIR[0], cloth: CLOTH[1], style: "beanie" },    // the one who stays as the dot of the i
  { skin: SKIN[4], hair: HAIR[1], cloth: CLOTH[0], style: "afro" },
  { skin: SKIN[0], hair: HAIR[3], cloth: CLOTH[2], style: "bun" },
  { skin: SKIN[3], hair: HAIR[1], cloth: CLOTH[2], style: "scarf" },
  { skin: SKIN[2], hair: HAIR[5], cloth: CLOTH[3], style: "side" },
  { skin: SKIN[5], hair: HAIR[1], cloth: CLOTH[4], style: "curl" },
];

/* one face: circle, two dots, a small smile; hair or a hat. Drawn in a unit circle and scaled to r.
   look = where the eyes go (-1…1 each way); the whole face shifts a little, as if the head turned. */
function head(x, y, r, p, { look = [0, 0], tilt = 0, cheeks = r > 9 } = {}){
  const fx = look[0] * .15, fy = look[1] * .1, s = p.skin, h = p.hair, [c1, c2] = p.cloth;
  const fringe = (cx, cy) => `<path d="M -1.04 -.02 A 1.04 1.04 0 0 1 1.04 -.02 Q ${cx} ${cy} -1.04 -.02 Z" fill="${h}"/>`;
  let back = "", skin = `<circle r="1" fill="${s.c}"/>`, front = "";
  switch(p.style){
    case "bowl": front = fringe(0, -.86); break;
    case "side": front = fringe(.62, -1.0); break;
    case "curl": front = fringe(-.5, -.95) + `<path d="M -.02 -.98 q -.04 -.34 .2 -.34 q .2 0 .14 .2" fill="none" stroke="${h}" stroke-width=".15" stroke-linecap="round"/>`; break;
    case "bun": back = `<circle cx="0" cy="-1.02" r=".36" fill="${h}"/>`; front = fringe(0, -.8); break;
    case "tails": back = `<circle cx="-1.0" cy=".3" r=".33" fill="${h}"/><circle cx="1.0" cy=".3" r=".33" fill="${h}"/>`; front = fringe(.3, -.9); break;
    case "afro": back = `<circle cx="0" cy="-.16" r="1.2" fill="${h}"/>`; front = fringe(0, -.66); break;
    case "long": back = `<path d="M -1.12 -.1 A 1.12 1.12 0 0 1 1.12 -.1 L 1.12 .66 Q 1.12 1 .8 1 L -.8 1 Q -1.12 1 -1.12 .66 Z" fill="${h}"/>`; front = fringe(-.55, -.98); break;
    case "beanie": front = `<path d="M -1.06 -.22 A 1.06 1.06 0 0 1 1.06 -.22 Z" fill="${c1}"/><rect x="-1.13" y="-.44" width="2.26" height=".38" rx=".19" fill="${c2}"/><circle cx="0" cy="-1.13" r=".24" fill="${c2}"/>`; break;
    case "scarf": back = `<circle cx="0" cy="-.02" r="1.08" fill="${c1}"/>`; skin = `<ellipse cx="${f(fx * .5)}" cy=".16" rx=".74" ry=".76" fill="${s.c}"/>`; break;
    default: break;                                 // bald
  }
  const ey = (p.style === "scarf" ? .14 : .12) + fy, my = (p.style === "scarf" ? .44 : .46) + fy;
  const eyes = p.happy
    ? `<path d="M ${f(-.5 + fx)} ${f(ey + .04)} q .14 -.17 .28 0 M ${f(.22 + fx)} ${f(ey + .04)} q .14 -.17 .28 0" fill="none" stroke="${s.ink}" stroke-width=".11" stroke-linecap="round"/>`
    : `<circle cx="${f(-.36 + fx)}" cy="${f(ey)}" r=".125" fill="${s.ink}"/><circle cx="${f(.36 + fx)}" cy="${f(ey)}" r=".125" fill="${s.ink}"/>`;
  const face = eyes
    + `<path d="M ${f(-.24 + fx)} ${f(my)} Q ${f(fx)} ${f(my + .24)} ${f(.24 + fx)} ${f(my)}" fill="none" stroke="${s.ink}" stroke-width=".115" stroke-linecap="round"/>`
    + (cheeks ? `<circle cx="${f(-.6 + fx)}" cy="${f(my - .02)}" r=".16" fill="${s.cheek}" opacity=".55"/><circle cx="${f(.6 + fx)}" cy="${f(my - .02)}" r=".16" fill="${s.cheek}" opacity=".55"/>` : "");
  return `<g transform="translate(${f(x)} ${f(y)})${tilt ? ` rotate(${f(tilt)})` : ""} scale(${f(r)})">${back}${skin}${front}${face}</g>`;
}

/* ---------- who stands where ---------- */
PEOPLE[PLACES.findIndex(p => p.keep)] = FIRST[0];
PLACES.forEach((p, i) => { p.person = PEOPLE[i]; });

/* still 3: j, o and r stand. Everyone else is on the way, in two loose files from the upper and the lower right;
   out there a face is bigger, it shrinks into its place. Positions are set by hand: x, y, radius. */
const FLOCK = [
  [310, 372, 7.2], [336, 350, 8], [312, 312, 8.6], [352, 306, 9.2], [330, 268, 9.8], [366, 250, 10.4], [344, 212, 11], [316, 172, 11.4], [370, 166, 12], [348, 110, 12.6], [383, 66, 13],
  [304, 506, 7.2], [334, 522, 8], [318, 560, 8.8], [354, 574, 9.4], [336, 618, 10.2], [370, 640, 10.8], [350, 690, 11.6], [322, 740, 12.2], [374, 752, 12.8],
];
const KEEPER_AT = [284, 342, 9.6];
const CROWD = (() => {
  const out = [], free = [];
  PLACES.forEach((p, i) => {
    if(p.ch === "j" || p.ch === "o" || p.ch === "r") out.push({ p, i, x: p.x, y: p.y, r: R0, there: true });
    else if(p.keep) out.push({ p, i, x: KEEPER_AT[0], y: KEEPER_AT[1], r: KEEPER_AT[2] });
    else free.push({ p, i });
  });
  /* the nearest face in the flock belongs to the nearest free place, and so on: nobody has to cross anybody's way */
  for(const [x, y, r] of FLOCK){
    if(!free.length) break;
    let best = 0; free.forEach((c, k) => { if(Math.hypot(c.p.x - x, c.p.y - y) < Math.hypot(free[best].p.x - x, free[best].p.y - y)) best = k; });
    const [{ p, i }] = free.splice(best, 1); out.push({ p, i, x, y, r });
  }
  return out.sort((a, b) => b.r - a.r);                                // the nearer ones on top
})();

/* ---------- type ---------- */
const me = (x, y, size, anchor = "start") => `<text x="${f(x)}" y="${f(y)}" text-anchor="${anchor}" font-family="${FONT}" font-size="${size}" font-weight="700" fill="${TYPE}">ME</text>`;
const ground = `<rect width="${W}" height="${H}" fill="${GROUND}"/>`;
const still = (n, label, inner) => frame(label, ground + inner);
const toward = (x, y, tx, ty) => { const d = Math.hypot(tx - x, ty - y) || 1; return [(tx - x) / d, (ty - y) / d]; };

/* still 1 + 2: ME small in the middle */
const SMALL = 40, SMALL_Y = BASE - 12;
const f1 = still(1, "Ein kleines ME steht allein in der Mitte", me(W / 2, SMALL_Y, SMALL, "middle"));

/* still 2: the first faces look in over the edges; they look at ME */
const PEEK = [
  { who: 0, x: 17, y: 226, r: 31, tilt: 13 },
  { who: 1, x: 376, y: 330, r: 28, tilt: -12 },
  { who: 2, x: 122, y: 826, r: 30, tilt: -4 },
  { who: 3, x: 376, y: 664, r: 31, tilt: -10 },
  { who: 4, x: 13, y: 590, r: 26, tilt: 10 },
  { who: 5, x: 276, y: 833, r: 25, tilt: 5 },
];
const f2 = still(2, "Am Rand tauchen ein paar kleine Gesichter auf und schauen zu ME",
  me(W / 2, SMALL_Y, SMALL, "middle")
  + PEEK.map(k => head(k.x, k.y, k.r, FIRST[k.who], { look: toward(k.x, k.y, W / 2, SMALL_Y - 14), tilt: k.tilt })).join(""));

/* still 3: ME has grown and moved left; many faces come in. Where neighbours stand, the first pieces of the letters appear between them. */
const HERE = new Set(CROWD.filter(o => o.there).map(o => o.i));
const f3 = still(3, "Viele Gesichter rücken heran und stellen sich rechts neben ME auf",
  me(X0, BASE, S) + pipes(i => HERE.has(i))
  + CROWD.map(o => head(o.x, o.y, o.r, o.p.person, { look: o.there ? [0, 0] : toward(o.x, o.y, o.p.x, o.p.y), cheeks: o.r > 9 })).join(""));

/* still 4: everyone stands; the word can be read */
const f4 = still(4, "ME und daneben jority: eine Linie, auf der lauter kleine Gesichter stehen",
  me(X0, BASE, S) + pipes() + PLACES.map(p => head(p.x, p.y, R0, p.person)).join(""));

/* still 5: solid type. The word is set in two pieces around a dotless i, so the face can sit where the dot belongs. */
const XW = (W - WORD_W * S) / 2, XI = XW + (ADV.M + ADV.E + ADV.j + ADV.o + ADV.r) * S;
const f5 = still(5, "MEjority, ein kleines Gesicht ist der Punkt auf dem i",
  `<g font-family="${FONT}" font-size="${S}" fill="${TYPE}">`
  + `<text x="${f(XI)}" y="${BASE}" text-anchor="end"><tspan font-weight="700">ME</tspan><tspan font-weight="500">jor</tspan></text>`
  + `<text x="${f(XI)}" y="${BASE}" font-weight="500">\u0131ty</text></g>`
  + head(XI + .108 * S, BASE - .70 * S, 9.4, FIRST[0], { cheeks: true }));

export default {
  id: ID,
  order: 5,
  title: "From ME to MEjority",
  idea: "Aus „ME“ wird „MEjority“, weil andere dazukommen: Viele kleine Gesichter stellen sich neben das „ME“ und bilden den Rest des Wortes. Eines von ihnen bleibt als Punkt auf dem i.",
  duration: "ca. 6 s",
  frames: [
    { t: "0,0 s", caption: "Ein kleines „ME“ steht allein mitten auf der ruhigen Fläche.", svg: f1 },
    { t: "1,2 s", caption: "Über die Ränder schauen ein paar kleine Gesichter herein und blicken zu „ME“.", svg: f2 },
    { t: "2,6 s", caption: "Es werden viele, sie rücken heran und nehmen rechts neben dem größer gewordenen „ME“ ihre Plätze ein.", svg: f3 },
    { t: "4,0 s", caption: "Alle stehen: Man liest „MEjority“, und „jority“ besteht aus lauter Gesichtern.", svg: f4 },
    { t: "5,4 s", caption: "Die Gesichter werden zu festen Buchstaben, nur eines bleibt als Punkt auf dem i.", svg: f5 },
  ],
};
