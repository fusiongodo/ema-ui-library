/* Concept "Hands": five hands meet on a warm table top seen from above, lie on each other as a rosette,
   and each leaves one dot in its sleeve colour. The ring of five dots stays as the sign above the wordmark. */
import { W, H, f, rad, PAL, frame, wordmark } from "../kit.mjs";

const ID = "hands";
const TABLE = PAL.cream;                         // the calm surface: a table top / blanket from above
const C = { x: 195, y: 356 };                    // where the hands meet; later the centre of the ring of dots
const RING = 32, DOT = 14;                       // the sign: five dots on a circle of radius RING
const REST = 68;                                 // palm distance from C when a hand lies in the rosette (fingertips just short of C)
const TURN = 5;                                  // the hands come in a little off the dots' axes, so the first arm is not a rigid vertical bar

/* in order of arrival, once around the table; theta = the side the arm comes from (0 = right, 90 = below), 72° apart.
   In the rosette every hand lies on the fingers of the one before it; the first one lies on the last (see rosette()). */
const ARMS = [
  { theta:  90, skin: "#F0C29A", line: "#D39A70", sleeve: "#FFAF57", cuff: "#FFD49B", rib: "#F3973A" },                  // apricot, from below (the first one)
  { theta: 162, skin: "#8E5B3C", line: "#6C4027", sleeve: "#8ACDA7", cuff: "#C8ECD6", rib: "#67B58A", bands: "mint" },   // mint, from the left
  { theta: 234, skin: "#BF8253", line: "#9C643A", sleeve: "#DC9DCA", cuff: "#F1CFE7", rib: "#C67DB1" },                  // lilac rosé, from the top left
  { theta: 306, skin: "#E2AB7C", line: "#C1875A", sleeve: "#98A2EE", cuff: "#CDD2FA", rib: "#7985DE" },                  // periwinkle, from the top right
  { theta:  18, skin: "#F3CFAE", line: "#DBA683", sleeve: "#3F8785", cuff: "#84BBB7", rib: "#2F6B6A", bands: "teal" },   // teal, from the right
];

/* a mitten-like cartoon hand, fingers pointing up (-y), wrist at y = 0; seen from the back, thumb on the left */
const FX = [-29, -14.5, 0, 14.5, 29], TIP = [-90, -99, -95, -83], FR = 7.25;
const MITTEN = (() => {
  let d = `M -21 12 C -25 -12 -29 -26 -29 -50 L -29 ${TIP[0] + FR}`;
  for(let i = 0; i < 4; i++){ d += ` A ${FR} ${FR} 0 0 1 ${FX[i + 1]} ${TIP[i] + FR}`; if(i < 3) d += ` L ${FX[i + 1]} ${TIP[i + 1] + FR}`; }
  return d + " L 29 -50 C 29 -26 25 -12 21 12 Z";
})();
const THUMB = '<ellipse cx="-31" cy="-27" rx="9.5" ry="21" transform="rotate(-30 -31 -27)"/>';
const FINGERS = [1, 2, 3].map(i => `<line x1="${FX[i]}" y1="${Math.max(TIP[i - 1], TIP[i]) + FR + .5}" x2="${FX[i]}" y2="-58"/>`).join("");
const SLEEVE = '<rect x="-31" y="2" width="62" height="900"/>', CUFF = '<rect x="-36" y="-7" width="72" height="26" rx="11"/>';
function bands(a){
  if(a.bands === "mint") return `<g fill="${a.cuff}"><rect x="-31" y="34" width="62" height="7"/><rect x="-31" y="48" width="62" height="7"/></g>`;
  if(a.bands === "teal") return `<g fill="#5B9693">${Array.from({ length: 12 }, (_, i) => `<rect x="-31" y="${34 + i * 30}" width="62" height="9"/>`).join("")}</g>`;
  return "";
}
const HS = 1.14;                                 // hand size
const place = (a, r) => `translate(${C.x} ${C.y}) rotate(${f(a.theta + TURN - 90)}) translate(0 ${f(r + 50 * HS)}) scale(${HS})`;
const SHADOW = "#7A4A2B";
const silhouette = `${SLEEVE}${CUFF}${THUMB}<path d="${MITTEN}"/>`;
const body = a => `<g fill="${a.sleeve}">${SLEEVE}</g>${bands(a)}`
  + `<g fill="${a.skin}">${THUMB}<path d="${MITTEN}"/></g>`
  + `<g stroke="${a.line}" stroke-width="2.4" stroke-linecap="round" fill="none">${FINGERS}<path d="M -22 -30 Q -17 -22 -19 -10" opacity=".8"/></g>`
  + `<g fill="${a.cuff}">${CUFF}</g><g stroke="${a.rib}" stroke-width="2" stroke-linecap="round" opacity=".55">`
  + [-22, -11, 0, 11, 22].map(x => `<line x1="${x}" y1="0" x2="${x}" y2="12"/>`).join("") + `</g>`;
