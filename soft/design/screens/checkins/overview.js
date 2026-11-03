SCREENS.push({ id:"checkins/overview", area:"Check-ins", status:"current", title:"Check-ins overview",
  tabs:"current", tab:"Check-ins",
  why:"Config summary on top, one trend tile per score. Good bones.",
  w:[
    {t:"head", l:"Check-ins"},
    {t:"tile", tone:"white", l:"YOUR CHECK-IN", r:"Customize ›",
      chips:["Fatigue / energy","Overall wellbeing","Pain","Thirst","Brain fog"],
      foot:"🕘 3× a day · 9:00, 13:00, 18:00   ·   1 of 5"},
    {t:"toggle", l:"Show protocol", on:false},
    {t:"sec", l:"Trends"},
    {t:"grid2", items:[
      {t:"trend", l:"Fatigue / energy"},{t:"trend", l:"Overall wellbeing"},
      {t:"trend", l:"Pain"},{t:"trend", l:"Thirst"}]},
    {t:"note", l:"good ━━━━ bad"},
  ]});
