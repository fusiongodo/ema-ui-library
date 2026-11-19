/* After "Stop the trial" on day 19. A later state of insights/home (`of`). */
SCREENS.push({ id:"insights/home-stopped", area:"Insights", status:"idea", title:"Insights · trial stopped",
  tabs:"idea", tab:"Insights", sub:"3 patterns", of:"insights/home",
  why:"What is left after stopping early: one white card that says so, the days only on request, and '+ Add' on the Trials heading for a new trial.",
  concept:[
    "<b>No result, said once:</b> 19 days are too few. Magnesium is back in the evening fold of Protocols.",
    "<b>Show the days</b> opens a small sheet (trials/order); nothing reveals it by itself.",
  ],
  w:[
    {t:"head", l:"Insights"},
    {t:"sec", l:"Patterns", r:"found in your data"},
    ...INSIGHTS_PATTERNS,
    {t:"sec", l:"Ask"},
    INSIGHTS_ASK,
    INSIGHTS_TRIALS_SEC,
    {t:"tile", tone:"white", l:"Magnesium trial stopped", n:"After 19 days, too short for a result. Magnesium is back in your evening protocol.",
      chips:["Show the days"], go:["trials/order"]},
    INSIGHTS_GUIDE,
  ]});
