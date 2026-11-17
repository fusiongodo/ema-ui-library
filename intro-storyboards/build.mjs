/* Builds intro-storyboards/index.html from the concept modules in intro-storyboards/concepts/.

   node intro-storyboards/build.mjs                  writes index.html
   node intro-storyboards/build.mjs --shots          also renders PNGs into ../.shots/ (story-<id>-1…5.png, story-<id>-all.png)
   node intro-storyboards/build.mjs --shots=hands    PNGs only for the named concepts (comma separated)

   A concept is one file concepts/<id>.mjs:

     export default {
       id: "hands",                 // lowercase letters, digits, hyphens; also the prefix of every id inside its SVGs
       order: 1,                    // optional; position on the page (missing = after the numbered ones, then by id)
       title: "Hands",
       idea: "One sentence about the idea.",
       duration: "ca. 6,5 s",
       frames: [                    // exactly five
         { t: "0,4 s", caption: "One sentence.", svg: "<svg viewBox=\"0 0 390 844\" …>…</svg>" },
         …
       ],
     };

   The SVG is a complete string without external references. Files whose name starts with "_" or "." are ignored.
   A module that fails to load or to validate is skipped with a warning; the build goes on.
   The page is an embeddable fragment (<title>, <style>, content), no doctype/html/head/body. */
import { readdirSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";
import { createRequire } from "node:module";
import { homedir } from "node:os";

const HERE = dirname(fileURLToPath(import.meta.url));
const CONCEPTS_DIR = join(HERE, "concepts");
const SHOTS_DIR = join(HERE, "..", ".shots");
const FRAMES = 5, VIEWBOX = "0 0 390 844";
const FONT_LINK = '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&amp;display=swap">';

const warn = msg => console.warn("  ! " + msg);
const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/* ---------- load + validate ---------- */
/* returns a list of reasons why the module cannot be used (empty = fine) */
function problems(c){
  const bad = [];
  if(!c || typeof c !== "object") return ["kein default-Export mit einem Objekt"];
  if(typeof c.id !== "string" || !/^[a-z][a-z0-9-]*$/.test(c.id)) bad.push("id fehlt oder enthält andere Zeichen als a–z, 0–9, -");
  for(const k of ["title", "idea"]) if(typeof c[k] !== "string" || !c[k].trim()) bad.push(`${k} fehlt`);
  if(c.duration != null && typeof c.duration !== "string" && typeof c.duration !== "number") bad.push("duration ist weder Text noch Zahl");
  if(c.order != null && !Number.isFinite(c.order)) bad.push("order ist keine Zahl");
  if(!Array.isArray(c.frames) || c.frames.length !== FRAMES){ bad.push(`frames braucht genau ${FRAMES} Einträge`); return bad; }
  c.frames.forEach((fr, k) => {
    const n = `Bild ${k + 1}`;
    if(!fr || typeof fr !== "object"){ bad.push(`${n}: kein Objekt`); return; }
    if(typeof fr.t !== "string" || !fr.t.trim()) bad.push(`${n}: t fehlt`);
    if(typeof fr.caption !== "string" || !fr.caption.trim()) bad.push(`${n}: caption fehlt`);
    const s = typeof fr.svg === "string" ? fr.svg.trim() : "";
    if(!/^<svg[\s>]/.test(s) || !/<\/svg>$/.test(s)){ bad.push(`${n}: svg ist kein vollständiger <svg>…</svg>-String`); return; }
    if(/<script[\s>]/i.test(s) || /\son[a-z]+\s*=/i.test(s)) bad.push(`${n}: Skript oder Event-Attribut im SVG`);
    if(/(?:href|src)\s*=\s*["'](?!#|data:)/i.test(s) || /url\(\s*["']?(?!#|data:)/i.test(s) || /@import/i.test(s)) bad.push(`${n}: externe Referenz im SVG`);
  });
  return bad;
}
/* things that still build but deserve a look */
function hints(c){
  const out = [], box = [], loose = new Set();
  c.frames.forEach((fr, k) => {
    if(!fr.svg.includes(`viewBox="${VIEWBOX}"`)) box.push(k + 1);
    for(const m of fr.svg.matchAll(/\sid="([^"]+)"/g)) if(!m[1].startsWith(c.id + "-")) loose.add(m[1]);
  });
  if(box.length) out.push(`viewBox ist nicht "${VIEWBOX}" in Bild ${box.join(", ")}`);
  if(loose.size) out.push(`ids ohne Präfix "${c.id}-": ${[...loose].slice(0, 5).join(", ")}${loose.size > 5 ? " …" : ""}`);
  return out;
}

async function loadConcepts(){
  const files = existsSync(CONCEPTS_DIR) ? readdirSync(CONCEPTS_DIR).filter(n => n.endsWith(".mjs") && !/^[_.]/.test(n)).sort() : [];
  const list = [], seen = new Map();
  for(const file of files){
    let c;
    try { c = (await import(pathToFileURL(join(CONCEPTS_DIR, file)).href)).default; }
    catch(e){ warn(`${file} übersprungen: lädt nicht (${String(e && e.message || e).split("\n")[0]})`); continue; }
    let bad;
    try { bad = problems(c); } catch(e){ bad = [String(e && e.message || e)]; }
    if(bad.length){ warn(`${file} übersprungen: ${bad.join("; ")}`); continue; }
    if(seen.has(c.id)){ warn(`${file} übersprungen: id "${c.id}" gibt es schon in ${seen.get(c.id)}`); continue; }
    seen.set(c.id, file);
    hints(c).forEach(h => warn(`${file}: ${h}`));
    list.push({ ...c, file, frames: c.frames.map(fr => ({ t: fr.t.trim(), caption: fr.caption.trim(), svg: fr.svg.trim() })) });
  }
  /* the same id in two SVGs on one page makes gradients and clip paths pick the wrong definition */
  const owner = new Map(), twice = new Map();
  for(const c of list) c.frames.forEach((fr, k) => { for(const m of fr.svg.matchAll(/\sid="([^"]+)"/g)){
    const here = `${c.id} Bild ${k + 1}`;
    if(!owner.has(m[1])) owner.set(m[1], here);
    else if(owner.get(m[1]) !== here && !twice.has(m[1])) twice.set(m[1], `${owner.get(m[1])} und ${here}`);
  } });
  for(const [id, where] of twice) warn(`id "${id}" kommt mehrfach vor (zuerst ${where})`);
  const ord = c => Number.isFinite(c.order) ? c.order : Infinity;
  return list.sort((a, b) => ord(a) - ord(b) || a.id.localeCompare(b.id));
}

/* ---------- page ---------- */
const css = `
/* Layout: one section per concept, each a strip of five portrait stills; swipeable strip on phones, five columns on desktop */
:root{
  --bg:#f4f1ec; --surface:#fbf9f5; --ink:#2a2723; --muted:#655f55; --line:#dcd5c9; --accent:#2f6b6a; --chip:#e1efed; --shadow:rgba(60,45,25,.18);
  --rounded:ui-rounded,"SF Pro Rounded","Fredoka","Nunito",system-ui,sans-serif;
  --gl:max(16px,env(safe-area-inset-left,0px)); --gr:max(16px,env(safe-area-inset-right,0px));
}
@media (prefers-color-scheme: dark){:root:not([data-theme="light"]){
  --bg:#151a1a; --surface:#1e2525; --ink:#eef2f0; --muted:#a3aeab; --line:#2f3a39; --accent:#9bd1cb; --chip:#21393a; --shadow:rgba(0,0,0,.5); color-scheme:dark}}
:root[data-theme="dark"]{
  --bg:#151a1a; --surface:#1e2525; --ink:#eef2f0; --muted:#a3aeab; --line:#2f3a39; --accent:#9bd1cb; --chip:#21393a; --shadow:rgba(0,0,0,.5); color-scheme:dark}
body{margin:0;background:var(--bg);color:var(--ink);font-family:var(--rounded);font-size:16px;line-height:1.45;-webkit-font-smoothing:antialiased}
.sb{box-sizing:border-box;max-width:1260px;margin:0 auto;padding-block:36px 64px;padding-left:var(--gl);padding-right:var(--gr);
  display:flex;flex-direction:column;gap:56px}
.sb *{box-sizing:border-box}
.sb-top{display:flex;flex-direction:column;gap:10px;max-width:64ch}
.sb-eyebrow{margin:0;font-size:13px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--accent)}
.sb h1{margin:0;font-size:clamp(26px,4.2vw,38px);line-height:1.12;font-weight:700;letter-spacing:-.01em;text-wrap:balance}
.sb-lede{margin:0;color:var(--muted);font-size:17px}
.sb-nav{display:flex;flex-wrap:wrap;gap:8px;margin:6px 0 0;padding:0;list-style:none}
.sb-nav a{display:block;padding:6px 12px;border-radius:999px;background:var(--chip);color:var(--accent);font-size:14px;font-weight:600;text-decoration:none}
.sb-nav a:hover{box-shadow:inset 0 0 0 1.5px var(--accent)}
.sb-nav a:focus-visible,.sb-strip:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.sb-concept{display:flex;flex-direction:column;gap:20px;min-width:0;scroll-margin-top:12px}
.sb-head{display:flex;flex-direction:column;gap:6px;padding-top:20px;border-top:1px solid var(--line)}
.sb-kicker{margin:0;display:flex;flex-wrap:wrap;gap:6px 14px;align-items:baseline;font-size:13px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--muted)}
.sb-kicker b{color:var(--accent);font-weight:700}
.sb h2{margin:0;font-size:clamp(22px,3vw,28px);line-height:1.15;font-weight:700;text-wrap:balance}
.sb-idea{margin:0;max-width:64ch;color:var(--ink);font-size:17px}
.sb-strip{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:22px}
.sb-shot{display:flex;flex-direction:column;gap:12px;min-width:0}
.sb-frame{aspect-ratio:390/844;max-width:100%;border-radius:9.5%/4.4%;overflow:hidden;background:var(--surface);
  box-shadow:0 0 0 1px var(--line),0 14px 30px -14px var(--shadow)}
.sb-frame svg{display:block;width:100%;height:100%}
.sb-cap{margin:0;display:flex;flex-direction:column;gap:6px;align-items:flex-start;font-size:15px;color:var(--muted);overflow-wrap:anywhere}
.sb-t{font-weight:700;font-size:13px;color:var(--accent);background:var(--chip);border-radius:999px;padding:3px 10px;font-variant-numeric:tabular-nums}
.sb-note{margin:0;max-width:64ch;color:var(--muted);font-size:15px}
.sb-hint{display:none;margin:0;color:var(--muted);font-size:13px}
@media (max-width:860px){
  .sb{gap:44px;padding-block:24px 48px}
  .sb-strip{display:flex;gap:14px;overflow-x:auto;scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch;
    margin-left:calc(var(--gl) * -1);margin-right:calc(var(--gr) * -1);padding:2px var(--gr) 14px var(--gl);
    scroll-padding-left:var(--gl);scroll-padding-right:var(--gr)}
  .sb-shot{flex:0 0 min(74%,300px);scroll-snap-align:start}
  .sb-hint{display:block}
}
`;

const duration = d => typeof d === "number" ? `ca. ${String(d).replace(".", ",")} s` : d;
const section = (c, k) => `<section class="sb-concept" id="sb-${c.id}" aria-labelledby="sb-h-${c.id}">
<div class="sb-head">
<p class="sb-kicker"><b>Konzept ${k + 1}</b>${c.duration != null ? `<span>Dauer ${esc(duration(c.duration))}</span>` : ""}</p>
<h2 id="sb-h-${c.id}">${esc(c.title)}</h2>
<p class="sb-idea">${esc(c.idea)}</p>
<p class="sb-hint">Fünf Bilder, seitlich wischen.</p>
</div>
<ol class="sb-strip" tabindex="0" aria-label="${esc(c.title)}: fünf Standbilder">
${c.frames.map((fr, n) => `<li class="sb-shot"><div class="sb-frame" id="sb-frame-${c.id}-${n + 1}">${fr.svg}</div><p class="sb-cap"><span class="sb-t">${esc(fr.t)}</span><span>${esc(fr.caption)}</span></p></li>`).join("\n")}
</ol>
</section>`;

function page(concepts){
  const n = concepts.length;
  const count = n === 1 ? "Ein Konzept" : `${["Null", "Ein", "Zwei", "Drei", "Vier", "Fünf", "Sechs", "Sieben", "Acht", "Neun", "Zehn", "Elf", "Zwölf"][n] || n} Konzepte`;
  return `<title>MEjority Intro Storyboards</title>
<meta charset="utf-8">
<meta name="claude:viewport-fit-sides" content="cover">
${FONT_LINK}
<style>${css}</style>
<main class="sb">
<header class="sb-top">
<p class="sb-eyebrow">MEjority · App-Intro · Runde 2</p>
<h1>${count} für das Intro</h1>
<p class="sb-lede">Jede Idee in fünf Standbildern, zusammen vier bis acht Sekunden ruhige Bewegung. In dieser Runde gibt es keinen Himmel, keine Wolken und keine Sonne mehr. Alle Konzepte enden auf derselben, rein typografischen Wortmarke auf einer ruhigen Farbfläche, damit sich die Ideen vergleichen lassen und nicht die Logos.</p>
${n > 1 ? `<ul class="sb-nav" aria-label="Konzepte">${concepts.map(c => `<li><a href="#sb-${c.id}">${esc(c.title)}</a></li>`).join("")}</ul>` : ""}
</header>
${concepts.map(section).join("\n")}
<p class="sb-note">Nach dem fünften Bild blendet das Intro ruhig in die App über.</p>
</main>
`;
}

/* ---------- PNGs (optional) ---------- */
/* Playwright is not a dependency of this folder: take it from PLAYWRIGHT_PATH, from node_modules, or from the npx cache.
   WebKit comes first because it knows ui-rounded (the wordmark font on Apple devices); Chromium falls back to Fredoka. */
async function openBrowser(){
  const req = createRequire(import.meta.url), spots = [];
  if(process.env.PLAYWRIGHT_PATH) spots.push(process.env.PLAYWRIGHT_PATH);
  spots.push("playwright", "playwright-core");
  const npx = join(homedir(), ".npm", "_npx");
  if(existsSync(npx)) for(const d of readdirSync(npx)) for(const p of ["playwright", "playwright-core"]){
    const dir = join(npx, d, "node_modules", p); if(existsSync(dir)) spots.push(dir); }
  const tried = [];
  for(const spot of spots){
    let pw; try { pw = req(spot); } catch { continue; }
    for(const [name, opts] of [["webkit", {}], ["chromium", {}], ["chromium", { channel: "chrome" }]]){
      try { return { browser: await pw[name].launch(opts), name }; }
      catch(e){ tried.push(`${spot} ${name}${opts.channel ? "/" + opts.channel : ""}`); }
    }
  }
  throw new Error(tried.length ? `kein Browser startet (${tried.length} Versuche)` : "Playwright nicht gefunden (PLAYWRIGHT_PATH setzen oder npx playwright install webkit)");
}

async function shots(concepts, only){
  const todo = only ? concepts.filter(c => only.includes(c.id)) : concepts;
  if(only) only.filter(id => !concepts.some(c => c.id === id)).forEach(id => warn(`--shots: Konzept "${id}" gibt es nicht`));
  if(!todo.length) return;
  let browser, name;
  try { ({ browser, name } = await openBrowser()); }
  catch(e){ warn(`keine PNGs: ${e.message}`); return; }
  const head = `<!doctype html><meta charset="utf-8">${name === "webkit" ? "" : FONT_LINK}`;
  const ready = async p => { try { await p.evaluate(() => document.fonts.ready); } catch {} };
  mkdirSync(SHOTS_DIR, { recursive: true });
  try {
    const one = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
    const all = await browser.newPage({ viewport: { width: 5 * 390 + 6 * 20, height: 844 + 40 }, deviceScaleFactor: 1 });
    for(const c of todo){
      for(let k = 0; k < FRAMES; k++){
        await one.setContent(`${head}<style>html,body{margin:0}svg{display:block;width:390px;height:844px}</style>${c.frames[k].svg}`);
        await ready(one);
        await one.screenshot({ path: join(SHOTS_DIR, `story-${c.id}-${k + 1}.png`) });
      }
      await all.setContent(`${head}<style>html,body{margin:0;background:#f4f1ec}main{display:flex;gap:20px;padding:20px}`
        + `div{flex:none;width:390px;height:844px;border-radius:37px;overflow:hidden}svg{display:block;width:100%;height:100%}</style>`
        + `<main>${c.frames.map(fr => `<div>${fr.svg}</div>`).join("")}</main>`);
      await ready(all);
      await all.screenshot({ path: join(SHOTS_DIR, `story-${c.id}-all.png`) });
      console.log(`shots  ${c.id} (${name})`);
    }
  } finally { await browser.close(); }
}

/* ---------- run ---------- */
const shotArg = process.argv.slice(2).find(a => a === "--shots" || a.startsWith("--shots="));
const concepts = await loadConcepts();
const out = join(HERE, "index.html"), html = page(concepts);
writeFileSync(out, html);
console.log(`wrote  ${out}  ${(html.length / 1024).toFixed(1)} KB  ${concepts.length} Konzepte: ${concepts.map(c => c.id).join(", ") || "keine"}`);
if(shotArg) await shots(concepts, shotArg.includes("=") ? shotArg.split("=")[1].split(",").map(s => s.trim()).filter(Boolean) : null);
