/* Result after day 63, opened Mon 11 Jan. DEMO NUMBERS, consistent across the trial screens:
   Plan (TRIAL_PLAN, trials/intro): 7 blocks of 7 days, each with 2 washout days before it (63 days), 3 Magnesium and
   4 placebo blocks, the sequence shifted by 3 days so the last block is split between start and end. Blocks:
     Magnesium  1–3 + 60–63 (split; its washout 58–59) · 24–30 · 42–48
     Placebo    6–12 · 15–21 · 33–39 · 51–57
     Washout    4–5 · 13–14 · 22–23 · 31–32 · 40–41 · 49–50 · 58–59 (before every block, switch or not)
   → 21 Magnesium days and 28 placebo days counted, 14 washout days not. Capsules: 27 Magnesium, 36 placebo.
   Primary outcome (chosen in trials/measure): the composite of Fatigue, Pain, Brain fog = one symptom score per day, their
   average (all three: higher = worse, so nothing needed turning around). Averages of the 7 days per block:
     Symptom score  Magnesium: 4.3 · 3.8 · 4.2 → 4.1      Placebo: 4.9 · 4.4 · 4.8 · 4.7 → 4.7      Difference −0.6.
   Every Magnesium block is lower than every placebo block (highest Magnesium 4.3 < lowest placebo 4.4).
   Each score (Magnesium vs. placebo, averages over the counted days):
     Fatigue 5.1 vs. 6.3 → 1.2 lower · Brain fog 3.9 vs. 4.4 → 0.5 lower · Pain 3.4 vs. 3.5 → 0.1, about the same.
     (The composite difference is their mean: (−1.2 − 0.5 − 0.1) / 3 = −0.6.)
   Test: with 3 Magnesium and 4 placebo blocks the app could have drawn 35 orders (C(7, 3)); it compares the gap under each.
   Only the drawn order puts all three Magnesium blocks lowest, so a gap this large in the direction fixed before the start
   (lower on Magnesium) comes up in 1 of 35 → "likely", the most 7 blocks can give (trials/length; "likely" from about once
   in 20 as for the patterns, insights/eval-rapamycin; "strong" would need about 1 in 100).
   Each score on its own is held to a stricter bar, because three are looked at side by side (about three times rarer, so
   'likely' would need about 1 in 60, which 35 orders cannot give): fatigue and brain fog are lower in every Magnesium block,
   1 in 35 each → "hint"; pain (about 1 in 3) → no word.
   Capsules 59 of 63 = 94 % (18 of the first 19, 3 more missed later). The guess before the reveal (trials/guess):
   "No idea" → the blind held. */
