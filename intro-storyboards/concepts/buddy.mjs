/* Concept "buddy": Die Figur wacht auf. The app's companion sleeps on a long sofa, wakes, sits there with its mug – and as the
   picture widens, more and more people sit beside it, each with their own blanket. One becomes many; the wordmark stands on the
   calm wall above them. Self-contained on purpose (no imports): everything is drawn in code as inline SVG.
   One world (units: the head has radius 23, the companion's head centre is 0/0, seat at y = 92, floor at y = 150) is seen
   through five cameras, so all frames show the same sofa. */

const ID = "buddy";
const W = 390, H = 844;
const FONT = "ui-rounded,'SF Pro Rounded','Fredoka','Nunito',system-ui,sans-serif";
const f = v => +(+v).toFixed(2);

/* ---------- palette ---------- */
const P = {
  apricot: "#FFD49B", apricotD: "#F6B467", mint: "#BDE5CC", mintD: "#86C7A2", peri: "#C5CBF7", periD: "#9AA3EA",
  rose: "#EDC8E2", roseD: "#DC9DCA", teal: "#2F6B6A", tealL: "#4D9A96", tealM: "#3F8785", tealD: "#357A78",
  cream: "#FFF2DF", paper: "#FFF8EC", ink: "#17302F",
  wood: "#C99560", woodD: "#9A6A40", woodDD: "#6E4A30", terra: "#D9876A", leaf: "#6FB58F",
  wallA: "#FFDDB0", wallB: "#FFE9CC",
};

/* ---------- tiny drawing helpers ---------- */
const rr = (x, y, w, h, r, fill, ex = "") => `<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="${r}" fill="${fill}"${ex}/>`;
const ci = (x, y, r, fill, ex = "") => `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="${fill}"${ex}/>`;
const el = (x, y, rx, ry, fill, ex = "") => `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(rx)}" ry="${f(ry)}" fill="${fill}"${ex}/>`;
const pa = (d, fill, ex = "") => `<path d="${d}" fill="${fill}"${ex}/>`;
const st = (d, stroke, w, ex = "") => `<path d="${d}" fill="none" stroke="${stroke}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"${ex}/>`;
const g = (tf, inner, ex = "") => `<g transform="${tf}"${ex}>${inner}</g>`;

/* ---------- people: one comic head (radius 23, centre 0/0), a few hair styles and skin tones ---------- */
const SKIN = { a: ["#F8D8BD", "#EFA08E", "#3B2B27"], b: ["#EDBF9C", "#F09C8A", "#3B2B27"], c: ["#E2AB7C", "#DE8468", "#3B2B27"],
  d: ["#BF8253", "#A9573F", "#2E1F1A"], e: ["#8E5B3C", "#7A3B2C", "#24160F"] };
