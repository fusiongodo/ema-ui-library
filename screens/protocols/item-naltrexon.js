/* Sample data, all from one week grid (Mon 14 Sep … today Tue 3 Nov 2026, 51 days): 0.5 mg until 11 Oct, 1 mg from
   Mon 12 Oct; skipped 24 Sep, 10 Oct, 25 Oct, 31 Oct (4); 30 Oct 0.5 mg instead of 1 mg; today 12:10 → 47 of 51 days.
   The chart marks 12 Oct. Score series as on item-rapamycin; their last 7 days are Today's curves. */
SCREENS.push({ id:"protocols/item-naltrexon", area:"Protocols", status:"idea", title:"Protocol · Naltrexon (daily)",
  tabs:"idea", tab:"Protocols",
  why:"A daily protocol over time. Today is already taken, so nothing wants the user here: the status card stays white (PRINCIPLES 8); before noon it would be the tinted 'Not yet today · Take now'. The dose change three weeks ago is visible in the dot size and marked in the chart.",
  concept:[
    "<b>Calendar:</b> filled dot = taken (smaller = lower dose: 0.5 mg before 12 Oct), ring = planned but skipped. Tap a day: date and dose below.",
    "<b>Numbers:</b> days taken, days skipped, the dose since the last version.",
    "<b>With your scores:</b> one line at 12 Oct, 'dose changed'. Side by side only, no claim.",
    "<b>History</b> shows deviations in colour and a version line (PRINCIPLES 6): the change applied from 12 Oct, earlier days keep 0.5 mg."
  ],
  w:[
    {t:"shead", left:"‹", l:"", right:"", goLeft:"back"},
    {t:"big", l:"Naltrexon", n:"1 mg · daily · noon"},
    {t:"tile", tone:"white", l:"Taken today · 12:10", n:"1 mg · as planned"},
    {t:"sec", l:"Last 8 weeks"},
    {t:"cal", from:"2026-09-14",
      key:{x:["1 mg",1], h:["0.5 mg",.5], d:["0.5 mg instead of 1 mg",.5,false]},
      weeks:["hhhhhhh", "hhhohhh", "hhhhhhh", "hhhhhoh", "xxxxxxx", "xxxxxxo", "xxxxdox", "xx"]},
    {t:"stats", items:[["47 of 51","days taken"],["4","skipped"],["1 mg","since 12 Oct"]]},
    {t:"sec", l:"With your scores"},
    {t:"linemarks", from:"2026-09-14", n:"last 8 weeks",
      series:[
        ["Fatigue",   "677666788888677764455565565667655556545656656756456"],
        ["Brain fog", "564444443445554343322343235542443566667776564553444"],
        ["Pain",      "332222232333333433333444333343433444444433333324333"],
        ["Wellbeing", "667665555563344444546655453354566755567465655465766"]],
      marks:[["2026-10-12","dose changed"]]},
    {t:"sec", l:"History"},
    {t:"list", rows:[["Today · 12:10","1 mg"],["Mon 2 Nov","1 mg"],["Sun 1 Nov","1 mg"],["Sat 31 Oct","skipped","acc"],["Fri 30 Oct","0.5 mg instead of 1 mg","acc"],["Thu 29 Oct","1 mg"]]},
    {t:"note", l:"from 12 Oct: 1 mg (was 0.5 mg)"},
    {t:"list", rows:[["Edit","›"]], go:"protocols/plan-editor"},
    {t:"note", l:"End protocol", danger:true},
  ]});
