// Builds svg/<id>.svg, sheet.html and sheet.png from glyphs.mjs.
// Run: node icon-lab/glyphs/build-glyphs.mjs
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { GLYPHS, TOKENS as T } from './glyphs.mjs';

const here = dirname(fileURLToPath(import.meta.url));
mkdirSync(join(here, 'svg'), { recursive: true });

for (const g of GLYPHS) writeFileSync(join(here, 'svg', `${g.id}.svg`), g.svg + '\n');

const sized = (g, px, extra = '') =>
  g.svg.replace('<svg ', `<svg width="${px}" height="${px}" ${extra}`);

const byId = Object.fromEntries(GLYPHS.map((g) => [g.id, g]));
const tabs = GLYPHS.slice(0, 4);

// ---------- 1 Reference vs ours ----------
const refRows = GLYPHS.map((g) => `
  <div class="cmp">
    <div class="num">#${g.n} ${g.id}</div>
    <div class="pair">
      <img class="ref" src="../refs/${g.ref}" alt="reference ${g.id}">
      <div class="ours white">${sized(g, 96)}</div>
      <div class="ours" style="background:${T[g.area]}">${sized(g, 96)}</div>
      <div class="ours dark">${sized(g, 96)}</div>
    </div>
  </div>`).join('');

// ---------- 2 Size steps ----------
const stepRows = GLYPHS.map((g) => `
  <div class="steps">
    <div class="num">#${g.n}</div>
    ${[60, 26, 20, 16].map((s) => `<div class="step"><div class="box" style="background:${T[g.area]}">${sized(g, s)}</div><span>${s}</span></div>`).join('')}
    ${[60, 26, 20, 16].map((s) => `<div class="step"><div class="box">${sized(g, s)}</div><span>${s}</span></div>`).join('')}
  </div>`).join('');
const lineUp = GLYPHS.map((g) => sized(g, 26)).join('');
const lineUpBig = GLYPHS.map((g) => sized(g, 60)).join('');

