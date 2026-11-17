/* Generates intro-storyboards/index.html: two storyboards (5 stills each, 390×844) for the MEjority intro.
   Everything is drawn in code (inline SVG). Run: node intro-storyboards/build.mjs
   The output is an embeddable fragment (<title>, <style>, content), no <html>/<head>/<body>. */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const W = 390, H = 844;
const FONT = "ui-rounded,'SF Pro Rounded','Fredoka','Nunito',system-ui,sans-serif";
const INK = "#1d3d8f";
const f = v => +(+v).toFixed(2);
const rad = d => d * Math.PI / 180;
function rng(seed){ return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
  t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

/* ---------- shared pieces ---------- */
const lin = (id, stops) => `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">`
  + stops.map(([o, c, a]) => `<stop offset="${o}" stop-color="${c}"${a != null ? ` stop-opacity="${a}"` : ""}/>`).join("") + "</linearGradient>";
const radial = (id, stops) => `<radialGradient id="${id}">`
  + stops.map(([o, c, a]) => `<stop offset="${o}" stop-color="${c}"${a != null ? ` stop-opacity="${a}"` : ""}/>`).join("") + "</radialGradient>";

/* the splash sky (lib/splash.css) */
const SPLASH_SKY = [[0,"#2f7ae6"],[.18,"#4690f0"],[.36,"#6eaef7"],[.51,"#9ccbfd"],[.6,"#c4e0ff"],[.66,"#eaf2ff"],[.71,"#fff0e3"],[.79,"#ffdcc6"],[.88,"#ffcbc3"],[1,"#fcbcc4"]];

/* cartoon cloud from lib/splash.js: the same puffs twice, a tinted underside and the face lifted 7 units */
const PUFFS = [[48,70,30],[88,52,40],[132,58,32],[162,74,24],[26,84,18]];
const puffs = flip => PUFFS.map(([x,y,r]) => `<circle cx="${flip ? 200-x : x}" cy="${y}" r="${r}"/>`).join("")
  + '<rect x="20" y="66" width="160" height="40" rx="20"/>';
function cloud(x, y, w, face, shade, flip, op = 1){
  return `<g transform="translate(${f(x)} ${f(y)}) scale(${f(w/200)})"${op < 1 ? ` opacity="${op}"` : ""}>`
    + `<g fill="${shade}">${puffs(flip)}</g><g fill="${face}" transform="translate(0 -7)">${puffs(flip)}</g></g>`;
}
/* the cloud layout of the splash, in any palette; rise = px the big ones still sit below their place */
const CL_SMALL = [{l:.05,t:.13,w:.31},{r:.06,t:.24,w:.22,flip:1},{r:-.05,t:.57,w:.26,op:.95}];
const CL_BIG = [{l:-.30,b:.06,w:.92,k:"P"},{r:-.34,b:.03,w:.98,k:"P",flip:1},{l:-.40,b:-.11,w:1.04,k:"W"},{r:-.44,b:-.14,w:1.08,k:"W",flip:1},{l:.12,b:-.15,w:.86,k:"W"}];
function place(c){ const w = c.w*W; const x = c.l != null ? c.l*W : W - c.r*W - w; const y = c.t != null ? c.t*H : H - c.b*H - w*.55; return [x, y, w]; }
function smallClouds(pal, op = 1){ return CL_SMALL.map(c => { const [x,y,w] = place(c); return cloud(x, y, w, pal.W, pal.WS, c.flip, (c.op || 1)*op); }).join(""); }
function bigClouds(pal, rise = 0){ const one = c => { const [x,y,w] = place(c); return cloud(x, y + rise, w, pal[c.k], pal[c.k+"S"], c.flip); };
  /* one extra front puff covers the exposed underside of the back row between the front clouds */
  return CL_BIG.filter(c => c.k === "P").map(one).join("") + `<circle cx="188" cy="${f(796+rise)}" r="56" fill="${pal.W}"/>` + CL_BIG.filter(c => c.k === "W").map(one).join(""); }
const DAY = {W:"#ffffff", WS:"#d6e2fb", P:"#fff1ec", PS:"#f9d9dc"};

/* the wordmark exactly as in the splash at 390 px: white ME plaque, small sun behind its top left corner, "jority" */
function wordmark(fid, {cy = 371, halo = 0} = {}){
  const pw = 108.2, ph = 80.6, gap = 2.5, rest = 136.4;
  const x0 = (W - (pw + gap + rest)) / 2, py = cy - ph/2, base = py + 62.4;
  const sx = x0 + 10.1, sy = py + 3.3, sr = 21.3;
  const rays = [-100,-65,-30,5,40].map(a => `<line x1="0" y1="-30.2" x2="0" y2="-38.6" transform="rotate(${a})"/>`).join("");
  return `<defs><clipPath id="${fid}-sunc"><circle cx="${f(sx)}" cy="${f(sy)}" r="${sr}"/></clipPath>`
    + `<filter id="${fid}-ps" x="-60%" y="-60%" width="220%" height="240%"><feGaussianBlur stdDeviation="17"/></filter>`
    + radial(`${fid}-halo`, [[0,"#fff6d8",.95],[.35,"#ffe9b0",.55],[1,"#ffe9b0",0]]) + `</defs>`
    + (halo ? `<circle cx="${f(sx)}" cy="${f(sy)}" r="${halo}" fill="url(#${fid}-halo)"/>` : "")
    + `<g transform="translate(${f(sx)} ${f(sy)})" stroke="#ffc43f" stroke-width="5" stroke-linecap="round">${rays}</g>`
    + `<circle cx="${f(sx)}" cy="${f(sy)}" r="${sr}" fill="#ffb02e"/>`
    + `<circle cx="${f(sx-3.4)}" cy="${f(sy-3.9)}" r="${sr}" fill="#ffc640" clip-path="url(#${fid}-sunc)"/>`
    + `<rect x="${f(x0)}" y="${f(py+17)}" width="${pw}" height="${ph}" rx="24.6" fill="#143278" opacity=".24" filter="url(#${fid}-ps)"/>`
    + `<rect x="${f(x0)}" y="${f(py+5)}" width="${pw}" height="${ph}" rx="24.6" fill="#c4d6f6"/>`
    + `<rect x="${f(x0)}" y="${f(py)}" width="${pw}" height="${ph}" rx="24.6" fill="#ffffff"/>`
    + `<g font-family="${FONT}" font-weight="800" font-size="56" fill="${INK}">`
    + `<text x="${f(x0+pw/2-.4)}" y="${f(base)}" text-anchor="middle" letter-spacing="-0.84">ME</text>`
    + `<text x="${f(x0+pw+gap)}" y="${f(base)}">jority</text></g>`;
}

function svg(fid, label, inner){
  return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label}">${inner}</svg>`;
}
const skyRect = (fid, stops) => `<defs>${lin(`${fid}-sky`, stops)}</defs><rect width="${W}" height="${H}" fill="url(#${fid}-sky)"/>`;
const glow = (fid, name, cx, cy, rx, ry, stops) => `<defs>${radial(`${fid}-${name}`, stops)}</defs>`
  + `<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(rx)}" ry="${f(ry)}" fill="url(#${fid}-${name})"/>`;

