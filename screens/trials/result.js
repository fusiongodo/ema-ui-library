/* Result after day 56, opened Mon 4 Jan. DEMO NUMBERS, consistent across the trial screens:
   Plan (TRIAL_PLAN, trials/intro): placebo 1–3, Magnesium 4–11, placebo 12–17, Magnesium 18–24, placebo 25–33,
   Magnesium 34–39, placebo 40–46, Magnesium 47–53, placebo 54–56 → 28 days each, 4 Magnesium and 5 placebo blocks.
   The first 2 days of every block are left out (the design: 2 days after each switch, also at the start) →
   20 Magnesium days and 18 placebo days counted.
   Fatigue, averages of the counted days per block:
     Magnesium: 5.6 · 4.6 · 5.4 · 4.8 → 5.1      Placebo: 6.4 · 5.8 · 6.8 · 6.0 · 6.5 → 6.3      Difference −1.2.
   Every Magnesium block is lower than every placebo block.
   Test: the app re-draws the blocks 10,000 times the way it drew them for this trial; a gap of 1.2 or more (either
   direction) came up in about 1 in 10 → "likely" (with about 8 blocks nothing can do better, see the design step).
   Capsules 52 of 56 = 93 %. The guess before the reveal (trials/guess): "No idea" → the blind held.
   Also tracked (chosen before the start, reported next to the main outcome; Magnesium − placebo): brain fog −0.5, pain −0.1. */
SCREENS.push({ id:"trials/result", area:"Insights", status:"idea", title:"Trial · result (after day 56)",
  tabs:"idea", tab:"Insights",
  why:"Unblinded after day 56. The finding first, in one sentence with its size; then the two kinds of blocks side by side (one dot per block), how sure, and the honest limit. Then the reveal: where the real blocks actually were. Below: did you take the capsules, could you tell (the guess asked just before), what the other scores did. Numbers and method behind Details.",
  concept:[
    "<b>Days in the sentence, blocks in the chart:</b> 'lower on Magnesium days'. Days inside one block are not independent, so each block counts once (one dot). Tap a dot for its days.",
    "<b>Effect size first,</b> 'how sure' second: 1.2 lower, lower in every Magnesium block, the quiet word 'likely'.",
    "<b>The reveal:</b> only now the strip of all 56 days shows where the app put the real blocks, faint where days were left out after a switch. During the trial this was hidden on purpose.",
    "<b>Honest about the design:</b> with about 8 blocks 'likely' is as far as it can go; a smaller effect could still be there. 'No difference' would not mean 'no effect'.",
    "<b>Checks before conclusions:</b> capsules taken (93 %) and the guess asked once, just before the reveal ('No idea': the blind held).",
    "<b>Telling is not failing:</b> had the person said 'Yes, most of the time', the card would not call the trial broken: being able to tell can mean the blind slipped, or that Magnesium did something noticeable. Details say both readings in one sentence.",
    "<b>Also tracked:</b> the scores chosen next to the main outcome (pain, brain fog), one line each, read as hints only.",
    "<b>Wording:</b> 'was lower on Magnesium days', never 'works' or 'causes'. One person, not general evidence.",
    "<b>Pin to Insights</b> keeps the finding on the tab (insights/home-trial-pinned); <b>Run it again</b> opens the same setup card; the app draws new blocks.",
  ],
  w:[
    {t:"shead", left:"‹", l:"", right:"", goLeft:"back"},
    {t:"pattern", big:true, l:"Your fatigue was 1.2 lower on Magnesium days.", conf:"likely", n:"Lower in every Magnesium block."},
    {t:"compare", l:"Fatigue", n:"main outcome · one dot per block", tap:"Tap a block",
      a:{l:"Magnesium blocks", v:[5.6,4.6,5.4,4.8], d:["Days 4–11","Days 18–24","Days 34–39","Days 47–53"]},
      b:{l:"Placebo blocks", v:[6.4,5.8,6.8,6.0,6.5], d:["Days 1–3","Days 12–17","Days 25–33","Days 40–46","Days 54–56"]}},
    {t:"note", l:"With about 8 blocks, ‘likely’ is as far as this design can go. A smaller effect could still be there. This is your result, not general evidence."},
    {t:"sec", l:"Where the blocks were", r:"now revealed"},
    {t:"daystrip", plan:TRIAL_PLAN, skip:2, key:["Magnesium","Placebo","left out"],
      l:"The app placed them; you took number after number without knowing."},
    {t:"list", rows:[["Capsules taken","93 %"],["Could you tell?","No idea"]]},
    {t:"note", l:"You could not tell which days were Magnesium: the blind held."},
    {t:"sec", l:"Also tracked", r:"on Magnesium days"},
    {t:"list", rows:[["Brain fog","0.5 lower"],["Pain","about the same"]]},
    {t:"note", l:"They did not decide the result, so read them as hints."},
    {t:"more", l:"Details", act:"Run it again", goAct:"trials/review",
      rows:[["Magnesium","days 4⁠–⁠11, 18⁠–⁠24, 34⁠–⁠39, 47⁠–⁠53"],["Placebo","days 1⁠–⁠3, 12⁠–⁠17, 25⁠–⁠33, 40⁠–⁠46, 54⁠–⁠56"],["Days counted","20 Magnesium · 18 placebo"],["Average, Magnesium","5.1"],["Average, placebo","6.3"],["Difference","−1.2"],["Capsules","52 of 56"],["Your guess","No idea"]],
      n:"Method: fatigue averaged per block over the days counted (the first 2 days after each switch left out), Magnesium blocks compared with placebo blocks. The app re-drew the blocks 10,000 times the way it drew them for you; a gap this large came up in about 1 in 10. Telling the days apart can mean the blind slipped or that the substance did something you noticed; you could not, so neither applies here."},
    {t:"btn", l:"Pin to Insights", go:"insights/home-trial-pinned"},
  ]});
