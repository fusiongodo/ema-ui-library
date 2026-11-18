/* Generator for the seven "B" icon modules (wellbeing, steps, sleep, pain, guide, evaluation, calendar).
   Writes literal modules to icon-lab/icons/<id>.mjs. Run: node gen.mjs */
import fs from "node:fs";
import path from "node:path";

const OUT = new URL("../icons", import.meta.url).pathname;

/* area palettes: lib/studio.css (tile / hi / lo / ink / fill) + clay companions derived from them */
const PAL = {
  checkins:  { tile:"#B4E2C5", hi:"#DAF3E3", lo:"#8ECFA9", ink:"#1B5C40", fill:"#3E9F6D", acc:"#62B388",
               w2:"#F2F9F5", w3:"#C3DFCE", a1:"#8AD6AC", a2:"#4FAF7E", a3:"#33895D" },
  protocols: { tile:"#C4CAF7", hi:"#E3E6FD", lo:"#A3ABEF", ink:"#383D9C", fill:"#6B73DD", acc:"#8088E4",
               w2:"#F4F5FE", w3:"#C9CEF3", a1:"#A6ACF3", a2:"#747CE1", a3:"#565DC6" },
  insights:  { tile:"#EEC5E1", hi:"#F9E3F2", lo:"#DEA4CC", ink:"#782C66", fill:"#BF639D", acc:"#CC7EAF",
               w2:"#FCF3F9", w3:"#E6C6DB", a1:"#E09CC8", a2:"#C56CA4", a3:"#A54F87" },
  neutral:   { tile:"#E4DFD7", hi:"#F2EFEA", lo:"#CFC7BB", ink:"#4A453D", fill:"#7A7368", acc:"#A3927C",
               w2:"#FAF7F2", w3:"#D6CBBC", a1:"#E6CDAF", a2:"#CBAA85", a3:"#AC8B67" },
};
const CORAL = { c1:"#F8C4B8", c2:"#E99384", c3:"#D17362", flat:"#E58C7D" };

const OPEN = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96">`;
const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
const mix = (a, b, t) => "#" + hex(a).map((v, i) => Math.round(v + (hex(b)[i] - v) * t).toString(16).padStart(2, "0")).join("").toUpperCase();
const bgClay = (p, c) => `<radialGradient id="${p}bg" cx=".3" cy=".18" r="1.1"><stop offset="0" stop-color="${mix(c.hi, c.tile, .5)}"/><stop offset=".55" stop-color="${c.tile}"/><stop offset="1" stop-color="${mix(c.tile, c.lo, .75)}"/></radialGradient>`;
const bgGrad = (p, c) => `<radialGradient id="${p}bg" cx=".28" cy=".12" r="1.15"><stop offset="0" stop-color="${c.hi}"/><stop offset=".52" stop-color="${c.tile}"/><stop offset="1" stop-color="${c.lo}"/></radialGradient>`;

