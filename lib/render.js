/* ====== DATA + RENDERER ======
   Screens live in screens/<area>/<name>.js, flows in flows/<name>.js.
   Tap targets: `go` on widgets (see README). */
const SCREENS = [];
const FLOWS = [];
const AREAS = ["Today","Check-ins","Protocols","Insights","Voice"];
const TABSETS = {
  current: ["Home","Check-ins","Plans","Insights"],
  idea:    ["Today","Check-ins","🎙","Protocols","Insights"],
};
/* Tab name -> screen id, per tabset. Missing name = tab not linked yet. */
const TABLINKS = {
  current: { "Check-ins":"checkins/overview", "Plans":"protocols/day" },
  idea:    { "Today":"today/home", "Check-ins":"checkins/overview-next", "🎙":"voice/listen", "Protocols":"protocols/today-folds", "Insights":"insights/home" },
};

const byId = id => SCREENS.find(s=>s.id===id);
const isSheet = id => !!(byId(id)||{}).sheet;
const tone = t => `var(--${t||"grey"})`;
/* the mic: one minimal line icon (the drawing of the Cozy tab bar), never the emoji. A 🎙 in any label or text is drawn as
   this icon (screenInner) and left out of labels and aria text (strip), in every view and theme. */
const MIC_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="3.6" width="6" height="10.8" rx="3" fill="currentColor" fill-opacity=".16"/><path d="M5.9 11.4a6.1 6.1 0 0 0 12.2 0M12 17.6v2.8M9.2 20.4h5.6"/></svg>`;
const MIC = `<i class="ico cz-g" data-ic="mic">${MIC_SVG}</i>`;
const MIC_RE = /🎙[︎️]?/gu;
const strip = s => String(s ?? "").replace(/<[^>]*>/g,"").replace(MIC_RE,"").replace(/\s+/g," ").trim();
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

/* dates for cal / linemarks: ISO "2026-09-14" in UTC (no time zones, no DST), label "Tue 28 Oct" */
const DAY = 864e5, WDAY = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"], MON = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const isoT = s => Date.parse(s + "T00:00:00Z");
const dayLabel = t => { const d = new Date(t); return `${WDAY[d.getUTCDay()]} ${d.getUTCDate()} ${MON[d.getUTCMonth()]}`; };

/* intake calendar: one string per week (Mon → Sun), oldest first; the last character of the last week is today.
   A letter from `key` = taken, key = {letter: [tap label, size relative to the usual dose, legend label | false]};
   "o" = planned but skipped (ring); "." = not planned (small pale dot). Play: a tapped day names itself below. */
function cal(x){
  const t0 = isoT(x.from), W = x.weeks, key = x.key || {}, last = W.length - 1, idle = x.idle || "not planned";
  let i = 0, prevM = -1;
  const rows = W.map((wk, r)=>{
    const m = new Date(t0 + r*7*DAY).getUTCMonth();                 // month label where a week starts in a new month
    const ml = m !== prevM ? MON[m] : ""; prevM = m;
    const cells = Array.from({length:7}, (_, c)=>{
      const ch = wk[c]; if(ch === undefined || ch === " ") return `<span class="f"></span>`;   // future
      const now = r === last && c === wk.length - 1, k = key[ch];
      const kind = k ? "t" : ch === "o" ? "o" : "n", say = k ? k[0] : ch === "o" ? "skipped" : idle;
      return `<span class="${kind}${now?" now":""}" data-d="${attr((now ? "Today" : dayLabel(t0 + (r*7+c)*DAY)) + " · " + say)}" style="--i:${i++}${k?`;--s:${k[1]}`:""}"><i></i></span>`;
    }).join("");
    return `<div class="cr"><span class="cm">${ml}</span>${cells}</div>`;
  }).join("");
  const has = ch => W.some(w=>w.includes(ch));
  const leg = Object.entries(key).filter(([ch,k])=>k[2] !== false && has(ch)).map(([,k])=>`<span><i class="t" style="--s:${k[1]}"></i>${k[2] || k[0]}</span>`).join("")
    + (has("o") ? `<span><i class="o"></i>skipped</span>` : "") + (has(".") ? `<span><i class="n"></i>${idle}</span>` : "");
  return `<div class="cal"><div class="cr ch"><span></span>${"MTWTFSS".split("").map(d=>`<span>${d}</span>`).join("")}</div>${rows}`
    + `<div class="cal-say">Tap a day</div><div class="cal-leg">${leg}</div></div>`;
}

/* score line with marks: series = [[name, one digit per day from `from` to today ("a" = 10, "." = none)], …],
   fixed 0–10 scale; marks = ["2026-10-06", …] (thin line per intake) or [["2026-10-12","dose changed"]] (labelled).
   The chips above switch the series in Play; Library and Flows show series `on`.
   Insights extras: avg = ["2026-10-12"] splits the weeks at these dates, each part gets a flat line at its average
   (per series, labelled); q = a question as the card's title (a pinned answer); say = one sentence under the chart. */
function linemarks(x){
  const S = x.series, on = x.on || 0, n = S[0][1].length, t0 = isoT(x.from);
  const X = i => n > 1 ? +(i*100/(n-1)).toFixed(2) : 100, Y = v => +(2 + (10 - v) * 3.6).toFixed(2);   // viewBox 0 0 100 40
  const val = c => c === "a" ? 10 : +c;
  const di = d => Math.round((isoT(d) - t0) / DAY);
  const marks = (x.marks || []).map(m=>Array.isArray(m) ? {i:di(m[0]), l:m[1]} : {i:di(m)});
  const months = []; for(let i=0;i<n;i++){ const d = new Date(t0 + i*DAY); if(i===0 || d.getUTCDate()===1) months.push({i, l:MON[d.getUTCMonth()]}); }
  const al = p => p < 8 ? "l" : p > 92 ? "r" : "";
  const lines = S.map(([nm, s], k)=>{
    const pts = s.split("").map((c,i)=>c === "." ? null : `${X(i)},${Y(val(c))}`).filter(Boolean).join(" ");
    return `<polyline class="lm-l${k===on?"":" off"}" data-s="${k}" points="${pts}"/>`;
  }).join("");
  const dots = S.map(([, s], k)=>`<i class="lm-p${k===on?"":" off"}" data-s="${k}" style="top:${+(Y(val(s[n-1]))/40*100).toFixed(2)}%"></i>`).join("");
  const cuts = x.avg ? [0, ...x.avg.map(di), n] : [], avg = [];
  S.forEach(([, s], k)=>{ for(let j=0;j<cuts.length-1;j++){
    const a = cuts[j], b = cuts[j+1] - 1, v = s.slice(a, b+1).split("").filter(c=>c !== ".").map(val);
    if(v.length) avg.push({k, a, b, m:v.reduce((p,q)=>p+q, 0) / v.length});
  } });
  const avgL = avg.map(o=>`<line class="lm-av${o.k===on?"":" off"}" data-s="${o.k}" x1="${X(o.a)}" y1="${Y(o.m)}" x2="${X(o.b)}" y2="${Y(o.m)}"/>`).join("");
  const avgT = avg.map(o=>`<span class="lm-al${o.k===on?"":" off"}" data-s="${o.k}" style="left:${X((o.a+o.b)/2)}%;top:${+(Y(o.m)/40*100).toFixed(2)}%">${o.m.toFixed(1)}</span>`).join("");
  return `<div class="lm${avg.length?" av":""}"><div class="pills lm-c">${S.map(([nm],k)=>`<span class="${k===on?"on":""}">${nm}</span>`).join("")}</div>`
    + `<div class="lm-card">${x.q?`<div class="lm-q">${x.q}</div>`:""}<div class="lm-h"><b class="lm-name">${S[on][0]}</b> · ${x.n || ""}</div>`
    + `<div class="lm-plot"><span class="lm-y"><i>10</i><i>5</i><i>0</i></span><div class="lm-a" role="img" aria-label="${attr(x.n)}">`
    + `<svg viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true"><line class="lm-g" x1="0" y1="20" x2="100" y2="20"/>`
    + months.filter(m=>m.i).map(m=>`<line class="lm-g" x1="${X(m.i)}" y1="0" x2="${X(m.i)}" y2="40"/>`).join("")
    + marks.map(m=>`<line class="lm-m${m.l?" lb":""}" x1="${X(m.i)}" y1="${m.l?0:2}" x2="${X(m.i)}" y2="40"/>`).join("")
    + `<g class="lm-s">${lines}${avgL}</g></svg>`
    + marks.map(m=>m.l ? `<span class="lm-ml ${al(X(m.i))}" style="left:${X(m.i)}%">${m.l}</span>` : `<i class="lm-md" style="left:${X(m.i)}%"></i>`).join("")
    + avgT + dots + `</div></div>`
    + `<div class="lm-x">${months.map(m=>`<span class="${al(X(m.i))}" style="left:${X(m.i)}%">${m.l}</span>`).join("")}</div>`
    + `${x.say?`<p class="lm-say">${x.say}</p>`:""}</div></div>`;
}

