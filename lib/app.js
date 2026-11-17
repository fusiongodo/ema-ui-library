/* ====== ROUTER: library[/area] · flows[/flow-id] · play/<flow-id>/<screen-id> ======
   Navigation is in memory: every in-page link (href="#…") is intercepted and handed to nav().
   No hash assignment, no hashchange, no history.go, so it also works inside sandboxed embeds.
   The hash is read once on load (deep link) and mirrored best effort via replaceState. */
const VIEWS = ["library","flows","play"];
let currentView = null;

function setHash(t){ try { history.replaceState(null, "", "#"+String(t).replace(/^#/,"")); } catch(_){} }

function nav(target){
  let t = String(target || "").replace(/^#/,"");
  try { t = decodeURIComponent(t); } catch(_){}
  const parts = t.split("/");
  let v = parts[0];
  if(!v){ parts[0] = v = "play"; }                                     // default: straight into the clickable phone
  if(!VIEWS.includes(v)){ parts.unshift("library"); v = "library"; }   // old area anchors (#protocols) still work
  if(v!==currentView){
    if(currentView==="play") Play.leave();
    VIEWS.forEach(x=>document.getElementById("v-"+x).hidden = x!==v);
    document.querySelectorAll(".views a").forEach(a=>a.classList.toggle("on", a.dataset.v===v));
    document.body.className = "v-"+v;
    document.title = {library:"App Wireframes", flows:"Flows · App Wireframes", play:"Play"}[v];
    currentView = v;
    window.scrollTo(0,0);
  }
  if(v!=="play") setHash(parts.join("/"));
  if(v==="library"){ const s = parts[1] && document.getElementById(parts[1]); if(s) s.scrollIntoView(); }
  if(v==="flows") Flows.show(parts[1]);
  if(v==="play") Play.show(parts[1], parts.slice(2).join("/"));
}

function boot(){
  renderAll();
  const bad = checkLinks();
  if(bad.length) console.warn("Broken go links:\n" + bad.join("\n"));
  document.addEventListener("click", e=>{
    const a = e.target.closest('a[href^="#"]');
    if(a){ e.preventDefault(); nav(a.getAttribute("href")); return; }
    const ph = e.target.closest("#out .col[data-id] .phone");          // library: tap a screen to play it
    if(ph){ const id = ph.closest(".col").dataset.id; nav(`play/${flowOf(id) || "-"}/${id}`); }
  });
  let start = ""; try { start = location.hash; } catch(_){}
  nav(start);
  if(typeof Splash !== "undefined") Splash.auto();                                  // MEjority intro, once, only when opening in Play
}
