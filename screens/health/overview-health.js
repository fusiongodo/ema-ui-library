/* Check-ins with Apple Health connected: checkins/overview-next as it is, plus the group "From Apple Health" under the scale
   note. Series 7 Oct … today 3 Nov (index 0 = 7 Oct). Steps: HEALTH_STEPS (shared.js). The watch was not worn on 15 and
   27 Oct (index 8, 20): no data for every measure it records that day; sleep also none last night.
   Resting heart rate and HRV: slightly higher / lower on the two days after 9, 18, 24, 30 Oct (index 3–4, 12–13, 18–19, 24–25). */
SCREENS.push({ id:"checkins/overview-health", area:"Check-ins", status:"idea", title:"Check-ins · with Apple Health",
  tabs:"idea", tab:"Check-ins", sub:"2 of 5 check-ins today · Apple Health", of:"checkins/overview-next", tabto:HEALTH_TABTO,
  why:"The measures from Apple Health live where the own scores are, as a quiet group under them, no new tab. Each is shown against your usual, never against a goal.",
  concept:[
    "<b>A quiet group under the own scores,</b> no new tab.",
    "<b>Three states side by side:</b> a deviation (marked), 'as usual' (muted), 'no data' (the watch was not worn; never zero).",
    "<b>No 'good ━ bad' scale here:</b> for this illness more steps is not better.",
    "<b>Placeholders:</b> only Steps has a screen (health/steps); Sleep, Resting heart rate and Heart rate variability have none yet.",
  ],
  w:[
    {t:"head", l:"Check-ins", r:"⚙︎", go:"checkins/config"},
    {t:"tile", tone:"white", l:"Next: 14:20", act:"Check in now", go:"checkins/entry"},
    {t:"sec", l:"Trends"},
    {t:"grid2", items:[
      {t:"trend", l:"Fatigue / energy"},{t:"trend", l:"Overall wellbeing"},
      {t:"trend", l:"Pain"},{t:"trend", l:"Thirst"}]},
    {t:"note", l:"good ━━━━ bad"},
    {t:"sec", l:"From Apple Health", r:"against your usual"},
    {t:"grid2", items:[
      {t:"usual", l:"Steps", v:"3,420", sub:"today so far", word:"higher than your usual", mark:true, band:[1800,2800], go:"health/steps", series:HEALTH_STEPS},
      {t:"usual", l:"Sleep", v:null, sub:"last night", word:"no data", band:[410,460],
        series:[436,421,398,404,447,452,428,415,null,441,458,432,397,388,426,449,437,402,419,455,434,412,446,393,410,438,429,null]},
      {t:"usual", l:"Resting heart rate", v:"61", sub:"bpm", word:"as usual", band:[58,63],
        series:[60,61,60,64,65,61,60,59,null,60,62,61,65,64,60,59,61,62,66,64,null,61,59,60,65,63,61,61]},
      {t:"usual", l:"Heart rate variability", v:"41", sub:"ms", word:"as usual", band:[38,46],
        series:[43,42,44,36,34,41,44,45,null,42,43,42,35,37,44,46,42,41,33,36,null,43,45,42,36,38,44,41]}]},
    {t:"note", l:"Your usual is the middle half of your last four weeks. It is not a goal."},
    {t:"list", rows:[["Benchmarks · 1 per day","›"]], go:"checkins/games"},
  ]});
