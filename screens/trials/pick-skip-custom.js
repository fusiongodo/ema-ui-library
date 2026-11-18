/* "Custom" on trials/pick-skip: a number of days (a later state, `of`, so the sheet changes in place). */
SCREENS.push({ id:"trials/pick-skip-custom", area:"Insights", status:"idea", title:"Trial · washout period, custom",
  sheet:"half", of:"trials/pick-skip",
  why:"A custom washout period: the number of days before each block that stay out of the comparison. The unit is always days.",
  concept:[
    "<b>On top of a block:</b> these days come before every block; the block itself keeps all its days in the result.",
  ],
  w:[
    {t:"shead", left:"", l:"Washout period", n:"custom", right:"×", goRight:"back"},
    {t:"stepper", l:"Days", v:3},
    {t:"note", l:"Washout days are taken like any other."},
    {t:"btn", l:"Done", go:"back"},
  ]});
