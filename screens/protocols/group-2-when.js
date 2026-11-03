SCREENS.push({ id:"protocols/group-2-when", area:"Protocols", status:"idea", title:"Group · 2 When + name",
  sheet:true,
  why:"Name comes last because it can be prefilled from the slot; most people just tap Add.",
  concept:[
    "Slot choice prefills the name (\"Morning supplements\"); editing it is optional.",
    "All items share rhythm and slot. An item with a different time is set later via its row (per-entry override), not here.",
    "Adding to an existing group later: '+' on the group row in its fold reopens step 1 with the current list."
  ],
  w:[
    {t:"shead", left:"‹", l:"6 items", n:"2 of 2", right:"×"},
    {t:"big", l:"When?"},
    {t:"pills", items:["Morning","Noon","Evening","Night"], on:["Morning"]},
    {t:"list", rows:[["Rhythm","Every day ›"]]},
    {t:"field", l:"Name", v:"Morning supplements"},
    {t:"list", rows:[["Start","Today"],["End","None"]]},
    {t:"spacer"},
    {t:"btn", l:"Add to Morning"},
  ]});
