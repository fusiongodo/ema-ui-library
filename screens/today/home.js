SCREENS.push({ id:"today/home", area:"Today", status:"idea", title:"Today · widget home",
  tabs:"idea", tab:"Today",
  why:"A calm start: greeting, then the one thing that wants you now ('Check-in now', the only tinted tile), two quiet status tiles that link into their tabs, how the scores moved this week (fixed 0–10 scale, so the curves compare), and a slot for the cognitive games. MOTS-C lives in the Protocols tile.",
  w:[
    {t:"head", l:"Good afternoon", greet:true, n:"Tuesday, 3 November", r:"🔔"},
    {t:"tile", tone:"lilac", cta:true, h:84, l:"Check-in now", n:"Fatigue · Wellbeing · Pain · Thirst · Brain\u00a0fog", go:"checkins/entry"},
    {t:"row", items:[
      {t:"tile", tone:"white", h:84, l:"Check-ins", n:"2 of 5\nnext 14:20", go:"checkins/overview-next"},
      {t:"tile", tone:"white", h:84, l:"Protocols", n:"As planned\nEvening next", go:"protocols/today-folds"}]},
    {t:"tile", tone:"white", l:"Scores · 7 days", spark:[
      ["Fatigue",   "6", [6,7,5,6,4,5,6]],
      ["Brain fog", "4", [4,5,5,3,4,4,4]],
      ["Pain",      "3", [3,3,2,4,3,3,3]],
      ["Wellbeing", "6", [5,4,6,5,7,6,6]]]},
    {t:"sec", l:"Play"},
    {t:"row", items:[
      {t:"tile", tone:"white", h:84, l:"Dual n-back", n:"3 min\nGame of the day", go:"checkins/games"},
      {t:"tile", tone:"white", h:84, l:"Reaction", n:"1 min", go:"checkins/games"}]},
  ]});
