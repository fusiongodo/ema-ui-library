/* Same phone (trials/helper-same → "Hand the phone to Sam"): Sam sets a helper PIN before the helper's pages open.
   The helper's world (neutral), no tab bar; from here on the phone shows only Sam's pages (trials/helper-welcome …). */
SCREENS.push({ id:"trials/helper-pin", area:"Insights", status:"idea", title:"Helper · PIN (same phone)",
  world:"neutral",
  why:"On a shared phone the plan is locked behind a PIN that only the helper knows. From here the phone shows the helper's pages.",
  w:[
    {t:"shead", left:"", l:"Trial helper", right:""},
    {t:"big", l:"Sam, set a PIN.", n:"Only you open the plan on this phone. Alex must not learn it."},
    {t:"field", l:"PIN", v:"• • • •"},
    {t:"field", l:"Repeat", v:"• • • •"},
    {t:"note", l:"You'll need it again for each weekly fill."},
    {t:"btn", l:"Continue", go:"trials/helper-welcome"},
  ]});
