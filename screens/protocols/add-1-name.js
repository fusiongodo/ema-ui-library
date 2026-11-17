SCREENS.push({ id:"protocols/add-1-name", area:"Protocols", status:"idea", title:"Add · 1 What",
  sheet:true,
  why:"Sheet over the Today view, no navigation away. One question per step. 'Say it' listens in place (protocols/add-listen) and fills the whole card.",
  ref:"refs/juno-add-med-1.png",
  w:[
    {t:"shead", left:"", l:"Add protocol", n:"1 of 3", right:"×", goRight:"close"},
    {t:"big", l:"What do you take?"},
    {t:"field", v:"e.g. Naltrexon, HBOT, Magnesium"},
    {t:"sec", l:"Recent", r:""},
    {t:"chips", items:["Taurine","NAC","Selank","🎙 Say it"], go:["protocols/add-2-dose","protocols/add-2-dose","protocols/add-2-dose","protocols/add-listen"]},
    {t:"spacer"},
    {t:"btn", l:"Continue", go:"protocols/add-2-dose"},
  ]});
