/* ====== DATA + RENDERER ======
   Screens live in screens/<area>/<name>.js, flows in flows/<name>.js.
   Tap targets: `go` on widgets (see README). */
const SCREENS = [];
const FLOWS = [];
const AREAS = ["Today","Check-ins","Protocols","Voice"];
const TABSETS = {
  current: ["Home","Check-ins","Plans","Insights"],
  idea:    ["Today","Check-ins","🎙","Protocols","Insights"],
};
/* Tab name -> screen id, per tabset. Missing name = tab not linked yet. */
const TABLINKS = {
  current: { "Check-ins":"checkins/overview", "Plans":"protocols/day" },
  idea:    { "Today":"today/home", "Check-ins":"checkins/overview-next", "🎙":"voice/voice", "Protocols":"protocols/today-folds" },
};

const byId = id => SCREENS.find(s=>s.id===id);
const isSheet = id => !!(byId(id)||{}).sheet;
const tone = t => `var(--${t||"grey"})`;
const strip = s => String(s ?? "").replace(/<[^>]*>/g,"").replace(/\s+/g," ").trim();
const attr = s => strip(s).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;");
const goAt = (go,i) => Array.isArray(go) ? (go[i] ?? null) : (go ?? null);
const hot = (go,label) => go ? ` data-go="${attr(go)}" data-label="${attr(label)}"` : "";
const tag = (html,go,label) => go ? html.replace(/^<(\w+)/, m=>m+hot(go,label)) : html;
/* sheet header side: a lone glyph (‹ ×) gets class "g" (Play draws it as a 44 pt round button) */
const side = v => /^[‹×]$/.test(String(v||"").trim()) ? "side g" : "side";

/* score curve for a spark row: values on a fixed 0–10 scale (curves stay comparable), oldest → today.
   The line stretches with the row (non-scaling stroke); today's point is an HTML dot so it stays round. */
function curve(a, name){
  const n = a.length, y = v => 2 + (10 - Math.max(0, Math.min(10, +v))) * 2;          // viewBox 0 0 100 24, y 2…22
  const pts = a.map((v,i)=>`${n>1 ? +(i*100/(n-1)).toFixed(2) : 100},${y(v)}`);
  return `<span class="ln cv" role="img" aria-label="${attr(name)}, last ${n} days: ${a.join(", ")}">`
    + `<svg viewBox="0 0 100 24" preserveAspectRatio="none" aria-hidden="true">`
    + `<line class="cv-m" x1="0" y1="12" x2="100" y2="12"/>`                          // midline = 5
    + `<polyline class="cv-h" points="${pts.join(" ")}"/><polyline class="cv-l" points="${pts.join(" ")}"/></svg>`
    + `<i class="cv-p" style="top:${+(y(a[n-1])/24*100).toFixed(2)}%"></i></span>`;
}

