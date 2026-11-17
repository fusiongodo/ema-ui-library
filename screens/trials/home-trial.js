/* Insights tab with a trial running: a later state of insights/home (`of`), like home-pinned. Lives in screens/trials/
   because the trial owns it. Drawn as it looks in week 3 (Sun 29 Nov), the same moment as trials/running. */
SCREENS.push({ id:"insights/home-trial", area:"Insights", status:"idea", title:"Insights · with a trial running",
  tabs:"idea", tab:"Insights", sub:"3 patterns · trial in week 3", of:"insights/home",
  why:"After 'Start on Monday' the setup sheets go down and the Trials section shows the running trial as one card. Drawn three weeks in, so the card has something to say. It opens the trial (trials/running).",
  concept:[
    "<b>One card replaces 'Start a trial':</b> one trial at a time, so the offer to start another is gone while this one runs.",
    "<b>Only what is safe to see:</b> week, primary score, capsules. No A/B, no trend (PRINCIPLES 8: white, nothing is asked here; the end-of-week question waits on the trial's own page).",
    "<b>In the real app,</b> right after starting the card reads 'Starts Mon 9 Nov · Sam has the fill plan'.",
  ],
  w:[
    {t:"head", l:"Insights"},
    {t:"sec", l:"Patterns", r:"found in your data"},
    ...INSIGHTS_PATTERNS,
    {t:"sec", l:"Ask"},
    INSIGHTS_ASK,
    {t:"sec", l:"Trials"},
    {t:"tile", tone:"white", l:"Magnesium trial", r:"Week 3 of 8", n:"Fatigue · 19 of 21 capsules", bar:37.5, go:"trials/running"},
  ]});
