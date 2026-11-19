/* Check-ins with Apple Health connected: checkins/overview-next as it is, plus the group "From Apple Health" under the scale
   note. Series 7 Oct … today 3 Nov (index 0 = 7 Oct). Steps: HEALTH_STEPS (shared.js). One gap in the whole group: no steps
   on 27 Oct (index 20, the watch was not worn); sleep, resting heart rate and HRV have no gaps (sleep in minutes).
   Resting heart rate and HRV: slightly higher / lower on the two days after 9, 18, 24, 30 Oct (index 3–4, 12–13, 18–19, 24–25). */
SCREENS.push({ id:"checkins/overview-health", area:"Check-ins", status:"idea", title:"Check-ins · with Apple Health",
  tabs:"idea", tab:"Check-ins", sub:"2 of 5 check-ins today · Apple Health", of:"checkins/overview-next", tabto:HEALTH_TABTO,
  why:"The measures from Apple Health live where the own scores are, as a quiet group under them, no new tab. Each is shown against your usual, never against a goal.",
  concept:[
    "<b>A quiet group under the own scores,</b> no new tab.",
    "<b>Two states side by side:</b> a deviation (marked) and 'as usual' (muted); one gap in the Steps line where the watch was not worn (never zero). The tile can also say 'no data' (not drawn here).",
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
      {t:"usual", l:"Steps", v:"2,100", sub:"today so far", word:"higher than your usual", mark:true, band:[1100,1700], go:"health/steps", series:HEALTH_STEPS},
      {t:"usual", l:"Sleep", v:"7 h 10", sub:"last night", word:"as usual", band:[410,460],
        series:[436,421,398,404,447,452,428,415,433,441,458,432,397,388,426,449,437,402,419,455,434,412,446,393,410,438,429,430]},
      {t:"usual", l:"Resting heart rate", v:"61", sub:"bpm", word:"as usual", band:[58,63],
        series:[60,61,60,64,65,61,60,59,61,60,62,61,65,64,60,59,61,62,66,64,60,61,59,60,65,63,61,61]},
      {t:"usual", l:"Heart rate variability", v:"41", sub:"ms", word:"as usual", band:[38,46],
        series:[43,42,44,36,34,41,44,45,42,42,43,42,35,37,44,46,42,41,33,36,42,43,45,42,36,38,44,41]}]},
    {t:"note", l:"Your usual is the middle half of your last four weeks. It is not a goal."},
    {t:"list", rows:[["Benchmarks · 1 per day","›"]], go:"checkins/games"},
  ]});
