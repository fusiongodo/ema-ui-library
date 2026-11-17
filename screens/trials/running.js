/* Week 3 of 8, Sunday 29 Nov, evening. Capsules: week 1 all 7, week 2 missed Thu, week 3 missed Sat → 19 of 21. */
SCREENS.push({ id:"trials/running", area:"Insights", status:"idea", title:"Trial · running (week 3 of 8)",
  tabs:"idea", tab:"Insights",
  why:"The trial while it runs, here on the Sunday evening of week 3. Only what is safe to see: how far along, which capsules were taken. A/B and every comparison are locked, so there is nothing to watch and nothing to sway how you log.",
  concept:[
    "<b>The one tinted card</b> (PRINCIPLES 8) is the end-of-week question: it is the only thing the trial wants from you today.",
    "<b>Progress by weeks:</b> week and pair, the day the result opens.",
    "<b>Capsules, not effects:</b> the study capsule is a protocol item like any other; missed ones are logged, not hidden, and reported with the result. No chart compares weeks.",
    "<b>Locked:</b> one calm line, no countdown drama.",
    "<b>Stop the trial</b> is quiet, at the end (trials/stop).",
  ],
  w:[
    {t:"shead", left:"‹", l:"", right:"", goLeft:"back"},
    {t:"big", l:"Magnesium trial", n:"Fatigue · 8 weeks · helper Sam"},
    {t:"tile", tone:"lilac", cta:true, l:"Week 3 is over", n:"One quick question: A or B?", go:"trials/guess"},
    {t:"tile", tone:"white", l:"Week 3 of 8", r:"Pair 2 of 4", n:"Result on Mon 4 Jan", bar:37.5},
    {t:"sec", l:"Capsules", r:"19 of 21"},
    {t:"weekgrid", rows:[["Week 1","●●●●●●●"],["Week 2","●●●○●●●"],["Week 3","●●●●●○●"]]},
    {t:"tile", tone:"white", l:"Locked until the end", n:"Which weeks are Magnesium, and every comparison, stay hidden until 4 Jan. Just log as usual."},
    {t:"note", l:"Stop the trial", danger:true, go:"trials/stop"},
  ]});