/* =====================================================================
   CONCEPT 1 — HANDS
   ===================================================================== */
const HC = {x: 195, y: 388};                     // where the hands meet
const ARMS = [                                   // stacking order = order of arrival; theta = side the arm comes from
  {theta:  97, skin:"#F3C7A0", line:"#D69C72", sleeve:"#FFAF57", cuff:"#FFD49B", rib:"#F3973A"},                 // apricot, from below (the first one)
  {theta: 170, skin:"#8E5B3C", line:"#6C4027", sleeve:"#8ACDA7", cuff:"#C8ECD6", rib:"#67B58A", flip:1, bands:"mint"},   // mint, from the left
  {theta: 318, skin:"#E2AB7C", line:"#C1875A", sleeve:"#98A2EE", cuff:"#CDD2FA", rib:"#7985DE"},                 // periwinkle, from the top right
  {theta: 243, skin:"#BF8253", line:"#9C643A", sleeve:"#DC9DCA", cuff:"#F1CFE7", rib:"#C67DB1", flip:1},         // lilac rosé, from the top left
  {theta:  22, skin:"#F8D8BD", line:"#E0AE8C", sleeve:"#3F8785", cuff:"#84BBB7", rib:"#2F6B6A", bands:"teal"},   // teal, from the right
];
const FX = [-29,-14.5,0,14.5,29], TIP = [-90,-99,-95,-83], FR = 7.25;
const MITTEN = (() => {
  let d = `M -21 12 C -25 -12 -29 -26 -29 -50 L -29 ${TIP[0]+FR}`;
  for(let i = 0; i < 4; i++){ d += ` A ${FR} ${FR} 0 0 1 ${FX[i+1]} ${TIP[i]+FR}`; if(i < 3) d += ` L ${FX[i+1]} ${TIP[i+1]+FR}`; }
  return d + " L 29 -50 C 29 -26 25 -12 21 12 Z";
})();
const THUMB = '<ellipse cx="-31" cy="-27" rx="9.5" ry="21" transform="rotate(-30 -31 -27)"/>';
const FINGERS = [1,2,3].map(i => `<line x1="${FX[i]}" y1="${Math.max(TIP[i-1],TIP[i])+FR+.5}" x2="${FX[i]}" y2="-58"/>`).join("");
const SLEEVE = '<rect x="-31" y="2" width="62" height="900"/>', CUFF = '<rect x="-36" y="-7" width="72" height="26" rx="11"/>';
function bands(kind, a){
  if(kind === "mint") return `<g fill="${a.cuff}"><rect x="-31" y="34" width="62" height="7"/><rect x="-31" y="48" width="62" height="7"/></g>`;
  if(kind === "teal") return `<g fill="#5B9693">${[0,1,2,3,4,5,6,7,8,9,10,11].map(i => `<rect x="-31" y="${34+i*30}" width="62" height="9"/>`).join("")}</g>`;
  return "";
}
function edgeDist(theta){ const ux = Math.cos(rad(theta)), uy = Math.sin(rad(theta));
  const tx = ux > 0 ? (W-HC.x)/ux : ux < 0 ? -HC.x/ux : 1e9, ty = uy > 0 ? (H-HC.y)/uy : uy < 0 ? -HC.y/uy : 1e9; return Math.min(tx, ty); }
