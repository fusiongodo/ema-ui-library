/* The Protocols tab while the trial runs: a later state of protocols/today-folds (`of`), like the Insights home states.
   Lives in screens/trials/ because the trial owns it. Drawn on day 19 (Fri 27 Nov), the same moment as trials/running.
   Rule: doing lives in Protocols, understanding lives in Insights. The capsule is taken here like any other item;
   what the trial means is read on the Insights side. The evening of day 19: tonight's capsule (no. 19) is taken, as the
   trial's 18 of 19 says (no. 11 was skipped on Thu 19 Nov). Capsule number = day of the trial: a skipped capsule stays in
   the box, the next evening is the next number. */
SCREENS.push({ id:"protocols/today-folds-trial", area:"Protocols", status:"idea", title:"Protocols · Today with a trial running",
  tabs:"idea", tab:"Protocols", sub:"All as planned · all taken", of:"protocols/today-folds",
  tabto:{Protocols:"protocols/today-folds-trial", Insights:"insights/home-trial"},   // Protocols (on) stays here, Insights to its trial state
  why:"The everyday side of a running trial, and where the Protocols tab leads while it runs (from every trial state of Insights). The Evening fold holds the study capsule in Magnesium's place, with the number to take today (Magnesium itself is paused for the trial and says so, not hidden). A tap on the study capsule opens its detail (protocols/item-capsule), a protocol item like any other; from there 'Trial status' leads to the trial in Insights.",
  concept:[
    "<b>Doing in Protocols, understanding in Insights:</b> taking the capsule is a protocol intake like any other; progress, the blind check and the result stay in Insights.",
    "<b>Today's number:</b> 'no. 19', the one thing to get right; it is also the day of the trial. Nothing hints at a block or at real vs placebo.",
    "<b>Skipping</b> works as for any item: 'Different?' on the Evening fold (or by voice) logs it, and it shows as a ring on the capsule's calendar and strip.",
    "<b>Tabs:</b> Insights leads back to the trial state of Insights (insights/home-trial); 'All protocols' opens its trial state (protocols/all-trial).",
    "<b>Magnesium paused, not gone:</b> it stays in the fold with the reason, not struck out (the fold would strike the reason too), so nobody wonders where it went; it comes back by itself when the trial ends or is stopped.",
  ],
  w:[
    {t:"head", l:"Protocols"},
    {t:"tile", tone:"white", l:"Today · all as planned", n:"0 deviations · 22 intakes", bar:100},
    {t:"sec", l:"Your protocols", act:"+ Add", go:"protocols/add-0-choose"},
    {t:"fold", l:"☀︎ Morning", m:"18 · as planned", a:"Different?"},
    {t:"fold", l:"◐ Noon", m:"2", a:"Different?"},
    {t:"fold", l:"☾ Evening", m:"2 · as planned", a:"Different?",
      open:[["Naltrexon","1 mg"],["Study capsule","no. 19"],["Magnesium","paused for the trial"]],
      goRows:["protocols/item-naltrexon","protocols/item-capsule",null]},
    {t:"sec", l:"As needed", r:"tap = taken now"},
    {t:"chips", items:["Epitalon · 2d","Selank · today","Rapamycin · 9d"]},
    {t:"tile", tone:"white", l:"All protocols", r:"›", n:"8 active · 1 paused · 1 ended", go:"protocols/all-trial"},
  ]});
