SCREENS.push({ id:"trials/stop", area:"Insights", status:"idea", title:"Trial · stop early",
  sheet:"half",
  why:"Stopping is always allowed (a side effect, a bad crash). The sheet says what it costs: on day 19 too few blocks are complete for any result beyond chance, so there is none. What was taken on which day stays hidden unless you ask for it.",
  concept:[
    "<b>Keep going is the calm default</b> (the primary button); stopping is the quiet second.",
    "<b>Said by days, not by blocks:</b> naming the complete blocks would give away where they end. The sheet only says that after 19 days nothing can go beyond chance; later on, a stopped trial gets the result its complete blocks allow: 'likely' at most with 6 complete blocks, 3 of each kind (1 in 20), 'hint' with fewer. (On day 19 one block is complete, days 6–12, plus 3 days of the block split between start and end.)",
    "<b>The days on request only</b> (insights/home-stopped → trials/order): seeing them ends the blind for good, so a later trial of the same thing should start fresh.",
  ],
  w:[
    {t:"shead", left:"", l:"Stop the trial", right:"×", goRight:"close"},
    {t:"big", l:"Stop now?", n:"Stopping ends the trial."},
    {t:"note", l:"After 19 of 63 days, too few blocks are complete for a result beyond chance, so there will be none. Which days were Magnesium stays hidden, unless you ask."},
    {t:"btn", l:"Keep going", go:"close"},
    {t:"btn", l:"Stop the trial", light:true, go:"insights/home-stopped"},
  ]});
