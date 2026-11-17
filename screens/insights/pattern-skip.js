/* Evidence for the first pattern. DEMO NUMBERS for presentations: chosen to show a clear effect, they no longer match the
   calendar / score series on protocols/item-naltrexon (which has 4 skips). Within the Insights screens everything agrees:
   Skipped Thu 17 Sep, Thu 24 Sep, Sat 3 Oct, Sat 10 Oct, Sun 25 Oct, Sat 31 Oct (6). Fatigue on the next day:
   Fri 18 Sep 8 · Fri 25 Sep 7 · Sun 4 Oct 7 · Sun 11 Oct 8 · Mon 26 Oct 8 · Sun 1 Nov 7 → 45 / 6 = 7.50.
   The other 45 days (string below) → 266 / 45 = 5.91. Difference +1.59 → "+1.6".
   Shuffle test: a gap this large in ~1 of 30 random splits → "likely", probably not chance. */
SCREENS.push({ id:"insights/pattern-skip", area:"Insights", status:"idea", title:"Pattern · after a skipped dose",
  tabs:"idea", tab:"Insights",
  why:"The evidence behind one pattern, readable without explanation: the days after a skip next to all other days, on the same 0–10 scale, each with its average; the difference big. Then the single days, one honest line about direction, and the numbers behind 'Details'.",
  concept:[
    "<b>Sentence as title:</b> under it the confidence word with one line of what it means: hint = seen a few times, could be chance · likely = holds over weeks · strong = holds and is large.",
    "<b>Comparison:</b> one dot per day, both rows on the same 0–10 scale; the bar is the average. Tap one of the six days for its date and value.",
    "<b>Honest about direction:</b> skips may happen more often on bad days, so the screen says 'goes along with'.",
    "<b>Two quiet actions:</b> Details unfolds n, both averages, the difference and the method in one sentence; Run a trial leads to a personal placebo-controlled test (not built yet).",
    "<b>Reached from</b> the Insights tab and from the Patterns section on the protocol's detail screen."
  ],
  w:[
    {t:"shead", left:"‹", l:"", right:"", goLeft:"back"},
    {t:"pattern", big:true, l:"After a skipped noon dose of Naltrexon, your fatigue was 1.6 higher the next day.", conf:"likely", n:"Seen 6 times. Probably not chance."},
    {t:"compare", l:"Fatigue", n:"the day after a skip vs. all other days", lo:"0", hi:"10",
      a:{l:"Days after a skip", v:[8,7,7,8,8,7], d:["Fri 18 Sep","Fri 25 Sep","Sun 4 Oct","Sun 11 Oct","Mon 26 Oct","Sun 1 Nov"]},
      b:{l:"Other days", v:"778767558674645565656647776467556766668665573"}},
    {t:"sec", l:"The days", r:"fatigue next day"},
    {t:"list", rows:[["Skipped Sat 31 Oct","7"],["Skipped Sun 25 Oct","8"],["Skipped Sat 10 Oct","8"],["Skipped Sat 3 Oct","7"],["Skipped Thu 24 Sep","7"],["Skipped Thu 17 Sep","8"]]},
    {t:"note", l:"This goes along with skipping, it may not be caused by it. You might skip more often on bad days."},
    {t:"more", l:"Details", act:"Run a trial",
      rows:[["Days after a skip","6"],["Other days","45"],["Average after a skip","7.5"],["Average on other days","5.9"],["Difference","+1.6"]],
      n:"Method: fatigue on the day after each skipped dose, compared with all other days of the last 8 weeks. Shuffling the days at random gives a gap this large about once in 30 times."},
  ]});
