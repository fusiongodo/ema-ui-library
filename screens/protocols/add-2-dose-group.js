SCREENS.push({ id:"protocols/add-2-dose-group", area:"Protocols", status:"idea", title:"Add · 2 Dose (several)",
  sheet:true,
  why:"One compact row per item instead of one screen per item. Units are remembered per item; empty dose is fine.",
  w:[
    {t:"shead", left:"‹", l:"13 items", n:"2 of 3", right:"×"},
    {t:"big", l:"Doses", n:"Optional. Tap a row to set it."},
    {t:"list", rows:[["Taurine","500 mg","acc"],["NAC","500 mg","acc"],["Q10","300 mg","acc"],["Premium Multi","1"],["DHA + EPA","—"],["Curcumin","—"],["+ 7 more",""]]},
    {t:"spacer"},
    {t:"btn", l:"Continue"},
    {t:"btn", l:"Skip doses", light:true},
  ]});
