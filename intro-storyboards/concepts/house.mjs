/* Concept "house": Viele Zimmer, ein Haus. A cosy house in cross-section (doll's house / cozy game). We start close in
   ONE room, pull back to the neighbours, the whole house, many houses; at the end only the lit windows stay as a calm
   pattern around the wordmark. Self-contained on purpose (no imports): everything is drawn in code as inline SVG.
   One house model (rooms in local 160×180 units) is drawn through three cameras, so frames 1–3 show the same rooms. */

const ID = "house";
const W = 390, H = 844;
const FONT = "ui-rounded,'SF Pro Rounded','Fredoka','Nunito',system-ui,sans-serif";
const f = v => +(+v).toFixed(2);
function rng(seed){
  return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}

/* ---------- palette ---------- */
const P = {
  apricot: "#FFD49B", apricotD: "#F6B467", mint: "#BDE5CC", mintD: "#86C7A2", peri: "#C5CBF7", periD: "#9AA3EA",
  rose: "#EDC8E2", roseD: "#DC9DCA", teal: "#2F6B6A", tealL: "#4D9A96", tealM: "#3F8785",
  cream: "#FFF2DF", paper: "#FFF8EC", ink: "#17302F",
  night: "#153A3B", night2: "#1B4647", glass: "#1D4A4B",
  wood: "#C48E5C", woodD: "#9A6A40", woodDD: "#6E4A30", terra: "#D9876A", lampOn: "#FFF3CF", lampOff: "#D9CDB8", shadeOn: "#FFDF9E",
};

