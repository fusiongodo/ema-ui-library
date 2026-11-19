/* Helper · 4: the look-alike check, once, before the first hand-over. Drawn with three of four checks ticked. */
SCREENS.push({ id:"trials/helper-check", area:"Insights", status:"idea", title:"Helper · 4 Look-alike check",
  world:"neutral",
  why:"The helper tests the blinding before the person does: one capsule of each kind, compared by look, weight, sound and smell.",
  concept:[
    "<b>The rule made checkable:</b> 'cannot be told apart' becomes four small tests.",
    "<b>Before the hand-over:</b> a difference found now costs minutes; found by the person, it costs the trial.",
    "<b>Recorded:</b> what was checked is kept with the trial and shown with the result.",
  ],
  w:[
    {t:"shead", left:"‹", l:"Check", n:"once, before the first hand-over", right:"", goLeft:"back"},
    {t:"big", l:"Can you tell them apart?", n:"Take one of each. If you can tell, Alex can too."},
    {t:"checks", rows:[["Look","Colour, size, shine",true],["Weight","One in each hand",true],["Sound","Shake them next to your ear",true],["Smell","Eyes closed",false]]},
    {t:"note", l:"One differs? Fix it first, for example more filling so nothing rattles."},
    {t:"btn", l:"They match", go:"trials/helper-photo"},
  ]});
