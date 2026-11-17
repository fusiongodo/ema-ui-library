/* ====== BUDDY: the small companion of the Cozy theme ======
   buddy(state) → markup for one state: "sleep" (head on a pillow under a round blanket), "awake" (big jumper, both
   hands round a mug), "listening" (eyes closed, a slight nod: the listening layer) or "speaking" (eyes open, the mouth
   moves a few times, then rests: the guided questions). The drawing is a PLACEHOLDER from simple shapes; the finished illustration comes later.
   To swap it in: put one image per state into BUDDY_ART (URL or data: URI). buddy() then returns an <img> in the
   same slot, nothing else changes (no screen, no other file). Size and motion of the slot live in lib/cozy.css (BUDDY).
   Colours of the placeholder follow the page's world (--bd-* variables, set by lib/cozy.css), with fallbacks so it also draws on its own. */
const BUDDY_ART = { sleep:null, awake:null, listening:null, speaking:null };

function buddy(state){
  const st = ["sleep","listening","speaking"].includes(state) ? state : "awake";
  const alt = { sleep:"Your companion is asleep under a blanket", awake:"Your companion sits with a warm mug",
    listening:"Your companion listens, eyes closed", speaking:"Your companion is talking to you" }[st];
  if(BUDDY_ART[st]) return `<span class="bd" data-state="${st}"><img src="${BUDDY_ART[st]}" alt="${alt}"></span>`;
  const SKIN = "#EDBF9C", HAIR = "#5B3D33", LINE = "#3B2B27", BLUSH = "#F09C8A", KNIT = "#F5E7CF", KNIT2 = "#EAD6B6";
  const face = (closed, talk) =>
      `<circle cx="29.5" cy="45" r="4.6" fill="${SKIN}"/><circle cx="74.5" cy="45" r="4.6" fill="${SKIN}"/>`
    + `<circle cx="52" cy="42" r="23" fill="${SKIN}"/>`
    + `<path d="M28.6 46C26.8 25 39.5 14.5 52 14.5S77.2 25 75.4 46C73.6 38.5 68.6 33.4 61.6 31.6 58.4 35.6 51.4 38 44.2 37.2 37.6 36.6 31.8 40.2 28.6 46Z" fill="${HAIR}"/>`
    + `<path d="M49.5 15.5c-.6-4.6 4.2-6.6 7.4-4" fill="none" stroke="${HAIR}" stroke-width="3" stroke-linecap="round"/>`
    + `<ellipse cx="40" cy="52.5" rx="4.6" ry="2.8" fill="${BLUSH}" opacity=".5"/><ellipse cx="64" cy="52.5" rx="4.6" ry="2.8" fill="${BLUSH}" opacity=".5"/>`
    + (closed
      ? `<path d="M40.5 46.5q3.5 3.4 7 0M56.5 46.5q3.5 3.4 7 0" fill="none" stroke="${LINE}" stroke-width="2.1" stroke-linecap="round"/>`
      : talk
      ? `<g class="bd-eyes"><circle cx="43.7" cy="46.6" r="2.9" fill="${LINE}"/><circle cx="60.3" cy="46.6" r="2.9" fill="${LINE}"/></g>`   // wide awake, looking at you
      : `<g class="bd-eyes"><path d="M39.6 46h8.2a4.1 3.4 0 0 1-8.2 0Z M56.2 46h8.2a4.1 3.4 0 0 1-8.2 0Z" fill="${LINE}"/></g>`)
    + (talk
      ? `<ellipse class="bd-talk" cx="52" cy="56.4" rx="3.6" ry="3" fill="${LINE}"/>`
      : `<path d="M48.6 54.6q3.4 2.8 6.8 0" fill="none" stroke="${LINE}" stroke-width="1.9" stroke-linecap="round"/>`);
  /* head and shoulders in the big jumper, no mug: listening / speaking */
  const bust = (closed, talk, cls) => `<svg viewBox="0 0 120 112" aria-hidden="true">`
      + `<path d="M12 112C12 86 32 72 60 72s48 14 48 40Z" fill="${KNIT}"/>`
      + `<rect x="45" y="65" width="30" height="12" rx="6" fill="${KNIT2}"/>`
      + `<g class="${cls}"><g transform="translate(8 2)">${face(closed, talk)}</g></g>`
      + `</svg>`;
  const svg = st === "listening" ? bust(true, false, "bd-nod")
    : st === "speaking" ? bust(false, true, "bd-head")
    : st === "sleep"
    ? `<svg viewBox="0 0 120 104" aria-hidden="true">`
      + `<ellipse cx="66" cy="99" rx="50" ry="4" fill="#000" opacity=".07"/>`
      + `<rect x="2" y="58" width="60" height="32" rx="16" fill="#fff"/><path d="M10 82c12 4 30 4 44 0" fill="none" stroke="#000" stroke-opacity=".05" stroke-width="3" stroke-linecap="round"/>`
      + `<g transform="translate(32 60) rotate(-12) scale(.86) translate(-52 -42)">${face(true)}</g>`
      + `<g class="bd-breathe"><path d="M34 98C34 78 46 66 64 65c13-.7 20 4.4 30 6.4C107 74 116 84 116 98Z" style="fill:var(--bd-blanket,#FFF4E2)"/>`
      + `<path d="M35.5 92C37 78 47 68.5 62 67" fill="none" style="stroke:var(--bd-hem,#F6D9B0)" stroke-width="5" stroke-linecap="round"/>`
      + `<circle cx="84" cy="80" r="2.2" style="fill:var(--bd-hem,#F6D9B0)"/><circle cx="100" cy="88" r="2.2" style="fill:var(--bd-hem,#F6D9B0)"/><circle cx="70" cy="86" r="2.2" style="fill:var(--bd-hem,#F6D9B0)"/></g>`
      + `<g class="bd-zz" fill="none" style="stroke:var(--bd-z,#7A3B0E)" stroke-linecap="round" stroke-linejoin="round">`
      + `<path class="bd-z" d="M64 36h6.5l-6.5 7.5h6.5" stroke-width="2.4"/><path class="bd-z bd-z2" d="M76 24h5l-5 6h5" stroke-width="2"/></g>`
      + `</svg>`
    : `<svg viewBox="0 0 120 112" aria-hidden="true">`
      + `<path d="M4 112C4 83 26 67 54 67s50 16 50 45Z" fill="${KNIT}"/>`
      + `<rect x="38" y="61" width="30" height="12" rx="6" fill="${KNIT2}"/>`
      + `<g class="bd-head">${face(false)}</g>`
      + `<ellipse cx="65" cy="101" rx="10" ry="8" fill="${KNIT2}"/><ellipse cx="95" cy="101" rx="10" ry="8" fill="${KNIT2}"/>`
      + `<rect x="69" y="80" width="22" height="25" rx="7" style="fill:var(--bd-mug,#D9876A)"/><rect x="69" y="87" width="22" height="4" fill="#fff" opacity=".35"/>`
      + `<ellipse cx="69.5" cy="93" rx="5.6" ry="7" fill="${SKIN}"/><ellipse cx="90.5" cy="93" rx="5.6" ry="7" fill="${SKIN}"/>`
      + `<g class="bd-steam" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" opacity=".9">`
      + `<path class="bd-s1" d="M76 76c-3-3.6 3-6.4 0-10.5"/><path class="bd-s2" d="M84 75c-3-3.6 3-6.4 0-10.5"/></g>`
      + `</svg>`;
  return `<span class="bd" data-state="${st}" role="img" aria-label="${alt}">${svg}</span>`;
}
if(typeof module!=="undefined") module.exports = { buddy, BUDDY_ART };