/* ---------- tiny drawing helpers ---------- */
const rr = (x, y, w, h, r, fill, ex = "") => `<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="${r}" fill="${fill}"${ex}/>`;
const ci = (x, y, r, fill, ex = "") => `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="${fill}"${ex}/>`;
const el = (x, y, rx, ry, fill, ex = "") => `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(rx)}" ry="${f(ry)}" fill="${fill}"${ex}/>`;
const pa = (d, fill, ex = "") => `<path d="${d}" fill="${fill}"${ex}/>`;
const st = (d, stroke, w, ex = "") => `<path d="${d}" fill="none" stroke="${stroke}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"${ex}/>`;
const g = (tf, inner, ex = "") => `<g transform="${tf}"${ex}>${inner}</g>`;
const radial = (id, cx, cy, r, stops) => `<radialGradient id="${id}" gradientUnits="userSpaceOnUse" cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}">`
  + stops.map(([o, c, a]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`).join("") + `</radialGradient>`;

/* ---------- people: one comic head (radius 23, centre 0/0), a few hair styles and skin tones ---------- */
const SKIN = { a: ["#F8D8BD", "#EFA08E", "#3B2B27"], b: ["#EDBF9C", "#F09C8A", "#3B2B27"], c: ["#E2AB7C", "#DE8468", "#3B2B27"],
  d: ["#BF8253", "#A9573F", "#2E1F1A"], e: ["#8E5B3C", "#7A3B2C", "#24160F"] };
const CAP = {
  tuft:   "M-23.4 4C-25.2 -17 -12.5 -27.5 0 -27.5S25.2 -17 23.4 4C21.6 -3.5 16.6 -8.6 9.6 -10.4 6.4 -6.4 -.6 -4 -7.8 -4.8 -14.4 -5.4 -20.2 -1.8 -23.4 4Z",
  fringe: "M-23.6 3C-25 -17 -12.5 -27.5 0 -27.5S25 -17 23.6 3C19 -7 10 -11 0 -11S-19 -7 -23.6 3Z",
  part:   "M-23.6 4C-25 -17 -12.5 -27.5 0 -27.5S25 -17 23.6 4C21 -8 11 -15 0 -17C-11 -15 -21 -8 -23.6 4Z",
  short:  "M-23 -1C-23.5 -18 -12 -26.5 0 -26.5S23.5 -18 23 -1C17 -10 9 -13 0 -13S-17 -10 -23 -1Z",
};
function head({ skin = "b", hair = "#5B3D33", style = "tuft", eyes = "closed", glasses = false, phones = null } = {}){
  const [sk, blush, line] = SKIN[skin];
  let back = "", front = "", ears = ci(-22.5, 3, 4.6, sk) + ci(22.5, 3, 4.6, sk);
  if(style === "tuft") front = pa(CAP.tuft, hair) + st("M-2.5 -26.5c-.6 -4.6 4.2 -6.6 7.4 -4", hair, 3);
  else if(style === "bob"){ back = pa("M-26 0C-28 -20 -14 -30 0 -30S28 -20 26 0L26 15Q26 23 18 23L-18 23Q-26 23 -26 15Z", hair); front = pa(CAP.fringe, hair); }
  else if(style === "long"){ back = pa("M-26.5 0C-28.5 -20 -14 -30 0 -30S28.5 -20 26.5 0L29 36Q29 44 21 44L-21 44Q-29 44 -29 36Z", hair); front = pa(CAP.tuft, hair); }
  else if(style === "bun"){ back = ci(0, -31, 9.5, hair); front = pa(CAP.part, hair); }
  else if(style === "afro"){
    back = ci(0, -8, 25, hair) + [-205, -172, -140, -108, -75, -42, -10, 22].map(a => ci(22 * Math.cos(a * Math.PI / 180), -8 + 22 * Math.sin(a * Math.PI / 180), 11.5, hair)).join("");
    front = pa(CAP.short, hair);
  }
  else front = pa(style === "fringe" ? CAP.fringe : CAP.short, hair);
  const eye = eyes === "open" ? ci(-8.3, 4.6, 2.9, line) + ci(8.3, 4.6, 2.9, line)
    : eyes === "half" ? pa("M-12.4 4h8.2a4.1 3.4 0 0 1-8.2 0ZM4.2 4h8.2a4.1 3.4 0 0 1-8.2 0Z", line)
    : st("M-11.5 4.5q3.5 3.4 7 0M4.5 4.5q3.5 3.4 7 0", line, 2.1);
  return back + ears + ci(0, 0, 23, sk) + front
    + el(-12, 10.5, 4.6, 2.8, blush, ' opacity=".5"') + el(12, 10.5, 4.6, 2.8, blush, ' opacity=".5"')
    + eye + st("M-3.4 12.6q3.4 2.8 6.8 0", line, 1.9)
    + (glasses ? `<g fill="none" stroke="${line}" stroke-width="1.5" opacity=".85"><circle cx="-8.3" cy="5" r="6.2"/><circle cx="8.3" cy="5" r="6.2"/><path d="M-2.1 5h4.2"/></g>` : "")
    + (phones ? st("M-24 2C-26 -30 26 -30 24 2", phones, 4) + rr(-28.5, -4, 8, 14, 4, phones) + rr(20.5, -4, 8, 14, 4, phones) : "");
}
const HS = .46;                                                  // head scale inside a room (head radius ≈ 10.6 room units)
const headAt = (x, y, o, rot = 0, s = HS) => g(`translate(${f(x)} ${f(y)}) rotate(${rot}) scale(${s})`, head(o));
/* sitting, seen from the front, both hands round a mug; origin = head centre, drawn in head units */
function sitter(x, y, o, { sweater, cuff, mug = P.terra, s = HS, noMug = false } = {}){
  const sk = SKIN[o.skin || "b"][0];
  return g(`translate(${f(x)} ${f(y)}) scale(${s})`,
    pa("M-41 80C-43 47 -27 27 0 27S43 47 41 80Z", sweater) + rr(-13, 19, 26, 11, 5.5, cuff) + head(o)
    + (noMug ? "" : el(-12, 63, 11, 8.5, cuff) + el(12, 63, 11, 8.5, cuff) + rr(-11, 43, 22, 24, 7, mug) + rr(-11, 50, 22, 4, 0, "#fff", ' opacity=".35"')
      + el(-11, 56, 5.6, 7, sk) + el(11, 56, 5.6, 7, sk)));
}

/* ---------- furniture bits ---------- */
/* a window in the back wall: night outside, and far away one or two other lit windows */
function win(x, y, w, h, { arch = false, far = [[.68, .62, 1], [.2, .78, .6]], frame = P.paper } = {}){
  const r = w / 2;
  const shape = (ox, oy, ww, hh, fill) => arch
    ? pa(`M${f(ox)} ${f(oy + hh)}V${f(oy + ww / 2)}a${f(ww / 2)} ${f(ww / 2)} 0 0 1 ${f(ww)} 0V${f(oy + hh)}Z`, fill)
    : rr(ox, oy, ww, hh, 3, fill);
  return shape(x - 3.5, y - 3.5, w + 7, h + 7, frame) + shape(x, y, w, h, P.glass)
    + far.map(([u, v, o]) => rr(x + u * w, y + v * h, 4.6, 5.6, 1.2, P.apricot, ` opacity="${o}"`)).join("")
    + rr(x + w / 2 - 1.2, y + (arch ? 2 : 0), 2.4, h - (arch ? 2 : 0), 0, frame) + rr(x, y + (arch ? r : h * .45), w, 2.4, 0, frame)
    + rr(x - 6.5, y + h + 2, w + 13, 4.4, 2.2, frame);
}
function plant(x, y, s, pot, leaf, kind = 0){               // origin = bottom centre of the pot
  const leaves = kind === 0
    ? [[-9, -30, -28], [9, -31, 26], [0, -40, 0], [-13, -19, -62], [13, -20, 60]].map(([lx, ly, a]) => `<ellipse cx="${lx}" cy="${ly}" rx="5.4" ry="12" transform="rotate(${a} ${lx} ${ly})" fill="${leaf}"/>`).join("")
    : st("M0 -14C-2 -30 -10 -38 -14 -52M0 -14C1 -32 8 -44 6 -62M0 -14C4 -26 14 -32 18 -42", leaf, 3.6) + ci(-14, -53, 5, leaf) + ci(6, -63, 5.4, leaf) + ci(18, -43, 4.6, leaf);
  return g(`translate(${f(x)} ${f(y)}) scale(${s})`, leaves + pa("M-8 -16H8L6.4 -1.5Q6 0 4.5 0H-4.5Q-6 0 -6.4 -1.5Z", pot));
}
function cat(x, y, s, col){                                    // curled up, asleep; origin = bottom centre
  return g(`translate(${f(x)} ${f(y)}) scale(${s})`, st("M9 -4C16 -3 16 -12 9 -11", col, 2.6) + el(0, -6, 11, 6.4, col) + ci(-8.5, -7.5, 5.2, col)
    + pa("M-13.6 -9.5L-13 -15.2L-9.2 -11.6Z", col) + pa("M-8 -12L-5.2 -16L-3.8 -10.6Z", col) + st("M-11.4 -7.2q1.1 1 2.2 0M-7.6 -7.2q1.1 1 2.2 0", "#fff", .7, ' opacity=".7"'));
}
const shade = (x, y, w, h, top, lit) => pa(`M${f(x - w / 2)} ${f(y)}L${f(x + w / 2)} ${f(y)}L${f(x + top / 2)} ${f(y - h)}L${f(x - top / 2)} ${f(y - h)}Z`, lit ? P.shadeOn : P.lampOff,
  ` stroke="${lit ? P.shadeOn : P.lampOff}" stroke-width="2.4" stroke-linejoin="round"`) + (lit ? rr(x - w / 2 - .6, y - 1.2, w + 1.2, 2.4, 1.2, P.lampOn) : "");
const dome = (x, y, w, h, col) => pa(`M${f(x - w / 2)} ${f(y)}C${f(x - w / 2)} ${f(y - h * .7)} ${f(x - w * .25)} ${f(y - h)} ${f(x)} ${f(y - h)}S${f(x + w / 2)} ${f(y - h * .7)} ${f(x + w / 2)} ${f(y)}Z`, col);
const books = (x, y, list) => { let o = "", cx = x; for(const [w, h, c] of list){ o += rr(cx, y - h, w, h, .8, c); cx += w + .7; } return o; };
const picture = (x, y, w, h, bg, inner = "", frame = P.woodD) => rr(x, y, w, h, 2, frame) + rr(x + 2, y + 2, w - 4, h - 4, 1, bg) + inner;
const sprig = (x, y, col) => st(`M${x} ${y}v-13`, col, 1.3) + [[-3, -4, -40], [3, -7, 40], [-3, -10, -40], [3, -13, 40]].map(([dx, dy, a]) =>
  `<ellipse cx="${x + dx}" cy="${y + dy}" rx="1.7" ry="3.2" transform="rotate(${a} ${x + dx} ${y + dy})" fill="${col}"/>`).join("");
const steam = (x, y, s = 1, col = "#fff") => g(`translate(${f(x)} ${f(y)}) scale(${s})`, st("M-2.4 0c-2.4 -2.8 2.4 -5 0 -8.2M2.8 -.6c-2.4 -2.8 2.4 -5 0 -8.2", col, 1.5, ' opacity=".8"'));
function shell(wall, base, floor){
  return rr(0, 0, 160, 180, 0, wall) + rr(0, 164.6, 160, 3.4, 0, base) + rr(0, 168, 160, 12, 0, floor) + rr(0, 168, 160, 1.6, 0, "#000", ' opacity=".1"')
    + st("M22 174h30M74 171.6h40M120 175h26", "#000", .8, ' opacity=".1"');
}

/* ---------- the seven rooms: each returns {base, lamp(lit), glow:[x,y,r]} in local units (160×180, floor at 168) ---------- */
const ROOMS = {
  /* the first room: someone rests on the sofa under a blanket, the floor lamp beside them */
  sofa(){
    let b = shell("#FFE8C4", "#F3CD9B", P.wood);
    b += rr(26, 20.6, 58, 2.2, 1.1, P.woodD) + win(36, 28, 38, 46, { far: [[.66, .6, 1], [.16, .76, .55]] })
      + rr(27, 21.5, 9, 60, 4, P.roseD) + rr(74, 21.5, 9, 60, 4, P.roseD);
    b += picture(92, 30, 20, 26, P.paper, sprig(102, 51, P.mintD)) + ci(121, 44, 8, P.woodD) + ci(121, 44, 6, P.peri) + ci(121, 44, 2.4, P.paper);
    b += rr(3, 138, 17, 30, 2, P.woodD) + rr(5, 141, 13, 11, 1, P.wood) + rr(5, 154, 13, 11, 1, P.wood) + ci(11.5, 146.5, 1.1, P.woodDD) + ci(11.5, 159.5, 1.1, P.woodDD)
      + books(5, 138, [[3, 9, P.periD], [2.6, 11, P.terra], [3, 8, P.mintD]]) + plant(15, 138, .34, P.terra, P.mintD, 1);
    b += plant(147, 168, .92, P.terra, "#6FB58F") + rr(36, 166.4, 62, 3.4, 1.7, "#B4BCF4");
    /* sofa */
    b += rr(30, 102, 72, 52, 14, P.tealM) + rr(38, 139, 56, 19, 6, P.tealL) + rr(27, 156, 78, 8, 3, P.teal) + rr(30, 163, 5, 5, 1, P.woodDD) + rr(97, 163, 5, 5, 1, P.woodDD)
      + rr(24, 122, 16, 42, 8, "#357A78") + rr(92, 122, 16, 42, 8, "#357A78");
    b += cat(84, 102.6, .62, "#4A3A36");
    /* the person: head on a cushion, blanket up to the chin, feet over the far arm */
    b += `<ellipse cx="47" cy="128" rx="13.5" ry="9" transform="rotate(-24 47 128)" fill="${P.rose}"/>` + headAt(51.5, 120.5, { skin: "c", hair: "#3A2925", style: "tuft" }, -10);
    b += pa("M55 142C54 132 60 126.5 68 127.5C76 128.5 84 125 90 121.5C95 117.5 104 118 106 124.5C107 130 104.5 133 101 134.5C98.5 141 97 147 92 148.4C80 150.4 66 149.6 57 147.6Z", "#FFC47F")
      + st("M57.6 141C57 134 61 130 67.6 130.2", "#FFE2B6", 2.4) + ci(74, 138, 1.5, P.paper) + ci(85, 133, 1.5, P.paper) + ci(95, 126, 1.5, P.paper) + ci(66, 143, 1.5, P.paper) + ci(88, 143, 1.5, P.paper);
    b += rr(56, 165, 7.5, 3.6, 1.8, P.roseD) + rr(65.5, 165, 7.5, 3.6, 1.8, P.roseD);
    b += rr(132.5, 160, 9, 8, 2, P.periD) + rr(131.4, 162.4, 2.2, 3.6, 1, P.periD);
    const lamp = lit => rr(113, 164.6, 16, 3.4, 1.7, P.woodDD) + rr(120, 86, 2, 79, 1, P.woodDD) + shade(121, 88, 22, 22, 13, lit);
    return { base: b, lamp, glow: [121, 90, 100] };
  },
  /* above: armchair, tea, a pendant lamp, books */
  tea(){
    let b = shell("#DDF1E3", "#C3E3CF", "#B98A5E");
    b += st("M19 0V25", P.woodDD, 1) + rr(13, 25, 12, 8.5, 3, P.terra) + st("M15 33c-3 6 -1 12 -4 18M19 33c0 8 2 12 0 20M23 33c3 5 1 10 4 15", "#6FB58F", 2.4) + ci(11, 51, 2.6, "#6FB58F") + ci(19, 53, 2.6, "#6FB58F") + ci(27, 48, 2.6, "#6FB58F");
    b += picture(40, 34, 18, 22, P.paper, sprig(49, 52, P.roseD)) + picture(63, 40, 13, 13, P.peri) + picture(63, 57, 13, 10, P.rose);
    b += rr(128, 60, 27, 108, 2.5, P.woodD) + rr(130.5, 62.5, 22, 103, 1, P.woodDD) + [86, 111, 137, 162].map(y => rr(130.5, y, 22, 2.4, 0, P.woodD)).join("")
      + books(132, 86, [[3.4, 15, P.apricot], [3, 18, P.periD], [3.6, 13, P.mint], [3, 16, P.terra], [3.2, 12, P.rose]])
      + books(132, 111, [[3.6, 16, P.mintD], [3, 13, P.paper], [3.4, 18, P.roseD]]) + plant(148.5, 111, .3, P.terra, "#6FB58F", 1)
      + books(132, 137, [[3, 14, P.terra], [3.6, 18, P.apricotD], [3, 15, P.peri], [3.4, 12, P.mint], [3, 17, P.periD]])
      + books(132, 162, [[3.8, 17, P.rose], [3.2, 14, P.tealL], [3.4, 19, P.apricot], [3, 13, P.paper]]);
    b += rr(28, 166.4, 90, 3.4, 1.7, P.roseD);
    /* armchair + person with mug and a striped blanket over the knees */
    b += rr(40, 94, 48, 60, 16, P.roseD) + rr(44, 140, 40, 18, 6, "#F1CFE7") + rr(38, 160, 5, 8, 1, P.woodDD) + rr(85, 160, 5, 8, 1, P.woodDD);
    b += sitter(64, 113, { skin: "e", hair: "#2A1E1B", style: "afro" }, { sweater: P.paper, cuff: "#EAD9BD" });
    b += rr(53, 163, 9, 5, 2.5, P.periD) + rr(66, 163, 9, 5, 2.5, P.periD)
      + pa("M46 164C45 150 47.5 142.5 55 142.5L73 142.5C80.5 142.5 83 150 82 164Z", P.apricot) + st("M47.4 150h33.2M46.4 157.4h35.2", P.apricotD, 2);
    b += rr(33, 122, 14, 42, 7, "#D48DBE") + rr(81, 122, 14, 42, 7, "#D48DBE");
    /* tea table */
    b += rr(99, 147, 20, 3, 1.5, P.woodD) + rr(108, 150, 2, 18, 0, P.woodD) + el(109, 141.4, 6.2, 5, P.periD) + st("M115 141q4 -1 4.6 -4.4", P.periD, 2) + rr(107, 135.2, 4, 2, 1, P.periD) + steam(121, 135, .7);
    const lamp = lit => rr(111.4, 0, 1.2, 40, 0, P.woodDD) + dome(112, 54, 26, 16, P.terra) + (lit ? el(112, 54.6, 8, 2.6, P.lampOn) : el(112, 54.6, 8, 2.6, P.lampOff));
    return { base: b, lamp, glow: [112, 62, 100] };
  },
  /* beside: someone sits up in bed with a book */
  bed(){
    let b = shell("#E3E6FB", "#CACFF4", P.wood);
    b += rr(88, 21.6, 58, 2.2, 1.1, P.woodD) + win(98, 29, 38, 46, { far: [[.2, .52, .9], [.7, .74, .6]] }) + rr(89, 22.5, 9, 60, 4, P.periD) + rr(136, 22.5, 9, 60, 4, P.periD);
    b += rr(50, 70, 34, 2.6, 1.3, P.woodD) + books(53, 70, [[3, 11, P.rose], [3, 13, P.apricotD], [3, 10, P.mintD]]) + plant(76, 70, .3, P.terra, "#6FB58F");
    b += rr(138, 144, 17, 24, 2, P.woodD) + rr(140.5, 150, 12, 7, 1, P.wood) + rr(141, 135.6, 5, 8.4, 1.2, "#E3F3F6") + rr(148.4, 140, 6, 4, 1, P.apricot);
    b += rr(34, 166.4, 86, 3.4, 1.7, P.mintD);
    b += rr(7, 98, 9.5, 68, 4.5, P.woodD) + rr(11, 152, 123, 9, 3, P.woodD) + rr(14, 160, 5, 8, 1, P.woodDD) + rr(126, 160, 5, 8, 1, P.woodDD) + rr(14, 140, 118, 14, 5, P.paper);
    b += `<rect x="15" y="117" width="15" height="25" rx="7" fill="${P.rose}"/><rect x="18" y="110" width="16" height="31" rx="7.5" transform="rotate(-9 26 126)" fill="#fff"/>`;
    b += pa("M26 144C25 131 31 124 41 124C51 124 58 131 58 144Z", P.tealM) + rr(35, 121.4, 12, 5.2, 2.6, "#357A78") + headAt(41, 114.5, { skin: "a", hair: "#C56A3C", style: "long" }, 5);
    b += pa("M47 146C46.5 137 52 132 60 133C80 135 100 134 112 131.5C118 125 127.5 126 128.5 133C129 138.6 127 141.4 124 142.4L124 150.6C100 153.6 70 153.6 47 150.6Z", P.mint)
      + st("M48.6 144C48.4 138.6 52.6 134.8 59.4 135.2", P.mintD, 2.2) + st("M76 139.5h4M92 138.5h4M108 136.5h4M84 146h4M100 145h4", P.mintD, 1.6);
    b += `<rect x="54" y="124" width="14" height="10.5" rx="1.6" transform="rotate(-10 61 129)" fill="${P.roseD}"/>` + ci(55, 132.4, 2.7, SKIN.a[0]) + ci(67.4, 130.2, 2.7, SKIN.a[0]);
    const lamp = lit => ci(30, 76.5, 2.4, P.woodDD) + rr(29.2, 76, 1.6, 8, 0, P.woodDD) + shade(30, 93, 17, 11, 9.5, lit);
    return { base: b, lamp, glow: [30, 96, 96] };
  },
  /* top right: at the table by the big window, tea and a small lamp */
  table(){
    let b = shell("#F9E4EF", "#EDCDE0", "#B98A5E");
    b += win(94, 26, 48, 76, { arch: true, far: [[.2, .56, .9], [.66, .44, .6], [.6, .8, 1]] }) + plant(104, 104, .34, P.terra, "#6FB58F") + plant(133, 104, .3, P.periD, "#6FB58F", 1);
    b += rr(12, 62, 50, 2.6, 1.3, P.woodD) + books(15, 62, [[3, 12, P.periD], [3.4, 14, P.apricot], [3, 10, P.mintD], [3, 13, P.terra]]) + rr(40, 50, 14, 12, 1.5, P.woodD) + rr(41.6, 51.6, 10.8, 8.8, .8, P.mint) + plant(8, 168, .5, P.tealM, "#6FB58F");
    b += rr(18, 166.4, 76, 3.4, 1.7, P.periD);
    b += rr(34, 100, 30, 44, 7, P.woodD) + rr(37, 144, 3, 24, 0, P.woodD) + rr(58, 144, 3, 24, 0, P.woodD);
    b += sitter(49, 105.5, { skin: "d", hair: "#DAD3C8", style: "short", glasses: true }, { sweater: P.periD, cuff: "#7F89DA", noMug: true });
    b += rr(17, 133, 3.4, 35, 1, P.woodD) + rr(76.6, 133, 3.4, 35, 1, P.woodD) + rr(11, 128, 75, 5.4, 2.7, P.wood);
    b += el(41, 126.6, 7.4, 3.8, "#7F89DA") + el(58.6, 126.6, 7.4, 3.8, "#7F89DA") + rr(53.4, 117.6, 9, 10.6, 2.8, P.terra) + ci(52.6, 124, 2.7, SKIN.d[0]) + ci(63.2, 124, 2.7, SKIN.d[0]) + steam(58, 115.4, .6)
      + el(74, 123.4, 5.4, 4.6, P.mintD) + st("M79 123q3.4 -.6 4 -3.6", P.mintD, 1.8) + rr(72.2, 117.6, 3.6, 1.8, .9, P.mintD);
    const lamp = lit => el(22, 127.4, 5.4, 1.6, P.woodDD) + rr(21.3, 112, 1.4, 15, 0, P.woodDD) + shade(22, 113, 17, 11.5, 9.5, lit);
    return { base: b, lamp, glow: [22, 114, 100] };
  },
  /* ground floor left: kitchen, kettle; someone in a wheelchair with a blanket and a mug */
  kitchen(){
    let b = shell("#FFF2D6", "#F2DDB2", P.wood);
    b += win(18, 26, 40, 34, { far: [[.62, .5, .9]] });
    b += rr(6, 78, 68, 46, 0, "#fff", ' opacity=".55"') + st("M6 93.4h68M6 108.6h68M23 78v46M40 78v46M57 78v46", "#EAD8B4", .8);
    b += rr(8, 84, 62, 2.8, 1.4, P.woodD) + rr(13, 76, 6, 8, 1.5, P.peri) + rr(21, 76, 6, 8, 1.5, P.rose) + rr(29, 76, 6, 8, 1.5, P.mint) + ci(46, 76.6, 7.4, P.paper) + ci(46, 76.6, 4.6, P.apricot) + plant(62, 84, .3, P.terra, "#6FB58F");
    b += rr(6, 128, 66, 40, 2, "#9FD3B5") + st("M28 131v34M50 131v34", "#86C7A2", 1.2) + ci(24, 147, 1.3, P.paper) + ci(32, 147, 1.3, P.paper) + ci(54, 147, 1.3, P.paper) + rr(4, 123.6, 70, 5, 2.5, P.paper);
    b += rr(14, 108.6, 15, 15, 5, P.terra) + pa("M29 113l5.4 -2.6v3.6l-5.4 3Z", P.terra) + st("M16.6 108.4c0 -6.4 9.8 -6.4 9.8 0", P.woodDD, 1.8) + steam(35.4, 108, .8)
      + rr(42, 111.6, 7, 12, 2, P.peri) + rr(42, 110.4, 7, 2.6, 1, P.woodD) + rr(52, 113.6, 6.4, 10, 2, P.rose) + rr(52, 112.4, 6.4, 2.6, 1, P.woodD);
    b += rr(138, 82, 19, 86, 3, P.peri) + rr(138, 112, 19, 1.6, 0, P.periD) + rr(141, 94, 1.8, 12, .9, P.periD) + rr(141, 118, 1.8, 16, .9, P.periD) + rr(148, 88, 6, 7, 1, P.apricot) + rr(146, 99, 5, 5, 1, P.rose);
    /* wheelchair */
    b += st("M119 116l8 -5", P.woodDD, 2.2) + rr(91, 112, 30, 36, 7, P.teal);
    b += sitter(106, 111.5, { skin: "b", hair: "#DDAE58", style: "bun" }, { sweater: P.roseD, cuff: "#C67DB1" });
    b += st("M92 166.4h27", P.woodDD, 2.2) + rr(95, 160.6, 8.4, 5, 2.5, P.woodD) + rr(108, 160.6, 8.4, 5, 2.5, P.woodD)
      + pa("M89.6 162C88.6 149 91 141.4 98.6 141.4L113.4 141.4C121 141.4 123.4 149 122.4 162Z", P.peri) + st("M90.4 150h31.2", P.periD, 2);
    b += `<g fill="none"><circle cx="127" cy="150.4" r="16.4" stroke="#27504F" stroke-width="2.8"/><circle cx="127" cy="150.4" r="12.6" stroke="#8DBDB8" stroke-width="1.1"/>`
      + `<path d="M127 138v24.8M114.6 150.4h24.8M118.2 141.6l17.6 17.6M135.8 141.6l-17.6 17.6" stroke="#27504F" stroke-width=".7" opacity=".7"/></g>` + ci(127, 150.4, 2.6, "#27504F") + ci(93, 165, 3, "#27504F");
    const lamp = lit => rr(103.4, 0, 1.2, 37, 0, P.woodDD) + shade(104, 52, 26, 15, 11, lit);
    return { base: b, lamp, glow: [104, 58, 100] };
  },
  /* ground floor right: day bed, headphones, a small glowing salt lamp */
  daybed(){
    let b = shell("#D9EEE6", "#BFE0D4", "#B98A5E");
    b += win(12, 30, 32, 40, { far: [[.56, .6, .9]] });
    b += st("M58 34C82 46 118 46 146 32", P.woodDD, .9) + [[66, 39.6, P.apricot, -6], [82, 43.6, P.rose, 3], [98, 45, P.peri, -3], [114, 44, P.paper, 5], [130, 39.6, P.mint, -4]].map(([x, y, c, a]) =>
      `<rect x="${x - 4.5}" y="${y}" width="9" height="11" rx="1.2" transform="rotate(${a} ${x} ${y})" fill="${c}"/>`).join("");
    b += rr(64, 92, 46, 2.6, 1.3, P.woodD) + plant(72, 92, .34, P.terra, "#6FB58F", 1) + books(84, 92, [[3, 12, P.periD], [3.4, 10, P.apricot], [3, 13, P.roseD]]) + plant(103, 92, .3, P.tealM, "#6FB58F");
    b += rr(30, 166.4, 100, 3.4, 1.7, P.apricotD);
    b += rr(26, 152, 118, 10, 3, P.woodD) + rr(30, 160, 5, 8, 1, P.woodDD) + rr(135, 160, 5, 8, 1, P.woodDD) + rr(28, 139, 114, 14, 5, P.paper);
    b += `<rect x="128" y="113" width="15" height="27" rx="7" fill="${P.apricot}"/><ellipse cx="121" cy="129" rx="13.5" ry="9" transform="rotate(24 121 129)" fill="${P.peri}"/>`
      + headAt(116.5, 121.5, { skin: "d", hair: "#2A1F1C", style: "bob", phones: "#7F89DA" }, 10);
    b += pa("M113 143C114 133 108 127.5 100 128.5C86 130 66 129 52 126C47 121 38 122 37 128.5C36.4 134 39 137 42.6 138.4L43 149C66 152 92 152 111 149.6Z", P.rose)
      + st("M110.8 141.6C111.2 134.6 107 130.6 100.4 130.8", P.roseD, 2.2) + ci(92, 138, 1.5, P.paper) + ci(78, 134, 1.5, P.paper) + ci(62, 139, 1.5, P.paper) + ci(50, 133, 1.5, P.paper) + ci(84, 145, 1.5, P.paper);
    b += cat(70, 127.4, .56, "#E8A566");
    b += rr(7, 150, 17, 18, 2, P.woodD);
    const lamp = lit => rr(10, 145.6, 11, 4.6, 1.6, P.woodDD) + pa("M10.6 146L12.6 134.6L16.6 130.4L19.6 135.4L20.6 146Z", lit ? "#FFC27F" : "#CDA98C", ` stroke="${lit ? "#FFC27F" : "#CDA98C"}" stroke-width="1.6" stroke-linejoin="round"`);
    return { base: b, lamp, glow: [15.5, 138, 92, "#FFD9A8"] };
  },
};

