/* Questionnaires page after 'Later': added, no value yet (a later state of checkins/q-home). */
SCREENS.push({ id:"checkins/q-home-added", area:"Check-ins", status:"idea", title:"Questionnaires · added",
  tabs:"idea", tab:"Check-ins", of:"checkins/q-home",
  why:"Added without filling in: the row has no value yet and opens the first question.",
  w:[
    {t:"shead", left:"‹", l:"Questionnaires", right:"", goLeft:"back"},
    {t:"sec", l:"Yours", act:"+ Add", go:"checkins/q-area"},
    {t:"list", rows:[["Fatigue", "", "", "RAND-36 Vitality · every month · first one due today"]], go:"checkins/q-1"},
    {t:"note", l:"Values out of 100. Higher means more energy."},
  ]});
