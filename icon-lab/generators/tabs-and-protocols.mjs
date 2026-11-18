// Generator for designer A's eight icon modules (scratch tool; the modules it writes are plain literals).
import { writeFileSync } from "node:fs";
const OUT = new URL("../icons/", import.meta.url).pathname;

/* ---------- palette: the area variables at the top of lib/studio.css ---------- */
const PAL = {
  protocols: { tile:"#C4CAF7", hi:"#E3E6FD", lo:"#A3ABEF", ink:"#383D9C", fill:"#6B73DD", tint:"#EDEFFE", data:"#959CEB",
               w1:"#F2F1FB", w2:"#C4C8EE", c0:"#A2A8F0", c2:"#4C53C0" },
  checkins:  { tile:"#B4E2C5", hi:"#DAF3E3", lo:"#8ECFA9", ink:"#1B5C40", fill:"#3E9F6D", tint:"#E7F6EC", data:"#7FC49D",
               w1:"#F0F7F2", w2:"#BBDBC7", c0:"#86CDA6", c2:"#2C8056" },
};
const hex = h => [1,3,5].map(i => parseInt(h.slice(i,i+2),16));
const mix = (a,b,t) => "#" + hex(a).map((v,i)=>Math.round(v+(hex(b)[i]-v)*t).toString(16).padStart(2,"0")).join("").toUpperCase();

