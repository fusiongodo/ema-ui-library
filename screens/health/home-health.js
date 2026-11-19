/* Apple Health (idea). Every value is shown against the person's own usual (the middle half of the last four weeks), never
   against a goal; only a deviation gets a mark; not worn = no data, never zero. One model over all data: a pattern lists
   what was different in the check-ins and in the tracker data side by side. Today is the reception: at most one quiet line.
   Demo date Tue 3 Nov 2026, afternoon (as on today/home). Steps today so far 3,420; usual 1,800 to 2,800 a day.
   Shared by the Apple Health screens (screens/health/*):
   · HEALTH_TABTO: after connecting, the tabs lead to the states with Apple Health.
   · HEALTH_STEPS: 28 days of steps, 7 Oct … today 3 Nov (index 0 = 7 Oct). No data on 15 Oct and 27 Oct (watch not worn).
     Above the usual: 9, 18, 24, 30 Oct (the days of the pattern in insights/pattern-exertion inside these four weeks)
     and today. */
const HEALTH_TABTO = {"Check-ins":"checkins/overview-health", Today:"today/home-health", Insights:"insights/home-health-on"};
const HEALTH_STEPS = [2400,2650,4100,1500,1700,2300,2600,2800,null,2500,2700,3900,1600,1400,2200,2450,2750,4300,1800,1500,null,2300,2600,3800,1700,1900,2500,3420];

SCREENS.push({ id:"insights/home-health", area:"Insights", status:"idea", title:"Insights · Apple Health offered",
  tabs:"idea", tab:"Insights", sub:"3 patterns · connect offered", of:"insights/home",
  why:"The Insights tab as it is, with one more white card under the patterns: Apple Health is offered once, at the moment it first helps. Nothing to log.",
  concept:[
    "<b>Offered once,</b> at the moment it first helps, not in onboarding.",
    "<b>White, not tinted:</b> nothing is demanded (PRINCIPLES 8).",
    "<b>'Not now'</b> removes the card; it comes back in the Check-ins settings (not drawn).",
  ],
  w:[
    {t:"head", l:"Insights"},
    {t:"sec", l:"Patterns", r:"found in your data"},
    ...INSIGHTS_PATTERNS,
    {t:"tile", tone:"white", l:"Your tracker already knows more", n:"Steps, sleep and heart rate from Apple Health can show what comes before a bad day. Nothing to log.",
      chips:["Connect Apple Health","Not now"], go:["health/connect","insights/home"]},
    {t:"sec", l:"Ask"},
    INSIGHTS_ASK,
    INSIGHTS_TRIALS_SEC,
    INSIGHTS_TRIALS,
    INSIGHTS_GUIDE,
  ]});