/* pattern: one finding in one plain sentence. n = how often / how long ("Seen 4 times"), conf = hint | likely | strong
   (a quiet word), src = the area the finding comes from (Cozy: icon tile in that area's world, PRINCIPLES 9).
   big:true = the evidence screen's title: the sentence large, the word and n as one line under it. */
function pattern(x){
  const c = x.conf ? `<span class="pa-c" data-c="${x.conf}">${x.conf}</span>` : "";
  if(x.big) return `<div class="pa big"><b class="pa-l">${x.l}</b><span class="pa-m">${c}${x.n ? `<span>${x.n}</span>` : ""}</span></div>`;
  return tag(`<div class="pa" data-src="${x.src || ""}"><i class="pa-ic" aria-hidden="true"></i><span class="pa-t"><b class="pa-l">${x.l}</b>`
    + `<span class="pa-m">${x.n ? `<span>${x.n}</span>` : ""}${c}</span></span><span class="c">${x.go ? "›" : ""}</span></div>`, x.go, x.l);
}

/* compare: two groups of days on the same 0–10 scale, one dot per day, a bar at each average, the difference big.
   a = {l, v:[values], d:[day labels]} (few days, large dots, tappable in Play: date and value below),
   b = {l, v:"digits"} (many days, small dots, three per row at each value). Inline SVG, scales as a whole. */
