/* The prototype skips ahead here: any answer jumps to the end of week 8 (insights/home-result). */
SCREENS.push({ id:"trials/guess", area:"Insights", status:"idea", title:"Trial · end-of-week guess",
  sheet:"half",
  why:"At the end of each week, one question with three answers. It only checks the blind: if most guesses are right, the result says so. In the prototype any answer skips ahead to the end of week 8.",
  concept:[
    "<b>Why ask:</b> if you can tell the weeks apart (taste, a side effect), the result could be expectation. Eight guesses show whether the secret held.",
    "<b>'No idea' is a full answer,</b> not a dodge; it is what a good blind feels like.",
    "<b>Prototype jump:</b> the answer leads five weeks ahead to the Insights tab with the result ready (insights/home-result).",
  ],
  w:[
    {t:"shead", left:"", l:"End of week 3", right:"×", goRight:"close"},
    {t:"big", l:"A or B this week?", n:"What do you think you took?"},
    {t:"choice", items:[["A","Magnesium"],["B","Placebo"]], go:"insights/home-result"},
    {t:"note", l:"Only to check that the secret held. Your guess changes nothing."},
    {t:"btn", l:"No idea", light:true, go:"insights/home-result"},
  ]});
