/* Questionnaires, first run: the empty state, opened from the quiet 'Questionnaires' card on the Check-ins tab
   (checkins/overview-next). Rough structure only; the visual design comes later. */
SCREENS.push({ id:"checkins/q-home", area:"Check-ins", status:"idea", title:"Questionnaires · empty",
  tabs:"idea", tab:"Check-ins",
  why:"The empty state: one sentence on what questionnaires are for and one action, choosing an area.",
  w:[
    {t:"shead", left:"‹", l:"Questionnaires", right:"", goLeft:"back"},
    {t:"big", l:"The questionnaires research uses."},
    {t:"note", l:"Pick an area. Every few weeks you answer a few questions, and you can compare your values with studies."},
    {t:"tile", tone:"lilac", l:"Choose an area", cta:true, go:"checkins/q-area"},
  ]});
