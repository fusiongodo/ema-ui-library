/* Insights after "Not now" on the Apple Health card of insights/home: the tab as it was before the card. */
SCREENS.push({ id:"insights/home-no-health", area:"Insights", status:"idea", title:"Insights · connect declined",
  tabs:"idea", tab:"Insights", sub:"3 patterns · 2 likely", of:"insights/home",
  why:"After 'Not now' the Apple Health card is gone and the tab is as before: patterns, Ask, Trials.",
  concept:[
    "<b>'Not now' removes the card;</b> it comes back in the Check-ins settings (not drawn).",
  ],
  w:[
    {t:"head", l:"Insights"},
    {t:"sec", l:"Patterns", r:"found in your data"},
    ...INSIGHTS_PATTERNS,
    {t:"sec", l:"Ask"},
    INSIGHTS_ASK,
    INSIGHTS_TRIALS_SEC,
    INSIGHTS_TRIALS,
    INSIGHTS_GUIDE,
  ]});
