/* Evidence for the first pattern, three scores. DEMO NUMBERS for presentations: chosen to show a clear effect, they no
   longer match the score series on protocols/item-naltrexon (its calendar has the same six skipped noon doses). Within the
   Insights screens everything agrees (insights/ask-skip draws the same values day by day: the six skip days and, in order,
   the other 45 days of each string below).
   Skipped noon doses: Thu 17 Sep, Thu 24 Sep, Sat 3 Oct, Sat 10 Oct, Sun 25 Oct, Sat 31 Oct (6). The evening check-in of
   the same day vs. the evenings of the other 45 days:
     Fatigue    8 7 7 8 8 7 → 45 / 6 = 7.50 · others 266 / 45 = 5.91 → +1.59 "+1.6" · shuffle test ~1 in 30
     Pain       5 4 3 5 4 3 → 24 / 6 = 4.00 · others 139 / 45 = 3.09 → +0.91 "+0.9" · ~1 in 25
     Brain fog  4 5 6 5 4 4 → 28 / 6 = 4.67 · others 180 / 45 = 4.00 → +0.67 "+0.7" · ~1 in 20
   → "likely", probably not chance. Fatigue is the default state; the other two are states of this page
   (insights/pattern-skip-pain, -fog, of:"insights/pattern-skip"); the segment swaps them in place. */
const SKIP_DAYS = ["Thu 17 Sep","Thu 24 Sep","Sat 3 Oct","Sat 10 Oct","Sun 25 Oct","Sat 31 Oct"];
const SKIP_SCORES = {
  "Fatigue":   {id:"insights/pattern-skip",      a:[8,7,7,8,8,7], b:"778767558674645565656647776467556766668365576", avg:["7.5","5.9"], d:"+1.6", shuffle:"about once in 30 times"},
  "Pain":      {id:"insights/pattern-skip-pain", a:[5,4,3,5,4,3], b:"332121324332313323455324434324444554334332323", avg:["4.0","3.1"], d:"+0.9", shuffle:"about once in 25 times"},
  "Brain fog": {id:"insights/pattern-skip-fog",  a:[4,5,6,5,4,4], b:"564444434455434332343232424445566566544444334", avg:["4.7","4.0"], d:"+0.7", shuffle:"about once in 20 times"},
};
const SKIP_PATTERN = "After a skipped noon dose of Naltrexon, your fatigue, pain and brain fog were worse the same evening.";
/* one state of the evidence screen: the same page, the comparison for score `on` */
function skipEvidence(on){
  const names = Object.keys(SKIP_SCORES), S = SKIP_SCORES[on];
  return [
    {t:"shead", left:"‹", l:"", right:"", goLeft:"back"},
    {t:"pattern", big:true, l:SKIP_PATTERN, conf:"likely", n:"Seen 6 times. Probably not chance."},
    {t:"seg", items:names, on, go:names.map(k=>k === on ? null : SKIP_SCORES[k].id)},
    {t:"compare", l:on, n:"the same evening after a skip vs. other evenings", tap:"Tap one of the 6 evenings",
      a:{l:"Evenings after a skip", v:S.a, d:SKIP_DAYS.map(d=>`${d} · noon skipped`)},
      b:{l:"Other evenings", v:S.b}},
    {t:"note", l:"This goes along with skipping, it may not be caused by it. You might skip more often on bad days."},
    {t:"more", l:"Details", act:"Run a trial", goAct:"trials/intro",
      rows:[["Evenings after a skip","6"],["Other evenings","45"],["Average after a skip",S.avg[0]],["Average on other evenings",S.avg[1]],["Difference",S.d]],
      n:`Method: ${on.toLowerCase()} in the evening check-in on the day of each skipped noon dose, compared with the evening check-ins of all other days of the last 8 weeks. Shuffling the days at random gives a gap this large ${S.shuffle}.`},
  ];
}
const SKIP_CONCEPT = [
  "<b>Sentence as title:</b> what happened, in words; under it the confidence word with one line of what it means: hint = seen a few times, could be chance · likely = holds over weeks · strong = holds and is large.",
  "<b>Three scores, one card:</b> the segment switches between fatigue, pain and brain fog; each shows the same comparison. Fatigue first, the largest difference.",
  "<b>Comparison:</b> one dot per evening, both rows on the same 0–10 scale; the bar is the average. Tap one of the six evenings for its date and value ('Sat 31 Oct · noon skipped · fatigue 7'), so the single days need no list of their own.",
  "<b>Honest about direction:</b> skips may happen more often on bad days, so the screen says 'goes along with'.",
  "<b>Two quiet actions:</b> Details unfolds n, both averages, the difference and the method in one sentence; Run a trial leads to a personal placebo-controlled test (trials/intro).",
  "<b>Reached from</b> the Insights tab and from the Patterns section on the protocol's detail screen."
];
SCREENS.push({ id:"insights/pattern-skip", area:"Insights", status:"idea", title:"Pattern · after a skipped dose (fatigue)",
  tabs:"idea", tab:"Insights",
  why:"The evidence behind one pattern, readable without explanation: the evenings after a skipped noon dose next to all other evenings, on the same 0–10 scale, each with its average; the difference big. Three scores went up together, so a segment switches between them. Then one honest line about direction, and the numbers behind 'Details'.",
  concept: SKIP_CONCEPT,
  w: skipEvidence("Fatigue")});