function compare(x){
  const A = x.a, B = x.b, vb = String(B.v).split("").filter(c=>c !== ".").map(c=>c === "a" ? 10 : +c);
  const mean = a => a.reduce((p,q)=>p+q, 0) / a.length, ma = mean(A.v), mb = mean(vb), d = ma - mb;
  const X = v => +(16 + v * 28.8).toFixed(1), W = 320;                   // value 0 … 10 → x 16 … 304
  const cnt = {}, ca = {};
  const ptsB = vb.map(v=>{ const k = cnt[v] = (cnt[v] || 0) + 1, col = (k - 1) % 3, row = Math.floor((k - 1) / 3);
    return `<circle class="cpw-b" cx="${X(v) + (col - 1) * 8}" cy="${160 - row * 8}" r="3.3"/>`; }).join("");
  const ptsA = A.v.map((v, i)=>{ const k = ca[v] = (ca[v] || 0) + 1, cy = 66 - (k - 1) * 15, lab = `${(A.d || [])[i] || ""} · ${x.l.toLowerCase()} ${v}`;
    return `<g class="cpw-pt" data-d="${attr(lab)}"><circle class="cpw-hit" cx="${X(v)}" cy="${cy}" r="12"/><circle class="cpw-a" cx="${X(v)}" cy="${cy}" r="6.5"/></g>`; }).join("");
  const ticks = Array.from({length:11}, (_, v)=>`<line class="cpw-t" x1="${X(v)}" y1="176" x2="${X(v)}" y2="${v % 5 ? 179 : 181}"/>`).join("")
    + [0, 5, 10].map(v=>`<text class="cpw-x" x="${X(v)}" y="195" text-anchor="middle">${v}</text>`).join("");
  const f = v => v.toFixed(1), dd = (d >= 0 ? "+" : "−") + Math.abs(d).toFixed(1);
  const svg = `<svg class="cpw-p" viewBox="0 0 ${W} 200" role="img" aria-label="${attr(`${A.l}: average ${f(ma)}. ${B.l}: average ${f(mb)}. Difference ${dd}.`)}">`
    + `<text class="cpw-rl" x="0" y="14">${A.l}</text><text class="cpw-rv" x="${W}" y="14" text-anchor="end">avg ${f(ma)}</text>`
    + `<text class="cpw-rl" x="0" y="100">${B.l}</text><text class="cpw-rv" x="${W}" y="100" text-anchor="end">avg ${f(mb)}</text>`
    + `<line class="cpw-ax" x1="${X(0)}" y1="176" x2="${X(10)}" y2="176"/>${ticks}`
    + `<line class="cpw-g" x1="${X(ma)}" y1="80" x2="${X(ma)}" y2="168"/>`                       // the first average carried down
    + ptsB + `<line class="cpw-m b" x1="${X(mb)}" y1="110" x2="${X(mb)}" y2="168"/>`
    + `<line class="cpw-m" x1="${X(ma)}" y1="24" x2="${X(ma)}" y2="76"/>` + ptsA + `</svg>`;
  return `<div class="cpw"><div class="cpw-h"><span class="cpw-t1"><b>${x.l}</b>${x.n ? `<span class="n">${x.n}</span>` : ""}</span>`
    + `<span class="cpw-d"><b>${dd}</b><span class="n">${d >= 0 ? "higher" : "lower"}</span></span></div>${svg}`
    + `<div class="cpw-say">Tap one of the ${A.v.length} days</div></div>`;
}

