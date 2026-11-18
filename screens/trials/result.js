/* Result after day 56, opened Mon 4 Jan. DEMO NUMBERS, consistent across the trial screens:
   Plan (TRIAL_PLAN, trials/intro): placebo 1–3, Magnesium 4–11, placebo 12–17, Magnesium 18–24, placebo 25–33,
   Magnesium 34–39, placebo 40–46, Magnesium 47–53, placebo 54–56 → 28 days each, 4 Magnesium and 5 placebo blocks.
   Washout: the first 2 days of every block (the design: 2 days after each switch, also at the start) →
   20 Magnesium days and 18 placebo days counted.
   Primary outcome (chosen in trials/measure): the composite of Fatigue, Pain, Brain fog = one symptom score per day, their
   average (all three: higher = worse, so nothing needed turning around). Averages of the counted days per block:
     Symptom score  Magnesium: 4.3 · 3.8 · 4.3 · 4.1 → 4.1      Placebo: 4.9 · 4.4 · 5.0 · 4.5 · 4.9 → 4.7      Difference −0.6.
   Every Magnesium block is lower than every placebo block.
   Each score (Magnesium vs. placebo, averages over the counted days):
     Fatigue 5.1 vs. 6.3 → 1.2 lower · Brain fog 3.9 vs. 4.4 → 0.5 lower · Pain 3.4 vs. 3.5 → 0.1, about the same.
     (The composite difference is their mean: (−1.2 − 0.5 − 0.1) / 3 = −0.6.)
   Test: the app re-draws the blocks 10,000 times the way it drew them for this trial; a composite gap of 0.6 or more (either
   direction) came up in about 1 in 12 → "likely" (with about 8 blocks nothing can do better, see the design step).
   Each score on its own is held to a stricter bar, because three are looked at side by side: fatigue (about 1 in 40) clears
   it → "likely"; brain fog (about 1 in 6) only → "hint"; pain → no word.
   Capsules 52 of 56 = 93 %. The guess before the reveal (trials/guess): "No idea" → the blind held. */
SCREENS.push({ id:"trials/result", area:"Insights", status:"idea", title:"Trial · result (after day 56)",
  tabs:"idea", tab:"Insights",
  why:"Unblinded after day 56. The composite leads, in one sentence with its size; directly under it all three scores as equals, each with its difference; then the two kinds of blocks side by side for the composite (one dot per block), how sure, and the honest limit. Then the reveal: where the real blocks actually were, washout days faint. Below: did you take the capsules, could you tell (the guess asked just before). Numbers and method behind Details.",
  concept:[
    "<b>The way the person chose leads:</b> the composite score was fixed as the primary outcome, so its sentence comes first: 'Your symptom score was 0.6 lower on Magnesium days.'",
    "<b>All three scores as equals, right under it:</b> one card in the quality of the Rapamycin evaluation (diffs), one row each with its size and its quiet word: Fatigue 1.2 lower, Brain fog 0.5 lower, Pain about the same (0.1). No 'also tracked', no 'read as hints': pain matters as much as fatigue for a functioning life.",
    "<b>How sure, honestly per row:</b> judged side by side, each score had to clear a stricter bar than the composite; fatigue did ('likely'), brain fog only as 'hint', pain not. Details say why in one sentence.",
    "<b>Days in the sentence, blocks in the chart:</b> 'lower on Magnesium days'. Days inside one block are not independent, so each block counts once (one dot). Tap a dot for its days.",
    "<b>The reveal:</b> only now the strip of all 56 days shows where the app put the real blocks, faint on the washout days after each switch. During the trial this was hidden on purpose.",
    "<b>Honest about the design:</b> with about 8 blocks 'likely' is as far as it can go; a smaller effect could still be there. 'No difference' would not mean 'no effect'.",
    "<b>Checks before conclusions:</b> capsules taken (93 %) and the guess asked once, just before the reveal ('No idea': the blind held).",
    "<b>Telling is not failing:</b> had the person said 'Yes, most of the time', the card would not call the trial broken: being able to tell can mean the blind slipped, or that Magnesium did something noticeable. Details say both readings in one sentence.",
    "<b>Wording:</b> 'was lower on Magnesium days', never 'works' or 'causes'. One person, not general evidence.",
    "<b>Pin to Insights</b> keeps the finding on the tab (insights/home-trial-pinned); <b>Run it again</b> opens the same setup card; the app draws new blocks.",
  ],
  w:[
    {t:"shead", left:"‹", l:"", right:"", goLeft:"back"},
    {t:"pattern", big:true, l:"Your symptom score was 0.6 lower on Magnesium days.", conf:"likely", n:"Fatigue, Pain and Brain fog together · lower in every Magnesium block"},
    {t:"diffs", l:"Each score", n:"on Magnesium days vs. placebo days",
      groups:[{rows:[
        ["Fatigue","1.2","lower","down","checkins","likely"],
        ["Brain fog","0.5","lower","down","checkins","hint"],
        ["Pain","0.1","about the same","same","checkins",""]]}]},
    {t:"compare", l:"Symptom score", n:"primary outcome · one dot per block", tap:"Tap a block",
      a:{l:"Magnesium blocks", v:[4.3,3.8,4.3,4.1], d:["Days 4–11","Days 18–24","Days 34–39","Days 47–53"]},
      b:{l:"Placebo blocks", v:[4.9,4.4,5.0,4.5,4.9], d:["Days 1–3","Days 12–17","Days 25–33","Days 40–46","Days 54–56"]}},
    {t:"note", l:"With about 8 blocks, ‘likely’ is as far as this design can go. A smaller effect could still be there. This is your result, not general evidence."},
    {t:"sec", l:"Where the blocks were", r:"now revealed"},
    {t:"daystrip", plan:TRIAL_PLAN, skip:2, key:["Magnesium","Placebo","washout"],
      l:"The app placed them; you took number after number without knowing."},
    {t:"list", rows:[["Capsules taken","93 %"],["Could you tell?","No idea"]]},
    {t:"note", l:"You could not tell which days were Magnesium: the blind held."},
    {t:"more", l:"Details", act:"Run it again", goAct:"trials/review",
      rows:[["Magnesium","days 4⁠–⁠11, 18⁠–⁠24, 34⁠–⁠39, 47⁠–⁠53"],["Placebo","days 1⁠–⁠3, 12⁠–⁠17, 25⁠–⁠33, 40⁠–⁠46, 54⁠–⁠56"],["Days counted","20 Magnesium · 18 placebo"],["Symptom score","4.1 vs. 4.7"],["Fatigue","5.1 vs. 6.3"],["Brain fog","3.9 vs. 4.4"],["Pain","3.4 vs. 3.5"],["Capsules","52 of 56"],["Your guess","No idea"]],
      n:"Method: the symptom score is the average of fatigue, pain and brain fog for each day (higher always means worse); averaged per block over the days counted (washout: the first 2 days after each switch), Magnesium blocks compared with placebo blocks. The app re-drew the blocks 10,000 times the way it drew them for you; a gap this large came up in about 1 in 12. Each score on its own had to clear a stricter bar, because three were looked at side by side: fatigue did, brain fog only as a hint, pain not. Telling the days apart can mean the blind slipped or that the substance did something you noticed; you could not, so neither applies here."},
    {t:"btn", l:"Pin to Insights", go:"insights/home-trial-pinned"},
  ]});
