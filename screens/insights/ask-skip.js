/* Answer to "What happens after I skip a dose?". Built analysis: days after an event (the six skipped noon doses of
   Naltrexon: Thu 17 Sep, Thu 24 Sep, Sat 3 Oct, Sat 10 Oct, Sun 25 Oct, Sat 31 Oct, as on insights/pattern-skip and the
   calendar of protocols/item-naltrexon). DEMO NUMBERS: the fatigue series is built from insights/pattern-skip (the six
   next days 8 7 7 8 8 7, the other 45 days in order, two of them swapped so today reads 6 as on Today) → 7.50 vs. 5.91, +1.6. Brain fog as on insights/ask-answer:
   next days 4.17 vs. other days 4.09 → +0.1, "barely differs". */
SCREENS.push({ id:"insights/ask-skip", area:"Insights", status:"idea", title:"Ask · after a skipped dose",
  sheet:true,
  why:"Opened from the question chip 'What happens after I skip a dose?'. Same shape as every answer: the question on top, one chart card with one sentence, then 'Pin to Insights'. It agrees with the pattern on the tab (fatigue 1.6 higher the next day) and says just as plainly where nothing shows (brain fog).",
  concept:[
    "<b>Built analysis:</b> days after an event. The chart shows the 8 weeks with a thin mark on each skipped dose; the chips switch the score.",
    "<b>Neutral wording:</b> 'goes along with', not 'because of'; the line under the card says that you might skip more often on bad days.",
    "<b>Pin to Insights</b> keeps the card on the tab (insights/home-pinned-skip)."
  ],
  w:[
    {t:"shead", left:"", l:"Ask", right:"×", goRight:"close"},
    {t:"big", l:"What happens after I skip a dose?", n:"Naltrexon · 6 skipped noon doses"},
    {t:"linemarks", from:"2026-09-14", n:"last 8 weeks · marks = skipped",
      series:[
        ["Fatigue",   "778786755867746455657656647877646755676666883655776"],
        ["Brain fog", "564444443445554343322343235542444566656654544443434"]],
      marks:["2026-09-17","2026-09-24","2026-10-03","2026-10-10","2026-10-25","2026-10-31"],
      say:"A skipped dose goes along with 1.6 higher fatigue the next day; your brain fog barely differs."},
    {t:"note", l:"Analysis: the day after each skipped dose vs. all other days, from your check-ins. It shows what goes along with a skip, not its cause: you might skip more often on bad days."},
    {t:"btn", l:"Pin to Insights", go:"insights/home-pinned-skip"},
  ]});
