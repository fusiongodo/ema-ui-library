/* Builds icon-lab/index.html, the review page where the app's icons are chosen one by one.

   node icon-lab/build.mjs        writes icon-lab/index.html

   An icon is one file icons/<id>.mjs:

     export default {
       id: "today",                 // kebab-case; also the db document id (decisions/<id>)
       order: 1,                    // sort key on the page (missing = after the numbered ones, then by id)
       kind: "tile",                // "tile" (pastel rounded square) | "tab" (tab-bar glyph)
       title: "Heute",
       meaning: "One line on what it stands for in our app.",
       area: "today",               // today | checkins | protocols | insights | voice | neutral
       ref: "refs/today.png",       // reference crop, relative to icon-lab/ (optional)
       refNote: "What the reference shows",
       variants: [                  // 3 to 5
         { key: "A", name: "Soft", svg: "<svg viewBox=\"0 0 96 96\" …>…</svg>", note: "…" },
         …
       ],
     };

   tile: svg is a complete <svg viewBox="0 0 96 96"> with its own rounded-square background.
   tab:  svg is <svg viewBox="0 0 48 48"> drawn with currentColor, no background.
   Files whose name starts with "." are ignored; files starting with "_" (the samples) only count while no real module
   exists. A module or variant that fails to load or validate is skipped with a warning; the build goes on.
   Every SVG is placed several times on the page, so its ids are rewritten per copy (id="x", url(#x), href="#x").

   The page is an embeddable fragment for the artifact host (<title>, <meta>, <style>, content, <script>),
   no doctype/html/head/body. Decisions are saved by the page itself (db capability, else localStorage). */
import { readdirSync, readFileSync, writeFileSync, existsSync, statSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join, resolve, extname, relative, isAbsolute } from "node:path";

/* Bump when a new set of variants goes up, so decisions of different rounds can be told apart. */
const ROUND = "1";

const HERE = dirname(fileURLToPath(import.meta.url));
const ICONS_DIR = join(HERE, "icons");
const OUT = join(HERE, "index.html");
const KINDS = ["tile", "tab"];
const AREAS = ["today", "checkins", "protocols", "insights", "voice", "neutral"];
const AREA_DE = { today: "Heute", checkins: "Check-ins", protocols: "Protokolle", insights: "Einblicke", voice: "Sprache", neutral: "Neutral" };
const KEYS = ["A", "B", "C", "D", "E"];
const VIEWBOX = { tile: "0 0 96 96", tab: "0 0 48 48" };
const REF_WARN = 300 * 1024, PAGE_MAX = 16 * 1024 * 1024;
const MIME = { ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".gif": "image/gif", ".svg": "image/svg+xml", ".avif": "image/avif" };

const warn = msg => console.warn("  ! " + msg);
const esc = s => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const str = v => typeof v === "string" && v.trim() ? v.trim() : "";

