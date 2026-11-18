/* "Custom" on trials/pick-block: the same sheet turns into a number and a unit (a later state, `of`, so it changes in place). */
SCREENS.push({ id:"trials/pick-block-custom", area:"Insights", status:"idea", title:"Trial · block duration, custom",
  sheet:"half", of:"trials/pick-block",
  why:"A custom block length: a number and a unit, nothing else. Done sets it and goes back to the step.",
  concept:[
    "<b>Number and unit:</b> days or weeks. Exact, like the listed values: every block has this many compared days, the washout comes on top.",
  ],
  w:[
    {t:"shead", left:"", l:"Block duration", n:"custom", right:"×", goRight:"back"},
    {t:"stepper", l:"Length", v:10},
    {t:"seg", items:["days","weeks"], on:"days"},
    {t:"btn", l:"Done", go:"back"},
  ]});
