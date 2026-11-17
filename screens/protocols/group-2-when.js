SCREENS.push({ id:"protocols/group-2-when", area:"Protocols", status:"idea", title:"Group · 2 Review",
  sheet:true,
  why:"The group flow ends in the same review card as the single one: the list, When set in place, the name prefilled from the slot. Most people just tap Add.",
  concept:[
    "Slot choice prefills the name (\"Morning supplements\"); editing it is optional.",
    "All items share rhythm and slot. An item with a different time is set later via its row (per-entry override), not here.",
    "'6 items' opens the list again. Adding to an existing group later: '+' on the group row in its fold reopens step 1 with the current list.",
    "Voice: a dictated group lands on this card, filled in, with the heard rows marked (as protocols/add-review-heard)."
  ],
  w:[
    {t:"shead", left:"‹", l:"Add protocol", n:"2 of 2", right:"×", goLeft:"back", goRight:"close"},
    {t:"review", title:"New group", icon:"stack", rows:[
      ["Items", "6 items", "", "protocols/group-1-list"],
      ["When", {t:"pills", items:["Morning","Noon","Evening","Night"], on:["Morning"]}],
      ["Rhythm", "Every day", "default", "protocols/pick-rhythm"],
      ["Name", "Morning supplements"],
      ["Start", "Today", "default", "protocols/pick-start"],
      ["End", "No end", "default", "protocols/pick-end"]]},
    {t:"spacer"},
    {t:"btn", l:"Add to Morning", go:"protocols/today-folds"},
  ]});
