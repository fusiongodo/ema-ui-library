SCREENS.push({ id:"protocols/pick-when", area:"Protocols", status:"idea", title:"Add · pick the times",
  sheet:"half",
  why:"Opened from the When line of a review card (add, add by voice, group). The card only states the chosen time ('Morning'); the other times appear here, after the tap. Several can be picked: each time is one entry of the same plan (Naltrexon morning + noon). The card stays visible above, dimmed.",
  concept:[
    "<b>A card states values, it is not a form:</b> no unselected pills on the card, so nothing there looks like an open choice.",
    "<b>Several at once:</b> a tap turns a time on or off; Done goes back. In Play the card's line and its button follow ('Morning + Noon', 'Add to Morning + Noon'). × or a tap on the dimmed card goes back too."
  ],
  w:[
    {t:"shead", left:"", l:"When", n:"Pick one or more", right:"×", goRight:"back"},
    {t:"pills", items:["Morning","Noon","Evening","Night"], on:["Morning"], multi:true},
    {t:"spacer"},
    {t:"btn", l:"Done", go:"back"},
  ]});
