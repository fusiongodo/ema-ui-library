/* Step 2 of the trial setup. Neutral wording on purpose (a trial must not suggest a direction): no "improve", "change",
   "help" anywhere in this step. Demo: Fatigue, Pain, Brain fog tracked; Fatigue is the main outcome. */
SCREENS.push({ id:"trials/measure", area:"Insights", status:"idea", title:"Trial · 2 Scores to track",
  sheet:true,
  why:"Which check-in scores the trial looks at, chosen before the start. Several can be tracked; exactly one is the main outcome, fixed now, and it alone decides the result. The others are reported next to it.",
  concept:[
    "<b>From the check-ins:</b> the scores the person already logs, nothing new to record. '+ Add a score' opens the check-in configuration, where a new score is created for every check-in.",
    "<b>One main outcome, fixed before the start:</b> picking the best-looking score afterwards would make almost any trial look like a result. One score decides; the others are reported next to it and read as hints.",
    "<b>Neutral wording:</b> the step asks what to track, not what should happen. No word suggests an expected direction.",
    "<b>Two choices, two sections:</b> the scores to track (several), then the main outcome among them (one). Only tracked scores can be the main outcome.",
  ],
  w:[
    {t:"shead", left:"‹", l:"Set up a trial", n:"2 of 4", right:"×", goLeft:"back", goRight:"close"},
    {t:"big", l:"Which scores do you want to track?", n:"From the check-in scores you already log."},
    {t:"sec", l:"Check-in scores", r:"choose several"},
    {t:"pills", multi:true, items:["Fatigue","Pain","Brain fog","Sleep","Mood"], on:["Fatigue","Pain","Brain fog"]},
    {t:"note", l:"+ Add a score", go:"checkins/config"},
    {t:"sec", l:"Main outcome", r:"one"},
    {t:"pills", items:["Fatigue","Pain","Brain fog"], on:["Fatigue"]},
    {t:"note", l:"The main outcome is fixed before the start and decides the result. The other scores are reported next to it."},
    {t:"spacer"},
    {t:"btn", l:"Continue", go:"trials/length"},
  ]});
