/* The Rapamycin evaluation, opened from the third pattern card. DEMO NUMBERS for presentations (not derived from the score
   series on protocols/item-rapamycin): Rapamycin taken 5 times, Sat 19 Sep, Tue 29 Sep, Tue 6 Oct, Fri 16 Oct, Sun 25 Oct
   (as in its calendar). The two days after each dose (10 days) vs. the other 41 days of the last 8 weeks:
     Better  Pain 3.4 vs. 4.2 → 0.8 lower (check-in, likely) · Brain fog 3.6 vs. 4.2 → 0.6 lower (check-in, hint)
             Steps 570 vs. 460 a day → +110 (Apple Health, hint)
     Worse   Sleep 6 h 50 vs. 7 h 25 → 35 min shorter (Apple Health, likely) · Sleep quality 5.1 vs. 5.8 → 0.7 lower
             (check-in, hint) · Recovery slightly lower (Apple Health, hint)
   Shuffle test: pain and sleep a gap this large about once in 20 times (likely), the others more often (hint). */
SCREENS.push({ id:"insights/eval-rapamycin", area:"Insights", status:"idea", title:"Evaluation · Rapamycin",
  tabs:"idea", tab:"Insights",
  why:"Not one finding but an overview: everything that was different in the two days after a Rapamycin dose. The sentence on top sums it up; the card shows when those days were, then what was better and what was worse, one calm row each with its size, where the number comes from and how sure it is.",
  concept:[
    "<b>Evaluation, not a single pattern:</b> an as-needed protocol is looked at as a whole: every check-in score and the Apple Health measures, the two days after a dose vs. all other days. Only what differs is listed.",
    "<b>The strip</b> shows the 8 weeks as dots: a ring on each dose, the two days after filled. It explains 'the two days after' without a sentence.",
    "<b>Better and worse at a glance,</b> not by colour alone: own heads, a filled circle vs. a ring around the arrow, and the word ('lower', 'shorter'). The arrow says which way the measure went; better is not always down (steps went up).",
    "<b>Source per row:</b> a small label, 'Check-in' (mint, PRINCIPLES 9) or 'Apple Health' (neutral grey). This is the first place where Health data appears in Insights.",
    "<b>How sure, per row:</b> the same quiet word as on the pattern cards. With 5 doses most are 'hint'.",
    "<b>Honest line</b> under the card; Details and Run a trial as on the pattern screen."
  ],
  w:[
    {t:"shead", left:"‹", l:"", right:"", goLeft:"back"},
    {t:"pattern", big:true, l:"In the two days after Rapamycin: less pain and brain fog, but worse sleep.", n:"5 doses since 19 Sep"},
    {t:"diffs", l:"Two days after a dose", n:"vs. all other days of the last 8 weeks", foot:"Check-in scores run from 0 to 10.",
      strip:{from:"2026-09-14", n:51, marks:["2026-09-19","2026-09-29","2026-10-06","2026-10-16","2026-10-25"], after:2, key:["dose","two days after"]},
      groups:[
        {l:"Better", rows:[
          ["Pain","0.8","lower","down","checkins","likely"],
          ["Brain fog","0.6","lower","down","checkins","hint"],
          ["Steps","+110","a day","up","health","hint"]]},
        {l:"Worse", worse:true, rows:[
          ["Sleep","35 min","shorter","down","health","likely"],
          ["Sleep quality","0.7","lower","down","checkins","hint"],
          ["Recovery","slightly","lower","down","health","hint"]]}]},
    {t:"note", l:"Seen 5 times. This goes along with Rapamycin; it is not proof that Rapamycin caused it."},
    {t:"more", l:"Details", act:"Run a trial", goAct:"trials/intro",
      rows:[["Doses","5"],["Days after a dose","10"],["Other days","41"],["Pain","3.4 vs. 4.2"],["Brain fog","3.6 vs. 4.2"],["Steps a day","570 vs. 460"],["Sleep","6 h 50 vs. 7 h 25"],["Sleep quality","5.1 vs. 5.8"]],
      n:"Method: each measure on the two days after every dose, compared with all other days of the last 8 weeks; scores from your check-ins, sleep, recovery and steps from Apple Health. Shuffling the days at random gives a gap as large as for pain or sleep about once in 20 times; for the others more often."},
  ]});
