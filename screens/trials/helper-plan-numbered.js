/* The numbered way (chosen in trials/helper-pick-container): the drawn plan (TRIAL_PLAN, trials/intro) as runs of numbered capsules. Drawn with the first two runs ticked off. */
SCREENS.push({ id:"trials/helper-plan-numbered", area:"Insights", status:"idea", title:"Helper · Fill plan (numbered)",
  world:"neutral",
  why:"63 numbered capsules, one per day, shown as runs that are easy to prepare: '1–3 Magnesium 300 mg', '4–21 Placebo' … (seven runs). Tick a run off when it is done; the totals below (27 Magnesium / 36 Placebo) are a last check.",
  concept:[
    "<b>Number = day:</b> Alex takes number 1 on day 1, and so on; the number is the only thing written on a capsule (or on the bag or box that holds it).",
    "<b>Runs, not 63 rows:</b> the app drew the order of the blocks and where the first begins; a run is everything of one kind in a row (a block with its washout days before it, or two such of one kind), because which days are compared means nothing to Sam. Runs: 1–3 M · 4–21 P · 22–30 M · 31–39 P · 40–48 M · 49–57 P · 58–63 M.",
    "<b>Totals as they fall:</b> 7 blocks of 9 capsules (2 washout + 7), 3 Magnesium and 4 placebo, so 27 Magnesium and 36 placebo.",
    "<b>Check-off:</b> tap a run when it is done (Play: visual only). Two are already done.",
    "<b>The app drew the plan,</b> not Sam: people randomise badly.",
  ],
  w:[
    {t:"shead", left:"‹", l:"Fill plan", n:"for Alex · Magnesium", right:"", goLeft:"back"},
    {t:"fill", ranges:TRIAL_PLAN, a:"Magnesium 300 mg", b:"Placebo", unit:"capsules", done:2},
    {t:"note", l:"Placebo: a capsule that looks, weighs and tastes like the real one. Write only the number on each."},
    {t:"btn", l:"All 63 ready", go:"trials/helper-check"},
  ]});
