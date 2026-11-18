/* The Protocols tab while the trial runs: a later state of protocols/today-folds (`of`), like the Insights home states.
   Lives in screens/trials/ because the trial owns it. Drawn on day 19 (Fri 27 Nov), the same moment as trials/running.
   Rule: doing lives in Protocols, understanding lives in Insights. The capsule is taken here like any other item;
   what the trial means is read on the Insights side. */
SCREENS.push({ id:"protocols/today-folds-trial", area:"Protocols", status:"idea", title:"Protocols · Today with a trial running",
  tabs:"idea", tab:"Protocols", sub:"All as planned · evening next", of:"protocols/today-folds",
  why:"The everyday side of a running trial. The Evening fold holds the study capsule in Magnesium's place (Magnesium itself is paused for the trial and says so, not hidden). A tap on the study capsule opens the trial (trials/running).",
  concept:[
    "<b>Doing in Protocols, understanding in Insights:</b> taking the capsule is a protocol intake like any other; progress, the blind check and the result stay in Insights.",
    "<b>Only the day number:</b> 'day 19 of 56', nothing that hints at a block or at real vs placebo.",
    "<b>Magnesium paused, not gone:</b> it stays in the fold with the reason, not struck out (the fold would strike the reason too), so nobody wonders where it went; it comes back by itself when the trial ends or is stopped.",
  ],
  w:[
    {t:"head", l:"Protocols"},
    {t:"tile", tone:"white", l:"Today · all as planned", n:"0 deviations · 22 intakes", bar:100},
    {t:"sec", l:"Your protocols", act:"+ Add", go:"protocols/add-0-choose"},
    {t:"fold", l:"☀︎ Morning", m:"18 · as planned", a:"Different?"},
    {t:"fold", l:"◐ Noon", m:"2", a:"Different?"},
    {t:"fold", l:"☾ Evening", m:"2 · as planned", a:"Different?",
      open:[["Naltrexon","1 mg"],["Study capsule","day 19 of 56"],["Magnesium","paused for the trial"]],
      goRows:["protocols/item-naltrexon","trials/running",null]},
    {t:"sec", l:"As needed", r:"tap = taken now"},
    {t:"chips", items:["Epitalon · 2d","Selank · today","Rapamycin · 9d"]},
    {t:"tile", tone:"white", l:"All protocols", r:"›", n:"8 active · 1 ended", go:"protocols/all"},
  ]});
