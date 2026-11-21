/* Questionnaires: the result after the last question. Done returns to the Questionnaires page, now filled. */
SCREENS.push({ id:"checkins/q-done", area:"Check-ins", status:"idea", title:"Questionnaires · saved",
  sheet:true,
  why:"The score in one line, what it means, and when the next one is due.",
  w:[
    {t:"shead", left:"", l:"Saved", right:"×", goRight:"checkins/q-home-filled"},
    {t:"big", l:"Fatigue: 35 of 100"},
    {t:"note", l:"RAND-36 Vitality. Higher means more energy. Next time: in 4 weeks."},
    {t:"btn", l:"Done", go:"checkins/q-home-filled"},
  ]});
