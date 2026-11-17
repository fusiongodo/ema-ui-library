SCREENS.push({ id:"checkins/games", area:"Check-ins", status:"idea", title:"Check-ins + benchmarks",
  tabs:"idea", tab:"Check-ins", world:"insights", sub:"One a day · today done",
  why:"Symptoms and cognitive benchmarks together: both are measurements of you. No longer the tab: reached from 'Benchmarks · 1 per day' on the Check-ins tab and from 'Game of the day'.",
  w:[
    {t:"shead", left:"‹", l:"Benchmarks", right:"⚙︎", goLeft:"back", goRight:"checkins/config"},
    {t:"tile", tone:"white", h:90, l:"Next: 14:20", n:"or check in now", bar:40},
    {t:"tile", tone:"white", l:"Today", spark:[["08:12","5"],["10:47","6"],["—",""]]},
    {t:"sec", l:"Benchmarks", r:"1 per day"},
    {t:"row", items:[
      {t:"tile", tone:"white", h:78, l:"Dual n-back", n:"today ✓"},
      {t:"tile", tone:"white", h:78, l:"Word game", n:"open"}]},
    {t:"row", items:[
      {t:"tile", tone:"white", h:78, l:"Arithmetic", n:"open"},
      {t:"tile", tone:"white", h:78, l:"Reaction", n:"open"}]},
  ]});
