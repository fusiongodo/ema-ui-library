/* ====== COZY (Play only): colour worlds, icons, page heads, small companion ======
   Play (lib/play.js) calls Cozy.decorate(layer, screen) on every freshly painted layer while the theme is "cozy",
   and sets data-world on the phone frame from the base screen (page ground, dim). Each layer gets its own world, a sheet
   that of its own area; links into another area carry that area's world (PRINCIPLES 9). Everything here only touches the
   painted Play DOM: screen files, render.js, Library, Flows and the other themes stay as they are.
   Styles: lib/cozy.css. Companion figure: lib/buddy.js. */
const Cozy = (() => {
  /* ---- worlds: by area, a screen may override with `world` ---- */
  const AREA_WORLD = { "Today":"today", "Check-ins":"checkins", "Protocols":"protocols", "Voice":"voice", "Insights":"insights" };
  const worldOf = id => { const s = id && byId(id); return s ? (s.world || AREA_WORLD[s.area] || "today") : "today"; };

  /* ---- icons: 24 grid, thick round strokes in currentColor, a soft fill where a shape is closed ---- */
  const F = 'fill="currentColor" fill-opacity=".16"';
  const ICONS = {
    home:    `<path d="M4.6 11.4 12 5.2l7.4 6.2v6.8a2.2 2.2 0 0 1-2.2 2.2H6.8a2.2 2.2 0 0 1-2.2-2.2z" ${F}/><path d="M10 20.4v-4.2a2 2 0 0 1 4 0v4.2"/>`,
    pulse:   `<path d="M12 19.6s-7.6-4.3-7.6-9.9A4.3 4.3 0 0 1 12 7.2a4.3 4.3 0 0 1 7.6 2.5c0 5.6-7.6 9.9-7.6 9.9z" ${F}/><path d="M7.6 12.6h2.3l1.3-2.3 2 3.9 1.2-1.6h2"/>`,
    capsule: `<g transform="rotate(-45 12 12)"><rect x="3.8" y="8.4" width="16.4" height="7.2" rx="3.6"/><path d="M12 8.4h-4.6a3.6 3.6 0 0 0 0 7.2H12z" fill="currentColor" stroke="none"/></g>`,
    chart:   `<rect x="4.4" y="12.2" width="4" height="7.6" rx="2" ${F}/><rect x="10" y="5.2" width="4" height="14.6" rx="2" ${F}/><rect x="15.6" y="9" width="4" height="10.8" rx="2" ${F}/>`,
    mic:     `<rect x="9" y="3.6" width="6" height="10.8" rx="3" ${F}/><path d="M5.9 11.4a6.1 6.1 0 0 0 12.2 0M12 17.6v2.8M9.2 20.4h5.6"/>`,
    bell:    `<path d="M6.4 16.4v-5.2a5.6 5.6 0 0 1 11.2 0v5.2l1.4 1.6H5z" ${F}/><path d="M10.2 20.6a2 2 0 0 0 3.6 0"/>`,
    gear:    `<circle cx="12" cy="12" r="6.9" stroke-width="3.4" stroke-dasharray="2.7 2.72" stroke-linecap="butt"/><circle cx="12" cy="12" r="5.2" ${F}/><circle cx="12" cy="12" r="2"/>`,
    plus:    `<path d="M12 5.6v12.8M5.6 12h12.8" stroke-width="2.6"/>`,
    sunrise: `<path d="M6.6 16.6a5.4 5.4 0 0 1 10.8 0z" ${F}/><path d="M4 19.6h16M12 5.6v2.2M5.6 8.8l1.5 1.5M18.4 8.8l-1.5 1.5"/>`,
    sun:     `<circle cx="12" cy="12" r="4.2" ${F}/><path d="M12 3.6v1.6M12 18.8v1.6M3.6 12h1.6M18.8 12h1.6M6.1 6.1l1.1 1.1M16.8 16.8l1.1 1.1M6.1 17.9l1.1-1.1M16.8 7.2l1.1-1.1"/>`,
    moon:    `<path d="M18.8 14.6A7.4 7.4 0 0 1 9.4 5.2a7.4 7.4 0 1 0 9.4 9.4z" ${F}/>`,
    dice:    `<rect x="4.4" y="4.4" width="15.2" height="15.2" rx="4.4" ${F}/><g fill="currentColor" stroke="none"><circle cx="8.9" cy="8.9" r="1.35"/><circle cx="12" cy="12" r="1.35"/><circle cx="15.1" cy="15.1" r="1.35"/></g>`,
    pad:     `<path d="M7.6 8.2h8.8a4 4 0 0 1 3.9 3.2l.8 4.3a2.3 2.3 0 0 1-3.9 2l-1.7-1.8H8.5l-1.7 1.8a2.3 2.3 0 0 1-3.9-2l.8-4.3a4 4 0 0 1 3.9-3.2z" ${F}/><path d="M8.2 10.8v3M6.7 12.3h3"/><g fill="currentColor" stroke="none"><circle cx="15.6" cy="11.4" r="1"/><circle cx="17.4" cy="13.4" r="1"/></g>`,
    bolt:    `<path d="M13.2 3.8 6.4 13h5l-.8 7.2 7-9.4h-5z" ${F}/>`,
    book:    `<path d="M4.4 6.6c2.6-1.1 5.1-.9 7.6.9 2.5-1.8 5-2 7.6-.9v11.6c-2.6-1.1-5.1-.9-7.6.9-2.5-1.8-5-2-7.6-.9z" ${F}/><path d="M12 7.5v11.4"/>`,
    calc:    `<rect x="4.4" y="4.4" width="15.2" height="15.2" rx="4.4" ${F}/><path d="M8.6 7.6v3.4M6.9 9.3h3.4M13.8 9.3h3.4M7.2 14.6l2.8 2.8M10 14.6l-2.8 2.8M13.8 14.8h3.4M13.8 17.2h3.4"/>`,
    check:   `<path d="M5.6 12.6l4 4 8.8-9"/>`,
    back:    `<path d="M14.6 5.4 8 12l6.6 6.6" stroke-width="2.6"/>`,
    close:   `<path d="M6.8 6.8l10.4 10.4M17.2 6.8 6.8 17.2" stroke-width="2.6"/>`,
    note:    `<path d="M6.6 4.4h7.6l4.2 4.2v10.2a1.8 1.8 0 0 1-1.8 1.8H6.6a1.8 1.8 0 0 1-1.8-1.8V6.2a1.8 1.8 0 0 1 1.8-1.8z" ${F}/><path d="M8.6 12.2h6.8M8.6 15.8h4.4"/>`,
    stack:   `<rect x="5" y="4.4" width="14" height="4.4" rx="2.2" ${F}/><rect x="5" y="9.8" width="14" height="4.4" rx="2.2" ${F}/><rect x="5" y="15.2" width="14" height="4.4" rx="2.2" ${F}/>`,
    folder:  `<path d="M4.2 7.6a2.2 2.2 0 0 1 2.2-2.2h3.3l2 2.2h5.9a2.2 2.2 0 0 1 2.2 2.2v7.4a2.2 2.2 0 0 1-2.2 2.2H6.4a2.2 2.2 0 0 1-2.2-2.2z" ${F}/><path d="M4.2 10.2h15.6"/>`,
    ask:     `<path d="M6.6 4.8h10.8a2.4 2.4 0 0 1 2.4 2.4v6.6a2.4 2.4 0 0 1-2.4 2.4h-5.2l-4.4 3.6v-3.6h-1.2a2.4 2.4 0 0 1-2.4-2.4V7.2a2.4 2.4 0 0 1 2.4-2.4z" ${F}/><path d="M8.6 9.4h6.8M8.6 12.4h4.2"/>`,
    flask:   `<path d="M9.8 4.4h4.4M10.6 4.4v5.1l-4.9 8.1a1.9 1.9 0 0 0 1.6 2.9h9.4a1.9 1.9 0 0 0 1.6-2.9l-4.9-8.1V4.4"/><path d="M7.7 14.8h8.6l1.7 2.8a1.9 1.9 0 0 1-1.6 2.9H7.6a1.9 1.9 0 0 1-1.6-2.9z" fill="currentColor" fill-opacity=".16" stroke="none"/>`,
    box:     `<path d="M4.4 9 12 5.2 19.6 9v8.4L12 21.2l-7.6-3.8z" ${F}/><path d="M4.4 9 12 12.8 19.6 9M12 12.8v8.4"/><path d="M7.6 14.2v2.6" stroke-width="2"/>`,
    twins:   `<g stroke-width="1.9"><rect x="4.6" y="4.6" width="14.8" height="6" rx="3"/><path d="M12 4.6H7.6a3 3 0 0 0 0 6H12z" fill="currentColor" stroke="none"/><rect x="4.6" y="13.4" width="14.8" height="6" rx="3"/><path d="M12 13.4H7.6a3 3 0 0 0 0 6H12z" fill="currentColor" stroke="none"/></g>`,
    key:     `<circle cx="8.2" cy="12" r="3.9" ${F}/><path d="M12.1 12h8.1M17.2 12v3.2M20.2 12v2.4"/>`,
    hash:    `<path d="M10 4.8 8.4 19.2M15.8 4.8l-1.6 14.4M5.4 9.4h13.8M4.8 14.6h13.8"/>`,
    /* Insights: a finding (a rising line that ends in a small spark) and its sibling, an overview (several results, one sparks) */
    finding: `<path d="M3.8 18.4 9 12.8l3.8 3.4 5.4-6.4v10.4H3.8z" ${F} stroke="none"/><path d="M3.8 18.4 9 12.8l3.8 3.4 5.4-6.4"/><path d="M19.2 1.8q.35 3 3.2 3.3-2.85.3-3.2 3.3-.35-3-3.2-3.3 2.85-.3 3.2-3.3z" fill="currentColor" stroke-width="1.2"/>`,
    overview:`<rect x="4.2" y="4.2" width="6.6" height="6.6" rx="2.2" ${F}/><rect x="13.2" y="4.2" width="6.6" height="6.6" rx="2.2" ${F}/><rect x="4.2" y="13.2" width="6.6" height="6.6" rx="2.2" ${F}/><path d="M16.5 12.6q.4 3.5 3.9 3.9-3.5.4-3.9 3.9-.4-3.5-3.9-3.9 3.5-.4 3.9-3.9z" fill="currentColor" stroke-width="1.2"/>`,
  };
  const svg = k => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[k]}</svg>`;
  const icon = (k, cls) => `<i class="${cls||"cz-g"}" data-ic="${k}">${svg(k)}</i>`;

  const GLYPHS = { "🎙":"mic", "🔔":"bell", "⚙":"gear", "☀":"sunrise", "◐":"sun", "☾":"moon" };
  const GLYPH_RE = /(🎙|🔔|⚙|☀|◐|☾)[︎️]?/u;
  const TABS = { "Today":"home", "Home":"home", "Check-ins":"pulse", "Protocols":"capsule", "Plans":"capsule", "Insights":"chart" };
  const TILES = { "Check-in now":"pulse", "Check-ins":"pulse", "Protocols":"capsule", "Scores · 7 days":"chart", "Today":"chart",
    "Dual n-back":"dice", "Reaction":"bolt", "Word game":"book", "Arithmetic":"calc", "Symbol search":"hash", "Word flow":"book", "Blocks":"stack", "Slingshot":"pad", "Lichess puzzles":"pad", "Today · all as planned":"check",
    "Consistency · 30 days":"chart", "YOUR CHECK-IN":"pulse", "Take now":"capsule",
    "All protocols":"folder", "Ask about your data":"ask", "Find out if something really helps":"flask",
    "Magnesium trial":"flask", "Your trial result is ready":"flask", "Magnesium trial stopped":"flask", "Ways to prepare":"capsule" };
  const CHOICES = { "One item":"capsule", "A group":"stack" };
  const RV_ICONS = { today:"home", checkins:"pulse", protocols:"capsule", insights:"chart", voice:"mic", neutral:"note" };   // review cards: icon of their area
  /* Studio only: the approved clay renders (lib/clay-icons.js) stand in for the line icon wherever the card stands for the same
     thing. One table, by the visible name of the card, row or review card; "Next: …" is the check-in tile. A name that is
     not here keeps its Cozy icon. Trend and Health tiles have no Cozy icon: Studio gives the named ones a clay tile. */
  const CLAY = { "Check-in now":"log-scores", "YOUR CHECK-IN":"log-scores", "Check-ins":"wellbeing", "Check-in":"checkin-chat",
    "Protocols":"protocol-pill", "Take now":"protocol-pill", "One item":"protocol-pill", "New protocol":"protocol-pill", "Naltrexon":"protocol-pill",
    "Semaglutide":"protocol-injection", "MOTS-C":"protocol-injection", "Epitalon":"protocol-injection",   // injected (All protocols rows)
    "Consistency · 30 days":"calendar", "Ways to prepare":"guide", "Scores · 7 days":"scores", "Ask about your data":"ask",
    "Dual n-back":"dual-n-back", "Reaction":"reaction", "Word game":"word-game", "Arithmetic":"arithmetic",
    "Overall wellbeing":"wellbeing", "Pain":"pain", "Sleep":"sleep", "Steps":"steps" };
  const clayOf = name => CLAY[name] || (/^Next:/.test(name) ? "log-scores" : null);
  const MEASURE_CLAY = ["wellbeing","pain","sleep","steps"];   // the only clays a trend / Health tile gets (not the game results)
  const GAME_CLAY = ["dual-n-back","reaction","word-game","arithmetic"];   // only where every game tile beside it has a clay too
  const HEAD_CLAY = ["steps","sleep"];                          // detail heads that get a clay tile (Health); protocol heads stay plain
  const TAB_GLYPH = { home:["tab-today","today"], pulse:["tab-checkins","checkins"], capsule:["tab-protocols","protocols"], chart:["tab-insights","insights"] };   // Cozy tab icon → soft-solid glyph, its area
  const CLOUD = `<svg viewBox="0 0 64 28" aria-hidden="true"><path d="M12 27a10 10 0 0 1-1.4-19.9A13 13 0 0 1 35.4 5.6 10.5 10.5 0 0 1 52 11.4 8 8 0 0 1 54 27z" fill="#fff"/></svg>`;

  let gid = 0;
  const txt = e =>(e ? e.textContent : "").replace(/\s+/g," ").trim();
  const el = html => { const t = document.createElement("template"); t.innerHTML = html.trim(); return t.content.firstChild; };

  /* emoji glyphs → icons (text nodes only, so data-go / labels stay untouched) */
  function glyphs(root){
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), hits = [];
    while(w.nextNode()) if(GLYPH_RE.test(w.currentNode.nodeValue)) hits.push(w.currentNode);
    hits.forEach(n=>{
      let rest = n.nodeValue, m; const frag = document.createDocumentFragment();
      while((m = GLYPH_RE.exec(rest))){
        if(m.index) frag.appendChild(document.createTextNode(rest.slice(0, m.index)));
        frag.appendChild(el(icon(GLYPHS[m[1]])));
        rest = rest.slice(m.index + m[0].length);
      }
      if(rest) frag.appendChild(document.createTextNode(rest));
      n.replaceWith(frag);
    });
  }

  /* page head: title centred in the dark world colour, a small status line, round buttons left / right */
  function head(L, s){
    let h = L.querySelector(":scope > .head");
    const sub = s.sub ? `<span class="n">${s.sub}</span>` : "";
    if(!h){
      const first = s.w[0] && s.w[0].t;
      if(!s.tabs || ["shead","seg"].includes(first)) return;
      h = el(`<div class="head"><div class="hl"><b>${s.tab}</b>${sub}</div></div>`);
      L.prepend(h);
      } else {
      let hl = h.querySelector(".hl");
      if(!hl){ hl = el(`<div class="hl"></div>`); h.prepend(hl); hl.appendChild(h.querySelector(":scope > b")); }
      if(!hl.querySelector(".n") && sub) hl.insertAdjacentHTML("beforeend", sub);
      const c = h.querySelector(".circle");
      if(c && txt(c)==="+"){ c.classList.add("cz-primary"); c.innerHTML = icon("plus"); c.setAttribute("aria-label","Add"); }
    }
    if(!h.querySelector(".circle")){                               // "+ Add" (section action) moves up as the round +
      const act = [...L.querySelectorAll(".sec .act[data-go]")].find(a=>/^\+/.test(txt(a)));
      if(act){
        const b = el(`<div class="circle cz-primary" aria-label="Add">${icon("plus")}</div>`);
        b.dataset.go = act.dataset.go; b.dataset.label = act.dataset.label || "+";
        h.appendChild(b); act.classList.add("cz-moved");
      }
    }
    h.classList.add("cz-head");
    if(h.querySelector("[data-greet]")){                          // Today: the companion sits next to the greeting
      h.classList.add("cz-hero");
      h.insertAdjacentHTML("afterbegin", `<span class="cz-buddy" data-buddy="day"></span><span class="cz-cloud c1">${CLOUD}</span><span class="cz-cloud c2">${CLOUD}</span>`);
    } else h.insertAdjacentHTML("afterbegin", `<span class="cz-hs"></span>`);
    if(!h.querySelector(".circle")) h.insertAdjacentHTML("beforeend", `<span class="cz-hs"></span>`);
  }

  function decorate(L, s, theme){                               // theme: from Play; "studio" adds the Studio pass at the end
    if(!s) return;
    const sheet = L.classList.contains("sheet");
    /* own world on the layer: a fading layer keeps its colours while the page blends to the next world.
       A sheet takes the world of its own area, not of the screen below (the check-in sheet is mint over Today too). */
    L.dataset.world = worldOf(s.id);
    if(!sheet) head(L, s);
    /* colour = place (PRINCIPLES 9): a link into another area wears that area's world, on whatever page it sits.
       The tab bar keeps the page's world (its mic is Voice teal in lib/cozy.css); ‹ back / × close are not links. */
    L.querySelectorAll("[data-go]:not([data-tab]),[data-to]").forEach(e=>{   // data-to: a confirmed draft, no longer a link, still of its area
      const to = e.dataset.go || e.dataset.to; if(to==="back" || to==="close" || !byId(to) || (e.dataset.go && byId(to).of)) return;   // `of`: Save returns to where it came from, like close
      const w = worldOf(to); if(w !== L.dataset.world) e.dataset.world = w;
    });
    /* scores belong to Check-ins: the score line, its chips and today's point in the history chart are mint */
    L.querySelectorAll(".lm-c,.lm-s,.lm-p,.lm-al,.cpw-p,.cpw-d").forEach(e=>{ e.dataset.world = "checkins"; });
    /* evaluation rows: the source label wears its world (a check-in score mint, Apple Health neutral grey) */
    L.querySelectorAll(".df-src").forEach(e=>{ e.dataset.world = e.dataset.src === "checkins" ? "checkins" : "neutral"; });
    /* Insights: a pattern card has an Insights icon of its own (a finding; an evaluation: an overview, `ic`), and its tile
       wears the world of the area it comes from (Protocols periwinkle, scores mint), so the colour still says where */
    L.querySelectorAll(".pa-ic").forEach(p=>{ const pa = p.closest(".pa"), w = pa.dataset.src || L.dataset.world, k = ICONS[pa.dataset.ic] ? pa.dataset.ic : "finding";
      p.outerHTML = `<i class="cz-ic pa-ic" data-world="${w}" data-ic="${k}">${svg(k)}</i>`; });
    /* a chip that opens the listening layer ("Ask by voice") gets the small mic in front */
    L.querySelectorAll('.chip[data-go="voice/listen"]').forEach(c=>{ if(!c.querySelector('[data-ic="mic"]')) c.insertAdjacentHTML("afterbegin", icon("mic")); });
    /* review cards: a neutral one (a note) gets the neutral world; every card an icon tile of its area */
    L.querySelectorAll(".rv-neutral").forEach(e=>{ e.dataset.world = "neutral"; });
    const sh = L.querySelector(":scope > .shead");                     // status line on page sheads (Benchmarks …)
    if(sh && s.sub && !sh.querySelector(".n")) sh.children[1].insertAdjacentHTML("beforeend", `<span class="n">${s.sub}</span>`);
    glyphs(L);
    L.querySelectorAll(".shead .side.g").forEach(sd=>{ const k = {"‹":"back","×":"close"}[txt(sd)]; if(k) sd.innerHTML = icon(k); });   // ‹ × → drawn icons
    L.querySelectorAll(".shead .side").forEach(sd=>{ if(sd.children.length===1 && sd.firstElementChild.matches(".cz-g") && !txt(sd)) sd.classList.add("g"); });   // ⚙︎ alone → round button
    /* tab bar: icon over label */
    L.querySelectorAll(".tabs > span").forEach(t=>{ const k = TABS[txt(t)]; if(k) t.insertAdjacentHTML("afterbegin", icon(k, "cz-ti")); });
    /* small icon tile in card heads */
    L.querySelectorAll(".tile:not(.trend)").forEach(t=>{
      const l = t.querySelector(".top .l"); if(!l) return;
      const name = txt(l), k = TILES[name] || (/^Next:/.test(name) ? "pulse" : /^Taken today/.test(name) ? "check" : null);
      if(t.matches(".tint:not(.cta)")){                              // empty state: the companion instead of an icon
        t.classList.add("cz-empty"); t.insertAdjacentHTML("afterbegin", `<span class="cz-buddy" data-buddy="rest"></span>`); return; }
      if(!k || t.querySelector(":scope > .hero")) return;            // a game card with its picture strip needs no icon
      if(t.parentElement.matches(".row,.grid2")) t.firstElementChild.insertAdjacentHTML("afterbegin", icon(k, "cz-ic cz-ic-b"));
      else t.querySelector(".top").insertAdjacentHTML("afterbegin", icon(k, "cz-ic"));
      if(txt(t.querySelector(".top .r"))==="›") t.classList.add("cz-link");   // a quiet link card ("All protocols"): one row, line under the name
    });
    /* the score curves on Today belong to Check-ins too (PRINCIPLES 9): icon tile and lines mint, the card stays white */
    L.querySelectorAll(".tile,.fold").forEach(t=>{ if(t.querySelector(".spark .cv")) t.querySelectorAll(".cz-ic,.spark").forEach(e=>{ e.dataset.world = "checkins"; }); });
    L.querySelectorAll(".rv").forEach(c=>{
      const k = c.dataset.icon || RV_ICONS[(c.closest("[data-world]") || L).dataset.world]; if(k) c.querySelector(".rv-h").insertAdjacentHTML("afterbegin", icon(k, "cz-ic"));
    });
    L.querySelectorAll(".rv-r.rv-heard .rv-q").forEach(q=>q.insertAdjacentHTML("afterbegin", icon("mic")));   // heard: a small mic before the words
    L.querySelectorAll(".rv-ok").forEach(o=>{ o.innerHTML = icon("check"); });                                   // a confirmed draft: a drawn tick
    L.querySelectorAll(".bud-f").forEach(f=>{ if(typeof buddy==="function") f.innerHTML = buddy(f.dataset.st); });
    L.querySelectorAll(".choice > div").forEach(c=>{ const k = CHOICES[txt(c.querySelector("b"))]; if(k) c.insertAdjacentHTML("afterbegin", icon(k, "cz-ic cz-ic-b")); });
    L.querySelectorAll(".tlr .dot[data-ic]").forEach(d=>{ if(ICONS[d.dataset.ic]) d.innerHTML = svg(d.dataset.ic); });   // tl with pictures (the trial's capsule story)
    /* folds: the time-of-day icon becomes a tile at the start of the row, the count goes under the name,
       the chevron to the end (lib/cozy.css lays .ft out as a small grid) */
    L.querySelectorAll(".fold").forEach(f=>{
      const ft = f.querySelector(".ft"); if(!ft) return;
      const g = ft.querySelector(".t .cz-g"); if(g){ g.className = "cz-ic cz-ic-f"; ft.prepend(g); }
      const cv = ft.querySelector(".cv"); if(cv) ft.appendChild(cv);
      const k = !g && TILES[txt(ft.querySelector(".t"))]; if(k){ ft.insertAdjacentHTML("afterbegin", icon(k, "cz-ic cz-ic-f")); if(/^Scores/.test(txt(ft.querySelector(".t")))) ft.firstElementChild.dataset.world = "checkins"; }   // no glyph: the card's icon ("Scores · 7 days": scores are Check-ins, open or closed)
      f.classList.add("cz-fold");
    });
    /* score curves: a soft area under the line that fades out downwards (own gradient id per curve) */
    L.querySelectorAll(".cv svg").forEach(v=>{
      const pl = v.querySelector(".cv-l"); if(!pl) return;
      const pts = pl.getAttribute("points"), id = "cz-ga" + (++gid);
      v.insertAdjacentHTML("afterbegin", `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="currentColor" stop-opacity=".16"/><stop offset="1" stop-color="currentColor" stop-opacity="0"/></linearGradient></defs>`);
      pl.insertAdjacentHTML("beforebegin", `<polygon class="cv-a" fill="url(#${id})" points="${pts} 100,24 0,24"/>`);
    });
    /* one or two quiet moving things per page */
    const w = L.dataset.world;
    const pick = (sel, cls) => { const e = L.querySelector(sel); if(e) e.classList.add(cls); };
    if(w==="checkins") pick('.cz-ic[data-ic="pulse"]', "cz-beat");
    if(w==="protocols") pick('.fold .cz-ic-f', "cz-wobble");
    if(w==="insights") pick('.cz-ic[data-ic="dice"]', "cz-tilt");
    if(w==="voice") pick('.mic', "cz-ring");
    if(theme==="studio" && typeof ClayIcons!=="undefined") studio(L);
  }

  /* ---- Studio pass (runs last): clay tiles, soft-solid glyphs in the tab bar and on the evaluation card, the trends chip ---- */
  const clayImg = id => `<img src="${ClayIcons.clay[id]}" alt="" draggable="false">`;
  const clayTile = (id, cls) => `<i class="cz-ic cz-clay${cls ? " " + cls : ""}" data-ic="${id}">${clayImg(id)}</i>`;
  function studio(L){
    /* existing icon tiles: name of the card they sit in → clay */
    L.querySelectorAll(".cz-ic:not(.pa-ic)").forEach(i=>{
      const h = i.closest(".tile,.ft,.rv,.choice > div"); if(!h) return;
      const l = h.matches(".tile") ? h.querySelector(".top .l") : h.matches(".ft") ? h.querySelector(":scope > .t") : h.matches(".rv") ? h.querySelector(".rv-t > b") : h.querySelector("b");
      const id = clayOf(txt(l)); if(!id) return;
      if(GAME_CLAY.includes(id) && ![...h.parentElement.children].every(t=>clayOf(txt(t.querySelector(".top .l"))))) return;   // a mixed games grid keeps its icons
      i.classList.add("cz-clay"); i.dataset.ic = id; i.innerHTML = clayImg(id);
    });
    /* trend and Health tiles of a named measure: a clay tile at the start of the card */
    L.querySelectorAll(".tile.trend,.tile.us").forEach(t=>{
      const id = CLAY[txt(t.querySelector(":scope > .l"))]; if(!MEASURE_CLAY.includes(id) || t.querySelector(".cz-clay")) return;
      t.insertAdjacentHTML("afterbegin", clayTile(id, t.matches(".us") ? "cz-ic-u" : "cz-ic-b"));
    });
    /* a detail head of a Health measure (health/steps): the clay tile before the big title */
    L.querySelectorAll(".big:not(.pa,.c)").forEach(b=>{
      const id = CLAY[txt(b.querySelector(":scope > b"))]; if(!HEAD_CLAY.includes(id)) return;
      b.classList.add("st-bighead"); b.insertAdjacentHTML("afterbegin", clayTile(id, "cz-ic-h"));
    });
    /* All protocols: every item row starts with a clay tile, an injection's own, any other substance the pill (a group row too).
       The items inside a group keep no tile and their indent, so the group reads as one. The "Ended" header (a group row without
       days) gets an empty slot of the tile's width; its items are ended protocols: their tile, dimmed, in the tile column */
    L.querySelectorAll(".pl .plr").forEach(r=>{
      if(r.querySelector(":scope > .cz-ic,:scope > .cz-slot")) return;
      const ended = r.matches(".k") && !r.closest(".pk").previousElementSibling.querySelector(".ps i");
      if(r.matches(".k") && !ended) return;
      const id = CLAY[txt(r.querySelector(".pt > b"))];
      if(r.matches(".pg") && !r.querySelector(".ps i")) r.insertAdjacentHTML("afterbegin", `<i class="cz-slot"></i>`);
      else r.insertAdjacentHTML("afterbegin", clayTile(id === "protocol-injection" ? id : "protocol-pill", "cz-ic-p" + (ended ? " st-ended" : "")));
    });
    /* intake calendar: a small head inside the card (calendar tile, "Intake", the span); the section heading right above it
       says the same span, so it gives its words to the head and hides */
    L.querySelectorAll(".cal").forEach(c=>{
      if(c.querySelector(".st-calh")) return;
      const sec = c.previousElementSibling && c.previousElementSibling.matches(".sec:not(:has(.act))") ? c.previousElementSibling : null;
      const span = sec ? sec.firstChild.nodeValue.trim() : "";
      c.insertAdjacentHTML("afterbegin", `<div class="st-calh">${clayTile("calendar")}<b>Intake</b>${span ? `<span class="st-calh-s">${span[0].toLowerCase() + span.slice(1)}</span>` : ""}</div>`);
      if(sec) sec.classList.add("st-dup");
    });
    /* evaluation pattern card: the evaluation glyph in its (periwinkle) tile */
    L.querySelectorAll('.pa-ic[data-ic="overview"]').forEach(p=>{ p.dataset.ic = "evaluation"; p.innerHTML = ClayIcons.glyph.evaluation; });
    /* tab bar: soft-solid glyphs; each tab wears its own area, so the active pill is that area's tile colour */
    L.querySelectorAll(".tabs > span > .cz-ti").forEach(ti=>{
      const g = TAB_GLYPH[ti.dataset.ic]; if(!g) return;
      ti.innerHTML = ClayIcons.glyph[g[0]]; ti.parentElement.dataset.world = g[1];
    });
    /* "View all trends" under the trends grid (and its good ━ bad legend), as in the reference's Symptoms screen */
    L.querySelectorAll(".grid2").forEach(g=>{
      if(!g.querySelector(".tile.trend")) return;
      const at = g.nextElementSibling && g.nextElementSibling.matches(".note") ? g.nextElementSibling : g;
      at.insertAdjacentHTML("afterend", `<div class="st-trends" data-go="insights/home" data-label="View all trends"><i class="st-sq" data-world="insights">${ClayIcons.glyph["tab-insights"]}</i><span>View all trends</span><span class="r">›</span></div>`);
    });
  }

  /* companion state: Today is awake by day and asleep at night; an empty state (nothing due yet) always rests */
  function tod(root, phase){
    root.querySelectorAll(".cz-buddy").forEach(b=>{
      const st = b.dataset.buddy==="rest" || phase==="night" ? "sleep" : "awake";
      if(b.dataset.state !== st && typeof buddy==="function"){ b.dataset.state = st; b.innerHTML = buddy(st); }
    });
  }

  /* save confirmation: a few small sparks fly up from the button (instead of the ring of light) */
  function sparkle(frame, x, y, world){                           // world: of the sheet whose button was tapped
    const box = document.createElement("i"); box.className = "cz-spark"; box.style.left = x+"px"; box.style.top = y+"px";
    if(world) box.dataset.world = world;
    const N = 9, out = [];
    for(let i=0;i<N;i++){
      const s = document.createElement("b"); s.className = i%3===0 ? "st" : "";
      box.appendChild(s); out.push(s);
    }
    frame.appendChild(box);
    let done = 0;
    out.forEach((s,i)=>{
      const a = -Math.PI/2 + (i-(N-1)/2) * 0.34 + (Math.random()-.5)*.12, d = 46 + (i%2)*22 + Math.random()*14;
      const dx = Math.cos(a)*d, dy = Math.sin(a)*d, r = (Math.random()-.5)*90;
      const an = s.animate([
        {transform:"translate(-50%,-50%) scale(.2) rotate(0deg)", opacity:0},
        {opacity:1, offset:.2},
        {transform:`translate(calc(-50% + ${dx.toFixed(1)}px),calc(-50% + ${dy.toFixed(1)}px)) scale(1) rotate(${r.toFixed(0)}deg)`, opacity:0}],
        {duration:900 + i*25, delay:i*18, easing:"cubic-bezier(.2,.7,.3,1)"});
      an.onfinish = an.oncancel = () => { if(++done===N) box.remove(); };
    });
  }

  /* iOS Safari only shows :active (the squish) when the document has a touch listener */
  document.addEventListener("touchstart", ()=>{}, {passive:true});

  return { worldOf, decorate, tod, sparkle, icon, ICONS };
})();
