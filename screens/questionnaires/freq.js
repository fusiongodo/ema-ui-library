/* Questionnaires: how often, for the chosen area (Fatigue). Stacked over checkins/q-area. */
SCREENS.push({ id:"checkins/q-freq", area:"Check-ins", status:"idea", title:"Questionnaires · how often",
  sheet:true,
  why:"One choice with a default (every month), then start now or just add it for later.",
  concept:[
    "<b>Open:</b> RAND-36 asks about the past 4 weeks; asked weekly the windows overlap. Recall window per frequency still to decide.",
    "<b>Open:</b> Sleep and Breathing have no questionnaire yet (app model: ISI and mMRC need permission).",
  ],
  w:[
    {t:"shead", left:"‹", l:"How often?", right:"", goLeft:"back"},
    {t:"big", l:"Fatigue"},
    {t:"note", l:"RAND-36 Vitality · 4 questions · about 1 minute"},
    {t:"pills", items:["Every week","Every month","Every 2 months"], on:["Every month"]},
    {t:"note", l:"Every month is the default."},
    {t:"btn", l:"Start now", go:"checkins/q-1"},
    {t:"btn", l:"Later", light:true, go:"checkins/q-home-added"},
  ]});
