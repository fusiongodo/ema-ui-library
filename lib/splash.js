/* ====== SPLASH: the MEjority intro (Play only; styles and timeline in lib/splash.css) ======
   A calm opening drawn inside the phone frame (full screen on a phone): sky and cartoon clouds, the ME plaque,
   "jority" beside it, then the clouds part and it fades into the app. About 3.5 s. Tap anywhere (or Esc / Enter /
   Space) skips. prefers-reduced-motion: the finished wordmark for ~1 s, then a short fade. When it ends the element
   is removed from the DOM; the stage below is never touched.
   Splash.play() → Promise (resolves when gone) · Splash.skip() · Splash.auto(): once per page load, only if the
   page opened in Play (called from boot()). The "Intro" entry in the Play bar (#p-intro) plays it again. */
const Splash = (() => {
  const T = 3500, STILL = 1000, OUT = 240, FADE_STILL = 320;
  const RM = matchMedia("(prefers-reduced-motion: reduce)");
  let cur = null, autoDone = false;

  /* one cloud = the same puffs twice: a tinted underside, and the face lifted 7 units so a soft band shows below */
  const PUFFS = [[48,70,30],[88,52,40],[132,58,32],[162,74,24],[26,84,18]];
  const puffs = flip => PUFFS.map(([x,y,r])=>`<circle cx="${flip ? 200-x : x}" cy="${y}" r="${r}"/>`).join("")
    + '<rect x="20" y="66" width="160" height="40" rx="20"/>';
  const cloud = (cls, face, shade, flip) => `<i class="sp-c ${cls}"><svg viewBox="0 0 200 110" aria-hidden="true">`
    + `<g fill="${shade}">${puffs(flip)}</g><g fill="${face}" transform="translate(0 -7)">${puffs(flip)}</g></svg></i>`;
  const W = "#ffffff", WS = "#d6e2fb", P = "#fff1ec", PS = "#f9d9dc";
  const RAYS = '<svg class="sp-rays" viewBox="-50 -50 100 100" aria-hidden="true"><g stroke="#ffc43f" stroke-width="6" stroke-linecap="round">'
    + [-190,-155,-120,-85,-50].map(a=>`<line x1="0" y1="-36" x2="0" y2="-46" transform="rotate(${a+90})"/>`).join("") + "</g></svg>";
  const MARKUP = '<div class="sp-sky"></div>'
    + cloud("s1", W, WS) + cloud("s2", W, WS, true) + cloud("s3", W, WS)
    + '<div class="sp-pos"><div class="sp-word">'
    +   `<div class="sp-mark"><i class="sp-sun">${RAYS}</i><b class="sp-plaque">ME</b></div>`
    +   '<span class="sp-rest">' + [..."jority"].map(c=>`<i>${c}</i>`).join("") + "</span>"
    + "</div></div>"
    + cloud("b1", P, PS) + cloud("b2", P, PS, true) + cloud("b3", W, WS) + cloud("b4", W, WS, true) + cloud("b5", W, WS);

  function host(){ return document.querySelector("#v-play .frame") || document.querySelector(".frame") || document.body; }

  function play(opts){
    if(cur) return cur.promise;
    const el = document.createElement("div");
    el.className = "splash pre";
    el.setAttribute("role", "img"); el.setAttribute("aria-label", "MEjority");
    el.innerHTML = MARKUP;
    ((opts && opts.host) || host()).appendChild(el);
    // the plaque starts centred on its own: shift it right by half of what follows it ("jority" + gap)
    const rest = el.querySelector(".sp-rest");
    el.style.setProperty("--dx", ((rest.offsetWidth + (parseFloat(getComputedStyle(rest).marginLeft) || 0)) / 2) + "px");
    const still = RM.matches;
    el.classList.remove("pre");
    if(still) el.classList.add("still");

    let resolve; const promise = new Promise(r=>resolve = r);
    const c = cur = { el, promise, resolve, leaving:false, t:0 };
    const key = e=>{ if(e.key==="Escape" || e.key==="Enter" || e.key===" "){ e.preventDefault(); skip(); } };
    c.key = key;
    el.addEventListener("click", e=>{ e.preventDefault(); e.stopPropagation(); skip(); });
    document.addEventListener("keydown", key);
    c.t = still ? setTimeout(()=>fade(c, FADE_STILL), STILL) : setTimeout(()=>done(c), T);
    if(opts && typeof opts.done === "function") promise.then(opts.done);
    return promise;
  }

  function done(c){
    if(c.over) return; c.over = true;
    clearTimeout(c.t); clearTimeout(c.t2);
    document.removeEventListener("keydown", c.key);
    c.el.remove();
    if(cur===c) cur = null;
    c.resolve();
  }
  /* fade from wherever the timeline is (script animations sit above the CSS ones, so no jump), then remove */
  function fade(c, d){
    if(c.leaving) return; c.leaving = true;
    clearTimeout(c.t);
    c.el.style.pointerEvents = "none";
    const from = getComputedStyle(c.el).opacity;
    try {
      const a = c.el.animate([{opacity:from},{opacity:0}], {duration:d, easing:"ease-out", fill:"forwards"});
      a.onfinish = () => done(c);
    } catch(_){ c.el.style.opacity = 0; }
    c.t2 = setTimeout(()=>done(c), d + 120);                      // fallback (no WAAPI, background tab)
  }
  function skip(){ if(cur) fade(cur, OUT); }

  function auto(){
    if(autoDone) return; autoDone = true;
    if(document.body.classList.contains("v-play")) play();
  }

  /* "Intro" in the Play bar (on a phone it sits in the ••• Menu, which is closed first) */
  document.addEventListener("click", e=>{
    if(!e.target.closest || !e.target.closest("#p-intro")) return;
    e.preventDefault();
    document.body.classList.remove("pbar-open");
    const h = document.getElementById("p-handle"); if(h) h.setAttribute("aria-expanded", false);
    if(cur) skip();
    (cur ? cur.promise : Promise.resolve()).then(()=>play());
  });

  return { play, skip, auto, get playing(){ return !!cur; } };
})();