/* one arm: r = distance of the palm centre from the meeting point; the soft shadow falls on the table and on the hands below */
function arm(a, r, shadow = .16){
  const tf = place(a, r);
  return `<g transform="translate(0 7)" fill="${SHADOW}" opacity="${shadow}"><g transform="${tf}">${silhouette}</g></g><g transform="${tf}">${body(a)}</g>`;
}
/* The rosette: all five at rest, each on the fingers of the one before. Painting them in order puts the last one on the first,
   so the first is painted once more, only its half next to the last one, and its shadow there only where it falls on the last arm. */
function rosette(n, shadow = .2){
  const first = ARMS[0], last = ARMS[ARMS.length - 1], tf = place(first, REST), tl = place(last, REST);
  const lastShape = `<rect x="-31" y="2" width="62" height="900" transform="${tl}"/><rect x="-36" y="-7" width="72" height="26" rx="11" transform="${tl}"/>`
    + `<ellipse cx="-31" cy="-27" rx="9.5" ry="21" transform="${tl} rotate(-30 -31 -27)"/><path d="${MITTEN}" transform="${tl}"/>`;
  return `<defs><clipPath id="${ID}-f${n}-half"><rect x="0" y="-400" width="400" height="800" transform="${tf}"/></clipPath>`
    + `<clipPath id="${ID}-f${n}-last">${lastShape}</clipPath></defs>`
    + ARMS.map(a => arm(a, REST, shadow)).join("")
    + `<g clip-path="url(#${ID}-f${n}-half)"><g clip-path="url(#${ID}-f${n}-last)"><g transform="translate(0 7)" fill="${SHADOW}" opacity="${shadow}"><g transform="${tf}">${silhouette}</g></g></g>`
    + `<g transform="${tf}">${body(first)}</g></g>`;
}

const table = `<rect width="${W}" height="${H}" fill="${TABLE}"/>`;
/* the five dots, each on the axis of its hand, in that hand's sleeve colour */
const dots = ARMS.map(a => `<circle cx="${f(C.x + RING * Math.cos(rad(a.theta)))}" cy="${f(C.y + RING * Math.sin(rad(a.theta)))}" r="${DOT}" fill="${a.sleeve}"/>`).join("");
const still = (n, inner) => frame(`Hands, Bild ${n}`, table + inner);

export default {
  id: ID,
  order: 1,
  title: "Hands",
  idea: "Erst eine Hand, dann viele: Sie legen sich auf einem Tisch aufeinander, und jede lässt etwas von sich da. Was bleibt, ist ein kleiner Kreis aus fünf Farbpunkten, das Zeichen über der Wortmarke.",
  duration: "ca. 6,5 s",
  frames: [
    { t: "0,4 s", caption: "Eine einzelne Hand schiebt sich von unten auf die warme Fläche und bleibt in der Mitte liegen.",
      svg: still(1, arm(ARMS[0], REST)) },
    { t: "1,6 s", caption: "Von allen Seiten gleiten vier weitere Hände herein, jede in ihrem Tempo.",
      svg: still(2, arm(ARMS[0], REST) + arm(ARMS[1], 118) + arm(ARMS[2], 150) + arm(ARMS[3], 186) + arm(ARMS[4], 160)) },
    { t: "2,9 s", caption: "Fünf Hände liegen als Rosette aufeinander; einen Atemzug lang bewegt sich nichts.",
      svg: still(3, rosette(3)) },
    { t: "4,2 s", caption: "Die Hände ziehen sich ruhig zurück, und jede lässt einen Punkt in ihrer Ärmelfarbe liegen.",
      svg: still(4, dots + ARMS.map((a, k) => arm(a, [136, 130, 140, 134, 128][k], .14)).join("")) },
    { t: "5,6 s", caption: "Die Hände sind fort, die fünf Punkte bleiben als Zeichen stehen, darunter erscheint „MEjority“.",
      svg: still(5, dots + wordmark({ y: C.y + RING + DOT + 77, fill: PAL.teal })) },
  ],
};
