/* Helper · 2: the three choices before any filling (form, placebo filling, where they go), each a row that opens a picker
   (trials/helper-pick-form, -pick-control, -pick-container), in the row style of trials/length. What is needed follows from
   the picks; demo: opaque capsules, rice flour, Alex's pill organizer. Counts from TRIAL_PLAN: 27 Magnesium, 36 placebo. */
SCREENS.push({ id:"trials/helper-setup", area:"Insights", status:"idea", title:"Helper · 2 Before you fill",
  world:"neutral",
  why:"Before any filling, Sam decides three things: how the two kinds are made to look alike, what the placebo is filled with, and whether they go into Alex's pill organizer week by week or into numbered bags all at once. The list below follows from those choices.",
  concept:[
    "<b>Choices, not a recipe:</b> the app does not prescribe a method. It states the rule (trials/helper-welcome) and lets the helper pick; what is needed follows from the pick.",
    "<b>The control substance is named:</b> the placebo filling is recorded, so the result can say what Magnesium was compared with.",
    "<b>The organizer as the label:</b> the place in the organizer says which day; nothing has to be written on a capsule.",
    "<b>Counts from the plan:</b> 27 Magnesium and 36 placebo capsules over 63 days; per week only seven are filled.",
  ],
  w:[
    {t:"shead", left:"‹", l:"Before you fill", n:"for Alex · Magnesium", right:"", goLeft:"back"},
    {t:"big", l:"How will you prepare them?", n:"Three choices. They decide what the plan asks of you."},
    {t:"list", rows:[["Form","Opaque capsules ›"],["Placebo filling","Rice flour ›"],["Where they go","Alex's pill organizer ›"]],
      go:["trials/helper-pick-form","trials/helper-pick-control","trials/helper-pick-container"], info:[null,"trials/term-placebo",null]},
    {t:"sec", l:"You'll need"},
    {t:"list", rows:[["Empty opaque capsules","63"],["Magnesium 300 mg, powder","for 27"],["Rice flour","for 36"],["Alex's pill organizer","7 days"]]},
    {t:"note", l:"Fill each week's seven before Monday. About 5 minutes a week."},
    {t:"btn", l:"Open week 1", go:"trials/helper-plan"},
  ]});
