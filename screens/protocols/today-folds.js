SCREENS.push({ id:"protocols/today-folds", area:"Protocols", status:"idea", title:"Protocols · Today (folds)",
  tabs:"idea", tab:"Protocols",
  why:"Merges Day view + Plans list. A slot counts as done; 'Different?' opens it for skip / dose change. '+ Add' opens the add sheet over this view.",
  ref:"refs/juno-folds.png",
  w:[
    {t:"tile", tone:"sage", l:"Today · all as planned", n:"0 deviations · 21 intakes", bar:100},
    {t:"sec", l:"Your protocols", act:"+ Add"},
    {t:"fold", l:"☀︎ Morning", m:"18 · as planned", a:"Different?"},
    {t:"fold", l:"◐ Noon", m:"2", a:"Different?", open:[["Naltrexon","1 mg"],["Taurine","500 mg",1]]},
    {t:"fold", l:"☾ Evening", m:"1 · as planned", a:"Different?"},
    {t:"sec", l:"As needed", r:"tap = taken now"},
    {t:"chips", items:["Epitalon · 2d","Selank · today","Rapamycin · 9d"]},
    {t:"tile", tone:"white", l:"Consistency · 30 days", heat:true},
  ]});