/* ---- A · Clay: gradient tile, white + accent volumes, inner shade (lower right) and inner light (upper left), soft shadows ---- */
function clay(p, c, body, o = {}){
  const g = o.ground ? `<ellipse cx="${o.ground[0]}" cy="${o.ground[1]}" rx="${o.ground[2]}" ry="${o.ground[3]}" fill="${c.ink}" opacity=".3" filter="url(#${p}sh)"/>` : "";
  return `${OPEN}<defs>${bgClay(p, c)}` +
    `<linearGradient id="${p}w" x1=".2" y1=".05" x2=".8" y2="1"><stop offset="0" stop-color="#fff"/><stop offset=".55" stop-color="${c.w2}"/><stop offset="1" stop-color="${c.w3}"/></linearGradient>` +
    `<linearGradient id="${p}a" x1=".2" y1=".05" x2=".8" y2="1"><stop offset="0" stop-color="${c.a1}"/><stop offset=".55" stop-color="${c.a2}"/><stop offset="1" stop-color="${c.a3}"/></linearGradient>` +
    (o.coral ? `<radialGradient id="${p}c" cx=".36" cy=".3" r=".8"><stop offset="0" stop-color="${CORAL.c1}"/><stop offset=".5" stop-color="${CORAL.c2}"/><stop offset="1" stop-color="${CORAL.c3}"/></radialGradient>` : "") +
    `<filter id="${p}clay" filterUnits="userSpaceOnUse" x="0" y="0" width="96" height="96" color-interpolation-filters="sRGB">` +
      `<feGaussianBlur in="SourceAlpha" stdDeviation="${o.soft || 2.2}" result="b"/>` +
      `<feOffset in="b" dx="-2.4" dy="-3.2" result="b1"/><feComposite in="SourceAlpha" in2="b1" operator="out" result="r1"/>` +
      `<feFlood flood-color="${c.ink}" flood-opacity="${o.shade || .34}" result="c1"/><feComposite in="c1" in2="r1" operator="in" result="shade"/>` +
      `<feOffset in="b" dx="1.8" dy="2.2" result="b2"/><feComposite in="SourceAlpha" in2="b2" operator="out" result="r2"/>` +
      `<feFlood flood-color="#fff" flood-opacity=".75" result="c2"/><feComposite in="c2" in2="r2" operator="in" result="lite"/>` +
      `<feMerge><feMergeNode in="SourceGraphic"/><feMergeNode in="shade"/><feMergeNode in="lite"/></feMerge></filter>` +
    (o.small ? `<filter id="${p}clay2" filterUnits="userSpaceOnUse" x="0" y="0" width="96" height="96" color-interpolation-filters="sRGB">` +
      `<feGaussianBlur in="SourceAlpha" stdDeviation="1" result="b"/>` +
      `<feOffset in="b" dx="-1" dy="-1.4" result="b1"/><feComposite in="SourceAlpha" in2="b1" operator="out" result="r1"/>` +
      `<feFlood flood-color="${c.ink}" flood-opacity=".3" result="c1"/><feComposite in="c1" in2="r1" operator="in" result="shade"/>` +
      `<feOffset in="b" dx=".8" dy="1" result="b2"/><feComposite in="SourceAlpha" in2="b2" operator="out" result="r2"/>` +
      `<feFlood flood-color="#fff" flood-opacity=".55" result="c2"/><feComposite in="c2" in2="r2" operator="in" result="lite"/>` +
      `<feMerge><feMergeNode in="SourceGraphic"/><feMergeNode in="shade"/><feMergeNode in="lite"/></feMerge></filter>` : "") +
    `<filter id="${p}sh" filterUnits="userSpaceOnUse" x="0" y="0" width="96" height="96"><feGaussianBlur stdDeviation="2.6"/></filter>` +
    `<filter id="${p}ao" filterUnits="userSpaceOnUse" x="0" y="0" width="96" height="96"><feGaussianBlur stdDeviation="1.3"/></filter>` +
    `<filter id="${p}drop" filterUnits="userSpaceOnUse" x="0" y="0" width="96" height="96" color-interpolation-filters="sRGB"><feDropShadow dx="1.6" dy="3" stdDeviation="2.6" flood-color="${c.ink}" flood-opacity=".22"/></filter>` +
    `</defs><rect width="96" height="96" rx="22" fill="url(#${p}bg)"/>${g}<g filter="url(#${p}drop)">${body}</g></svg>`;
}
const cw = p => `fill="url(#${p}w)" filter="url(#${p}clay)"`;      // white clay volume
const ca = p => `fill="url(#${p}a)" filter="url(#${p}clay)"`;      // accent clay volume
const cc = p => `fill="url(#${p}c)" filter="url(#${p}clay)"`;      // coral clay volume
/* a transformed clay part: the filter sits on an untransformed wrapper, so the light keeps coming from the upper left */
const cw2 = p => `fill="url(#${p}w)" filter="url(#${p}clay2)"`;   // the same for small parts (finer rim)
const ca2 = p => `fill="url(#${p}a)" filter="url(#${p}clay2)"`;
const tw = (p, tf, inner, extra = "") => `<g ${cw(p)}${extra}><g transform="${tf}">${inner}</g></g>`;
const ta = (p, tf, inner, extra = "") => `<g ${ca(p)}${extra}><g transform="${tf}">${inner}</g></g>`;
const ta2 = (p, tf, inner) => `<g ${ca2(p)}><g transform="${tf}">${inner}</g></g>`;

