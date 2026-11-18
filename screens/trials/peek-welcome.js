/* "See what Sam will see" (trials/helper): Sam's three pages as a preview for Alex, drawn from the helper's own screens
   (trials/helper-welcome, -plan, -done) so the two never drift apart. Full sheets in the neutral world over the setup;
   the head says "Preview" and × returns to the helper step (trials/helper names itself in `of`, so the link goes back
   to where the step stands instead of stacking a copy). The fill plan is an example: the real one is only ever on Sam's side. */
/* The example follows the same model as TRIAL_PLAN (7 blocks of 7 days, each with 2 washout days before it, 63 days, the
   sequence shifted so one block is split between start and end), drawn differently: 4 Magnesium and 3 placebo blocks,
   shifted by 5 days. Runs 1–5 P · 6–14 M · 15–23 P · 24–41 M · 42–50 P · 51–59 M · 60–63 P, 36 Magnesium and 27 placebo
   capsules. The welcome page's totals (trialMix) follow the example too. */
const TRIAL_PLAN_EXAMPLE = [[1,5,"b"],[6,7,"a","w"],[8,14,"a"],[15,16,"b","w"],[17,23,"b"],[24,25,"a","w"],[26,32,"a"],[33,34,"a","w"],
  [35,41,"a"],[42,43,"b","w"],[44,50,"b"],[51,52,"a","w"],[53,59,"a"],[60,61,"b","w"],[62,63,"b"]];
function trialPeek(src, id, next, more){
  const s = byId(src), m = more || {};
  const mix = c => typeof c === "string" ? c.replace(trialMix(TRIAL_PLAN), trialMix(TRIAL_PLAN_EXAMPLE)) : c;
  const w = s.w.map(x => x.t === "shead" ? {t:"shead", left:"‹", goLeft:"back", l:"What Sam sees", n:"Preview", right:"×", goRight:"trials/helper"}
    : x.t === "fill" ? {...x, ranges:TRIAL_PLAN_EXAMPLE, done:0}
    : x.t === "tl" && x.rows ? {...x, rows:x.rows.map(r=>r.map(mix))}
    : typeof x.go === "string" && /^trials\/helper-/.test(x.go) ? {...x, go:next} : x);
  return { id, area:s.area, status:"idea", title:"Trial · 4 Preview: " + s.title.replace(/^Helper · \d /, "").toLowerCase(),
    sheet:true, world:"neutral", why:m.why, concept:m.concept, w:[w[0], ...(m.top || []), ...w.slice(1), ...(m.end || [])] };
}
SCREENS.push(trialPeek("trials/helper-welcome", "trials/peek-welcome", "trials/peek-plan", {
  why:"Opened from 'See what Sam will see' on the helper step: the page Sam gets from the link, as a preview. × goes back to the setup at any point.",
  concept:[
    "<b>The helper's side, findable:</b> it used to live only in its own flow; now the person sees it at the moment they choose the helper.",
    "<b>Same content as Sam's page</b> (drawn from trials/helper-welcome), only the head differs: 'What Sam sees · Preview', ‹ back and × (back to the setup).",
  ]}));