/* one arm: r = distance of the palm centre from the meeting point, bend = wrist turn (the "petal" opening) */
const HS = 1.18;                                 // hand size
function arm(a, r, bend = 0, sh = .17){
  const tf = `translate(${HC.x} ${HC.y}) rotate(${f(a.theta-90)}) translate(0 ${f(r+50*HS)}) scale(${HS})`;
  const hand = `rotate(${bend})${a.flip ? " scale(-1 1)" : ""}`;
  const sil = `${SLEEVE}${CUFF}<g transform="${hand}">${THUMB}<path d="${MITTEN}"/></g>`;
  return `<g transform="translate(0 8)" fill="#56366e" opacity="${sh}"><g transform="${tf}">${sil}</g></g>`
    + `<g transform="${tf}"><g fill="${a.sleeve}">${SLEEVE}</g>${bands(a.bands, a)}`
    + `<g transform="${hand}"><g fill="${a.skin}">${THUMB}<path d="${MITTEN}"/></g>`
    + `<g stroke="${a.line}" stroke-width="2.4" stroke-linecap="round" fill="none">${FINGERS}<path d="M -22 -30 Q -17 -22 -19 -10" opacity=".8"/></g></g>`
    + `<g fill="${a.cuff}">${CUFF}</g><g stroke="${a.rib}" stroke-width="2" stroke-linecap="round" opacity=".55">`
    + [-22,-11,0,11,22].map(x => `<line x1="${x}" y1="0" x2="${x}" y2="12"/>`).join("") + `</g></g>`;
}
const DAWN = [[0,"#a9b9f3"],[.26,"#cbc6f0"],[.5,"#f1d3df"],[.74,"#ffdccd"],[1,"#fbc4bd"]];
const DAWN_CL = {W:"#fff7f0", WS:"#efcfdc"};
function dawnClouds(op = 1){
  return cloud(196, 58, 156, DAWN_CL.W, DAWN_CL.WS, 0, op) + cloud(-40, 246, 106, DAWN_CL.W, DAWN_CL.WS, 1, op)
    + cloud(-70, 648, 200, DAWN_CL.W, DAWN_CL.WS, 1, op) + cloud(262, 742, 210, DAWN_CL.W, DAWN_CL.WS, 0, op);
}
function bigSun(fid, r, {rays = true} = {}){
  const wedges = rays ? Array.from({length: 10}, (_, i) => { const a = rad(i*36 + 8), h = rad(5.5), L = 520;
    return `<path d="M ${HC.x} ${HC.y} L ${f(HC.x+L*Math.cos(a-h))} ${f(HC.y+L*Math.sin(a-h))} L ${f(HC.x+L*Math.cos(a+h))} ${f(HC.y+L*Math.sin(a+h))} Z"/>`; }).join("") : "";
  return `<defs><clipPath id="${fid}-bs"><circle cx="${HC.x}" cy="${HC.y}" r="${r}"/></clipPath>`
    + `<radialGradient id="${fid}-ray" gradientUnits="userSpaceOnUse" cx="${HC.x}" cy="${HC.y}" r="460"><stop offset="0" stop-color="#fff8de" stop-opacity=".8"/><stop offset=".45" stop-color="#fff2cc" stop-opacity=".3"/><stop offset="1" stop-color="#fff2cc" stop-opacity="0"/></radialGradient></defs>`
    + (rays ? `<g fill="url(#${fid}-ray)">${wedges}</g>` : "")
    + `<circle cx="${HC.x}" cy="${HC.y}" r="${f(r*2.75)}" fill="#fff4d2" opacity=".28"/>`
    + `<circle cx="${HC.x}" cy="${HC.y}" r="${f(r*1.95)}" fill="#ffecb8" opacity=".45"/>`
    + `<circle cx="${HC.x}" cy="${HC.y}" r="${f(r*1.38)}" fill="#ffdc8a" opacity=".7"/>`
    + `<circle cx="${HC.x}" cy="${HC.y}" r="${r}" fill="#ff9f2e"/>`
    + `<circle cx="${f(HC.x-r*.14)}" cy="${f(HC.y-r*.16)}" r="${r}" fill="#ffb640" clip-path="url(#${fid}-bs)"/>`;
}

