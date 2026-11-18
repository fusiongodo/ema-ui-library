/* Answer to "What happens after I skip a dose?". Built analysis: the evening of an event vs. all other evenings (the six
   skipped noon doses of Naltrexon: Thu 17 Sep, Thu 24 Sep, Sat 3 Oct, Sat 10 Oct, Sun 25 Oct, Sat 31 Oct, as on
   insights/pattern-skip and the calendar of protocols/item-naltrexon). DEMO NUMBERS: each series is built from
   insights/pattern-skip (SKIP_SCORES): on the six skip days the six evening values there, on the other 45 days that
   score's string in order. So the chart and the evidence screen agree: fatigue 7.5 vs. 5.9 (+1.6), pain 4.0 vs. 3.1 (+0.9),
   brain fog 4.7 vs. 4.0 (+0.7). Fatigue is the earlier skip series with each skip day and the day after swapped; brain fog
   is the series of insights/ask-answer with values moved onto the skip days, mostly within the same weeks, so its before /
   since 1 mg averages stay close to those there. Today reads as on Today. */
const SKIP_SERIES = [
  ["Fatigue",   "778876755876746455675656648777646755676668683657576"],
  ["Pain",      "332512132443323133233455325443432444455434343323323"],
  ["Brain fog", "564444443454554343362343235242444556656654444444334"]];
const SKIP_MARKS = ["2026-09-17","2026-09-24","2026-10-03","2026-10-10","2026-10-25","2026-10-31"];
SCREENS.push({ id:"insights/ask-skip", area:"Insights", status:"idea", title:"Ask · after a skipped dose",
  sheet:true,
  why:"Opened from the question chip 'What happens after I skip a dose?'. Same shape as every answer: the question on top, one chart card with one sentence, then 'Pin to Insights'. It tells the same story as the pattern on the tab: on the evening of a skipped noon dose fatigue, pain and brain fog were higher, with the same numbers as the evidence screen.",
  concept:[
    "<b>Built analysis:</b> the evening of an event vs. all other evenings. The chart shows the 8 weeks with a thin mark on each skipped dose; the peaks sit on the marks. The chips switch the score.",
    "<b>Neutral wording:</b> 'goes along with', not 'because of'; the line under the card says that you might skip more often on bad days.",
    "<b>Pin to Insights</b> keeps the card on the tab (insights/home-pinned-skip)."
  ],
  w:[
    {t:"shead", left:"", l:"Ask", right:"×", goRight:"close"},
    {t:"big", l:"What happens after I skip a dose?", n:"Naltrexon · 6 skipped noon doses"},
    {t:"linemarks", from:"2026-09-14", n:"last 8 weeks · marks = skipped", series:SKIP_SERIES, marks:SKIP_MARKS,
      say:"On the evening of a skipped noon dose your fatigue was 1.6 higher, your pain 0.9 and your brain fog 0.7 higher than on other evenings."},
    {t:"note", l:"Analysis: the evening of each skipped dose vs. all other evenings, from your check-ins. It shows what goes along with a skip, not its cause: you might skip more often on bad days."},
    {t:"btn", l:"Pin to Insights", go:"insights/home-pinned-skip"},
  ]});