/* ---- B · Soft flat: flat tile, white shape + one soft accent (between the area's data and fill tone, so it also holds on the tile), faint drop shadow ---- */
function flat(p, c, body){
  return `${OPEN}<defs><filter id="${p}ds" filterUnits="userSpaceOnUse" x="0" y="0" width="96" height="96" color-interpolation-filters="sRGB"><feDropShadow dx="0" dy="2" stdDeviation="1.8" flood-color="${c.ink}" flood-opacity=".2"/></filter></defs>` +
    `<rect width="96" height="96" rx="22" fill="${c.tile}"/><g filter="url(#${p}ds)">${body}</g></svg>`;
}
/* ---- C · Duotone: flat tile, mid tone + dark tone of the area ---- */
const duo = (p, c, body) => `${OPEN}<rect width="96" height="96" rx="22" fill="${c.tile}"/>${body}</svg>`;
/* ---- D · Line: flat tile, round strokes of 4.6, no fill ---- */
const line = (p, c, body) => `${OPEN}<rect width="96" height="96" rx="22" fill="${c.tile}"/><g fill="none" stroke="${c.ink}" stroke-width="4.6" stroke-linecap="round" stroke-linejoin="round">${body}</g></svg>`;

/* ---------- shared motif geometry ---------- */
const SPARK = (x, y, s) => { const k = (s * .12).toFixed(2); return `M${x} ${y - s}q${k} ${(s - k).toFixed(2)} ${s} ${s} -${(s - k).toFixed(2)} ${k} -${s} ${s} -${k} -${(s - k).toFixed(2)} -${s} -${s} ${(s - k).toFixed(2)} -${k} ${s} -${s}z`; };

const SHOE_TOP = "V46c0-3.6 2.4-6 5.5-6 2.6 0 4.2 1.6 7.5 1.6 3.8 0 5.2-3.6 9.5-3.6 3.4 0 5.3 2 7.4 5 3.4 4.8 8.6 7.4 15.6 8.2l6 .7c8 1 13.5 5.2 13.5 11.1";
const SHOE_UP = `M17.5 65${SHOE_TOP}v2z`;
const LACES = "M51.4 50.6l2.6-4.6M57.8 53.2l2.3-4.4";
const MOON = "M41.6 18.1A24 24 0 1 0 67.1 48.7 20 20 0 0 1 41.6 18.1z";
const CLOUD = "M50 76a7 7 0 0 1 0-14 9.5 9.5 0 0 1 17.5-3 8 8 0 0 1 11 7.5 5 5 0 0 1-1.5 9.5z";
const HEAD = "M46 19C59 19 68.5 28 68.5 40.5c0 2.2.5 3.6 1.5 5.4l3.6 6.2c.9 1.6.2 3-1.6 3h-2.4v5.4c0 4.2-2.8 7-7 7H57V78H35V64.5C28 60 23.5 52 23.5 42 23.5 29 33 19 46 19z";
const BULB = "M39 66v-2.5c0-3.4-2-5.2-5-7.85A21 21 0 1 1 62 55.65c-3 2.65-5 4.45-5 7.85V66z";
const BAND = "M20 37a13 13 0 0 1 13-13h30a13 13 0 0 1 13 13v5H20z";

const ICONS = [];

/* ============ 9 · wellbeing (checkins) ============ */
{
  const id = "wellbeing", c = PAL.checkins, P = k => `${id}-${k}-`;
  const stones = (f1, f2, f3, ex = ["", "", ""]) =>
    `<rect x="18" y="57.5" width="60" height="21.5" rx="17" ry="10.75" ${f1}/>${ex[0]}` +
    `<rect x="28.5" y="39.5" width="43" height="19.5" rx="14" ry="9.75" ${f2}/>${ex[1]}` +
    `<g ${f3}><rect x="34" y="22.5" width="27" height="18" rx="11" ry="9" transform="rotate(-5 47.5 31.5)"/></g>${ex[2]}`;
  const pa = P("A"), pe = P("E");
  ICONS.push({ id, order: 9, title: "Wellbeing", area: "checkins",
    meaning: "The wellbeing / mood score of a check-in.",
    ref: "refs/wellbeing.png", refNote: "Three stacked stones, the top one brown, on a teal tile",
    variants: [
      { key: "A", name: "Clay", note: "Three balanced pebbles, the middle one mint, each a little off-centre",
        svg: clay(pa, c, stones(cw(pa), ca(pa), cw(pa), [
          `<ellipse cx="50" cy="58.6" rx="17" ry="2.2" fill="${c.ink}" opacity=".28" filter="url(#${pa}ao)"/>`,
          `<ellipse cx="47.5" cy="40.4" rx="10" ry="1.8" fill="${c.ink}" opacity=".3" filter="url(#${pa}ao)"/>`, ""]), { ground: [49, 79.5, 26, 3.6] }) },
      { key: "B", name: "Soft flat", note: "White pebbles with one soft mint pebble between them",
        svg: flat(P("B"), c, stones(`fill="#fff"`, `fill="${c.acc}"`, `fill="#fff"`)) },
      { key: "C", name: "Duotone", note: "Dark, mid, dark: the stack as three flat tones of mint",
        svg: duo(P("C"), c, stones(`fill="${c.ink}"`, `fill="${c.fill}"`, `fill="${c.ink}"`)) },
      { key: "D", name: "Line", note: "Three pill outlines that share their edges",
        svg: line(P("D"), c, `<rect x="19" y="58" width="58" height="19" rx="9.5"/><rect x="30" y="39" width="42" height="19" rx="9.5"/><rect x="33" y="20" width="27" height="19" rx="9.5"/>`) },
      { key: "E", name: "Calm face", note: "Another motif, in clay: one round pebble with closed eyes and a small smile",
        svg: clay(pe, c, `<circle cx="48" cy="48" r="27" ${cw(pe)}/>` +
          `<ellipse cx="33.5" cy="55.5" rx="4.6" ry="3.2" fill="${c.a1}" opacity=".7"/><ellipse cx="62.5" cy="55.5" rx="4.6" ry="3.2" fill="${c.a1}" opacity=".7"/>` +
          `<path d="M35 46.5q4.5 4.2 9 0M52 46.5q4.5 4.2 9 0M41.5 57q6.5 5.2 13 0" fill="none" stroke="${c.ink}" stroke-width="3.4" stroke-linecap="round"/>`, { ground: [49, 78, 20, 3.4] }) },
    ] });
}

