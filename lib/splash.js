/* ====== SPLASH: the MEjority intro "Hands" (Play only; styles in lib/splash.css) ======
   A calm opening drawn inside the phone frame (full screen on a phone), seen from above onto a warm cream table top.
   Shapes, colours and composition are ported from the storyboard intro-storyboards/concepts/hands.mjs (viewBox 390×844).
   Timeline, about 6.6 s (storyboard stills at 0.4 · 1.6 · 2.9 · 4.2 · 5.6 s):
     0.05–1.35 s  one hand (apricot sleeve) slides in from below and comes to rest in the middle
     0.6 –2.6 s   four more hands glide in from all sides, each at its own pace
     2.6 –3.45 s  five hands lie stacked as a rosette; one breath, nothing moves
     3.45–5.4 s   the hands withdraw calmly; each leaves one dot in its sleeve colour
     4.85–5.6 s   the five dots stay as a ring, the wordmark "MEjority" appears below it
     6.0 –6.6 s   the whole intro fades into the app
   Slow ease-in-out only, no bounce, no zoom. Tap anywhere (or Esc / Enter / Space) skips with a short fade.
   prefers-reduced-motion: the finished last frame (dot ring + wordmark) for ~1 s, then a short fade, no movement.
   When it ends the element is removed from the DOM; the stage below is never touched.
   Splash.play() → Promise (resolves when gone) · Splash.skip() · Splash.auto(): once per page load, only if the
   page opened in Play (called from boot()). The "Intro" entry in the Play bar (#p-intro) plays it again. */