const DIM = "#133A3A";
/* a room in its light: "lit" (lamp on), "on" (lamp just coming on) or "dim" (still dark, only shapes) */
function room(fid, key, kind, x, y, state){
  const R = ROOMS[kind](), [gx, gy, gr, gc = "#FFEFC2"] = R.glow, id = `${fid}-${key}`;
  let s = R.base;
  if(state === "dim") s += R.lamp(false) + rr(0, 0, 160, 180, 0, DIM, ' opacity=".86"');
  else {
    const k = state === "on" ? .5 : 1;
    s = `<defs>${radial(`${id}-amb`, gx, gy, 190, [[0, P.night2, 0], [.3, P.night2, state === "on" ? .36 : .05], [1, P.night2, state === "on" ? .76 : .42]])}`
      + radial(`${id}-glow`, gx, gy, gr * (state === "on" ? .7 : 1), [[0, "#FFF6D8", .78 * k], [.22, gc, .42 * k], [1, gc, 0]]) + `</defs>` + s
      + rr(0, 0, 160, 180, 0, `url(#${id}-amb)`) + rr(0, 0, 160, 180, 0, `url(#${id}-glow)`) + R.lamp(true);
  }
  /* clipped group instead of a nested <svg>: page CSS that sizes "svg" elements must not touch the rooms */
  return `<g transform="translate(${x} ${y})"><clipPath id="${id}-clip"><rect width="160" height="180"/></clipPath><g clip-path="url(#${id}-clip)">${s}</g></g>`;
}