/* ============ 10 · steps (neutral) ============ */
{
  const id = "steps", c = PAL.neutral, P = k => `${id}-${k}-`;
  const shoe = (up, sole, lace) => `<rect x="15" y="61.5" width="70" height="11.5" rx="5.75" ${sole}/><path d="${SHOE_UP}" ${up}/>` +
    `<path d="${LACES}" fill="none" stroke-width="3.6" stroke-linecap="round" ${lace}/>`;
  const pa = P("A"), pe = P("E");
  const FOOT = `<path d="M36.5 45c0-7 5-12 12-12 7.5 0 13 5 13 13 0 5-1.5 8.5-1.5 13 0 3.5.5 6.5.5 10a9.5 9.5 0 0 1-19 0c0-3.5 1.500-6 1-9.500-.6-4.500-6-7.500-6-14.500z"/>`;
  const TOES = `<circle cx="39" cy="25.5" r="5.1"/><circle cx="49.3" cy="22.4" r="4"/><circle cx="57.6" cy="24.6" r="3.5"/><circle cx="64" cy="29.4" r="3.1"/><circle cx="68" cy="35.6" r="2.7"/>`;
  const FT = "translate(-3.5 0) rotate(-9 48 50)";
  ICONS.push({ id, order: 10, title: "Steps", area: "neutral",
    meaning: "Steps per day, from Apple Health.",
    ref: "refs/steps.png", refNote: "A white sneaker with a tan sole on a beige tile",
    variants: [
      { key: "A", name: "Clay", note: "A soft everyday shoe standing still on a sand sole, flat on the ground",
        svg: clay(pa, c, `<rect x="15" y="61.5" width="70" height="11.5" rx="5.75" ${ca(pa)}/><path d="${SHOE_UP}" ${cw(pa)}/>` +
          `<path d="${LACES}" fill="none" stroke="${c.a2}" stroke-width="3.6" stroke-linecap="round"/>`, { ground: [51, 74.5, 34, 3.2] }) },
      { key: "B", name: "Soft flat", note: "White shoe, taupe sole and two lace marks",
        svg: flat(P("B"), c, shoe(`fill="#fff"`, `fill="${c.acc}"`, `stroke="${c.acc}"`)) },
      { key: "C", name: "Duotone", note: "Warm grey upper on a dark sole",
        svg: duo(P("C"), c, shoe(`fill="${c.fill}"`, `fill="${c.ink}"`, `stroke="${c.ink}"`)) },
      { key: "D", name: "Line", note: "One outline for shoe and sole, a single line between them",
        svg: line(P("D"), c, `<path d="M17.5 66${SHOE_TOP}v3a6 6 0 0 1-6 6h-53a6 6 0 0 1-6-6zM17.5 62.5h65"/>`) },
      { key: "E", name: "Footprint", note: "Another motif, in clay: one bare footprint, a step at home, no shoe and no sport",
        svg: clay(pe, c, ta(pe, FT, FOOT) + ta2(pe, FT, TOES), { small: true }) },
    ] });
}