/* ---------- shared pieces ---------- */
const svgTile = (defs, body) => `<svg viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg">${defs?`<defs>${defs}</defs>`:""}${body}</svg>`;
const svgTab  = body => `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
const stops = s => s.map(([o,c,a])=>`<stop offset="${o}" stop-color="${c}"${a!=null?` stop-opacity="${a}"`:""}/>`).join("");
const FR = `filterUnits="userSpaceOnUse" x="0" y="0" width="96" height="96" color-interpolation-filters="sRGB"`;

// A · Clay
const bgA   = (p,c) => `<linearGradient id="${p}bg" x1="0" y1="0" x2="1" y2="1">${stops([[0,mix(c.tile,c.hi,.45)],[.5,c.tile],[1,mix(c.tile,c.lo,.45)]])}</linearGradient>`;
const rectA = p => `<rect width="96" height="96" rx="22" fill="url(#${p}bg)"/>`;
const gW = (p,c,n="w") => `<radialGradient id="${p}${n}" cx=".3" cy=".22" r="1.05">${stops([[0,"#FFFFFF"],[.5,c.w1],[1,c.w2]])}</radialGradient>`;
const gC = (p,c,n="c") => `<radialGradient id="${p}${n}" cx=".3" cy=".2" r="1.05">${stops([[0,c.c0],[.5,c.fill],[1,c.c2]])}</radialGradient>`;
// same two, pinned in tile space for rotated parts (gt undoes the part's rotation so the light stays upper left)
const uW = (p,c,n,cx,cy,r,gt) => `<radialGradient id="${p}${n}" gradientUnits="userSpaceOnUse" cx="${cx}" cy="${cy}" r="${r}"${gt?` gradientTransform="${gt}"`:""}>${stops([[0,"#FFFFFF"],[.5,c.w1],[1,c.w2]])}</radialGradient>`;
const uC = (p,c,n,cx,cy,r,gt) => `<radialGradient id="${p}${n}" gradientUnits="userSpaceOnUse" cx="${cx}" cy="${cy}" r="${r}"${gt?` gradientTransform="${gt}"`:""}>${stops([[0,c.c0],[.5,c.fill],[1,c.c2]])}</radialGradient>`;
// puff: a soft shade along the lower right rim and a light along the upper left rim (rounded volume)
const fPuff = (p,c,n="puff",{b=2.1,dx=1.9,dy=2.5,so=.36,lo=.7}={}) => `<filter id="${p}${n}" ${FR}><feGaussianBlur in="SourceAlpha" stdDeviation="${b}" result="a"/><feOffset in="a" dx="${-dx}" dy="${-dy}" result="s"/><feComposite in="SourceAlpha" in2="s" operator="out" result="sr"/><feFlood flood-color="${c.ink}" flood-opacity="${so}"/><feComposite in2="sr" operator="in" result="shade"/><feOffset in="a" dx="${dx}" dy="${dy}" result="l"/><feComposite in="SourceAlpha" in2="l" operator="out" result="lr"/><feFlood flood-color="#FFFFFF" flood-opacity="${lo}"/><feComposite in2="lr" operator="in" result="lite"/><feMerge><feMergeNode in="SourceGraphic"/><feMergeNode in="shade"/><feMergeNode in="lite"/></feMerge></filter>`;
// drop: the soft shadow an object throws on the tile, to the lower right
const fDrop = (p,c,n="drop",{b=2.6,dx=1.6,dy=3.8,o=.3}={}) => `<filter id="${p}${n}" ${FR}><feGaussianBlur in="SourceAlpha" stdDeviation="${b}"/><feOffset dx="${dx}" dy="${dy}" result="o"/><feFlood flood-color="${c.ink}" flood-opacity="${o}"/><feComposite in2="o" operator="in"/><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>`;
// B · Soft flat
const rectF = c => `<rect width="96" height="96" rx="22" fill="${c.tile}"/>`;
const fSoft = (p,c) => fDrop(p,c,"sh",{b:1.8,dx:0,dy:2,o:.2});

/* =====================================================================================================
   TILES
   ===================================================================================================== */

/* ---------- protocol-pill: a round tablet seen face-on, a score across; E a two-part capsule ---------- */
function protocolPill(){
  const id="protocol-pill", c=PAL.protocols, P=k=>`${id}-${k}-`;
  let p=P("A");
  const A = svgTile(
    bgA(p,c)+gW(p,c)+fPuff(p,c)+fDrop(p,c)+
    `<linearGradient id="${p}side" x1="0" y1="0" x2="1" y2="1">${stops([[0,"#E4E5F6"],[1,"#A4AAE0"]])}</linearGradient>`+
    `<linearGradient id="${p}dish" x1=".15" y1=".1" x2=".85" y2=".9">${stops([[0,c.data,.3],[.55,c.data,.06],[1,"#FFFFFF",.0]])}</linearGradient>`,
    rectA(p)+
    `<g filter="url(#${p}drop)"><g filter="url(#${p}puff)"><circle cx="48" cy="52.5" r="25.5" fill="url(#${p}side)"/><circle cx="48" cy="45.5" r="25.5" fill="url(#${p}w)"/></g></g>`+
    `<circle cx="48" cy="45.5" r="19" fill="url(#${p}dish)"/>`+
    `<g transform="rotate(-16 48 45.5)"><rect x="29" y="42.8" width="38" height="4.8" rx="2.4" fill="${mix(c.data,"#FFFFFF",.12)}"/><rect x="30" y="46.6" width="36" height="1.7" rx=".85" fill="#FFFFFF"/></g>`);
  p=P("B");
  const B = svgTile(fSoft(p,c),
    rectF(c)+`<circle cx="48" cy="48" r="25" fill="#FFFFFF" filter="url(#${p}sh)"/>`+
    `<path d="M33.5 52.2 62.5 43.8" fill="none" stroke="${c.data}" stroke-width="4.6" stroke-linecap="round"/>`);
  const C = svgTile("",
    rectF(c)+`<g transform="rotate(-16 48 48)"><path d="M22.5 45.6a25.5 25.5 0 0 1 51 0z" fill="${c.fill}"/><path d="M22.5 50.4a25.5 25.5 0 0 0 51 0z" fill="${c.ink}"/></g>`);
  const D = svgTile("",
    rectF(c)+`<g fill="none" stroke="${c.ink}" stroke-width="4.6" stroke-linecap="round"><circle cx="48" cy="48" r="24"/><path d="M37.5 51 58.5 45"/></g>`);
  p=P("E");
  const E = svgTile(
    bgA(p,c)+fPuff(p,c)+fDrop(p,c)+
    uC(p,c,"c",31,49,27,"rotate(40 48 48)")+uW(p,c,"w",52,31,30,"rotate(40 48 48)"),
    rectA(p)+
    `<g filter="url(#${p}drop)"><g filter="url(#${p}puff)"><g transform="rotate(-40 48 48)"><path d="M48 33H30.5a15 15 0 0 0 0 30H48z" fill="url(#${p}c)"/><path d="M48 33h17.500a15 15 0 0 1 0 30H48z" fill="url(#${p}w)"/></g></g></g>`+
    `<g transform="rotate(-40 48 48)" fill="none" stroke-linecap="round"><path d="M48 34.5v27" stroke="${c.ink}" stroke-opacity=".16" stroke-width="1.6"/><path d="M28.5 39.6h12.500" stroke="#FFFFFF" stroke-opacity=".5" stroke-width="3.2"/></g>`);
  return { id, order:5, kind:"tile", title:"Protocol item", meaning:"A substance taken on schedule: capsule or tablet.", area:"protocols",
    ref:"refs/protocol-pill.png", refNote:"White tablet on a periwinkle tile",
    variants:[
      { key:"A", name:"Clay",       svg:A, note:"A thick round tablet seen from the front, dished face, one soft score groove." },
      { key:"B", name:"Soft flat",  svg:B, note:"White disc, the score as one periwinkle stroke." },
      { key:"C", name:"Duotone",    svg:C, note:"The score splits the tablet into a mid and a deep half." },
      { key:"D", name:"Line",       svg:D, note:"Ring and score, one stroke weight." },
      { key:"E", name:"Capsule",    svg:E, note:"Another motif, in clay: the two-part capsule our tab bar already uses." },
    ] };
}

