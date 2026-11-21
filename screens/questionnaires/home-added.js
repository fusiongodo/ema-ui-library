/* Questionnaires page after 'Later': added, no value yet (a later state of checkins/q-home). */
SCREENS.push({ id:"checkins/q-home-added", area:"Check-ins", status:"idea", title:"Questionnaires · added",
  tabs:"idea", tab:"Check-ins", of:"checkins/q-home",
  why:"Added without filling in: the one tinted tile says it is due and opens the first question.",
  w:[
    {t:"shead", left:"‹", l:"Questionnaires", right:"", goLeft:"back"},
    {t:"sec", l:"Yours", act:"+ Add", go:"checkins/q-area"},
    {t:"tile", tone:"lilac", l:"Fatigue questionnaire due", n:"4 questions · about 1 minute", cta:true, go:"checkins/q-1"},
  ]});