const CAP = {
  tuft:   "M-23.4 4C-25.2 -17 -12.5 -27.5 0 -27.5S25.2 -17 23.4 4C21.6 -3.5 16.6 -8.6 9.6 -10.4 6.4 -6.4 -.6 -4 -7.8 -4.8 -14.4 -5.4 -20.2 -1.8 -23.4 4Z",
  fringe: "M-23.6 3C-25 -17 -12.5 -27.5 0 -27.5S25 -17 23.6 3C19 -7 10 -11 0 -11S-19 -7 -23.6 3Z",
  part:   "M-23.6 4C-25 -17 -12.5 -27.5 0 -27.5S25 -17 23.6 4C21 -8 11 -15 0 -17C-11 -15 -21 -8 -23.6 4Z",
  short:  "M-23 -1C-23.5 -18 -12 -26.5 0 -26.5S23.5 -18 23 -1C17 -10 9 -13 0 -13S-17 -10 -23 -1Z",
};
/* eyes: closed (two arcs) | half (the app's awake half-moons) | open (dots) | blink (one open, one still closed); mouth: smile | yawn */
function head({ skin = "b", hair = "#5B3D33", style = "tuft", eyes = "closed", mouth = "smile", glasses = false, phones = null, messy = false } = {}){
  const [sk, blush, line] = SKIN[skin];
  let back = "", front = "";
  if(style === "tuft") front = pa(CAP.tuft, hair) + st("M-2.5 -26.5c-.6 -4.6 4.2 -6.6 7.4 -4", hair, 3) + (messy ? st("M-9 -25.6c-3.4 -3.4 -1 -7.4 2.6 -6.6M9 -25c3 -1.4 5.4 .4 5 3", hair, 2.6) : "");
  else if(style === "bob"){ back = pa("M-26 0C-28 -20 -14 -30 0 -30S28 -20 26 0L26 15Q26 23 18 23L-18 23Q-26 23 -26 15Z", hair); front = pa(CAP.fringe, hair); }
  else if(style === "long"){ back = pa("M-26.5 0C-28.5 -20 -14 -30 0 -30S28.5 -20 26.5 0L28 30Q28 38 20 38L-20 38Q-28 38 -28 30Z", hair); front = pa(CAP.tuft, hair); }
  else if(style === "bun"){ back = ci(0, -31, 9.5, hair); front = pa(CAP.part, hair); }
  else if(style === "afro"){
    back = ci(0, -8, 25, hair) + [-205, -172, -140, -108, -75, -42, -10, 22].map(a => ci(22 * Math.cos(a * Math.PI / 180), -8 + 22 * Math.sin(a * Math.PI / 180), 11.5, hair)).join("");
    front = pa(CAP.short, hair);
  }
  else front = pa(style === "fringe" ? CAP.fringe : CAP.short, hair);
  const arcL = "M-11.5 4.5q3.5 3.4 7 0", arcR = "M4.5 4.5q3.5 3.4 7 0";
  const eye = eyes === "open" ? ci(-8.3, 4.6, 2.9, line) + ci(8.3, 4.6, 2.9, line)
    : eyes === "half" ? pa("M-12.4 4h8.2a4.1 3.4 0 0 1-8.2 0ZM4.2 4h8.2a4.1 3.4 0 0 1-8.2 0Z", line)
    : eyes === "blink" ? st(arcL, line, 2.1) + ci(8.3, 5, 2.5, line)
    : st(arcL + arcR, line, 2.1);
  return back + ci(-22.5, 3, 4.6, sk) + ci(22.5, 3, 4.6, sk) + ci(0, 0, 23, sk) + front
    + el(-12, 10.5, 4.6, 2.8, blush, ' opacity=".5"') + el(12, 10.5, 4.6, 2.8, blush, ' opacity=".5"') + eye
    + (mouth === "yawn" ? el(0, 14, 3.1, 3.7, line) : st("M-3.4 12.6q3.4 2.8 6.8 0", line, 1.9))
    + (glasses ? `<g fill="none" stroke="${line}" stroke-width="1.5" opacity=".85"><circle cx="-8.3" cy="5" r="6.2"/><circle cx="8.3" cy="5" r="6.2"/><path d="M-2.1 5h4.2"/></g>` : "")
    + (phones ? st("M-24 2C-26 -30 26 -30 24 2", phones, 4) + rr(-28.5, -4, 8, 14, 4, phones) + rr(20.5, -4, 8, 14, 4, phones) : "");
}
const steam = (x, y) => st(`M${x - 4} ${y}c-3 -3.6 3 -6.4 0 -10.5M${x + 4} ${y - 1}c-3 -3.6 3 -6.4 0 -10.5`, "#fff", 2.4, ' opacity=".9"');

/* someone sitting on the sofa, seen from the front; origin = head centre, seat at y = 92, floor at y = 150.
   pose: "mug" (both hands round a mug at mugX) | "rest" (hands under the blanket) | "stretch" (one arm up, the blanket slipping) */