function hands(i){
  const fid = `h${i}`;
  const pool = (op, r = 250) => glow(fid, "pool", HC.x, HC.y, r, r, [[0,"#fff8ea",op],[.55,"#fff3e0",op*.45],[1,"#fff3e0",0]]);
  if(i === 1) return svg(fid, "Hands, Bild 1", skyRect(fid, DAWN) + pool(.7) + dawnClouds()
    + arm(ARMS[0], 4));
  if(i === 2) return svg(fid, "Hands, Bild 2", skyRect(fid, DAWN) + pool(.7) + dawnClouds()
    + arm(ARMS[0], 4) + arm(ARMS[1], 124) + arm(ARMS[2], 168) + arm(ARMS[3], 186) + arm(ARMS[4], 132));
  if(i === 3) return svg(fid, "Hands, Bild 3", skyRect(fid, DAWN) + pool(.75)
    + glow(fid, "warm", HC.x, HC.y, 215, 215, [[0,"#ffc95e",.95],[.45,"#ffd88a",.5],[1,"#ffe1a8",0]]) + dawnClouds()
    + ARMS.map((a, k) => arm(a, [30, 33, 31, 34, 32][k], 0, .2)).join(""));
  if(i === 4) return svg(fid, "Hands, Bild 4", skyRect(fid, [[0,"#6ea0f0"],[.24,"#9fc3f9"],[.46,"#d9e6ff"],[.6,"#fff1e2"],[.8,"#ffdcc0"],[1,"#fcc4c2"]])
    + dawnClouds(.9) + bigSun(fid, 50)
    + ARMS.map((a, k) => arm(a, [140, 132, 142, 140, 134][k], 21, .14)).join(""));
  return svg(fid, "Hands, Bild 5", skyRect(fid, SPLASH_SKY)
    + glow(fid, "hor", 195, 650, 273, 126, [[0,"#ffecd6",.75],[1,"#ffecd6",0]])
    + smallClouds(DAY)
    + ARMS.map((a, k) => arm(a, edgeDist(a.theta) - [-64, -8, 22, 22, -8][k], 0, .12)).join("")
    + wordmark(fid, {halo: 120}) + bigClouds(DAY));
}

/* =====================================================================
   CONCEPT 2 — LIGHTS BECOME THE SUN
   ===================================================================== */
