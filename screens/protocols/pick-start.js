SCREENS.push({ id:"protocols/pick-start", area:"Protocols", status:"idea", title:"Add · pick the start",
  sheet:"half",
  why:"Opened from the Start line of a review card. Same half-height sheet as the rhythm: a tap on a choice sets it and goes back to the card; × or a tap on the dimmed card goes back unchanged.",
  concept:[
    "<b>Plain on purpose:</b> today is the default; 'Pick a date' would open a date wheel in place (not drawn)."
  ],
  w:[
    {t:"shead", left:"", l:"Start", right:"×", goRight:"back"},
    {t:"list", rows:[["Today","✓"],["Tomorrow",""],["Pick a date",""]], go:"back"},
  ]});
