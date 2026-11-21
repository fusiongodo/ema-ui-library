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
    INSIGHTS_PATTERNS_SEC,
    {t:"pattern", src:"checkins", em:"stat-earlier-later", l:"After a day with more steps than your usual, you were worse for two days.", n:"Seen 7 times", conf:"likely", go:"insights/pattern-exertion",
      /* Studio's data strip (stat: screens/insights/home.js): fatigue 7.2 in the two days after vs. 5.9 (insights/pattern-exertion) */
      stat:{num:"+1.3", lab:"Fatigue · 2 days after", n:"n = 7 active days · 14 vs 30",
        chart:{t:"above", dom:[4.5, 8.4], usual:[5.4, 5.9, 6.4], v:[6.9, 7.6, 7.0, 7.4, 6.8, 7.5, 7.2]}}},
    INSIGHTS_PATTERNS[0],
    INSIGHTS_PATTERNS[2],
    {t:"list", rows:[["Apple Health connected · 4 measures","›"]], go:"checkins/overview-health"},
    {t:"sec", l:"Ask"},
    INSIGHTS_ASK,
    INSIGHTS_TRIALS_SEC,
    INSIGHTS_TRIALS,
    INSIGHTS_GUIDE,
  ]});
