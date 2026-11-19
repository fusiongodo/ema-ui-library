/* Picker for "Placebo filling" on trials/helper-setup (pattern: trials/pick-block). */
SCREENS.push({ id:"trials/helper-pick-control", area:"Insights", status:"idea", title:"Helper · Placebo filling",
  sheet:"half", world:"neutral",
  why:"The control substance. It must be harmless for this person and do nothing; asking the person about it does not break the blind, because it says nothing about which day is which.",
  w:[
    {t:"shead", left:"", l:"What goes into the placebo?", right:"×", goRight:"back"},
    {t:"list", rows:[["Rice flour","✓"],["Cellulose",""],["Glucose",""],["Something else …",""]], go:["back","back","back","back"]},
    {t:"note", l:"Something Alex tolerates and that does nothing. Ask Alex if unsure: it gives nothing away."},
  ]});