/* more: a quiet line of actions; the first (l) unfolds rows of numbers and a sentence (Play starts folded, Library shows
   it open). act = a second quiet action beside it (goAct = its target). */
function more(x){
  const rows = (x.rows || []).map(([k, v])=>`<div class="item"><span>${k}</span><span class="r">${v}</span></div>`).join("");
  return `<div class="more"><div class="more-a"><span class="more-h">${x.l}<i aria-hidden="true">⌄</i></span>`
    + `${x.act ? `<span class="more-x"${hot(x.goAct, x.act)}>${x.act} ›</span>` : ""}</div>`
    + `<div class="more-b">${rows}${x.n ? `<p class="more-n">${x.n}</p>` : ""}</div></div>`;
}

/* protocol list: rows = [name, sub, last 14 days, go, kids]. Days: "x" taken, "h" smaller dose, "o" planned but
   skipped, "." not planned. kids = [[name, sub, go], …] makes the row a group that unfolds (Play; open in Library). */
const strip14 = s => s ? `<span class="ps" aria-label="last 14 days">${s.split("").map(c=>`<i class="${c==="x"?"x":c==="h"?"h":c==="o"?"o":""}"></i>`).join("")}</span>` : `<span class="ps"></span>`;
function plist(x){
  return `<div class="pl">${x.rows.map(o=>{
    const [nm, sub, days, go, kids] = o;
    const row = `<div class="plr${kids?" pg":""}"${hot(go,nm)}><span class="pt"><b>${nm}</b>${sub?`<span class="n">${sub}</span>`:""}</span>${strip14(days)}<span class="c">${kids||go?"›":""}</span></div>`;
    return kids ? row + `<div class="pk">${kids.map(k=>`<div class="plr k"${hot(k[2],k[0])}><span class="pt"><b>${k[0]}</b>${k[1]?`<span class="n">${k[1]}</span>`:""}</span><span class="ps"></span><span class="c">${k[2]?"›":""}</span></div>`).join("")}</div>` : row;
  }).join("")}</div>`;
}

