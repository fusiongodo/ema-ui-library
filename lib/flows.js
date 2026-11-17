/* ====== FLOWS: graph derived from `go` links, drawn as a map ====== */

/* Walk all go links from flow.start (tab bar ignored).
   Returns nodes with column (longest path from start) and row (branches below),
   forward edges, and per-node marks for back / close / loops / missing targets. */
/* Walk order: primary controls first, so the main path follows buttons/choices
   and shortcuts (chips, mic) become side links rather than the spine. */
const LINK_PRI = {choice:0, btn:1, act:2, tile:3, list:4, tl:4, seg:4, field:4, head:5, shead:5, chips:6, pills:6, mic:7};
const linkPri = t => LINK_PRI[t] ?? 5;
function flowGraph(flow){
  const g = { flow, nodes:[], edges:[], marks:{}, col:{}, row:{}, error:null };
  if(!byId(flow.start)){ g.error = `start screen "${flow.start}" not found`; return g; }
  const state = {}, finish = [];
  const mark = (id,m) => (g.marks[id] = g.marks[id] || []).push(m);
  (function dfs(u){
    state[u] = 1; g.nodes.push(u);
    linksOf(byId(u)).map((l,i)=>({...l, i})).sort((a,b)=>linkPri(a.t)-linkPri(b.t) || a.i-b.i).forEach(l=>{
      const i = l.i;
      if(l.to==="back" || l.to==="close"){ mark(u,{kind:l.to, label:l.label}); return; }
      if(!byId(l.to)){ mark(u,{kind:"missing", label:l.label, to:l.to}); return; }
      if(state[l.to]===1){ mark(u,{kind:"loop", label:l.label, to:l.to}); return; }
      g.edges.push({from:u, to:l.to, label:l.label, t:l.t, i});
      if(!state[l.to]) dfs(l.to);
    });
    state[u] = 2; finish.push(u);
  })(flow.start);

  // columns: longest path on the DAG (reverse finish order is topological)
  g.nodes.forEach(n=>g.col[n]=0);
  finish.slice().reverse().forEach(u=>g.edges.filter(e=>e.from===u).forEach(e=>{
    g.col[e.to] = Math.max(g.col[e.to], g.col[u]+1);
  }));
  // layout tree: parent = first predecessor exactly one column to the left
  const kids = {}, parent = {}; g.nodes.forEach(n=>kids[n]=[]);
  g.nodes.forEach(v=>{
    const e = v!==flow.start && g.edges.find(e=>e.to===v && g.col[e.from]===g.col[v]-1);
    if(e) parent[v] = e.from;
  });
  g.edges.forEach(e=>{ if(parent[e.to]===e.from && !kids[e.from].includes(e.to)) kids[e.from].push(e.to); });
  // rows: first child continues the row, other children start new rows (shallow branches first)
  let nextRow = 0, seq = 0; const queue = [{n:flow.start, seq:seq++}];
  while(queue.length){
    queue.sort((a,b)=>g.col[a.n]-g.col[b.n] || a.seq-b.seq);
    let u = queue.shift().n; const rw = nextRow++;
    while(u){ g.row[u] = rw; kids[u].slice(1).forEach(k=>queue.push({n:k, seq:seq++})); u = kids[u][0]; }
  }
  g.rows = nextRow; g.cols = Math.max(0, ...Object.values(g.col)) + 1;
  // one arrow per (from,to); prefer the primary control as its origin
  const seen = {};
  g.drawn = [];
  g.edges.forEach(e=>{
    const k = e.from+">"+e.to;
    if(!seen[k]){ seen[k] = {...e, n:1}; g.drawn.push(seen[k]); }
    else { seen[k].n++; if(linkPri(e.t) < linkPri(seen[k].t)) Object.assign(seen[k], {label:e.label, t:e.t, i:e.i}); }
  });
  return g;
}

const GRAPHS = {};
const graphOf = id => GRAPHS[id] || (GRAPHS[id] = flowGraph(FLOWS.find(f=>f.id===id)));
const flowById = id => FLOWS.find(f=>f.id===id);
function flowOf(sid){ const f = FLOWS.find(f=>graphOf(f.id).nodes.includes(sid)); return f && f.id; }

