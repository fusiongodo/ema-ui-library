/* Days 1–19 of the drawn plan (TRIAL_PLAN, trials/intro): Magnesium 1–3 (first part of the block split between start and
   end), washout 4–5 (placebo), placebo block 6–12, washout 13–14 (placebo), placebo block 15–21 cut at 19. */
SCREENS.push({ id:"trials/order", area:"Insights", status:"idea", title:"Trial · the days, on request",
  sheet:"half",
  why:"After stopping early, which days were real is shown only when asked for: the 19 days as one strip, no averages. 19 days are too few to compare, so nothing suggests a result.",
  concept:[
    "<b>The same strip as the result,</b> cut at day 19: real days filled, placebo days a ring, the washout days before each block faint. Now that the trial is over, the blocks may be seen.",
    "<b>No numbers next to the days:</b> putting scores beside them would invite exactly the reading the trial could not support.",
  ],
  w:[
    {t:"shead", left:"", l:"Magnesium trial", right:"×", goRight:"close"},
    {t:"big", l:"Your 19 days", n:"Stopped after day 19."},
    {t:"daystrip", plan:TRIAL_PLAN, upto:19, key:["Magnesium","Placebo","washout"]},
    {t:"note", l:"Too few days to compare. If you test Magnesium again, start a new trial: the app draws new blocks."},
  ]});