/* review card: one card per action, the overview the manual steps and the voice agent both end in.
   rows = [[label, value, state, go, quote]]; state: "" normal · "default" (the default value, drawn muted) · "heard" (filled in by the
   agent, its words below in quotes) · "unsure" (agent not sure: "?" and `quote` as the hint) · "empty" (still open: `value`
   is the muted prompt). A value can be a widget ({t:"pills", …}): drawn full width under the label, editable in place.
   compact:true = the folded form for the listening layer: title + one summary line (`n`), `go` = the whole card.
   tone:"neutral" = a card that belongs to no area (a note). icon = Cozy icon name when the area's own does not fit ("stack").
   Voice extras: clarity = how sure the agent is (a small sky sign right in the head, `hint` = the line a tap shows in Play);
   ok:true = a confirmed draft (compact: a tick, drawn back, no longer a link); a row's 6th element = go of a small mic in the
   row (say the missing part now, for "empty" / "unsure" rows); live = [ms, …] parallel to rows: Play fills that row in after
   ms (dots until then; reduced motion: at once); ask = go of a quiet "Ask me instead" at the bottom of the card. */
const SKY_CLOUD = `<path d="M8 22.4a4 4 0 0 1-.4-7.98 6 6 0 0 1 11.3-1.42 4.6 4.6 0 0 1 1.1 9.4z" fill="#EEF2F8" stroke="#7F8FA6" stroke-width="1.7" stroke-linejoin="round"/>`;
const SKY_SUN = (cx, cy, r, rays) => `<g stroke="#E9A21B" stroke-width="2" stroke-linecap="round">${rays.map(a=>{ const c = Math.cos(a*Math.PI/180), s = Math.sin(a*Math.PI/180);
  return `<line x1="${+(cx+c*(r+2.6)).toFixed(2)}" y1="${+(cy+s*(r+2.6)).toFixed(2)}" x2="${+(cx+c*(r+5)).toFixed(2)}" y2="${+(cy+s*(r+5)).toFixed(2)}"/>`; }).join("")}</g>`
  + `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#FFC83D" stroke="#E9A21B" stroke-width="1.6"/>`;
const SKY = {   // 28 grid, fixed colours (a signal, PRINCIPLES 8): clear = sun · partly = sun half behind a cloud · cloudy = cloud
  clear:  SKY_SUN(14, 14, 5.4, [0,45,90,135,180,225,270,315]),
  partly: SKY_SUN(17.4, 10.6, 4.8, [-90,-45,0,-135]) + `<g transform="translate(-1.6 2.6)">${SKY_CLOUD}</g>`,
  cloudy: `<g transform="translate(14 14) scale(1.12) translate(-14 -16)">${SKY_CLOUD}</g>`,
};
const CLARITY = { clear:["Clearly heard","Everything was said clearly"], partly:["Partly worked out","Part of it was worked out, not said"],
  cloudy:["Mostly guessed","Most of it was guessed, please check"] };