/* the attic under the roof: someone wrapped in a blanket, a string of small lights. Drawn in house coordinates. */
function attic(fid, state){
  const id = `${fid}-attic`, lit = state !== "dim";
  const lights = [[86, -22], [100, -34], [115, -45], [130, -56], [145, -68], [160, -79], [190, -79], [205, -68], [220, -56], [235, -45], [250, -34], [264, -22]];
  let s = pa("M52 -6L175 -100L298 -6Z", "#EBE0F6") + rr(40, -15, 270, 9, 0, "#B98A5E");
  s += rr(222, -37, 24, 22, 2, P.woodD) + rr(222, -28, 24, 2, 0, P.woodDD) + rr(248, -29, 18, 14, 2, P.wood) + plant(234, -37, .32, P.terra, "#6FB58F");
  s += books(96, -15, [[5, 14, P.periD], [4, 17, P.apricot], [5, 12, P.mintD]]) + rr(111, -19, 16, 4, 1, P.rose) + rr(112.6, -23, 13, 4, 1, P.peri);
  s += rr(134, -26, 84, 11, 4, P.paper) + `<ellipse cx="205" cy="-30" rx="11" ry="6" fill="${P.peri}"/>`;
  s += g(`translate(175 -55) scale(.44)`, pa("M-33 34C-37 -8 -21 -35 0 -35S37 -8 33 34Z", P.apricotD) + pa("M-50 88C-56 50 -34 22 0 18S56 50 50 88Z", P.apricot)
    + head({ skin: "c", hair: "#3A2925", style: "fringe" }) + st("M-5 30C-13 48 -15 68 -13 88", P.apricotD, 3) + rr(-9, 50, 18, 20, 6, P.periD) + el(-9, 61, 5, 6.4, SKIN.c[0]) + el(9, 61, 5, 6.4, SKIN.c[0]));
  s += st("M80 -17L160 -79Q175 -90 190 -79L270 -17", P.woodDD, .8) + lights.map(([x, y], k) => ci(x, y + 2.4, 2.3, lit ? ["#FFE29A", "#FFC58A", "#FFF0C4"][k % 3] : "#BDB3A6")).join("");
  if(!lit) s += pa("M52 -6L175 -100L298 -6Z", DIM, ' opacity=".86"') + rr(40, -15, 270, 9, 0, DIM, ' opacity=".86"');
  else s = `<defs>${radial(`${id}-glow`, 175, -56, 110, [[0, "#FFF6D8", .4], [.3, "#FFEFC2", .24], [1, "#FFEFC2", 0]])}</defs>` + s + pa("M52 -6L175 -100L298 -6Z", `url(#${id}-glow)`);
  return `<defs><clipPath id="${id}-clip"><path d="M52 -6L175 -100L298 -6Z"/></clipPath></defs><g clip-path="url(#${id}-clip)">${s}</g>`;
}

