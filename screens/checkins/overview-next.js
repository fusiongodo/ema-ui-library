SCREENS.push({ id:"checkins/overview-next", area:"Check-ins", status:"idea", title:"Check-ins · next + trends",
  tabs:"idea", tab:"Check-ins", sub:"2 of 5 check-ins today",
  why:"The current tab kept as is (trends unchanged), plus a calm 'next' tile with the one action. Configuration moves behind ⚙︎, benchmarks to one quiet row.",
  w:[
    {t:"head", l:"Check-ins", r:"⚙︎", go:"checkins/config"},
    {t:"tile", tone:"white", l:"Next: 14:20", act:"Check in now", go:"checkins/entry"},
    {t:"sec", l:"Trends"},
    {t:"grid2", items:[
      {t:"trend", l:"Fatigue / energy"},{t:"trend", l:"Overall wellbeing"},
      {t:"trend", l:"Pain"},{t:"trend", l:"Thirst"}]},
    {t:"note", l:"good ━━━━ bad"},
    {t:"list", rows:[["Benchmarks · 1 per day","›"]], go:"checkins/games"},
    {t:"tile", tone:"white", l:"Questionnaires", n:"Longer questions, now and then", r:"›", go:"checkins/q-home"},
  ]});
