/* After "Pin to Insights" on insights/ask-weeks: that answer as a widget on the tab. Same data as insights/ask-weeks. */
SCREENS.push({ id:"insights/home-pinned-weeks", area:"Insights", status:"idea", title:"Insights · pinned: the last two weeks",
  tabs:"idea", tab:"Insights", sub:"3 patterns · 1 pinned",
  why:"The same tab after the answer about the last two weeks was pinned (as insights/home-pinned for the dose change). Pinned, it always compares the latest two weeks with the two before.",
  w:[
    {t:"head", l:"Insights"},
    {t:"sec", l:"Patterns", r:"found in your data"},
    ...INSIGHTS_PATTERNS,
    {t:"sec", l:"Pinned"},
    {t:"linemarks", from:"2026-10-07", q:"How were my last two weeks?", n:"averages: two weeks before / last two",
      series:[
        ["Fatigue",   "5565657554555544655655755456"],
        ["Brain fog", "3235542444566656654544443434"]],
      avg:["2026-10-21"]},
    {t:"sec", l:"Ask"},
    INSIGHTS_ASK,
    INSIGHTS_TRIALS_SEC,
    INSIGHTS_TRIALS,
  ]});