/* the whole house in its own coordinates: body 350×580 with 2×3 rooms, the roof above y = 0 */
const WALLC = "#2F6B6A", ROOFC = "#3C807B";
const SLOTS = [["tea", 10, 10], ["table", 180, 10], ["sofa", 10, 200], ["bed", 180, 200], ["kitchen", 10, 390], ["daybed", 180, 390]];
function house(fid, states){
  let s = rr(250, -112, 28, 70, 3, "#2A6160") + rr(246, -116, 36, 9, 3, "#35736F");
  s += pa("M-22 2L175 -132L372 2Z", ROOFC, ` stroke="${ROOFC}" stroke-width="10" stroke-linejoin="round"`);
  s += `<g fill="none" stroke="#2F6B6A" stroke-width="1.6" stroke-linecap="round" opacity=".55">` + [[20, -18, 6], [334, -18, 6], [44, -36, 5], [312, -36, 5], [70, -56, 4], [286, -56, 4], [20, -4, 7], [330, -4, 7]].map(([x, y]) =>
    `<path d="M${x - 9} ${y}q4.5 5 9 0q4.5 5 9 0"/>`).join("") + `</g>`;
  s += attic(fid, states.attic);
  s += rr(0, 0, 350, 580, 4, WALLC) + rr(-10, 578, 370, 12, 3, "#27595A");
  s += SLOTS.map(([kind, x, y]) => room(fid, kind, kind, x, y, states[kind])).join("");
  return s;
}