// ---------- 3A Tab bar ----------
const tabBar = (active) => `
  <div class="tabbar">
    ${tabs.map((g) => {
      const on = g.id === active;
      return `<div class="tab${on ? ' on' : ''}">
        <div class="pillbg" style="${on ? `background:${T[g.area]}` : ''}">${sized(g, 26)}</div>
        <div class="lbl">${g.label}</div>
      </div>`;
    }).join('')}
  </div>`;

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<title>Soft-solid glyphs</title>
<style>
  :root { --ink: ${T.ink}; }
  * { box-sizing: border-box; }
  body { margin: 0; padding: 32px 40px; width: 1240px; background: #FAFAFB; color: var(--ink);
         font-family: -apple-system, system-ui, sans-serif; }
  h1 { font-size: 22px; margin: 0 0 4px; }
  h2 { font-size: 16px; margin: 28px 0 12px; border-top: 1px solid ${T.hairline}; padding-top: 16px; }
  p.note { margin: 0 0 8px; font-size: 12px; opacity: .7; }
  .grid1 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px 32px; }
  .cmp .num, .steps .num { font-size: 11px; font-weight: 600; opacity: .7; }
  .cmp .num { margin-bottom: 4px; }
  .pair { display: flex; gap: 10px; align-items: center; }
  .ref { height: 96px; width: auto; border-radius: 8px; background: #fff; }
  .ours { width: 96px; height: 96px; border-radius: 8px; color: var(--ink); }
  .ours.white { background: #fff; outline: 1px solid ${T.hairline}; }
  .ours.dark { background: var(--ink); color: #fff; }
  .ours svg { display: block; }
  .steps { display: flex; align-items: flex-end; gap: 14px; margin-bottom: 10px; }
  .steps .num { width: 24px; align-self: center; }
  .step { display: flex; flex-direction: column; align-items: center; gap: 3px; }
  .step span { font-size: 10px; opacity: .55; }
  .box { padding: 6px; border-radius: 8px; background: #fff; outline: 1px solid ${T.hairline}; line-height: 0; }
  .box svg { display: block; }
  .lineup { display: flex; gap: 22px; align-items: center; padding: 14px 18px; background: #fff;
            border-radius: 10px; outline: 1px solid ${T.hairline}; width: fit-content; margin-bottom: 10px; }
  .lineup svg { display: block; outline: 1px dashed rgba(0,0,0,.08); }
  .pres { display: flex; gap: 40px; align-items: flex-start; }
  .tabbar { width: 390px; background: ${T.tabBar}; border-top: 1px solid ${T.hairline};
            display: flex; justify-content: space-around; padding: 8px 6px 10px; margin-bottom: 10px; }
  .tab { display: flex; flex-direction: column; align-items: center; gap: 3px; opacity: .55; width: 80px; }
  .tab.on { opacity: 1; }
  .pillbg { width: 52px; height: 32px; border-radius: 16px; display: flex; align-items: center; justify-content: center; }
  .pillbg svg { display: block; }
  .lbl { font: 600 11px -apple-system, system-ui, sans-serif; color: var(--ink); }
  .chip { background: ${T.card}; border-radius: 18px; padding: 14px; display: flex; align-items: center; width: 320px; }
  .chip .sq { width: 48px; height: 48px; border-radius: 13px; background: ${T.insights}; display: flex; align-items: center; justify-content: center; }
  .chip .sq svg { display: block; }
  .chip .txt { margin-left: 14px; font: 600 17px system-ui, -apple-system, sans-serif; color: var(--ink); }
  .evalwrap { background: ${T.card}; border-radius: 18px; padding: 24px; width: fit-content; }
  .evalbtn { width: 64px; height: 64px; border-radius: 50%; background: ${T.insights}; display: flex; align-items: center; justify-content: center; }
  .evalbtn svg { display: block; }
  .cap { font-size: 11px; opacity: .6; margin: 0 0 6px; font-weight: 600; }
</style></head>
<body style="color:${T.ink}">
  <h1>Soft-solid glyphs · #1–#4 and Evaluation</h1>
  <p class="note">48 grid, stroke 4.5 everywhere, gap 2.4, currentColor. Colour behind the glyph shows the cut-outs are transparent.</p>

  <h2>1 · Reference vs ours (96 px)</h2>
  <div class="grid1">${refRows}</div>

  <h2>2 · Size steps (60 · 26 · 20 · 16 px, on area colour and on white)</h2>
  ${stepRows}
  <p class="cap">All five at 26 px</p>
  <div class="lineup">${lineUp}</div>
  <p class="cap">All five at 60 px</p>
  <div class="lineup">${lineUpBig}</div>

  <h2>3 · Presentations</h2>
  <div class="pres">
    <div>
      <p class="cap">A · Tab bar</p>
      ${tabs.map((g) => tabBar(g.id)).join('')}
    </div>
    <div>
      <p class="cap">B · View all trends</p>
      <div class="chip"><div class="sq">${sized(byId['tab-insights'], 24)}</div><div class="txt">View all trends</div></div>
      <p class="cap" style="margin-top:24px">C · Evaluation button</p>
      <div class="evalwrap"><div class="evalbtn">${sized(byId['evaluation'], 28)}</div></div>
    </div>
  </div>
</body></html>
`;
writeFileSync(join(here, 'sheet.html'), html);

// ---------- sheet.png via headless Chrome ----------
const chrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
if (existsSync(chrome)) {
  try {
    execFileSync(chrome, [
      '--headless', '--disable-gpu', '--hide-scrollbars',
      '--force-device-scale-factor=2', '--window-size=1320,1700',
      `--screenshot=${join(here, 'sheet.png')}`,
      'file://' + join(here, 'sheet.html'),
    ], { stdio: 'ignore', timeout: 60000 });
  } catch (e) { console.warn('Chrome screenshot failed:', e.message); }
}
console.log('Wrote', GLYPHS.length, 'SVGs, sheet.html, sheet.png');