function sitter(o){
  const sk = SKIN[o.skin || "b"][0], tilt = o.tilt || 0, mx = o.mugX ?? 26, pose = o.pose || "mug";
  let s = "";
  if(pose === "stretch") s += st("M-30 50C-50 46 -64 32 -74 14", o.sweater, 19) + `<path d="M-68.6 23.6L-76.6 9.4" fill="none" stroke="${o.cuff}" stroke-width="20.5"/>` + ci(-80.6, 2.6, 8.8, sk);
  s += pa("M-46 104C-48 55 -29 26 0 26S48 55 46 104Z", o.sweater);
  if(o.wrap) s += pa("M-51 104C-56 58 -42 26 -15 19C-5 36 -9 72 -17 104Z", o.blanket) + pa("M51 104C56 58 42 26 15 19C5 36 9 72 17 104Z", o.blanket)
    + st("M-13 24C-6 40 -9 72 -16 100M13 24C6 40 9 72 16 100", o.hem, 2.6);
  s += rr(-14, 18, 28, 13, 6.5, o.cuff) + g(`rotate(${tilt} 0 20)`, head(o));
  if(pose === "mug") s += el(mx - 15, 62, 10.5, 8.5, o.cuff) + el(mx + 15, 62, 10.5, 8.5, o.cuff) + rr(mx - 11, 40, 22, 25, 7, o.mug) + rr(mx - 11, 47, 22, 4, 0, "#fff", ' opacity=".35"')
    + el(mx - 10.5, 53, 5.6, 7, sk) + el(mx + 10.5, 53, 5.6, 7, sk) + (o.steam === false || Math.abs(mx) < 18 ? "" : steam(mx, 36));
  /* socks, then the blanket over the lap and knees */
  s += rr(-23, 141, 17, 9.5, 4.7, o.sock || o.cuff) + rr(6, 141, 17, 9.5, 4.7, o.sock || o.cuff);
  const slip = pose === "stretch";
  s += pa(slip ? "M-52 137C-57 108 -50 86 -28 84L20 80C46 80 56 104 53 133Q53 142 46 142L-46 142Q-52 142 -52 137Z"
               : "M-52 137C-56 104 -48 78 -24 77L24 77C48 78 56 104 52 137Q52 142 46 142L-46 142Q-52 142 -52 137Z", o.blanket);
  s += o.dots ? [[-30, 96], [-6, 112], [22, 94], [34, 122], [-34, 126], [4, 132]].map(([x, y]) => ci(x, y, 3, o.hem)).join("") + st("M-45 138.6h90", o.hem, 3.4)
              : st("M-49.6 108h99.2M-51 122h102", o.hem, 3.6) + st("M-45 138.6h90", o.hem, 3.4);

  if(pose === "stretch") s += el(27, 80, 11, 8.5, o.cuff) + el(15.5, 82.5, 6.4, 5.4, sk);
  return s;
}
/* the companion asleep: head on a cushion, blanket up to the chin, the body runs off to the right */
function sleeper(o){
  return `<rect x="-72" y="42" width="66" height="48" rx="22" transform="rotate(-12 -39 66)" fill="${P.rose}"/>`
    + st("M-62 78C-50 86 -30 86 -16 80", P.roseD, 2.4, ' opacity=".6"')
    + g(`translate(-24 59) rotate(-16)`, head({ ...o, eyes: "closed" }))
    + pa("M-12 104C-13 73 1 58 22 56C52 52 84 66 124 62C160 59 200 62 260 62L260 124C222 131 196 118 164 124C132 130 112 118 82 124C52 130 32 119 9 126C-6 129 -12 118 -12 104Z", o.blanket)
    + st("M-8.4 104C-9.4 77 3.4 62 23 59.8C52 55.6 84 69.4 124 65.4C160 62.4 200 65.4 260 65.4", o.hem, 6.6)
    + [[44, 84], [76, 100], [106, 82], [136, 104], [28, 108], [166, 86], [196, 106], [58, 114], [112, 116]].map(([x, y]) => ci(x, y, 3.2, o.hem)).join("");
}