/* ============ 11 · sleep (neutral) ============ */
{
  const id = "sleep", c = PAL.neutral, P = k => `${id}-${k}-`;
  const pa = P("A"), pe = P("E");
  const T = `transform="translate(-3 1)"`;
  ICONS.push({ id, order: 11, title: "Sleep", area: "neutral",
    meaning: "Sleep duration and quality, from Apple Health or a check-in.",
    ref: "refs/sleep.png", refNote: "A white cloud with a purple moon behind it on a lilac tile",
    variants: [
      { key: "A", name: "Clay", note: "A large sand moon, a small white cloud drifting in front of it",
        svg: clay(pa, c, `<g ${T}><path d="${MOON}" stroke="url(#${pa}a)" stroke-width="3" stroke-linejoin="round" ${ca(pa)}/>` +
          `<ellipse cx="62" cy="62" rx="12" ry="3" fill="${c.ink}" opacity=".22" filter="url(#${pa}ao)"/><path d="${CLOUD}" ${cw(pa)}/></g>`) },
      { key: "B", name: "Soft flat", note: "Taupe moon behind a white cloud",
        svg: flat(P("B"), c, `<g ${T}><path d="${MOON}" fill="${c.acc}" stroke="${c.acc}" stroke-width="3" stroke-linejoin="round"/><path d="${CLOUD}" fill="#fff"/></g>`) },
      { key: "C", name: "Duotone", note: "Dark moon, warm grey cloud with a thin gap around it",
        svg: duo(P("C"), c, `<g ${T}><path d="${MOON}" fill="${c.ink}" stroke="${c.ink}" stroke-width="3" stroke-linejoin="round"/><path d="${CLOUD}" fill="${c.fill}" stroke="${c.tile}" stroke-width="3.5" stroke-linejoin="round"/></g>`) },
      { key: "D", name: "Line", note: "Moon outline, the cloud outline passes in front of it",
        svg: line(P("D"), c, `<g ${T}><path d="${MOON}"/><path d="${CLOUD}" fill="${c.tile}"/></g>`) },
      { key: "E", name: "Pillow", note: "Another motif, in clay: a plump pillow with two small z",
        svg: clay(pe, c, tw(pe, "rotate(-5 48 60)", `<path d="M24 47q24 5 48 0-4 13 0 26-24-5-48 0 4-13 0-26z"/>`, ` stroke="url(#${pe}w)" stroke-width="7" stroke-linejoin="round"`) +
          `<path d="M52 23.5h10.5L52 35h10.5M69.5 14h7l-7 8h7" fill="none" stroke="${c.a2}" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round"/>`, { ground: [49, 79.5, 25, 3.2] }) },
    ] });
}

/* ============ 12 · pain (checkins) ============ */
{
  const id = "pain", c = PAL.checkins, P = k => `${id}-${k}-`;
  const pa = P("A"), pe = P("E");
  ICONS.push({ id, order: 12, title: "Pain", area: "checkins",
    meaning: "The pain score of a check-in.",
    ref: "refs/pain.png", refNote: "A white head seen from behind with a red burst at the temple",
    variants: [
      { key: "A", name: "Clay", note: "A head in profile with one soft coral bead and its glow, no burst, no red",
        svg: clay(pa, c, `<path d="${HEAD}" stroke="url(#${pa}w)" stroke-width="3" stroke-linejoin="round" ${cw(pa)}/>` +
          `<circle cx="40.5" cy="37.5" r="12.5" fill="${CORAL.c2}" opacity=".42" filter="url(#${pa}ao)"/><circle cx="40.5" cy="37.5" r="6.6" fill="url(#${pa}c)"/>`, { ground: [47, 80.5, 15, 3], coral: true }) },
      { key: "B", name: "Soft flat", note: "White profile, coral dot with a pale ring",
        svg: flat(P("B"), c, `<path d="${HEAD}" fill="#fff" stroke="#fff" stroke-width="3" stroke-linejoin="round"/><circle cx="40.5" cy="37.5" r="12.5" fill="${CORAL.flat}" opacity=".3"/><circle cx="40.5" cy="37.5" r="6.4" fill="${CORAL.flat}"/>`) },
      { key: "C", name: "Duotone", note: "Mint profile, the spot and its ring in dark green",
        svg: duo(P("C"), c, `<path d="${HEAD}" fill="${c.fill}" stroke="${c.fill}" stroke-width="3" stroke-linejoin="round"/><circle cx="40.5" cy="37.5" r="11.5" fill="${c.ink}" opacity=".3"/><circle cx="40.5" cy="37.5" r="5.6" fill="${c.ink}"/>`) },
      { key: "D", name: "Line", note: "Profile outline, a dot on the spot that hurts and one soft echo line around it",
        svg: line(P("D"), c, `<g transform="translate(5.6 5) scale(.93)" stroke-width="4.95"><path d="${HEAD}"/><path d="M17.3 30.4A31 31 0 0 1 29.6 15.7"/><circle cx="29.7" cy="27.3" r="5" fill="${c.ink}" stroke="none"/></g>`) },
      { key: "E", name: "Plaster", note: "Another motif, in clay: a plaster, pain as something that is cared for",
        svg: clay(pe, c, tw(pe, "rotate(-32 48 48)", `<rect x="14" y="34.5" width="68" height="27" rx="13.5"/>`) + ta(pe, "rotate(-32 48 48)", `<rect x="37" y="38" width="22" height="20" rx="6.5"/>`) +
          `<g transform="rotate(-32 48 48)"><g fill="${c.ink}" opacity=".26"><circle cx="24.5" cy="43.6" r="1.9"/><circle cx="24.5" cy="52.4" r="1.9"/><circle cx="71.5" cy="43.6" r="1.9"/><circle cx="71.5" cy="52.4" r="1.9"/></g></g>`) },
    ] });
}

