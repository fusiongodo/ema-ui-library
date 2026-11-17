/* Answer to "How were my last two weeks?". Built analysis: last weeks vs. the weeks before. Last two weeks = Wed 21 Oct
   … Tue 3 Nov (14 days), the two before = Wed 7 Oct … Tue 20 Oct. Series = the last 28 days of insights/ask-answer
   (same demo series). Fatigue 5.21 → 5.14, brain fog 4.21 → 4.36: both well under half a point → "no clear change". */
SCREENS.push({ id:"insights/ask-weeks", area:"Insights", status:"idea", title:"Ask · the last two weeks",
  sheet:true,
  why:"Opened from the question chip 'How were my last two weeks?'. The honest answer when nothing stands out: the last two weeks next to the two before, a flat line for each average, and one sentence that says there is no clear change.",
  concept:[
    "<b>Built analysis:</b> last weeks vs. the weeks before. The chart shows four weeks, split where the last two begin; the chips switch the score, the averages follow.",
    "<b>No clear pattern is an answer too:</b> differences under half a point are within the usual ups and downs, so the sentence says so instead of reading meaning into them.",
    "<b>Pin to Insights</b> keeps the card on the tab (insights/home-pinned-weeks); pinned, it always shows the latest two weeks."
  ],
  w:[
    {t:"shead", left:"", l:"Ask", right:"×", goRight:"close"},
    {t:"big", l:"How were my last two weeks?", n:"21 Oct – 3 Nov vs. the two weeks before"},
    {t:"linemarks", from:"2026-10-07", n:"last 4 weeks",
      series:[
        ["Fatigue",   "5565657554555544655655755456"],
        ["Brain fog", "3235542444566656654544443434"]],
      avg:["2026-10-21"],
      say:"No clear change from the two weeks before: fatigue 5.1 (was 5.2), brain fog 4.4 (was 4.2)."},
    {t:"note", l:"Analysis: the last two weeks vs. the two weeks before, from your check-ins. Differences under half a point are within your usual ups and downs."},
    {t:"btn", l:"Pin to Insights", go:"insights/home-pinned-weeks"},
  ]});