/* ---------- the cast ---------- */
const BUDDY = { skin: "b", hair: "#5B3D33", style: "tuft", sweater: "#F7EAD3", cuff: "#EAD6B6", blanket: "#FFC47F", hem: "#FFE6BE", mug: P.terra, dots: true, sock: P.periD };
const CREW = {                                                  // by seat: 0 is the companion, negative = to its left
  "-4": { skin: "c", hair: "#3A2925", style: "fringe", sweater: P.peri, cuff: P.periD, blanket: P.rose, hem: P.roseD, mug: P.paper, mugX: -22 },
  "-3": { skin: "a", hair: "#DDAE58", style: "bob", sweater: P.paper, cuff: "#EAD6B6", blanket: P.mint, hem: P.mintD, pose: "rest", tilt: 9 },
  "-2": { skin: "d", hair: "#DAD3C8", style: "short", glasses: true, sweater: "#FFC47F", cuff: P.apricotD, blanket: P.paper, hem: P.rose, mug: P.tealM, mugX: -24 },
  "-1": { skin: "e", hair: "#2A1E1B", style: "afro", sweater: P.mint, cuff: P.mintD, blanket: P.peri, hem: P.periD, mug: P.paper, mugX: 0, eyes: "half" },
  "1":  { skin: "a", hair: "#C56A3C", style: "long", sweater: P.roseD, cuff: "#C67DB1", blanket: P.mint, hem: P.mintD, pose: "rest", tilt: -7 },
  "2":  { skin: "c", hair: "#2A1F1C", style: "bun", sweater: P.periD, cuff: "#7F89DA", blanket: P.rose, hem: P.roseD, wrap: true, mug: P.paper, mugX: 0, eyes: "half" },
  "3":  { skin: "e", hair: "#2A1E1B", style: "short", phones: "#F6B467", sweater: P.paper, cuff: "#EAD6B6", blanket: "#FFC47F", hem: "#FFE6BE", pose: "rest", dots: true },
  "4":  { skin: "b", hair: "#B9B2A8", style: "bun", sweater: P.mint, cuff: P.mintD, blanket: P.peri, hem: P.periD, mug: P.terra, mugX: 22 },
};
const FLOOR = [                                                 // later, on the rugs in front of the sofa
  [-2.5, { skin: "b", hair: "#3A2925", style: "fringe", sweater: "#FFC47F", cuff: P.apricotD, blanket: P.paper, hem: P.apricotD, mug: P.periD, mugX: 0 }],
  [-1.5, { skin: "d", hair: "#2A1E1B", style: "bob", sweater: P.paper, cuff: "#EAD6B6", blanket: P.rose, hem: P.roseD, wrap: true, pose: "rest", tilt: -8 }],
  [1.5,  { skin: "a", hair: "#B9B2A8", style: "short", glasses: true, sweater: P.peri, cuff: P.periD, blanket: P.mint, hem: P.mintD, mug: P.terra, mugX: 0 }],
];
const SEAT = 88;                                                // seat width

/* ---------- the room (world coordinates) ---------- */
/* window light on the wall: a slanted bright patch with the shadow of the glazing bars; no window, no sky in the picture */
function patch(x, top, bot, w, col, op, wallCol){
  const sk = (bot - top) * .1, P4 = (a, b) => `${f(x + a + (b - top) * .1)} ${f(b)}`;
  const quad = (a0, a1, b0, b1, fill, ex = "") => pa(`M${P4(a0, b0)}L${P4(a1, b0)}L${P4(a1, b1)}L${P4(a0, b1)}Z`, fill, ex);
  const h = bot - top;
  return quad(0, w, top, bot, col, ` opacity="${op}"`) + quad(w / 2 - 2.5, w / 2 + 2.5, top, bot, wallCol) + quad(0, w, top + h * .34 - 2.5, top + h * .34 + 2.5, wallCol) + quad(0, w, top + h * .68 - 2.5, top + h * .68 + 2.5, wallCol);
}
const picture = (x, y, w, h, bg, inner = "") => rr(x, y, w, h, 3, P.woodD) + rr(x + 3, y + 3, w - 6, h - 6, 1.5, bg) + inner;
const sprig = (x, y, col, k = 1) => g(`translate(${x} ${y}) scale(${k})`, st("M0 0v-13", col, 1.4) + [[-3, -4, -40], [3, -7, 40], [-3, -10, -40], [3, -13, 40]].map(([dx, dy, a]) =>
  `<ellipse cx="${dx}" cy="${dy}" rx="1.8" ry="3.4" transform="rotate(${a} ${dx} ${dy})" fill="${col}"/>`).join(""));
