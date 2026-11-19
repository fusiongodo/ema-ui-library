/* Insights tab with a trial running: a later state of insights/home (`of`), like home-pinned. Lives in screens/trials/
   because the trial owns it. Drawn as it looks on day 19 (Fri 27 Nov), the same moment as trials/running. */
SCREENS.push({ id:"insights/home-trial", area:"Insights", status:"idea", title:"Insights · with a trial running",
  tabs:"idea", tab:"Insights", sub:"3 patterns · trial on day 19", of:"insights/home",
  tabto:{Protocols:"protocols/today-folds-trial", Insights:"insights/home-trial"},   // while the trial runs, Protocols shows Magnesium as the trial item; Insights (on) stays here
  why:"After 'Start on Monday' the setup sheets go down and the Trials section shows the running trial as one card. Drawn 19 days in, so the card has something to say. It opens the trial (trials/running).",
  concept:[
    "<b>One card replaces 'Start a trial':</b> the running trial is the card; '+ Add' on the Trials heading is how a further trial is set up.",
    "<b>Only what is safe to see:</b> day, primary outcome, capsules. Nothing about blocks, no trend (PRINCIPLES 8: white, nothing is asked here or on the trial's own page).",
    "<b>Protocols tab:</b> leads to today with Magnesium, marked 'Trial', in the Evening fold (protocols/today-folds-trial): doing lives in Protocols, understanding here.",
    "<b>In the real app,</b> right after starting the card reads 'Starts Mon 9 Nov · Sam has the fill plan'.",
  ],
  w:[
    {t:"head", l:"Insights"},
    {t:"sec", l:"Patterns", r:"found in your data"},
    ...INSIGHTS_PATTERNS,
    {t:"sec", l:"Ask"},
    INSIGHTS_ASK,
    INSIGHTS_TRIALS_SEC,
    {t:"tile", tone:"white", l:"Magnesium trial", r:"Day 19 of 63", n:"Symptom score · 18 of 19 capsules", bar:30.2, go:"trials/running"},
    INSIGHTS_GUIDE,
  ]});