/* ---------- stills ---------- */
const svg = (label, inner) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${label}">${inner}</svg>`;
const nightBg = (fid, a = "#12393A", b = "#1B4849") => `<defs><linearGradient id="${fid}-bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs>`
  + `<rect width="${W}" height="${H}" fill="url(#${fid}-bg)"/>`;
const cam = (s, tx, ty, inner) => g(`translate(${f(tx)} ${f(ty)}) scale(${s})`, inner);

/* 1 — close in one room */
function frame1(){
  const fid = `${ID}-1`, s = 3.2;
  return svg("Ein Zimmer: jemand ruht auf dem Sofa, die Stehlampe geht an", nightBg(fid)
    + cam(s, 195 - (10 + 76) * s, 426 - 290 * s, house(fid, { sofa: "lit", tea: "dim", table: "dim", bed: "dim", kitchen: "dim", daybed: "dim", attic: "dim" })));
}
/* 2 — the neighbours: lamps come on one after the other */
function frame2(){
  const fid = `${ID}-2`, s = 1.62;
  return svg("Der Blick zieht zurück: daneben und darüber weitere Zimmer, Lampen gehen an", nightBg(fid)
    + cam(s, 14 - 10 * s, 404 - 200 * s, house(fid, { sofa: "lit", tea: "lit", table: "dim", bed: "on", kitchen: "dim", daybed: "dim", attic: "dim" })));
}
/* 3 — the whole house, every room warm */
const blob = (pts, fill, ex = "") => pts.map(([x, y, r]) => ci(x, y, r, fill, ex)).join("");
function frame3(){
  const fid = `${ID}-3`, s = .86, tx = (W - 350 * s) / 2, ty = 232, base = ty + 590 * s;
  const far = (x, w, h, roof, lit) => rr(x, base - h, w, h + 4, 3, "#1F5252") + pa(`M${x - 6} ${base - h + 2}L${x + w / 2} ${base - h - roof}L${x + w + 6} ${base - h + 2}Z`, "#245B5A")
    + lit.map(([u, v, on]) => rr(x + u, base - h + v, 13, 17, 2.5, on ? P.apricot : "#2B6564", on ? "" : ' opacity=".8"')
      + (on ? rr(x + u + 5.9, base - h + v, 1.2, 17, 0, "#E9A75C", ' opacity=".6"') : "")).join("");
  let o = nightBg(fid, "#103334", "#1A4647");
  /* trees behind, so the dark above the roof is a garden at night and not a sky */
  o += blob([[20, 250, 70], [84, 196, 58], [-10, 150, 60], [60, 120, 44]], "#17403F") + blob([[330, 214, 66], [392, 150, 64], [300, 150, 40], [372, 290, 60]], "#17403F")
    + blob([[150, 96, 46], [214, 66, 40], [258, 104, 36]], "#143A3A");
  o += far(-34, 70, 300, 46, [[40, 40, 1], [40, 96, 0], [40, 152, 1], [40, 208, 0]]) + far(354, 76, 250, 50, [[12, 36, 0], [12, 92, 1], [12, 148, 1]]);
  o += rr(0, base, W, H - base, 0, "#113233") + rr(0, base, W, 5, 0, "#1D4B4B");
  o += cam(s, tx, ty, house(fid, { sofa: "lit", tea: "lit", table: "lit", bed: "lit", kitchen: "lit", daybed: "lit", attic: "lit" }));
  /* garden in front */
  o += blob([[34, base + 6, 26], [8, base + 14, 24], [64, base + 16, 18]], "#1E5150") + blob([[352, base + 8, 24], [384, base + 12, 26], [322, base + 18, 16]], "#1E5150");
  o += `<g stroke="#2B6564" stroke-width="3" stroke-linecap="round">` + Array.from({ length: 27 }, (_, k) => `<path d="M${-4 + k * 15.4} ${base + 34}v24"/>`).join("") + `<path d="M-10 ${base + 43}h410"/></g>`;
  o += blob([[-6, H + 4, 44], [60, H + 22, 40], [330, H + 20, 44], [400, H, 46], [200, H + 46, 60]], "#0E2C2D");
  return svg("Das ganze Haus: in jedem Zimmer ein Mensch, überall warmes Licht", o);
}

