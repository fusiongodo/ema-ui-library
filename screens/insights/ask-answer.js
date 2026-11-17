/* Answer to "Did the dose change help?". Built analysis: before / after a change (Naltrexon 0.5 → 1 mg on 12 Oct).
   Fatigue 6.21 (14 Sep–11 Oct, 28 days) → 5.13 (12 Oct–3 Nov, 23 days): 1.1 lower.
   Brain fog 3.82 → 4.91: 1.1 higher. DEMO NUMBERS: the fatigue series is lowered after 12 Oct for a clearer effect and
   no longer matches protocols/item-naltrexon; brain fog is as there. Same series on insights/home-pinned. */
SCREENS.push({ id:"insights/ask-answer", area:"Insights", status:"idea", title:"Ask · one answer",
  sheet:true,
  why:"Opened from a question chip under Ask. The question on top, the answer as one chart card with one sentence, then 'Pin to Insights'. The answer is honest when it is mixed: fatigue went down, brain fog went up.",
  concept:[
    "<b>The agent picks, the functions count.</b> The question maps to one built analysis ('before / after a change'); the language model only chooses it and words the sentence. Every number on the card comes from that function.",
    "<b>One card:</b> the chart (8 weeks, the change marked, a flat line for the average before and since) and one sentence. The chips switch the score, the averages follow.",
    "<b>Neutral wording:</b> 'goes along with', not 'because of'. The small line under the card says which analysis was used.",
    "<b>Pin to Insights</b> keeps the card as a widget on the Insights tab (insights/home-pinned).",
  ],
  w:[
    {t:"shead", left:"", l:"Ask", right:"×", goRight:"close"},
    {t:"big", l:"Did the dose change help?", n:"Naltrexon · 0.5 → 1 mg on 12 Oct"},
    {t:"linemarks", from:"2026-09-14", n:"last 8 weeks",
      series:[
        ["Fatigue",   "677666788888677764455565565657554555544655655755456"],
        ["Brain fog", "564444443445554343322343235542443566667776564553444"]],
      marks:[["2026-10-12","1 mg"]], avg:["2026-10-12"],
      say:"Since 1 mg your fatigue is 1.1 lower, but your brain fog is 1.1 higher."},
    {t:"note", l:"Analysis: before vs. since a change, from your check-ins. It shows what goes along with the change, not its cause."},
    {t:"btn", l:"Pin to Insights", go:"insights/home-pinned"},
  ]});
