/* "Custom" on trials/pick-skip: a number of days (a later state, `of`, so the sheet changes in place). */
SCREENS.push({ id:"trials/pick-skip-custom", area:"Insights", status:"idea", title:"Trial · days left out, custom",
  sheet:"half", of:"trials/pick-skip",
  why:"A custom number of days left out after each switch. The unit is always days.",
  concept:[
    "<b>Shorter than a block:</b> what is left of each block after these days goes into the result.",
  ],
  w:[
    {t:"shead", left:"", l:"Left out after a switch", n:"custom", right:"×", goRight:"back"},
    {t:"stepper", l:"Days", v:3},
    {t:"note", l:"You take the capsule on these days like on any other."},
    {t:"btn", l:"Done", go:"back"},
  ]});