/* ---------- protocol-injection: a short, chunky syringe along the falling diagonal; E a vial ---------- */
function protocolInjection(){
  const id="protocol-injection", c=PAL.protocols, P=k=>`${id}-${k}-`;
  const R = `transform="rotate(45 48 48) translate(3.930 3.840) scale(.92)"`;
  const needleCol = mix(c.ink,c.tile,.3);
  // the syringe lies along x in its own space; the light (upper left on the tile) arrives from its plunger end
  const lW = (p,n) => `<radialGradient id="${p}${n}" cx=".14" cy=".3" r="1.1">${stops([[0,"#FFFFFF"],[.5,c.w1],[1,c.w2]])}</radialGradient>`;
  const lC = (p,n) => `<radialGradient id="${p}${n}" cx=".14" cy=".3" r="1.1">${stops([[0,c.c0],[.5,c.fill],[1,c.c2]])}</radialGradient>`;
  const G = { rod:`x="20" y="44.500" width="12" height="7" rx="2"`, hub:`x="63" y="42.500" width="9" height="11" rx="3.500"`,
              barrel:`x="33" y="35.500" width="33" height="25" rx="8.500"`, flange:`x="29" y="30" width="7.500" height="36" rx="3.750"`,
              thumb:`x="13" y="35" width="8" height="26" rx="4"`, liquid:`x="45" y="40.500" width="17" height="15" rx="5"` };
  const needle = (col,w) => `<path d="M70 48h13.500" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round"/>`;
  let p=P("A");
  const part = inner => `<g filter="url(#${p}puff)"><g ${R}>${inner}</g></g>`;
  const A = svgTile(
    bgA(p,c)+fPuff(p,c,"puff",{b:1.6,dx:1.4,dy:1.9,so:.36,lo:.7})+fDrop(p,c,"drop",{b:2.5,dx:1.6,dy:3.8,o:.32})+lW(p,"w")+lC(p,"c")+
    `<linearGradient id="${p}liq" x1="0" y1="0" x2="1" y2="0">${stops([[0,c.c0],[1,c.fill]])}</linearGradient>`,
    rectA(p)+
    `<g filter="url(#${p}drop)">`+
      `<g ${R}>${needle(needleCol,3.600)}</g>`+
      part(`<rect ${G.rod} fill="${c.data}"/>`)+
      part(`<rect ${G.hub} fill="url(#${p}c)"/>`)+
      part(`<rect ${G.barrel} fill="url(#${p}w)"/>`)+
      part(`<rect ${G.flange} fill="url(#${p}w)"/>`)+
      part(`<rect ${G.thumb} fill="url(#${p}c)"/>`)+
    `</g>`+
    `<g ${R}><rect ${G.liquid} fill="url(#${p}liq)"/><rect x="47.500" y="42.800" width="8" height="2.400" rx="1.200" fill="#FFFFFF" fill-opacity=".45"/></g>`);
  p=P("B");
  const B = svgTile(fSoft(p,c),
    rectF(c)+`<g filter="url(#${p}sh)"><g ${R}>`+needle("#FFFFFF",3.800)+
      `<rect ${G.rod} fill="${c.data}"/><rect ${G.hub} fill="#FFFFFF"/><rect ${G.barrel} fill="#FFFFFF"/><rect ${G.flange} fill="#FFFFFF"/><rect ${G.thumb} fill="#FFFFFF"/>`+
    `</g></g><g ${R}><rect ${G.liquid} fill="${c.data}"/></g>`);
  const C = svgTile("",
    rectF(c)+`<g ${R}>`+needle(c.ink,3.800)+
      `<rect ${G.rod} fill="${c.ink}"/><rect ${G.hub} fill="${c.fill}"/><rect ${G.barrel} fill="${c.fill}"/><rect ${G.flange} fill="${c.fill}"/><rect ${G.thumb} fill="${c.ink}"/><rect ${G.liquid} fill="${c.ink}"/>`+
    `</g>`);
  const D = svgTile("",
    rectF(c)+`<g ${R} fill="none" stroke="${c.ink}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">`+
      `<rect x="34" y="36.500" width="31" height="23" rx="7.500"/><path d="M34 30.500v35M16 48h18M16 37.500v21M65 48h18.500M46.500 44.300v7.400"/>`+
    `</g>`);
  p=P("E");
  const E = svgTile(
    bgA(p,c)+gW(p,c)+gC(p,c)+fPuff(p,c)+fDrop(p,c)+
    `<linearGradient id="${p}liq" x1="0" y1="0" x2="1" y2="1">${stops([[0,c.c0],[1,c.fill]])}</linearGradient>`+
    `<linearGradient id="${p}neck" x1="0" y1="0" x2="1" y2="0">${stops([[0,"#F2F2FB"],[1,"#C9CCEC"]])}</linearGradient>`,
    rectA(p)+
    `<g transform="rotate(8 48 48)"><g filter="url(#${p}drop)">`+
      `<rect x="40.500" y="26" width="15" height="13" fill="url(#${p}neck)"/>`+
      `<g filter="url(#${p}puff)"><rect x="30" y="35.500" width="36" height="41" rx="10.500" fill="url(#${p}w)"/></g>`+
      `<g filter="url(#${p}puff)"><rect x="35" y="16.500" width="26" height="13.500" rx="5" fill="url(#${p}c)"/></g>`+
    `</g>`+
    `<path d="M35 55h26v10.500a6 6 0 0 1-6 6H41a6 6 0 0 1-6-6z" fill="url(#${p}liq)"/><rect x="38" y="57.800" width="11" height="2.200" rx="1.100" fill="#FFFFFF" fill-opacity=".45"/></g>`);
  return { id, order:6, kind:"tile", title:"Injection", meaning:"A substance given by injection.", area:"protocols",
    ref:"refs/protocol-injection.png", refNote:"White syringe with a lilac plunger on a green tile",
    variants:[
      { key:"A", name:"Clay",      svg:A, note:"A short, chunky syringe: white barrel with a window of periwinkle liquid, coloured thumb pad, needle down to the right." },
      { key:"B", name:"Soft flat", svg:B, note:"The same syringe in flat white, liquid window and plunger rod in the accent." },
      { key:"C", name:"Duotone",   svg:C, note:"Barrel in the mid tone; liquid, plunger and needle in the deep tone." },
      { key:"D", name:"Line",      svg:D, note:"Barrel, flange, plunger and needle as strokes of one weight." },
      { key:"E", name:"Vial",      svg:E, note:"Another motif, in clay: the small vial the dose is drawn from." },
    ] };
}

