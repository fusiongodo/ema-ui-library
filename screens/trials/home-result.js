/* Insights tab on Mon 4 Jan, the trial is over. A later state of insights/home (`of`). */
SCREENS.push({ id:"insights/home-result", area:"Insights", status:"idea", title:"Insights · trial result ready",
  tabs:"idea", tab:"Insights", sub:"3 patterns · trial done", of:"insights/home",
  why:"Day 56 is over (the prototype jumps here from the progress card of the running trial). The trial card turns into the one tinted card and moves to the top: the result is ready and wants to be seen. It opens the one question before the reveal (trials/guess), then the result.",
  concept:[
    "<b>Tinted, once, on top:</b> the only thing on the tab that wants something from you today (PRINCIPLES 8), so Trials moves up for this one day. After opening it, the card goes back to its place.",
    "<b>No result in the card:</b> the finding is read on its own screen with its caveats, not as a headline on the tab.",
  ],
  w:[
    {t:"head", l:"Insights"},
    {t:"sec", l:"Trials"},
    {t:"tile", tone:"lilac", cta:true, l:"Your trial result is ready", n:"Magnesium · 8 weeks · fatigue", go:"trials/guess"},
    {t:"sec", l:"Patterns", r:"found in your data"},
    ...INSIGHTS_PATTERNS,
    {t:"sec", l:"Ask"},
    INSIGHTS_ASK,
  ]});
