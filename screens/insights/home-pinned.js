/* After "Pin to Insights" on insights/ask-answer: the answer is a widget on the page. Same data as insights/home. */
SCREENS.push({ id:"insights/home-pinned", area:"Insights", status:"idea", title:"Insights · with a pinned answer",
  tabs:"idea", tab:"Insights", sub:"3 patterns · 1 pinned",
  why:"The same tab after one answer was pinned. The chart sits under 'Pinned', right after the patterns, and updates with new check-ins. The page now holds what this user cares about.",
  concept:[
    "<b>Pinned answers are live:</b> the widget re-runs its built analysis every day; the question stays as its title.",
    "<b>Order:</b> Patterns (found by the app) → Pinned (chosen by the user) → Ask → Trials. Unpin and reorder by a long press (not drawn).",
  ],
  w:[
    {t:"head", l:"Insights"},
    {t:"sec", l:"Patterns", r:"found in your data"},
    ...INSIGHTS_PATTERNS,
    {t:"sec", l:"Pinned"},
    {t:"linemarks", from:"2026-09-14", q:"Did the dose change help?", n:"averages before / since 1 mg",
      series:[
        ["Fatigue",   "677666788888677764455565565657554555544655655755456"],
        ["Brain fog", "564444443445554343322343235542444566656654544443434"]],
      marks:[["2026-10-12","1 mg"]], avg:["2026-10-12"]},
    {t:"sec", l:"Ask"},
    INSIGHTS_ASK,
    {t:"sec", l:"Trials"},
    INSIGHTS_TRIALS,
  ]});