function plant(x, y, s, pot, kind = 0){                        // origin = bottom centre of the pot
  const leaves = kind === 0
    ? [[-9, -30, -28], [9, -31, 26], [0, -40, 0], [-13, -19, -62], [13, -20, 60]].map(([lx, ly, a]) => `<ellipse cx="${lx}" cy="${ly}" rx="5.4" ry="12" transform="rotate(${a} ${lx} ${ly})" fill="${P.leaf}"/>`).join("")
    : st("M-3 -12C-10 -4 -16 6 -14 20M0 -12C0 -2 5 6 3 28M3 -12C10 -6 16 0 17 12", P.leaf, 3.4) + ci(-14, 21, 4.6, P.leaf) + ci(3, 29, 5, P.leaf) + ci(17, 13, 4.4, P.leaf);
  return g(`translate(${f(x)} ${f(y)}) scale(${s})`, leaves + pa("M-8 -16H8L6.4 -1.5Q6 0 4.5 0H-4.5Q-6 0 -6.4 -1.5Z", pot));
}
const books = (x, y, list) => { let o = "", cx = x; for(const [w, h, c] of list){ o += rr(cx, y - h, w, h, 1, c); cx += w + 1; } return o; };
function decor(light, wallCol){
  const [col, op] = light;
  let s = [-250, -80, 190].map(x => patch(x, -330, -78, 70, col, op, wallCol)).join("");
  /* a shelf beside the companion, pictures further up and further out */
  s += rr(30, -100, 58, 4.4, 2.2, P.woodD) + plant(43, -100, .62, P.terra, 1) + books(56, -100, [[5, 19, P.periD], [5.6, 23, P.roseD], [5, 17, P.mintD], [5.4, 21, P.apricotD]]);
  s += picture(36, -262, 34, 44, P.paper, sprig(53, -229, P.mintD, 2)) + picture(76, -240, 22, 22, P.peri);
  s += picture(284, -222, 30, 38, P.rose, sprig(299, -194, P.roseD, 1.8)) + rr(266, -108, 56, 4.4, 2.2, P.woodD) + books(272, -108, [[5, 20, P.mintD], [5.6, 16, P.paper], [5, 22, P.apricotD]]) + plant(308, -108, .56, P.periD);
  s += picture(-318, -214, 30, 38, P.mint, sprig(-303, -186, P.tealM, 1.8)) + rr(-330, -106, 50, 4.4, 2.2, P.woodD) + books(-324, -106, [[5, 18, P.apricotD], [5.6, 22, P.periD], [5, 16, P.terra]]);
  /* behind the sofa: a floor lamp (off, it is morning) and a tall plant */
  s += rr(-133.5, -266, 3, 230, 1.5, P.woodDD) + pa("M-154 -264L-110 -264L-117 -300L-147 -300Z", P.paper, ` stroke="${P.paper}" stroke-width="4" stroke-linejoin="round"`) + rr(-155, -266, 46, 4, 2, "#EAD6B6");
  s += st("M142 -40C140 -90 132 -122 118 -150M142 -40C144 -100 148 -150 142 -196M142 -40C148 -80 162 -110 174 -128M142 -40C138 -66 128 -84 118 -96", P.leaf, 3.4)
    + [[115, -157, -30, 12, 23], [142, -205, 0, 12.5, 25], [178, -134, 44, 11.5, 21], [114, -101, -52, 9.5, 17], [160, -168, 22, 9.5, 17]].map(([x, y, a, rx, ry]) =>
      `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" transform="rotate(${a} ${x} ${y})" fill="${P.leaf}"/>`).join("");
  return s;
}
function sofa(k0, k1){                                          // seats k0..k1 (the frame cuts it off: it has no ends)
  const x0 = (k0 - .5) * SEAT - 20, w = (k1 - k0 + 1) * SEAT + 40;
  let s = rr(x0, -48, w, 190, 0, P.tealD), feet = "";
  for(let k = k0; k <= k1; k++){
    s += rr(k * SEAT - 41, -40, 82, 136, 24, P.tealM) + rr(k * SEAT - 42.5, 92, 85, 38, 10, P.tealL) + rr(k * SEAT - 36, 95, 72, 3, 1.5, "#fff", ' opacity=".12"');
    if(k % 2 === 0) feet += rr(k * SEAT - 50, 140, 12, 10, 2, P.woodDD);
  }
  return s + rr(x0, 128, w, 14, 0, P.teal) + feet;
}
const rug = (x, w, y, a, b) => rr(x, y, w, 44, 22, a) + rr(x + 12, y + 6, w - 24, 32, 16, b);
function cat(x, y, s, col){                                    // curled up, asleep; origin = bottom centre
  return g(`translate(${f(x)} ${f(y)}) scale(${s})`, st("M9 -4C16 -3 16 -12 9 -11", col, 2.6) + el(0, -6, 11, 6.4, col) + ci(-8.5, -7.5, 5.2, col)
    + pa("M-13.6 -9.5L-13 -15.2L-9.2 -11.6Z", col) + pa("M-8 -12L-5.2 -16L-3.8 -10.6Z", col) + st("M-11.4 -7.2q1.1 1 2.2 0M-7.6 -7.2q1.1 1 2.2 0", "#fff", .7, ' opacity=".7"'));
}
function floorBits(){
  const slip = (x, y, c, c2) => el(x, y, 11, 5.6, c) + el(x + 24, y + 2, 11, 5.6, c) + el(x, y - 1, 6, 2.6, c2) + el(x + 24, y + 1, 6, 2.6, c2);
  return rug(-118, 236, 160, P.peri, "#D6DAFA") + slip(48, 171, P.roseD, "#C67DB1")
    + rug(-300, 204, 196, P.mint, "#D3EEDD") + rug(104, 204, 196, P.rose, "#F5DCEC") + rug(-560, 236, 160, P.rose, "#F5DCEC") + rug(300, 236, 160, P.mint, "#D3EEDD")
    + slip(-206, 176, P.apricotD, "#E99B45") + slip(212, 180, P.mintD, "#6FB58F")
    + cat(250, 240, 1.5, "#E8A566");
}

