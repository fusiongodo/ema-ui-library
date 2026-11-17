/* Weeks 1–3 of the drawn order B A A … (see trials/intro). */
SCREENS.push({ id:"trials/order", area:"Insights", status:"idea", title:"Trial · the order, on request",
  sheet:"half",
  why:"After stopping early, the order is shown only when asked for. Three weeks, plain words, no averages: three weeks are too few to compare, so nothing suggests a result.",
  concept:[
    "<b>No numbers next to the weeks:</b> putting scores beside them would invite exactly the reading the trial could not support.",
  ],
  w:[
    {t:"shead", left:"", l:"Magnesium trial", right:"×", goRight:"close"},
    {t:"big", l:"Your 3 weeks", n:"Stopped after week 3."},
    {t:"list", rows:[["Week 1","Placebo"],["Week 2","Magnesium"],["Week 3","Magnesium"]]},
    {t:"note", l:"Too few weeks to compare. If you test Magnesium again, start a new trial: the app draws a new order."},
  ]});
