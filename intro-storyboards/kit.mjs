/* Optional helpers for concept modules (concepts/<id>.mjs). A module may ignore this file and build its SVG strings by hand;
   build.mjs only looks at the module's default export. */

export const W = 390, H = 844;

/* the wordmark font stack; single quotes so it fits inside a double-quoted SVG attribute */
export const FONT = "ui-rounded,'SF Pro Rounded','Fredoka','Nunito',system-ui,sans-serif";

/* app palette (lib/cozy.css): the five area colours, cream and ink */
export const PAL = {
  apricot: "#FFD49B", mint: "#BDE5CC", periwinkle: "#C5CBF7", rose: "#EDC8E2", teal: "#2F6B6A",
  cream: "#FFF2DF", ink: "#17302F",
};

export const f = v => +(+v).toFixed(2);
export const rad = d => d * Math.PI / 180;

/* small seeded random generator, so every build draws the same picture */
export function rng(seed){
  return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}

/* one still: a complete 390×844 SVG string */
export function frame(label, inner){
  return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label}">${inner}</svg>`;
}

/* the wordmark every concept ends on: one word, ME bold, jority lighter, one colour, one baseline; no plaque, no icon */
export const WORDMARK_SIZE = 72;
export function wordmark({ y, fill, x = W / 2, size = WORDMARK_SIZE, opacity = 1 }){
  return `<text x="${f(x)}" y="${f(y)}" text-anchor="middle" font-family="${FONT}" font-size="${size}" fill="${fill}"`
    + `${opacity < 1 ? ` opacity="${opacity}"` : ""}><tspan font-weight="700">ME</tspan><tspan font-weight="500">jority</tspan></text>`;
}
