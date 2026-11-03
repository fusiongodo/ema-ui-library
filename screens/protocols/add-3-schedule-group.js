SCREENS.push({ id:"protocols/add-3-schedule-group", area:"Protocols", status:"idea", title:"Add · 3 When (several)",
  sheet:true,
  why:"The group name is asked last and prefilled from the chosen slot, so most people just tap Add.",
  w:[
    {t:"shead", left:"‹", l:"13 items", n:"3 of 3", right:"×"},
    {t:"big", l:"When?"},
    {t:"list", rows:[["Rhythm","Every day ›"]]},
    {t:"pills", items:["Morning","Noon","Evening","Night"], on:["Morning"]},
    {t:"field", l:"Group name", v:"Morning supplements"},
    {t:"list", rows:[["Start","Today"],["End","None"]]},
    {t:"spacer"},
    {t:"btn", l:"Add to Morning"},
  ]});
