SCREENS.push({ id:"trials/measure", area:"Insights", status:"idea", title:"Trial · 2 What to measure",
  sheet:true,
  why:"One score decides, chosen before the start. The others are still recorded from the usual check-ins and shown as secondary on the result.",
  concept:[
    "<b>One primary outcome:</b> picking the best-looking score afterwards would make almost any trial 'work'. Fixing it now is what makes the result honest.",
    "<b>No new logging:</b> the scores come from the check-ins you already do.",
  ],
  w:[
    {t:"shead", left:"‹", l:"Set up a trial", n:"2 of 4", right:"×", goLeft:"back", goRight:"close"},
    {t:"big", l:"What should it change?", n:"Pick one score before you start."},
    {t:"pills", items:["Fatigue","Pain","Brain fog","Sleep","Mood"], on:["Fatigue"]},
    {t:"note", l:"Only one score decides. That keeps the result honest: no picking the best one afterwards. The others are still recorded and shown as secondary."},
    {t:"spacer"},
    {t:"btn", l:"Continue", go:"trials/length"},
  ]});
