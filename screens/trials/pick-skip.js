/* Picker for "Washout period" on trials/length (pattern of protocols/pick-rhythm). Custom → pick-skip-custom (in place). */
SCREENS.push({ id:"trials/pick-skip", area:"Insights", status:"idea", title:"Trial · pick the washout period",
  sheet:"half",
  why:"Opened from the 'Washout period' row of the design step: how many days before every block stay out of the comparison, switch or not. They come on top of the block duration. The sentence that it is not a pause sits right above the values.",
  concept:[
    "<b>On top of the blocks:</b> a block keeps all its days in the comparison; the washout days come before every block, switch or not, so one block always takes washout + block days and the washout gives no switch away. The (i) on the design step says it in one sentence (trials/term-washout).",
    "<b>Not a pause:</b> the capsule is taken on these days like on any other. Afterwards the app leaves them out, because after a switch the earlier kind may still be wearing off.",
    "<b>Hidden too:</b> the person never learns which days were washout; that would give the switches away.",
  ],
  w:[
    {t:"shead", left:"", l:"Washout period", n:"before each block", right:"×", goRight:"back"},
    {t:"note", l:"Washout days are taken like any other. The app leaves them out of the comparison afterwards; you never learn which days they are."},
    {t:"list", rows:[["None",""],["1 day",""],["2 days","✓"],["5 days",""],["Custom",""]], go:["back","back","back","back","trials/pick-skip-custom"]},
  ]});