/* 4 — many houses: small cross-sections, each room a person and a lamp */
const WARM = ["#FFE8C4", "#FFD9A6", "#FFEFD2", "#F9E0EC", "#DDF1E3", "#E3E6FB", "#FFE2B4", "#FFEBCB"];
const SWEAT = [P.periD, P.roseD, P.mintD, P.tealM, P.terra, P.paper, P.apricotD];
const TSKIN = ["#F8D8BD", "#EDBF9C", "#E2AB7C", "#BF8253", "#8E5B3C"], THAIR = ["#3A2925", "#5B3D33", "#2A1E1B", "#C56A3C", "#DDAE58", "#DAD3C8"];
function cell(x, y, cw, ch, R, on, col){
  if(!on) return rr(x, y, cw, ch, 2.5, "#245A5A");
  const k = cw / 36, fl = y + ch - 3 * k, cx = x + cw * (.3 + R() * .4), type = R(), sk = TSKIN[Math.floor(R() * 5)], hr = THAIR[Math.floor(R() * 6)], sw = SWEAT[Math.floor(R() * SWEAT.length)];
  const lx = cx > x + cw / 2 ? x + cw * .22 : x + cw * .78;
  let s = rr(x, y, cw, ch, 2.5, col || WARM[Math.floor(R() * WARM.length)]) + rr(x, fl, cw, 3 * k, 0, "#B98A5E", ' opacity=".75"');
  s += R() < .5 ? rr(lx - .5 * k, y, 1 * k, ch * .26, 0, P.woodDD, ' opacity=".7"') + pa(`M${f(lx - 4.4 * k)} ${f(y + ch * .26 + 4 * k)}L${f(lx - 2 * k)} ${f(y + ch * .26)}h${f(4 * k)}l${f(2.4 * k)} ${f(4 * k)}Z`, "#FFF8E0")
    : rr(lx - .5 * k, fl - 17 * k, 1 * k, 17 * k, 0, P.woodDD, ' opacity=".7"') + pa(`M${f(lx - 4.4 * k)} ${f(fl - 15 * k)}L${f(lx - 2.4 * k)} ${f(fl - 21 * k)}h${f(4.8 * k)}l${f(2 * k)} ${f(6 * k)}Z`, "#FFF8E0");
  const hd = (hx, hy) => ci(hx, hy, 4.5 * k, sk) + pa(`M${f(hx - 4.7 * k)} ${f(hy + .4 * k)}a${f(4.7 * k)} ${f(4.9 * k)} 0 0 1 ${f(9.4 * k)} 0q${f(-4.7 * k)} ${f(-3.4 * k)} ${f(-9.4 * k)} 0Z`, hr);
  if(type < .3){                                                 // lying on a bed
    const d = cx > x + cw / 2 ? -1 : 1, bx = Math.min(Math.max(cx, x + 14 * k), x + cw - 14 * k);
    s += rr(bx - 13 * k, fl - 5 * k, 26 * k, 5 * k, 2 * k, P.paper) + hd(bx - d * 8 * k, fl - 8.4 * k) + rr(bx - (d > 0 ? 4 : 13) * k, fl - 9.4 * k, 17 * k, 6.4 * k, 3.2 * k, sw);
  } else {                                                       // sitting, sometimes on a sofa
    if(type < .7) s += rr(cx - 10 * k, fl - 13 * k, 20 * k, 13 * k, 4 * k, type < .5 ? P.tealL : P.roseD, ' opacity=".9"');
    s += rr(cx - 6 * k, fl - 12 * k, 12 * k, 12 * k, 5 * k, sw) + hd(cx, fl - 15.4 * k);
  }
  return s;
}
function mini(x, base, cols, floors, cw, ch, { roof = "gable", seed = 1, dark = [], wall = "#2F6B6A", roofC = "#3C807B", colors = null, attic = false } = {}){
  const R = rng(seed), t = cw * .17, w = cols * cw + (cols + 1) * t, h = floors * ch + (floors + 1) * t, top = base - h;
  let s = "";
  if(roof === "gable"){
    const rh = w * .36;
    s += rr(x + w * .68, top - rh * .82, cw * .36, rh * .7, 1.5, wall) + pa(`M${f(x - 5)} ${f(top + 1)}L${f(x + w / 2)} ${f(top - rh)}L${f(x + w + 5)} ${f(top + 1)}Z`, roofC, ` stroke="${roofC}" stroke-width="4" stroke-linejoin="round"`);
    if(attic) s += pa(`M${f(x + w * .27)} ${f(top - 2)}L${f(x + w / 2)} ${f(top - rh * .7)}L${f(x + w * .73)} ${f(top - 2)}Z`, "#EBE0F6") + ci(x + w / 2, top - 6.4 * cw / 36, 3.8 * cw / 36, "#E2AB7C") + rr(x + w / 2 - 6 * cw / 36, top - 4.4 * cw / 36, 12 * cw / 36, 4 * cw / 36, 2, P.apricot);
    else s += ci(x + w / 2, top - rh * .4, cw * .15, R() < .6 ? P.apricot : "#245A5A");
  } else if(roof === "flat"){
    s += rr(x - 4, top - 6, w + 8, 8, 3, roofC) + rr(x + w * .12, top - 16, cw * .5, 11, 2, wall) + blob([[x + w * .7, top - 9, 6], [x + w * .78, top - 11, 7], [x + w * .86, top - 8, 5]], "#22595A");
  } else {
    s += pa(`M${f(x - 5)} ${f(top + 1)}L${f(x - 5)} ${f(top - w * .14)}L${f(x + w + 5)} ${f(top - w * .34)}L${f(x + w + 5)} ${f(top + 1)}Z`, roofC, ` stroke="${roofC}" stroke-width="4" stroke-linejoin="round"`)
      + rr(x + w * .2, top - w * .34, cw * .34, w * .2, 1.5, wall);
  }
  s += rr(x, top, w, h + 2, 3, wall);
  for(let r = 0; r < floors; r++) for(let c = 0; c < cols; c++){
    const k = r * cols + c;
    s += cell(x + t + c * (cw + t), top + t + r * (ch + t), cw, ch, R, !dark.includes(k), colors ? colors[k] : null);
  }
  return s;
}
function frame4(){
  const fid = `${ID}-4`;
  let o = nightBg(fid, "#0F3132", "#184243");
  o += blob([[30, 70, 64], [120, 40, 50], [215, 30, 50], [300, 50, 56], [392, 80, 60]], "#133838");
  /* back row */
  o += mini(-30, 238, 3, 4, 24, 27, { seed: 3, roof: "shed", dark: [1, 6, 11], wall: "#2A6160" }) + mini(70, 238, 2, 3, 24, 27, { seed: 5, dark: [4], wall: "#2C6665" })
    + mini(142, 238, 3, 5, 24, 27, { seed: 8, roof: "flat", dark: [0, 7, 13], wall: "#2A6160" }) + mini(242, 238, 2, 4, 24, 27, { seed: 13, dark: [2], wall: "#2C6665" })
    + mini(314, 238, 3, 3, 24, 27, { seed: 21, roof: "shed", dark: [5], wall: "#2A6160" });
  o += rr(0, 0, W, 240, 0, "#12393A", ' opacity=".12"') + rr(0, 236, W, 44, 0, "#123637") + rr(0, 236, W, 5, 0, "#1D4D4C");
  /* middle row: our house in the centre */
  o += mini(-86, 518, 2, 3, 40, 46, { seed: 34, roof: "gable", dark: [3], wall: "#2C6665" }) + mini(30, 518, 2, 4, 40, 46, { seed: 77, roof: "flat", dark: [5], wall: "#2A6160" })
    + mini(145, 518, 2, 3, 40, 46, { seed: 2, attic: true, colors: ["#DDF1E3", "#F9E4EF", "#FFE8C4", "#E3E6FB", "#FFF2D6", "#D9EEE6"] })
    + mini(260, 518, 3, 3, 40, 46, { seed: 55, dark: [4], wall: "#2C6665", roof: "shed" });
  o += rr(0, 516, W, 44, 0, "#113435") + rr(0, 516, W, 5, 0, "#1D4D4C");
  /* front row */
  o += mini(-62, 808, 3, 3, 46, 52, { seed: 89, dark: [7], roof: "gable" }) + mini(123, 808, 2, 4, 46, 52, { seed: 144, roof: "flat", wall: "#2C6665", dark: [1] }) + mini(254, 808, 3, 3, 46, 52, { seed: 233, dark: [4], roof: "shed" });
  o += rr(0, 806, W, 40, 0, "#0F2E2F") + rr(0, 806, W, 5, 0, "#1D4D4C");
  return svg("Viele Häuser: überall Zimmer, in jedem ein Mensch und ein Licht", o);
}

