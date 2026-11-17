SCREENS.push({ id:"voice/guided-done", area:"Voice", status:"idea", title:"Guided · summary",
  sheet:"half",
  why:"The agent reads back what it will save and asks; the five values stand large below it, readable at a glance. 'Yes, save' (or saying yes) saves and closes the layer. 'Change' opens the normal check-in sheet, filled in with all five (checkins/entry-heard-all).",
  concept:[
    "<b>Nothing is saved without confirmation</b> (PRINCIPLES 5): the spoken 'yes' is the confirmation, also with eyes closed.",
    "<b>The result is always the manual overview:</b> 'Change' shows the same sheet as a manual check-in."
  ],
  w:[
    {t:"bud", st:"speaking", l:"Save this check-in?"},
    {t:"stats", items:[["7","Fatigue"],["5","Wellbeing"],["6","Brain fog"],["3","Pain"],["2","Thirst"]]},
    {t:"spacer"},
    {t:"btn", l:"Yes, save", go:"close"},
    {t:"btn", l:"Change", light:true, go:"checkins/entry-heard-all"},
  ]});
