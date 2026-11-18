/* The drawn plan (TRIAL_PLAN, trials/intro) as runs of numbered capsules. Drawn with the first two runs ticked off. */
SCREENS.push({ id:"trials/helper-plan", area:"Insights", status:"idea", title:"Helper · 2 Fill plan",
  world:"neutral",
  why:"56 numbered capsules, one per day, shown as runs that are easy to prepare: '1–3 Placebo', '4–11 Magnesium 300 mg' … Tick a run off when it is done; the totals below (28 / 28) are a last check.",
  concept:[
    "<b>Number = day:</b> Alex takes number 1 on day 1, and so on; the number is the only thing written on a capsule (or on the bag or box that holds it).",
    "<b>Runs, not 56 rows:</b> the app drew where each block begins and how long it is (around one week, never the same); Sam prepares one run at a time.",
    "<b>Check-off:</b> tap a run when it is done (Play: visual only). Two are already done.",
    "<b>The app drew the plan,</b> not Sam: people randomise badly.",
  ],
  w:[
    {t:"shead", left:"‹", l:"Fill plan", n:"for Alex · Magnesium", right:"", goLeft:"back"},
    {t:"fill", ranges:TRIAL_PLAN, a:"Magnesium 300 mg", b:"Placebo", unit:"capsules", done:2},
    {t:"note", l:"Placebo: a capsule that looks, weighs and tastes like the real one. Write only the number on each."},
    {t:"btn", l:"All 56 ready", go:"trials/helper-done"},
  ]});
