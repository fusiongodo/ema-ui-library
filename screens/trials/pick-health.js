/* Picker for "Apple Health" on step 2 of the trial setup (trials/measure, 'Also for this trial'). Like trials/pick-block,
   but several can be ticked; Done goes back. */
SCREENS.push({ id:"trials/pick-health", area:"Insights", status:"idea", title:"Trial · 2 Apple Health",
  sheet:"half",
  why:"Measures from Apple Health for this trial. Ticking one is a promise to oneself: wear the tracker, keep it charged; the app reminds. Data that is not ticked is not lost and can be looked at after the trial.",
  concept:[
    "<b>Why tick at all:</b> what is ticked is fixed before the start; what is looked at only afterwards is a side finding.",
    "<b>No extra effort:</b> nothing to log; the tracker does it.",
  ],
  w:[
    {t:"shead", left:"", l:"Apple Health", right:"×", goRight:"back"},
    {t:"big", l:"What should count from Apple Health?"},
    {t:"list", rows:[["Steps","✓"],["Sleep","✓"],["Resting heart rate",""]]},
    {t:"note", l:"Ticked: we remind you to wear and charge your tracker. The rest can still be looked at afterwards."},
    {t:"btn", l:"Done", go:"back"},
  ]});