const LC = {x: 195, y: 372};                     // the first light; everything gathers here
const LCOL = ["#ffd98a","#ffc266","#ffab6b","#ff9d8a","#ffe7ba"];
const LIGHTS = (() => { const R = rng(11), out = [];
  let guard = 0;
  while(out.length < 46 && guard++ < 6000){
    const x = 22 + R()*346, y = 60 + R()*560, d = Math.hypot(x-LC.x, y-LC.y);
    if(d < 46) continue;
    if(out.some(p => Math.hypot(p.x-x, p.y-y) < 31)) continue;
    out.push({x, y, r: 2.3 + R()*2.9, c: Math.floor(R()*LCOL.length), late: R()});
  }
  return out; })();
const lightDefs = fid => `<defs>${LCOL.map((c, k) => radial(`${fid}-g${k}`, [[0,c,.6],[.35,c,.22],[1,c,0]])).join("")}</defs>`;
function light(fid, x, y, r, c, op = 1, g = 5){
  return `<g${op < 1 ? ` opacity="${f(op)}"` : ""}><circle cx="${f(x)}" cy="${f(y)}" r="${f(r*g)}" fill="url(#${fid}-g${c})"/>`
    + `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="${LCOL[c]}"/><circle cx="${f(x-r*.18)}" cy="${f(y-r*.2)}" r="${f(r*.45)}" fill="#fff8e8" opacity=".85"/></g>`;
}
/* a light on its way to the centre: it has travelled the share k of its spiral; the trail is the last stretch, tapered */
function travel(p, k, swirl = .55){
  const d0 = Math.hypot(p.x-LC.x, p.y-LC.y), a0 = Math.atan2(p.y-LC.y, p.x-LC.x);
  const at = s => { const d = d0*(1-s) + 10*s, a = a0 + swirl*s; return [LC.x + d*Math.cos(a), LC.y + d*Math.sin(a)]; };
  return {pos: at(k), at};
}
function trail(p, k, from, color, op, swirl){
  const {at} = travel(p, k, swirl), N = 14, L = [], Rr = [];
  for(let j = 0; j <= N; j++){
    const s = from + (k-from)*j/N, [x, y] = at(s), [x2, y2] = at(s + .01);
    const dx = x2-x, dy = y2-y, len = Math.hypot(dx, dy) || 1, w = p.r*.95*(j/N);
    L.push(`${f(x - dy/len*w)} ${f(y + dx/len*w)}`); Rr.unshift(`${f(x + dy/len*w)} ${f(y - dx/len*w)}`);
  }
  return `<path d="M ${L.join(" L ")} L ${Rr.join(" L ")} Z" fill="${color}" opacity="${op}"/>`;
}
const STARS = (() => { const R = rng(5); return Array.from({length: 34}, () => ({x: R()*W, y: R()*520, r: .6 + R()*.8, o: .25 + R()*.45})); })();
const stars = op => `<g fill="#dfe6ff" opacity="${op}">${STARS.map(s => `<circle cx="${f(s.x)}" cy="${f(s.y)}" r="${f(s.r)}" opacity="${f(s.o)}"/>`).join("")}</g>`;

const NIGHT = [[0,"#0f1840"],[.3,"#18245a"],[.56,"#273572"],[.74,"#3f4484"],[.88,"#6a5489"],[1,"#96647f"]];
const NIGHT_CL = {W:"#2b3872", WS:"#222d60", P:"#3c4380", PS:"#32396f"};

