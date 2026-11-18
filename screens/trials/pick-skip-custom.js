/* "Custom" on trials/pick-skip: a number of days (a later state, `of`, so the sheet changes in place). */
SCREENS.push({ id:"trials/pick-skip-custom", area:"Insights", status:"idea", title:"Trial · washout period, custom",
  sheet:"half", of:"trials/pick-skip",
  why:"A custom washout period: the number of days after each switch that stay out of the comparison. The unit is always days.",
  concept:[
    "<b>Shorter than a block:</b> what is left of each block after these days goes into the result.",
  ],
  w:[
    {t:"shead", left:"", l:"Washout period", n:"custom", right:"×", goRight:"back"},
    {t:"stepper", l:"Days", v:3},
    {t:"note", l:"Washout days are taken like any other."},
    {t:"btn", l:"Done", go:"back"},
  ]});
