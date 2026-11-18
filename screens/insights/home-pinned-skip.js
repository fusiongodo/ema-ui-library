/* After "Pin to Insights" on insights/ask-skip: that answer as a widget on the tab. Same data as insights/ask-skip. */
SCREENS.push({ id:"insights/home-pinned-skip", area:"Insights", status:"idea", title:"Insights · pinned: after a skipped dose",
  tabs:"idea", tab:"Insights", sub:"3 patterns · 1 pinned",
  why:"The same tab after the answer about skipped doses was pinned (as insights/home-pinned for the dose change). The chart sits under 'Pinned', after the patterns, and updates with new check-ins.",
  w:[
    {t:"head", l:"Insights"},
    {t:"sec", l:"Patterns", r:"found in your data"},
    ...INSIGHTS_PATTERNS,
    {t:"sec", l:"Pinned"},
    {t:"linemarks", from:"2026-09-14", q:"What happens after I skip a dose?", n:"marks = skipped",
      series:SKIP_SERIES, marks:SKIP_MARKS},
    {t:"sec", l:"Ask"},
    INSIGHTS_ASK,
    {t:"sec", l:"Trials"},
    INSIGHTS_TRIALS,
  ]});
