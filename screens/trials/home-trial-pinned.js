/* After "Pin to Insights" on trials/result. A later state of insights/home (`of`). Numbers as on trials/result. */
SCREENS.push({ id:"insights/home-trial-pinned", area:"Insights", status:"idea", title:"Insights · trial result pinned",
  tabs:"idea", tab:"Insights", sub:"3 patterns · 1 pinned", of:"insights/home",
  why:"The finding stays on the tab under 'Pinned', in the same one-sentence card as a pattern, and opens the full result. '+ Add' on the Trials heading sets up the next one.",
  concept:[
    "<b>Same card as a pattern,</b> but it says where it comes from: a blinded trial is stronger evidence than a pattern found in everyday data, and the line under it says so.",
    "<b>Not live:</b> unlike a pinned answer it does not re-run; a trial is a finished experiment.",
  ],
  w:[
    {t:"head", l:"Insights"},
    {t:"sec", l:"Patterns", r:"found in your data"},
    ...INSIGHTS_PATTERNS,
    {t:"sec", l:"Pinned"},
    {t:"pattern", src:"insights", em:"stat-before-after", l:"Your symptom score was 0.6 lower on Magnesium days.", n:"Blinded trial · 63 days", conf:"likely", go:"trials/result"},
    {t:"sec", l:"Ask"},
    INSIGHTS_ASK,
    INSIGHTS_TRIALS_SEC,
    INSIGHTS_GUIDE,
  ]});