/* Shortest tap path from flow start to sid (used to rebuild the stack for deep links). */
function pathTo(flowId, sid){
  const f = flowById(flowId);
  if(f && byId(f.start)){
    const prev = {[f.start]:null}, q = [f.start];
    while(q.length){
      const u = q.shift(); if(u===sid) break;
      linksOf(byId(u)).forEach(l=>{ if(byId(l.to) && !(l.to in prev)){ prev[l.to] = u; q.push(l.to); } });
    }
    if(sid in prev){ const p = []; for(let u=sid; u; u=prev[u]) p.unshift(u); return p; }
  }
  // no flow: put a sheet on top of any non-sheet screen that opens it
  const p = [sid];
  for(let k=0; k<6 && isSheet(p[0]); k++){
    const parents = SCREENS.filter(s=>linksOf(s).some(l=>l.to===p[0]) && !p.includes(s.id));
    if(!parents.length) break;
    p.unshift((parents.find(s=>!s.sheet) || parents[0]).id);
  }
  return p;
}

/* ---------- map view ---------- */
const Flows = (() => {
  let built = false;
  const esc = s => String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;");
  const short = (s,n=16) => s.length>n ? s.slice(0,n-1)+"…" : s;

  function card(f){
    const g = graphOf(f.id);
    const head = `<div class="fhead"><h3>${f.title}</h3><span class="badge ${f.status}">${f.status}</span>
      <a class="pbtn" href="#play/${f.id}/${f.start}">▶ Play</a></div>${f.note?`<p class="fnote">${f.note}</p>`:""}`;
    if(g.error) return `<div class="fcard" id="flow-${f.id}">${head}<p class="ferr">${g.error}</p></div>`;
    const nodes = g.nodes.map(id=>{
      const s = byId(id), m = g.marks[id] || [];
      const marks = [];
      if(m.some(x=>x.kind==="back"))  marks.push(`<span title="back link">‹ back</span>`);
      if(m.some(x=>x.kind==="close")) marks.push(`<span title="closes the sheet stack">× close</span>`);
      m.filter(x=>x.kind==="loop").forEach(x=>marks.push(`<span title="${esc(x.label)} → ${x.to}">↻ ${esc(short(x.label,12))} → ${esc(short(byId(x.to).title.replace(/^.*?·\s*/,""),14))}</span>`));
      m.filter(x=>x.kind==="missing").forEach(x=>marks.push(`<span class="miss" title="unknown screen ${esc(x.to)}">⚠ ${esc(x.to)}</span>`));
      return `<a class="fnode" href="#play/${f.id}/${id}" data-id="${id}" style="grid-column:${g.col[id]+1};grid-row:${g.row[id]+1}" title="Play from ${id}">
        <div class="fcap"><b>${s.title}</b><span class="fid">${id}</span>${id===f.start?`<span class="tag start">start</span>`:""}${s.sheet?`<span class="tag">sheet</span>`:""}</div>
        <div class="mini">${screenHTML(s)}</div>
        ${marks.length?`<div class="fmarks">${marks.join("")}</div>`:""}
      </a>`;
    }).join("");
    return `<div class="fcard" id="flow-${f.id}">${head}<div class="fmap"><div class="fcanvas" data-flow="${f.id}">${nodes}<svg class="wires"></svg></div></div></div>`;
  }

  function build(){
    if(built) return; built = true;
    const out = document.getElementById("flows-out");
    out.innerHTML = FLOWS.length ? FLOWS.map(card).join("") : `<p class="empty">No flows yet. Add one in flows/&lt;name&gt;.js.</p>`;
    const ro = new ResizeObserver(entries=>entries.forEach(e=>draw(e.target)));
    out.querySelectorAll(".fcanvas").forEach(c=>ro.observe(c));
  }

  function rpath(pts, rad=7){
    const p = pts.filter((q,i)=>!i || q[0]!==pts[i-1][0] || q[1]!==pts[i-1][1]);
    let d = `M${p[0][0]},${p[0][1]}`;
    for(let i=1;i<p.length-1;i++){
      const [x0,y0]=p[i-1],[x1,y1]=p[i],[x2,y2]=p[i+1];
      const d1=Math.hypot(x1-x0,y1-y0), d2=Math.hypot(x2-x1,y2-y1), rr=Math.min(rad,d1/2,d2/2);
      if(rr<0.5){ d+=` L${x1},${y1}`; continue; }
      d+=` L${x1+(x0-x1)/d1*rr},${y1+(y0-y1)/d1*rr} Q${x1},${y1} ${x1+(x2-x1)/d2*rr},${y1+(y2-y1)/d2*rr}`;
    }
    const l = p[p.length-1]; return d+` L${l[0]},${l[1]}`;
  }

  function draw(canvas){
    if(!canvas.offsetParent) return;                       // view hidden
    const g = graphOf(canvas.dataset.flow), svg = canvas.querySelector(".wires");
    // size the scaled phones first
    canvas.querySelectorAll(".mini").forEach(m=>{
      const h = Math.ceil(m.firstElementChild.offsetHeight*0.6)+"px";
      if(m.style.height!==h) m.style.height = h;
    });
    const C = canvas.getBoundingClientRect();
    const R = el => { const b = el.getBoundingClientRect(); return {l:b.left-C.left, r:b.right-C.left, t:b.top-C.top, b:b.bottom-C.top}; };
    const node = {}; canvas.querySelectorAll(".fnode").forEach(n=>node[n.dataset.id] = n);
    const colR = [], colL = [], rowT = [], rowB = [];
    g.nodes.forEach(id=>{
      const b = R(node[id]), c = g.col[id], w = g.row[id];
      colL[c] = Math.min(colL[c] ?? 1e9, b.l); colR[c] = Math.max(colR[c] ?? -1e9, b.r);
      rowT[w] = Math.min(rowT[w] ?? 1e9, b.t); rowB[w] = Math.max(rowB[w] ?? -1e9, b.b);
    });
    const chan = (a,bel) => bel ? (a+1<g.rows ? (rowB[a]+rowT[a+1])/2 : rowB[a]+20) : (rowB[a-1]+rowT[a])/2;
    const lanes = {}, lane = gap => (lanes[gap] = (lanes[gap] ?? -1) + 1);
    const chans = {}, chanUse = y => { const k = Math.round(y); chans[k] = (chans[k] ?? -1)+1; return y + (chans[k]%2 ? 1 : -1)*Math.ceil(chans[k]/2)*6; };
    const inCount = {};
    const fid = canvas.dataset.flow.replace(/[^a-z0-9-]/gi,"");
    let out = `<defs><marker id="ah-${fid}" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="#3d6fd8"/></marker></defs>`;
    let labels = ""; const labelY = {};
    g.drawn.forEach(e=>{
      const sp = node[e.from].querySelector(".phone"), tp = node[e.to].querySelector(".phone");
      const hs = [...sp.querySelectorAll("[data-go]:not([data-tab])")];
      const el = hs[e.i] && hs[e.i].dataset.go===e.to ? hs[e.i] : sp.querySelector(`[data-go="${e.to}"]`) || sp;
      const s = R(el), P = R(sp), T = R(tp);
      const sx = Math.min(s.r, P.r), sy = Math.max(P.t+6, Math.min(P.b-6, (s.t+s.b)/2));
      const k = inCount[e.to] = (inCount[e.to] ?? -1) + 1;
      const tx = T.l - 1, ty = Math.min(T.b-10, T.t + 22 + k*9);
      const cu = g.col[e.from], cv = g.col[e.to], ru = g.row[e.from], rv = g.row[e.to];
      const xo = colR[cu] + 26 + lane(cu)*8;
      let pts;
      if(cv===cu+1) pts = [[sx,sy],[xo,sy],[xo,ty],[tx,ty]];
      else {
        const cy = chanUse(chan(ru, rv>=ru));
        const xi = colR[cv-1] + 26 + lane(cv-1)*8;
        pts = [[sx,sy],[xo,sy],[xo,cy],[xi,cy],[xi,ty],[tx,ty]];
      }
      out += `<path class="w" data-e="${e.from}>${e.to}>${e.i}" d="${rpath(pts)}" marker-end="url(#ah-${fid})"/><circle cx="${sx}" cy="${sy}" r="2.6"/>`;
      const lab = short(e.label) + (e.n>1 ? ` +${e.n-1}` : "");
      const used = labelY[e.from] = labelY[e.from] || [];
      let ly = sy-5; while(used.some(y=>Math.abs(y-ly)<12)) ly += 12;
      used.push(ly);
      labels += `<text x="${P.r+5}" y="${ly}"><title>${esc(e.label)}</title>${esc(lab)}</text>`;
    });
    svg.setAttribute("width", canvas.scrollWidth); svg.setAttribute("height", canvas.scrollHeight);
    svg.innerHTML = out + labels;
  }

  function show(id){
    build();
    requestAnimationFrame(()=>{
      document.querySelectorAll("#flows-out .fcanvas").forEach(draw);
      const el = id && document.getElementById("flow-"+id);
      if(el) el.scrollIntoView({block:"start"}); else window.scrollTo(0,0);
    });
  }
  window.addEventListener("resize", ()=>document.querySelectorAll("#flows-out .fcanvas").forEach(draw));
  return { show, draw };
})();
