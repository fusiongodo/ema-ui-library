SCREENS.push({ id:"voice/drafts-1", area:"Voice", status:"idea", title:"Listening layer · one confirmed",
  sheet:"half", of:"voice/drafts",
  why:"Back from the Check-in sheet after Save: the same layer, the Check-in card is ticked and drawn back (its note with it), the Naltrexon card still waits. 'Confirm all' saves the rest at once.",
  concept:[
    "<b>Saving one card returns to the others</b> instead of closing the layer: the remaining drafts are not lost.",
    "<b>A state of voice/drafts</b> (<code>of</code>): Play returns to the drafts and replaces them, so Back does not open the saved sheet again."
  ],
  w:[
    {t:"say", l:"Pretty wiped today. Feel completely hung over for no reason. But pain is okay. Forgot the naltrexone at noon."},
    {t:"review", compact:true, ok:true, title:"Check-in", n:"Saved · Fatigue 7 · Brain fog 6 · Pain 3", go:"checkins/entry-heard"},
    {t:"review", compact:true, title:"Naltrexon", n:"Skipped today · noon", go:"protocols/deviation-heard",
      clarity:"clear", hint:"Said clearly: forgot it at noon"},
    {t:"review", compact:true, ok:true, tone:"neutral", title:"Note", n:"Saved with the check-in"},
    {t:"btn", l:"Confirm all", go:"close"},
  ]});
