/* Daily items from protocols/all. Prescribed: Naltrexon (daily) and Rapamycin (as needed) are shown, not selectable. */
SCREENS.push({ id:"trials/what", area:"Insights", status:"idea", title:"Trial · 1 What to test",
  sheet:true,
  why:"Pick one thing from your own protocols, nothing to type. Only daily items qualify (switching between real and placebo needs a daily dose). Prescribed medicines stay visible but are not selectable, with the reason right there.",
  concept:[
    "<b>From your protocols:</b> the trial replaces the chosen item while it runs; the study capsule takes its place in the evening fold, so there is no new habit.",
    "<b>Prescribed = ask your doctor first:</b> swapping a prescribed drug for a placebo is a medical decision. Shown greyed with the reason, not hidden, so nobody wonders where Naltrexon went.",
    "<b>As-needed items</b> (Epitalon, Selank) are left out: there is no steady dose to compare.",
  ],
  w:[
    {t:"shead", left:"‹", l:"Set up a trial", n:"1 of 4", right:"×", goLeft:"back", goRight:"close"},
    {t:"big", l:"What do you want to test?", n:"One daily item from your protocols."},
    {t:"pills", items:["Magnesium","Taurine","Q10","NAC","D3","Curcumin"], on:["Magnesium"]},
    {t:"note", l:"Magnesium · 300 mg · evening. While the trial runs, a study capsule takes its place."},
    {t:"sec", l:"Prescribed", r:"ask your doctor first"},
    {t:"list", rows:[["Naltrexon","1 mg · noon"],["Rapamycin","6 mg · as needed"]]},
    {t:"spacer"},
    {t:"btn", l:"Continue", go:"trials/measure"},
  ]});