/* ---------- checkin-chat: one roomy bubble, three beads; E the bubble speaks (voice bars) ---------- */
function checkinChat(){
  const id="checkin-chat", c=PAL.checkins, P=k=>`${id}-${k}-`;
  const BUB = "M37 22h22a17 17 0 0 1 17 17v8a17 17 0 0 1-17 17H46.500L35 74.600c-1.900 1.700-4 .800-4-1.700V62.900A17 17 0 0 1 20 47v-8a17 17 0 0 1 17-17z";
  const dots = (fill,r=4.400,extra="") => [35.500,48,60.500].map(x=>`<circle cx="${x}" cy="43" r="${r}" fill="${fill}"${extra}/>`).join("");
  const bars = fill => [[32.200,9.500],[41.300,22],[50.400,14],[59.500,8]].map(([x,h])=>`<rect x="${x}" y="${43-h/2}" width="5.800" height="${h}" rx="2.900" fill="${fill}"/>`).join("");
  let p=P("A");
  const A = svgTile(bgA(p,c)+gW(p,c)+gC(p,c)+fPuff(p,c)+fDrop(p,c)+fPuff(p,c,"bead",{b:.9,dx:.7,dy:.9,so:.35,lo:.55}),
    rectA(p)+`<g filter="url(#${p}drop)"><path d="${BUB}" fill="url(#${p}w)" filter="url(#${p}puff)"/></g>`+
    `<g filter="url(#${p}bead)">${dots(`url(#${p}c)`)}</g>`);
  p=P("B");
  const B = svgTile(fSoft(p,c), rectF(c)+`<path d="${BUB}" fill="#FFFFFF" filter="url(#${p}sh)"/>`+dots(c.data));
  const C = svgTile("", rectF(c)+`<path d="${BUB}" fill="${c.fill}"/>`+dots(c.ink));
  const D = svgTile("", rectF(c)+`<path d="M37 23.500h22A15.500 15.500 0 0 1 74.500 39v8A15.500 15.500 0 0 1 59 62.500H46.200L32.500 74.500V61.800A15.500 15.500 0 0 1 21.500 47v-8A15.500 15.500 0 0 1 37 23.500z" fill="none" stroke="${c.ink}" stroke-width="4.600" stroke-linejoin="round"/>`+dots(c.ink,3));
  p=P("E");
  const E = svgTile(bgA(p,c)+gW(p,c)+gC(p,c)+fPuff(p,c)+fDrop(p,c)+fPuff(p,c,"bead",{b:.9,dx:.7,dy:.9,so:.35,lo:.55}),
    rectA(p)+`<g filter="url(#${p}drop)"><path d="${BUB}" fill="url(#${p}w)" filter="url(#${p}puff)"/></g>`+
    `<g filter="url(#${p}bead)">${bars(`url(#${p}c)`)}</g>`);
  return { id, order:7, kind:"tile", title:"Check-in by chat", meaning:"A check-in held as a conversation with the agent.", area:"checkins",
    ref:"refs/checkin-chat.png", refNote:"Two overlapping speech bubbles on an apricot tile",
    variants:[
      { key:"A", name:"Clay",      svg:A, note:"One roomy, soft-cornered bubble with three mint beads: someone is listening." },
      { key:"B", name:"Soft flat", svg:B, note:"White bubble, the three dots in the accent." },
      { key:"C", name:"Duotone",   svg:C, note:"Mid-green bubble, deep-green dots." },
      { key:"D", name:"Line",      svg:D, note:"Bubble outline and three dots." },
      { key:"E", name:"Voice",     svg:E, note:"Another motif, in clay: the bubble carries a small voice wave, for a check-in that is spoken." },
    ] };
}

/* ---------- log-scores: a clipboard whose rows are small score tracks; E one big slider ---------- */
function logScores(){
  const id="log-scores", c=PAL.checkins, P=k=>`${id}-${k}-`;
  const ROWS = [[42.500,19],[53.500,10.500],[64.500,15]];
  const rows = (track,fill) => ROWS.map(([y,w])=>(track?`<rect x="34.500" y="${y-2.900}" width="27" height="5.800" rx="2.900" fill="${track}"/>`:"")+`<rect x="34.500" y="${y-2.900}" width="${w}" height="5.800" rx="2.900" fill="${fill}"/>`).join("");
  let p=P("A");
  const A = svgTile(bgA(p,c)+gW(p,c)+gC(p,c)+fPuff(p,c)+fDrop(p,c)+fPuff(p,c,"clip",{b:1.300,dx:1.100,dy:1.500,so:.34,lo:.65})+fDrop(p,c,"cdrop",{b:1.400,dx:.800,dy:1.800,o:.26}),
    rectA(p)+`<g filter="url(#${p}drop)"><rect x="26" y="24.500" width="44" height="53.500" rx="10.500" fill="url(#${p}w)" filter="url(#${p}puff)"/></g>`+
    `<g filter="url(#${p}cdrop)"><rect x="37" y="17.500" width="22" height="13.500" rx="5.800" fill="url(#${p}c)" filter="url(#${p}clip)"/></g>`+
    rows(mix(c.tile,"#FFFFFF",.35), c.fill));
  p=P("B");
  const B = svgTile(fSoft(p,c),
    rectF(c)+`<rect x="26" y="24.500" width="44" height="53.500" rx="10.500" fill="#FFFFFF" filter="url(#${p}sh)"/>`+
    `<rect x="37" y="17.500" width="22" height="13.500" rx="5.800" fill="${c.data}"/>`+rows(c.tint, c.data));
  const C = svgTile("",
    rectF(c)+`<rect x="26" y="24.500" width="44" height="53.500" rx="10.500" fill="${c.fill}"/>`+
    `<rect x="36" y="16.500" width="24" height="15.500" rx="6.800" fill="${c.tile}"/><rect x="38" y="18.500" width="20" height="11.500" rx="4.800" fill="${c.ink}"/>`+rows("", c.ink));
  const D = svgTile("",
    rectF(c)+`<g fill="none" stroke="${c.ink}" stroke-width="4.600" stroke-linecap="round" stroke-linejoin="round">`+
    `<path d="M37.500 25.500H36a8.500 8.500 0 0 0-8.500 8.500v33.500A8.500 8.500 0 0 0 36 76h24a8.500 8.500 0 0 0 8.500-8.500V34A8.500 8.500 0 0 0 60 25.500h-1.500"/>`+
    `<rect x="39.500" y="19.500" width="17" height="10.500" rx="4.500"/><path d="M37.500 44.500h21M37.500 54.500h11M37.500 64.500h16"/></g>`);
  p=P("E");
  const E = svgTile(bgA(p,c)+gW(p,c)+fPuff(p,c)+fDrop(p,c)+
    `<linearGradient id="${p}groove" x1="0" y1="0" x2="0" y2="1">${stops([[0,mix(c.lo,c.ink,.16)],[1,mix(c.lo,c.tile,.35)]])}</linearGradient>`+
    `<linearGradient id="${p}fill" x1="0" y1="0" x2="0" y2="1">${stops([[0,c.c0],[.55,c.fill],[1,c.c2]])}</linearGradient>`,
    rectA(p)+
    `<rect x="13" y="39" width="70" height="20" rx="10" fill="#FFFFFF" fill-opacity=".45"/><rect x="13" y="38" width="70" height="20" rx="10" fill="url(#${p}groove)"/>`+
    `<path d="M23 38h32v20H23a10 10 0 0 1 0-20z" fill="url(#${p}fill)"/>`+
    `<path d="M23.500 42.600h17" fill="none" stroke="#FFFFFF" stroke-opacity=".4" stroke-width="2.600" stroke-linecap="round"/>`+
    `<g filter="url(#${p}drop)"><circle cx="55" cy="48" r="17" fill="url(#${p}w)" filter="url(#${p}puff)"/></g>`);
  return { id, order:8, kind:"tile", title:"Log scores", meaning:"Entering today's symptom scores by hand.", area:"checkins",
    ref:"refs/log-scores.png", refNote:"Blank clipboard with a pink clip on a blue tile",
    variants:[
      { key:"A", name:"Clay",      svg:A, note:"A soft board with a mint clip; its rows are three small score tracks filled to different lengths." },
      { key:"B", name:"Soft flat", svg:B, note:"White board, clip and score tracks in the accent." },
      { key:"C", name:"Duotone",   svg:C, note:"Mid-green board, clip and three score bars in the deep tone." },
      { key:"D", name:"Line",      svg:D, note:"Board, clip and three rows of different length." },
      { key:"E", name:"Slider",    svg:E, note:"Another motif, in clay: the gesture itself, one plump slider with its knob part-way." },
    ] };
}

/* =====================================================================================================
   TAB GLYPHS (48 grid, currentColor)
   ===================================================================================================== */
const F = `fill="currentColor" stroke="none"`;

function tabToday(){
  const id="tab-today";
  const A = svgTab(`<path d="M6.800 22.600 24 8.400l17.200 14.200" stroke-width="5.600"/><path d="M24 17.400 35.400 26.800V37a4 4 0 0 1-4 4H16.600a4 4 0 0 1-4-4V26.800z" fill="currentColor" stroke-width="2"/>`);
  const B = svgTab(`<path ${F} fill-rule="evenodd" d="M21.400 8.900a4 4 0 0 1 5.200 0L39.600 20a4 4 0 0 1 1.400 3v14a5 5 0 0 1-5 5H12a5 5 0 0 1-5-5V23a4 4 0 0 1 1.400-3zM19.800 42v-8.300a4.200 4.200 0 0 1 8.400 0V42z"/>`);
  const C = svgTab(`<path d="M9 22.400 24 9.800l15 12.600V36a4.600 4.600 0 0 1-4.600 4.600H13.600A4.600 4.600 0 0 1 9 36z" stroke-width="4.200" fill="currentColor" fill-opacity=".18"/><path d="M20 40.400v-7.200a4 4 0 0 1 8 0v7.200" stroke-width="2.800"/>`);
  const D = svgTab(`<g stroke-width="3.600"><path d="M6.500 22.800 24 8.600l17.500 14.200"/><path d="M11.800 19.800v16.800a4.200 4.200 0 0 0 4.200 4.200h16a4.200 4.200 0 0 0 4.200-4.200V19.800"/><path d="M20.200 40.600v-6.200a3.800 3.800 0 0 1 7.600 0v6.200"/></g>`);
  const E = svgTab(`<circle cx="24" cy="24" r="8.800" ${F}/><path d="M24 5.200v3.800M24 39v3.800M5.200 24H9M39 24h3.800M10.700 10.700l2.700 2.700M34.600 34.600l2.700 2.700M10.700 37.300l2.700-2.700M34.600 13.400l2.700-2.700" stroke-width="4.400"/>`);
  return { id, order:1, kind:"tab", title:"Today tab", meaning:"The start page: what today holds.", area:"today",
    ref:"refs/tab-today.png", refNote:"Solid house with a door and chimney, tab bar",
    variants:[
      { key:"A", name:"Plump",     svg:A, note:"A solid little house under a thick roof that floats a hair above it." },
      { key:"B", name:"Cut-out",   svg:B, note:"One solid house shape, the arched door cut out of it." },
      { key:"C", name:"Two weights", svg:C, note:"Heavy outline with a soft tint, the door in a lighter stroke (today's Cozy glyph, refined)." },
      { key:"D", name:"Line",      svg:D, note:"Roof, walls and door as three strokes of one weight." },
      { key:"E", name:"Sun",       svg:E, note:"Another motif: today as the day itself, a plump sun." },
    ] };
}

function tabCheckins(){
  const id="tab-checkins";
  const WAVE = "M5 27.700h7.500c4.400 0 4-16.500 8-16.500 4.600 0 4.400 25.500 8.600 25.500 3.200 0 3-9 6.600-9H43";
  const HEART = "M24 41.500S5.500 31.500 5.500 18.600C5.500 12.600 10.200 8 16 8c3.200 0 6.100 1.500 8 3.900C25.900 9.500 28.800 8 32 8c5.800 0 10.500 4.600 10.500 10.600C42.500 31.500 24 41.500 24 41.500z";
  const A = svgTab(`<path d="M7 27.700h6c4.400 0 3.800-16.500 7.800-16.500 4.600 0 4.200 25.500 8.400 25.500 3.200 0 2.800-9 6.400-9H41" stroke-width="6.400"/>`);
  const B = svgTab(`<mask id="${id}-B-m" maskUnits="userSpaceOnUse" x="0" y="0" width="48" height="48"><rect width="48" height="48" fill="#fff" stroke="none"/><path d="M12.500 22.800h4.200c3 0 2.600-7.600 5.200-7.600 3.200 0 2.800 13.400 5.800 13.400 2.400 0 2.100-5.800 4.800-5.800h3" stroke="#000" stroke-width="3.800"/></mask><path d="${HEART}" fill="currentColor" stroke-width="1.600" mask="url(#${id}-B-m)"/>`);
  const C = svgTab(`<path d="M24 39.800S7.500 30.600 7.500 18.900c0-5.300 4.100-9.300 9.100-9.300 3 0 5.700 1.500 7.400 3.800 1.700-2.300 4.400-3.800 7.400-3.800 5 0 9.100 4 9.100 9.300C40.500 30.600 24 39.800 24 39.800z" stroke-width="4.200" fill="currentColor" fill-opacity=".18"/><path d="M14.500 22.600h3.300c2.400 0 2.100-6 4.200-6 2.600 0 2.300 10.800 4.700 10.800 2 0 1.700-4.800 3.900-4.800h2.900" stroke-width="2.800"/>`);
  const D = svgTab(`<path d="${WAVE}" stroke-width="3.600"/>`);
  const E = svgTab(`<mask id="${id}-E-m" maskUnits="userSpaceOnUse" x="0" y="0" width="48" height="48"><rect width="48" height="48" fill="#fff" stroke="none"/><path d="M15.800 22.600l5.800 5.800 10.800-11.400" stroke="#000" stroke-width="4.200"/></mask><path d="${HEART}" fill="currentColor" stroke-width="1.600" mask="url(#${id}-E-m)"/>`);
  return { id, order:2, kind:"tab", title:"Check-ins tab", meaning:"How you are doing: symptom check-ins and scores.", area:"checkins",
    ref:"refs/tab-checkins.png", refNote:"Angular pulse line, tab bar",
    variants:[
      { key:"A", name:"Plump",     svg:A, note:"One calm beat as a fat, rounded wave: no sharp corners." },
      { key:"B", name:"Cut-out",   svg:B, note:"A full heart with the soft beat cut out of it." },
      { key:"C", name:"Two weights", svg:C, note:"Heart in a heavy outline with a soft tint, the beat inside in a lighter stroke (today's Cozy glyph, refined)." },
      { key:"D", name:"Line",      svg:D, note:"The same calm beat as one thin stroke." },
      { key:"E", name:"Heart check", svg:E, note:"Another motif: checking in, literally: a heart with a tick." },
    ] };
}

function tabProtocols(){
  const id="tab-protocols";
  const A = svgTab(`<g transform="rotate(-45 24 24)" ${F}><path d="M22.400 14H13a10 10 0 0 0 0 20h9.400z"/><path d="M25.600 14H35a10 10 0 0 1 0 20h-9.400z"/></g>`);
  const B = svgTab(`<g transform="rotate(-45 24 24)"><path ${F} fill-rule="evenodd" d="M13 14h22a10 10 0 0 1 0 20H13a10 10 0 0 1 0-20zM27.800 18.400a1.200 1.200 0 0 0-1.200 1.200v8.800a1.200 1.200 0 0 0 1.200 1.200H35a5.600 5.600 0 0 0 0-11.200z"/></g>`);
  const C = svgTab(`<g transform="rotate(-45 24 24)"><path d="M24 15H14a9 9 0 0 0 0 18h10z" fill="currentColor" fill-opacity=".24" stroke="none"/><rect x="5" y="15" width="38" height="18" rx="9" stroke-width="4.200"/><path d="M24 16v16" stroke-width="2.800"/></g>`);
  const D = svgTab(`<g transform="rotate(-45 24 24)" stroke-width="3.600"><rect x="5.500" y="15.500" width="37" height="17" rx="8.500"/><path d="M24 15.500v17"/></g>`);
  const E = svgTab(`<rect x="13.500" y="5" width="21" height="9.500" rx="3.400" ${F}/><path ${F} fill-rule="evenodd" d="M15.500 17.500h17a5.500 5.500 0 0 1 5.500 5.500v14.500a5.500 5.500 0 0 1-5.500 5.500h-17a5.500 5.500 0 0 1-5.500-5.500V23a5.500 5.500 0 0 1 5.500-5.500zM18.200 26.800a3.200 3.200 0 0 0 0 6.400h11.600a3.200 3.200 0 0 0 0-6.400z"/>`);
  return { id, order:3, kind:"tab", title:"Protocols tab", meaning:"What you take and when: substances, doses, plans.", area:"protocols",
    ref:"refs/tab-protocols.png", refNote:"Capsule beside a half tablet, tab bar",
    variants:[
      { key:"A", name:"Plump",     svg:A, note:"One fat capsule on the rising diagonal, its two halves parted by a slit." },
      { key:"B", name:"Cut-out",   svg:B, note:"Solid capsule, one half hollowed out: filled and empty half." },
      { key:"C", name:"Two weights", svg:C, note:"Heavy outline, lighter seam, one half softly tinted (today's Cozy glyph, refined)." },
      { key:"D", name:"Line",      svg:D, note:"Capsule outline and seam, one stroke weight." },
      { key:"E", name:"Bottle",    svg:E, note:"Another motif: the supply rather than the single dose, a small bottle with its label." },
    ] };
}

function tabInsights(){
  const id="tab-insights";
  const bar = (x,y,o) => `<rect x="${x}" y="${y}" width="10" height="${42-y}" rx="4.600"${o?` fill-opacity="${o}"`:""}/>`;
  const A = svgTab(`<g ${F}>${bar(5.500,27)}${bar(19,17.500)}${bar(32.500,7)}</g>`);
  const hole = (x,y) => `M${x} ${y}a2.700 2.700 0 0 1 2.700 2.700v${Math.round((29.2-y)*10)/10}a2.700 2.700 0 0 1-5.400 0v-${Math.round((29.2-y)*10)/10}a2.700 2.700 0 0 1 2.700-2.700z`;
  const B = svgTab(`<path ${F} fill-rule="evenodd" d="M15.500 5h17A10.500 10.500 0 0 1 43 15.500v17A10.500 10.500 0 0 1 32.500 43h-17A10.500 10.500 0 0 1 5 32.500v-17A10.500 10.500 0 0 1 15.500 5z${hole(15,25)}${hole(24,18.500)}${hole(33,12)}"/>`);
  const C = svgTab(`<g ${F}>${bar(5.500,27,.34)}${bar(19,17.500,.34)}${bar(32.500,7)}</g>`);
  const D = svgTab(`<g stroke-width="3.600"><path d="M6 40.200h36"/><path d="M7.500 29.500l8.700-8.200 8 6.400L38.800 11.500"/></g>`);
  const E = svgTab(`<path d="M5.500 39.500c9.500 0 9-13 17-13 5.500 0 6 4.500 10.500 4.500 4 0 6.500-4.500 9.500-9.500" stroke-width="4.400"/><path d="M14 4.800q1.200 7.400 8.600 8.600-7.400 1.200-8.600 8.600-1.200-7.400-8.600-8.600 7.400-1.200 8.600-8.600z" fill="currentColor" stroke-width="1.400"/>`);
  return { id, order:4, kind:"tab", title:"Insights tab", meaning:"What the data shows over time.", area:"insights",
    ref:"refs/tab-insights.png", refNote:"Three thin bars, the trends button on Symptoms",
    variants:[
      { key:"A", name:"Plump",     svg:A, note:"Three fat, fully rounded bars stepping up." },
      { key:"B", name:"Cut-out",   svg:B, note:"A solid soft square with the three bars cut out of it." },
      { key:"C", name:"Two weights", svg:C, note:"The same bars, two of them pale and one solid: the one that stands out is the insight." },
      { key:"D", name:"Line",      svg:D, note:"The same rise as one stroke over a baseline." },
      { key:"E", name:"Finding",   svg:E, note:"Another motif: a curve with a small spark above it, a pattern found (our Cozy 'finding' sign, redrawn)." },
    ] };
}

/* ---------- write the modules ---------- */
const clean = s => s.replace(/(\d+\.\d*?)0+(?=[^\d]|$)/g, "$1").replace(/(\d)\.(?=[^\d]|$)/g, "$1").replace("www.w3org", "www.w3.org");
const esc = s => JSON.stringify(s);
for (const make of [tabToday, tabCheckins, tabProtocols, tabInsights, protocolPill, protocolInjection, checkinChat, logScores]) {
  const m = make();
  const src =
`// MEjority icon lab · ${m.id}: ${m.title}. Our own drawing; the reference only names the idea.
export default {
  id: ${esc(m.id)}, order: ${m.order}, kind: ${esc(m.kind)},
  title: ${esc(m.title)}, meaning: ${esc(m.meaning)},
  area: ${esc(m.area)},
  ref: ${esc(m.ref)}, refNote: ${esc(m.refNote)},
  variants: [
${m.variants.map(v => `    { key: ${esc(v.key)}, name: ${esc(v.name)},
      svg: \`${clean(v.svg)}\`,
      note: ${esc(v.note)} },`).join("\n")}
  ]
};
`;
  if (/`[^`]*\$\{/.test(src)) throw new Error("template leak in " + m.id);
  writeFileSync(OUT + m.id + ".mjs", src);
  console.log(m.id, m.variants.map(v => v.key + ":" + clean(v.svg).length).join(" "));
}
