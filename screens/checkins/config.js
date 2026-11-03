SCREENS.push({ id:"checkins/config", area:"Check-ins", status:"current", title:"Check-in configuration",
  sheet:true,
  why:"Reconstructed (no screenshot yet). Send one and I'll correct it.",
  w:[
    {t:"shead", left:"‹", l:"Customize", right:"Done"},
    {t:"sec", l:"Scores"},
    {t:"list", rows:[["Fatigue / energy","≡"],["Overall wellbeing","≡"],["Pain","≡"],["Thirst","≡"],["Brain fog","≡"],["+ Add score","","acc"]]},
    {t:"sec", l:"Schedule"},
    {t:"stepper", l:"Check-ins a day", v:"3"},
    {t:"pills", items:["Fixed times","Random in windows"], on:["Fixed times"]},
    {t:"list", rows:[["1","9:00"],["2","13:00"],["3","18:00"]]},
    {t:"toggle", l:"Voice note", on:true},
  ]});