/* ============ 13 · guide (insights) ============ */
{
  const id = "guide", c = PAL.insights, P = k => `${id}-${k}-`;
  const pa = P("A"), pe = P("E");
  const T = `transform="translate(-4 -1.5)"`;
  const bulb = (glass, base, spark) => `<g ${T}><path d="${BULB}" ${glass}/><rect x="38" y="68" width="20" height="6" rx="3" ${base}/><rect x="41.5" y="75.6" width="13" height="5.4" rx="2.7" ${base}/><path d="${SPARK(77, 27, 7.5)}" ${spark}/></g>`;
  ICONS.push({ id, order: 13, title: "Guide", area: "insights",
    meaning: "A short guide or explanation (\"New to this? A two-minute guide\").",
    ref: "refs/guide.png", refNote: "A white lightbulb inside a ring on a blue tile",
    variants: [
      { key: "A", name: "Clay", note: "A round bulb on a rosé base, with the small spark of our Insights icons",
        svg: clay(pa, c, bulb(cw(pa), ca2(pa), `fill="${c.a2}"`), { ground: [44, 81, 12, 2.6], small: true }) },
      { key: "B", name: "Soft flat", note: "White bulb and spark, rosé base",
        svg: flat(P("B"), c, bulb(`fill="#fff"`, `fill="${c.acc}"`, `fill="#fff"`)) },
      { key: "C", name: "Duotone", note: "Rosé bulb, base and spark in plum",
        svg: duo(P("C"), c, bulb(`fill="${c.fill}"`, `fill="${c.ink}"`, `fill="${c.ink}"`)) },
      { key: "D", name: "Line", note: "Bulb outline, one base line, a small spark",
        svg: line(P("D"), c, `<g ${T}><path d="${BULB}"/><path d="M42 75h12"/><path d="${SPARK(77, 27, 7)}" fill="${c.ink}" stroke-width="2"/></g>`) },
      { key: "E", name: "Open book", note: "Another motif, in clay: an open booklet, a spark on the page you start with",
        svg: clay(pe, c, `<rect x="14.5" y="33" width="67" height="43.5" rx="8" ${ca(pe)}/>` +
          `<path d="M47 37C40 31.5 30 30.5 20 33v36c10-2.5 20-1.5 27 4z" stroke="url(#${pe}w)" stroke-width="2" stroke-linejoin="round" ${cw(pe)}/>` +
          `<path d="M49 37c7-5.5 17-6.5 27-4v36c-10-2.5-20-1.5-27 4z" stroke="url(#${pe}w)" stroke-width="2" stroke-linejoin="round" ${cw(pe)}/>` +
          `<path d="${SPARK(62.5, 50.5, 7)}" fill="${c.a2}"/><path d="M27 44.5q6.5-1 13 1.6M27 53.5q6.500-1 13 1.600" fill="none" stroke="${c.ink}" stroke-opacity=".22" stroke-width="3" stroke-linecap="round"/>`, { ground: [48, 79, 30, 3] }) },
    ] });
}