/* 5 — only the lit windows stay and settle into a calm pattern; the wordmark stands between them */
function pane(x, y, w, h, R, col, what){
  const sil = "#9A5A2A", o = ' opacity=".42"';
  let inner = "";
  if(what === "person") inner = ci(x + w / 2, y + h - 17, 7, sil, o) + pa(`M${f(x + w / 2 - 13)} ${f(y + h)}c0 -10 6 -13 13 -13s13 3 13 13Z`, sil, o);
  else if(what === "plant") inner = rr(x + w / 2 - 5, y + h - 9, 10, 9, 2, sil, o) + `<g${o} fill="${sil}"><ellipse cx="${f(x + w / 2 - 5)}" cy="${f(y + h - 17)}" rx="3.4" ry="8" transform="rotate(-26 ${f(x + w / 2 - 5)} ${f(y + h - 17)})"/><ellipse cx="${f(x + w / 2 + 5)}" cy="${f(y + h - 17)}" rx="3.4" ry="8" transform="rotate(26 ${f(x + w / 2 + 5)} ${f(y + h - 17)})"/><ellipse cx="${f(x + w / 2)}" cy="${f(y + h - 20)}" rx="3.2" ry="8.6"/></g>`;
  else if(what === "cat") inner = `<g${o} fill="${sil}"><ellipse cx="${f(x + w / 2)}" cy="${f(y + h - 6)}" rx="8" ry="6.4"/><circle cx="${f(x + w / 2)}" cy="${f(y + h - 15)}" r="5"/><path d="M${f(x + w / 2 - 5)} ${f(y + h - 17)}l.6 -5.6 3.6 3.4ZM${f(x + w / 2 + 5)} ${f(y + h - 17)}l-.6 -5.6 -3.6 3.4Z"/></g>`;
  else if(what === "mug") inner = `<g${o} fill="${sil}"><rect x="${f(x + w / 2 - 5)}" y="${f(y + h - 10)}" width="10" height="10" rx="2.6"/></g>` + st(`M${f(x + w / 2 - 1.6)} ${f(y + h - 13)}c-2 -2.6 2 -4.4 0 -7.4M${f(x + w / 2 + 2.6)} ${f(y + h - 13.6)}c-2 -2.6 2 -4.4 0 -7.4`, sil, 1.3, o);
  const arch = what === "home" ? false : R() < .5;
  const body = arch ? pa(`M${f(x)} ${f(y + h)}V${f(y + w / 2)}a${f(w / 2)} ${f(w / 2)} 0 0 1 ${f(w)} 0V${f(y + h)}Z`, col) : rr(x, y, w, h, 7, col);
  return body + inner + `<g fill="#FFF8EC" opacity=".8"><rect x="${f(x + w / 2 - 1)}" y="${f(y + (arch ? 1 : 0))}" width="2" height="${h - (arch ? 1 : 0)}"/><rect x="${f(x)}" y="${f(y + (arch ? w / 2 : h * .42))}" width="${w}" height="2"/></g>`
    + rr(x - 4, y + h + 1.6, w + 8, 4, 2, "#2F6B6A");
}
function frame5(){
  const fid = `${ID}-5`, R = rng(41);
  const cw = 40, ch = 54, px = 64, py = 84, cols = [P.apricot, "#FFDDAE", "#FFE8C4", P.apricot, "#FFD9A6", "#F7D3E6", "#D3EEDD", "#D7DBFA"];
  const things = ["person", "", "plant", "person", "", "cat", "person", "", "mug", "person", ""];
  let o = nightBg(fid, "#123839", "#194546");
  let panes = "";
  for(let r = -1; r < 11; r++) for(let c = -1; c < 7; c++){
    const x = 15 + c * px + (r % 2 ? px / 2 : 0), y = 26 + r * py, cy = y + ch / 2;
    if(Math.abs(cy - 404) < 96) continue;                        // the calm band for the wordmark
    const near = Math.abs(cy - 404) < 190, what = things[Math.floor(R() * things.length)], col = cols[Math.floor(R() * cols.length)];
    if(R() < .09 && !near){ panes += rr(x, y, cw, ch, 7, "#1F5150") + rr(x - 4, y + ch + 1.6, cw + 8, 4, 2, "#235857"); continue; }
    if(r === 3 && c === 2){                                     // the window from the first picture: rosé curtains, the cat on the sill
      panes += rr(x - 4, y - 3, cw + 8, 2.4, 1.2, "#9A6A40") + pane(x, y, cw, ch, R, "#FFE2B4", "cat") + rr(x - 3, y - 1, 8, ch + 1, 4, P.roseD) + rr(x + cw - 5, y - 1, 8, ch + 1, 4, P.roseD); continue;
    }
    panes += pane(x, y, cw, ch, R, col, what);
  }
  o += panes;
  o += `<text x="195" y="425" text-anchor="middle" font-family="${FONT}" font-size="64" fill="${P.cream}"><tspan font-weight="700">ME</tspan><tspan font-weight="500">jority</tspan></text>`;
  return svg("Die erleuchteten Fenster ordnen sich zu einem ruhigen Muster, dazwischen die Wortmarke MEjority", o);
}

export default {
  id: ID,
  order: 3,
  title: "Viele Zimmer, ein Haus",
  idea: "Ein Mensch ruht allein in seinem Zimmer – der Blick zieht zurück und zeigt: nebenan, darüber, im ganzen Haus und in allen Häusern ringsum brennt dasselbe warme Licht.",
  duration: "ca. 6,5 s",
  frames: [
    { t: "0,4 s", caption: "Nah in einem Zimmer: Jemand ruht unter der Decke auf dem Sofa, die Stehlampe glimmt langsam auf. Ringsum ist es noch dunkel.", svg: frame1() },
    { t: "1,8 s", caption: "Der Blick zieht ruhig zurück. Darüber und daneben liegen weitere Zimmer, in jedem ein Mensch; dort gehen nacheinander die Lampen an.", svg: frame2() },
    { t: "3,2 s", caption: "Das ganze Haus im Querschnitt: sieben Zimmer, sieben Menschen, überall warmes Licht. Auch in den Nachbarhäusern leuchten erste Fenster.", svg: frame3() },
    { t: "4,6 s", caption: "Weiter zurück: viele Häuser voller Zimmer. Die letzten dunklen Zimmer werden eines nach dem anderen hell.", svg: frame4() },
    { t: "5,8 s", caption: "Die Mauern treten zurück, nur die warmen Fenster bleiben und rücken sacht in ein ruhiges Muster. In der Mitte blendet die Wortmarke ein.", svg: frame5() },
  ],
};
