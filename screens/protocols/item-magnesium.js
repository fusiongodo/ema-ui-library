/* Sample data, all from one week grid (Mon 14 Sep … today Tue 3 Nov 2026, 51 days), once a day in the evening:
   skipped Sat 26 Sep, Fri 16 Oct, Wed 28 Oct (3); tonight still to come → 47 of 50 evenings so far. No weekday repeats,
   so the calendar names no gap. The 14-day strip on protocols/all shows the same skip on 28 Oct. Score series as on
   item-naltrexon and item-rapamycin (one person, one set of scores); the chart marks the three skipped evenings. */
SCREENS.push({ id:"protocols/item-magnesium", area:"Protocols", status:"idea", title:"Protocol · Magnesium (evening)",
  tabs:"idea", tab:"Protocols",
  why:"A plain once-a-day protocol over time, the same shape as Rapamycin. Tonight's dose is still to come, so nothing wants the user here: the status card stays white (PRINCIPLES 8). One quiet extra at the end: 'Test this' starts a personal trial for this protocol (trials/intro).",
  concept:[
    "<b>Calendar:</b> one dot per evening, taken = filled, skipped = ring, tonight = faint until it is taken. Tap a day: date and dose below.",
    "<b>Three numbers:</b> evenings taken, skipped, the dose.",
    "<b>With your scores:</b> the same 8 weeks, one score at a time; thin marks on the skipped evenings. Side by side only, no claim.",
    "<b>Test this</b> is the door into a trial from the protocol itself, next to Edit, quiet: nothing here asks for it."
  ],
  w:[
    {t:"shead", left:"‹", l:"", right:"", goLeft:"back"},
    {t:"big", l:"Magnesium", n:"300 mg · evening"},
    {t:"tile", tone:"white", l:"Due this evening", n:"300 mg"},
    {t:"sec", l:"Last 8 weeks"},
    {t:"cal", from:"2026-09-14", gap:true,
      key:{x:["300 mg",1]},
      weeks:["xxxxxxx", "xxxxxox", "xxxxxxx", "xxxxxxx", "xxxxoxx", "xxxxxxx", "xxoxxxx", "x-"]},
    {t:"stats", items:[["47 of 50","evenings taken"],["3","skipped"],["300 mg","each evening"]]},
    {t:"sec", l:"With your scores"},
    {t:"linemarks", from:"2026-09-14", n:"last 8 weeks · marks = skipped",
      series:[
        ["Fatigue",   "677666788888677764455565565667655556545656656756456"],
        ["Brain fog", "564444443445554343322343235542443566667776564553444"],
        ["Pain",      "332222232333333433333444333343433444444433333324333"],
        ["Wellbeing", "667665555563344444546655453354566755567465655465766"]],
      marks:["2026-09-26","2026-10-16","2026-10-28"]},
    {t:"sec", l:"History"},
    {t:"list", rows:[["Mon 2 Nov","300 mg"],["Sun 1 Nov","300 mg"],["Sat 31 Oct","300 mg"],["Fri 30 Oct","300 mg"],["Thu 29 Oct","300 mg"],["Wed 28 Oct","skipped","acc"]]},
    {t:"list", rows:[["Test this","›"],["Edit","›"]], go:["trials/intro","protocols/plan-editor"]},
    {t:"note", l:"End protocol", danger:true},
  ]});