function review(x){
  const cls = "rv" + (x.compact ? " cmp" : "") + (x.tone ? " rv-" + x.tone : "") + (x.ok ? " ok" : ""), ic = x.icon ? ` data-icon="${x.icon}"` : "";
  const cl = !x.ok && CLARITY[x.clarity], hint = cl ? x.hint || cl[1] : "";
  const sky = cl ? `<span class="rv-cl" data-cl="${x.clarity}" role="button" tabindex="0" aria-expanded="false" aria-label="${attr(cl[0] + ". " + hint)}">`
    + `<svg viewBox="0 0 28 28" aria-hidden="true">${SKY[x.clarity]}</svg></span>` : "";
  const end = x.ok ? `<span class="rv-ok" aria-label="confirmed">✓</span>` : x.compact && x.go ? `<span class="c">›</span>` : "";
  const head = `<div class="rv-h"><span class="rv-t"><b>${x.title}</b>${x.n?`<span class="n">${x.n}</span>`:""}</span>${sky}${end}</div>`
    + (cl ? `<div class="rv-cn">${hint}</div>` : "");
  if(x.compact) return tag(`<div class="${cls}"${ic}${x.ok && x.go ? ` data-to="${attr(x.go)}"` : ""}>${head}</div>`, x.ok ? null : x.go, x.title);   // data-to: its area (Cozy colour), not a link
  const rows = (x.rows || []).map(([l, v, st, go, q, say], i)=>{
    const wide = !!v && typeof v === "object", at = (x.live || [])[i];
    const val = wide ? r(v) : `<span class="rv-v">${v ?? ""}${st==="unsure" ? `<i class="rv-qm" aria-label="not sure">?</i>` : ""}</span>`;
    const quote = q ? `<span class="rv-q">${st==="heard" ? `“${q}”` : q}</span>` : "";
    const wait = at ? `<span class="rv-wait" aria-hidden="true"><i></i><i></i><i></i></span>` : "";
    const mic = say ? `<span class="rv-say"${hot(say, "Say it")} role="button" aria-label="Say it">${MIC}</span>` : "";
    return `<div class="rv-r${st ? " rv-" + st : ""}${wide ? " wide" : ""}${say ? " has-say" : ""}${at ? " rv-live" : ""}"${hot(go, l)}${at ? ` style="--at:${at}ms"` : ""}>`
      + `<span class="rv-l">${l}</span>${val}${wait}<span class="c">${go ? "›" : ""}</span>${quote}${mic}</div>`;
  }).join("");
  const ask = x.ask ? `<div class="rv-ask"${hot(x.ask, "Ask me instead")}>Ask me instead</div>` : "";
  return `<div class="${cls}"${ic}>${head}${rows}${ask}</div>`;
}

