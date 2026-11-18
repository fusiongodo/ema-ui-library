/* "See what Sam will see" (trials/helper): Sam's three pages as a preview for Alex, drawn from the helper's own screens
   (trials/helper-welcome, -plan, -done) so the two never drift apart. Full sheets in the neutral world over the setup;
   the head says "Preview" and × returns to the helper step (trials/helper names itself in `of`, so the link goes back
   to where the step stands instead of stacking a copy). The fill plan is an example: the real one is only ever on Sam's side. */
const TRIAL_PLAN_EXAMPLE = [[1,6,"a"],[7,14,"b"],[15,21,"a"],[22,27,"b"],[28,35,"a"],[36,42,"b"],[43,49,"a"],[50,56,"b"]];
function trialPeek(src, id, next, more){
  const s = byId(src), m = more || {};
  const w = s.w.map(x => x.t === "shead" ? {t:"shead", left:"‹", goLeft:"back", l:"What Sam sees", n:"Preview", right:"×", goRight:"trials/helper"}
    : x.t === "fill" ? {...x, ranges:TRIAL_PLAN_EXAMPLE, done:0}
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