function r(x){
  switch(x.t){
    case "head": {   // n: small line under the title; greet:true: Play swaps the title for a greeting that follows the time of day
      const b = `<b${x.greet?" data-greet":""}>${x.l}</b>`;
      return `<div class="head">${x.n?`<div class="hl">${b}<span class="n">${x.n}</span></div>`:b}${x.r?`<div class="circle"${hot(x.go,x.r)}>${x.r}</div>`:""}</div>`;
    }
    case "shead": return `<div class="shead"><span class="${side(x.left)}"${hot(x.goLeft,x.left)}>${x.left||""}</span><div><b>${x.l}</b>${x.n?`<span class="n">${x.n}</span>`:""}</div><span class="${side(x.right)}"${hot(x.goRight,x.right)}>${x.right||""}</span></div>`;
    case "big":   return tag(`<div class="big"><b>${x.l}</b>${x.n?`<span class="n">${x.n}</span>`:""}</div>`, x.go, x.l);
    case "row":   return `<div class="row">${x.items.map(r).join("")}</div>`;
    case "grid2": return `<div class="grid2">${x.items.map(r).join("")}</div>`;
    case "tile": {
      const chipGo = Array.isArray(x.go) ? x.go : null;
      let inner = `<div><div class="top"><span class="l">${x.l}</span>${x.r?`<span class="r">${x.r}</span>`:""}</div>${x.n?`<div class="n">${x.n}</div>`:""}</div>`;
      if(x.bar!==undefined) inner += `<div class="bar"><i style="width:${x.bar}%"></i></div>`;
      if(x.seg) inner += `<div class="row" style="margin-top:8px"><span class="pill" style="background:#fff;border:1px solid var(--line);text-align:center">${x.seg[0]}</span><span class="pill" style="text-align:center">${x.seg[1]}</span></div>`;
      if(x.chips) inner += `<div class="chips" style="margin-top:8px">${x.chips.map((c,i)=>`<span class="chip"${hot(goAt(chipGo,i),c)} style="background:${x.tone==="white"?"var(--grey)":"var(--white)"}">${c}</span>`).join("")}</div>`;
      if(x.foot) inner += `<div class="n" style="margin-top:8px">${x.foot}</div>`;
      if(x.spark) inner += `<div style="margin-top:6px">${x.spark.map(s=>`<div class="spark"><span class="nm">${s[0]}</span>${Array.isArray(s[2])?curve(s[2],s[0]):`<span class="ln"></span>`}<span class="v">${s[1]}</span></div>`).join("")}</div>`;
      if(x.heat) inner += `<div class="heat">${Array.from({length:30},(_,i)=>`<i class="${i<22?(i%7==3?'b':i==12?'c':'a'):''}"></i>`).join("")}</div>`;
      if(x.act) inner += `<div class="btn"${hot(x.go,x.act)}>${x.act}</div>`;   // act: button inside the tile, `go` belongs to it
      if(x.cta) inner += `<span class="ca" aria-hidden="true">→</span>`;          // cta: the whole tile reads as a button
      const cls = "tile" + (x.tone && x.tone!=="white" && x.tone!=="grey" ? " tint" : "") + (x.cta ? " cta" : "");
      return tag(`<div class="${cls}" style="background:${tone(x.tone)};${x.h?`min-height:calc(${x.h}px * var(--hs,1))`:""}">${inner}</div>`, chipGo||x.act?null:x.go, x.l);
    }
    /* slider: v = last value; drawn muted ("unchanged") until moved in Play (play.js). better: "high"|"low" */
    case "slider": {
      const min = x.min ?? 0, max = x.max ?? 10, v = x.v ?? min, p = (v-min)/(max-min)*100 + "%";
      return `<div class="slider" data-min="${min}" data-max="${max}" data-last="${v}" data-v="${v}">`
        + `<div class="st"><span class="l">${x.l}</span><span class="v"><s class="was"></s><b>${v}</b></span></div>`
        + `<div class="tr" role="slider" tabindex="0" aria-label="${attr(x.l)}" aria-valuemin="${min}" aria-valuemax="${max}" aria-valuenow="${v}">`
        + `<div class="rail"><i class="fill" style="width:${p}"></i><i class="last" style="left:${p}"></i><i class="knob" style="left:${p}"></i></div></div>`
        + `<div class="ends"><span>${x.lo ?? min}</span><span>${x.hi ?? max}</span></div></div>`;
    }
    case "trend": return tag(`<div class="tile trend" style="background:var(--white)"><span class="l">${x.l}</span><span class="n">— today</span><div class="dots"></div><div class="days">${"WTFSSMT".split("").map(d=>`<span>${d}</span>`).join("")}</div></div>`, x.go, x.l);
    case "sec":   return x.act
      ? `<div class="sec">${x.l}<span class="act"${hot(x.go,x.act)}>${x.act}</span></div>`
      : tag(`<div class="sec">${x.l}<span>${x.r||""}</span></div>`, x.go, x.l);
    case "fold":  return tag(`<div class="fold"><div class="ft"><span class="t"><i class="cv">${x.open?"⌄":"›"}</i> ${x.l}</span><span class="m">${x.m||""}</span>${x.a?`<span class="pill">${x.a}</span>`:""}</div>${(x.open||[]).map(i=>`<div class="item"><span class="${i[2]?"strike":""}">${i[0]}</span><span class="${i[2]?"strike":""}">${i[1]}</span></div>`).join("")}</div>`, x.go, x.l);
    case "chips": return `<div class="chips">${x.items.map((c,i)=>`<span class="chip"${hot(goAt(x.go,i),c)}>${c}</span>`).join("")}</div>`;
    case "pills": return `<div class="pills"${x.multi?" data-multi":""}>${x.items.map((c,i)=>`<span class="${(x.on||[]).includes(c)?"on":""}"${hot(goAt(x.go,i),c)}>${c}</span>`).join("")}</div>`;
    case "draft": return tag(`<div class="draft"><span>${x.l}</span><span class="pill">${x.a}</span></div>`, x.go, x.l);
    case "mic":   return tag(`<div class="mic">🎙</div>`, x.go, "🎙");
    case "spacer":return `<div class="spacer"></div>`;
    case "seg":   return `<div class="segrow"><div class="seg">${x.items.map((it,i)=>`<span class="${it===x.on?"on":""}"${hot(goAt(x.go,i),it)}>${it}</span>`).join("")}</div><span class="link"${hot(x.goRight,x.r)}>${x.r||""}</span></div>`;
    case "week": {
      const d="MTWTFSS".split(""); const dots=(x.dots||"").padEnd(7,"·");
      return tag(`<div class="week">${d.map((l,i)=>`<div class="${i===x.on?"on":""}">${l}<b>${x.start+i}</b><i class="${dots[i]==="o"?"d":""}"></i></div>`).join("")}</div>`, x.go, "week");
    }
    case "tl":    return `<div class="tl">${x.rows.map((o,i)=>`<div class="tlr"${hot(goAt(x.go,i),o[1])}><span class="s">${o[0]}</span><span class="rail"><div class="dot"></div></span><span>${o[1]}${o[2]?`<div class="n">${o[2]}</div>`:""}</span><span class="c">${o[3]?"›":""}</span></div>`).join("")}</div>`;
    case "list":  return `<div class="list">${x.rows.map((o,i)=>`<div class="item"${hot(goAt(x.go,i),o[0])}><span class="${o[2]==="strike"?"strike":""}">${o[0]}</span><span class="r ${o[2]==="acc"?"acc":""}">${o[1]||""}</span></div>`).join("")}</div>`;
    case "field": return tag(`<div class="field">${x.l?`<div class="lb">${x.l}</div>`:""}<div class="box ${x.tall?"tall":""}"><span>${x.v||""}</span><span>${x.suffix||""}</span></div></div>`, x.go, x.l||x.v);
    case "btn":   return tag(`<div class="btn ${x.light?"light":""}">${x.l}</div>`, x.go, x.l);
    case "toggle":return tag(`<div class="toggle"><span>${x.l}</span><i class="${x.on?"on":""}"></i></div>`, x.go, x.l);
    case "stepper":return tag(`<div class="stepper"><span>${x.l}</span><span class="v"><i>–</i>${x.v}<i>+</i></span></div>`, x.go, x.l);
    case "choice":return `<div class="choice">${x.items.map((o,i)=>`<div${hot(goAt(x.go,i),o[0])}><b>${o[0]}</b><span>${o[1]}</span></div>`).join("")}</div>`;
    case "doselist": return tag(`<div class="dl">${x.rows.map(o=>{
        if(o[0]==="input") return `<div class="dr"><span class="in">${o[1]}</span><span></span><span></span></div>`;
        const st=o[3]||""; return `<div class="dr ${st==="flag"?"flag":""}"><span>${o[0]}</span><span class="num">${o[1]}</span><span class="u ${st==="sugg"?"sugg":""}">${o[2]}</span>${o[4]?`<span class="hint">${o[4]}</span>`:""}</div>`;}).join("")}</div>`, x.go, "list");
    case "note":  return tag(`<div class="note ${x.danger?"danger":""}">${x.l}</div>`, x.go, x.l);
    case "weekgrid": {
      const cell = c => c==="●"?`<span>●</span>`:c==="○"?`<span class="x">○</span>`:c==="+"?`<span class="p">+</span>`:c==="-"?`<span class="f">·</span>`:`<span class="f"> </span>`;
      return tag(`<div class="wg"><div class="wr"><span></span>${"MTWTFSS".split("").map(d=>`<span>${d}</span>`).join("")}</div>${x.rows.map(o=>`<div class="wr"><span>${o[0]}</span>${o[1].split("").map(cell).join("")}</div>`).join("")}</div>`, x.go, "grid");
    }
  }
  return "";
}