function r(x){
  switch(x.t){
    case "review": return review(x);
    /* transcript line: live:true = the words appear one by one in Play (d = start delay in ms) */
    case "say": {
      const w = String(x.l).split(" "), n = w.length - 1;
      const txt = x.live ? w.map((s,k)=>`<i style="--k:${k}">${k?"":"“"}${s}${k===n?"”":""}</i>`).join(" ") : `“${x.l}”`;
      return `<div class="say${x.live?" live":""}"${x.d?` style="--d:${x.d}ms"`:""}>${txt}</div>`;
    }
    /* companion: st = listening | speaking | awake | sleep; l = what it says (figure small, text beside it) */
    case "bud": return `<div class="bud${x.l?" says":""}"><span class="bud-f" data-st="${x.st||"awake"}"><i>${x.st||"awake"}</i></span>${x.l?`<b class="bud-l">${x.l}</b>`:""}</div>`;
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
    /* slider: v = last value; drawn muted ("unchanged") until moved in Play (play.js). better: "high"|"low".
       set = a new value that is already filled in (drawn moved, tick at v); heard = the words it came from (quote beside the value) */
    case "slider": {
      const min = x.min ?? 0, max = x.max ?? 10, v = x.v ?? min, s = x.set ?? v, pc = a => (a-min)/(max-min)*100 + "%", p = pc(s);
      const moved = x.set !== undefined, was = moved && s !== v && !x.heard ? `was ${v}` : "";
      return `<div class="slider${moved?" moved":""}${x.heard?" heard":""}" data-min="${min}" data-max="${max}" data-last="${v}" data-v="${s}">`
        + `<div class="st"><span class="l">${x.l}</span><span class="v">${x.heard?`<span class="hq">“${x.heard}”</span>`:""}<s class="was">${was}</s><b>${s}</b></span></div>`
        + `<div class="tr" role="slider" tabindex="0" aria-label="${attr(x.l)}" aria-valuemin="${min}" aria-valuemax="${max}" aria-valuenow="${s}">`
        + `<div class="rail"><i class="fill" style="width:${p}"></i><i class="last" style="left:${pc(v)}"></i><i class="knob" style="left:${p}"></i></div></div>`
        + `<div class="ends"><span>${x.lo ?? min}</span><span>${x.hi ?? max}</span></div></div>`;
    }
    case "trend": return tag(`<div class="tile trend" style="background:var(--white)"><span class="l">${x.l}</span><span class="n">— today</span><div class="dots"></div><div class="days">${"WTFSSMT".split("").map(d=>`<span>${d}</span>`).join("")}</div></div>`, x.go, x.l);
    case "sec":   return x.act
      ? `<div class="sec">${x.l}<span class="act"${hot(x.go,x.act)}>${x.act}</span></div>`
      : tag(`<div class="sec">${x.l}<span>${x.r||""}</span></div>`, x.go, x.l);
    case "fold":  return tag(`<div class="fold"><div class="ft"><span class="t"><i class="cv">${x.open?"⌄":"›"}</i> ${x.l}</span><span class="m">${x.m||""}</span>${x.a?`<span class="pill">${x.a}</span>`:""}</div>${(x.open||[]).map((i,k)=>`<div class="item"${hot(goAt(x.goRows,k),i[0])}><span class="${i[2]?"strike":""}">${i[0]}</span><span class="${i[2]?"strike":""}">${i[1]}</span></div>`).join("")}</div>`, x.go, x.l);
    case "cal":   return cal(x);
    case "linemarks": return linemarks(x);
    case "pattern": return pattern(x);
    case "compare": return compare(x);
    case "more":  return more(x);
    case "plist": return plist(x);
    case "stats": return `<div class="stats"${x.items.length!==3?` style="--n:${x.items.length}"`:""}>${x.items.map(o=>`<div><b>${o[0]}</b><span>${o[1]}</span></div>`).join("")}</div>`;
    case "chips": return `<div class="chips${x.quiet?" quiet":""}">${x.items.map((c,i)=>`<span class="chip"${hot(goAt(x.go,i),c)}>${c}</span>`).join("")}</div>`;
    case "pills": return `<div class="pills"${x.multi?" data-multi":""}>${x.items.map((c,i)=>`<span class="${(x.on||[]).includes(c)?"on":""}"${hot(goAt(x.go,i),c)}>${c}</span>`).join("")}</div>`;
    case "draft": return tag(`<div class="draft"><span>${x.l}</span><span class="pill">${x.a}</span></div>`, x.go, x.l);
    case "mic":   return tag(`<div class="mic">${MIC}</div>`, x.go, "mic");
    case "spacer":return `<div class="spacer"></div>`;
    case "seg":   return `<div class="segrow"><div class="seg">${x.items.map((it,i)=>`<span class="${it===x.on?"on":""}"${hot(goAt(x.go,i),it)}>${it}</span>`).join("")}</div><span class="link"${hot(x.goRight,x.r)}>${x.r||""}</span></div>`;
    case "week": {
      const d="MTWTFSS".split(""); const dots=(x.dots||"").padEnd(7,"·");
      return tag(`<div class="week">${d.map((l,i)=>`<div class="${i===x.on?"on":""}">${l}<b>${x.start+i}</b><i class="${dots[i]==="o"?"d":""}"></i></div>`).join("")}</div>`, x.go, "week");
    }
    case "tl":    return `<div class="tl">${x.rows.map((o,i)=>`<div class="tlr"${hot(goAt(x.go,i),o[1])}><span class="s">${o[0]}</span><span class="rail"><div class="dot"></div></span><span>${o[1]}${o[2]?`<div class="n">${o[2]}</div>`:""}</span><span class="c">${o[3]?"›":""}</span></div>`).join("")}</div>`;
    case "list":  return `<div class="list">${x.rows.map((o,i)=>`<div class="item"${hot(goAt(x.go,i),o[0])}><span class="${o[2]==="strike"?"strike":""}">${o[0]}</span><span class="r ${o[2]==="acc"?"acc":""}">${o[1]||""}</span></div>`).join("")}</div>`;
    case "field": return tag(`<div class="field">${x.l?`<div class="lb">${x.l}</div>`:""}<div class="box ${x.tall?"tall":""}"><span>${x.v||""}</span><span>${x.suffix||""}</span></div></div>`, x.go, x.l||x.v);
    case "btn":   return tag(`<div class="btn ${x.light?"light":""}"${x.slots?" data-slots":""}>${x.l}</div>`, x.go, x.l);   // slots: Play names the chosen times ("Add to Morning + Noon")
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
      case "review": if(x.compact){ if(!x.ok) add(x.go, x.title, "tile"); return; }
        (x.rows||[]).forEach(o=>{ add(o[3], o[0], "list"); if(o[1] && typeof o[1]==="object") walk(o[1]); add(o[5], "Say it", "mic"); });
        add(x.ask, "Ask me instead", "chips");
        return;
      case "say": case "bud": return;
      case "fold":  add(x.go, x.l, "fold"); (x.open||[]).forEach((o,i)=>add(goAt(x.goRows,i), o[0], "list")); return;
      case "plist": x.rows.forEach(o=>{ add(o[3], o[0], "list"); (o[4]||[]).forEach(k=>add(k[2], k[0], "list")); }); return;
      case "cal": case "linemarks": case "stats": case "compare": return;
      case "more":  add(x.goAct, x.act, "act"); return;
      case "mic":   add(x.go, "mic", "mic"); return;
      case "week":  add(x.go, "week", "week"); return;
      case "weekgrid": add(x.go, "grid", "weekgrid"); return;
      case "doselist": add(x.go, "list", "doselist"); return;
      case "field": add(x.go, x.l||x.v, "field"); return;
      default:      add(x.go, x.l, x.t);
    }
  };
  (s ? s.w : []).forEach(walk);
  if(s && s.after) add(s.after[1], "auto", "after");   // Play only: auto-advance (no DOM element; drawn from the phone)
  return out;
}
const tabLinks = s => s && s.tabs ? TABSETS[s.tabs].map(t=>({to:(TABLINKS[s.tabs]||{})[t], label:t})).filter(l=>l.to && l.to!==s.id) : [];