/* ============ 14 · evaluation (insights) ============ */
{
  const id = "evaluation", c = PAL.insights, P = k => `${id}-${k}-`;
  const pa = P("A"), pe = P("E");
  const R = "rotate(-6 48 48)";
  const sheet = (page, bar, ln) => `<g transform="rotate(-6 48 48)"><rect x="26" y="17" width="44" height="61" rx="10" ${page}/><rect x="33.5" y="26.5" width="17" height="5.6" rx="2.8" ${ln}/>` +
    `<rect x="33.4" y="56" width="7.6" height="13.5" rx="3.8" ${bar}/><rect x="44.2" y="44.500" width="7.6" height="25" rx="3.8" ${bar}/><rect x="55" y="50.500" width="7.6" height="19" rx="3.8" ${bar}/></g>`;
  ICONS.push({ id, order: 14, title: "Evaluation", area: "insights",
    meaning: "An evaluation or report of everything that changed around a protocol.",
    ref: "refs/evaluation.png", refNote: "A blue document glyph with a folded corner in a dashed frame",
    variants: [
      { key: "A", name: "Clay", note: "A slightly tilted sheet that carries three plump result bars",
        svg: clay(pa, c, tw(pa, R, `<rect x="26" y="17" width="44" height="61" rx="10"/>`) + `<rect x="33.5" y="26.5" width="17" height="5.6" rx="2.8" transform="${R}" fill="${c.lo}"/>` +
          ta2(pa, R, `<rect x="33.4" y="56" width="7.6" height="13.5" rx="3.8"/><rect x="44.2" y="44.5" width="7.6" height="25" rx="3.8"/><rect x="55" y="50.5" width="7.6" height="19" rx="3.8"/>`), { small: true }) },
      { key: "B", name: "Soft flat", note: "White sheet, rosé bars, one pale heading line",
        svg: flat(P("B"), c, sheet(`fill="#fff"`, `fill="${c.acc}"`, `fill="${c.acc}" opacity=".35"`)) },
      { key: "C", name: "Duotone", note: "Rosé sheet, bars and heading in plum",
        svg: duo(P("C"), c, sheet(`fill="${c.fill}"`, `fill="${c.ink}"`, `fill="${c.ink}"`)) },
      { key: "D", name: "Line", note: "Sheet outline, three bars as strokes, a short heading",
        svg: line(P("D"), c, `<rect x="26.500" y="18" width="43" height="60" rx="10"/><path d="M38 31h10M38 66v-7M48 66V48M58 66V54"/>`) },
      { key: "E", name: "Lens", note: "Another motif, in clay: a magnifying glass over one rising curve, looking closely at what changed",
        svg: clay(pe, c, ta(pe, "translate(57.5 57.5) rotate(-45)", `<rect x="-5.2" y="0" width="10.4" height="25" rx="5.2"/>`) +
          `<circle cx="42" cy="42" r="19" ${cw(pe)}/><path d="M31.500 48c4.500-.3 6.500-2.500 8.500-5.500s5-6 11.500-6.500" fill="none" stroke="${c.a2}" stroke-width="4" stroke-linecap="round"/>` +
          `<path d="M42 18.500a23.500 23.500 0 1 0 .01 0zM42 26a16 16 0 1 1-.01 0z" fill-rule="evenodd" ${ca(pe)}/>`) },
    ] });
}

