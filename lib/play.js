/* ====== PLAY: one clickable phone ======
   State: hist = stack of screen ids. Visible = last non-sheet screen (base) + the top sheet, if any.
   All navigation is in memory (works in sandboxed embeds); the hash is only mirrored via setHash(). */
const Play = (() => {
  const P = { flow:null, hist:[] };
  let baseEl = null, sheetEl = null;
  const $ = id => document.getElementById(id);
  const RM = matchMedia("(prefers-reduced-motion: reduce)");
  const DUR = () => RM.matches ? 0 : 230;
  const EASE = "cubic-bezier(.2,.8,.2,1)";
  const last = a => a[a.length-1];
  const hashFor = sid => `#play/${P.flow}/${sid}`;

  /* ----- themes (Play only; styles in lib/themes.css): data-theme, data-tod and, except for "wire", class .soft
     on the phone frame. Library and Flows stay plain wireframes. Choice kept in localStorage (best effort). ----- */
  // Sky, Dusk, Meadow set aside (21 Nov 2026): CSS and code kept, add "sky","dusk","meadow" back here and in the #p-theme select to restore
  const THEMES = ["cozy","studio","wire"], TODS = ["auto","morning","noon","evening","night"];
  const TH = { theme:"cozy", tod:"auto" };
  const cozy = () => TH.theme === "cozy" && typeof Cozy !== "undefined";   // Cozy: lib/cozy.js decorates each painted layer
  const DECO = ["cozy","studio"];                                          // Studio (lib/studio.css) is a skin on Cozy's decorator
  const deco = () => DECO.includes(TH.theme) && typeof Cozy !== "undefined";
  try { const t = localStorage.getItem("wf-theme"), d = localStorage.getItem("wf-tod");
        if(THEMES.includes(t)) TH.theme = t; if(TODS.includes(d)) TH.tod = d; } catch(_){}
  const soft = () => TH.theme !== "wire";
  const motion = () => soft() && !RM.matches;                 // new motion exists only in the soft themes
  function phase(){                                          // time of day: chosen (Sky only), else from the clock
    if((TH.theme === "sky" || TH.theme === "cozy") && TH.tod !== "auto") return TH.tod;
    const h = new Date().getHours();
    return h>=5 && h<11 ? "morning" : h>=11 && h<17 ? "noon" : h>=17 && h<21 ? "evening" : "night";
  }
  const GREET = { morning:"Good morning", noon:"Good afternoon", evening:"Good evening", night:"Good evening" };
  const greet = root => { root.querySelectorAll("[data-greet]").forEach(b=>{ b.textContent = GREET[phase()]; });
    if(deco()) Cozy.tod(root, phase()); };                    // the companion sleeps at night
  function theme(){
    const f = document.querySelector("#v-play .frame"); if(!f) return;
    const tod = phase();
    if(f.dataset.theme !== TH.theme) f.dataset.theme = TH.theme;
    if(f.dataset.tod !== tod) f.dataset.tod = tod;
    f.classList.toggle("soft", soft());
    $("p-theme").value = TH.theme; $("p-tod").value = TH.tod; $("p-todl").hidden = TH.theme !== "sky" && TH.theme !== "cozy";
    greet($("stage"));
  }
  function pick(k, v){
    const was = TH[k]; TH[k] = v; try { localStorage.setItem("wf-"+k, v); } catch(_){} theme();
    if(k==="theme" && was!==v && (DECO.includes(was) || DECO.includes(v)) && P.hist.length) apply(P.hist, "fresh");   // Cozy / Studio redraw the layers
  }

  /* cards of a freshly painted layer rise a little, staggered. Resting state = visible: the keyframes only run
     from a softened start, nothing is hidden by CSS. A group of sliders moves as one card. */
  function rise(el, d0){
    const dy = TH.theme==="dusk" ? 6 : 12;
    let i = -1;
    [...el.children].forEach(c=>{
      if(c.matches(".tabs,.foot,.spacer,.rv.cmp,.say.live + .slider,.say.live + .pills")) return;   // these have their own delayed entry (style.css)
      if(!(c.matches(".slider") && c.previousElementSibling && c.previousElementSibling.matches(".slider"))) i++;
      c.animate([{transform:`translateY(${dy}px)`, opacity:.35},{transform:"none", opacity:1}],
        {duration:300, delay:d0 + Math.min(i,9)*30, easing:EASE, fill:"backwards"});
    });
  }
  /* soft confirmation after a sheet's final button (Save, Add to …): one ring of light spreads from the button */
  function halo(btn){
    const f = btn.closest(".frame"); if(!f) return;
    const fr = f.getBoundingClientRect(), b = btn.getBoundingClientRect(), k = fr.width / f.offsetWidth || 1;
    const el = document.createElement("i"); el.className = "halo";
    el.style.left = (b.left + b.width/2 - fr.left)/k + "px"; el.style.top = (b.top + b.height/2 - fr.top)/k + "px";
    if(cozy()){ const w = btn.closest("[data-world]");                                    // Cozy: small sparks in the sheet's world
      Cozy.sparkle(f, parseFloat(el.style.left), parseFloat(el.style.top), w && w.dataset.world); return; }
    f.appendChild(el);
    const a = el.animate([{transform:"translate(-50%,-50%) scale(.12)", opacity:0},{opacity:1, offset:.18},
      {transform:"translate(-50%,-50%) scale(1)", opacity:0}], {duration:1100, easing:"cubic-bezier(.2,.7,.3,1)"});
    a.onfinish = a.oncancel = () => el.remove();
  }

  function anim(el, kf, after){
    const d = DUR();
    if(d) el.animate(kf, {duration:d, easing:EASE});
    if(after){ el.classList.add("leaving"); setTimeout(after, d ? d+20 : 0); }
  }
  const s0 = id => !!byId(id);
  const vis = h => {
    const top = last(h), sheet = top && isSheet(top) ? top : null;
    let base = null; for(let i=h.length-1;i>=0;i--) if(!isSheet(h[i])){ base = h[i]; break; }
    const below = sheet && byId(sheet).sheet==="half" && h.length>1 ? h[h.length-2] : null;
    const under = below && isSheet(below) && byId(below).sheet!=="half" ? below : null;   // a full sheet stays visible under a half-height one
    return {base, sheet, under};
  };
  let underEl = null;
  function layer(id, sheet){
    const el = document.createElement("div");
    const s = byId(id);
    el.className = "phone layer" + (sheet ? " sheet" : "") + (s && s.sheet==="half" ? " half" : "") + (s ? "" : " blank");
    el.dataset.id = id || "";
    el.innerHTML = s ? screenInner(s, true) : "<span>no screen below</span>";
    if(s && deco()) Cozy.decorate(el, s, TH.theme);   // Studio: Cozy's decorator plus its own pass (clay icons)
    greet(el);
    return el;
  }

  function paint(oldH, newH, kind){
    const stage = $("stage"), dim = stage.querySelector(".dim");
    stage.querySelectorAll(".leaving").forEach(e=>e.remove());
    const o = vis(oldH), n = vis(newH);
    if(typeof Cozy !== "undefined") stage.closest(".frame").dataset.world = Cozy.worldOf(n.base || n.sheet);   // colour world of the page (Cozy); a sheet layer carries its own
    let dir = "fwd";
    if(kind==="fresh") dir = "none";
    else if(kind==="tab" || kind==="swap" || kind==="same") dir = "fade";
    else if(newH.length < oldH.length && oldH.slice(0,newH.length).join() === newH.join()) dir = "back";
    const X = dir==="back" ? -1 : 1;
    const IN = soft() ? 10 : 28, OUT = soft() ? 5 : 14;     // soft themes: shorter slide, the cards rise instead

    if(!baseEl || o.base!==n.base || kind==="fresh"){
      const el = layer(n.base, false), old = baseEl;
      stage.insertBefore(el, dim); baseEl = el;
      if(motion() && s0(n.base)) rise(el, 0);
      if(old){
        if(dir==="none") old.remove();
        else if(dir==="fade"){ anim(el,[{opacity:0},{opacity:1}]); anim(old,[{opacity:1},{opacity:0}],()=>old.remove()); }
        else { anim(el,[{transform:`translateX(${IN*X}%)`,opacity:0},{transform:"none",opacity:1}]);
               anim(old,[{transform:"none",opacity:1},{transform:`translateX(${-OUT*X}%)`,opacity:0}],()=>old.remove()); }
      }
    }
    if(o.sheet!==n.sheet || o.under!==n.under || kind==="fresh"){
      let old = sheetEl, keep = null; sheetEl = null;
      if(kind!=="fresh" && n.under && n.under===o.sheet && old){            // a half-height sheet opens over a full one: that one stays, under the dim
        old.classList.add("under"); old.style.zIndex = ""; underEl = old; old = null;
      } else if(underEl && (kind==="fresh" || n.under!==o.under)){
        const u = underEl; underEl = null;
        if(kind!=="fresh" && n.sheet===o.under){ u.classList.remove("under"); keep = u; }   // the half-height one closes: the full one is on top again
        else if(dir==="none") u.remove(); else anim(u,[{opacity:1},{opacity:0}],()=>u.remove());
      }
      if(n.under && !underEl){ underEl = layer(n.under, true); underEl.classList.add("under"); stage.insertBefore(underEl, dim); }   // deep link, restart
      if(keep){
        sheetEl = keep;
        if(old){ const o2 = old; if(dir==="none") o2.remove(); else anim(o2,[{transform:"none"},{transform:"translateY(100%)"}],()=>o2.remove()); }
      } else if(n.sheet){
        const el = layer(n.sheet, true); stage.appendChild(el); sheetEl = el;
        if(kind==="ret") el.classList.add("ret");                 // returned to: its cards do not enter again
        if(motion() && kind!=="same") rise(el, old ? 0 : 70);
        if(old && kind==="ret"){                                  // saved: the sheet goes down, the screen below shows its new state
          anim(el,[{opacity:0},{opacity:1}]); old.style.zIndex = 5; const o2 = old; anim(o2,[{transform:"none"},{transform:"translateY(100%)"}],()=>o2.remove());
        } else if(old && dir==="fade"){                           // auto-advance / swap: the content changes in place
          anim(el,[{opacity:0},{opacity:1}]); anim(old,[{opacity:1},{opacity:0}],()=>old.remove());
        } else if(old && dir!=="none" && old.classList.contains("half") !== el.classList.contains("half")){
          // half ↔ full height: the taller sheet slides up over / down from the lower one
          const up = el.classList.contains("half") ? dir==="back" : dir!=="back";
          if(up){ el.style.zIndex = 5; anim(el,[{transform:"translateY(100%)"},{transform:"none"}]); anim(old,[{opacity:1},{opacity:0}],()=>old.remove()); }
          else { anim(el,[{opacity:0},{opacity:1}]); old.style.zIndex = 5; anim(old,[{transform:"none"},{transform:"translateY(100%)"}],()=>old.remove()); }
        } else if(old && dir!=="none"){
          anim(el,[{transform:`translateX(${100*X}%)`},{transform:"none"}]);
          anim(old,[{transform:"none",opacity:1},{transform:`translateX(${-30*X}%)`,opacity:0}],()=>old.remove());
        } else {
          if(old) old.remove();
          if(dir!=="none") anim(el,[{transform:"translateY(100%)"},{transform:"none"}]);
        }
      } else if(old){
        if(dir==="none") old.remove();
        else anim(old,[{transform:"none"},{transform:"translateY(100%)"}],()=>old.remove());
      }
    }
    dim.classList.toggle("on", !!n.sheet);
    const top = byId(last(newH));
    $("p-id").textContent = last(newH);
    $("p-back").disabled = newH.length < 2;
    $("p-map").href = P.flow && flowById(P.flow) ? `#flows/${P.flow}` : "#flows";
    $("pinfo").innerHTML = top ? `${capHTML(top)}<p class="file">${top.id}${top.sheet?" · sheet":""}</p>
      ${top.why?`<p class="why">${top.why}</p>`:""}${top.ref?`<p class="ref">ref: ${top.ref}</p>`:""}${conceptHTML(top)}` : "";
    document.title = (top ? top.title+" · " : "") + "Play";
    const pt = document.querySelector('.views a[data-v="play"]'); if(pt) pt.href = hashFor(last(newH));
  }

  /* ----- navigation: replace the stack, repaint, mirror the hash (best effort) ----- */
  function apply(h, kind){
    const old = P.hist; P.hist = h;
    paint(old, h, kind);
    setHash(hashFor(last(h)));
    autoArm();
  }
  /* after:[ms, id] on a screen (Play only): move on by itself after ms, replacing the screen (it was a passing state,
     so Back does not return to it). A tap on the screen moves on at once; touching it first (a slider) only stops the
     clock. Reduced motion: no clock, a tap only. */
  let autoT = null;
  const autoStop = () => { clearTimeout(autoT); autoT = null; };
  function autoArm(){
    autoStop();
    const s = byId(last(P.hist)); if(!s || !s.after || RM.matches) return;
    autoT = setTimeout(()=>{ autoT = null; if(last(P.hist)===s.id && !$("v-play").hidden) swap(s.after[1]); }, s.after[0]);
  }
  /* of:"id" (screen) = a later state of that screen (voice/drafts-1: the drafts with the check-in confirmed). A link to it
     returns to where that screen, or another state of it, stands in the stack and replaces it: the sheets above go down and
     Back does not revisit them. On the top screen itself it changes in place (fade, nothing rises). Not in the stack: a plain link. */
  const fam = id => (byId(id) || {}).of || id;
  function ret(to){
    const f = (byId(to) || {}).of; if(!f) return false;
    for(let k = P.hist.length-1; k>=0; k--) if(fam(P.hist[k])===f){
      apply([...P.hist.slice(0,k), to], k===P.hist.length-1 ? "same" : "ret"); return true; }
    return false;
  }
  const swap = to => { if(byId(to) && !ret(to)) apply([...P.hist.slice(0,-1), to], "swap"); };
  const back = () => { if(P.hist.length>1) apply(P.hist.slice(0,-1)); };
  function close(){
    let k = P.hist.length-1; while(k>0 && isSheet(P.hist[k])) k--;
    if(k<P.hist.length-1) apply(P.hist.slice(0,k+1));
  }
  /* kind: "tab" (tab bar: fade), "swap" (a segment: Today ↔ All, fade, replaces the screen so the stack does not grow) */
  function go(to, kind){
    if(to==="back") return back();
    if(to==="close") return close();
    if(!byId(to)) return;
    if(kind==="swap") return swap(to);
    if(ret(to)) return;
    apply([...P.hist, to], kind ? "tab" : null);
  }
  function restart(){
    const f = flowById(P.flow);
    if(f && byId(f.start)) apply(pathTo(f.id, f.start), "fresh");          // a flow that starts with a sheet gets its page below
    else if(P.hist[0]) apply([P.hist[0]], "fresh");
  }

  /* ----- clicks inside the phone ----- */
  function flash(){
    const st = $("stage"); st.classList.remove("flash"); void st.offsetWidth; st.classList.add("flash");
    clearTimeout(flash.t); flash.t = setTimeout(()=>st.classList.remove("flash"), 800);
  }
  function local(t){
    if(t.closest(".slider")) return true;                 // handled by the pointer events below
    const fold = t.closest(".fold");
    if(fold){
      const items = fold.querySelectorAll(".item");
      const open = !(fold.dataset.open ? fold.dataset.open==="1" : items.length>0);
      fold.dataset.open = open ? "1" : "0";
      items.forEach(i=>i.style.display = open ? "" : "none");
      fold.querySelector(".cv").textContent = open ? "⌄" : "›"; return true; }
    const tg = t.closest(".toggle"); if(tg){ tg.querySelector("i").classList.toggle("on"); return true; }
    const day = t.closest(".cal [data-d]");                // intake calendar: the tapped day names itself below the grid
    if(day){ const c = day.closest(".cal"); c.querySelectorAll(".sel").forEach(x=>x.classList.remove("sel")); day.classList.add("sel");
      const say = c.querySelector(".cal-say"); say.textContent = day.dataset.d; say.classList.add("on"); return true; }
    const grp = t.closest(".pl .pg");                      // protocol list: a group row unfolds its items
    if(grp){ grp.classList.toggle("open"); return true; }
    const pt = t.closest(".cpw [data-d]");                 // comparison: a tapped day names its date and value below
    if(pt){ const c = pt.closest(".cpw"); c.querySelectorAll(".sel").forEach(x=>x.classList.remove("sel")); pt.classList.add("sel");
      const say = c.querySelector(".cpw-say"); say.textContent = pt.dataset.d; say.classList.add("on"); return true; }
    const fr = t.closest(".fill .fl-r");                   // fill plan (trial helper): a tap ticks a box off
    if(fr){ fr.classList.toggle("done"); fr.setAttribute("aria-checked", fr.classList.contains("done")); return true; }
    const oc = t.closest(".org .og-c, .checks .ck-r");     // organizer compartment / checklist row (trial helper): toggles its tick
    if(oc){ oc.classList.toggle("done"); oc.setAttribute("aria-checked", oc.classList.contains("done")); return true; }
    const mh = t.closest(".more-h");                       // Details: unfolds the numbers in place
    if(mh){ const m = mh.closest(".more"); m.classList.toggle("open"); return true; }
    const pill = t.closest(".pills span");
    if(pill){ if(pill.parentElement.hasAttribute("data-multi")) pill.classList.toggle("on");
      else { pill.parentElement.querySelectorAll("span").forEach(x=>x.classList.remove("on")); pill.classList.add("on"); }
      /* review card: the button names the chosen times. Pills in a picker sheet (protocols/pick-when) also write back into
         the card row that opened it (the row whose go is this sheet) and that card's button. */
      const pl = pill.closest(".layer"), on = [...pill.parentElement.querySelectorAll("span.on")].map(x=>x.textContent);
      const opener = !pill.closest(".rv") && pl && [...$("stage").querySelectorAll(`.layer:not(.leaving) .rv-r[data-go="${pl.dataset.id}"]`)].find(r=>!pl.contains(r));
      const card = pill.closest(".rv") ? pl : opener && opener.closest(".layer"), sb = card && card.querySelector(".btn[data-slots]");
      if(opener && opener.querySelector(".rv-v")) opener.querySelector(".rv-v").textContent = on.length ? on.join(" + ") : "—";
      if(sb) sb.textContent = on.length ? "Add to " + on.join(" + ") : "Add";
      const lm = pill.closest(".lm");                      // score chart: the chip picks the series
      if(lm){ const k = String([...pill.parentElement.children].indexOf(pill));
        lm.querySelectorAll("[data-s]").forEach(e=>e.classList.toggle("off", e.dataset.s !== k));
        lm.querySelector(".lm-name").textContent = pill.textContent; }
      return true; }
    const sg = t.closest(".seg span"); if(sg){ sg.parentElement.querySelectorAll("span").forEach(x=>x.classList.remove("on")); sg.classList.add("on"); return true; }
    const ch = t.closest(".choice > div"); if(ch){ ch.parentElement.querySelectorAll(":scope > div").forEach(x=>x.classList.remove("on")); ch.classList.add("on"); return true; }
    return false;
  }

  /* ----- sliders (visual only): a tap sets the value, a horizontal drag moves it.
     The track has touch-action:pan-y, so a vertical swipe stays a scroll of the sheet (the browser cancels the pointer).
     A touched slider gets .moved: strong value, dark fill, a tick at the last value and "was N". ----- */
  function slide(sl, v){
    const min = +sl.dataset.min, max = +sl.dataset.max, last = +sl.dataset.last;
    v = Math.max(min, Math.min(max, Math.round(v)));
    const p = (v-min)/(max-min)*100 + "%";
    sl.dataset.v = v; sl.classList.add("moved"); sl.classList.remove("heard");   // the user's own move replaces what was heard
    sl.querySelector(".fill").style.width = p; sl.querySelector(".knob").style.left = p;
    sl.querySelector(".v b").textContent = v;
    sl.querySelector(".was").textContent = v===last ? "" : `was ${last}`;
    sl.querySelector(".tr").setAttribute("aria-valuenow", v);
  }
  function slideTo(sl, clientX){
    const b = sl.querySelector(".rail").getBoundingClientRect(), min = +sl.dataset.min, max = +sl.dataset.max;
    slide(sl, min + Math.max(0, Math.min(1, (clientX - b.left) / b.width)) * (max - min));
  }
  function wireSliders(stage){
    let d = null;                                         // {tr, sl, id, x, y, on}
    stage.addEventListener("pointerdown", e=>{
      const tr = e.target.closest(".slider .tr");
      if(!tr || e.target.closest(".leaving") || (e.pointerType==="mouse" && e.button!==0)) return;
      d = {tr, sl:tr.closest(".slider"), id:e.pointerId, x:e.clientX, y:e.clientY, on:false};
      if(e.pointerType==="mouse"){ d.on = true; d.sl.classList.add("drag"); e.preventDefault(); tr.setPointerCapture(e.pointerId); slideTo(d.sl, e.clientX); }
    });
    stage.addEventListener("pointermove", e=>{
      if(!d || e.pointerId!==d.id) return;
      if(!d.on){
        const dx = Math.abs(e.clientX-d.x), dy = Math.abs(e.clientY-d.y);
        if(dx < 6 || dx <= dy) return;                    // not (yet) a horizontal drag
        d.on = true; d.sl.classList.add("drag"); try { d.tr.setPointerCapture(e.pointerId); } catch(_){}
      }
      slideTo(d.sl, e.clientX);
    });
    const end = e=>{ if(d && e.pointerId===d.id){ d.sl.classList.remove("drag"); d = null; } };   // .drag: soft glow on the thumb (themes)
    stage.addEventListener("pointerup", end);
    stage.addEventListener("click", e=>{                  // tap (fires for taps, not for drags or scrolls)
      const tr = e.target.closest(".slider .tr");
      if(tr && !e.target.closest(".leaving")){ const sl = tr.closest(".slider"); slideTo(sl, e.clientX);
        if(!sl.classList.contains("drag")){ sl.classList.add("drag"); setTimeout(()=>sl.classList.remove("drag"), 450); } }
    });
    stage.addEventListener("pointercancel", end);                                              // vertical pan took over
    stage.addEventListener("keydown", e=>{
      const tr = e.target.closest && e.target.closest(".slider .tr"); if(!tr) return;
      const k = {ArrowLeft:-1, ArrowDown:-1, ArrowRight:1, ArrowUp:1}[e.key]; if(!k) return;
      e.preventDefault(); const sl = tr.closest(".slider"); slide(sl, +sl.dataset.v + k);
    });
  }

  /* ----- desktop/tablet: scale the 390×844 phone into the free height (and width) of this document's viewport.
     Uses clientHeight, not 100vh, so it fits inside foreign iframes and below a host's own header. ≤600px: CSS fills the screen. ----- */
  const W = 390, H = 844, RIM = 7, SMALL = matchMedia("(max-width:600px)");   // RIM: bezel drawn outside the 390×844 screen
  function fit(){
    const wrap = $("pwrap"), box = $("fbox");
    if(!wrap || !box || $("v-play").hidden) return;
    if(SMALL.matches){ wrap.style.removeProperty("--ps"); return; }
    const de = document.documentElement, bs = getComputedStyle(document.body);
    const top = box.getBoundingClientRect().top + window.scrollY;       // header + bar above the phone
    const freeH = de.clientHeight - top - (parseFloat(bs.paddingBottom) || 0);
    const freeW = de.clientWidth - (parseFloat(bs.paddingLeft) || 0) - (parseFloat(bs.paddingRight) || 0);
    const s = Math.max(.3, Math.min(1, freeH / (H + RIM), freeW / (W + 2 * RIM)));
    wrap.style.setProperty("--ps", (Math.floor(s * 1e4) / 1e4).toString());
  }

  let wired = false;
  function wire(){
    if(wired) return; wired = true;
    addEventListener("resize", fit);
    if(window.ResizeObserver) new ResizeObserver(fit).observe($("pbar"));   // bar re-wraps → free height changes
    $("stage").addEventListener("click", e=>{
      if(e.target.closest(".leaving")) return;
      const cl = e.target.closest(".rv-cl");                // clarity sign: one line on how sure the agent is (not the card's link)
      if(cl){ const on = cl.closest(".rv").classList.toggle("cl-on"); cl.setAttribute("aria-expanded", on); return; }
      const h = e.target.closest("[data-go]");
      if(h){ e.preventDefault();
        const to = h.dataset.go;
        if(motion() && h.classList.contains("btn") && h.closest(".layer.sheet") && (to==="close" || (byId(to) && (!isSheet(to) || byId(to).of)))) halo(h);
        go(to, h.hasAttribute("data-tab") ? "tab" : h.closest(".seg") ? "swap" : null); return; }
      const top = byId(last(P.hist)), L = e.target.closest(".layer");
      if(top && top.after && L && L.dataset.id===top.id){ if(!local(e.target)) swap(top.after[1]); return; }   // tap = move on now
      if(e.target.closest(".dim")){ if(top && top.sheet==="half") back(); else flash(); return; }   // tap on the dimmed page: a half-height sheet closes (iOS)
      if(!local(e.target)) flash();
    });
    $("stage").addEventListener("keydown", e=>{ const cl = e.target.closest && e.target.closest(".rv-cl");
      if(cl && (e.key==="Enter" || e.key===" ")){ e.preventDefault(); cl.click(); } });
    $("stage").addEventListener("pointerdown", e=>{ if(autoT && e.target.closest(".layer:not(.leaving)")) autoStop(); });
    wireSliders($("stage"));
    $("p-back").onclick = back;
    $("p-restart").onclick = restart;
    let on = false; try { on = localStorage.getItem("wf-hotspots")==="1"; } catch(_){}
    $("p-hot").checked = on; $("stage").classList.toggle("showhot", on);
    $("p-hot").onchange = e=>{ $("stage").classList.toggle("showhot", e.target.checked);
      try { localStorage.setItem("wf-hotspots", e.target.checked ? "1" : "0"); } catch(_){} };
    $("p-theme").onchange = e=>pick("theme", e.target.value);
    $("p-tod").onchange = e=>pick("tod", e.target.value);
    setInterval(theme, 60000);                                                   // auto time follows the clock
    theme();
    $("p-handle").onclick = ()=>$("p-handle").setAttribute("aria-expanded", document.body.classList.toggle("pbar-open"));
  }

  /* ----- entry from the router ----- */
  function show(flowId, sid){
    wire(); fit();
    if(!sid){
      const f = flowById(flowId) || (P.hist.length ? null : FLOWS[0]);
      if(!f && P.hist.length){ setHash(hashFor(last(P.hist))); return; }   // bare "Play" tab: resume
      if(!f){ $("p-id").textContent = "no flows"; return; }
      flowId = f.id; sid = f.start;
    }
    if(!byId(sid)){ $("p-id").textContent = `unknown screen: ${sid}`; return; }
    if(P.flow===flowId && last(P.hist)===sid){ setHash(hashFor(sid)); return; }   // already there: keep the stack
    P.flow = flowId;
    apply(pathTo(flowId, sid), "fresh");
  }
  function leave(){ autoStop(); document.body.classList.remove("pbar-open"); $("p-handle").setAttribute("aria-expanded", false); }
  return { show, leave, go, back, close, restart, state:P, theme:TH };
})();