/* ---------- one still: camera (scale s, world point cx/cy sits at screen 195/sy), who sits where, and the light ---------- */
const svg = (label, inner) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${label}">${inner}</svg>`;
function still(n, label, { s, cx = 0, sy, seats, figures, light, dusk = 0, wall = [P.wallA, P.wallB], over = "", wide = false, after = "" }){
  const fid = `${ID}-${n}`, tx = 195 - cx * s, floorY = sy + 150 * s, mid = wall[1];
  let o = `<defs><linearGradient id="${fid}-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${wall[0]}"/><stop offset="1" stop-color="${wall[1]}"/></linearGradient>`
    + `<linearGradient id="${fid}-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C99560"/><stop offset="1" stop-color="#D9A772"/></linearGradient></defs>`;
  o += `<rect width="${W}" height="${H}" fill="url(#${fid}-wall)"/>`;
  o += rr(0, floorY - 7 * s, W, 7 * s, 0, "#F3C992") + rr(0, floorY, W, H - floorY, 0, `url(#${fid}-floor)`) + rr(0, floorY, W, 3, 0, "#000", ' opacity=".08"');
  o += g(`translate(${f(tx)} ${f(sy)}) scale(${s})`, decor(light, mid) + floorBits() + sofa(seats[0], seats[1]) + figures);
  if(dusk) o += `<rect width="${W}" height="${H}" fill="${DUSK}" opacity="${dusk}"/>`;
  if(over) o += g(`translate(${f(tx)} ${f(sy)}) scale(${s})`, over);
  return svg(label, o + after);
}
const DUSK = "#7A3A6A";                                        // early light: a soft rosé veil over the room, fading from frame 1 to 3
const seat = (k, o, dy = 0) => g(`translate(${k * SEAT} ${dy})`, sitter(o));
const zz = st("M22 22h9l-9 10.5h9", P.cream, 3) + st("M40 2h6.6l-6.6 7.8h6.6", P.cream, 2.4, ' opacity=".85"') + st("M53 -14h4.8l-4.8 5.6h4.8", P.cream, 1.9, ' opacity=".65"');

