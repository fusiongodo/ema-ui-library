SCREENS.push({ id:"trials/stop", area:"Insights", status:"idea", title:"Trial · stop early",
  sheet:"half",
  why:"Stopping is always allowed (a side effect, a bad crash). The sheet says what it costs: in week 3 there are fewer than 4 complete weeks, so there is no result. The order stays hidden unless you ask for it.",
  concept:[
    "<b>Keep going is the calm default</b> (the primary button); stopping is the quiet second.",
    "<b>Fewer than 4 complete weeks = no result:</b> two pairs are the least that can say anything at all. From week 4 on, stopping gives a result marked 'hint'.",
    "<b>The order on request only</b> (insights/home-stopped → trials/order): seeing it ends the blind for good, so a later trial of the same thing should start fresh.",
  ],
  w:[
    {t:"shead", left:"", l:"Stop the trial", right:"×", goRight:"close"},
    {t:"big", l:"Stop now?", n:"Stopping ends the trial."},
    {t:"note", l:"You have 3 complete weeks. A result needs at least 4, so there will be none. Which weeks were Magnesium stays hidden, unless you ask."},
    {t:"btn", l:"Keep going", go:"close"},
    {t:"btn", l:"Stop the trial", light:true, go:"insights/home-stopped"},
  ]});
