/* Insights right after connecting Apple Health. Patterns, still three, strongest first: the new exertion pattern
   (insights/pattern-exertion), the Naltrexon skip, the Rapamycin evaluation; the dose-change pattern drops out (at most three). */
SCREENS.push({ id:"insights/home-health-on", area:"Insights", status:"idea", title:"Insights · Apple Health connected",
  tabs:"idea", tab:"Insights", sub:"3 patterns · Apple Health connected", of:"insights/home", tabto:HEALTH_TABTO,
  why:"The payoff comes at once: Apple Health has history, so a pattern that needs the tracker is there right after connecting. A quiet note under the patterns leads to the measures in Check-ins.",
  concept:[
    "<b>The payoff comes at once:</b> Health has history, so the crash pattern is there right after connecting.",
    "<b>One model reads everything that is tracked;</b> there is no Apple Health detector of its own.",
    "<b>The measures themselves live in Check-ins</b> (the note leads there).",
    "<b>Still at most three patterns:</b> the dose-change pattern drops out.",
  ],
  w:[
    {t:"head", l:"Insights"},
    {t:"sec", l:"Patterns", r:"found in your data"},
    {t:"pattern", src:"checkins", l:"After a day with more steps than your usual, you were worse for two days.", n:"Seen 7 times", conf:"likely", go:"insights/pattern-exertion"},
    INSIGHTS_PATTERNS[0],
    INSIGHTS_PATTERNS[2],
    {t:"list", rows:[["Apple Health connected · 4 measures","›"]], go:"checkins/overview-health"},
    {t:"sec", l:"Ask"},
    INSIGHTS_ASK,
    INSIGHTS_TRIALS_SEC,
    INSIGHTS_TRIALS,
    INSIGHTS_GUIDE,
  ]});