/* All tap targets of a screen, in document order (= order of [data-go]:not([data-tab]) in the DOM).
   Tab bar links are not included. Each: {to, label, t} */
function linksOf(s){
  const out = [];
  const add = (to,label,t) => { if(to) out.push({to, label:strip(label), t}); };
  const walk = x => {
    switch(x.t){
      case "row": case "grid2": x.items.forEach(walk); return;
      case "head":  if(x.r) add(x.go, x.r, "head"); return;
      case "shead": add(x.goLeft, x.left, "shead"); add(x.goRight, x.right, "shead"); return;
      case "sec":   add(x.go, x.act||x.l, x.act?"act":"sec"); return;
      case "tile":  if(Array.isArray(x.go)) (x.chips||[]).forEach((c,i)=>add(goAt(x.go,i), c, "chips")); else if(x.act) add(x.go, x.act, "btn"); else add(x.go, x.l, "tile"); return;
      case "chips": case "pills": x.items.forEach((c,i)=>add(goAt(x.go,i), c, x.t)); return;
      case "seg":   x.items.forEach((c,i)=>add(goAt(x.go,i), c, "seg")); add(x.goRight, x.r, "seg"); return;
      case "choice":x.items.forEach((o,i)=>add(goAt(x.go,i), o[0], "choice")); return;
      case "list":  x.rows.forEach((o,i)=>add(goAt(x.go,i), o[0], "list")); return;
      case "tl":    x.rows.forEach((o,i)=>add(goAt(x.go,i), o[1], "tl")); return;
      case "mic":   add(x.go, "🎙", "mic"); return;
      case "week":  add(x.go, "week", "week"); return;
      case "weekgrid": add(x.go, "grid", "weekgrid"); return;
      case "doselist": add(x.go, "list", "doselist"); return;
      case "field": add(x.go, x.l||x.v, "field"); return;
      default:      add(x.go, x.l, x.t);
    }
  };
  (s ? s.w : []).forEach(walk);
  return out;
}
const tabLinks = s => s && s.tabs ? TABSETS[s.tabs].map(t=>({to:(TABLINKS[s.tabs]||{})[t], label:t})).filter(l=>l.to && l.to!==s.id) : [];