const Splash = (() => {
  const T = 6.6, FADE_AT = 6.0, STILL = 1000, OUT = 240, FADE_STILL = 320;
  const RM = matchMedia("(prefers-reduced-motion: reduce)");
  let cur = null, autoDone = false, uid = 0;

  /* ---------- drawing, ported from intro-storyboards/concepts/hands.mjs + kit.mjs ---------- */
  const W = 390, H = 844;
  const FONT = "ui-rounded,'SF Pro Rounded','Fredoka','Nunito',system-ui,sans-serif";
  const TABLE = "#FFF2DF", INK = "#2F6B6A", SHADOW = "#7A4A2B";
  const C = { x:195, y:356 };                    // where the hands meet; later the centre of the ring of dots
  const RING = 32, DOT = 14, REST = 68, TURN = 5, HS = 1.14;
  const rad = d => d * Math.PI / 180, f = v => +(+v).toFixed(2);

  /* in order of arrival, once around the table; theta = the side the arm comes from (0 = right, 90 = below).
     Timing per hand (s): in = arrival [start, end], at = storyboard radius at 1.6 s (start is solved from it);
     out = departure start, gone = storyboard radius at 4.2 s (end is solved from it); wob = a small settling turn (°). */
  const ARMS = [
    { theta: 90, skin:"#F0C29A", line:"#D39A70", sleeve:"#FFAF57", cuff:"#FFD49B", rib:"#F3973A",
      in:[0.05, 1.35], out:3.55, at4:136, wob: 0 },                                           // apricot, from below (the first one)
    { theta:162, skin:"#8E5B3C", line:"#6C4027", sleeve:"#8ACDA7", cuff:"#C8ECD6", rib:"#67B58A", bands:"mint",
      in:[null, 2.25], at2:118, out:3.5,  at4:130, wob: 3 },                                  // mint, from the left
    { theta:234, skin:"#BF8253", line:"#9C643A", sleeve:"#DC9DCA", cuff:"#F1CFE7", rib:"#C67DB1",
      in:[null, 2.45], at2:150, out:3.62, at4:140, wob:-2.5 },                                // lilac rosé, from the top left
    { theta:306, skin:"#E2AB7C", line:"#C1875A", sleeve:"#98A2EE", cuff:"#CDD2FA", rib:"#7985DE",
      in:[null, 2.6],  at2:186, out:3.45, at4:134, wob: 2 },                                  // periwinkle, from the top right
    { theta: 18, skin:"#F3CFAE", line:"#DBA683", sleeve:"#3F8785", cuff:"#84BBB7", rib:"#2F6B6A", bands:"teal",
      in:[null, 2.4],  at2:160, out:3.68, at4:128, wob:-3 },                                  // teal, from the right
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
  const bands = a => a.bands === "mint" ? `<g fill="${a.cuff}"><rect x="-31" y="34" width="62" height="7"/><rect x="-31" y="48" width="62" height="7"/></g>`
    : a.bands === "teal" ? `<g fill="#5B9693">${Array.from({ length:12 }, (_, i) => `<rect x="-31" y="${34 + i * 30}" width="62" height="9"/>`).join("")}</g>` : "";
  const silhouette = `${SLEEVE}${CUFF}${THUMB}<path d="${MITTEN}"/>`;
  const body = a => `<g fill="${a.sleeve}">${SLEEVE}</g>${bands(a)}`
    + `<g fill="${a.skin}">${THUMB}<path d="${MITTEN}"/></g>`
    + `<g stroke="${a.line}" stroke-width="2.4" stroke-linecap="round" fill="none">${FINGERS}<path d="M -22 -30 Q -17 -22 -19 -10" opacity=".8"/></g>`
    + `<g fill="${a.cuff}">${CUFF}</g><g stroke="${a.rib}" stroke-width="2" stroke-linecap="round" opacity=".55">`
    + [-22, -11, 0, 11, 22].map(x => `<line x1="${x}" y1="0" x2="${x}" y2="12"/>`).join("") + "</g>";
  /* r = distance of the palm from the meeting point, w = extra turn in degrees */
  const place = (a, r, w) => `translate(${C.x} ${C.y}) rotate(${f(a.theta + TURN - 90 + w)}) translate(0 ${f(r + 50 * HS)}) scale(${HS})`;

  /* ---------- motion ---------- */
  function bezier(x1, y1, x2, y2){                       // CSS cubic-bezier as a function of progress 0..1
    const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx, cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
    const X = s => ((ax * s + bx) * s + cx) * s, Y = s => ((ay * s + by) * s + cy) * s, dX = s => (3 * ax * s + 2 * bx) * s + cx;
    return u => {
      if(u <= 0) return 0; if(u >= 1) return 1;
      let s = u;
      for(let i = 0; i < 8; i++){ const e = X(s) - u, d = dX(s); if(Math.abs(e) < 1e-6 || Math.abs(d) < 1e-6) break; s -= e / d; }
      let lo = 0, hi = 1; if(Math.abs(X(s) - u) > 1e-4){ s = u; for(let i = 0; i < 30; i++){ X(s) < u ? lo = s : hi = s; s = (lo + hi) / 2; } }
      return Y(s);
    };
  }
  const ARRIVE = bezier(.3, .4, .22, 1);                // a hand being laid down: unhurried, long soft settle
  const LEAVE = bezier(.5, 0, .72, .62);                // a hand lifted away: gentle start, no stop at the edge
  const SOFT = bezier(.42, 0, .58, 1);                  // dots, wordmark and the final fade
  const clamp = v => v < 0 ? 0 : v > 1 ? 1 : v;
  const span = (t, a, b) => clamp((t - a) / (b - a));

  /* the radius at which a hand (and its shadow) is fully off the 390×844 table */
  function offRadius(a){
    const pts = [];
    for(let x = -46; x <= 38; x += 12) for(let y = -102; y <= 26; y += 16) pts.push([x, y]);
    const ang = rad(a.theta + TURN - 90), cs = Math.cos(ang), sn = Math.sin(ang), m = 6;
    for(let r = REST; r < 1200; r += 4){
      const hit = pts.some(([px, py]) => {
        const lx = px * HS, ly = r + 50 * HS + py * HS;
        const X = C.x + lx * cs - ly * sn, Y = C.y + lx * sn + ly * cs;
        return X > -m && X < W + m && Y > -m && Y < H + 7 + m;
      });
      if(!hit) return r + 8;
    }
    return 1200;
  }
  /* solve the free start (arrival) and end (departure) of every hand so it sits at the storyboard radius at 1.6 s and 4.2 s */
  function solve(lo, hi, g){ for(let i = 0; i < 50; i++){ const m = (lo + hi) / 2; g(m) ? hi = m : lo = m; } return (lo + hi) / 2; }
  ARMS.forEach(a => {
    a.off = offRadius(a);
    const e = a.in[1];
    if(a.in[0] == null) a.in[0] = solve(-1, 1.59, s => a.off - (a.off - REST) * ARRIVE((1.6 - s) / (e - s)) > a.at2);
    const s = a.out;
    a.gone = solve(4.21, 9, end => REST + (a.off - REST) * LEAVE((4.2 - s) / (end - s)) < a.at4);
  });
  /* palm radius and settling turn of hand a at time t */
  function pose(a, t){
    if(t < a.out){ const p = ARRIVE(span(t, a.in[0], a.in[1])); return [a.off - (a.off - REST) * p, a.wob * (1 - p) * (1 - p)]; }
    const p = LEAVE(span(t, a.out, a.gone)); return [REST + (a.off - REST) * p, -a.wob * .6 * p];
  }

  /* ---------- markup ---------- */
  function markup(n){
    const first = ARMS[0], tf = place(first, REST, 0);
    const arm = (a, k) => `<g transform="translate(0 7)" fill="${SHADOW}" data-sh="${k}"><g data-k="${k}" transform="${tf}">${silhouette}</g></g>`
      + `<g data-k="${k}" transform="${tf}">${body(a)}</g>`;
    const L = ARMS.length - 1;
    const lastShape = `<rect data-k="${L}" x="-31" y="2" width="62" height="900"/><rect data-k="${L}" x="-36" y="-7" width="72" height="26" rx="11"/>`
      + `<ellipse data-k="${L}" data-post=" rotate(-30 -31 -27)" cx="-31" cy="-27" rx="9.5" ry="21"/><path data-k="${L}" d="${MITTEN}"/>`;
    const dots = ARMS.map((a, k) => {
      const x = f(C.x + RING * Math.cos(rad(a.theta))), y = f(C.y + RING * Math.sin(rad(a.theta)));
      return `<circle data-dot="${k}" cx="${x}" cy="${y}" r="${DOT}" fill="${a.sleeve}" opacity="0" style="transform-origin:${x}px ${y}px"/>`;
    }).join("");
    /* The rosette: painting in order puts the last hand on the first, so the first is painted once more, only its half
       next to the last one (and its shadow only where it falls on the last arm). Kept live, so it is right at every moment. */
    return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">`
      + `<defs><clipPath id="sp${n}-half"><rect data-k="0" x="0" y="-400" width="400" height="800"/></clipPath>`
      + `<clipPath id="sp${n}-last">${lastShape}</clipPath></defs>`
      + `<rect width="${W}" height="${H}" fill="${TABLE}"/>`
      + dots
      + ARMS.map(arm).join("")
      + `<g clip-path="url(#sp${n}-half)"><g clip-path="url(#sp${n}-last)"><g transform="translate(0 7)" fill="${SHADOW}" data-sh="0"><g data-k="0">${silhouette}</g></g></g>`
      + `<g data-k="0">${body(first)}</g></g>`
      + `<text class="sp-word" x="${C.x}" y="${C.y + RING + DOT + 77}" text-anchor="middle" font-family="${FONT}" font-size="72" fill="${INK}" opacity="0">`
      + `<tspan font-weight="700">ME</tspan><tspan font-weight="500">jority</tspan></text></svg>`;
  }

  /* one picture of the timeline at time t (seconds) */
  function draw(c, t){
    const poses = ARMS.map(a => pose(a, t));
    c.parts.forEach(p => {
      const [r, w] = poses[p.k];
      if(p.r === r && p.w === w) return; p.r = r; p.w = w;
      p.el.setAttribute("transform", place(ARMS[p.k], r, w) + p.post);
    });
    c.shadows.forEach(s => {                             // the shadow is a touch deeper while the hands lie on each other
      const [r] = poses[s.k], near = 1 - clamp((r - REST) / 60);
      s.el.setAttribute("opacity", f((t < ARMS[s.k].out ? .16 : .14) + (t < ARMS[s.k].out ? .04 : .06) * near));
    });
    c.dots.forEach((d, k) => {                           // each dot is left where its hand lay, and shows as the hand lifts
      const p = SOFT(span(t, ARMS[k].out + .05, ARMS[k].out + .55));
      d.setAttribute("opacity", f(p));
      d.style.transform = `scale(${f(.86 + .14 * p)})`;
    });
    const w = SOFT(span(t, 4.85, 5.6));
    c.word.setAttribute("opacity", f(w));
    c.word.setAttribute("transform", `translate(0 ${f(10 * (1 - w))})`);
    if(!c.leaving) c.el.style.opacity = f(1 - SOFT(span(t, FADE_AT, T)));
  }

  function host(){ return document.querySelector("#v-play .frame") || document.querySelector(".frame") || document.body; }

  function play(opts){
    if(cur) return cur.promise;
    const el = document.createElement("div");
    el.className = "splash";
    el.setAttribute("role", "img"); el.setAttribute("aria-label", "MEjority");
    el.innerHTML = markup(++uid);
    const c = { el, leaving:false, t:0, raf:0 };
    c.parts = [...el.querySelectorAll("[data-k]")].map(e => ({ el:e, k:+e.dataset.k, post:e.dataset.post || "" }));
    c.shadows = [...el.querySelectorAll("[data-sh]")].map(e => ({ el:e, k:+e.dataset.sh }));
    c.dots = [...el.querySelectorAll("[data-dot]")];
    c.word = el.querySelector(".sp-word");
    const still = RM.matches;
    draw(c, still ? 5.9 : 0);
    ((opts && opts.host) || host()).appendChild(el);

    let resolve; c.promise = new Promise(r => resolve = r); c.resolve = resolve;
    cur = c;
    c.key = e => { if(e.key === "Escape" || e.key === "Enter" || e.key === " "){ e.preventDefault(); skip(); } };
    el.addEventListener("click", e => { e.preventDefault(); e.stopPropagation(); skip(); });
    document.addEventListener("keydown", c.key);
    if(still) c.t = setTimeout(() => fade(c, FADE_STILL), STILL);
    else {
      const t0 = performance.now();
      const tick = now => {
        if(c.over || c.leaving) return;
        const t = (now - t0) / 1000;
        if(t >= T){ done(c); return; }
        draw(c, t);
        c.raf = requestAnimationFrame(tick);
      };
      c.raf = requestAnimationFrame(tick);
      c.t = setTimeout(() => done(c), T * 1000 + 400);       // fallback (background tab: no animation frames)
    }
    if(opts && typeof opts.done === "function") c.promise.then(opts.done);
    return c.promise;
  }

  function done(c){
    if(c.over) return; c.over = true;
    clearTimeout(c.t); clearTimeout(c.t2); cancelAnimationFrame(c.raf);
    document.removeEventListener("keydown", c.key);
    c.el.remove();
    if(cur === c) cur = null;
    c.resolve();
  }
  /* fade from wherever the timeline is (the picture freezes), then remove */
  function fade(c, d){
    if(c.leaving || c.over) return; c.leaving = true;
    clearTimeout(c.t); cancelAnimationFrame(c.raf);
    c.el.style.pointerEvents = "none";
    const from = getComputedStyle(c.el).opacity;
    try {
      const a = c.el.animate([{ opacity:from }, { opacity:0 }], { duration:d, easing:"ease-out", fill:"forwards" });
      a.onfinish = () => done(c);
    } catch(_){ c.el.style.opacity = 0; }
    c.t2 = setTimeout(() => done(c), d + 120);                // fallback (no WAAPI, background tab)
  }
  function skip(){ if(cur) fade(cur, OUT); }

  function auto(){
    if(autoDone) return; autoDone = true;
    if(document.body.classList.contains("v-play")) play();
  }

  /* "Intro" in the Play bar (on a phone it sits in the ••• Menu, which is closed first) */
  document.addEventListener("click", e => {
    if(!e.target.closest || !e.target.closest("#p-intro")) return;
    e.preventDefault();
    document.body.classList.remove("pbar-open");
    const h = document.getElementById("p-handle"); if(h) h.setAttribute("aria-expanded", false);
    if(cur) skip();
    (cur ? cur.promise : Promise.resolve()).then(() => play());
  });

  return { play, skip, auto, get playing(){ return !!cur; } };
})();