const frames = [
  { t: "0,3 s", caption: "Nah und still: Die Figur schläft unter ihrer Decke auf dem Sofa, das Zimmer liegt im Morgendämmer. Nur der Atem hebt die Decke.",
    svg: still(1, "Die Begleitfigur schläft unter ihrer Decke auf dem Sofa", { s: 3.2, cx: 5, sy: 240, seats: [-1, 2], figures: sleeper(BUDDY),
      light: ["#F1E4EE", .4], dusk: .34, over: zz }) },
  { t: "1,5 s", caption: "Sie blinzelt, gähnt und streckt sich langsam; die Decke rutscht ein Stück. Der Blick zieht dabei sacht zurück, es wird heller.",
    svg: still(2, "Die Figur blinzelt und streckt sich", { s: 2.3, cx: -6, sy: 412, seats: [-1, 1],
      figures: sitter({ ...BUDDY, pose: "stretch", eyes: "blink", mouth: "yawn", messy: true, tilt: 7 }), light: ["#FBF1EA", .6], dusk: .13 }) },
  { t: "2,8 s", caption: "Jetzt sitzt sie mit ihrer Tasse da, der Dampf steigt. Warmes Fensterlicht fällt auf die Wand, das Zimmer ist hell.",
    svg: still(3, "Die Figur sitzt wach mit ihrer Tasse auf dem Sofa", { s: 2.05, cx: 4, sy: 372, seats: [-1, 1], figures: sitter({ ...BUDDY, eyes: "half" }), light: ["#FFF8E6", .78] }) },
  { t: "4,2 s", caption: "Das Bild wird breiter, das Sofa länger: Links und rechts sitzen weitere Menschen, jede:r mit eigener Decke oder Tasse. Ein kleines Nicken.",
    svg: still(4, "Neben der Figur sitzen weitere Menschen mit Decken und Tassen", { s: 1.3, cx: 0, sy: 500, seats: [-2, 2],
      figures: [-2, -1, 1, 2].map(k => seat(k, CREW[k])).join("") + seat(0, { ...BUDDY, eyes: "half" }), light: ["#FFF8E6", .78] }) },
  { t: "5,6 s", caption: "Noch weiter zurück: Das Sofa reicht über beide Bildränder hinaus, viele sitzen ruhig nebeneinander, einige davor auf den Teppichen. Auf der Wand darüber blendet die Wortmarke ein.",
    svg: still(5, "Viele Menschen nebeneinander auf dem langen Sofa, darüber die Wortmarke MEjority", { s: .62, cx: 0, sy: 600, seats: [-5, 5],
      figures: [-4, -3, -2, -1, 1, 2, 3, 4].map(k => seat(k, CREW[k])).join("") + seat(0, { ...BUDDY, eyes: "half" }) + FLOOR.map(([k, o]) => seat(k, o, 88)).join(""), light: ["#FFF8E6", .78],
      after: `<text x="195" y="296" text-anchor="middle" font-family="${FONT}" font-size="64" fill="${P.teal}"><tspan font-weight="700">ME</tspan><tspan font-weight="500">jority</tspan></text>` }) },
];

export default {
  id: ID,
  order: 6,
  title: "Die Figur wacht auf",
  idea: "Die Begleitfigur der App schläft, wacht auf und sitzt mit ihrer Tasse da – und während das Bild breiter wird, sitzen immer mehr Menschen neben ihr auf demselben langen Sofa: aus einem werden viele.",
  duration: "ca. 6,5 s",
  frames,
};
