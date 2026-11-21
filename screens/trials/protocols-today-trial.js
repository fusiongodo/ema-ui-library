/* The Protocols tab while the trial runs: a later state of protocols/today-folds (`of`), like the Insights home states.
   Lives in screens/trials/ because the trial owns it. Drawn on day 19 (Fri 27 Nov), the same moment as trials/running.
   Rule: doing lives in Protocols, understanding lives in Insights. Magnesium itself is the trial item: one row in the
   Evening fold, marked "Trial", with the number of tonight's trial capsule; taken like any other item. What the trial
   means is read on the Insights side. The evening of day 19: tonight's capsule (no. 19) is taken, as the trial's 18 of 19
   says (no. 11 was skipped on Thu 19 Nov). Capsule number = day of the trial: a skipped capsule stays in the box, the next
   evening is the next number. */
SCREENS.push({ id:"protocols/today-folds-trial", area:"Protocols", status:"idea", title:"Protocols · Today with a trial running",
  tabs:"idea", tab:"Protocols", sub:"All as planned · all taken", of:"protocols/today-folds",
  tabto:{Protocols:"protocols/today-folds-trial", Insights:"insights/home-trial"},   // Protocols (on) stays here, Insights to its trial state
  why:"The everyday side of a running trial, and where the Protocols tab leads while it runs (from every trial state of Insights). Magnesium stays where it always is, in the Evening fold, marked with a small 'Trial' badge and the number of tonight's trial capsule. A tap opens Magnesium in its trial state (protocols/item-capsule); from there 'Trial status' leads to the trial in Insights.",
  concept:[
    "<b>Magnesium is the trial item:</b> one row, no separate capsule, nothing paused. The badge says it is in a trial; the capsule number is the one thing to get right tonight.",
    "<b>Doing in Protocols, understanding in Insights:</b> taking the capsule is an intake like any other; progress, the blind check and the result stay in Insights.",
    "<b>Today's number:</b> 'capsule no. 19', which is also the day of the trial. Nothing hints at a block or at real vs placebo.",
    "<b>The badge is calm:</b> small, in the light tint of the trial's world (Insights, PRINCIPLES 9), no fill of the row, nothing that asks for attention.",
    "<b>Skipping</b> works as for any item: 'Different?' on the Evening fold (or by voice) logs it, and it shows as a ring on Magnesium's calendar and strip.",
    "<b>Tabs:</b> Insights leads back to the trial state of Insights (insights/home-trial); 'All protocols' opens its trial state (protocols/all-trial).",
  ],
  w:[
    {t:"head", l:"Protocols"},
    {t:"tile", tone:"white", l:"Today · all as planned", n:"0 deviations · 22 intakes", bar:100,
      day:[["Morning",1],["Noon",1],["Evening",1]]},
    {t:"sec", l:"Your protocols", act:"+ Add", go:"protocols/add-0-choose"},
    {t:"fold", l:"☀︎ Morning", m:"18 · as planned", a:"Different?"},
    {t:"fold", l:"◐ Noon", m:"2", a:"Different?"},
    {t:"fold", l:"☾ Evening", m:"2 · as planned", a:"Different?",
      open:[["Naltrexon","1 mg"],["Magnesium" + TRIAL_BADGE,"capsule no. 19"]],
      goRows:["protocols/item-naltrexon","protocols/item-capsule"]},
    {t:"sec", l:"As needed", r:"tap = taken now"},
    {t:"chips", items:["Epitalon · 2d","Selank · today","Rapamycin · 9d"]},
    {t:"tile", tone:"white", l:"All protocols", r:"›", n:"9 active · 1 ended", go:"protocols/all-trial"},
  ]});
