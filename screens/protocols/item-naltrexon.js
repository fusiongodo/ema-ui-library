/* Sample data, all from one week grid (Mon 14 Sep … today Tue 3 Nov 2026, 51 days), three doses a day (morning, noon,
   evening): 0.5 mg each until 11 Oct, 1 mg from Mon 12 Oct. Noon skipped on Thu 17 Sep, Thu 24 Sep, Sat 3 Oct, Sat 10 Oct,
   Sun 25 Oct, Sat 31 Oct (6, the same days as insights/pattern-skip); Fri 30 Oct evening 0.5 mg instead of 1 mg; today
   morning and noon (12:10) taken, evening still to come → 146 of 152 doses so far. Saturdays: noon missed 3 of 7 (the line
   under the calendar is counted from the grid). The chart marks 12 Oct. Score series as on item-rapamycin; their last
   7 days are Today's curves. */
SCREENS.push({ id:"protocols/item-naltrexon", area:"Protocols", status:"idea", title:"Protocol · Naltrexon (3 times a day)",
  tabs:"idea", tab:"Protocols",
  why:"A protocol taken several times a day, over time. Today's noon dose is already taken, so nothing wants the user here: the status card stays white (PRINCIPLES 8); when a dose is due it would be the tinted 'Noon · Take now'. Each day's dot is split into morning, noon and evening, so a missed dose shows as a hollow part of the dot. The dose change three weeks ago is visible in the dot size and marked in the chart.",
  concept:[
    "<b>Calendar:</b> one dot per day, split into its three doses (morning · noon · evening, left to right). All taken = a full dot; a skipped dose = a hollow segment; smaller = lower dose (0.5 mg before 12 Oct). A short dashed line before 12 Oct marks the dose change ('dose changed' in the legend), the same mark as in the chart, so the bigger dots from that row on read as the new dose, not as a glitch. Tap a day: every dose in one line ('Sat 31 Oct · morning ✓ · noon skipped · evening ✓').",
    "<b>One line under it</b> names a gap that repeats on the same weekday ('Noon dose missed on 3 of 7 Saturdays'), counted from the calendar; it only appears from three misses on.",
    "<b>Numbers:</b> doses taken, doses skipped, the dose since the last version.",
    "<b>Patterns:</b> what the app found around this protocol's events (skips, dose changes), one sentence each, the same card as on the Insights tab. Tap opens the evidence (insights/pattern-skip). The six skipped noon doses are the same days there; its numbers (fatigue, pain and brain fog the same evening, e.g. fatigue 7.5 vs. 5.9) are demo numbers, not from the score series below.",
    "<b>With your scores:</b> one line at 12 Oct, 'dose changed'. Side by side only, no claim.",
    "<b>History</b> shows deviations in colour and a version line (PRINCIPLES 6): the change applied from 12 Oct, earlier days keep 0.5 mg."
  ],
  w:[
    {t:"shead", left:"‹", l:"", right:"", goLeft:"back"},
    {t:"big", l:"Naltrexon", n:"1 mg · morning, noon, evening"},
    {t:"tile", tone:"white", l:"Taken today · 12:10", n:"Morning and noon · evening next"},
    {t:"sec", l:"Last 8 weeks"},
    {t:"cal", from:"2026-09-14", doses:["morning","noon","evening"], gap:true, change:[["2026-10-12","now 1 mg (was 0.5 mg)"]],
      key:{x:["1 mg",1], h:["0.5 mg",.5], d:["0.5 mg",.5,false]},
      weeks:[
        "hhh hhh hhh hoh hhh hhh hhh",
        "hhh hhh hhh hoh hhh hhh hhh",
        "hhh hhh hhh hhh hhh hoh hhh",
        "hhh hhh hhh hhh hhh hoh hhh",
        "xxx xxx xxx xxx xxx xxx xxx",
        "xxx xxx xxx xxx xxx xxx xox",
        "xxx xxx xxx xxx xxd xox xxx",
        "xxx xx-"]},
    {t:"stats", items:[["146 of 152","doses taken"],["6","noon doses skipped"],["1 mg","since 12 Oct"]]},
    {t:"sec", l:"Patterns"},
    {t:"pattern", src:"protocols", em:"stat-earlier-later", l:"After a skipped noon dose of Naltrexon, your fatigue, pain and brain fog were worse the same evening.", n:"Seen 6 times", conf:"likely", go:"insights/pattern-skip"},   // as insights/home (INSIGHTS_PATTERNS[0])
    {t:"sec", l:"With your scores"},
    {t:"linemarks", from:"2026-09-14", n:"last 8 weeks",
      series:[
        ["Fatigue",   "677666788888677764455565565667655556545656656756456"],
        ["Brain fog", "564444443445554343322343235542443566667776564553444"],
        ["Pain",      "332222232333333433333444333343433444444433333324333"],
        ["Wellbeing", "667665555563344444546655453354566755567465655465766"]],
      marks:[["2026-10-12","dose changed"]]},
    {t:"sec", l:"History"},
    {t:"list", rows:[["Today","2 of 3 · 1 mg"],["Mon 2 Nov","3 × 1 mg"],["Sun 1 Nov","3 × 1 mg"],["Sat 31 Oct · noon","skipped","acc"],["Fri 30 Oct · evening","0.5 mg instead of 1 mg","acc"],["Thu 29 Oct","3 × 1 mg"]]},
    {t:"note", l:"from 12 Oct: 1 mg (was 0.5 mg)"},
    {t:"list", rows:[["Edit","›"]], go:"protocols/plan-editor"},
    {t:"note", l:"End protocol", danger:true},
  ]});