SCREENS.push({ id:"trials/result", area:"Insights", status:"idea", title:"Trial · result (after day 63)",
  tabs:"idea", tab:"Insights",
  why:"Unblinded after day 63. The composite leads, in one sentence with its size; directly under it all three scores as equals, each with its difference; then the two kinds of blocks side by side for the composite (one dot per block), how sure, and the honest limit. Then the reveal: where the real blocks actually were, washout days faint. Below: did you take the capsules, could you tell (the guess asked just before). Numbers and method behind Details.",
  concept:[
    "<b>The way the person chose leads:</b> the composite score was fixed as the primary outcome, so its sentence comes first: 'Your symptom score was 0.6 lower on Magnesium days.'",
    "<b>All three scores as equals, right under it:</b> one card in the quality of the Rapamycin evaluation (diffs), one row each with its size and its quiet word: Fatigue 1.2 lower, Brain fog 0.5 lower, Pain about the same (0.1). No 'also tracked', no 'read as hints': pain matters as much as fatigue for a functioning life.",
    "<b>How sure, honestly per row:</b> judged side by side, each score had to clear a stricter bar than the composite; with 7 blocks a single score reaches 'hint' at most, so fatigue and brain fog are a 'hint', pain gets no word. Details say why in one sentence.",
    "<b>Days in the sentence, blocks in the chart:</b> 'lower on Magnesium days'. Days inside one block are not independent, so each block counts once (one dot). Tap a dot for its days.",
    "<b>The reveal:</b> only now the strip of all 63 days shows where the app put the real blocks: faint on the 2 washout days before every block, and the Magnesium block split between days 1–3 and 60–63, the drawn start. During the trial this was hidden on purpose.",
    "<b>Honest about the design:</b> with 7 blocks 'likely' is as far as it can go (1 in 35 orders at best); a smaller effect could still be there. 'No difference' would not mean 'no effect'.",
    "<b>Checks before conclusions:</b> capsules taken (94 %) and the guess asked once, just before the reveal ('No idea': the blind held).",
    "<b>Telling is not failing:</b> had the person said 'Yes, most of the time', the card would not call the trial broken: being able to tell can mean the blind slipped, or that Magnesium did something noticeable. Details say both readings in one sentence.",
    "<b>Wording:</b> 'was lower on Magnesium days', never 'works' or 'causes'. One person, not general evidence.",
    "<b>Pin to Insights</b> keeps the finding on the tab (insights/home-trial-pinned); <b>Run it again</b> opens the same setup card; the app draws new blocks.",
  ],
  w:[
    {t:"shead", left:"‹", l:"", right:"", goLeft:"back"},
    {t:"pattern", big:true, l:"Your symptom score was 0.6 lower on Magnesium days.", conf:"likely", n:"Fatigue, Pain and Brain fog together · lower in every Magnesium block"},
    {t:"diffs", l:"Each score", n:"on Magnesium days vs. placebo days",
      groups:[{rows:[
        ["Fatigue","1.2","lower","down","checkins","hint"],
        ["Brain fog","0.5","lower","down","checkins","hint"],
        ["Pain","0.1","about the same","same","checkins",""]]}]},
    {t:"compare", l:"Symptom score", n:"primary outcome · one dot per block", tap:"Tap a block",
      a:{l:"Magnesium blocks", v:[4.3,3.8,4.2], d:["Days 1–3 + 60–63","Days 24–30","Days 42–48"]},
      b:{l:"Placebo blocks", v:[4.9,4.4,4.8,4.7], d:["Days 6–12","Days 15–21","Days 33–39","Days 51–57"]}},
    {t:"note", l:"With 7 blocks, ‘likely’ is as far as this design can go. A smaller effect could still be there. This is your result, not general evidence."},
    {t:"sec", l:"Where the blocks were", r:"now revealed"},
    {t:"daystrip", plan:TRIAL_PLAN, key:["Magnesium","Placebo","washout"],
      l:"The app placed them; you took number after number without knowing."},
    {t:"list", rows:[["Capsules taken","94 %"],["Could you tell?","No idea"]]},
    {t:"note", l:"You could not tell which days were Magnesium: the blind held."},
    {t:"more", l:"Details", act:"Run it again", goAct:"trials/review",
      rows:[["Magnesium","days 1\u2060–\u20603 + 60\u2060–\u206063, 24\u2060–\u206030, 42\u2060–\u206048"],["Placebo","days 6\u2060–\u206012, 15\u2060–\u206021, 33\u2060–\u206039, 51\u2060–\u206057"],
        ["Washout","2 days before each block"],
        ["Days counted","21 Magnesium · 28 placebo"],["Symptom score","4.1 vs. 4.7"],["Fatigue","5.1 vs. 6.3"],["Brain fog","3.9 vs. 4.4"],["Pain","3.4 vs. 3.5"],["Capsules","59 of 63"],["Your guess","No idea"]],
      n:"Method: the symptom score is the average of fatigue, pain and brain fog for each day (higher always means worse); averaged per block over its 7 days (the 2 washout days before each block left out), Magnesium blocks compared with placebo blocks. The app could have drawn 35 orders of 3 Magnesium and 4 placebo blocks; only the one it drew puts every Magnesium block below every placebo block, so a gap this large came up in 1 of 35, as far as 7 blocks can go. Each score on its own had to clear a stricter bar, because three were looked at side by side, and 35 orders allow no more than a hint: fatigue and brain fog reached it, pain not. Telling the days apart can mean the blind slipped or that the substance did something you noticed; you could not, so neither applies here."},
    {t:"btn", l:"Pin to Insights", go:"insights/home-trial-pinned"},
  ]});
