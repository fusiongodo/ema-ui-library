/* Picker for "Questionnaires" on step 2 of the trial setup (trials/measure, 'Also for this trial'). Like trials/pick-block,
   but several can be ticked; Done goes back. The three names are placeholders for instruments chosen later. */
SCREENS.push({ id:"trials/pick-questionnaires", area:"Insights", status:"idea", title:"Trial · 2 Questionnaires",
  sheet:"half",
  why:"Questionnaires filled in specially for this trial, on top of the daily scores. The three names are placeholders: which instruments are offered is decided in a separate piece of work.",
  concept:[
    "<b>Abstract on purpose:</b> 'Instrument Q1' to 'Q3' stand for real questionnaires to be chosen later.",
    "<b>Optional:</b> none ticked is fine; the daily scores carry the trial.",
  ],
  w:[
    {t:"shead", left:"", l:"Questionnaires", right:"×", goRight:"back"},
    {t:"big", l:"Which questionnaires do you want to fill in for this trial?"},
    {t:"list", rows:[["Instrument Q1","✓"],["Instrument Q2",""],["Instrument Q3",""]]},
    {t:"note", l:"Filled in at the start and at the end."},
    {t:"btn", l:"Done", go:"back"},
  ]});
