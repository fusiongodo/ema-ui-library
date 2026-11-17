/* Sample data, all from one week grid (Mon 14 Sep … today Tue 3 Nov 2026): taken 19 Sep, 29 Sep, 6 Oct (4 mg), 16 Oct,
   25 Oct → 5×, gaps 10 · 7 · 10 · 9 days = 9 on average, last 9 days ago. The chart marks the same five days.
   The score series are the same as on item-naltrexon (one person, one set of scores); their last 7 days are Today's curves. */
SCREENS.push({ id:"protocols/item-rapamycin", area:"Protocols", status:"idea", title:"Protocol · Rapamycin (as needed)",
  tabs:"idea", tab:"Protocols",
  why:"One protocol over time: when it was taken and how much, at a glance. As needed, so the one action is 'Take now'. The score chart only puts the scores next to the intake days; it makes no claim about an effect.",
  concept:[
    "<b>Calendar:</b> 8 weeks, Monday to Sunday, newest week at the bottom. A filled dot = taken, its size = dose relative to the usual one; small pale dot = no intake. Tap a day: date and dose below.",
    "<b>Three numbers</b> instead of a table: how often, how far apart, how much.",
    "<b>With your scores:</b> the same 8 weeks, one score at a time (chips), thin marks on intake days. Neutral wording: side by side, no 'helps' or 'works'.",
    "<b>History</b> lists intakes, deviations marked ('4 mg instead of 6 mg'). One version only, so no version line (PRINCIPLES 6 starts with the second)."
  ],
  w:[
    {t:"shead", left:"‹", l:"", right:"", goLeft:"back"},
    {t:"big", l:"Rapamycin", n:"6 mg · as needed · last taken 9 days ago"},
    {t:"tile", tone:"lilac", cta:true, l:"Take now", n:"6 mg"},
    {t:"sec", l:"Last 8 weeks"},
    {t:"cal", from:"2026-09-14", idle:"no intake",
      key:{x:["6 mg",1], s:["4 mg instead of 6 mg",.67,"4 mg"]},
      weeks:[".....x.", ".......", ".x.....", ".s.....", "....x..", "......x", ".......", ".."]},
    {t:"stats", items:[["5×","in 8 weeks"],["9 days","apart on average"],["6 mg","usual dose"]]},
    {t:"sec", l:"With your scores"},
    {t:"linemarks", from:"2026-09-14", n:"last 8 weeks · marks = intake",
      series:[
        ["Fatigue",   "677666788888677764455565565667655556545656656756456"],
        ["Brain fog", "564444443445554343322343235542443566667776564553444"],
        ["Pain",      "332222232333333433333444333343433444444433333324333"],
        ["Wellbeing", "667665555563344444546655453354566755567465655465766"]],
      marks:["2026-09-19","2026-09-29","2026-10-06","2026-10-16","2026-10-25"]},
    {t:"sec", l:"History"},
    {t:"list", rows:[["Sun 25 Oct","6 mg"],["Fri 16 Oct","6 mg"],["Tue 6 Oct","4 mg instead of 6 mg","acc"],["Tue 29 Sep","6 mg"],["Sat 19 Sep","6 mg"]]},
    {t:"list", rows:[["Edit","›"]], go:"protocols/plan-editor"},
    {t:"note", l:"End protocol", danger:true},
  ]});