/* ============ 15 · calendar (protocols) ============ */
{
  const id = "calendar", c = PAL.protocols, P = k => `${id}-${k}-`;
  const pa = P("A"), pe = P("E");
  const B = "rotate(-8 48 48)", cell = [0, 1].flatMap(j => [0, 1, 2].map(i => [30.5 + i * 17.5, 39.5 + j * 17]));
  const DX = [34, 48, 62], DY = [55, 67.500];
  const dots = (on, off, r = 4.6) => DY.map((y, j) => DX.map((x, i) => `<circle cx="${x}" cy="${y}" r="${r}" ${j * 3 + i < 4 ? on : off}/>`).join("")).join("");
  const cal = (page, band, ring, on, off) => `<rect x="20" y="24" width="56" height="55" rx="13" ${page}/><path d="${BAND}" ${band}/>` +
    `<rect x="31.500" y="16.500" width="6.500" height="14" rx="3.250" ${ring}/><rect x="58" y="16.500" width="6.500" height="14" rx="3.250" ${ring}/>` + dots(on, off);
  ICONS.push({ id, order: 15, title: "Calendar", area: "protocols",
    meaning: "The intake calendar / a plan over days.",
    ref: "refs/calendar.png", refNote: "A calendar with a red header, two rings and a grid with one red day",
    variants: [
      { key: "A", name: "Clay", note: "A calendar page whose days are six beads; four are taken, two still to come",
        svg: clay(pa, c, cal(cw(pa), ca(pa), cw2(pa), ca2(pa), `fill="${c.w3}"`), { ground: [49, 81, 24, 3], small: true }) },
      { key: "B", name: "Soft flat", note: "White page, periwinkle header, days as dots",
        svg: flat(P("B"), c, cal(`fill="#fff"`, `fill="${c.acc}"`, `fill="#fff"`, `fill="${c.acc}"`, `fill="${c.acc}" opacity=".28"`)) },
      { key: "C", name: "Duotone", note: "Periwinkle page, header, rings and taken days in indigo",
        svg: duo(P("C"), c, cal(`fill="${c.fill}"`, `fill="${c.ink}"`, `fill="${c.ink}"`, `fill="${c.ink}"`, `fill="${c.tile}"`)) },
      { key: "D", name: "Line", note: "Page outline, header line, two rings, five days",
        svg: line(P("D"), c, `<rect x="20.500" y="25" width="55" height="53" rx="12"/><path d="M20.500 42h55M35 18v9M61 18v9"/>` +
          `<g fill="${c.ink}" stroke="none"><circle cx="34.500" cy="54" r="3.400"/><circle cx="48" cy="54" r="3.400"/><circle cx="61.500" cy="54" r="3.400"/><circle cx="34.500" cy="66" r="3.400"/><circle cx="48" cy="66" r="3.400"/></g>`) },
      { key: "E", name: "Blister", note: "Another motif, in clay: a blister card, four doses still domed, two already pressed",
        svg: clay(pe, c, ta(pe, B, `<rect x="16" y="25.5" width="64" height="45" rx="12"/>`) +
          `<g transform="${B}" fill="${c.a3}" opacity=".6">${cell.slice(4).map(([x, y]) => `<circle cx="${x}" cy="${y}" r="6"/>`).join("")}</g>` +
          tw(pe, B, cell.slice(0, 4).map(([x, y]) => `<circle cx="${x}" cy="${y}" r="6.6"/>`).join(""))) },
    ] });
}

/* ---------- write modules ---------- */
/* drop gradients / filters a variant does not use */
const prune = s => s.replace(/<(linearGradient|radialGradient|filter) id="([^"]+)"[\s\S]*?<\/\1>/g, (m, t, id) => s.includes(`url(#${id})`) ? m : "");
const clean = s => prune(s).replace(/(\d+\.\d*?)0+(?=[^\d]|$)/g, "$1").replace(/(\d)\.(?=[^\d]|$)/g, "$1");   // 6.500 → 6.5, 25.0 → 25
const q = s => JSON.stringify(s);
for(const ic of ICONS){
  const vs = ic.variants.map(v => {
    const svg = OPEN + clean(v.svg.slice(OPEN.length));   // number clean-up must not touch the xmlns URL
    if(!svg.includes('xmlns="http://www.w3.org/2000/svg"')) throw new Error("xmlns");
    if(svg.includes("`") || svg.includes("${")) throw new Error(`${ic.id} ${v.key}: template character in svg`);
    return `    { key: ${q(v.key)}, name: ${q(v.name)}, note: ${q(v.note)},\n      svg: \`${svg}\` },`;
  }).join("\n");
  const src = `/* MEjority icon lab · ${ic.title} (${ic.id}) · tile, area ${ic.area}.
   Families: A Clay · B Soft flat · C Duotone · D Line · E another motif. Light from the upper left.
   Ids inside each SVG are prefixed "${ic.id}-<variant>-". */
export default {
  id: ${q(ic.id)}, order: ${ic.order}, kind: "tile",
  title: ${q(ic.title)}, meaning: ${q(ic.meaning)},
  area: ${q(ic.area)},
  ref: ${q(ic.ref)}, refNote: ${q(ic.refNote)},
  variants: [
${vs}
  ],
};
`;
  fs.writeFileSync(path.join(OUT, `${ic.id}.mjs`), src);
  console.log("wrote", ic.id, ic.variants.length, "variants");
}
