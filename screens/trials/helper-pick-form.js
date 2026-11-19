/* Picker for "Form" on trials/helper-setup, the pattern of trials/pick-block: a tap on an option sets it and goes back. */
SCREENS.push({ id:"trials/helper-pick-form", area:"Insights", status:"idea", title:"Helper · Form",
  sheet:"half", world:"neutral",
  why:"How real and placebo are made indistinguishable. Tablets are the hard case, so the option that solves it says so. Examples, not requirements.",
  w:[
    {t:"shead", left:"", l:"What form?", right:"×", goRight:"back"},
    {t:"list", rows:[
      ["Opaque capsules, filled by you","✓","","Powder or filler in empty capsules nobody can see through."],
      ["Tablet inside an opaque capsule","","","Tablets are hard to disguise. Hide each in a capsule and fill the gap so it doesn't rattle."],
      ["A matching placebo","","","Same size, colour and weight, bought or made."],
      ["Sachets for a drink","","","Powder or filler in sachets, stirred into a strong-tasting drink."],
      ["Another way","","","Anything works if nobody can tell them apart."]],
      go:["back","back","back","back","back"]},
    {t:"note", l:"Examples with pictures ›", go:"trials/guide-prepare"},
  ]});
