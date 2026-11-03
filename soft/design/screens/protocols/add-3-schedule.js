SCREENS.push({ id:"protocols/add-3-schedule", area:"Protocols", status:"idea", title:"Add · 3 When",
  sheet:true,
  why:"Several time slots = several entries in one plan (Naltrexon morning + noon). Button names the target fold.",
  ref:"refs/juno-add-med-schedule.png",
  w:[
    {t:"shead", left:"‹", l:"Naltrexon · 3 mg", n:"3 of 3", right:"×"},
    {t:"big", l:"When?"},
    {t:"list", rows:[["Rhythm","Every day ›"]]},
    {t:"pills", items:["Morning","Noon","Evening","Night"], on:["Morning"]},
    {t:"list", rows:[["Start","Today"],["End","None"]]},
    {t:"field", l:"Note (optional)", v:"Take with food …"},
    {t:"spacer"},
    {t:"btn", l:"Add to Morning"},
  ]});
