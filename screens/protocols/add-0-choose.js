SCREENS.push({ id:"protocols/add-0-choose", area:"Protocols", status:"idea", title:"Add · 0 Single or group",
  sheet:true,
  why:"Opened by '+ Add' over the Today view. One question, then the matching flow.",
  concept:[
    "<b>One item</b> → single flow: What → Dose → Review.",
    "<b>A group</b> → group flow: List → Review.",
    "<b>Mic</b> works for both: the AI decides single vs. group from what was said and fills the matching review card directly (protocols/add-review-heard), no listening layer."
  ],
  w:[
    {t:"shead", left:"", l:"Add protocol", right:"×", goRight:"close"},
    {t:"big", l:"What are you adding?"},
    {t:"choice", items:[["One item","Naltrexon, an HBOT session"],["A group","Morning supplements, a stack"]],
      go:["protocols/add-1-name","protocols/group-1-list"]},
    {t:"spacer"},
    {t:"mic", go:"protocols/add-review-heard"},
    {t:"note", l:"or just say it"},
    {t:"spacer"},
  ]});