function lights(i){
  const fid = `l${i}`, defs = lightDefs(fid);
  if(i === 1) return svg(fid, "Lights, Bild 1", skyRect(fid, NIGHT) + defs + stars(.8)
    + glow(fid, "hor", 195, 700, 300, 120, [[0,"#c9788a",.4],[1,"#c9788a",0]])
    + smallClouds(NIGHT_CL, .75) + bigClouds(NIGHT_CL)
    + glow(fid, "one", LC.x, LC.y, 90, 90, [[0,"#ffd98a",.28],[1,"#ffd98a",0]])
    + light(fid, LC.x, LC.y, 5.2, 0));
  if(i === 2) return svg(fid, "Lights, Bild 2", skyRect(fid, NIGHT) + defs + stars(.7)
    + glow(fid, "hor", 195, 700, 300, 120, [[0,"#c9788a",.45],[1,"#c9788a",0]])
    + smallClouds(NIGHT_CL, .75) + bigClouds(NIGHT_CL)
    + LIGHTS.map(p => light(fid, p.x, p.y, p.r*(p.late > .78 ? .6 : 1), p.c, p.late > .78 ? .6 : 1)).join("")
    + glow(fid, "one", LC.x, LC.y, 90, 90, [[0,"#ffd98a",.28],[1,"#ffd98a",0]])
    + light(fid, LC.x, LC.y, 5.6, 0));
  if(i === 3){
    const sky = [[0,"#141f4f"],[.3,"#23316e"],[.54,"#3d4589"],[.72,"#6a5794"],[.87,"#a56d8f"],[1,"#d98b86"]];
    const cl = {W:"#3a4585", WS:"#2e3871", P:"#5a5494", PS:"#4a467f"};
    return svg(fid, "Lights, Bild 3", skyRect(fid, sky) + defs + stars(.45)
      + glow(fid, "hor", 195, 700, 320, 140, [[0,"#f0a08c",.5],[1,"#f0a08c",0]])
      + glow(fid, "mid", LC.x, LC.y, 250, 250, [[0,"#ffc78a",.5],[.4,"#f5a58e",.26],[1,"#e08a96",0]])
      + smallClouds(cl, .8) + bigClouds(cl)
      + LIGHTS.map(p => { const k = .28 + (1-p.late)*.42; return trail(p, k, Math.max(0, k-.3), LCOL[p.c], .3, 1.5); }).join("")
      + LIGHTS.map(p => { const k = .28 + (1-p.late)*.42, [x, y] = travel(p, k, 1.5).pos; return light(fid, x, y, p.r*1.1, p.c, 1, 4.4); }).join("")
      + glow(fid, "one", LC.x, LC.y, 70, 70, [[0,"#ffe2a0",.6],[1,"#ffd98a",0]])
      + light(fid, LC.x, LC.y, 8, 0, 1, 4));
  }
  if(i === 4){
    const sky = [[0,"#3257b8"],[.22,"#5f7fd6"],[.42,"#a4a8e6"],[.58,"#e6bfd6"],[.72,"#ffd0b4"],[.88,"#ffc09c"],[1,"#f8a99a"]];
    const cl = {W:"#b9b4e6", WS:"#9a97d2", P:"#f0c3d6", PS:"#dfa6c0"};
    const R = rng(23), sat = Array.from({length: 6}, (_, k) => { const a = k/6*Math.PI*2 + .3 + R()*.7, d = 40 + R()*7;
      return {x: LC.x + d*Math.cos(a), y: LC.y + d*Math.sin(a), r: 4.5 + R()*2.5, c: [0,1,2,4,3,1][k]}; });
    const rest = LIGHTS.filter(p => p.late > .45).slice(0, 16);
    return svg(fid, "Lights, Bild 4", skyRect(fid, sky) + defs
      + glow(fid, "hor", 195, 680, 320, 150, [[0,"#ffe2c4",.6],[1,"#ffe2c4",0]])
      + glow(fid, "mid", LC.x, LC.y, 290, 290, [[0,"#fff3cf",.85],[.3,"#ffe2a8",.5],[.65,"#ffd2a6",.2],[1,"#ffd2a6",0]])
      + smallClouds(cl, .9) + bigClouds(cl)
      + rest.map(p => { const k = .5 + (1-p.late)*.5; return trail(p, k, k-.22, "#fff3c4", .5, 1.5); }).join("")
      + rest.map(p => { const k = .5 + (1-p.late)*.5, [x, y] = travel(p, k, 1.5).pos; return light(fid, x, y, p.r*1.25, p.c, 1, 3.6); }).join("")
      + `<circle cx="${LC.x}" cy="${LC.y}" r="104" fill="#fff4d2" opacity=".24"/>`
      + `<circle cx="${LC.x}" cy="${LC.y}" r="74" fill="#ffecb8" opacity=".42"/>`
      + `<circle cx="${LC.x}" cy="${LC.y}" r="54" fill="#ffdc8a" opacity=".6"/>`
      + sat.map(s => light(fid, s.x, s.y, s.r, s.c, 1, 2.6)).join("")
      + `<circle cx="${LC.x}" cy="${LC.y}" r="40" fill="#ffb02e"/><defs><clipPath id="${fid}-core"><circle cx="${LC.x}" cy="${LC.y}" r="40"/></clipPath></defs>`
      + `<circle cx="${LC.x-6}" cy="${LC.y-7}" r="40" fill="#ffc640" clip-path="url(#${fid}-core)"/>`);
  }
  return svg(fid, "Lights, Bild 5", skyRect(fid, SPLASH_SKY)
    + glow(fid, "hor", 195, 650, 273, 126, [[0,"#ffecd6",.75],[1,"#ffecd6",0]])
    + smallClouds(DAY) + wordmark(fid, {halo: 120}) + bigClouds(DAY));
}

