SCREENS.push({ id:"protocols/pick-end", area:"Protocols", status:"idea", title:"Add · pick the end",
  sheet:"half",
  why:"Opened from the End line of a review card. Same half-height sheet as the rhythm: a tap on a choice sets it and goes back to the card; × or a tap on the dimmed card goes back unchanged.",
  concept:[
    "<b>Plain on purpose:</b> no end is the default; 'Pick a date' would open a date wheel in place (not drawn)."
  ],
  w:[
    {t:"shead", left:"", l:"End", right:"×", goRight:"back"},
    {t:"list", rows:[["No end","✓"],["After 4 weeks",""],["Pick a date",""]], go:"back"},
  ]});
