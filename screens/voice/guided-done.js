SCREENS.push({ id:"voice/guided-done", area:"Voice", status:"idea", title:"Guided · summary",
  sheet:"half",
  why:"The agent reads back what it will save, in one sentence, and asks. 'Yes, save' (or saying yes) saves and closes the layer. 'Change' opens the normal check-in sheet, filled in (checkins/entry-heard).",
  concept:[
    "<b>Nothing is saved without confirmation</b> (PRINCIPLES 5): the spoken 'yes' is the confirmation, also with eyes closed.",
    "<b>The result is always the manual overview:</b> 'Change' shows the same sheet as a manual check-in."
  ],
  w:[
    {t:"bud", st:"speaking", l:"Fatigue 7, brain fog 6, the rest unchanged. Save?"},
    {t:"spacer"},
    {t:"btn", l:"Yes, save", go:"close"},
    {t:"btn", l:"Change", light:true, go:"checkins/entry-heard"},
  ]});
