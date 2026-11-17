/* After "Stop the trial" in week 3. A later state of insights/home (`of`). */
SCREENS.push({ id:"insights/home-stopped", area:"Insights", status:"idea", title:"Insights · trial stopped",
  tabs:"idea", tab:"Insights", sub:"3 patterns", of:"insights/home",
  why:"What is left after stopping early: one white card that says so, the order only on request, and the way to start a new trial.",
  concept:[
    "<b>No result, said once:</b> 3 weeks are too few. Magnesium is back in the evening fold of Protocols.",
    "<b>Show the order</b> opens a small sheet (trials/order); nothing reveals it by itself.",
  ],
  w:[
    {t:"head", l:"Insights"},
    {t:"sec", l:"Patterns", r:"found in your data"},
    ...INSIGHTS_PATTERNS,
    {t:"sec", l:"Ask"},
    INSIGHTS_ASK,
    {t:"sec", l:"Trials"},
    {t:"tile", tone:"white", l:"Magnesium trial stopped", n:"After 3 weeks, too short for a result. Magnesium is back in your evening protocol.",
      chips:["Show the order","Start a trial"], go:["trials/order","trials/intro"]},
  ]});
