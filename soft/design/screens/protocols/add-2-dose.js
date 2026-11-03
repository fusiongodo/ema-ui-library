SCREENS.push({ id:"protocols/add-2-dose", area:"Protocols", status:"idea", title:"Add · 2 Dose",
  sheet:true,
  why:"Dose is optional (Skip). Unit remembered per item.",
  ref:"refs/juno-add-med-dose.png",
  w:[
    {t:"shead", left:"‹", l:"Naltrexon", n:"2 of 3", right:"×"},
    {t:"big", l:"Dose"},
    {t:"field", v:"3", suffix:"mg"},
    {t:"pills", items:["mg","mcg","g","mL","IU","units"], on:["mg"]},
    {t:"spacer"},
    {t:"btn", l:"Continue"},
    {t:"btn", l:"Skip", light:true},
  ]});