/* =====================================================================
   PAGE
   ===================================================================== */
const CONCEPTS = [
  {id: "hands", n: 1, title: "Hands", draw: hands, dur: "ca. 6,5 s",
   idea: "Erst eine Hand, dann viele: Sie legen sich aufeinander, öffnen sich wie eine Blüte und geben die Sonne frei.",
   shots: [
    ["0,4 s", "Eine einzelne Hand schiebt sich langsam von unten in die Mitte und bleibt dort liegen."],
    ["1,6 s", "Von allen Seiten gleiten weitere Hände herein, leicht versetzt, jede in ihrem Tempo."],
    ["2,8 s", "Alle Hände ruhen aufeinander. Einen Atemzug lang bewegt sich nichts, darunter wird es warm."],
    ["4,0 s", "Die Hände öffnen sich wie eine Blüte, drehen leicht nach außen und geben die Sonne frei."],
    ["5,4 s", "Der Himmel wird blau, die Sonne schrumpft hinter die ME-Plakette, „jority“ erscheint. Die Hände ziehen sich an den Rand zurück."],
   ]},
  {id: "lights", n: 2, title: "Lights become the sun", draw: lights, dur: "ca. 6,5 s",
   idea: "Ein Licht allein ist ein Punkt. Viele Lichter ziehen zusammen, werden zur Sonne und machen den Himmel hell.",
   shots: [
    ["0,0 s", "Dunkler Himmel vor der Dämmerung. Ein einzelnes kleines Licht glimmt auf und pulsiert ruhig."],
    ["1,4 s", "Nach und nach tauchen überall weitere Lichter auf, erst wenige, dann viele."],
    ["2,8 s", "Die Lichter ziehen in weiten Bögen zum ersten Licht. Der Himmel beginnt in der Mitte zu glühen."],
    ["4,0 s", "Sie verschmelzen zur Sonne, die letzten kommen an. Der Himmel kippt von Indigo in Morgenfarben."],
    ["5,4 s", "Heller Morgen: Die Sonne sitzt hinter der ME-Plakette, „jority“ erscheint, die Wolken sind weiß."],
   ]},
];