/* ---------- load + validate ---------- */
function svgProblem(s){
  if(!/^<svg[\s>]/.test(s) || !/<\/svg>$/.test(s)) return "svg ist kein vollständiger <svg>…</svg>-String";
  if(/<script[\s>]/i.test(s) || /\son[a-z]+\s*=/i.test(s)) return "Skript oder Event-Attribut im SVG";
  if(/(?:href|src)\s*=\s*["'](?!#|data:)/i.test(s) || /url\(\s*["']?(?!#|data:)/i.test(s) || /@import/i.test(s)) return "externe Referenz im SVG";
  return "";
}

/* returns { icon } or { skip: reason }; minor issues are warned and repaired */
function validate(m, file){
  if(!m || typeof m !== "object") return { skip: "kein default-Export mit einem Objekt" };
  const id = str(m.id);
  if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) return { skip: "id fehlt oder ist nicht kebab-case" };
  if(!KINDS.includes(m.kind)) return { skip: `kind ist "${m.kind}", erlaubt: ${KINDS.join(", ")}` };
  const title = str(m.title) || id;
  if(!str(m.title)) warn(`${file}: title fehlt, nehme id`);
  let area = m.area;
  if(!AREAS.includes(area)){ warn(`${file}: area "${area}" unbekannt, nehme neutral`); area = "neutral"; }
  if(m.order != null && !Number.isFinite(m.order)) warn(`${file}: order ist keine Zahl`);
  const variants = [], seen = new Set();
  for(const [k, v] of (Array.isArray(m.variants) ? m.variants : []).entries()){
    const at = `Variante ${v && v.key ? v.key : k + 1}`;
    if(!v || typeof v !== "object"){ warn(`${file}: ${at} übersprungen: kein Objekt`); continue; }
    const key = str(v.key).toUpperCase();
    if(!KEYS.includes(key)){ warn(`${file}: ${at} übersprungen: key muss A–E sein`); continue; }
    if(seen.has(key)){ warn(`${file}: ${at} übersprungen: key ${key} doppelt`); continue; }
    const svg = typeof v.svg === "string" ? v.svg.trim() : "";
    const bad = svgProblem(svg);
    if(bad){ warn(`${file}: ${at} übersprungen: ${bad}`); continue; }
    const vb = (svg.match(/viewBox\s*=\s*["']([^"']+)["']/) || [])[1];
    if(!vb || vb.trim().split(/[\s,]+/).join(" ") !== VIEWBOX[m.kind]) warn(`${file}: ${at}: viewBox ist "${vb || "–"}", erwartet "${VIEWBOX[m.kind]}"`);
    if(m.kind === "tab" && !/currentColor/i.test(svg)) warn(`${file}: ${at}: Tab-Glyphe ohne currentColor (färbt sich nicht als aktiver Tab)`);
    seen.add(key);
    variants.push({ key, name: str(v.name) || `Variante ${key}`, note: str(v.note), svg });
  }
  if(!variants.length) return { skip: "keine brauchbare Variante" };
  variants.sort((a, b) => a.key.localeCompare(b.key));
  if(variants.length < 3 || variants.length > 5) warn(`${file}: ${variants.length} Varianten (erwartet 3 bis 5)`);
  return { icon: { id, order: Number.isFinite(m.order) ? m.order : Infinity, kind: m.kind, area, title, meaning: str(m.meaning),
    ref: str(m.ref), refNote: str(m.refNote), variants, file } };
}

function loadRef(icon){
  if(!icon.ref){ warn(`${icon.file}: kein ref angegeben`); return ""; }
  const path = resolve(HERE, icon.ref), rel = relative(HERE, path);
  if(rel.startsWith("..") || isAbsolute(rel)){ warn(`${icon.file}: ref "${icon.ref}" liegt außerhalb von icon-lab/`); return ""; }
  if(!existsSync(path) || !statSync(path).isFile()){ warn(`${icon.file}: ref "${icon.ref}" fehlt`); return ""; }
  const mime = MIME[extname(path).toLowerCase()];
  if(!mime){ warn(`${icon.file}: ref "${icon.ref}": unbekanntes Bildformat`); return ""; }
  const buf = readFileSync(path);
  if(buf.length > REF_WARN) warn(`${icon.file}: ref "${icon.ref}" ist ${(buf.length / 1024).toFixed(0)} KB (über 300 KB, bitte kleiner zuschneiden)`);
  return `data:${mime};base64,${buf.toString("base64")}`;
}

async function loadIcons(){
  const all = existsSync(ICONS_DIR) ? readdirSync(ICONS_DIR).filter(n => n.endsWith(".mjs") && !n.startsWith(".")).sort() : [];
  const real = all.filter(n => !n.startsWith("_"));
  const files = real.length ? real : all;
  if(!real.length && all.length) console.log(`       keine echten Module, nehme die Beispiele: ${all.join(", ")}`);
  const list = [], seen = new Map();
  for(const file of files){
    let m;
    try { m = (await import(pathToFileURL(join(ICONS_DIR, file)).href + `?t=${Date.now()}`)).default; }
    catch(e){ warn(`${file} übersprungen: lädt nicht (${String(e && e.message || e).split("\n")[0]})`); continue; }
    let r;
    try { r = validate(m, file); } catch(e){ r = { skip: String(e && e.message || e) }; }
    if(r.skip){ warn(`${file} übersprungen: ${r.skip}`); continue; }
    if(seen.has(r.icon.id)){ warn(`${file} übersprungen: id "${r.icon.id}" gibt es schon in ${seen.get(r.icon.id)}`); continue; }
    seen.set(r.icon.id, file);
    r.icon.refSrc = loadRef(r.icon);
    list.push(r.icon);
  }
  return list.sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));
}