const tabbar = (set,on,self) => `<div class="tabs">${TABSETS[set].map(t=>{
  const to = (TABLINKS[set]||{})[t], mic = t==="🎙"; const h = to && to!==self ? hot(to, mic ? "Voice" : t)+" data-tab" : "";
  return mic ? `<div class="fab"${h} aria-label="Voice">${MIC}</div>` : `<span class="${t===on?"on":""}"${h}>${t}</span>`;
}).join("")}</div>`;
/* play=true (Play only): trailing buttons are wrapped in .foot so the stage can pin them to the bottom.
   Library and Flows render without the wrapper. */
function screenInner(s, play){
  let k = s.w.length; if(play) while(k>0 && s.w[k-1].t==="btn") k--;
  const foot = k<s.w.length ? `<div class="foot">${s.w.slice(k).map(r).join("")}</div>` : "";
  return `${s.w.slice(0,k).map(r).join("")}${foot}${s.tabs?`<div class="spacer"></div>${tabbar(s.tabs,s.tab,s.id)}`:""}`.replace(MIC_RE, MIC);   // 🎙 in text → the mic icon
}
const screenHTML = s => `<div class="phone ${s.sheet?"sheet":""}${s.sheet==="half"?" half":""}">${screenInner(s)}</div>`;
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
