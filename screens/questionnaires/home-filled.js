/* Questionnaires page after the first questionnaire is filled in (a later state of checkins/q-home). */
SCREENS.push({ id:"checkins/q-home-filled", area:"Check-ins", status:"idea", title:"Questionnaires · filled",
  tabs:"idea", tab:"Check-ins", of:"checkins/q-home",
  why:"Your questionnaires with the last value and when the next one is due; + Add picks another area.",
  w:[
    {t:"shead", left:"‹", l:"Questionnaires", right:"", goLeft:"back"},
    {t:"sec", l:"Yours", act:"+ Add", go:"checkins/q-area"},
    {t:"list", rows:[["Fatigue", "35", "", "Energy 35 of 100 · every month · next in a month"]]},
  ]});