/* ---------- SVG copies ---------- */
/* Each copy gets its own id prefix, so gradients, masks and clip paths of different icons (or copies) never collide. */
let copyNo = 0;
function place(svg){
  const pre = `il${(copyNo++).toString(36)}-`;
  const ids = new Set([...svg.matchAll(/\sid\s*=\s*["']([^"']+)["']/g)].map(m => m[1]));
  let out = svg;
  if(ids.size){
    out = out
      .replace(/(\sid\s*=\s*["'])([^"']+)(["'])/g, (m, a, id, b) => a + pre + id + b)
      .replace(/url\(\s*(['"]?)#([^)'"\s]+)\1\s*\)/g, (m, q, id) => ids.has(id) ? `url(${q}#${pre}${id}${q})` : m)
      .replace(/((?:xlink:)?href\s*=\s*["'])#([^"']+)(["'])/g, (m, a, id, b) => ids.has(id) ? `${a}#${pre}${id}${b}` : m);
  }
  return out.replace(/^<svg/, '<svg aria-hidden="true" focusable="false"');
}

/* ---------- page ---------- */
const css = `
/* Layout: sticky summary bar, then one section per icon: reference left (top on phones), our variants as a wrapping grid.
   Page chrome follows the theme; icon artwork sits on fixed light plates (the grounds it will live on in the app). */
:root{
  --bg:#FCFCFB; --card:#F3F2EF; --card-2:#EAE9E5; --raise:#FFFFFF; --ink:#141416; --muted:#6B6B71; --line:rgba(20,20,22,.09);
  --sel:#141416; --sel-ink:#FFFFFF; --focus:#2F6BD8; --no:#A63D2A; --no-bg:#F8E7E2; --bar:rgba(252,252,251,.94);
  --plate:#FFFFFF; --plate-line:rgba(20,20,22,.07); --ground-grey:#F3F2EF; --ground-white:#FFFFFF; --tab-off:#141416;
  --a-today:#8A3F0A; --a-checkins:#1B5C40; --a-protocols:#383D9C; --a-insights:#782C66; --a-voice:#1F5A59; --a-neutral:#4A453D;
  --font:-apple-system,BlinkMacSystemFont,"SF Pro Text","SF Pro Display","Inter","Segoe UI",system-ui,sans-serif;
  --gl:max(16px,env(safe-area-inset-left,0px)); --gr:max(16px,env(safe-area-inset-right,0px));
}
@media (prefers-color-scheme: dark){:root:not([data-theme="light"]){
  --bg:#111113; --card:#1C1C1F; --card-2:#29292D; --raise:#232327; --ink:#F2F2F3; --muted:#A3A3AA; --line:rgba(255,255,255,.1);
  --sel:#F2F2F3; --sel-ink:#141416; --focus:#8EB4FF; --no:#F2A897; --no-bg:#3B2521; --bar:rgba(17,17,19,.93);
  --plate:#ECEBE7; --plate-line:rgba(0,0,0,0); --ground-grey:#F3F2EF; --ground-white:#FFFFFF; --tab-off:#141416;
  color-scheme:dark}}
:root[data-theme="dark"]{
  --bg:#111113; --card:#1C1C1F; --card-2:#29292D; --raise:#232327; --ink:#F2F2F3; --muted:#A3A3AA; --line:rgba(255,255,255,.1);
  --sel:#F2F2F3; --sel-ink:#141416; --focus:#8EB4FF; --no:#F2A897; --no-bg:#3B2521; --bar:rgba(17,17,19,.93);
  --plate:#ECEBE7; --plate-line:rgba(0,0,0,0); --ground-grey:#F3F2EF; --ground-white:#FFFFFF; --tab-off:#141416;
  color-scheme:dark}
body{margin:0;background:var(--bg);color:var(--ink);font-family:var(--font);font-size:16px;line-height:1.45;-webkit-font-smoothing:antialiased}
.il{box-sizing:border-box;max-width:1180px;margin:0 auto;padding-block:28px 64px;padding-left:var(--gl);padding-right:var(--gr)}
.il *{box-sizing:border-box}
.il button,.il textarea{font:inherit;color:inherit}
.il :focus-visible{outline:3px solid var(--focus);outline-offset:2px}
.il-sr{position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0}

.il-top{display:flex;flex-direction:column;gap:8px;max-width:68ch;margin-bottom:18px}
.il-eyebrow{margin:0;font-size:13px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--muted)}
.il h1{margin:0;font-size:clamp(28px,4.4vw,38px);line-height:1.1;font-weight:700;letter-spacing:-.02em}
.il-lede{margin:0;color:var(--muted)}
.il-index{display:flex;flex-wrap:wrap;gap:6px;margin:8px 0 0;padding:0;list-style:none}
.il-index a{display:inline-flex;align-items:center;gap:7px;padding:5px 11px 5px 9px;border-radius:999px;background:var(--card);color:var(--ink);font-size:14px;text-decoration:none}
.il-index a:hover{background:var(--card-2)}
.il-index i{flex:none;display:inline-grid;place-items:center;min-width:18px;height:18px;padding:0 4px;border-radius:9px;font-style:normal;font-size:11px;font-weight:700;
  box-shadow:inset 0 0 0 1.5px var(--muted);color:var(--muted)}
.il-index a[data-state="ok"] i{background:var(--sel);color:var(--sel-ink);box-shadow:none}
.il-index a[data-state="none"] i{background:var(--no-bg);color:var(--no);box-shadow:none}

.il-bar{position:sticky;top:0;z-index:5;margin:0 calc(var(--gr) * -1) 8px calc(var(--gl) * -1);padding:8px var(--gr) 8px var(--gl);
  background:var(--bar);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);border-bottom:1px solid var(--line);
  display:flex;flex-direction:column;gap:6px}
.il-bar-row{display:flex;align-items:center;gap:6px 12px}
.il-mini{margin:0 0 0 auto;flex:none;font-size:12px;color:var(--muted);white-space:nowrap}
.il-mini[data-mode="local"]{color:var(--ink)}
.il-status{display:flex;flex-wrap:wrap;align-items:center;gap:8px 12px;margin:0 0 14px}
.il-count{margin:0;font-size:15px;font-weight:600;font-variant-numeric:tabular-nums;flex:1 1 auto;min-width:0}
.il-count span{color:var(--muted);font-weight:500}
.il-tally{margin:0;display:flex;flex-wrap:wrap;gap:4px 5px;align-items:center;font-size:12px;color:var(--muted);flex:1 1 auto;min-width:0}
.il-tally b{font-weight:600;color:var(--muted);margin-right:2px}
.il-tally span{display:inline-flex;gap:4px;align-items:center;padding:1px 7px;border-radius:999px;background:var(--card);font-variant-numeric:tabular-nums}
.il-tally span[data-lead]{background:var(--sel);color:var(--sel-ink)}
.il-save{margin:0;font-size:13px;color:var(--muted)}
.il-save[data-mode="local"]{color:var(--ink)}
.il-btn{appearance:none;border:0;border-radius:999px;padding:8px 14px;background:var(--sel);color:var(--sel-ink) !important;font-size:14px;font-weight:600;cursor:pointer;white-space:nowrap}
.il-btn.small{padding:6px 12px;font-size:13px}
.il-btn:disabled{background:var(--card-2);color:var(--muted) !important;cursor:default}
.il-btn.quiet{background:var(--card);color:var(--ink) !important}
.il-btn.quiet:hover{background:var(--card-2)}
.il-copybox{width:100%;min-height:120px;margin-top:8px;padding:10px 12px;border-radius:14px;border:1px solid var(--line);background:var(--raise);font:13px/1.45 ui-monospace,SFMono-Regular,Menlo,monospace !important}

.il-icon{padding-block:26px 6px;border-top:1px solid var(--line);scroll-margin-top:var(--bar-h,96px)}
.il-icon:first-of-type{border-top:0}
.il-ih{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:14px}
.il-kick{margin:0 0 2px;font-size:13px;color:var(--muted)}
.il h2{margin:0;font-size:clamp(21px,2.6vw,25px);line-height:1.15;font-weight:700;letter-spacing:-.01em}
.il-meaning{margin:4px 0 0;max-width:62ch}
.il-state{flex:none;margin:2px 0 0;padding:4px 11px;border-radius:999px;font-size:13px;font-weight:600;box-shadow:inset 0 0 0 1.5px var(--line);color:var(--muted);white-space:nowrap}
.il-icon[data-state="ok"] .il-state{background:var(--sel);color:var(--sel-ink);box-shadow:none}
.il-icon[data-state="none"] .il-state{background:var(--no-bg);color:var(--no);box-shadow:none}

.il-row{display:grid;grid-template-columns:minmax(170px,230px) minmax(0,1fr);gap:18px;align-items:start}
.il-ref{margin:0;padding:12px;border-radius:22px;background:var(--card);display:flex;flex-direction:column;gap:8px}
.il-ref-h{margin:0;font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--muted)}
.il-ref-img{display:grid;place-items:center;border-radius:14px;background:var(--plate);overflow:hidden;min-height:96px}
.il-ref-img img{display:block;max-width:100%;max-height:300px;object-fit:contain}
.il-ref-none{padding:24px 12px;font-size:14px;color:#6B6B71;text-align:center}
.il-ref-txt{display:flex;flex-direction:column;gap:4px}
.il-ref-note{margin:0;font-size:14px;color:var(--muted)}

.il-vars-h{margin:0 0 8px;font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--muted)}
.il-vars{display:grid;grid-template-columns:repeat(auto-fill,minmax(158px,1fr));gap:12px}
.il-v{position:relative;display:block;cursor:pointer;min-width:0}
.il-v input,.il-none input{position:absolute;opacity:0;width:1px;height:1px;margin:0;pointer-events:none}
.il-vb{display:flex;flex-direction:column;gap:9px;height:100%;padding:10px 10px 12px;border-radius:22px;background:var(--card);
  box-shadow:inset 0 0 0 1.5px transparent;transition:box-shadow .15s ease,opacity .15s ease,background .15s ease}
.il-v:hover .il-vb{background:var(--card-2)}
.il-v input:focus-visible + .il-vb,.il-none input:focus-visible + .il-nb{outline:3px solid var(--focus);outline-offset:2px}
.il-v input:checked + .il-vb{box-shadow:inset 0 0 0 2.5px var(--sel)}
.il-vh{display:flex;align-items:center;gap:7px;min-height:26px;font-size:14px;font-weight:600;line-height:1.2}
.il-key{flex:none;display:inline-grid;place-items:center;width:24px;height:24px;border-radius:8px;background:var(--raise);font-size:13px;font-weight:700;box-shadow:inset 0 0 0 1px var(--line)}
.il-v input:checked + .il-vb .il-key{background:var(--sel);color:var(--sel-ink);box-shadow:none}
.il-vname{min-width:0;overflow-wrap:anywhere}
.il-tick{margin-left:auto;flex:none;display:none;font-size:12px;font-weight:700;color:var(--ink)}
.il-v input:checked + .il-vb .il-tick{display:inline}
.il-big{display:grid;place-items:center;height:124px;border-radius:16px;background:var(--plate);box-shadow:inset 0 0 0 1px var(--plate-line)}
.il-big .ic{width:96px;height:96px}
.il-big .ic.tab{color:var(--tab-off)}
.il-small{display:flex;gap:6px}
.il-sw{flex:1 1 0;display:grid;place-items:center;height:62px;border-radius:12px;box-shadow:inset 0 0 0 1px var(--plate-line)}
.il-sw.grey{background:var(--ground-grey)}
.il-sw.white{background:var(--ground-white)}
.il-sw .ic{width:44px;height:44px}
.il-tabbar{flex:1 1 auto;display:flex;justify-content:space-around;align-items:center;height:62px;border-radius:12px;background:var(--ground-white);box-shadow:inset 0 0 0 1px var(--plate-line)}
.il-tabbar span{display:flex;flex-direction:column;align-items:center;gap:2px;font-size:10px;font-weight:600;color:#6B6B71}
.il-tabbar .ic{width:26px;height:26px}
.il-tabbar .off{color:var(--tab-off)}
.il-cap{margin:-3px 0 0;font-size:11.5px;color:var(--muted)}
.il-vnote{margin:0;font-size:13px;color:var(--muted)}
.ic{display:block;flex:none}
.ic svg{display:block;width:100%;height:100%;overflow:visible}

.il-none{grid-column:1/-1;position:relative;display:block;cursor:pointer}
.il-nb{display:flex;align-items:center;justify-content:center;gap:8px;padding:12px 16px;border-radius:999px;background:var(--card);font-weight:600;font-size:15px;
  box-shadow:inset 0 0 0 1.5px transparent;transition:background .15s ease}
.il-none:hover .il-nb{background:var(--card-2)}
.il-none input:checked + .il-nb{background:var(--no-bg);color:var(--no);box-shadow:inset 0 0 0 2px var(--no)}
.il-icon[data-state="none"] .il-v .il-vb{opacity:.55}

.il-foot{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:6px 10px;align-items:end;margin-top:14px}
.il-foot label{grid-column:1/-1;font-size:13px;font-weight:600;color:var(--muted)}
.il-foot textarea{width:100%;min-height:44px;padding:10px 12px;border-radius:14px;border:1px solid var(--line);background:var(--raise);font-size:16px;resize:vertical}
.il-foot .il-btn[hidden]{display:none}
.il-end{margin-top:36px;padding-top:20px;border-top:1px solid var(--line);display:flex;flex-direction:column;gap:10px;align-items:flex-start;color:var(--muted);font-size:14px}
.il-end p{margin:0}
.il-empty{padding:30px 0;color:var(--muted)}

@media (max-width:719px){
  .il{padding-block:18px 48px}
  .il-row{grid-template-columns:minmax(0,1fr);gap:12px}
  .il-ref{flex-direction:row;align-items:center;gap:12px}
  .il-ref-img{flex:0 0 auto;width:min(46%,190px)}
  .il-ref-img img{max-height:200px}
  .il-ref-txt{flex:1 1 auto;min-width:0;display:flex;flex-direction:column;gap:4px}
  .il-vars{grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
  .il-vb{padding:8px 8px 10px;border-radius:20px}
  .il-big{height:116px}
  .il-sw{height:56px}
  .il-ih{flex-direction:column;gap:8px}
  .il-foot{grid-template-columns:minmax(0,1fr)}
  .il-foot .il-btn{justify-self:start}
  .il-ref.no-img .il-ref-img{min-height:56px;width:auto;flex:0 0 auto}
  .il-ref.no-img .il-ref-none{padding:10px 14px}
}
@media (prefers-reduced-motion: reduce){
  .il *,.il *::before,.il *::after{transition:none !important;animation:none !important;scroll-behavior:auto !important}
}
`;

function variantCard(icon, v){
  const pid = `il-pick-${icon.id}-${v.key}`;
  const small = icon.kind === "tile"
    ? `<span class="il-small"><span class="il-sw grey" title="auf Karte (#F3F2EF)"><span class="ic">${place(v.svg)}</span></span><span class="il-sw white" title="auf Weiß"><span class="ic">${place(v.svg)}</span></span></span>
<span class="il-cap">44 pt · auf Grau und Weiß</span>`
    : `<span class="il-small"><span class="il-tabbar"><span><span class="ic off">${place(v.svg)}</span>inaktiv</span><span style="color:var(--a-${icon.area})"><span class="ic">${place(v.svg)}</span>aktiv</span></span></span>
<span class="il-cap">26 pt · Tab-Leiste</span>`;
  return `<label class="il-v" for="${pid}"><input type="radio" name="il-pick-${icon.id}" id="${pid}" value="${v.key}"><span class="il-vb">
<span class="il-vh"><span class="il-key">${v.key}</span><span class="il-vname">${esc(v.name)}</span><span class="il-tick">✓</span></span>
<span class="il-big"><span class="ic${icon.kind === "tab" ? " tab" : ""}">${place(v.svg)}</span></span>
${small}
${v.note ? `<span class="il-vnote">${esc(v.note)}</span>` : ""}
</span></label>`;
}

function section(icon, k){
  const ref = icon.refSrc
    ? `<span class="il-ref-img"><img src="${icon.refSrc}" alt="${esc("Referenz: " + (icon.refNote || icon.title))}"></span>`
    : `<span class="il-ref-img"><span class="il-ref-none">Keine Referenz</span></span>`;
  return `<section class="il-icon" id="il-${icon.id}" data-icon="${icon.id}" data-state="open" aria-labelledby="il-h-${icon.id}">
<div class="il-ih">
<div><p class="il-kick">${k + 1} · ${icon.kind === "tile" ? "Kachel" : "Tab-Glyphe"} · ${AREA_DE[icon.area]}</p>
<h2 id="il-h-${icon.id}">${esc(icon.title)}</h2>
${icon.meaning ? `<p class="il-meaning">${esc(icon.meaning)}</p>` : ""}</div>
<p class="il-state" id="il-state-${icon.id}">offen</p>
</div>
<div class="il-row">
<div class="il-ref${icon.refSrc ? "" : " no-img"}">${ref}<div class="il-ref-txt"><p class="il-ref-h">Referenz</p>${icon.refNote ? `<p class="il-ref-note">${esc(icon.refNote)}</p>` : ""}</div></div>
<div role="radiogroup" aria-labelledby="il-vh-${icon.id}">
<p class="il-vars-h" id="il-vh-${icon.id}">Unsere Varianten</p>
<div class="il-vars">
${icon.variants.map(v => variantCard(icon, v)).join("\n")}
<label class="il-none" for="il-pick-${icon.id}-none"><input type="radio" name="il-pick-${icon.id}" id="il-pick-${icon.id}-none" value="none"><span class="il-nb">Keine davon</span></label>
</div>
</div>
</div>
<div class="il-foot">
<label for="il-note-${icon.id}">Notiz</label>
<textarea id="il-note-${icon.id}" rows="1" maxlength="2000" placeholder="optional"></textarea>
<button type="button" class="il-btn quiet" id="il-reset-${icon.id}" hidden>Auswahl aufheben</button>
</div>
</section>`;
}

/* ---------- client script (runs in the page) ---------- */
function client(){
  /* globals: ROUND, ICONS are injected above */
  const LS_KEY = "icon-lab:decisions";
  const $ = id => document.getElementById(id);
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const known = new Map(ICONS.map(i => [i.id, i]));
  const okChoice = (id, c) => c === null || c === "none" || (typeof c === "string" && known.get(id).keys.includes(c));
  const tms = s => { const t = Date.parse(s || ""); return Number.isFinite(t) ? t : 0; };
  const reduce = () => { try { return matchMedia("(prefers-reduced-motion: reduce)").matches; } catch { return false; } };

  /* state per icon: { choice: null | "A".."E" | "none", note, updatedAt (ISO or "") } */
  const state = new Map(ICONS.map(i => [i.id, { choice: null, note: "", updatedAt: "" }]));

  /* ---------- local copy (always kept, the only store when db is absent) ---------- */
  function readLocal(){
    try {
      const raw = JSON.parse(localStorage.getItem(LS_KEY) || "{}");
      for(const [id, d] of Object.entries(raw && typeof raw === "object" ? raw : {})){
        if(!known.has(id) || !d || typeof d !== "object") continue;
        if(d.round !== ROUND) continue;   /* a decision on an older round's variants does not carry over */
        if(!okChoice(id, d.choice ?? null)) continue;
        state.set(id, { choice: d.choice ?? null, note: typeof d.note === "string" ? d.note : "", updatedAt: typeof d.updatedAt === "string" ? d.updatedAt : "" });
      }
    } catch {}
  }
  function writeLocal(){
    try {
      const out = {};
      for(const [id, s] of state) if(s.updatedAt) out[id] = { icon: id, choice: s.choice, note: s.note, round: ROUND, updatedAt: s.updatedAt };
      localStorage.setItem(LS_KEY, JSON.stringify(out));
    } catch {}
  }

  /* ---------- rendering ---------- */
  function renderIcon(id){
    const s = state.get(id), sec = $("il-" + id);
    if(!sec) return;
    const st = s.choice === null ? "open" : s.choice === "none" ? "none" : "ok";
    sec.dataset.state = st;
    for(const k of [...known.get(id).keys, "none"]){
      const r = $(`il-pick-${id}-${k}`);
      if(r) r.checked = s.choice === k;
    }
    const v = s.choice && s.choice !== "none" ? known.get(id).names[s.choice] : "";
    $("il-state-" + id).textContent = st === "open" ? "offen" : st === "none" ? "Keine davon" : `${s.choice} freigegeben`;
    $("il-state-" + id).title = v;
    const note = $("il-note-" + id);
    if(note && document.activeElement !== note && note.value !== s.note) note.value = s.note;
    const reset = $("il-reset-" + id);
    if(reset) reset.hidden = s.choice === null;
    const chip = document.querySelector(`.il-index a[data-for="${id}"]`);
    if(chip){ chip.dataset.state = st; chip.querySelector("i").textContent = st === "ok" ? s.choice : st === "none" ? "–" : ""; }
  }
  function renderSummary(){
    const n = ICONS.length;
    let done = 0; const tally = {}; let none = 0;
    for(const [, s] of state){ if(s.choice === null) continue; done++; if(s.choice === "none") none++; else tally[s.choice] = (tally[s.choice] || 0) + 1; }
    $("il-done").textContent = done;
    $("il-open").textContent = `${n - done} offen`;
    const letters = [...new Set(ICONS.flatMap(i => i.keys))].sort();
    const max = Math.max(0, ...Object.values(tally));
    $("il-tally").innerHTML = "<b>Stil</b>" + letters.map(l => `<span${max && tally[l] === max ? " data-lead" : ""}>${l} ${tally[l] || 0}</span>`).join("")
      + `<span>keine ${none}</span>`;
    const next = $("il-next");
    next.disabled = done === n;
    next.textContent = done === n ? "Alles entschieden" : "Nächstes ↓";
  }
  function renderAll(){ for(const i of ICONS) renderIcon(i.id); renderSummary(); }

  /* ---------- save status ---------- */
  let mode = "pending";   /* pending | db | local */
  let note = "";          /* extra line while db works but something is off */
  let lastErr = "";
  const inflight = new Set(), again = new Set(), timers = new Map();
  function renderSave(){
    const el = $("il-save");
    el.dataset.mode = mode;
    let t;
    if(mode === "pending") t = "Verbinde mit dem gemeinsamen Speicher …";
    else if(mode === "local") t = lastErr || "Entscheidungen werden nur auf diesem Gerät gespeichert.";
    else if(inflight.size || timers.size) t = "Speichert …";
    else t = note || "Gespeichert, Claude kann die Entscheidungen lesen.";
    el.textContent = t;
    $("il-copy").hidden = mode !== "local" && !note;
    const mini = $("il-mini");
    mini.dataset.mode = mode === "local" || note ? "local" : mode;
    mini.textContent = mode === "pending" ? "verbindet …" : mode === "local" || note ? "nur auf diesem Gerät" : (inflight.size || timers.size) ? "speichert …" : "gespeichert";
  }

  /* ---------- db ---------- */
  let db = null, loaded = false, merged = false, loadTimer = 0;
  const lastSent = new Map();   /* id -> signature of what the store holds */
  const sig = s => JSON.stringify([s.choice, s.note, ROUND]);
  const docOf = (id, s) => ({ icon: id, choice: s.choice, note: s.note, round: ROUND, updatedAt: s.updatedAt });

  function goLocal(msg){
    mode = "local"; lastErr = msg || "";
    for(const t of timers.values()) clearTimeout(t);
    timers.clear();
    renderSave();
  }
  function schedule(id, delay){
    if(mode !== "db") return;
    clearTimeout(timers.get(id));
    timers.set(id, setTimeout(() => { timers.delete(id); pump(id); }, delay));
    renderSave();
  }
  async function pump(id){
    if(mode !== "db" || !db) return;
    if(inflight.has(id)){ again.add(id); return; }
    const s = state.get(id), sg = sig(s);
    if(lastSent.get(id) === sg){ renderSave(); return; }
    const doc = docOf(id, s);
    inflight.add(id); renderSave();
    try {
      const ref = db.doc("decisions/" + id);
      try { await ref.set(doc); }
      catch(e){
        if(e && e.code === "unavailable"){ await sleep(400 + Math.random() * 900); await ref.set(doc); }
        else throw e;
      }
      lastSent.set(id, sg);
    } catch(e){
      const code = e && e.code;
      goLocal(code === "invalid_argument"
        ? "Speichern abgelehnt (keine Schreibrechte?). Entscheidungen bleiben nur auf diesem Gerät."
        : code === "quota_exceeded" ? "Speicher voll. Entscheidungen bleiben nur auf diesem Gerät."
        : "Speichern klappt gerade nicht. Entscheidungen bleiben nur auf diesem Gerät.");
    } finally {
      inflight.delete(id);
      if(again.delete(id)) pump(id);
      renderSave();
    }
  }
  function onSnap(snap){
    for(const d of snap.docs){
      const id = d.id, data = d.exists ? d.data() : null;
      if(!known.has(id) || !data || data.round !== ROUND) continue;
      const choice = data.choice ?? null;
      if(!okChoice(id, choice)) continue;
      const remote = { choice, note: typeof data.note === "string" ? data.note : "", updatedAt: typeof data.updatedAt === "string" ? data.updatedAt : "" };
      if(!d.metadata || !d.metadata.hasPendingWrites) lastSent.set(id, sig(remote));
      if(inflight.has(id) || timers.has(id)) continue;   /* our own newer change is on its way */
      const local = state.get(id);
      if(tms(remote.updatedAt) >= tms(local.updatedAt) && sig(remote) !== sig(local)){
        state.set(id, remote); renderIcon(id);
      }
    }
    writeLocal(); renderSummary();
    if(!snap.metadata || !snap.metadata.fromCache){
      loaded = true; clearTimeout(loadTimer);
      if(note === "Der Speicher antwortet noch nicht. Entscheidungen liegen vorerst auf diesem Gerät.") note = "";
      if(!merged){
        merged = true;   /* decisions made here earlier (offline, before the store answered) go up once */
        const there = new Map(snap.docs.filter(d => d.exists).map(d => [d.id, d.data()]));
        for(const [id, s] of state){
          if(!s.updatedAt) continue;
          const r = there.get(id);
          if(!r || r.round !== ROUND || tms(s.updatedAt) > tms(r.updatedAt)) schedule(id, 0);
        }
      }
    }
    renderSave();
  }
  async function connect(){
    let c = window.claude;
    if(!c || typeof c.use !== "function"){ await sleep(1200); c = window.claude; }
    if(!c || typeof c.use !== "function"){ goLocal(""); return; }
    let d = null, u = null;
    try {
      [d, u] = await Promise.all([
        Promise.race([Promise.resolve(c.use("db")), sleep(12000).then(() => null)]).catch(() => null),
        Promise.race([Promise.resolve(c.use("user")), sleep(12000).then(() => null)]).catch(() => null),
      ]);
    } catch {}
    if(!d){ goLocal(""); return; }
    if(u && typeof u.can === "function"){
      let w = null;
      try { w = await Promise.race([u.can("data.write"), sleep(5000).then(() => null)]); } catch {}
      if(w === false){ goLocal("Nur Lesezugriff: Entscheidungen werden nur auf diesem Gerät gespeichert."); return; }
    }
    db = d; mode = "db"; renderSave();
    loadTimer = setTimeout(() => {
      if(loaded) return;
      note = "Der Speicher antwortet noch nicht. Entscheidungen liegen vorerst auf diesem Gerät.";
      renderSave();
    }, 10000);
    try {
      db.collection("decisions").onSnapshot(onSnap, e => {
        clearTimeout(loadTimer); loaded = true;
        const code = e && e.code;
        if(code === "revoked" || code === "not_granted" || code === "capability_disabled" || code === "capability_removed"){ goLocal(""); return; }
        note = "Abgleich unterbrochen; neue Entscheidungen werden weiter gespeichert.";
        renderSave();
      });
    } catch { clearTimeout(loadTimer); goLocal(""); }
  }

  /* ---------- changes ---------- */
  function change(id, patch, delay){
    const s = { ...state.get(id), ...patch, updatedAt: new Date().toISOString() };
    state.set(id, s);
    writeLocal(); renderIcon(id); renderSummary();
    schedule(id, delay);
  }
  document.addEventListener("change", e => {
    const t = e.target;
    if(!(t instanceof HTMLInputElement) || t.type !== "radio" || !t.name.startsWith("il-pick-")) return;
    const id = t.name.slice(8);
    if(known.has(id) && t.checked) change(id, { choice: t.value }, 0);
  });
  document.addEventListener("input", e => {
    const t = e.target;
    if(!(t instanceof HTMLTextAreaElement) || !t.id.startsWith("il-note-")) return;
    const id = t.id.slice(8);
    if(!known.has(id)) return;
    /* local copy right away, the store once the typing pauses */
    const s = { ...state.get(id), note: t.value, updatedAt: new Date().toISOString() };
    state.set(id, s); writeLocal();
    schedule(id, 900);
  });
  document.addEventListener("focusout", e => {
    const t = e.target;
    if(t instanceof HTMLTextAreaElement && t.id.startsWith("il-note-") && timers.has(t.id.slice(8))){
      const id = t.id.slice(8); clearTimeout(timers.get(id)); timers.delete(id); pump(id);
    }
  });
  document.addEventListener("click", e => {
    const b = e.target instanceof Element ? e.target.closest("button, .il-index a") : null;
    if(!b) return;
    if(b.id && b.id.startsWith("il-reset-")){ const id = b.id.slice(9); if(known.has(id)) change(id, { choice: null }, 0); return; }
    if(b.id === "il-next"){ jumpNext(); return; }
    if(b.id === "il-copy" || b.id === "il-copy-end"){ copy(b); return; }
    if(b.matches(".il-index a")){ e.preventDefault(); go($("il-" + b.dataset.for)); }
  });

  /* ---------- navigation ---------- */
  function barH(){ const b = $("il-bar"); return b ? b.getBoundingClientRect().height : 0; }
  function go(el){
    if(!el) return;
    document.documentElement.style.setProperty("--bar-h", Math.ceil(barH() + 8) + "px");
    el.scrollIntoView({ behavior: reduce() ? "auto" : "smooth", block: "start" });
    const r = el.querySelector("input[type=radio]");
    if(r) setTimeout(() => { try { r.focus({ preventScroll: true }); } catch {} }, reduce() ? 0 : 450);
  }
  function jumpNext(){
    const open = ICONS.map(i => $("il-" + i.id)).filter(s => s && s.dataset.state === "open");
    if(!open.length) return;
    const line = barH() + 12;
    go(open.find(s => s.getBoundingClientRect().top > line) || open[0]);
  }

  /* ---------- copy ---------- */
  function summaryText(){
    let done = 0;
    const lines = ICONS.map(i => {
      const s = state.get(i.id);
      if(s.choice !== null) done++;
      const what = s.choice === null ? "offen" : s.choice === "none" ? "keine davon" : `${s.choice} (${i.names[s.choice]})`;
      return `${i.id}: ${what}${s.note.trim() ? " – " + s.note.trim().replace(/\s+/g, " ") : ""}`;
    });
    return [`Icon Lab, Runde ${ROUND}: ${done} von ${ICONS.length} entschieden`, ...lines].join("\n");
  }
  function copy(btn){
    const text = summaryText();
    const done = ok => {
      if(ok){ const was = btn.textContent; btn.textContent = "Kopiert"; setTimeout(() => { btn.textContent = was; }, 1800); return; }
      const box = $("il-copybox");
      box.hidden = false; box.value = text; box.focus(); box.select();
    };
    try {
      if(navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(() => done(true), () => done(false));
      else done(false);
    } catch { done(false); }
  }

  /* ---------- start ---------- */
  readLocal();
  renderAll(); renderSave();
  try { new ResizeObserver(() => document.documentElement.style.setProperty("--bar-h", Math.ceil(barH() + 8) + "px")).observe($("il-bar")); } catch {}
  connect();
}

function page(icons){
  const n = icons.length;
  const data = icons.map(i => ({ id: i.id, title: i.title, keys: i.variants.map(v => v.key), names: Object.fromEntries(i.variants.map(v => [v.key, v.name])) }));
  const json = JSON.stringify(data).replace(/</g, "\\u003c").replace(/[\u2028\u2029]/g, c => "\\u" + c.charCodeAt(0).toString(16));
  return `<title>Icon Lab</title>
<meta name="claude:viewport-fit-sides" content="cover">
<style>${css}</style>
<main class="il">
<header class="il-top">
<p class="il-eyebrow">MEjority · Icon Lab · Runde ${esc(ROUND)}</p>
<h1>Icons auswählen</h1>
<p class="il-lede">Pro Icon links die Referenz, daneben unsere Varianten. Tippe eine Variante an, um sie freizugeben, oder wähle „Keine davon“. Eine Entscheidung lässt sich jederzeit ändern. Gleiche Buchstaben bedeuten über alle Icons hinweg dieselbe Stilfamilie.</p>
${n ? `<ol class="il-index" aria-label="Alle Icons">${icons.map(i => `<li><a href="#il-${i.id}" data-for="${i.id}" data-state="open"><i aria-hidden="true"></i>${esc(i.title)}</a></li>`).join("")}</ol>` : ""}
</header>
<div class="il-status"><p class="il-save" id="il-save" aria-live="polite">Lädt …</p><button type="button" class="il-btn quiet small" id="il-copy" hidden>Meine Entscheidungen kopieren</button></div>
<div class="il-bar" id="il-bar">
<div class="il-bar-row"><p class="il-count" aria-live="polite"><b id="il-done">0</b> von ${n} entschieden · <span id="il-open">${n} offen</span></p><button type="button" class="il-btn small" id="il-next" aria-label="Zum nächsten offenen Icon"${n ? "" : " disabled"}>Nächstes ↓</button></div>
<div class="il-bar-row"><p class="il-tally" id="il-tally"></p><p class="il-mini" id="il-mini"></p></div>
</div>
${n ? icons.map(section).join("\n") : `<p class="il-empty">Noch keine Icons da.</p>`}
<footer class="il-end">
<p>Alle Entscheidungen als Text, zum Einfügen in einen Chat:</p>
<button type="button" class="il-btn quiet" id="il-copy-end">Meine Entscheidungen kopieren</button>
<label class="il-sr" for="il-copybox">Entscheidungen als Text</label>
<textarea class="il-copybox" id="il-copybox" readonly hidden></textarea>
</footer>
</main>
<script>
(() => {
const ROUND = ${JSON.stringify(ROUND)};
const ICONS = ${json};
(${client.toString()})();
})();
</script>
`;
}

/* ---------- run ---------- */
const icons = await loadIcons();
const html = page(icons);
if(html.length > PAGE_MAX) warn(`Seite ist ${(html.length / 1048576).toFixed(1)} MB, das Limit ist 16 MB`);
writeFileSync(OUT, html);
console.log(`wrote  ${OUT}  ${(html.length / 1024).toFixed(1)} KB  Runde ${ROUND}  ${icons.length} Icons: ${icons.map(i => `${i.id}(${i.variants.map(v => v.key).join("")})`).join(", ") || "keine"}`);
