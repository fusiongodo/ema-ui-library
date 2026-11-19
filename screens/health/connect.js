/* Connect Apple Health: one sheet, four measures, all ticked. Opened from the Apple Health card on insights/home. */
SCREENS.push({ id:"health/connect", area:"Insights", status:"idea", title:"Apple Health · connect",
  sheet:true,
  why:"One sheet: what the app may read, what it is used for, where it stays. Four measures, all ticked by default; Continue hands over to Apple's own permission sheet.",
  concept:[
    "<b>One sheet, four measures,</b> all ticked by default.",
    "<b>After 'Continue'</b> Apple shows its own permission sheet (not drawn).",
    "<b>Past data comes in at once,</b> so the first pattern can appear right away.",
    "<b>Garmin, Oura and others</b> arrive through Apple Health without extra work.",
  ],
  w:[
    {t:"shead", left:"", l:"Apple Health", right:"×", goRight:"back"},
    {t:"big", l:"What may MEjority read?"},
    {t:"list", rows:[["Steps","✓"],["Sleep","✓"],["Resting heart rate","✓"],["Heart rate variability","✓"]]},
    {t:"note", l:"Used to show your usual and to find patterns. No goals, no rings."},
    {t:"note", l:"Only what is ticked is read. It stays on this phone."},
    {t:"btn", l:"Continue", go:"insights/home-health-on"},
  ]});
