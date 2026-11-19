/* Helper · 6: the end of a fill. With the organizer the plan closes again until the next week is due. */
SCREENS.push({ id:"trials/helper-done", area:"Insights", status:"idea", title:"Helper · 6 Done",
  world:"neutral",
  why:"The end of the helper's part for this week. The plan closes on this phone and opens again only when the next week is due, so nothing is left to give away by accident.",
  concept:[
    "<b>Closed in between:</b> with the organizer the plan stays closed between fills and opens again, one week only, when the next week is due (a reminder before each Monday).",
    "<b>Locked for good at the end:</b> after week 9 the plan locks for the helper too; with numbered bags it locks right after the one session. It lives only in the app, sealed until the result.",
    "<b>Emergency:</b> if Alex has to know (a side effect), Alex's app can reveal what a day held; Sam does not need to remember anything.",
    "<b>Same phone:</b> the last line locks the helper's pages and returns the phone to the person's setup.",
  ],
  w:[
    {t:"shead", left:"", l:"Trial helper", right:""},
    {t:"spacer"},
    {t:"big", l:"Hand over the organizer.", n:"Week 1 is ready. Thank you, Sam."},
    {t:"list", rows:[["Next fill","Sun 15 Nov · week 2 of 9"]]},
    {t:"note", l:"We'll remind you. If Alex ever needs to know a day, the app can show it. You don't have to remember anything."},
    {t:"spacer"},
    {t:"note", l:"On Alex's phone? Lock it and hand it back ›", go:"trials/review", peek:false},   // peek:false: not in the preview (trialPeek)
  ]});
