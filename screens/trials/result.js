/* Result after week 8, opened Mon 4 Jan. DEMO NUMBERS, consistent across the trial screens:
   Order B A A B A B B A → Magnesium weeks 2, 3, 5, 8; placebo weeks 1, 4, 6, 7.
   Fatigue, week averages of days 3–7 (days 1–2 not counted):
     Magnesium: w2 5.6 · w3 4.6 · w5 5.4 · w8 4.8 → 5.1      Placebo: w1 6.6 · w4 5.8 · w6 6.8 · w7 6.0 → 6.3
     Difference −1.2. Per pair (Magnesium − placebo): −1.0, −1.2, −1.4, −1.2 → lower in all 4 pairs.
   Randomization test: swapping A and B within pairs gives 2^4 = 16 possible orders; a gap of 1.2 or more (either
   direction) in 2 of them → p = 0.125 → "likely" (with 4 pairs nothing can do better than 2 in 16, see the caveat).
   Capsules 52 of 56 = 93 %. Guesses right 4 of 8 (chance level) → the blind held.
   Secondary (Magnesium − placebo): brain fog −0.5, pain −0.1, sleep +0.4, mood +0.1. */
SCREENS.push({ id:"trials/result", area:"Insights", status:"idea", title:"Trial · result (after week 8)",
  tabs:"idea", tab:"Insights",
  why:"Unblinded after week 8. The finding first, in one sentence with its size; then the two kinds of weeks side by side (one dot per week, the week's average), how sure, and the honest limit. Below: did you take the capsules, did the blind hold, what the other scores did. Numbers and method behind Details.",
  concept:[
    "<b>Week averages, not days:</b> days inside one week are not independent, so each week counts once (one dot). Tap a dot for its week.",
    "<b>Effect size first,</b> 'how sure' second: 1.2 lower, lower in all 4 pairs, the quiet word 'likely'.",
    "<b>Honest about 8 weeks:</b> only clear effects can show; with 4 pairs, even 'lower in every pair' could happen by chance about 1 in 8 times. 'No difference' would not mean 'no effect'.",
    "<b>Checks before conclusions:</b> capsules taken (93 %) and the blind (guesses at chance level). If guesses had been mostly right, this would say the blind failed.",
    "<b>Secondary scores</b> one line each, read as hints only.",
    "<b>Wording:</b> 'was lower in Magnesium weeks', never 'works' or 'causes'. One person, not general evidence.",
    "<b>Pin to Insights</b> keeps the finding on the tab (insights/home-trial-pinned); <b>Run it again</b> opens the same setup card with a new order.",
  ],
  w:[
    {t:"shead", left:"‹", l:"", right:"", goLeft:"back"},
    {t:"pattern", big:true, l:"Your fatigue was 1.2 lower in Magnesium weeks.", conf:"likely", n:"Lower in all 4 pairs of weeks."},
    {t:"compare", l:"Fatigue", n:"week averages, days 3 to 7", tap:"Tap a week",
      a:{l:"Magnesium weeks", v:[5.6,4.6,5.4,4.8], d:["Week 2","Week 3","Week 5","Week 8"]},
      b:{l:"Placebo weeks", v:[6.6,5.8,6.8,6.0], d:["Week 1","Week 4","Week 6","Week 7"]}},
    {t:"note", l:"With 8 weeks only clear effects show. A smaller one could still be there. This is your result, not general evidence."},
    {t:"list", rows:[["Capsules taken","93 %"],["Your guesses","4 of 8 right"]]},
    {t:"note", l:"Half right is what chance gives: the blind held."},
    {t:"sec", l:"Other scores", r:"in Magnesium weeks"},
    {t:"list", rows:[["Brain fog","0.5 lower"],["Sleep","0.4 higher"],["Pain","about the same"],["Mood","about the same"]]},
    {t:"note", l:"Not chosen before the start, so read them as hints."},
    {t:"more", l:"Details", act:"Run it again", goAct:"trials/review",
      rows:[["Magnesium weeks","2, 3, 5, 8"],["Placebo weeks","1, 4, 6, 7"],["Average, Magnesium","5.1"],["Average, placebo","6.3"],["Difference","−1.2"],["Per pair","−1.0, −1.2, −1.4, −1.2"],["Capsules","52 of 56"]],
      n:"Method: fatigue averaged over days 3 to 7 of each week, Magnesium weeks compared with placebo weeks. Swapping A and B inside each pair gives 16 possible orders; a gap this large came up in 2 of them."},
    {t:"btn", l:"Pin to Insights", go:"insights/home-trial-pinned"},
  ]});
