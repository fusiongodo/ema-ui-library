/* The exertion pattern, opened from the first card on insights/home-health-on. DEMO NUMBERS for presentations, consistent
   within the Apple Health screens (screens/health/*), 14 Sep … today Tue 3 Nov (51 days, the 8 weeks of the Insights screens):
   Days above your usual (steps higher than the middle half of the four weeks before): 7, on Thu 17 Sep, Thu 24 Sep,
   Fri 2 Oct, Fri 9 Oct, Sun 18 Oct, Sat 24 Oct, Fri 30 Oct (the last four in the Steps chart, health/steps).
   The two days after each (14 days) vs. the other 30 days (today and the event days themselves left out):
     In your check-ins   Fatigue 7.2 vs. 5.9 → 1.3 higher (likely) · Brain fog 4.6 vs. 4.0 → 0.6 higher (hint)
     From your tracker   Steps 300 vs. 460 a day → 160 fewer (likely) · Resting heart rate 65 vs. 61 bpm → 4 bpm higher
                         (hint) · Heart rate variability 36 vs. 42 ms → 6 ms lower (hint)
   Both groups are worse: the heads name the source instead of Better / Worse (the ring glyph of "worse" stays). */
SCREENS.push({ id:"insights/pattern-exertion", area:"Insights", status:"idea", title:"Pattern · more active, then worse",
  tabs:"idea", tab:"Insights", tabto:HEALTH_TABTO,
  why:"One model, all data: the two days after a day above the usual were worse in the check-ins and in the tracker, so both stand on one page. The strip shows when those days were; Details hold the numbers and the method.",
  concept:[
    "<b>One model, all data:</b> the crash shows in the scores and in the tracker, so both stand on one page.",
    "<b>Heads name the source</b> ('In your check-ins', 'From your tracker'); both groups are worse, so both keep the ring glyph of 'worse'.",
    "<b>Exertion here is steps;</b> later it could also come from a check-in question or from the spoken log (BACKLOG).",
    "<b>Wording</b> 'goes along with', never 'causes'; being more active may also follow a good day.",
  ],
  w:[
    {t:"shead", left:"‹", l:"", right:"", goLeft:"back"},
    {t:"pattern", big:true, l:"In the two days after a day with more steps than your usual, you were worse: in your check-ins and in your tracker data.", conf:"likely", n:"Seen 7 times since 14 Sep"},
    {t:"diffs", l:"Two days after such a day", n:"vs. all other days of the last 8 weeks", foot:"Check-in scores run from 0 to 10.",
      strip:{from:"2026-09-14", n:51, marks:["2026-09-17","2026-09-24","2026-10-02","2026-10-09","2026-10-18","2026-10-24","2026-10-30"], after:2, key:["day above your usual","two days after"]},
      groups:[
        {l:"In your check-ins", worse:true, rows:[
          ["Fatigue","1.3","higher","up","checkins","likely"],
          ["Brain fog","0.6","higher","up","checkins","hint"]]},
        {l:"From your tracker", worse:true, rows:[
          ["Steps","160","fewer a day","down","health","likely"],
          ["Resting heart rate","4 bpm","higher","up","health","hint"],
          ["Heart rate variability","6 ms","lower","down","health","hint"]]}]},
    {t:"note", l:"Seen 7 times. This goes along with the active days; it is not proof that they caused it."},
    {t:"more", l:"Details",
      rows:[["Days above your usual","7"],["Days after","14"],["Other days","30"],["Fatigue","7.2 vs. 5.9"],["Brain fog","4.6 vs. 4.0"],["Steps a day","300 vs. 460"],["Resting heart rate","65 vs. 61 bpm"],["Heart rate variability","36 vs. 42 ms"]],
      n:"Method: a day counts as above your usual when its steps are higher than the middle half of the four weeks before it. The two days after each such day are compared with all other days of the last 8 weeks. One model looks at everything you track: scores from your check-ins; steps, heart rate and heart rate variability from Apple Health."},
  ]});