const tabbar = (set,on,self) => `<div class="tabs">${TABSETS[set].map(t=>{
  const to = (TABLINKS[set]||{})[t]; const h = to && to!==self ? hot(to,t)+" data-tab" : "";
  return t==="🎙" ? `<div class="fab"${h}>🎙</div>` : `<span class="${t===on?"on":""}"${h}>${t}</span>`;
}).join("")}</div>`;
/* play=true (Play only): trailing buttons are wrapped in .foot so the stage can pin them to the bottom.
   Library and Flows render without the wrapper. */
function screenInner(s, play){
  let k = s.w.length; if(play) while(k>0 && s.w[k-1].t==="btn") k--;
  const foot = k<s.w.length ? `<div class="foot">${s.w.slice(k).map(r).join("")}</div>` : "";
  return `${s.w.slice(0,k).map(r).join("")}${foot}${s.tabs?`<div class="spacer"></div>${tabbar(s.tabs,s.tab,s.id)}`:""}`;
}
const screenHTML = s => `<div class="phone ${s.sheet?"sheet":""}">${screenInner(s)}</div>`;
const conceptHTML = s => s.concept?`<div class="concept"><b>Concept</b><ol>${s.concept.map(c=>`<li>${c}</li>`).join("")}</ol></div>`:"";
const capHTML = s => `<p class="cap"><span>${s.title}</span><span class="badge ${s.status}">${s.status}</span></p>`;

function phone(s){
  const fid = (typeof flowOf==="function" && flowOf(s.id)) || "-";
  return `<div class="col" data-id="${s.id}">
    ${capHTML(s)}
    <p class="file">${s.id}<a class="playlink" href="#play/${fid}/${s.id}" title="Play from this screen">▶ play</a></p>
    ${screenHTML(s)}
    ${s.why?`<p class="why">${s.why}</p>`:""}${s.ref?`<p class="ref">ref: ${s.ref}</p>`:""}${conceptHTML(s)}
  </div>`;
}
const slug = a => a.toLowerCase().replace(/[^a-z]+/g,"-");
function renderAll(){
  const used = AREAS.filter(a=>SCREENS.some(s=>s.area===a));
  document.getElementById("nav").innerHTML = used.map(a=>`<a href="#library/${slug(a)}">${a}</a>`).join("");
  document.getElementById("out").innerHTML = used.map(a=>{
    const cur = SCREENS.filter(s=>s.area===a && s.status==="current");
    const idea = SCREENS.filter(s=>s.area===a && s.status==="idea");
    const side = (label, list) => `<div class="side"><p class="sidehead">${label}</p>
      <div class="grid">${list.length ? list.map(phone).join("") : `<p class="empty">nothing yet</p>`}</div></div>`;
    return `<section id="${slug(a)}"><h2>${a}</h2><div class="compare">${side("Current", cur)}${side("Proposed", idea)}</div></section>`;
  }).join("");
}

/* Every go value must be a screen id, "back" or "close". Returns a list of problems. */
function checkLinks(){
  const bad = [];
  SCREENS.forEach(s=>[...linksOf(s), ...tabLinks(s)].forEach(l=>{
    if(l.to!=="back" && l.to!=="close" && !byId(l.to)) bad.push(`${s.id}: "${l.label}" → ${l.to}`);
  }));
  FLOWS.forEach(f=>{ if(!byId(f.start)) bad.push(`flow ${f.id}: start ${f.start} missing`); });
  return bad;
}
if(typeof module!=="undefined") module.exports = { SCREENS, FLOWS, TABSETS, TABLINKS, linksOf, tabLinks, byId, isSheet, checkLinks, r, screenInner };
