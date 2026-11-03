SCREENS.push({ id:"protocols/add-0-choose", area:"Protocols", status:"idea", title:"Add · 0 Single or group",
  sheet:true,
  why:"Opened by '+ Add' over the Today view. One question, then the matching flow.",
  concept:[
    "<b>One item</b> → single flow: What → Dose → When.",
    "<b>A group</b> → group flow: List → When + name.",
    "<b>Mic</b> works for both: the AI decides single vs. group from what was said and opens the matching flow prefilled."
  ],
  w:[
    {t:"shead", left:"", l:"Add protocol", right:"×"},
    {t:"big", l:"What are you adding?"},
    {t:"choice", items:[["One item","Naltrexon, an HBOT session"],["A group","Morning supplements, a stack"]]},
    {t:"spacer"},
    {t:"mic"},
    {t:"note", l:"or just say it"},
    {t:"spacer"},
  ]});
