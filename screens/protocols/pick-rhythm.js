SCREENS.push({ id:"protocols/pick-rhythm", area:"Protocols", status:"idea", title:"Add · pick the rhythm",
  sheet:"half",
  why:"Opened from the Rhythm line of a review card (add, add by voice, group). A half-height sheet, the card stays visible above, dimmed. A tap on a choice sets it and goes back to the card; × or a tap on the dimmed card goes back unchanged.",
  concept:[
    "<b>Plain on purpose:</b> four choices, the current one ticked. 'Certain weekdays' would show the days to pick in place (not drawn)."
  ],
  w:[
    {t:"shead", left:"", l:"Rhythm", right:"×", goRight:"back"},
    {t:"list", rows:[["Every day","✓"],["Every other day",""],["Certain weekdays",""],["As needed",""]], go:"back"},
  ]});
