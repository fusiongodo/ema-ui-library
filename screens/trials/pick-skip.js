/* Picker for "Left out after a switch" on trials/length (pattern of protocols/pick-rhythm). Custom → pick-skip-custom (in place). */
SCREENS.push({ id:"trials/pick-skip", area:"Insights", status:"idea", title:"Trial · pick the days left out",
  sheet:"half",
  why:"Opened from the 'Left out after a switch' row of the design step: how many days after each switch between real and placebo stay out of the result. The sentence that it is not a pause sits right above the values.",
  concept:[
    "<b>Not a pause:</b> the capsule is taken on these days like on any other. Afterwards the app, which knows where the switches were, leaves them out, because the switch may still be wearing off.",
    "<b>Hidden too:</b> the person never learns which days were left out; that would give the switches away.",
  ],
  w:[
    {t:"shead", left:"", l:"Left out after a switch", right:"×", goRight:"back"},
    {t:"note", l:"You take the capsule on these days like on any other. The app leaves them out afterwards; you never learn which days they are."},
    {t:"list", rows:[["None",""],["1 day",""],["2 days","✓"],["5 days",""],["Custom",""]], go:["back","back","back","back","trials/pick-skip-custom"]},
  ]});