const css = `
/* Layout: two sections, each a strip of five portrait stills; swipeable strip on phones, five columns on desktop */
:root{
  --bg:#edf0f6; --surface:#f7f9fc; --ink:#1b2747; --muted:#56617f; --line:#d3dae8; --accent:#1d3d8f; --chip:#dde5f6; --shadow:rgba(27,39,71,.16);
  --rounded:ui-rounded,"SF Pro Rounded","Fredoka","Nunito",system-ui,sans-serif;
  --gl:max(16px,env(safe-area-inset-left,0px)); --gr:max(16px,env(safe-area-inset-right,0px));
}
@media (prefers-color-scheme: dark){:root:not([data-theme="light"]){
  --bg:#12172a; --surface:#1a2038; --ink:#e9edf8; --muted:#9ea9c6; --line:#2b3453; --accent:#a9c0ff; --chip:#242e4f; --shadow:rgba(0,0,0,.45); color-scheme:dark}}
:root[data-theme="dark"]{
  --bg:#12172a; --surface:#1a2038; --ink:#e9edf8; --muted:#9ea9c6; --line:#2b3453; --accent:#a9c0ff; --chip:#242e4f; --shadow:rgba(0,0,0,.45); color-scheme:dark}
body{margin:0;background:var(--bg);color:var(--ink);font-family:var(--rounded);font-size:16px;line-height:1.45;-webkit-font-smoothing:antialiased}
.sb{box-sizing:border-box;max-width:1260px;margin:0 auto;padding-block:36px 64px;
  padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px));
  display:flex;flex-direction:column;gap:56px}
.sb *{box-sizing:border-box}
.sb-top{display:flex;flex-direction:column;gap:8px;max-width:62ch}
.sb-eyebrow{margin:0;font-size:13px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--accent)}
.sb h1{margin:0;font-size:clamp(26px,4.2vw,38px);line-height:1.12;font-weight:800;letter-spacing:-.01em;text-wrap:balance}
.sb-lede{margin:0;color:var(--muted);font-size:17px}
.sb-concept{display:flex;flex-direction:column;gap:20px;min-width:0}
.sb-head{display:flex;flex-direction:column;gap:6px;padding-top:20px;border-top:1px solid var(--line)}
.sb-kicker{margin:0;display:flex;flex-wrap:wrap;gap:6px 14px;align-items:baseline;font-size:13px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--muted)}
.sb-kicker b{color:var(--accent);font-weight:700}
.sb h2{margin:0;font-size:clamp(22px,3vw,28px);line-height:1.15;font-weight:800;text-wrap:balance}
.sb-idea{margin:0;max-width:62ch;color:var(--ink);font-size:17px}
.sb-strip{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:22px}
.sb-shot{display:flex;flex-direction:column;gap:12px;min-width:0}
.sb-frame{aspect-ratio:390/844;max-width:100%;border-radius:9.5%/4.4%;overflow:hidden;background:var(--surface);
  box-shadow:0 0 0 1px var(--line),0 14px 30px -14px var(--shadow)}
.sb-frame svg{display:block;width:100%;height:100%}
.sb-cap{margin:0;display:flex;flex-direction:column;gap:6px;align-items:flex-start;font-size:15px;color:var(--muted)}
.sb-t{font-weight:700;font-size:13px;color:var(--accent);background:var(--chip);border-radius:999px;padding:3px 10px;font-variant-numeric:tabular-nums}
.sb-note{margin:0;max-width:62ch;color:var(--muted);font-size:15px}
.sb-hint{display:none;margin:0;color:var(--muted);font-size:13px}
@media (max-width:860px){
  .sb{gap:44px;padding-block:24px 48px}
  .sb-strip{display:flex;gap:14px;overflow-x:auto;scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch;
    margin-left:calc(var(--gl) * -1);margin-right:calc(var(--gr) * -1);padding:2px var(--gr) 14px var(--gl);
    scroll-padding-left:var(--gl);scroll-padding-right:var(--gr)}
  .sb-shot{flex:0 0 min(74%,300px);scroll-snap-align:start}
  .sb-hint{display:block}
}
`;

const section = c => `<section class="sb-concept" aria-labelledby="sb-${c.id}">
<div class="sb-head">
<p class="sb-kicker"><b>Konzept ${c.n}</b><span>Dauer ${c.dur}</span></p>
<h2 id="sb-${c.id}">${c.title}</h2>
<p class="sb-idea">${c.idea}</p>
<p class="sb-hint">Fünf Bilder, seitlich wischen.</p>
</div>
<ol class="sb-strip">
${c.shots.map(([t, s], k) => `<li class="sb-shot"><div class="sb-frame" id="${c.id}-${k+1}">${c.draw(k+1)}</div><p class="sb-cap"><span class="sb-t">${t}</span><span>${s}</span></p></li>`).join("\n")}
</ol>
</section>`;

const html = `<title>MEjority Intro Storyboards</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&amp;display=swap">
<style>${css}</style>
<main class="sb">
<header class="sb-top">
<p class="sb-eyebrow">MEjority · App-Intro</p>
<h1>Zwei Storyboards für das Intro</h1>
<p class="sb-lede">Je fünf Standbilder erzählen eine ruhige Animation von gut sechs Sekunden. Beide beginnen mit einem Einzelnen und enden auf der Wortmarke des heutigen Intros.</p>
</header>
${CONCEPTS.map(section).join("\n")}
<p class="sb-note">Nach dem fünften Bild läuft in beiden Konzepten der bestehende Übergang weiter: Die Wolken teilen sich, die Wortmarke hebt sich leicht, das Intro blendet in die App über.</p>
</main>
`;

const out = join(dirname(fileURLToPath(import.meta.url)), "index.html");
writeFileSync(out, html);
console.log("wrote", out, (html.length/1024).toFixed(1) + " KB");
